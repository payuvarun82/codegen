<?php
/**
 * Proxies Ask AI API requests.
 * The Ask AI backend only allows Origin: https://docs.payu.in from browsers,
 * so Integration Lab calls this same-origin proxy instead.
 */
error_reporting(0);
ini_set('display_errors', '0');
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(['error' => 'Only POST requests allowed']);
    exit;
}

$action = isset($_GET['action']) ? strtolower(trim($_GET['action'])) : '';
$allowed = [
    'ask' => 'https://askai-v2-api-710575177112.asia-south1.run.app/ask',
    'feedback' => 'https://askai-v2-api-710575177112.asia-south1.run.app/feedback',
];

if (!isset($allowed[$action])) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action. Allowed: ask, feedback']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!$body || !is_array($body)) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

if (!function_exists('curl_init')) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => 'cURL extension is not installed or enabled']);
    exit;
}

$ch = curl_init($allowed[$action]);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'Origin: https://docs.payu.in',
        'Referer: https://docs.payu.in/docs/introduction',
    ],
    CURLOPT_POSTFIELDS => json_encode($body),
    CURLOPT_TIMEOUT => 90,
    CURLOPT_CONNECTTIMEOUT => 15,
]);

$response = curl_exec($ch);
$errno = curl_errno($ch);
$error = curl_error($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

ob_end_clean();

if ($errno) {
    http_response_code(502);
    echo json_encode(['error' => 'Ask AI upstream failed', 'detail' => $error]);
    exit;
}

http_response_code($status > 0 ? $status : 502);
echo $response !== false ? $response : json_encode(['error' => 'Empty upstream response']);
