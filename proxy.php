<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST requests allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON body']);
    exit;
}

$endpoint = $input['endpoint'] ?? '';
$params = $input['params'] ?? [];
$method = strtoupper($input['method'] ?? 'POST');
$headers = $input['headers'] ?? [];

$allowedEndpoints = [
    'postservice'      => 'https://test.payu.in/merchant/postservice.php?form=2',
    'payment'          => 'https://test.payu.in/_payment',
    'otm_status'       => 'https://apitest.payu.in/v1/transaction/upi_otm_status_check',
    'response_handler' => 'https://test.payu.in/ResponseHandler.php',
];

if (!isset($allowedEndpoints[$endpoint])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid endpoint. Allowed: ' . implode(', ', array_keys($allowedEndpoints))]);
    exit;
}

$url = $allowedEndpoints[$endpoint];

if ($endpoint === 'otm_status' && !empty($params['payuId'])) {
    $url .= '?payuId=' . urlencode($params['payuId']);
    unset($params['payuId']);
}

$ch = curl_init();

// For OTM status, only send the HMAC headers (no extra Accept/Content-Type)
// For other endpoints, add Accept: application/json
if ($endpoint === 'otm_status') {
    $curlHeaders = [];
} else {
    $curlHeaders = ['Accept: application/json'];
}

foreach ($headers as $key => $value) {
    $curlHeaders[] = "$key: $value";
}

$multipartCommands = ['cancel_transaction', 'cancel_refund_transaction', 'capture_transaction'];
$useMultipart = isset($params['command']) && in_array($params['command'], $multipartCommands, true);

if ($method === 'GET') {
    if (!empty($params)) {
        $url .= (strpos($url, '?') !== false ? '&' : '?') . http_build_query($params);
    }
    curl_setopt($ch, CURLOPT_HTTPGET, true);
} else {
    curl_setopt($ch, CURLOPT_POST, true);
    if ($useMultipart) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    } else {
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
        $curlHeaders[] = 'Content-Type: application/x-www-form-urlencoded';
    }
}

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $curlHeaders);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(502);
    echo json_encode([
        'proxy_error' => true,
        'error' => 'Failed to reach PayU: ' . $error,
        'http_code' => $httpCode
    ]);
    exit;
}

$decoded = json_decode($response, true, 512, JSON_BIGINT_AS_STRING);

echo json_encode([
    'http_code' => $httpCode,
    'response' => $decoded !== null ? $decoded : $response,
    'raw_response' => $response
]);
