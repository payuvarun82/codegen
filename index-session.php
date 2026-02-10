<?php
// Configure session for reverse proxy
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

// Trust reverse proxy headers
if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $_SERVER['REMOTE_ADDR'] = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
}

// Add this at the very top of your index.php file
session_start();

// Store merchant credentials in session when form is submitted
// This allows callback.php to access them
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_credentials'])) {
    $_SESSION['merchant_key'] = isset($_POST['merchant_key']) ? $_POST['merchant_key'] : 'a4vGC2';
    $_SESSION['merchant_salt'] = isset($_POST['merchant_salt']) ? $_POST['merchant_salt'] : 'hKvGJP28d2ZUuCRz5BnDag58QBdCxBli';
    $_SESSION['use_custom_keys'] = isset($_POST['use_custom_keys']) ? true : false;
    
    echo json_encode(['success' => true]);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayU Integration Lab</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script id="checkoutPlusScript" src="https://jssdk-uat.payu.in/bolt/bolt.min.js"></script>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <!-- Your existing HTML content from index.html -->
    <!-- Just add session_start() at the top -->
    
    <script src="assets/js/app.js"></script>
    
    <!-- Add this script to save credentials to session -->
    <script>
        // Save merchant credentials to PHP session
        function saveCredentialsToSession(key, salt, useCustom) {
            fetch('index.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'save_credentials': '1',
                    'merchant_key': key,
                    'merchant_salt': salt,
                    'use_custom_keys': useCustom ? '1' : '0'
                })
            });
        }

        // Hook into existing functions to save credentials
        // Add this to your toggleCustomKeys function
        const originalToggleCustomKeys = window.toggleCustomKeys;
        if (originalToggleCustomKeys) {
            window.toggleCustomKeys = function(flow) {
                const result = originalToggleCustomKeys(flow);
                
                // Save to session
                const prefix = getFlowPrefix(flow);
                const useCustom = document.getElementById(prefix + '_use_custom_keys').checked;
                if (useCustom) {
                    const key = document.getElementById(prefix + '_custom_key').value;
                    const salt = document.getElementById(prefix + '_custom_salt').value;
                    if (key && salt) {
                        saveCredentialsToSession(key, salt, true);
                    }
                } else {
                    saveCredentialsToSession('a4vGC2', 'hKvGJP28d2ZUuCRz5BnDag58QBdCxBli', false);
                }
                
                return result;
            };
        }

        function getFlowPrefix(flow) {
            const prefixMap = {
                'crossborder': 'cb',
                'nonseamless': 'ns',
                'subscription': 'sub',
                'tpv': 'tpv',
                'upiotm': 'upi',
                'preauth': 'preauth',
                'checkoutplus': 'cp',
                'split': 'split',
                'bankoffer': 'bo'
            };
            return prefixMap[flow] || 'ns';
        }
    </script>
</body>
</html>

