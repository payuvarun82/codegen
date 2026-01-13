<?php
// Get data from URL parameters (passed from callback.php)
$callbackData = [];
if (!empty($_GET)) {
    $callbackData = $_GET;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayU Hash Verification Tool</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/styles.css">
    <style>
        :root {
            --bg-color: #F7FAF9;
            --card-bg: #ffffff;
            --text-color: #1a202c;
            --text-muted: #718096;
            --input-bg: #f8fafc;
            --input-border: #e2e8f0;
            --input-text: #1a202c;
            --primary-color: #10846D;
            --primary-dark: #024538;
            --primary-light: #48bb78;
            --secondary-color: #10b981;
            --secondary-dark: #059669;
            --error-color: #f56565;
            --warning-color: #ed8936;
            --success-color: #48bb78;
            --card-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            --card-shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
            --border-radius: 12px;
            --border-radius-lg: 16px;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            background: var(--bg-color);
            color: var(--text-color);
            padding: 0;
            min-height: 100vh;
            font-weight: 400;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            padding: 20px;
        }
        .card {
            background: var(--card-bg);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--card-shadow);
            padding: 32px;
            margin-bottom: 24px;
            transition: var(--transition);
            border: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            overflow: hidden;
        }
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
        }
        .card-header {
            margin-bottom: 28px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.05);
        }
        .card-title {
            color: var(--text-color);
            font-weight: 600;
            font-size: 1.5rem;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .card-title i {
            color: var(--primary-color);
            font-size: 1.4rem;
        }
        .card-subtitle {
            color: var(--text-muted);
            font-size: 0.95rem;
        }
        .alert {
            padding: 20px;
            border-radius: var(--border-radius);
            margin-bottom: 24px;
            display: flex;
            align-items: flex-start;
            gap: 15px;
        }
        .alert-warning {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
            border-left: 4px solid var(--warning-color);
            color: var(--text-color);
        }
        .alert-error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
            border-left: 4px solid var(--error-color);
            color: var(--error-color);
        }
        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 24px;
        }
        .input-group {
            position: relative;
            display: flex;
            flex-direction: column;
        }
        .input-group.full-width {
            grid-column: 1 / -1;
        }
        .input-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            margin-bottom: 8px;
            color: var(--text-color);
            font-size: 0.9rem;
        }
        .input-group input, .input-group select {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid var(--input-border);
            border-radius: var(--border-radius);
            font-size: 0.95rem;
            transition: var(--transition);
            background: var(--input-bg);
            color: var(--input-text);
            font-family: inherit;
        }
        .input-group input:focus, .input-group select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        .salt-field {
            border-left: 4px solid var(--warning-color) !important;
            background: rgba(245, 158, 11, 0.1) !important;
        }
        .conditional-field {
            display: none;
        }
        .conditional-field.active {
            display: block;
        }
        .button-group {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
            margin-top: 20px;
        }
        button {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
            color: white;
            border: none;
            padding: 14px 28px;
            font-size: 0.95rem;
            font-weight: 600;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: var(--transition);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-width: 160px;
            box-shadow: 0 4px 12px rgba(16, 132, 109, 0.3);
            text-align: center;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16, 132, 109, 0.4);
        }
        .verification-result {
            padding: 24px;
            border-radius: var(--border-radius);
            margin-top: 28px;
            display: none;
        }
        .verification-success {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
            border-left: 4px solid var(--success-color);
            color: var(--success-color);
        }
        .verification-error {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
            border-left: 4px solid var(--error-color);
            color: var(--error-color);
        }
        .verification-details {
            margin-top: 20px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
            background: rgba(0,0,0,0.2);
            padding: 20px;
            border-radius: var(--border-radius);
            line-height: 1.6;
            color: var(--text-color);
            /* FIX: Prevent overflow */
            word-break: break-all;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            max-width: 100%;
            overflow-x: auto;
        }
        .hash-string-display {
            /* FIX: Better hash string display */
            font-family: 'Monaco', 'Menlo', monospace;
            background: rgba(0,0,0,0.3);
            padding: 15px;
            border-radius: 8px;
            word-break: break-all;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            max-width: 100%;
            overflow-x: auto;
            line-height: 1.8;
            font-size: 0.8rem;
        }
        
        .hash-display-box {
            background: linear-gradient(135deg, rgba(16, 132, 109, 0.05), rgba(72, 187, 120, 0.05));
            border: 2px solid rgba(16, 132, 109, 0.2);
            padding: 20px;
            border-radius: 12px;
            word-break: break-all;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
            font-size: 0.95rem;
            line-height: 1.8;
            color: var(--text-color);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }
        
        .hash-display-box:hover {
            border-color: var(--primary-color);
            box-shadow: 0 4px 12px rgba(16, 132, 109, 0.15);
        }
        
        .hash-highlight {
            background: linear-gradient(135deg, rgba(72, 187, 120, 0.1), rgba(16, 132, 109, 0.08));
            border-color: rgba(72, 187, 120, 0.3);
            font-weight: 600;
            color: var(--primary-dark);
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--primary-color);
            text-decoration: none;
            margin-bottom: 20px;
            padding: 10px 15px;
            border-radius: 8px;
            transition: var(--transition);
            font-weight: 600;
        }
        .back-link:hover {
            background: rgba(16, 132, 109, 0.1);
            transform: translateX(-3px);
        }
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            .button-group {
                flex-direction: column;
            }
            button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
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
                <p>Hash Verification & Debugging Tool</p>
            </div>
        </div>
    </div>
    
    <div class="container">
        <a href="callback.php" class="back-link">
            <i class="fas fa-arrow-left"></i>
            Back to Callback
        </a>

        <?php if (!empty($callbackData)): ?>
        <div class="alert" style="background: linear-gradient(135deg, rgba(16, 132, 109, 0.1), rgba(72, 187, 120, 0.05)); border-left: 4px solid var(--primary-color); color: var(--text-color);">
            <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--primary-color);"></i>
            <div>
                <strong style="color: var(--primary-color);">Hash Verification Tool</strong><br>
                All callback data has been auto-filled. Please enter your <strong>SALT</strong> below to recalculate and verify the hash.
            </div>
        </div>
        <?php endif; ?>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">
                    <i class="fas fa-shield-alt"></i>
                    Hash Verification System
                </h2>
                <p class="card-subtitle">All fields have been auto-filled from callback. Please enter your SALT to verify.</p>
            </div>

            <?php if (!empty($callbackData)): ?>
            <div class="alert alert-warning">
                <i class="fas fa-info-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Action Required:</strong> Please manually enter your SALT value in the field below to recalculate and verify the hash.
                </div>
            </div>
            <?php endif; ?>

            <form id="hashVerificationForm">
                <!-- Hash Type Selection -->
                <div class="form-row">
                    <div class="input-group">
                        <label for="hashType">
                            <i class="fas fa-list"></i>
                            Hash Verification Type
                        </label>
                        <select id="hashType" name="hashType" onchange="updateHashLogic()" required>
                            <option value="normal">Normal Reverse Hash Verification</option>
                            <option value="additional_charges">Additional Charges Reverse Hash Verification</option>
                            <option value="split">Split Reverse Hash Verification</option>
                            <option value="combined">Combined Split & Additional Charges Reverse Hash Verification</option>
                        </select>
                    </div>
                </div>

                <!-- Conditional Fields -->
                <div class="form-row">
                    <div id="additionalChargesField" class="input-group conditional-field">
                        <label for="additional_charges">
                            <i class="fas fa-dollar-sign"></i>
                            Additional Charges
                        </label>
                        <input type="text" id="additional_charges" name="additional_charges" 
                               value="<?php echo htmlspecialchars($callbackData['additionalCharges'] ?? $callbackData['additional_charges'] ?? ''); ?>">
                    </div>
                    <div id="splitInfoField" class="input-group conditional-field">
                        <label for="splitInfo">
                            <i class="fas fa-code-branch"></i>
                            Split Info
                        </label>
                        <input type="text" id="splitInfo" name="splitInfo" 
                               value="<?php echo htmlspecialchars($callbackData['splitInfo'] ?? $callbackData['split_info'] ?? ''); ?>">
                    </div>
                </div>

                <!-- Core Hash Fields -->
                <div class="form-row">
                    <div class="input-group">
                        <label for="salt">
                            <i class="fas fa-key"></i>
                            SALT (Manual Entry Required) <span style="color: var(--error-color);">*</span>
                        </label>
                        <input type="text" id="salt" name="salt" class="salt-field"
                               placeholder="Enter your PayU SALT manually" required>
                    </div>
                    <div class="input-group">
                        <label for="status">
                            <i class="fas fa-info-circle"></i>
                            Transaction Status
                        </label>
                        <input type="text" id="status" name="status" 
                               value="<?php echo htmlspecialchars($callbackData['status'] ?? ''); ?>" required>
                    </div>
                </div>

                <!-- UDF Fields -->
                <div class="form-row">
                    <div class="input-group">
                        <label for="udf5"><i class="fas fa-tag"></i> UDF5</label>
                        <input type="text" id="udf5" name="udf5" value="<?php echo htmlspecialchars($callbackData['udf5'] ?? ''); ?>">
                    </div>
                    <div class="input-group">
                        <label for="udf4"><i class="fas fa-tag"></i> UDF4</label>
                        <input type="text" id="udf4" name="udf4" value="<?php echo htmlspecialchars($callbackData['udf4'] ?? ''); ?>">
                    </div>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label for="udf3"><i class="fas fa-tag"></i> UDF3</label>
                        <input type="text" id="udf3" name="udf3" value="<?php echo htmlspecialchars($callbackData['udf3'] ?? ''); ?>">
                    </div>
                    <div class="input-group">
                        <label for="udf2"><i class="fas fa-tag"></i> UDF2</label>
                        <input type="text" id="udf2" name="udf2" value="<?php echo htmlspecialchars($callbackData['udf2'] ?? ''); ?>">
                    </div>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label for="udf1"><i class="fas fa-tag"></i> UDF1</label>
                        <input type="text" id="udf1" name="udf1" value="<?php echo htmlspecialchars($callbackData['udf1'] ?? ''); ?>">
                    </div>
                    <div class="input-group">
                        <label for="email"><i class="fas fa-envelope"></i> Email</label>
                        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($callbackData['email'] ?? ''); ?>" required>
                    </div>
                </div>

                <!-- Customer & Transaction Details -->
                <div class="form-row">
                    <div class="input-group">
                        <label for="firstname"><i class="fas fa-user"></i> First Name</label>
                        <input type="text" id="firstname" name="firstname" value="<?php echo htmlspecialchars($callbackData['firstname'] ?? ''); ?>" required>
                    </div>
                    <div class="input-group">
                        <label for="productinfo"><i class="fas fa-box"></i> Product Info</label>
                        <input type="text" id="productinfo" name="productinfo" value="<?php echo htmlspecialchars($callbackData['productinfo'] ?? ''); ?>" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label for="amount"><i class="fas fa-rupee-sign"></i> Amount</label>
                        <input type="text" id="amount" name="amount" value="<?php echo htmlspecialchars($callbackData['amount'] ?? ''); ?>" required>
                    </div>
                    <div class="input-group">
                        <label for="txnid"><i class="fas fa-hashtag"></i> Transaction ID</label>
                        <input type="text" id="txnid" name="txnid" value="<?php echo htmlspecialchars($callbackData['txnid'] ?? ''); ?>" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label for="key"><i class="fas fa-key"></i> Merchant Key</label>
                        <input type="text" id="key" name="key" value="<?php echo htmlspecialchars($callbackData['key'] ?? ''); ?>" required>
                    </div>
                    <div class="input-group">
                        <label for="responseHash"><i class="fas fa-fingerprint"></i> Response Hash</label>
                        <input type="text" id="responseHash" name="responseHash" value="<?php echo htmlspecialchars($callbackData['hash'] ?? ''); ?>" required>
                    </div>
                </div>

                <div class="button-group">
                    <button type="button" onclick="verifyHash()">
                        <i class="fas fa-check-circle"></i>
                        Verify Hash
                    </button>
                </div>
            </form>

            <div id="verificationResult" class="verification-result"></div>
        </div>
    </div>

    <script>
        // Auto-detect hash type on page load
        window.onload = function() {
            const additionalCharges = document.getElementById('additional_charges').value.trim();
            const splitInfo = document.getElementById('splitInfo').value.trim();
            
            let hashType = 'normal';
            if (additionalCharges && splitInfo) {
                hashType = 'combined';
            } else if (additionalCharges) {
                hashType = 'additional_charges';
            } else if (splitInfo) {
                hashType = 'split';
            }
            
            document.getElementById('hashType').value = hashType;
            updateHashLogic();
            
            // Auto-focus on SALT field
            document.getElementById('salt').focus();
        };

        function updateHashLogic() {
            const hashType = document.getElementById('hashType').value;
            const additionalChargesField = document.getElementById('additionalChargesField');
            const splitInfoField = document.getElementById('splitInfoField');

            additionalChargesField.classList.remove('active');
            splitInfoField.classList.remove('active');

            if (hashType === 'additional_charges' || hashType === 'combined') {
                additionalChargesField.classList.add('active');
            }
            if (hashType === 'split' || hashType === 'combined') {
                splitInfoField.classList.add('active');
            }
        }

        function verifyHash() {
            const hashType = document.getElementById('hashType').value;
            const additional_charges = document.getElementById('additional_charges').value.trim() || "";
            const splitInfo = document.getElementById('splitInfo').value.trim() || "";
            const salt = document.getElementById('salt').value.trim();
            const status = document.getElementById('status').value.trim();
            const udf5 = document.getElementById('udf5').value.trim() || "";
            const udf4 = document.getElementById('udf4').value.trim() || "";
            const udf3 = document.getElementById('udf3').value.trim() || "";
            const udf2 = document.getElementById('udf2').value.trim() || "";
            const udf1 = document.getElementById('udf1').value.trim() || "";
            const email = document.getElementById('email').value.trim();
            const firstname = document.getElementById('firstname').value.trim();
            const productinfo = document.getElementById('productinfo').value.trim();
            const amount = document.getElementById('amount').value.trim();
            const txnid = document.getElementById('txnid').value.trim();
            const key = document.getElementById('key').value.trim();
            const responseHash = document.getElementById('responseHash').value.trim();

            if (!salt) {
                alert('Please enter your SALT value');
                document.getElementById('salt').focus();
                return;
            }

            if (!key || !responseHash || !status || !txnid || !amount || !productinfo || !firstname || !email) {
                alert('Please fill in all required fields.');
                return;
            }

            // Build hash string
            let hashString = '';
            switch(hashType) {
                case 'normal':
                    hashString = salt + "|" + status + "||||||" + udf5 + "|" + udf4 + "|" + udf3 + "|" + udf2 + "|" + udf1 + "|" + email + "|" + firstname + "|" + productinfo + "|" + amount + "|" + txnid + "|" + key;
                    break;
                case 'additional_charges':
                    hashString = additional_charges + "|" + salt + "|" + status + "||||||" + udf5 + "|" + udf4 + "|" + udf3 + "|" + udf2 + "|" + udf1 + "|" + email + "|" + firstname + "|" + productinfo + "|" + amount + "|" + txnid + "|" + key;
                    break;
                case 'split':
                    hashString = salt + "|" + status + "|" + splitInfo + "||||||" + udf5 + "|" + udf4 + "|" + udf3 + "|" + udf2 + "|" + udf1 + "|" + email + "|" + firstname + "|" + productinfo + "|" + amount + "|" + txnid + "|" + key;
                    break;
                case 'combined':
                    hashString = additional_charges + "|" + salt + "|" + status + "|" + splitInfo + "||||||" + udf5 + "|" + udf4 + "|" + udf3 + "|" + udf2 + "|" + udf1 + "|" + email + "|" + firstname + "|" + productinfo + "|" + amount + "|" + txnid + "|" + key;
                    break;
            }

            const calculatedHash = CryptoJS.SHA512(hashString).toString().toLowerCase();
            const isValid = calculatedHash === responseHash.toLowerCase();

            const resultDiv = document.getElementById('verificationResult');
            resultDiv.style.display = 'block';
            resultDiv.className = isValid ? 'verification-result verification-success' : 'verification-result verification-error';

            let resultHtml = isValid ? 
                '<div style="font-size: 1.3rem; margin-bottom: 25px; display: flex; align-items: center; gap: 12px;"><i class="fas fa-check-circle" style="font-size: 2rem; color: var(--success-color);"></i> <strong>Hash Verification SUCCESSFUL!</strong></div>' : 
                '<div style="font-size: 1.3rem; margin-bottom: 25px; display: flex; align-items: center; gap: 12px;"><i class="fas fa-times-circle" style="font-size: 2rem; color: var(--error-color);"></i> <strong>Hash Verification FAILED!</strong></div>';

            resultHtml += '<div class="verification-details">' +
                '<div style="margin-bottom: 20px;"><strong style="font-size: 1.1rem; color: var(--primary-color); display: block; margin-bottom: 10px;">📝 Hash String:</strong><div class="hash-display-box">' + hashString + '</div></div>' +
                '<div style="margin-bottom: 20px;"><strong style="font-size: 1.1rem; color: var(--primary-color); display: block; margin-bottom: 10px;">🔐 Calculated Hash:</strong><div class="hash-display-box hash-highlight">' + calculatedHash + '</div></div>' +
                '<div style="margin-bottom: 20px;"><strong style="font-size: 1.1rem; color: var(--primary-color); display: block; margin-bottom: 10px;">📥 Response Hash:</strong><div class="hash-display-box hash-highlight">' + responseHash + '</div></div>' +
                '</div>';

            if (!isValid) {
                resultHtml += '<div style="margin-top: 20px; padding: 15px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; color: var(--error-color);">' +
                    '<strong><i class="fas fa-lightbulb"></i> Debugging Tips:</strong><br>' +
                    '• Verify your SALT is correct<br>' +
                    '• Check if amount format matches (e.g., "10.00" vs "10")<br>' +
                    '• Ensure hash type matches transaction type<br>' +
                    '• Contact PayU support if issue persists' +
                    '</div>';
            }

            resultDiv.innerHTML = resultHtml;
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    </script>
</body>
</html>

