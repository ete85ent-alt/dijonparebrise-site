<?php
/**
 * Dijon Pare-Brise – Demande de devis ou de rappel : envoyée par e-mail à l'artisan par l'hébergement, photos en pièces jointes.
 * Rien n'est conservé sur le site (voir la page Confidentialité).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/* ───────── Réglages (à compléter avant la mise en ligne) ───────── */
const DESTINATAIRE     = '[E-mail de Dijon Pare-Brise]';
const EXPEDITEUR       = '[Adresse d’envoi du site, ex. site@dijon-pare-brise.fr]';
const SITES_AUTORISES  = ['https://www.dijon-pare-brise.fr', 'https://dijon-pare-brise.fr', 'http://localhost:5173'];
const MAX_PAR_JOUR     = 40;                // protection contre les envois massifs
const MAX_PAR_ADRESSE  = 5;                 // par adresse IP et par jour : un robot seul ne bloque pas le formulaire pour tout le monde
const PHOTOS_MAX       = 3;
const TAILLE_PHOTO_MAX = 4 * 1024 * 1024;   // 4 Mo (les photos sont réduites dans le navigateur avant l'envoi)

function repondre(int $code, array $donnees): void
{
    http_response_code($code);
    echo json_encode($donnees, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Texte d'un champ : sans caractères de contrôle, longueur limitée ($multiligne : garde les retours à la ligne). */
function champ(string $nom, int $max, bool $multiligne = false): string
{
    $v = $_POST[$nom] ?? '';
    if (!is_string($v)) {
        return '';
    }
    $v = str_replace("\r\n", "\n", $v);
    $v = (string) preg_replace($multiligne ? '/[^\P{C}\n]/u' : '/\p{C}/u', ' ', $v);
    return trim(mb_substr($v, 0, $max));
}

/* ───────── 1. Contrôles ───────── */
if (str_starts_with(DESTINATAIRE, '[')) {
    repondre(503, ['erreur' => 'Formulaire pas encore configuré']);
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    repondre(405, ['erreur' => 'Méthode non autorisée']);
}
if (!in_array($_SERVER['HTTP_ORIGIN'] ?? '', SITES_AUTORISES, true)) {
    repondre(403, ['erreur' => 'Origine non autorisée']);
}
if (champ('site_web', 200) !== '') {
    repondre(200, ['ok' => true]);   // piège à robots
}

$type = champ('type', 10) === 'rappel' ? 'rappel' : 'devis';
$d = [
    'nom'             => champ('nom', 100),
    'telephone'       => champ('telephone', 30),
    'email'           => champ('email', 150),
    'degat'           => champ('degat', 30),
    'lieu'            => champ('lieu', 30),
    'immatriculation' => mb_strtoupper(champ('immatriculation', 15)),
    'code_postal'     => champ('code_postal', 5),
    'creneau'         => champ('creneau', 40),
    'message'         => champ('message', 3000, true),
];
if ($d['nom'] === '' || $d['telephone'] === '') {
    repondre(400, ['erreur' => 'Nom et téléphone sont obligatoires']);
}
if ($type === 'devis' && !preg_match('/^\d{5}$/', $d['code_postal'])) {
    repondre(400, ['erreur' => 'Code postal invalide']);
}
if ($d['email'] !== '' && !filter_var($d['email'], FILTER_VALIDATE_EMAIL)) {
    $d['email'] = '';
}
if (($_POST['consentement'] ?? '') === '') {
    repondre(400, ['erreur' => 'Le consentement est obligatoire']);
}

/* ───────── 2. Limites quotidiennes (hors du dossier public) ───────── */
$dossier = dirname(__DIR__, 2) . '/dpb-data';
if (!is_dir($dossier)) {
    @mkdir($dossier, 0700, true);
}

/** Ajoute 1 au compteur du fichier ; répond 429 si la limite est déjà atteinte. */
function compter(string $fichier, int $limite): void
{
    $f = @fopen($fichier, 'c+');
    if ($f === false) {
        return;
    }
    flock($f, LOCK_EX);
    $n = (int) stream_get_contents($f);
    if ($n >= $limite) {
        flock($f, LOCK_UN);
        fclose($f);
        repondre(429, ['erreur' => 'Trop de demandes aujourd’hui, appelez-nous']);
    }
    ftruncate($f, 0);
    rewind($f);
    fwrite($f, (string) ($n + 1));
    flock($f, LOCK_UN);
    fclose($f);
}

$jour = date('Y-m-d');
// L'adresse IP n'est jamais écrite en clair : seulement une empreinte, qui change chaque jour, effacée le lendemain
$empreinte = substr(hash('sha256', $jour . '|' . ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . __FILE__), 0, 16);
compter("$dossier/ip-$jour-$empreinte.txt", MAX_PAR_ADRESSE);
compter("$dossier/devis-$jour.txt", MAX_PAR_JOUR);
foreach (glob($dossier . '/*.txt') ?: [] as $ancien) {
    if (!str_contains(basename($ancien), $jour)) {
        @unlink($ancien);
    }
}

/* ───────── 3. Photos (JPEG, PNG ou WebP uniquement, vérifiées par leur contenu) ───────── */
$photos = [];
$envoyees = $_FILES['photos'] ?? null;
if (is_array($envoyees) && is_array($envoyees['tmp_name'] ?? null)) {
    foreach ($envoyees['tmp_name'] as $i => $tmp) {
        if (count($photos) >= PHOTOS_MAX || ($envoyees['error'][$i] ?? 1) !== UPLOAD_ERR_OK || !is_uploaded_file($tmp)) {
            continue;
        }
        if (($envoyees['size'][$i] ?? 0) > TAILLE_PHOTO_MAX) {
            continue;
        }
        $type = (string) (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
        $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$type] ?? null;
        if ($ext !== null) {
            $photos[] = ['nom' => 'photo-' . (count($photos) + 1) . '.' . $ext, 'type' => $type, 'contenu' => (string) file_get_contents($tmp)];
        }
    }
}

/* ───────── 4. E-mail à l'artisan ───────── */
$lignes = $type === 'rappel'
    ? ['Demande de rappel depuis le site', '', 'Nom        : ' . $d['nom'], 'Téléphone  : ' . $d['telephone'], 'À rappeler : ' . ($d['creneau'] ?: 'Dès que possible')]
    : ['Nouvelle demande de devis depuis le site', '',
       'Nom             : ' . $d['nom'],
       'Téléphone       : ' . $d['telephone'],
       'E-mail          : ' . ($d['email'] ?: '—'),
       'Dégât           : ' . ($d['degat'] ?: '—'),
       'Lieu            : ' . ($d['lieu'] ?: '—'),
       'Immatriculation : ' . ($d['immatriculation'] ?: '—'),
       'Code postal     : ' . $d['code_postal'],
       'Photos          : ' . count($photos),
       '', 'Précisions :', str_replace("\n", "\r\n", $d['message'] ?: '—')];
$lignes[] = '';
$lignes[] = 'Date : ' . date('d/m/Y H:i');
$texte = implode("\r\n", $lignes);
$frontiere = 'dpb-' . bin2hex(random_bytes(8));
$corps = "--$frontiere\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n$texte\r\n";
foreach ($photos as $p) {
    $corps .= "--$frontiere\r\nContent-Type: {$p['type']}; name=\"{$p['nom']}\"\r\nContent-Transfer-Encoding: base64\r\n"
            . "Content-Disposition: attachment; filename=\"{$p['nom']}\"\r\n\r\n" . chunk_split(base64_encode($p['contenu'])) . "\r\n";
}
$corps .= "--$frontiere--";

$entetes = [
    'From'         => 'Site Dijon Pare-Brise <' . EXPEDITEUR . '>',
    'MIME-Version' => '1.0',
    'Content-Type' => 'multipart/mixed; boundary="' . $frontiere . '"',
];
if ($d['email'] !== '') {
    $entetes['Reply-To'] = $d['email'];   // validé par filter_var : aucun retour à la ligne possible
}
$objet = $type === 'rappel'
    ? 'Rappel – ' . $d['nom'] . ' – ' . ($d['creneau'] ?: 'Dès que possible')
    : 'Devis – ' . ($d['degat'] ?: 'Pare-brise') . ' – ' . $d['nom'] . ' (' . $d['code_postal'] . ')';
$ok = @mail(DESTINATAIRE, mb_encode_mimeheader($objet, 'UTF-8', 'B'), $corps, $entetes, '-f' . EXPEDITEUR);

$ok ? repondre(200, ['ok' => true]) : repondre(500, ['erreur' => 'Envoi impossible']);
