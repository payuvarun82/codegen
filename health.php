<?php
/**
 * Health Check Endpoint
 * 
 * Returns HTTP 200 with JSON when the application is healthy.
 * Returns HTTP 503 with error details if any critical check fails.
 * 
 * Usage: GET /health.php  or  GET /health (via rewrite)
 * Designed for Pingdom, Render health checks, and other uptime monitors.
 */

header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');

$checks = [];
$healthy = true;

// 1. PHP runtime check
$checks['php'] = [
    'status' => 'ok',
    'version' => PHP_VERSION
];

// 2. Required PHP extensions
$requiredExtensions = ['json', 'session', 'hash'];
$missingExtensions = [];
foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $missingExtensions[] = $ext;
    }
}
if (!empty($missingExtensions)) {
    $healthy = false;
    $checks['extensions'] = [
        'status' => 'error',
        'missing' => $missingExtensions
    ];
} else {
    $checks['extensions'] = [
        'status' => 'ok'
    ];
}

// 3. Critical files exist
$criticalFiles = ['index.php', 'js/app.js', 'css/styles.css', 'callback.php'];
$missingFiles = [];
foreach ($criticalFiles as $file) {
    if (!file_exists(__DIR__ . '/' . $file)) {
        $missingFiles[] = $file;
    }
}
if (!empty($missingFiles)) {
    $healthy = false;
    $checks['files'] = [
        'status' => 'error',
        'missing' => $missingFiles
    ];
} else {
    $checks['files'] = [
        'status' => 'ok'
    ];
}

// 4. Writable check (session/tmp)
$tmpWritable = is_writable(sys_get_temp_dir());
if (!$tmpWritable) {
    $healthy = false;
    $checks['writable'] = [
        'status' => 'error',
        'message' => 'Temp directory is not writable'
    ];
} else {
    $checks['writable'] = [
        'status' => 'ok'
    ];
}

// Build response
$response = [
    'status' => $healthy ? 'ok' : 'error',
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
    'uptime' => @file_get_contents('/proc/uptime') ? explode(' ', file_get_contents('/proc/uptime'))[0] . 's' : null,
    'checks' => $checks
];

// Remove null values
$response = array_filter($response, function ($v) { return $v !== null; });

http_response_code($healthy ? 200 : 503);
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
