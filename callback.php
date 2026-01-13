<?php
// Start session
session_start();

// Handle both POST and GET data from PayU
$callbackData = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // PayU sends POST request - capture all POST data
    $callbackData = $_POST;
    
    // Store in session for reference
    $_SESSION['last_callback'] = $callbackData;
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && !empty($_GET)) {
    // GET request - read from URL parameters (for test-callback.php)
    $callbackData = $_GET;
    
    // Also store in session
    $_SESSION['last_callback'] = $callbackData;
} elseif (isset($_SESSION['last_callback'])) {
    // If no data in request, try to load from session (for page refresh)
    $callbackData = $_SESSION['last_callback'];
}

// Get merchant credentials (default or from session)
$DEFAULT_KEY = 'a4vGC2';
$DEFAULT_SALT = 'hKvGJP28d2ZUuCRz5BnDag58QBdCxBli';

$merchantKey = isset($_SESSION['merchant_key']) ? $_SESSION['merchant_key'] : $DEFAULT_KEY;
$merchantSalt = isset($_SESSION['merchant_salt']) ? $_SESSION['merchant_salt'] : $DEFAULT_SALT;

// Check if using custom credentials
$isCustomCredentials = (isset($_SESSION['use_custom_keys']) && $_SESSION['use_custom_keys']) || 
                       (isset($callbackData['key']) && $callbackData['key'] !== $DEFAULT_KEY);

// Extract callback parameters
$status = isset($callbackData['status']) ? $callbackData['status'] : '';
$txnid = isset($callbackData['txnid']) ? $callbackData['txnid'] : '';
$amount = isset($callbackData['amount']) ? $callbackData['amount'] : '';
$productinfo = isset($callbackData['productinfo']) ? $callbackData['productinfo'] : '';
$firstname = isset($callbackData['firstname']) ? $callbackData['firstname'] : '';
$email = isset($callbackData['email']) ? $callbackData['email'] : '';
$mihpayid = isset($callbackData['mihpayid']) ? $callbackData['mihpayid'] : '';
$hash = isset($callbackData['hash']) ? $callbackData['hash'] : '';
$key = isset($callbackData['key']) ? $callbackData['key'] : '';

// Optional fields
$udf1 = isset($callbackData['udf1']) ? $callbackData['udf1'] : '';
$udf2 = isset($callbackData['udf2']) ? $callbackData['udf2'] : '';
$udf3 = isset($callbackData['udf3']) ? $callbackData['udf3'] : '';
$udf4 = isset($callbackData['udf4']) ? $callbackData['udf4'] : '';
$udf5 = isset($callbackData['udf5']) ? $callbackData['udf5'] : '';
$additionalCharges = isset($callbackData['additionalCharges']) ? $callbackData['additionalCharges'] : 
                     (isset($callbackData['additional_charges']) ? $callbackData['additional_charges'] : '');
$splitInfo = isset($callbackData['splitInfo']) ? $callbackData['splitInfo'] : 
             (isset($callbackData['split_info']) ? $callbackData['split_info'] : '');
$mode = isset($callbackData['mode']) ? $callbackData['mode'] : '';

// Determine hash type
$hashType = 'normal';
if (!empty($additionalCharges) && !empty($splitInfo)) {
    $hashType = 'combined';
} elseif (!empty($additionalCharges)) {
    $hashType = 'additional_charges';
} elseif (!empty($splitInfo)) {
    $hashType = 'split';
}

// Calculate reverse hash
$hashString = '';
$hashFormula = '';

switch($hashType) {
    case 'normal':
        $hashString = $merchantSalt . '|' . $status . '||||||' . $udf5 . '|' . $udf4 . '|' . $udf3 . '|' . $udf2 . '|' . $udf1 . '|' . $email . '|' . $firstname . '|' . $productinfo . '|' . $amount . '|' . $txnid . '|' . $merchantKey;
        $hashFormula = 'sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)';
        break;
    case 'additional_charges':
        $hashString = $additionalCharges . '|' . $merchantSalt . '|' . $status . '||||||' . $udf5 . '|' . $udf4 . '|' . $udf3 . '|' . $udf2 . '|' . $udf1 . '|' . $email . '|' . $firstname . '|' . $productinfo . '|' . $amount . '|' . $txnid . '|' . $merchantKey;
        $hashFormula = 'sha512(additional_charges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)';
        break;
    case 'split':
        $hashString = $merchantSalt . '|' . $status . '|' . $splitInfo . '||||||' . $udf5 . '|' . $udf4 . '|' . $udf3 . '|' . $udf2 . '|' . $udf1 . '|' . $email . '|' . $firstname . '|' . $productinfo . '|' . $amount . '|' . $txnid . '|' . $merchantKey;
        $hashFormula = 'sha512(SALT|status|splitInfo||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)';
        break;
    case 'combined':
        $hashString = $additionalCharges . '|' . $merchantSalt . '|' . $status . '|' . $splitInfo . '||||||' . $udf5 . '|' . $udf4 . '|' . $udf3 . '|' . $udf2 . '|' . $udf1 . '|' . $email . '|' . $firstname . '|' . $productinfo . '|' . $amount . '|' . $txnid . '|' . $merchantKey;
        $hashFormula = 'sha512(additional_charges|SALT|status|splitInfo||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)';
        break;
}

// Calculate hash
$calculatedHash = hash('sha512', $hashString);

// Verify hash
$isHashValid = !empty($hash) && (strtolower($calculatedHash) === strtolower($hash));

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayU Payment Callback - Status</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
    <style>
        /* Callback-specific styles */
        body {
            background: #F7FAF9;
            min-height: 100vh;
            padding: 0;
            margin: 0;
        }
        
        .page-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        .content-wrapper {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .callback-container {
            max-width: 900px;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            animation: slideIn 0.6s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .status-header {
            padding: 50px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
            background: linear-gradient(to bottom, #f0f9f7, #e6f5f2);
            border-bottom: 2px solid #10846D;
        }

        .status-header.success {
            background: linear-gradient(to bottom, #f0f9f7, #e6f5f2);
            border-bottom: 2px solid #10846D;
        }

        .status-header.failure {
            background: linear-gradient(to bottom, #f0f9f7, #e6f5f2);
            border-bottom: 2px solid #10846D;
        }

        .status-header.pending {
            background: linear-gradient(to bottom, #f0f9f7, #e6f5f2);
            border-bottom: 2px solid #10846D;
        }

        .status-icon {
            font-size: 80px;
            margin-bottom: 20px;
            width: 120px;
            height: 120px;
            margin-left: auto;
            margin-right: auto;
            position: relative;
        }

        .status-icon svg {
            width: 100%;
            height: 100%;
        }

        /* Success Checkmark Animation */
        .status-icon.success-animated {
            animation: scaleIn 0.5s ease-out;
        }

        .status-icon.success-animated .circle {
            stroke: #4CAF50;
            stroke-width: 7;
            stroke-dasharray: 380;
            stroke-dashoffset: 380;
            animation: drawCircle 0.6s ease-out forwards;
        }

        .status-icon.success-animated .checkmark {
            stroke: #4CAF50;
            stroke-width: 8;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: drawCheck 0.4s 0.6s ease-out forwards;
        }

        /* Failure X Animation */
        .status-icon.failure-animated {
            animation: scaleIn 0.5s ease-out;
        }

        .status-icon.failure-animated .circle {
            stroke: #f44336;
            stroke-width: 7;
            stroke-dasharray: 380;
            stroke-dashoffset: 380;
            animation: drawCircle 0.6s ease-out forwards;
        }

        .status-icon.failure-animated .cross-line {
            stroke: #f44336;
            stroke-width: 8;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
        }

        .status-icon.failure-animated .cross-line:nth-child(2) {
            animation: drawCross 0.3s 0.6s ease-out forwards;
        }

        .status-icon.failure-animated .cross-line:nth-child(3) {
            animation: drawCross 0.3s 0.8s ease-out forwards;
        }

        /* Pending Clock Animation */
        .status-icon.pending-animated {
            animation: scaleIn 0.5s ease-out;
        }

        .status-icon.pending-animated .circle {
            stroke: #ff9800;
            stroke-width: 5;
            stroke-dasharray: 380;
            stroke-dashoffset: 380;
            animation: drawCircle 0.6s ease-out forwards;
        }

        .status-icon.pending-animated .clock-hand {
            stroke: #ff9800;
            stroke-width: 5;
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            transform-origin: 60px 60px;
        }

        .status-icon.pending-animated .hour-hand {
            animation: drawHand 0.3s 0.6s ease-out forwards;
        }

        .status-icon.pending-animated .minute-hand {
            animation: drawHand 0.3s 0.8s ease-out forwards, rotateHand 2s 1s linear infinite;
        }

        @keyframes scaleIn {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
        }

        @keyframes drawCircle {
            to {
                stroke-dashoffset: 0;
            }
        }

        @keyframes drawCheck {
            to {
                stroke-dashoffset: 0;
            }
        }

        @keyframes drawCross {
            to {
                stroke-dashoffset: 0;
            }
        }

        @keyframes drawHand {
            to {
                stroke-dashoffset: 0;
            }
        }

        @keyframes rotateHand {
            to {
                transform: rotate(360deg);
            }
        }

        .status-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .status-header.success .status-title {
            color: #4CAF50;
        }

        .status-header.failure .status-title {
            color: #f44336;
        }

        .status-header.pending .status-title {
            color: #ff9800;
        }

        .status-message {
            font-size: 1.2rem;
            margin-bottom: 0;
        }

        .status-header.success .status-message {
            color: #4CAF50;
        }

        .status-header.failure .status-message {
            color: #f44336;
        }

        .status-header.pending .status-message {
            color: #ff9800;
        }

        .transaction-summary {
            padding: 40px;
            background: white;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-item {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05));
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
            transition: all 0.3s ease;
        }

        .summary-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .summary-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: #667eea;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }

        .summary-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            word-break: break-all;
        }

        .hash-verification {
            background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.05));
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            border-left: 4px solid #4CAF50;
        }

        .hash-verification.failed {
            background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(233, 30, 99, 0.05));
            border-left-color: #f44336;
        }

        .hash-verification.warning {
            background: linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(251, 140, 0, 0.05));
            border-left-color: #ff9800;
        }

        .hash-status {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
        }

        .hash-icon {
            font-size: 2rem;
        }

        .hash-icon.success { color: #4CAF50; }
        .hash-icon.failed { color: #f44336; }
        .hash-icon.warning { color: #ff9800; }

        .hash-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #2d3748;
            margin: 0;
        }

        .hash-subtitle {
            color: #4a5568;
            font-size: 0.95rem;
            margin-top: 5px;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            margin-top: 30px;
        }

        .btn {
            padding: 14px 28px;
            border: none;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            justify-content: center;
        }

        .btn-primary {
            background: linear-gradient(135deg, #10846D 0%, #024538 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(16, 132, 109, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 132, 109, 0.6);
        }

        .btn-details {
            background: linear-gradient(135deg, #10846D 0%, #024538 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 15px rgba(16, 132, 109, 0.4);
            position: relative;
            overflow: hidden;
        }

        .btn-details:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16, 132, 109, 0.4);
        }

        .btn-details:active {
            transform: translateY(0);
        }

        .debug-info {
            background: linear-gradient(135deg, rgba(45, 55, 72, 0.98), rgba(30, 41, 59, 0.98));
            color: white;
            padding: 25px;
            border-radius: 16px;
            margin: 20px 0;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
            word-break: break-all;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            max-width: 100%;
            overflow-x: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(96, 165, 250, 0.2);
            animation: fadeInUp 0.4s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .debug-info h4 {
            color: #60a5fa;
            margin-bottom: 10px;
        }

        .debug-info div {
            line-height: 1.8;
            margin-bottom: 0;
        }

        .btn-warning {
            background: linear-gradient(135deg, #ff9800 0%, #fb8c00 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4);
        }

        .btn-warning:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 152, 0, 0.6);
        }

        /* Copy icon - Compact design */
        .copy-icon {
            background: rgba(16, 132, 109, 0.1);
            color: #10846D;
            border: 2px solid #10846D;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 1.1rem;
            position: relative;
        }

        .copy-icon:hover {
            background: #10846D;
            color: white;
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(16, 132, 109, 0.3);
        }

        .copy-icon:active {
            transform: scale(0.95);
        }

        .copy-icon.copied {
            background: #10b981;
            color: white;
            border-color: #10b981;
        }

        @media (max-width: 768px) {
            .status-title {
                font-size: 2rem;
            }

            .status-icon {
                font-size: 60px;
                width: 100px;
                height: 100px;
            }

            .summary-grid {
                grid-template-columns: 1fr;
            }

            .action-buttons {
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }

            .modal-content {
                width: 95% !important;
                max-height: 90vh !important;
            }

            .modal-header h3 {
                font-size: 1.1rem !important;
            }

            .modal-body {
                padding: 20px !important;
                max-height: calc(90vh - 120px) !important;
            }

            .debug-info {
                font-size: 0.8rem;
            }
        }

        @media (max-width: 480px) {
            .status-header {
                padding: 30px 20px;
            }

            .transaction-summary {
                padding: 25px;
            }

            .btn {
                padding: 12px 20px;
                font-size: 0.9rem;
            }
        }
    </style>
</head>
<body>
    <div class="page-wrapper">
        <!-- PayU Header -->
        <div class="header">
            <div class="header-content">
                <div class="header-logo">
                    <svg width="134" height="134" viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.898 42.6916C21.1529 41.7286 21.1188 39.2323 22.837 38.2219L65.1248 13.355C65.8802 12.9108 66.8097 12.8817 67.5913 13.2777L112.023 35.7869C113.848 36.7111 113.916 39.2916 112.144 40.3114L67.5935 65.9407C66.8135 66.3894 65.8557 66.3979 65.0678 65.9631L22.898 42.6916Z" fill="white"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0879 45.9843C18.0879 44.6797 19.4872 43.8529 20.6302 44.4821L63.933 68.3182C64.4805 68.6197 64.8206 69.1954 64.8206 69.8205V118.783C64.8203 120.149 63.3003 120.966 62.1603 120.213L18.8574 91.6101C18.3769 91.2926 18.0879 90.7549 18.0879 90.179V45.9843ZM45.817 72.47C45.1586 72.1055 44.7141 72.3645 44.7058 73.1173C44.6976 73.87 45.131 74.6147 45.7894 74.9796C46.997 75.6484 47.9726 77.3256 47.9574 78.706L47.9164 82.47C47.8998 83.9758 48.4349 85.5354 49.4119 87.0865C48.4129 87.5432 47.85 88.494 47.8335 89.9998L47.7924 93.7638C47.7772 95.1441 46.7767 95.7263 45.5692 95.0576C44.9105 94.6928 44.4654 94.952 44.4571 95.7049C44.449 96.4577 44.8829 97.2024 45.5415 97.5672C47.9567 98.9048 49.9577 97.7404 49.988 94.9797L50.0291 91.2157C50.0443 89.8353 51.0448 89.2531 52.2523 89.9219C52.9109 90.2866 53.3559 90.028 53.3644 89.2754C53.3727 88.5225 52.9386 87.7771 52.28 87.4123C51.0725 86.7435 50.097 85.067 50.112 83.6867L50.153 79.9219C50.1834 77.1612 48.2322 73.8076 45.817 72.47ZM37.0345 67.6064C34.6196 66.269 32.6194 67.4328 32.5889 70.1931L32.547 73.958C32.5318 75.3383 31.5313 75.9206 30.3238 75.2518C29.6652 74.8871 29.221 75.1456 29.2125 75.8982C29.2043 76.6511 29.6375 77.3965 30.2961 77.7614C31.5036 78.4302 32.4791 80.1066 32.4641 81.4869L32.4231 85.2518C32.3927 88.0125 34.3439 91.366 36.759 92.7037C37.4176 93.0683 37.862 92.8092 37.8703 92.0564C37.8785 91.3035 37.4453 90.558 36.7867 90.1932C35.5791 89.5244 34.6035 87.848 34.6187 86.4677L34.6597 82.7036C34.6763 81.1978 34.1411 79.6382 33.1642 78.0871C34.1632 77.6305 34.7261 76.6797 34.7426 75.1739L34.7845 71.4098C34.7997 70.0295 35.8002 69.4473 37.0078 70.1161C37.6662 70.4806 38.1107 70.2215 38.119 69.4688C38.1271 68.7159 37.6932 67.9712 37.0345 67.6064Z" fill="white"></path>
                        <path d="M92.255 78.8316C93.0255 78.3513 93.5555 78.6363 93.5798 79.5442C93.604 80.4522 93.1062 81.378 92.3354 81.8587L89.7663 83.4606C88.9956 83.9413 88.4659 83.6568 88.4416 82.7489C88.4173 81.841 88.9145 80.9151 89.6851 80.4343L92.255 78.8316Z" fill="white"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M112.83 42.8793C113.974 42.2099 115.412 43.0342 115.412 44.359V89.741C115.412 90.3219 115.118 90.8634 114.631 91.1796L70.4705 119.824C69.3295 120.564 67.8218 119.745 67.8218 118.385V70.2191C67.8218 69.6101 68.1446 69.0463 68.6701 68.7386L112.83 42.8793ZM95.7846 64.3214C95.7603 63.4134 95.2306 63.1289 94.4599 63.6096C93.6893 64.0903 93.1912 65.0162 93.2155 65.9241L93.3369 70.4636L88.1987 73.6683L88.0773 69.128C88.0529 68.2202 87.5232 67.9356 86.7526 68.4162C85.9818 68.8969 85.484 69.8227 85.5082 70.7307L85.6296 75.271L81.776 77.6743C81.0052 78.155 80.5074 79.0808 80.5316 79.9888C80.556 80.8967 81.0857 81.1812 81.8564 80.7006L83.1409 79.9001L83.3436 87.4667C83.3557 87.9207 83.4922 88.1432 83.7572 88.2856L87.3345 90.2091L87.5204 97.1703C87.5447 98.0782 88.0746 98.3633 88.8452 97.8829C89.6159 97.4023 90.1137 96.4763 90.0895 95.5684L89.9279 89.5149L92.497 87.9122L92.6586 93.9656C92.6829 94.8737 93.2135 95.1589 93.9842 94.6782C94.7548 94.1976 95.2519 93.2716 95.2277 92.3637L95.0418 85.4017L98.4014 79.1531C98.6503 78.6902 98.7703 78.3067 98.7581 77.8527L98.5563 70.2861L99.8409 69.4847C100.612 69.004 101.109 68.0781 101.085 67.1702C101.061 66.2623 100.53 65.9777 99.7597 66.4584L95.906 68.8617L95.7846 64.3214Z" fill="white"></path>
                    </svg>
                </div>
                <div class="header-text-wrapper">
                    <h1>PayU Integration Lab <span class="beta-badge">BETA</span></h1>
                    <p>Payment Callback & Hash Verification</p>
                </div>
            </div>
        </div>
        
        <div class="content-wrapper">
            <div class="callback-container">
        <!-- Status Header -->
        <div class="status-header <?php echo htmlspecialchars($status); ?>">
            <div class="status-icon <?php 
                if ($status === 'success') echo 'success-animated';
                elseif ($status === 'failure') echo 'failure-animated';
                elseif ($status === 'pending') echo 'pending-animated';
            ?>">
                <?php if ($status === 'success'): ?>
                    <svg viewBox="0 0 120 120">
                        <circle class="circle" cx="60" cy="60" r="54" fill="none" stroke-width="7"/>
                        <polyline class="checkmark" points="30,60 50,75 90,40" fill="none" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                <?php elseif ($status === 'failure'): ?>
                    <svg viewBox="0 0 120 120">
                        <circle class="circle" cx="60" cy="60" r="54" fill="none" stroke-width="7"/>
                        <line class="cross-line" x1="40" y1="40" x2="80" y2="80" stroke-width="8" stroke-linecap="round"/>
                        <line class="cross-line" x1="80" y1="40" x2="40" y2="80" stroke-width="8" stroke-linecap="round"/>
                    </svg>
                <?php elseif ($status === 'pending'): ?>
                    <svg viewBox="0 0 120 120">
                        <circle class="circle" cx="60" cy="60" r="54" fill="none" stroke-width="5"/>
                        <line class="clock-hand hour-hand" x1="60" y1="60" x2="60" y2="40" stroke-width="5" stroke-linecap="round"/>
                        <line class="clock-hand minute-hand" x1="60" y1="60" x2="60" y2="25" stroke-width="5" stroke-linecap="round"/>
                    </svg>
                <?php else: ?>
                    <i class="fas fa-question-circle"></i>
                <?php endif; ?>
            </div>
            <h1 class="status-title">
                <?php 
                    if ($status === 'success') echo 'Payment Successful!';
                    elseif ($status === 'failure') echo 'Payment Failed';
                    elseif ($status === 'pending') echo 'Payment Pending';
                    else echo 'Payment Status Unknown';
                ?>
            </h1>
            <p class="status-message">
                <?php 
                    if ($status === 'success') echo 'Your payment has been completed successfully';
                    elseif ($status === 'failure') echo 'Unfortunately, your payment could not be processed';
                    elseif ($status === 'pending') echo 'Your payment is being processed';
                    else echo 'Unable to determine payment status';
                ?>
            </p>
        </div>

        <!-- Transaction Summary -->
        <div class="transaction-summary">
            <div class="summary-grid">
                <?php if (!empty($txnid)): ?>
                <div class="summary-item">
                    <div class="summary-label"><i class="fas fa-hashtag"></i> Transaction ID</div>
                    <div class="summary-value"><?php echo htmlspecialchars($txnid); ?></div>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($amount)): ?>
                <div class="summary-item">
                    <div class="summary-label"><i class="fas fa-rupee-sign"></i> Amount</div>
                    <div class="summary-value">₹<?php echo htmlspecialchars($amount); ?></div>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($mihpayid)): ?>
                <div class="summary-item">
                    <div class="summary-label"><i class="fas fa-receipt"></i> Payment ID</div>
                    <div class="summary-value"><?php echo htmlspecialchars($mihpayid); ?></div>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($status)): ?>
                <div class="summary-item">
                    <div class="summary-label"><i class="fas fa-info-circle"></i> Status</div>
                    <div class="summary-value"><?php echo htmlspecialchars(ucfirst($status)); ?></div>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($productinfo)): ?>
                <div class="summary-item">
                    <div class="summary-label"><i class="fas fa-box"></i> Product Info</div>
                    <div class="summary-value"><?php echo htmlspecialchars($productinfo); ?></div>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($firstname)): ?>
                <div class="summary-item">
                    <div class="summary-label"><i class="fas fa-user"></i> Customer Name</div>
                    <div class="summary-value"><?php echo htmlspecialchars($firstname); ?></div>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($email)): ?>
                <div class="summary-item">
                    <div class="summary-label"><i class="fas fa-envelope"></i> Email</div>
                    <div class="summary-value"><?php echo htmlspecialchars($email); ?></div>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($mode)): ?>
                <div class="summary-item">
                    <div class="summary-label"><i class="fas fa-credit-card"></i> Payment Mode</div>
                    <div class="summary-value"><?php echo htmlspecialchars($mode); ?></div>
                </div>
                <?php endif; ?>
            </div>

            <!-- Hash Verification Status -->
            <?php if (!empty($status)): ?>
            <div class="hash-verification <?php echo $isHashValid ? '' : (empty($hash) ? 'warning' : 'failed'); ?>">
                <div class="hash-status">
                    <i class="fas fa-shield-alt hash-icon <?php echo $isHashValid ? 'success' : (empty($hash) ? 'warning' : 'failed'); ?>"></i>
                    <div>
                        <h3 class="hash-title">
                            Reverse Hash Verification: 
                            <?php 
                                if ($isHashValid) echo 'SUCCESS ✓';
                                elseif (empty($hash)) echo 'NO HASH RECEIVED';
                                else echo 'FAILED ✗';
                            ?>
                        </h3>
                        <p class="hash-subtitle">
                            <?php 
                                if ($isHashValid) {
                                    echo 'Payment authenticity confirmed. Hash matches perfectly.<br><small style="margin-top: 5px; display: block;">Formula: ' . strtoupper(str_replace('_', ' ', $hashType)) . '</small>';
                                } elseif (empty($hash)) {
                                    echo 'No hash parameter received from PayU. Cannot verify authenticity.';
                                } else {
                                    echo 'Hash mismatch detected! This may indicate a security issue.<br><small style="margin-top: 5px; display: block;">Click "View Details" below for debugging information.</small>';
                                }
                            ?>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Hash Verification Utility Link (Show when hash fails) -->
            <?php if (!empty($hash) && !$isHashValid): ?>
            <div style="background: linear-gradient(135deg, rgba(16, 132, 109, 0.08), rgba(72, 187, 120, 0.05)); border: 2px solid rgba(16, 132, 109, 0.3); padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; box-shadow: 0 4px 12px rgba(16, 132, 109, 0.1);">
                <h4 style="color: #10846D; margin-bottom: 15px; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 10px;">
                    <i class="fas fa-tools" style="font-size: 1.5rem;"></i> Next Step: Debug Hash Verification
                </h4>
                <p style="color: #4a5568; margin-bottom: 20px; line-height: 1.6; font-size: 1rem;">
                    All callback data has been <strong style="color: #10846D;">auto-filled</strong> in the Hash Verification Utility.<br>
                    <strong style="color: #10846D;">Just enter your SALT</strong> to recalculate and verify the hash manually.
                </p>
                <a href="hash-utility.php?<?php echo http_build_query($callbackData); ?>" class="btn btn-details" style="background: linear-gradient(135deg, #10846D 0%, #024538 100%); box-shadow: 0 4px 15px rgba(16, 132, 109, 0.4);">
                    Open Hash Verification Utility
                </a>
            </div>
            <?php endif; ?>
            <?php endif; ?>

            <!-- Debug & Callback Information Sections -->
            <div style="margin: 30px 0;">
                <div style="display: flex; justify-content: space-between; gap: 15px; flex-wrap: wrap; margin-bottom: 15px;">
                    <button id="toggleDebugBtn" class="btn btn-details" onclick="toggleDebugInfo()">
                        <span id="debugBtnText">Show Debug Info</span>
                    </button>
                    <button id="toggleCallbackBtn" class="btn btn-details" onclick="toggleCallbackData()">
                        <span id="callbackBtnText">Check Callback Data</span>
                    </button>
                </div>
                
                <!-- Debug Info Section -->
                <div id="debugInfoSection" class="debug-info" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                        <h4 style="margin: 0; color: #60a5fa;"><i class="fas fa-bug"></i> Debug Information</h4>
                        <button onclick="copyDebugInfo()" class="copy-icon" title="Copy debug information" id="copyDebugIcon">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div id="debugContent" style="background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 8px; font-size: 0.9rem;">
                        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong style="color: #60a5fa;">Merchant Key:</strong> <span style="color: #fbbf24;"><?php echo htmlspecialchars(substr($merchantKey, 0, 4)) . '****'; ?></span></div>
                        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong style="color: #60a5fa;">Salt Used:</strong> <span style="color: #fbbf24;"><?php echo htmlspecialchars(substr($merchantSalt, 0, 8)) . '**********************'; ?></span></div>
                        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong style="color: #60a5fa;">Credentials:</strong> <span style="color: #fbbf24;"><?php echo $isCustomCredentials ? 'Custom' : 'Default'; ?></span></div>
                        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong style="color: #60a5fa;">Hash Type:</strong> <span style="color: #fbbf24;"><?php echo htmlspecialchars($hashType); ?></span></div>
                        <?php if (!empty($hash)): ?>
                        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong style="color: #60a5fa;">Hash Formula:</strong> <span style="color: #fbbf24; font-size: 0.85rem;"><?php echo htmlspecialchars($hashFormula); ?></span></div>
                        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong style="color: #60a5fa;">Calculated Hash:</strong> <span style="color: #10b981; font-family: monospace; font-size: 0.8rem; word-break: break-all;"><?php echo htmlspecialchars($calculatedHash); ?></span></div>
                        <div style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);"><strong style="color: #60a5fa;">Received Hash:</strong> <span style="color: #f59e0b; font-family: monospace; font-size: 0.8rem; word-break: break-all;"><?php echo htmlspecialchars($hash); ?></span></div>
                        <div style="padding: 8px 0;"><strong style="color: #60a5fa;">Match:</strong> <span style="color: <?php echo $isHashValid ? '#10b981' : '#ef4444'; ?>; font-weight: bold; font-size: 1.1rem;"><?php echo $isHashValid ? '✅ YES' : '❌ NO'; ?></span></div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Callback Data Section (Same Style as Debug Info) -->
                <div id="callbackDataSection" class="debug-info" style="display: none; margin-top: 15px;">
                    <h4 style="margin: 0 0 4px 0; color: #60a5fa;"><i class="fas fa-file-code"></i> PayU will provide the data in URL encoded format. The below callback data has been modified in the Json format for better readability.</h4>
                    <div id="callbackDataContent" style="background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 8px; overflow-x: auto; position: relative;">
                        <button onclick="copyCallbackPayload()" class="copy-icon" title="Copy callback payload" id="copyCallbackIcon" style="position: absolute; top: 10px; right: 10px;">
                            <i class="fas fa-copy"></i>
                        </button>
                        <pre id="callbackPayloadContent" style="margin: 0; padding-right: 50px; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.85rem; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap; word-break: break-all;"></pre>
                    </div>
                </div>
            </div>

            <!-- No Data Message -->
            <?php if (empty($callbackData) || empty($status)): ?>
            <div style="background: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #1e40af; margin-bottom: 10px;">
                    <i class="fas fa-info-circle"></i> No Callback Data Received
                </h4>
                <p style="color: #1e3a8a; line-height: 1.6; margin: 0;">
                    This page receives payment callback data from PayU via POST request.<br><br>
                    <strong>To test locally:</strong><br>
                    1. Use <a href="test-callback.php" style="color: #667eea; font-weight: 600;">test-callback.php</a> to simulate PayU callback<br>
                    2. Or configure this URL as your SURL/FURL in PayU payment form
                </p>
            </div>
            <?php endif; ?>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <?php if (empty($callbackData)): ?>
                <a href="test-callback.php" class="btn btn-details">
                    Test Callback Simulator
                </a>
                <?php endif; ?>
                <a href="index.php" class="btn btn-primary">
                    Back to PayU CodeGen
                </a>
            </div>
            </div>
        </div>
    </div>
    </div>

    <!-- Store PHP data in JavaScript for client-side use -->
    <script>
        // Store callback data for JavaScript access
        const phpCallbackData = <?php echo json_encode($callbackData); ?>;
        const phpHashVerification = {
            isValid: <?php echo $isHashValid ? 'true' : 'false'; ?>,
            calculatedHash: '<?php echo addslashes($calculatedHash); ?>',
            receivedHash: '<?php echo addslashes($hash); ?>',
            hashString: '<?php echo addslashes($hashString); ?>',
            formula: '<?php echo addslashes($hashFormula); ?>',
            hashType: '<?php echo addslashes($hashType); ?>'
        };

        console.log('=== PayU Callback Data ===');
        console.log('Callback Data:', phpCallbackData);
        console.log('Hash Verification:', phpHashVerification);
        console.log('=========================');

        // Toggle Debug Info Section
        function toggleDebugInfo() {
            const debugSection = document.getElementById('debugInfoSection');
            const btnText = document.getElementById('debugBtnText');
            
            if (debugSection.style.display === 'none') {
                debugSection.style.display = 'block';
                btnText.textContent = 'Hide Debug Info';
            } else {
                debugSection.style.display = 'none';
                btnText.textContent = 'Show Debug Info';
            }
        }

        // Toggle Callback Data Section
        function toggleCallbackData() {
            const callbackSection = document.getElementById('callbackDataSection');
            const btnText = document.getElementById('callbackBtnText');
            const payloadContent = document.getElementById('callbackPayloadContent');
            
            if (callbackSection.style.display === 'none') {
                // Format the callback data as JSON when showing
                const formattedPayload = JSON.stringify(phpCallbackData, null, 2);
                payloadContent.textContent = formattedPayload;
                
                callbackSection.style.display = 'block';
                btnText.textContent = 'Hide Callback Data';
            } else {
                callbackSection.style.display = 'none';
                btnText.textContent = 'Check Callback Data';
            }
        }

        // Copy Debug Info to Clipboard
        function copyDebugInfo() {
            const debugContent = document.getElementById('debugContent');
            const textToCopy = debugContent.innerText;
            
            navigator.clipboard.writeText(textToCopy).then(function() {
                // Show success feedback
                const icon = document.getElementById('copyDebugIcon');
                const originalHTML = icon.innerHTML;
                
                // Add copied class and change icon
                icon.classList.add('copied');
                icon.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(function() {
                    icon.classList.remove('copied');
                    icon.innerHTML = originalHTML;
                }, 2000);
            }).catch(function(err) {
                alert('Failed to copy: ' + err);
            });
        }

        // Copy Callback Payload to Clipboard
        function copyCallbackPayload() {
            const payloadContent = document.getElementById('callbackPayloadContent');
            const textToCopy = payloadContent.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(function() {
                // Show success feedback
                const icon = document.getElementById('copyCallbackIcon');
                const originalHTML = icon.innerHTML;
                
                // Add copied class and change icon
                icon.classList.add('copied');
                icon.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(function() {
                    icon.classList.remove('copied');
                    icon.innerHTML = originalHTML;
                }, 2000);
            }).catch(function(err) {
                alert('Failed to copy: ' + err);
            });
        }
    </script>
</body>
</html>
