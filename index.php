<?php
// Handle POST data from PayU
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get all POST parameters
    $postData = $_POST;
    
    // Convert POST to GET parameters for redirect
    $queryString = http_build_query($postData);
    
    // Redirect to same page with GET parameters
    header("Location: callback.php?" . $queryString);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayU CodeGen</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script id="checkoutPlusScript" src="https://jssdk-uat.payu.in/bolt/bolt.min.js"></script>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
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
                    <p>Accelerate your integration with instant code generation, visual flow mapping, and debugging.</p>
                </div>
            </div>
        </div>
        
        <!-- Landing Section -->
        <div class="landing-section" id="landingSection">
            <h2>Select Payment Flow</h2>
            <p>Choose the payment integration flow you want to test</p>
            
            <div class="flow-selector">
                <label for="flowSelect">Payment Flow:</label>
                <select id="flowSelect">
                    <option value="">-- Select a flow --</option>
                    <option value="crossborder">PayU Hosted Cross Border Payment Flow</option>
                    <option value="nonseamless">PayU Hosted Checkout Flow</option>
                    <option value="subscription">PayU Hosted Checkout Subscription Flow</option>
                    <option value="tpv">PayU Hosted Checkout TPV Flow</option>
                    <option value="upiotm">PayU Hosted Checkout UPI OTM Flow</option>
                    <option value="preauth">PayU Hosted Checkout PreAuth Flow</option>
                    <option value="checkoutplus">Checkout Plus</option>
                    <option value="split">PayU Hosted Checkout Split Payment Flow</option>
                    <option value="bankoffer">PayU Hosted Checkout Bank Offer Flow</option>
                </select>
                <button onclick="loadSelectedFlow()">Continue</button>
            </div>
        </div>
        
        <!-- Cross Border Flow -->
        <div class="flow-content" id="crossborderFlow">
            <div class="flow-title">
                <h2>PayU Hosted Cross Border Payment</h2>
            </div>
            
            <div class="main-content">
                <!-- Configuration Settings -->
                <div class="section">
                    <h2 class="section-title">Configuration Settings</h2>
                    
                <div class="alert alert-info">
                    <strong>Cross-Border Payment Alert:</strong> Ensure your PayU account is enabled for international transactions and comply with RBI guidelines for cross-border payments.
                </div>
                
                <!-- Custom Key/Salt Toggle -->
                    <div class="custom-key-toggle">
                        <label>
                            <input type="checkbox" id="cb_use_custom_keys" onchange="toggleCustomKeys('crossborder')">
                            Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                        </label>
                        <div class="custom-key-fields" id="cb-custom-key-fields">
                            <div class="form-group">
                                <label for="cb_custom_key">Custom Merchant Key <span class="required">*</span></label>
                                <input type="text" id="cb_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                            </div>
                            <div class="form-group">
                                <label for="cb_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                                <div style="position: relative;">
                                    <input type="password" id="cb_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                    <button type="button" onclick="toggleSaltVisibility('crossborder')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Type Selection -->
                    <div class="payment-type-selection">
                        <label>Payment Type <span class="required">*</span></label>
                        <div class="payment-type-buttons">
                            <div class="payment-type-btn active" onclick="selectPaymentType('onetime', 'crossborder')" id="cb-onetime-btn">
                                <h3>One-Time Payment</h3>
                                <p>Single transaction payment</p>
                            </div>
                            <div class="payment-type-btn" onclick="selectPaymentType('subscription', 'crossborder')" id="cb-subscription-btn">
                                <h3>Subscription Payment</h3>
                                <p>Recurring payment setup</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Subscription Configuration -->
                    <div class="subscription-section" id="cb-subscription-config">
                        <h3>Subscription Configuration</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cb_billing_amount">Billing Amount <span class="required">*</span></label>
                                <input type="number" id="cb_billing_amount" name="billing_amount" placeholder="Enter billing amount" min="1" step="0.01" required>
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Amount to be charged per billing cycle</small>
                            </div>
                            <div class="form-group">
                                <label for="cb_billing_currency">Billing Currency <span class="required">*</span></label>
                                <input type="text" id="cb_billing_currency" name="billing_currency" value="INR" readonly style="background-color: #f0f0f0; cursor: not-allowed;">
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Currency is fixed to INR</small>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cb_billing_cycle">Billing Cycle <span class="required">*</span></label>
                                <select id="cb_billing_cycle" name="billing_cycle">
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="ADHOC">Ad-hoc</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="cb_billing_interval">Billing Interval <span class="required">*</span></label>
                                <input type="number" id="cb_billing_interval" name="billing_interval" value="1" min="1">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cb_payment_start_date">Payment Start Date <span class="required">*</span></label>
                                <input type="date" id="cb_payment_start_date" name="payment_start_date" onchange="validateSubscriptionStartDate('crossborder')">
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Select today's date or future dates only. Note: For eNACH payments, select tomorrow's date.</small>
                            </div>
                            <div class="form-group">
                                <label for="cb_payment_end_date">Payment End Date <span class="required">*</span></label>
                                <input type="date" id="cb_payment_end_date" name="payment_end_date" required>
                            </div>
                        </div>
                        
                        <!-- Pre-filled Subscription Parameters -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cb_si">SI (Stored Instrument) <span style="color: #48bb78;">(Pre-filled)</span></label>
                                <input type="text" id="cb_si" name="si" value="1" readonly style="background-color: #f0f0f0; cursor: not-allowed;">
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Mandatory for subscription payments (always 1)</small>
                            </div>
                            <div class="form-group">
                                <label for="cb_api_version">API Version <span style="color: #48bb78;">(Pre-filled)</span></label>
                                <input type="text" id="cb_api_version" name="api_version" value="7" readonly style="background-color: #f0f0f0; cursor: not-allowed;">
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Mandatory for subscription payments (always 7)</small>
                            </div>
                        </div>
                        
                        <div class="alert alert-info">
                            <strong>Note:</strong> For subscription payments, you may need to select 'Net Banking' if required by your bank.
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Enforce Payment Methods <span class="optional">(Optional)</span></label>
                        <div class="payment-methods">
                            <div class="payment-method">
                                <input type="checkbox" id="cb_cc" name="cb_paymethod" value="CC">
                                <label for="cb_cc">Credit Cards</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="cb_dc" name="cb_paymethod" value="DC">
                                <label for="cb_dc">Debit Cards</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="cb_nb" name="cb_paymethod" value="NB">
                                <label for="cb_nb">Net Banking</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="cb_upi" name="cb_paymethod" value="UPI">
                                <label for="cb_upi">UPI</label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Saved Card Feature Toggle -->
                    <div class="custom-key-toggle">
                        <label>
                            <input type="checkbox" id="cb_enable_saved_card" onchange="toggleSavedCardField('crossborder')">
                            Enable Saved Card Feature <span class="optional">(Optional)</span>
                        </label>
                        <div class="custom-key-fields" id="cb-saved-card-field">
                            <div class="form-group">
                                <label for="cb_user_credentials">User Credentials</label>
                                <input type="text" id="cb_user_credentials" name="user_credentials" placeholder="MerchantKey:UniqueUserIdentifier" maxlength="50">
                                <div id="cb_user_credentials_counter" class="char-counter">0/50</div>
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">
                                    Format: MerchantKey:UniqueUserIdentifier (e.g., a4vGC2:user123) - Used for card tokenization and managing saved cards
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Details -->
                <div class="section">
                    <h2 class="section-title">Payment Details</h2>
                    
                    <!-- Transaction ID Display (Auto-Generated) -->
                    <div class="form-group">
                        <label for="cb_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                        <input type="text" id="cb_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                        <span class="char-counter" id="cb_txnid_display_counter">0/25</span>
                    </div>
                    
                    <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                    <div class="form-group" id="cb-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                        <button type="button" class="button template-button" id="cb_generate_template_btn" onclick="generateTemplate('crossborder')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                            🔄 Fill with Sample Data
                        </button>
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_amount">Amount <span class="required">*</span></label>
                            <input type="number" id="cb_amount" name="amount" step="0.01" placeholder="100.00" required>
                            <small id="cb_enach_amount_note" style="color: var(--text-tertiary); display: none; margin-top: 0.25rem;">Note: For eNACH payments, use transaction amount as 1.</small>
                        </div>
                        <div class="form-group">
                            <label for="cb_productinfo">Product Info <span class="required">*</span></label>
                            <input type="text" id="cb_productinfo" name="productinfo" placeholder="Product or service description" required maxlength="100">
                            <div id="cb_productinfo_counter" class="char-counter">0/100</div>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Customer Details</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_firstname">First Name <span class="required">*</span></label>
                            <input type="text" id="cb_firstname" name="firstname" placeholder="John" required maxlength="60">
                            <div id="cb_firstname_counter" class="char-counter">0/60</div>
                        </div>
                        <div class="form-group">
                            <label for="cb_lastname">Last Name <span class="required">*</span></label>
                            <input type="text" id="cb_lastname" name="lastname" placeholder="Doe" required maxlength="20">
                            <div id="cb_lastname_counter" class="char-counter">0/20</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_email">Email <span class="required">*</span></label>
                            <input type="email" id="cb_email" name="email" placeholder="john.doe@example.com" required maxlength="50">
                            <div id="cb_email_counter" class="char-counter">0/50</div>
                            <div id="cb-email-error" class="error-message" style="display: none;"></div>
                        </div>
                        <div class="form-group">
                            <label for="cb_phone">Phone (10 digits) <span class="required">*</span></label>
                            <input type="text" id="cb_phone" name="phone" placeholder="9876543210" required maxlength="10" pattern="[0-9]{10}">
                            <div id="cb-phone-error" class="error-message" style="display: none;"></div>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Billing Address</h3>
                    <div class="alert alert-info">
                        <strong>PACB Requirement:</strong> Billing address is mandatory for cross-border payments.
                    </div>
                    
                    <div class="form-group">
                        <label for="cb_address1">Address Line 1 <span class="required">*</span></label>
                        <input type="text" id="cb_address1" name="address1" placeholder="Street address" required maxlength="100">
                        <div id="cb_address1_counter" class="char-counter">0/100</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="cb_address2">Address Line 2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="cb_address2" name="address2" placeholder="Apartment, suite, etc." maxlength="100">
                        <div id="cb_address2_counter" class="char-counter">0/100</div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_city">City <span class="required">*</span></label>
                            <input type="text" id="cb_city" name="city" placeholder="Mumbai" required maxlength="50">
                            <div id="cb_city_counter" class="char-counter">0/50</div>
                        </div>
                        <div class="form-group">
                            <label for="cb_state">State <span class="required">*</span></label>
                            <input type="text" id="cb_state" name="state" placeholder="Maharashtra" required maxlength="50">
                            <div id="cb_state_counter" class="char-counter">0/50</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_country">Country <span class="required">*</span></label>
                            <input type="text" id="cb_country" name="country" placeholder="India" required maxlength="50">
                            <div id="cb_country_counter" class="char-counter">0/50</div>
                        </div>
                        <div class="form-group">
                            <label for="cb_zipcode">ZIP Code <span class="required">*</span></label>
                            <input type="text" id="cb_zipcode" name="zipcode" placeholder="400001" required maxlength="20">
                            <div id="cb_zipcode_counter" class="char-counter">0/20</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="cb_buyer_type">Buyer Type <span class="optional">(Optional)</span></label>
                        <select id="cb_buyer_type" name="buyer_type_business">
                            <option value="">Select buyer type</option>
                            <option value="0" selected>Individual</option>
                            <option value="1">Business</option>
                        </select>
                    </div>
                </div>
                
                <!-- UDF Parameters - One-time Payment -->
                <div class="section udf-section" id="cb-onetime-udf-section">
                    <h2 class="section-title">UDF Parameters (User Defined Fields)</h2>
                    
                    <div class="alert alert-info">
                        <strong>UDF Information:</strong> These fields provide additional transaction details required for compliance and processing.
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_udf1_input">UDF1 - PAN Number <span class="optional">(Optional)</span></label>
                            <input type="text" id="cb_udf1_input" name="udf1_input" placeholder="AAAPZ1234C" maxlength="255">
                            <div id="cb_udf1_input_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="cb_udf2_input">UDF2 - Additional Info <span class="optional">(Optional)</span></label>
                            <input type="text" id="cb_udf2_input" name="udf2_input" placeholder="Any additional information" maxlength="255">
                            <div id="cb_udf2_input_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_udf3_input">UDF3 - Buyer's DOB <span class="optional">(Recommended)</span></label>
                            <input type="text" id="cb_udf3_input" name="udf3_input" placeholder="YYYY-MM-DD" maxlength="255">
                            <div id="cb_udf3_input_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="cb_udf4_input">UDF4 - Seller Name <span class="optional">(Optional)</span></label>
                            <input type="text" id="cb_udf4_input" name="udf4_input" placeholder="Required for PA2PA PACB" maxlength="255">
                            <div id="cb_udf4_input_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="cb_udf5_input">UDF5 - Invoice ID <span class="required">*</span></label>
                        <input type="text" id="cb_udf5_input" name="udf5_input" placeholder="Required for PACB" required maxlength="255">
                        <div id="cb_udf5_input_counter" class="char-counter">0/255</div>
                    </div>
                    
                    <!-- UDF Params Section (UDF7 & UDF8) for Cross-Border Compliance -->
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #2d3748;">
                            <input type="checkbox" id="cb_enable_udf_params" onchange="toggleUdfParams('crossborder', 'onetime')" style="width: 18px; height: 18px; cursor: pointer;">
                            Enable UDF Params (UDF7 & UDF8) for Import/Export Compliance
                        </label>
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem; margin-left: 26px;">
                            Check this to include additional cross-border compliance parameters (Import/Export Code & Airway Bill Number). Uncheck for backward compatibility.
                        </small>
                    </div>
                    
                    <div id="cb-udf-params-fields" style="display: none; margin-top: 1rem; padding: 1rem; background: #f7fafc; border-radius: 8px; border-left: 4px solid #10846D;">
                        <h4 style="margin: 0 0 1rem 0; color: #10846D; font-size: 1rem;">Cross-Border Compliance Parameters</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cb_udf7_input">UDF7 - Import/Export Code <span class="optional">(Optional)</span></label>
                                <input type="text" id="cb_udf7_input" name="udf7_input" placeholder="e.g., 0100000029" maxlength="255">
                                <div id="cb_udf7_input_counter" class="char-counter">0/255</div>
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Import or Export Code of the buyer</small>
                            </div>
                            <div class="form-group">
                                <label for="cb_udf8_input">UDF8 - Airway Bill / Consignment Number <span class="optional">(Optional)</span></label>
                                <input type="text" id="cb_udf8_input" name="udf8_input" placeholder="e.g., 99953729071" maxlength="255">
                                <div id="cb_udf8_input_counter" class="char-counter">0/255</div>
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Airway Bill Number / Consignment Number (for goods imports)</small>
                            </div>
                        </div>
                        
                        <div class="alert alert-info" style="margin-top: 1rem; margin-bottom: 0;">
                            <strong>UDF Params Format:</strong> When enabled, these values will be sent as JSON in the <code>udf_params</code> parameter: <code>{"udf7":"value", "udf8":"value"}</code>
                        </div>
                    </div>
                </div>
                
                <!-- UDF Parameters - Subscription Payment -->
                <div class="section udf-section hidden" id="cb-subscription-udf-section">
                    <h2 class="section-title">UDF Parameters (Subscription)</h2>
                    
                    <div class="alert alert-info">
                        <strong>Subscription UDF Requirements:</strong> These fields are specifically required for subscription payments.
                        <br><br>
                        <strong>Conditional Validation:</strong>
                        <ul style="margin: 0.5rem 0 0 1.5rem;">
                            <li>If <strong>UPI</strong> payment method is enforced: <strong>UDF3 is mandatory</strong></li>
                            <li>If <strong>other payment methods</strong> (not UPI) are enforced: <strong>UDF5 is mandatory</strong></li>
                            <li>If <strong>no payment method</strong> is enforced: Use Udf update API with respect to the paymode.</li>
                        </ul>
                    </div>
                    
                    <div class="form-group">
                        <label for="cb_sub_udf1_input">UDF1 - PAN & DOB <span class="optional">(Required if AD bank requests)</span></label>
                        <input type="text" id="cb_sub_udf1_input" name="sub_udf1_input" placeholder="AAAPZ1234C||22/08/1972" maxlength="255">
                        <div id="cb_sub_udf1_input_counter" class="char-counter">0/255</div>
                        <small style="color: var(--text-tertiary);">Format: PAN||DOB (DD/MM/YYYY)</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="cb_sub_udf2_input">UDF2 - Additional Info <span class="optional">(Optional)</span></label>
                        <input type="text" id="cb_sub_udf2_input" name="sub_udf2_input" placeholder="Any additional information" maxlength="255">
                        <div id="cb_sub_udf2_input_counter" class="char-counter">0/255</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="cb_sub_udf3_input">UDF3 - Invoice ID & Merchant Name <span class="optional">(Required if UPI enforced)</span></label>
                        <input type="text" id="cb_sub_udf3_input" name="sub_udf3_input" placeholder="INV-123_1231||MerchantName" maxlength="255">
                        <div id="cb_sub_udf3_input_counter" class="char-counter">0/255</div>
                        <small style="color: var(--text-tertiary);">Format: InvoiceID||MerchantName (Mandatory when UPI is enforced)</small>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_sub_udf4_input">UDF4 - Additional Field <span class="optional">(Optional)</span></label>
                            <input type="text" id="cb_sub_udf4_input" name="sub_udf4_input" placeholder="Additional field" maxlength="255">
                            <div id="cb_sub_udf4_input_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="cb_sub_udf5_input">UDF5 - Additional Field <span class="optional">(Required if non-UPI payment enforced)</span></label>
                            <input type="text" id="cb_sub_udf5_input" name="sub_udf5_input" placeholder="Additional field" maxlength="255">
                            <div id="cb_sub_udf5_input_counter" class="char-counter">0/255</div>
        </div>
                    </div>
                    
                    <!-- UDF Params Section (UDF7 & UDF8) for Cross-Border Subscription Compliance -->
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 600; color: #2d3748;">
                            <input type="checkbox" id="cb_sub_enable_udf_params" onchange="toggleUdfParams('crossborder', 'subscription')" style="width: 18px; height: 18px; cursor: pointer;">
                            Enable UDF Params (UDF7 & UDF8) for Import/Export Compliance
                        </label>
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem; margin-left: 26px;">
                            Check this to include additional cross-border compliance parameters (Import/Export Code & Airway Bill Number). Uncheck for backward compatibility.
                        </small>
                    </div>
                    
                    <div id="cb-sub-udf-params-fields" style="display: none; margin-top: 1rem; padding: 1rem; background: #f7fafc; border-radius: 8px; border-left: 4px solid #10846D;">
                        <h4 style="margin: 0 0 1rem 0; color: #10846D; font-size: 1rem;">Cross-Border Compliance Parameters</h4>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="cb_sub_udf7_input">UDF7 - Import/Export Code <span class="optional">(Optional)</span></label>
                                <input type="text" id="cb_sub_udf7_input" name="sub_udf7_input" placeholder="e.g., 0100000029" maxlength="255">
                                <div id="cb_sub_udf7_input_counter" class="char-counter">0/255</div>
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Import or Export Code of the buyer</small>
                            </div>
                            <div class="form-group">
                                <label for="cb_sub_udf8_input">UDF8 - Airway Bill / Consignment Number <span class="optional">(Optional)</span></label>
                                <input type="text" id="cb_sub_udf8_input" name="sub_udf8_input" placeholder="e.g., 99953729071" maxlength="255">
                                <div id="cb_sub_udf8_input_counter" class="char-counter">0/255</div>
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Airway Bill Number / Consignment Number (for goods imports)</small>
                            </div>
                        </div>
                        
                        <div class="alert alert-info" style="margin-top: 1rem; margin-bottom: 0;">
                            <strong>UDF Params Format:</strong> When enabled, these values will be sent as JSON in the <code>udf_params</code> parameter: <code>{"udf7":"value", "udf8":"value"}</code>
                        </div>
                    </div>
                </div>
                
                <!-- Redirect URLs -->
                <div class="section">
                    <h2 class="section-title">Redirect URLs</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="cb_surl">Success URL <span class="required">*</span></label>
                            <input type="url" id="cb_surl" name="surl" required maxlength="255">
                            <div id="cb_surl_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="cb_furl">Failure URL <span class="required">*</span></label>
                            <input type="url" id="cb_furl" name="furl" required maxlength="255">
                            <div id="cb_furl_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="pay-button-wrapper">
                    <div class="left-buttons">
                        <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="button-group">
                        <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/integrate-cross-border-payments-for-payubiz', '_blank')">
                            <i class="fas fa-book"></i> Document
                        </button>
                        <button type="button" class="button debug-button" onclick="showDebugInfo('crossborder')">Show Debug Info</button>
                        <button type="button" class="button debug-button" onclick="showCurlCommand('crossborder')">Generate CURL</button>
                        <button type="button" class="button code-gen-button" onclick="showCodeGeneratorModal('crossborder')">Generate Code</button>
                        <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                            <i class="fas fa-credit-card"></i> Test Card Details
                        </button>
                        <button type="button" class="button" onclick="submitPayment('crossborder')">Pay Now</button>
                    </div>
                </div>
            </div>
            
            <!-- Debug Section -->
            <div class="debug-section" id="cb-debugSection">
                <h3 class="debug-title">Debug Information</h3>
                <div id="cb-debugContent"></div>
            </div>
            
            <!-- CURL Section -->
            <div class="curl-section" id="cb-curlSection">
                <h3>CURL Command</h3>
                <button class="copy-button" onclick="copyCurlToClipboard('crossborder')">Copy to Clipboard</button>
                <div class="curl-content" id="cb-curlContent"></div>
            </div>
        </div>
        
        <!-- Non-Seamless Checkout Flow -->
        <div class="flow-content" id="nonseamlessFlow">
            <div class="flow-title">
                <h2>PayU Hosted Checkout</h2>
            </div>
            
            <div class="main-content">
                <!-- Configuration Settings -->
                <div class="section">
                    <h2 class="section-title">Configuration Settings</h2>
                    
                    <div class="alert alert-info">
                        <strong>PreBuilt Checkout:</strong> PayU's standard checkout page with built-in payment UI.
                    </div>
                    
                    <!-- Custom Key/Salt Toggle -->
                    <div class="custom-key-toggle">
                        <label>
                            <input type="checkbox" id="ns_use_custom_keys" onchange="toggleCustomKeys('nonseamless')">
                            Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                        </label>
                        <div class="custom-key-fields" id="ns-custom-key-fields">
                            <div class="form-group">
                                <label for="ns_custom_key">Custom Merchant Key <span class="required">*</span></label>
                                <input type="text" id="ns_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                            </div>
                            <div class="form-group">
                                <label for="ns_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                                <div style="position: relative;">
                                    <input type="password" id="ns_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                    <button type="button" onclick="toggleSaltVisibility('nonseamless')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Enforce Payment Methods <span class="optional">(Optional)</span></label>
                        <div class="payment-methods">
                            <div class="payment-method">
                                <input type="checkbox" id="ns_cc" name="ns_paymethod" value="CC">
                                <label for="ns_cc">Credit Cards</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="ns_dc" name="ns_paymethod" value="DC">
                                <label for="ns_dc">Debit Cards</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="ns_nb" name="ns_paymethod" value="NB">
                                <label for="ns_nb">Net Banking</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="ns_upi" name="ns_paymethod" value="UPI">
                                <label for="ns_upi">UPI</label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Saved Card Feature Toggle -->
                    <div class="custom-key-toggle">
                        <label>
                            <input type="checkbox" id="ns_enable_saved_card" onchange="toggleSavedCardField('nonseamless')">
                            Enable Saved Card Feature <span class="optional">(Optional)</span>
                        </label>
                        <div class="custom-key-fields" id="ns-saved-card-field">
                            <div class="form-group">
                                <label for="ns_user_credentials">User Credentials</label>
                                <input type="text" id="ns_user_credentials" name="user_credentials" placeholder="MerchantKey:UniqueUserIdentifier" maxlength="50">
                                <div id="ns_user_credentials_counter" class="char-counter">0/50</div>
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">
                                    Format: MerchantKey:UniqueUserIdentifier (e.g., a4vGC2:user123) - Used for card tokenization and managing saved cards
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Details -->
                <div class="section">
                    <h2 class="section-title">Payment Details</h2>
                    
                    <!-- Transaction ID Display (Auto-Generated) -->
                    <div class="form-group">
                        <label for="ns_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                        <input type="text" id="ns_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                        <span class="char-counter" id="ns_txnid_display_counter">0/25</span>
                    </div>
                    
                    <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                    <div class="form-group" id="ns-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                        <button type="button" class="button template-button" id="ns_generate_template_btn" onclick="generateTemplate('nonseamless')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                            🔄 Fill with Sample Data
                        </button>
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ns_amount">Amount <span class="required">*</span></label>
                            <input type="number" id="ns_amount" name="amount" step="0.01" placeholder="100.00" required>
                        </div>
                        <div class="form-group">
                            <label for="ns_productinfo">Product Info <span class="required">*</span></label>
                            <input type="text" id="ns_productinfo" name="productinfo" placeholder="Product or service description" required maxlength="100">
                            <div id="ns_productinfo_counter" class="char-counter">0/100</div>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Customer Details</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ns_firstname">First Name <span class="required">*</span></label>
                            <input type="text" id="ns_firstname" name="firstname" placeholder="John" required maxlength="60">
                            <div id="ns_firstname_counter" class="char-counter">0/60</div>
                        </div>
                        <div class="form-group">
                            <label for="ns_lastname">Last Name <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_lastname" name="lastname" placeholder="Doe" maxlength="20">
                            <div id="ns_lastname_counter" class="char-counter">0/20</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ns_email">Email <span class="required">*</span></label>
                            <input type="email" id="ns_email" name="email" placeholder="john.doe@example.com" required maxlength="50">
                            <div id="ns_email_counter" class="char-counter">0/50</div>
                            <div id="ns-email-error" class="error-message" style="display: none;"></div>
                        </div>
                        <div class="form-group">
                            <label for="ns_phone">Phone (10 digits) <span class="required">*</span></label>
                            <input type="text" id="ns_phone" name="phone" placeholder="9876543210" required maxlength="10" pattern="[0-9]{10}">
                            <div id="ns-phone-error" class="error-message" style="display: none;"></div>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Address Details <span class="optional">(Optional)</span></h3>
                    
                    <div class="form-group">
                        <label for="ns_address1">Address Line 1 <span class="optional">(Optional)</span></label>
                        <input type="text" id="ns_address1" name="address1" placeholder="Street address" maxlength="100">
                        <div id="ns_address1_counter" class="char-counter">0/100</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="ns_address2">Address Line 2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="ns_address2" name="address2" placeholder="Apartment, suite, etc." maxlength="100">
                        <div id="ns_address2_counter" class="char-counter">0/100</div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ns_city">City <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_city" name="city" placeholder="Mumbai" maxlength="50">
                            <div id="ns_city_counter" class="char-counter">0/50</div>
                        </div>
                        <div class="form-group">
                            <label for="ns_state">State <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_state" name="state" placeholder="Maharashtra" maxlength="50">
                            <div id="ns_state_counter" class="char-counter">0/50</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ns_country">Country <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_country" name="country" placeholder="India" maxlength="50">
                            <div id="ns_country_counter" class="char-counter">0/50</div>
                        </div>
                        <div class="form-group">
                            <label for="ns_zipcode">ZIP Code <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_zipcode" name="zipcode" placeholder="400001" maxlength="20">
                            <div id="ns_zipcode_counter" class="char-counter">0/20</div>
                        </div>
                    </div>
                </div>
                
                <!-- UDF Parameters -->
                <div class="section">
                    <h2 class="section-title">UDF Parameters (Optional)</h2>
                    
                    <div class="alert alert-info">
                        <strong>UDF Information:</strong> User Defined Fields for custom data - all optional.
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ns_udf1">UDF1 <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_udf1" name="udf1" placeholder="User defined field 1" maxlength="255">
                            <div id="ns_udf1_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="ns_udf2">UDF2 <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_udf2" name="udf2" placeholder="User defined field 2" maxlength="255">
                            <div id="ns_udf2_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ns_udf3">UDF3 <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_udf3" name="udf3" placeholder="User defined field 3" maxlength="255">
                            <div id="ns_udf3_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="ns_udf4">UDF4 <span class="optional">(Optional)</span></label>
                            <input type="text" id="ns_udf4" name="udf4" placeholder="User defined field 4" maxlength="255">
                            <div id="ns_udf4_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="ns_udf5">UDF5 <span class="optional">(Optional)</span></label>
                        <input type="text" id="ns_udf5" name="udf5" placeholder="User defined field 5" maxlength="255">
                        <div id="ns_udf5_counter" class="char-counter">0/255</div>
                    </div>
                </div>
                
                <!-- Redirect URLs -->
                <div class="section">
                    <h2 class="section-title">Redirect URLs</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ns_surl">Success URL <span class="required">*</span></label>
                            <input type="url" id="ns_surl" name="surl" required maxlength="255">
                            <div id="ns_surl_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="ns_furl">Failure URL <span class="required">*</span></label>
                            <input type="url" id="ns_furl" name="furl" required maxlength="255">
                            <div id="ns_furl_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="pay-button-wrapper">
                    <div class="left-buttons">
                        <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="button-group">
                        <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/prebuilt-checkout-payu-hosted', '_blank')">
                            <i class="fas fa-book"></i> Document
                        </button>
                        <button type="button" class="button debug-button" onclick="showDebugInfo('nonseamless')">Show Debug Info</button>
                        <button type="button" class="button debug-button" onclick="showCurlCommand('nonseamless')">Generate CURL</button>
                        <button type="button" class="button code-gen-button" onclick="showCodeGeneratorModal('nonseamless')">Generate Code</button>
                        <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                            <i class="fas fa-credit-card"></i> Test Card Details
                        </button>
                        <button type="button" class="button" onclick="submitPayment('nonseamless')">Pay Now</button>
                    </div>
                </div>
            </div>
            
            <!-- Debug Section -->
            <div class="debug-section" id="ns-debugSection">
                <h3 class="debug-title">Debug Information</h3>
                <div id="ns-debugContent"></div>
            </div>
            
            <!-- CURL Section -->
            <div class="curl-section" id="ns-curlSection">
                <h3>CURL Command</h3>
                <button class="copy-button" onclick="copyCurlToClipboard('nonseamless')">Copy to Clipboard</button>
                <div class="curl-content" id="ns-curlContent"></div>
            </div>
        </div>
        
        <!-- Subscription Flow -->
        <div class="flow-content" id="subscriptionFlow">
            <div class="flow-title">
                <h2>PayU Hosted Checkout Subscription</h2>
            </div>
            
            <div class="main-content">
                <!-- Configuration Settings -->
                <div class="section">
                    <h2 class="section-title">Configuration Settings</h2>
                    
                    <div class="alert alert-info">
                        <strong>Subscription/Recurring Payment:</strong> This flow is for setting up recurring payments with customer consent.
                    </div>
                    
                    <!-- Custom Key/Salt Toggle -->
                    <div class="custom-key-toggle">
                        <label>
                            <input type="checkbox" id="sub_use_custom_keys" onchange="toggleCustomKeys('subscription')">
                            Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                        </label>
                        <div class="custom-key-fields" id="sub-custom-key-fields">
                            <div class="form-group">
                                <label for="sub_custom_key">Custom Merchant Key <span class="required">*</span></label>
                                <input type="text" id="sub_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                            </div>
                            <div class="form-group">
                                <label for="sub_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                                <div style="position: relative;">
                                    <input type="password" id="sub_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                    <button type="button" onclick="toggleSaltVisibility('subscription')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Subscription Configuration -->
                    <div class="form-group">
                        <h3 style="color: var(--accent-primary); margin-bottom: 1rem;">Subscription Configuration</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="sub_billing_amount">Billing Amount <span class="required">*</span></label>
                                <input type="number" id="sub_billing_amount" name="billing_amount" placeholder="Enter billing amount" min="1" step="0.01" required>
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Amount to be charged per billing cycle</small>
                            </div>
                            <div class="form-group">
                                <label for="sub_billing_currency">Billing Currency <span class="required">*</span></label>
                                <input type="text" id="sub_billing_currency" name="billing_currency" value="INR" readonly style="background-color: #f0f0f0; cursor: not-allowed;">
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Currency is fixed to INR</small>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="sub_billing_cycle">Billing Cycle <span class="required">*</span></label>
                                <select id="sub_billing_cycle" name="billing_cycle">
                                    <option value="MONTHLY">Monthly</option>
                                    <option value="YEARLY">Yearly</option>
                                    <option value="WEEKLY">Weekly</option>
                                    <option value="ADHOC">Ad-hoc</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="sub_billing_interval">Billing Interval <span class="required">*</span></label>
                                <input type="number" id="sub_billing_interval" name="billing_interval" value="1" min="1">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="sub_payment_start_date">Payment Start Date <span class="required">*</span></label>
                                <input type="date" id="sub_payment_start_date" name="payment_start_date" onchange="validateSubscriptionStartDate('subscription')">
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Select today's date or future dates only. Note: For eNACH payments, select tomorrow's date.</small>
                            </div>
                            <div class="form-group">
                                <label for="sub_payment_end_date">Payment End Date <span class="required">*</span></label>
                                <input type="date" id="sub_payment_end_date" name="payment_end_date" required>
                            </div>
                        </div>
                        
                        <!-- Pre-filled Subscription Parameters -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="sub_si">SI (Stored Instrument) <span style="color: #48bb78;">(Pre-filled)</span></label>
                                <input type="text" id="sub_si" name="si" value="1" readonly style="background-color: #f0f0f0; cursor: not-allowed;">
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Mandatory for subscription payments (always 1)</small>
                            </div>
                            <div class="form-group">
                                <label for="sub_api_version">API Version <span style="color: #48bb78;">(Pre-filled)</span></label>
                                <input type="text" id="sub_api_version" name="api_version" value="7" readonly style="background-color: #f0f0f0; cursor: not-allowed;">
                                <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Mandatory for subscription payments (always 7)</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Enforce Payment Methods <span class="optional">(Optional)</span></label>
                        <div class="payment-methods">
                            <div class="payment-method">
                                <input type="checkbox" id="sub_cc" name="sub_paymethod" value="CC">
                                <label for="sub_cc">Credit Cards</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="sub_dc" name="sub_paymethod" value="DC">
                                <label for="sub_dc">Debit Cards</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="sub_nb" name="sub_paymethod" value="NB">
                                <label for="sub_nb">Net Banking (eNACH)</label>
                            </div>
                            <div class="payment-method">
                                <input type="checkbox" id="sub_upi" name="sub_paymethod" value="UPI">
                                <label for="sub_upi">UPI</label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Payment Details -->
                <div class="section">
                    <h2 class="section-title">Payment Details</h2>
                    
                    <!-- Transaction ID Display (Auto-Generated) -->
                    <div class="form-group">
                        <label for="sub_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                        <input type="text" id="sub_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                        <span class="char-counter" id="sub_txnid_display_counter">0/25</span>
                    </div>
                    
                    <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                    <div class="form-group" id="sub-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                        <button type="button" class="button template-button" id="sub_generate_template_btn" onclick="generateTemplate('subscription')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                            🔄 Fill with Sample Data
                        </button>
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sub_amount">Amount <span class="required">*</span></label>
                            <input type="number" id="sub_amount" name="amount" step="0.01" placeholder="100.00" required>
                            <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Note: For eNACH payments, use transaction amount as 1.</small>
                        </div>
                        <div class="form-group">
                            <label for="sub_productinfo">Product Info <span class="required">*</span></label>
                            <input type="text" id="sub_productinfo" name="productinfo" placeholder="Product or service description" required maxlength="100">
                            <div id="sub_productinfo_counter" class="char-counter">0/100</div>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Customer Details</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sub_firstname">First Name <span class="required">*</span></label>
                            <input type="text" id="sub_firstname" name="firstname" placeholder="John" required maxlength="60">
                            <div id="sub_firstname_counter" class="char-counter">0/60</div>
                        </div>
                        <div class="form-group">
                            <label for="sub_lastname">Last Name <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_lastname" name="lastname" placeholder="Doe" maxlength="20">
                            <div id="sub_lastname_counter" class="char-counter">0/20</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sub_email">Email <span class="required">*</span></label>
                            <input type="email" id="sub_email" name="email" placeholder="john.doe@example.com" required maxlength="50">
                            <div id="sub_email_counter" class="char-counter">0/50</div>
                            <div id="sub-email-error" class="error-message" style="display: none;"></div>
                        </div>
                        <div class="form-group">
                            <label for="sub_phone">Phone (10 digits) <span class="required">*</span></label>
                            <input type="text" id="sub_phone" name="phone" placeholder="9876543210" required maxlength="10" pattern="[0-9]{10}">
                            <div id="sub-phone-error" class="error-message" style="display: none;"></div>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Address Details <span class="optional">(Optional)</span></h3>
                    
                    <div class="form-group">
                        <label for="sub_address1">Address Line 1 <span class="optional">(Optional)</span></label>
                        <input type="text" id="sub_address1" name="address1" placeholder="Street address" maxlength="100">
                        <div id="sub_address1_counter" class="char-counter">0/100</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="sub_address2">Address Line 2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="sub_address2" name="address2" placeholder="Apartment, suite, etc." maxlength="100">
                        <div id="sub_address2_counter" class="char-counter">0/100</div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sub_city">City <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_city" name="city" placeholder="Mumbai" maxlength="50">
                            <div id="sub_city_counter" class="char-counter">0/50</div>
                        </div>
                        <div class="form-group">
                            <label for="sub_state">State <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_state" name="state" placeholder="Maharashtra" maxlength="50">
                            <div id="sub_state_counter" class="char-counter">0/50</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sub_country">Country <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_country" name="country" placeholder="India" maxlength="50">
                            <div id="sub_country_counter" class="char-counter">0/50</div>
                        </div>
                        <div class="form-group">
                            <label for="sub_zipcode">ZIP Code <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_zipcode" name="zipcode" placeholder="400001" maxlength="20">
                            <div id="sub_zipcode_counter" class="char-counter">0/20</div>
                        </div>
                    </div>
                </div>
                
                <!-- UDF Parameters -->
                <div class="section">
                    <h2 class="section-title">UDF Parameters</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sub_udf1">UDF1 <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_udf1" name="udf1" placeholder="" maxlength="255">
                            <div id="sub_udf1_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="sub_udf2">UDF2 <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_udf2" name="udf2" placeholder="" maxlength="255">
                            <div id="sub_udf2_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sub_udf3">UDF3 <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_udf3" name="udf3" placeholder="" maxlength="255">
                            <div id="sub_udf3_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="sub_udf4">UDF4 <span class="optional">(Optional)</span></label>
                            <input type="text" id="sub_udf4" name="udf4" placeholder="" maxlength="255">
                            <div id="sub_udf4_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="sub_udf5">UDF5 <span class="optional">(Optional)</span></label>
                        <input type="text" id="sub_udf5" name="udf5" placeholder="" maxlength="255">
                        <div id="sub_udf5_counter" class="char-counter">0/255</div>
                    </div>
                </div>
                
                <!-- Redirect URLs -->
                <div class="section">
                    <h2 class="section-title">Redirect URLs</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sub_surl">Success URL <span class="required">*</span></label>
                            <input type="url" id="sub_surl" name="surl" required maxlength="255">
                            <div id="sub_surl_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="sub_furl">Failure URL <span class="required">*</span></label>
                            <input type="url" id="sub_furl" name="furl" required maxlength="255">
                            <div id="sub_furl_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="pay-button-wrapper">
                    <div class="left-buttons">
                        <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="button-group">
                        <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/introduction-recurring-payments-integration', '_blank')">
                            <i class="fas fa-book"></i> Document
                        </button>
                        <button type="button" class="button debug-button" onclick="showDebugInfo('subscription')">Show Debug Info</button>
                        <button type="button" class="button debug-button" onclick="showCurlCommand('subscription')">Generate CURL</button>
                        <button type="button" class="button code-gen-button" onclick="showCodeGeneratorModal('subscription')">Generate Code</button>
                        <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                            <i class="fas fa-credit-card"></i> Test Card Details
                        </button>
                        <button type="button" class="button" onclick="submitPayment('subscription')">Pay Now</button>
                    </div>
                </div>
            </div>
            
            <!-- Debug Section -->
            <div class="debug-section" id="sub-debugSection">
                <h3 class="debug-title">Debug Information</h3>
                <div id="sub-debugContent"></div>
            </div>
            
            <!-- CURL Section -->
            <div class="curl-section" id="sub-curlSection">
                <h3>CURL Command</h3>
                <button class="copy-button" onclick="copyCurlToClipboard('subscription')">Copy to Clipboard</button>
                <div class="curl-content" id="sub-curlContent"></div>
            </div>
        </div>
    </div>
    
    <!-- Hidden Forms -->
    <form id="cb_payu_form" method="post" action="https://test.payu.in/_payment" style="display: none;">
        <input type="hidden" id="cb_key" name="key">
        <input type="hidden" id="cb_txnid" name="txnid">
        <input type="hidden" id="cb_amount_hidden" name="amount">
        <input type="hidden" id="cb_productinfo_hidden" name="productinfo">
        <input type="hidden" id="cb_firstname_hidden" name="firstname">
        <input type="hidden" id="cb_lastname_hidden" name="lastname">
        <input type="hidden" id="cb_email_hidden" name="email">
        <input type="hidden" id="cb_phone_hidden" name="phone">
        <input type="hidden" id="cb_address1_hidden" name="address1">
        <input type="hidden" id="cb_address2_hidden" name="address2">
        <input type="hidden" id="cb_city_hidden" name="city">
        <input type="hidden" id="cb_state_hidden" name="state">
        <input type="hidden" id="cb_country_hidden" name="country">
        <input type="hidden" id="cb_zipcode_hidden" name="zipcode">
        <input type="hidden" id="cb_udf1" name="udf1">
        <input type="hidden" id="cb_udf2" name="udf2">
        <input type="hidden" id="cb_udf3" name="udf3">
        <input type="hidden" id="cb_udf4" name="udf4">
        <input type="hidden" id="cb_udf5" name="udf5">
        <input type="hidden" id="cb_surl_hidden" name="surl">
        <input type="hidden" id="cb_furl_hidden" name="furl">
        <input type="hidden" id="cb_hash" name="hash">
        <input type="hidden" id="cb_enforce_paymethod" name="enforce_paymethod">
        <input type="hidden" id="cb_si_hidden" name="si">
        <input type="hidden" id="cb_api_version_hidden" name="api_version">
        <input type="hidden" id="cb_si_details" name="si_details">
    </form>
    
    <form id="ns_payu_form" method="post" action="https://test.payu.in/_payment" style="display: none;">
        <input type="hidden" id="ns_key" name="key">
        <input type="hidden" id="ns_txnid" name="txnid">
        <input type="hidden" id="ns_amount_hidden" name="amount">
        <input type="hidden" id="ns_productinfo_hidden" name="productinfo">
        <input type="hidden" id="ns_firstname_hidden" name="firstname">
        <input type="hidden" id="ns_lastname_hidden" name="lastname">
        <input type="hidden" id="ns_email_hidden" name="email">
        <input type="hidden" id="ns_phone_hidden" name="phone">
        <input type="hidden" id="ns_address1_hidden" name="address1">
        <input type="hidden" id="ns_address2_hidden" name="address2">
        <input type="hidden" id="ns_city_hidden" name="city">
        <input type="hidden" id="ns_state_hidden" name="state">
        <input type="hidden" id="ns_country_hidden" name="country">
        <input type="hidden" id="ns_zipcode_hidden" name="zipcode">
        <input type="hidden" id="ns_udf1_hidden" name="udf1">
        <input type="hidden" id="ns_udf2_hidden" name="udf2">
        <input type="hidden" id="ns_udf3_hidden" name="udf3">
        <input type="hidden" id="ns_udf4_hidden" name="udf4">
        <input type="hidden" id="ns_udf5_hidden" name="udf5">
        <input type="hidden" id="ns_surl_hidden" name="surl">
        <input type="hidden" id="ns_furl_hidden" name="furl">
        <input type="hidden" id="ns_hash" name="hash">
        <input type="hidden" id="ns_enforce_paymethod" name="enforce_paymethod">
    </form>
    
    <form id="sub_payu_form" method="post" action="https://test.payu.in/_payment" style="display: none;">
        <input type="hidden" id="sub_key" name="key">
        <input type="hidden" id="sub_txnid" name="txnid">
        <input type="hidden" id="sub_amount_hidden" name="amount">
        <input type="hidden" id="sub_productinfo_hidden" name="productinfo">
        <input type="hidden" id="sub_firstname_hidden" name="firstname">
        <input type="hidden" id="sub_lastname_hidden" name="lastname">
        <input type="hidden" id="sub_email_hidden" name="email">
        <input type="hidden" id="sub_phone_hidden" name="phone">
        <input type="hidden" id="sub_address1_hidden" name="address1">
        <input type="hidden" id="sub_address2_hidden" name="address2">
        <input type="hidden" id="sub_city_hidden" name="city">
        <input type="hidden" id="sub_state_hidden" name="state">
        <input type="hidden" id="sub_country_hidden" name="country">
        <input type="hidden" id="sub_zipcode_hidden" name="zipcode">
        <input type="hidden" id="sub_udf1_hidden" name="udf1">
        <input type="hidden" id="sub_udf2_hidden" name="udf2">
        <input type="hidden" id="sub_udf3_hidden" name="udf3">
        <input type="hidden" id="sub_udf4_hidden" name="udf4">
        <input type="hidden" id="sub_udf5_hidden" name="udf5">
        <input type="hidden" id="sub_surl_hidden" name="surl">
        <input type="hidden" id="sub_furl_hidden" name="furl">
        <input type="hidden" id="sub_hash" name="hash">
        <input type="hidden" id="sub_enforce_paymethod" name="enforce_paymethod">
        <input type="hidden" id="sub_si" name="si">
        <input type="hidden" id="sub_api_version" name="api_version">
        <input type="hidden" id="sub_si_details" name="si_details">
    </form>
    
    <!-- TPV Flow (One Time) -->
    <div class="flow-content" id="tpvFlow">
        <div class="flow-title">
            <h2>PayU Hosted Checkout TPV</h2>
        </div>
        
        <div class="main-content">
            <!-- Configuration Settings -->
            <div class="section">
                <h2 class="section-title">Configuration Settings</h2>
                
                <!-- Payment Type Selection -->
                <div class="alert alert-info">
                    <strong>TPV Payment:</strong> Third Party Verification for Net Banking and UPI transactions with beneficiary account validation.
                </div>
                
                <!-- Custom Key/Salt Toggle -->
                <div class="custom-key-toggle">
                    <label>
                        <input type="checkbox" id="tpv_use_custom_keys" onchange="toggleCustomKeys('tpv')">
                        Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                    </label>
                    <div class="custom-key-fields" id="tpv-custom-key-fields">
                        <div class="form-group">
                            <label for="tpv_custom_key">Custom Merchant Key <span class="required">*</span></label>
                            <input type="text" id="tpv_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                        </div>
                        <div class="form-group">
                            <label for="tpv_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                            <div style="position: relative;">
                                <input type="password" id="tpv_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                <button type="button" onclick="toggleSaltVisibility('tpv')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Enforce Payment Methods <span class="optional">(Optional)</span></label>
                    <div class="payment-methods">
                        <div class="payment-method">
                            <input type="checkbox" id="tpv_upi" name="tpv_paymethod" value="UPI">
                            <label for="tpv_upi">UPI</label>
                        </div>
                        <div class="payment-method">
                            <input type="checkbox" id="tpv_nb" name="tpv_paymethod" value="NB">
                            <label for="tpv_nb">Net Banking</label>
                        </div>
                    </div>
                </div>
            </div>
                <!-- Payment Details -->
                <div class="section">
                    <h2 class="section-title">Payment Details</h2>
                    
                    <!-- Transaction ID Display (Auto-Generated) -->
                    <div class="form-group">
                        <label for="tpv_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                        <input type="text" id="tpv_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                        <span class="char-counter" id="tpv_txnid_display_counter">0/25</span>
                    </div>
                    
                    <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                    <div class="form-group" id="tpv-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                        <button type="button" class="button template-button" id="tpv_generate_template_btn" onclick="generateTemplate('tpv')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                            🔄 Fill with Sample Data
                        </button>
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tpv_amount">Amount <span class="required">*</span></label>
                            <input type="number" id="tpv_amount" name="amount" step="0.01" placeholder="100.00" required>
                        </div>
                        <div class="form-group">
                            <label for="tpv_productinfo">Product Info <span class="required">*</span></label>
                            <input type="text" id="tpv_productinfo" name="productinfo" placeholder="Product or service description" required maxlength="100">
                            <div id="tpv_productinfo_counter" class="char-counter">0/100</div>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Customer Details</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tpv_firstname">First Name <span class="required">*</span></label>
                            <input type="text" id="tpv_firstname" name="firstname" placeholder="John" required maxlength="60">
                            <div id="tpv_firstname_counter" class="char-counter">0/60</div>
                        </div>
                        <div class="form-group">
                            <label for="tpv_lastname">Last Name <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_lastname" name="lastname" placeholder="Doe" maxlength="20">
                            <div id="tpv_lastname_counter" class="char-counter">0/20</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tpv_email">Email <span class="required">*</span></label>
                            <input type="email" id="tpv_email" name="email" placeholder="john@example.com" required oninput="validateEmail('tpv')" maxlength="50">
                            <div id="tpv_email_counter" class="char-counter">0/50</div>
                            <div id="tpv-email-error" class="error-message" style="display: none;"></div>
                        </div>
                        <div class="form-group">
                            <label for="tpv_phone">Phone (10 digits) <span class="required">*</span></label>
                            <input type="tel" id="tpv_phone" name="phone" placeholder="9999999999" 
                                   maxlength="10" pattern="[0-9]{10}" required 
                                   oninput="validatePhone('tpv')">
                            <div id="tpv-phone-error" class="error-message" style="display: none;"></div>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Address Details <span class="optional">(Optional)</span></h3>
                    
                    <div class="form-group">
                        <label for="tpv_address1">Address Line 1 <span class="optional">(Optional)</span></label>
                        <input type="text" id="tpv_address1" name="address1" placeholder="Street address" maxlength="100">
                        <div id="tpv_address1_counter" class="char-counter">0/100</div>
                    </div>
                    
                    <div class="form-group">
                        <label for="tpv_address2">Address Line 2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="tpv_address2" name="address2" placeholder="Apartment, suite, etc." maxlength="100">
                        <div id="tpv_address2_counter" class="char-counter">0/100</div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tpv_city">City <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_city" name="city" placeholder="Mumbai" maxlength="50">
                            <div id="tpv_city_counter" class="char-counter">0/50</div>
                        </div>
                        <div class="form-group">
                            <label for="tpv_state">State <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_state" name="state" placeholder="Maharashtra" maxlength="50">
                            <div id="tpv_state_counter" class="char-counter">0/50</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tpv_country">Country <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_country" name="country" placeholder="India" maxlength="50">
                            <div id="tpv_country_counter" class="char-counter">0/50</div>
                        </div>
                        <div class="form-group">
                            <label for="tpv_zipcode">ZIP Code <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_zipcode" name="zipcode" placeholder="400001" maxlength="20">
                            <div id="tpv_zipcode_counter" class="char-counter">0/20</div>
                        </div>
                    </div>
                </div>
        
                <!-- Beneficiary Details (TPV Specific) -->
                <div class="section">
                    <h2 class="section-title">Beneficiary Details (TPV Validation)</h2>
                    <div class="alert alert-warning">
                        <strong>Note:</strong> You can add up to 4 beneficiary accounts. Multiple accounts should be separated by pipe (|) symbol in the same order.<br><br>
                        <strong>Example:</strong><br>
                        Account: 919013353419388|919013353419387<br>
                        IFSC: UTIB9992478|UTIB9992478
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tpv_beneficiary_account">Beneficiary Account Number(s) <span class="required">*</span></label>
                            <input type="text" id="tpv_beneficiary_account" name="beneficiary_account" 
                                   value="919013353419388" 
                                   placeholder="919013353419388" required>
                            <small style="color: var(--text-tertiary);">For multiple accounts, separate with pipe (|) - Max 4 accounts</small>
                        </div>
                        <div class="form-group">
                            <label for="tpv_ifsc_code">IFSC Code(s) <span class="required">*</span></label>
                            <input type="text" id="tpv_ifsc_code" name="ifsc_code" 
                                   value="UTIB9992478" 
                                   placeholder="UTIB9992478" required>
                            <small style="color: var(--text-tertiary);">For multiple IFSCs, separate with pipe (|) in same order</small>
                        </div>
                    </div>
                </div>
            
                <!-- TPV Configuration -->
                <div class="section">
                    <h2 class="section-title">TPV Configuration</h2>
                    <div class="form-group">
                        <label for="tpv_api_version_display">API Version <span class="required">*</span></label>
                        <input type="text" id="tpv_api_version_display" value="6" readonly 
                               style="background-color: #f5f5f5; cursor: not-allowed;">
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">
                            Mandatory for TPV payments (always 6)
                        </small>
                    </div>
                </div>
            
                <!-- UDF Parameters -->
                <div class="section udf-section">
                    <h2 class="section-title">UDF Parameters (User Defined Fields)</h2>
                    <div class="alert alert-info">
                        <strong>UDF Information:</strong> All UDF fields are optional for TPV transactions. Use these fields to pass additional transaction-specific data.
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tpv_udf1">UDF1 <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_udf1" name="udf1" placeholder="User defined field 1" maxlength="255">
                            <div id="tpv_udf1_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="tpv_udf2">UDF2 <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_udf2" name="udf2" placeholder="User defined field 2" maxlength="255">
                            <div id="tpv_udf2_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="tpv_udf3">UDF3 <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_udf3" name="udf3" placeholder="User defined field 3" maxlength="255">
                            <div id="tpv_udf3_counter" class="char-counter">0/255</div>
                        </div>
                        <div class="form-group">
                            <label for="tpv_udf4">UDF4 <span class="optional">(Optional)</span></label>
                            <input type="text" id="tpv_udf4" name="udf4" placeholder="User defined field 4" maxlength="255">
                            <div id="tpv_udf4_counter" class="char-counter">0/255</div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="tpv_udf5">UDF5 <span class="optional">(Optional)</span></label>
                        <input type="text" id="tpv_udf5" name="udf5" placeholder="User defined field 5" maxlength="255">
                        <div id="tpv_udf5_counter" class="char-counter">0/255</div>
                    </div>
                </div>
            </div>
            
            <!-- Redirect URLs -->
            <div class="section">
                <h2 class="section-title">Redirect URLs</h2>
                <div class="form-row">
                    <div class="form-group">
                        <label for="tpv_surl">Success URL <span class="required">*</span></label>
                        <input type="url" id="tpv_surl" name="surl" required maxlength="255">
                        <div id="tpv_surl_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="tpv_furl">Failure URL <span class="required">*</span></label>
                        <input type="url" id="tpv_furl" name="furl" required maxlength="255">
                        <div id="tpv_furl_counter" class="char-counter">0/255</div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="pay-button-wrapper">
                <div class="left-buttons">
                    <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                    </div>
                </div>
                <div class="button-group">
                    <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/payu-hosted-checkout-tpv-workflow', '_blank')">
                        <i class="fas fa-book"></i> Document
                    </button>
                    <button type="button" class="button debug-button" onclick="showDebugInfo('tpv')">Show Debug Info</button>
                    <button type="button" class="button debug-button" onclick="showCurlCommand('tpv')">Generate CURL</button>
                    <button type="button" class="button code-gen-button" onclick="showCodeGeneratorModal('tpv')">Generate Code</button>
                    <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                        <i class="fas fa-credit-card"></i> Test Card Details
                    </button>
                    <button type="button" class="button" onclick="submitPayment('tpv')">Pay Now</button>
                </div>
            </div>
        </div>
        
        <!-- Debug Section -->
        <div class="debug-section" id="tpv-debugSection">
            <h3 class="debug-title">Debug Information</h3>
            <div id="tpv-debugContent"></div>
        </div>
        
        <!-- CURL Section -->
        <div class="curl-section" id="tpv-curlSection">
            <h3>CURL Command</h3>
            <button class="copy-button" onclick="copyCurlToClipboard('tpv')">Copy to Clipboard</button>
            <div class="curl-content" id="tpv-curlContent"></div>
        </div>
    </div>
    
    <!-- UPI OTM Flow -->
    <div class="flow-content" id="upiotmFlow">
        <div class="flow-title">
            <h2>PayU Hosted Checkout UPI OTM</h2>
        </div>
        
        <div class="main-content">
            <!-- Configuration Settings -->
            <div class="section">
                <h2 class="section-title">Configuration Settings</h2>
                
                <div class="alert alert-info">
                    <strong>UPI One Time Mandate:</strong> Create a one-time pre-authorization for UPI payments. The mandate is valid for the specified date range (max 14 days).
                </div>
                
                <!-- Custom Key/Salt Toggle -->
                <div class="custom-key-toggle">
                    <label>
                        <input type="checkbox" id="upi_use_custom_keys" onchange="toggleCustomKeys('upiotm')">
                        Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                    </label>
                    <div class="custom-key-fields" id="upi-custom-key-fields">
                        <div class="form-group">
                            <label for="upi_custom_key">Custom Merchant Key <span class="required">*</span></label>
                            <input type="text" id="upi_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                        </div>
                        <div class="form-group">
                            <label for="upi_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                            <div style="position: relative;">
                                <input type="password" id="upi_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                <button type="button" onclick="toggleSaltVisibility('upiotm')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Mandate Date Configuration -->
                <div class="form-group">
                    <h3 style="color: var(--accent-primary); margin-bottom: 1rem;">Mandate Date Configuration</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="upi_payment_start_date">Payment Start Date <span class="required">*</span></label>
                            <input type="date" id="upi_payment_start_date" name="payment_start_date" onchange="validateUpiOtmStartDate(); validateUpiOtmDates()" required>
                            <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Select current or future date only</small>
                        </div>
                        <div class="form-group">
                            <label for="upi_payment_end_date">Payment End Date <span class="required">*</span></label>
                            <input type="date" id="upi_payment_end_date" name="payment_end_date" onchange="validateUpiOtmDates()" required>
                            <small style="color: var(--text-tertiary);">Max 14 days from start date</small>
                        </div>
                    </div>
                </div>
                
                <!-- UPI OTM Required Parameters -->
                <div class="form-row" style="margin-top: 1rem;">
                    <div class="form-group">
                        <label for="upi_api_version_display">API Version <span class="required">*</span></label>
                        <input type="text" id="upi_api_version_display" value="7" readonly 
                               style="background-color: #f5f5f5; cursor: not-allowed;">
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">
                            Mandatory for UPI OTM (always 7)
                        </small>
                    </div>
                    <div class="form-group">
                        <label for="upi_pre_authorize_display">Pre-Authorize <span class="required">*</span></label>
                        <input type="text" id="upi_pre_authorize_display" value="1" readonly 
                               style="background-color: #f5f5f5; cursor: not-allowed;">
                        <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">
                            Mandatory for UPI OTM (always 1)
                        </small>
                    </div>
                </div>
            </div>
            
            <!-- Payment Details -->
            <div class="section">
                <h2 class="section-title">Payment Details</h2>
                
                <div class="alert alert-info" style="margin-bottom: 1.5rem;">
                    <strong>Amount Condition:</strong> For Success Amount &gt;= Rs. 17,000
                </div>
                
                <!-- Transaction ID Display (Auto-Generated) -->
                <div class="form-group">
                    <label for="upi_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                    <input type="text" id="upi_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                    <span class="char-counter" id="upi_txnid_display_counter">0/25</span>
                </div>
                
                <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                <div class="form-group" id="upi-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                    <button type="button" class="button template-button" id="upi_generate_template_btn" onclick="generateTemplate('upiotm')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                        🔄 Fill with Sample Data
                    </button>
                    <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="upi_amount">Amount <span class="required">*</span></label>
                        <input type="number" id="upi_amount" name="amount" step="0.01" placeholder="100.00" value="17000" required>
                    </div>
                    <div class="form-group">
                        <label for="upi_productinfo">Product Info <span class="required">*</span></label>
                        <input type="text" id="upi_productinfo" name="productinfo" placeholder="Product or service description" required maxlength="100">
                        <div id="upi_productinfo_counter" class="char-counter">0/100</div>
                    </div>
                </div>
                
                <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Customer Details</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="upi_firstname">First Name <span class="required">*</span></label>
                        <input type="text" id="upi_firstname" name="firstname" placeholder="John" required maxlength="60">
                        <div id="upi_firstname_counter" class="char-counter">0/60</div>
                    </div>
                    <div class="form-group">
                        <label for="upi_lastname">Last Name <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_lastname" name="lastname" placeholder="Doe" maxlength="20">
                        <div id="upi_lastname_counter" class="char-counter">0/20</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="upi_email">Email <span class="required">*</span></label>
                        <input type="email" id="upi_email" name="email" placeholder="john.doe@example.com" required maxlength="50">
                        <div id="upi_email_counter" class="char-counter">0/50</div>
                        <div id="upi-email-error" class="error-message" style="display: none;"></div>
                    </div>
                    <div class="form-group">
                        <label for="upi_phone">Phone (10 digits) <span class="required">*</span></label>
                        <input type="text" id="upi_phone" name="phone" placeholder="9876543210" required maxlength="10" pattern="[0-9]{10}" oninput="validatePhone('upiotm')">
                        <div id="upi-phone-error" class="error-message" style="display: none;"></div>
                    </div>
                </div>
                
                <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Address Details <span class="optional">(Optional)</span></h3>
                
                <div class="form-group">
                    <label for="upi_address1">Address Line 1 <span class="optional">(Optional)</span></label>
                    <input type="text" id="upi_address1" name="address1" placeholder="Street address" maxlength="100">
                    <div id="upi_address1_counter" class="char-counter">0/100</div>
                </div>
                
                <div class="form-group">
                    <label for="upi_address2">Address Line 2 <span class="optional">(Optional)</span></label>
                    <input type="text" id="upi_address2" name="address2" placeholder="Apartment, suite, etc." maxlength="100">
                    <div id="upi_address2_counter" class="char-counter">0/100</div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="upi_city">City <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_city" name="city" placeholder="Mumbai" maxlength="50">
                        <div id="upi_city_counter" class="char-counter">0/50</div>
                    </div>
                    <div class="form-group">
                        <label for="upi_state">State <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_state" name="state" placeholder="Maharashtra" maxlength="50">
                        <div id="upi_state_counter" class="char-counter">0/50</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="upi_country">Country <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_country" name="country" placeholder="India" maxlength="50">
                        <div id="upi_country_counter" class="char-counter">0/50</div>
                    </div>
                    <div class="form-group">
                        <label for="upi_zipcode">ZIP Code <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_zipcode" name="zipcode" placeholder="400001" maxlength="20">
                        <div id="upi_zipcode_counter" class="char-counter">0/20</div>
                    </div>
                </div>
            </div>
            
            <!-- UDF Parameters -->
            <div class="section">
                <h2 class="section-title">UDF Parameters</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="upi_udf1">UDF1 <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_udf1" name="udf1" placeholder="" maxlength="255">
                        <div id="upi_udf1_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="upi_udf2">UDF2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_udf2" name="udf2" placeholder="" maxlength="255">
                        <div id="upi_udf2_counter" class="char-counter">0/255</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="upi_udf3">UDF3 <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_udf3" name="udf3" placeholder="" maxlength="255">
                        <div id="upi_udf3_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="upi_udf4">UDF4 <span class="optional">(Optional)</span></label>
                        <input type="text" id="upi_udf4" name="udf4" placeholder="" maxlength="255">
                        <div id="upi_udf4_counter" class="char-counter">0/255</div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="upi_udf5">UDF5 <span class="optional">(Optional)</span></label>
                    <input type="text" id="upi_udf5" name="udf5" placeholder="" maxlength="255">
                    <div id="upi_udf5_counter" class="char-counter">0/255</div>
                </div>
            </div>
            
            <!-- Redirect URLs -->
            <div class="section">
                <h2 class="section-title">Redirect URLs</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="upi_surl">Success URL <span class="required">*</span></label>
                        <input type="url" id="upi_surl" name="surl" required maxlength="255">
                        <div id="upi_surl_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="upi_furl">Failure URL <span class="required">*</span></label>
                        <input type="url" id="upi_furl" name="furl" required maxlength="255">
                        <div id="upi_furl_counter" class="char-counter">0/255</div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="pay-button-wrapper">
                <div class="left-buttons">
                    <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                    </div>
                </div>
                <div class="button-group">
                    <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/upi-one-time-mandate-integration', '_blank')">
                        <i class="fas fa-book"></i> Document
                    </button>
                    <button type="button" class="button debug-button" onclick="showDebugInfo('upiotm')">Show Debug Info</button>
                    <button type="button" class="button debug-button" onclick="showCurlCommand('upiotm')">Generate CURL</button>
                    <button type="button" class="button code-gen-button" onclick="showCodeGeneratorModal('upiotm')">Generate Code</button>
                    <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                        <i class="fas fa-credit-card"></i> Test Card Details
                    </button>
                    <button type="button" class="button" onclick="submitPayment('upiotm')">Pay Now</button>
                </div>
            </div>
        </div>
        
        <!-- Debug Section -->
        <div class="debug-section" id="upi-debugSection">
            <h3 class="debug-title">Debug Information</h3>
            <div id="upi-debugContent"></div>
        </div>
        
        <!-- CURL Section -->
        <div class="curl-section" id="upi-curlSection">
            <h3>CURL Command</h3>
            <button class="copy-button" onclick="copyCurlToClipboard('upiotm')">Copy to Clipboard</button>
            <div class="curl-content" id="upi-curlContent"></div>
        </div>
    </div>
    
    <!-- PreAuth Card Flow -->
    <div class="flow-content" id="preauthFlow">
        <div class="flow-title">
            <h2>PayU Hosted Checkout PreAuth</h2>
        </div>
        
        <div class="main-content">
            <!-- Configuration Settings -->
            <div class="section">
                <h2 class="section-title">Configuration Settings</h2>
                
                <div class="alert alert-info">
                    <strong>Pre-Authorization Payment:</strong> Amount will be blocked on customer's card but not captured immediately.
                </div>
                
                <!-- Custom Key/Salt Toggle -->
                <div class="custom-key-toggle">
                    <label>
                        <input type="checkbox" id="preauth_use_custom_keys" onchange="toggleCustomKeys('preauth')">
                        Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                    </label>
                    <div class="custom-key-fields" id="preauth-custom-key-fields">
                        <div class="form-group">
                            <label for="preauth_custom_key">Custom Merchant Key <span class="required">*</span></label>
                            <input type="text" id="preauth_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                        </div>
                        <div class="form-group">
                            <label for="preauth_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                            <div style="position: relative;">
                                <input type="password" id="preauth_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                <button type="button" onclick="toggleSaltVisibility('preauth')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Enforce Payment Methods <span class="required">*</span></label>
                    <div class="payment-methods">
                        <div class="payment-method">
                            <input type="checkbox" id="preauth_cc" name="preauth_paymethod" value="CC" checked>
                            <label for="preauth_cc">Credit Cards</label>
                        </div>
                    </div>
                </div>
                
                <!-- PreAuth Required Parameter -->
                <div class="form-group" style="margin-top: 1rem;">
                    <label for="preauth_pre_authorize_display">Pre-Authorize <span class="required">*</span></label>
                    <input type="text" id="preauth_pre_authorize_display" value="1" readonly 
                           style="background-color: #f5f5f5; cursor: not-allowed;">
                    <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">
                        Mandatory for PreAuth flow (always 1)
                    </small>
                </div>
            </div>
            
            <!-- Payment Details -->
            <div class="section">
                <h2 class="section-title">Payment Details</h2>
                
                <!-- Transaction ID Display (Auto-Generated) -->
                <div class="form-group">
                    <label for="preauth_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                    <input type="text" id="preauth_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                    <span class="char-counter" id="preauth_txnid_display_counter">0/25</span>
                </div>
                
                <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                <div class="form-group" id="preauth-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                    <button type="button" class="button template-button" id="preauth_generate_template_btn" onclick="generateTemplate('preauth')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                        🔄 Fill with Sample Data
                    </button>
                    <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="preauth_amount">Amount <span class="required">*</span></label>
                        <input type="number" id="preauth_amount" name="amount" step="0.01" placeholder="100.00" required>
                    </div>
                    <div class="form-group">
                        <label for="preauth_productinfo">Product Info <span class="required">*</span></label>
                        <input type="text" id="preauth_productinfo" name="productinfo" placeholder="Product or service description" required maxlength="100">
                        <div id="preauth_productinfo_counter" class="char-counter">0/100</div>
                    </div>
                </div>
                
                <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Customer Details</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="preauth_firstname">First Name <span class="required">*</span></label>
                        <input type="text" id="preauth_firstname" name="firstname" placeholder="John" required maxlength="60">
                        <div id="preauth_firstname_counter" class="char-counter">0/60</div>
                    </div>
                    <div class="form-group">
                        <label for="preauth_lastname">Last Name <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_lastname" name="lastname" placeholder="Doe" maxlength="20">
                        <div id="preauth_lastname_counter" class="char-counter">0/20</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="preauth_email">Email <span class="required">*</span></label>
                        <input type="email" id="preauth_email" name="email" placeholder="john.doe@example.com" required maxlength="50">
                        <div id="preauth_email_counter" class="char-counter">0/50</div>
                        <div id="preauth-email-error" class="error-message" style="display: none;"></div>
                    </div>
                    <div class="form-group">
                        <label for="preauth_phone">Phone (10 digits) <span class="required">*</span></label>
                        <input type="text" id="preauth_phone" name="phone" placeholder="9876543210" required maxlength="10" pattern="[0-9]{10}" oninput="validatePhone('preauth')">
                        <div id="preauth-phone-error" class="error-message" style="display: none;"></div>
                    </div>
                </div>
                
                <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Address Details <span class="optional">(Optional)</span></h3>
                
                <div class="form-group">
                    <label for="preauth_address1">Address Line 1 <span class="optional">(Optional)</span></label>
                    <input type="text" id="preauth_address1" name="address1" placeholder="Street address" maxlength="100">
                    <div id="preauth_address1_counter" class="char-counter">0/100</div>
                </div>
                
                <div class="form-group">
                    <label for="preauth_address2">Address Line 2 <span class="optional">(Optional)</span></label>
                    <input type="text" id="preauth_address2" name="address2" placeholder="Apartment, suite, etc." maxlength="100">
                    <div id="preauth_address2_counter" class="char-counter">0/100</div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="preauth_city">City <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_city" name="city" placeholder="Mumbai" maxlength="50">
                        <div id="preauth_city_counter" class="char-counter">0/50</div>
                    </div>
                    <div class="form-group">
                        <label for="preauth_state">State <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_state" name="state" placeholder="Maharashtra" maxlength="50">
                        <div id="preauth_state_counter" class="char-counter">0/50</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="preauth_country">Country <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_country" name="country" placeholder="India" maxlength="50">
                        <div id="preauth_country_counter" class="char-counter">0/50</div>
                    </div>
                    <div class="form-group">
                        <label for="preauth_zipcode">ZIP Code <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_zipcode" name="zipcode" placeholder="400001" maxlength="20">
                        <div id="preauth_zipcode_counter" class="char-counter">0/20</div>
                    </div>
                </div>
            </div>
            
            <!-- UDF Parameters -->
            <div class="section">
                <h2 class="section-title">UDF Parameters</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="preauth_udf1">UDF1 <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_udf1" name="udf1" placeholder="" maxlength="255">
                        <div id="preauth_udf1_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="preauth_udf2">UDF2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_udf2" name="udf2" placeholder="" maxlength="255">
                        <div id="preauth_udf2_counter" class="char-counter">0/255</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="preauth_udf3">UDF3 <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_udf3" name="udf3" placeholder="" maxlength="255">
                        <div id="preauth_udf3_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="preauth_udf4">UDF4 <span class="optional">(Optional)</span></label>
                        <input type="text" id="preauth_udf4" name="udf4" placeholder="" maxlength="255">
                        <div id="preauth_udf4_counter" class="char-counter">0/255</div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="preauth_udf5">UDF5 <span class="optional">(Optional)</span></label>
                    <input type="text" id="preauth_udf5" name="udf5" placeholder="" maxlength="255">
                    <div id="preauth_udf5_counter" class="char-counter">0/255</div>
                </div>
            </div>
            
            <!-- Redirect URLs -->
            <div class="section">
                <h2 class="section-title">Redirect URLs</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="preauth_surl">Success URL <span class="required">*</span></label>
                        <input type="url" id="preauth_surl" name="surl" required maxlength="255">
                        <div id="preauth_surl_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="preauth_furl">Failure URL <span class="required">*</span></label>
                        <input type="url" id="preauth_furl" name="furl" required maxlength="255">
                        <div id="preauth_furl_counter" class="char-counter">0/255</div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="pay-button-wrapper">
                <div class="left-buttons">
                    <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                    </div>
                </div>
                <div class="button-group">
                    <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/payu-hosted-integration-pre-authorize-payments', '_blank')">
                        <i class="fas fa-book"></i> Document
                    </button>
                    <button type="button" class="button debug-button" onclick="showDebugInfo('preauth')">Show Debug Info</button>
                    <button type="button" class="button debug-button" onclick="showCurlCommand('preauth')">Generate CURL</button>
                    <button type="button" class="button code-gen-button" onclick="showCodeGeneratorModal('preauth')">Generate Code</button>
                    <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                        <i class="fas fa-credit-card"></i> Test Card Details
                    </button>
                    <button type="button" class="button" onclick="submitPayment('preauth')">Pay Now</button>
                </div>
            </div>
        </div>
        
        <!-- Debug Section -->
        <div class="debug-section" id="preauth-debugSection">
            <h3 class="debug-title">Debug Information</h3>
            <div id="preauth-debugContent"></div>
        </div>
        
        <!-- CURL Section -->
        <div class="curl-section" id="preauth-curlSection">
            <h3>CURL Command</h3>
            <button class="copy-button" onclick="copyCurlToClipboard('preauth')">Copy to Clipboard</button>
            <div class="curl-content" id="preauth-curlContent"></div>
        </div>
    </div>
    
    <!-- PreAuth Hidden Form -->
    <form id="preauth_payu_form" method="post" action="https://test.payu.in/_payment" style="display: none;">
        <input type="hidden" id="preauth_key" name="key">
        <input type="hidden" id="preauth_txnid" name="txnid">
        <input type="hidden" id="preauth_amount_hidden" name="amount">
        <input type="hidden" id="preauth_productinfo_hidden" name="productinfo">
        <input type="hidden" id="preauth_firstname_hidden" name="firstname">
        <input type="hidden" id="preauth_lastname_hidden" name="lastname">
        <input type="hidden" id="preauth_email_hidden" name="email">
        <input type="hidden" id="preauth_phone_hidden" name="phone">
        <input type="hidden" id="preauth_address1_hidden" name="address1">
        <input type="hidden" id="preauth_address2_hidden" name="address2">
        <input type="hidden" id="preauth_city_hidden" name="city">
        <input type="hidden" id="preauth_state_hidden" name="state">
        <input type="hidden" id="preauth_country_hidden" name="country">
        <input type="hidden" id="preauth_zipcode_hidden" name="zipcode">
        <input type="hidden" id="preauth_udf1_hidden" name="udf1">
        <input type="hidden" id="preauth_udf2_hidden" name="udf2">
        <input type="hidden" id="preauth_udf3_hidden" name="udf3">
        <input type="hidden" id="preauth_udf4_hidden" name="udf4">
        <input type="hidden" id="preauth_udf5_hidden" name="udf5">
        <input type="hidden" id="preauth_surl_hidden" name="surl">
        <input type="hidden" id="preauth_furl_hidden" name="furl">
        <input type="hidden" id="preauth_hash" name="hash">
        <input type="hidden" id="preauth_pre_authorize" name="pre_authorize" value="1">
    </form>
    
    <!-- Checkout Plus Flow -->
    <div class="flow-content" id="checkoutplusFlow">
        <div class="flow-title">
            <h2>Checkout Plus</h2>
        </div>
        
        <div class="main-content">
            <!-- Configuration Settings -->
            <div class="section">
                <h2 class="section-title">Configuration Settings</h2>
                
                <div class="alert alert-info">
                    <strong>Checkout Plus:</strong> JavaScript SDK-based payment with modal checkout experience.
                </div>
                
                <!-- Custom Key/Salt Toggle -->
                <div class="custom-key-toggle">
                    <label>
                        <input type="checkbox" id="cp_use_custom_keys" onchange="toggleCustomKeys('checkoutplus')">
                        Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                    </label>
                    <div class="custom-key-fields" id="cp-custom-key-fields">
                        <div class="form-group">
                            <label for="cp_custom_key">Custom Merchant Key <span class="required">*</span></label>
                            <input type="text" id="cp_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                        </div>
                        <div class="form-group">
                            <label for="cp_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                            <div style="position: relative;">
                                <input type="password" id="cp_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                <button type="button" onclick="toggleSaltVisibility('checkoutplus')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Enforce Payment Methods <span class="optional">(Optional)</span></label>
                    <div class="payment-methods">
                        <div class="payment-method">
                            <input type="checkbox" id="cp_cc" name="cp_paymethod" value="CC">
                            <label for="cp_cc">Credit Cards</label>
                        </div>
                        <div class="payment-method">
                            <input type="checkbox" id="cp_dc" name="cp_paymethod" value="DC">
                            <label for="cp_dc">Debit Cards</label>
                        </div>
                        <div class="payment-method">
                            <input type="checkbox" id="cp_nb" name="cp_paymethod" value="NB">
                            <label for="cp_nb">Net Banking</label>
                        </div>
                        <div class="payment-method">
                            <input type="checkbox" id="cp_upi" name="cp_paymethod" value="UPI">
                            <label for="cp_upi">UPI</label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Payment Details -->
            <div class="section">
                <h2 class="section-title">Payment Details</h2>
                
                <!-- Transaction ID Display (Auto-Generated) -->
                <div class="form-group">
                    <label for="cp_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                    <input type="text" id="cp_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                    <span class="char-counter" id="cp_txnid_display_counter">0/25</span>
                </div>
                
                <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                <div class="form-group" id="cp-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                    <button type="button" class="button template-button" id="cp_generate_template_btn" onclick="generateTemplate('checkoutplus')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                        🔄 Fill with Sample Data
                    </button>
                    <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cp_amount">Amount <span class="required">*</span></label>
                        <input type="number" id="cp_amount" name="amount" step="0.01" placeholder="100.00" required>
                    </div>
                    <div class="form-group">
                        <label for="cp_productinfo">Product Info <span class="required">*</span></label>
                        <input type="text" id="cp_productinfo" name="productinfo" placeholder="Product or service description" required maxlength="100">
                        <div id="cp_productinfo_counter" class="char-counter">0/100</div>
                    </div>
                </div>
                
                <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Customer Details</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cp_firstname">First Name <span class="required">*</span></label>
                        <input type="text" id="cp_firstname" name="firstname" placeholder="John" required maxlength="60">
                        <div id="cp_firstname_counter" class="char-counter">0/60</div>
                    </div>
                    <div class="form-group">
                        <label for="cp_lastname">Last Name <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_lastname" name="lastname" placeholder="Doe" maxlength="20">
                        <div id="cp_lastname_counter" class="char-counter">0/20</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cp_email">Email <span class="required">*</span></label>
                        <input type="email" id="cp_email" name="email" placeholder="john.doe@example.com" required maxlength="50">
                        <div id="cp_email_counter" class="char-counter">0/50</div>
                        <div id="cp-email-error" class="error-message" style="display: none;"></div>
                    </div>
                    <div class="form-group">
                        <label for="cp_phone">Phone (10 digits) <span class="required">*</span></label>
                        <input type="text" id="cp_phone" name="phone" placeholder="9876543210" required maxlength="10" pattern="[0-9]{10}">
                        <div id="cp-phone-error" class="error-message" style="display: none;"></div>
                    </div>
                </div>
                
                <h3 style="color: var(--accent-primary); margin: 2rem 0 1rem 0;">Address Details <span class="optional">(Optional)</span></h3>
                
                <div class="form-group">
                    <label for="cp_address1">Address Line 1 <span class="optional">(Optional)</span></label>
                    <input type="text" id="cp_address1" name="address1" placeholder="Street address" maxlength="100">
                    <div id="cp_address1_counter" class="char-counter">0/100</div>
                </div>
                
                <div class="form-group">
                    <label for="cp_address2">Address Line 2 <span class="optional">(Optional)</span></label>
                    <input type="text" id="cp_address2" name="address2" placeholder="Apartment, suite, etc." maxlength="100">
                    <div id="cp_address2_counter" class="char-counter">0/100</div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cp_city">City <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_city" name="city" placeholder="Mumbai" maxlength="50">
                        <div id="cp_city_counter" class="char-counter">0/50</div>
                    </div>
                    <div class="form-group">
                        <label for="cp_state">State <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_state" name="state" placeholder="Maharashtra" maxlength="50">
                        <div id="cp_state_counter" class="char-counter">0/50</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cp_country">Country <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_country" name="country" placeholder="India" maxlength="50">
                        <div id="cp_country_counter" class="char-counter">0/50</div>
                    </div>
                    <div class="form-group">
                        <label for="cp_zipcode">ZIP Code <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_zipcode" name="zipcode" placeholder="400001" maxlength="20">
                        <div id="cp_zipcode_counter" class="char-counter">0/20</div>
                    </div>
                </div>
            </div>
            
            <!-- UDF Parameters -->
            <div class="section">
                <h2 class="section-title">UDF Parameters (Optional)</h2>
                
                <div class="alert alert-info">
                    <strong>UDF Information:</strong> User Defined Fields for custom data - all optional.
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cp_udf1">UDF1 <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_udf1" name="udf1" placeholder="User defined field 1" maxlength="255">
                        <div id="cp_udf1_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="cp_udf2">UDF2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_udf2" name="udf2" placeholder="User defined field 2" maxlength="255">
                        <div id="cp_udf2_counter" class="char-counter">0/255</div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cp_udf3">UDF3 <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_udf3" name="udf3" placeholder="User defined field 3" maxlength="255">
                        <div id="cp_udf3_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="cp_udf4">UDF4 <span class="optional">(Optional)</span></label>
                        <input type="text" id="cp_udf4" name="udf4" placeholder="User defined field 4" maxlength="255">
                        <div id="cp_udf4_counter" class="char-counter">0/255</div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="cp_udf5">UDF5 <span class="optional">(Optional)</span></label>
                    <input type="text" id="cp_udf5" name="udf5" placeholder="User defined field 5" maxlength="255">
                    <div id="cp_udf5_counter" class="char-counter">0/255</div>
                </div>
            </div>
            
            <!-- Redirect URLs -->
            <div class="section">
                <h2 class="section-title">Callback URLs</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="cp_surl">Success URL <span class="required">*</span></label>
                        <input type="url" id="cp_surl" name="surl" required maxlength="255">
                        <div id="cp_surl_counter" class="char-counter">0/255</div>
                    </div>
                    <div class="form-group">
                        <label for="cp_furl">Failure URL <span class="required">*</span></label>
                        <input type="url" id="cp_furl" name="furl" required maxlength="255">
                        <div id="cp_furl_counter" class="char-counter">0/255</div>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="pay-button-wrapper">
                <div class="left-buttons">
                    <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                    </div>
                </div>
                <div class="button-group">
                    <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/checkout-plus-integration', '_blank')">
                        <i class="fas fa-book"></i> Document
                    </button>
                    <button type="button" class="button debug-button" onclick="showDebugInfo('checkoutplus')">Show Debug Info</button>
                    <button type="button" class="button debug-button" onclick="showCurlCommand('checkoutplus')">Generate CURL</button>
                    <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                        <i class="fas fa-credit-card"></i> Test Card Details
                    </button>
                    <button type="button" class="button" onclick="launchCheckoutPlus()">Pay Now</button>
                </div>
            </div>
        </div>
        
        <!-- Debug Section -->
        <div class="debug-section" id="cp-debugSection">
            <h3 class="debug-title">Debug Information</h3>
            <div id="cp-debugContent"></div>
        </div>
        
        <!-- CURL Section -->
        <div class="curl-section" id="cp-curlSection">
            <h3>CURL Command</h3>
            <button class="copy-button" onclick="copyCurlToClipboard('checkoutplus')">Copy to Clipboard</button>
            <div class="curl-content" id="cp-curlContent"></div>
        </div>
    </div>
    
    <!-- Checkout Plus Hidden Fields -->
    <input type="hidden" id="cp_txnid" name="txnid">
    
    <!-- Split Payment Flow -->
    <div class="flow-content" id="splitFlow">
        <div class="flow-title">
            <h2>PayU Hosted Checkout Split Payment</h2>
        </div>
        
        <div class="main-content">
            <!-- Configuration Settings -->
            <div class="section">
                <h2 class="section-title">Configuration Settings</h2>
                
                <div class="alert alert-info">
                    <strong>About Split Payment:</strong> Distribute a single transaction amount across multiple merchant accounts. Supports both absolute amount and percentage-based splitting.
                    <br><strong>Use Cases:</strong> Marketplace platforms, commission-based transactions, aggregator models.
                </div>
                
                <!-- Custom Key/Salt Toggle -->
                <div class="custom-key-toggle">
                    <label>
                        <input type="checkbox" id="split_use_custom_keys" onchange="toggleCustomKeys('split')">
                        Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                    </label>
                    <div class="custom-key-fields" id="split-custom-key-fields">
                        <div class="form-group">
                            <label for="split_custom_key">Custom Merchant Key <span class="required">*</span></label>
                            <input type="text" id="split_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                        </div>
                        <div class="form-group">
                            <label for="split_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                            <div style="position: relative;">
                                <input type="password" id="split_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                <button type="button" onclick="toggleSaltVisibility('split')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Payment Details -->
            <div class="section">
                <h2 class="section-title">Payment Details</h2>
                
                <!-- Transaction ID (hidden but auto-generated) -->
                <input type="hidden" id="split_txnid" name="txnid">
                
                <!-- Transaction ID Display (Auto-Generated) -->
                <div class="form-group">
                    <label for="split_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                    <input type="text" id="split_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                    <span class="char-counter" id="split_txnid_display_counter">0/25</span>
                </div>
                
                <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                <div class="form-group" id="split-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                    <button type="button" class="button template-button" id="split_generate_template_btn" onclick="generateTemplate('split')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                        🔄 Fill with Sample Data
                    </button>
                    <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_amount">Amount (INR) <span class="required">*</span></label>
                        <input type="number" id="split_amount" name="amount" placeholder="100.00" step="0.01" min="1" required>
                        <small style="color: var(--text-tertiary);">Total transaction amount</small>
                    </div>
                    <div class="form-group">
                        <label for="split_productinfo">Product Info <span class="required">*</span></label>
                        <input type="text" id="split_productinfo" name="productinfo" placeholder="Product description" required>
                    </div>
                </div>
                
            </div>
            
            <!-- Customer Information -->
            <div class="section">
                <h2 class="section-title">Customer Information</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_firstname">First Name <span class="required">*</span></label>
                        <input type="text" id="split_firstname" name="firstname" placeholder="John" required>
                    </div>
                    <div class="form-group">
                        <label for="split_lastname">Last Name <span class="optional">(Optional)</span></label>
                        <input type="text" id="split_lastname" name="lastname" placeholder="Doe">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_email">Email <span class="required">*</span></label>
                        <input type="email" id="split_email" name="email" placeholder="[email protected]" required>
                    </div>
                    <div class="form-group">
                        <label for="split_phone">Phone <span class="required">*</span></label>
                        <input type="tel" id="split_phone" name="phone" placeholder="9876543210" required>
                    </div>
                </div>
            </div>
            
            <!-- Address Information -->
            <div class="section">
                <h2 class="section-title">Address Information <span class="optional">(Optional)</span></h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_address1">Address Line 1</label>
                        <input type="text" id="split_address1" name="address1" placeholder="Street address">
                    </div>
                    <div class="form-group">
                        <label for="split_address2">Address Line 2</label>
                        <input type="text" id="split_address2" name="address2" placeholder="Apartment, suite, etc.">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_city">City</label>
                        <input type="text" id="split_city" name="city" placeholder="Mumbai">
                    </div>
                    <div class="form-group">
                        <label for="split_state">State</label>
                        <input type="text" id="split_state" name="state" placeholder="Maharashtra">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_country">Country</label>
                        <input type="text" id="split_country" name="country" placeholder="India">
                    </div>
                    <div class="form-group">
                        <label for="split_zipcode">Zip Code</label>
                        <input type="text" id="split_zipcode" name="zipcode" placeholder="400001">
                    </div>
                </div>
                
            </div>
            
            <!-- UDF Parameters -->
            <div class="section">
                <h2 class="section-title">UDF Parameters (Optional)</h2>
                
                <div class="alert alert-info">
                    <strong>UDF Information:</strong> User Defined Fields for custom data - all optional.
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_udf1">UDF1 <span class="optional">(Optional)</span></label>
                        <input type="text" id="split_udf1" name="udf1" placeholder="User defined field 1">
                    </div>
                    <div class="form-group">
                        <label for="split_udf2">UDF2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="split_udf2" name="udf2" placeholder="User defined field 2">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_udf3">UDF3 <span class="optional">(Optional)</span></label>
                        <input type="text" id="split_udf3" name="udf3" placeholder="User defined field 3">
                    </div>
                    <div class="form-group">
                        <label for="split_udf4">UDF4 <span class="optional">(Optional)</span></label>
                        <input type="text" id="split_udf4" name="udf4" placeholder="User defined field 4">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="split_udf5">UDF5 <span class="optional">(Optional)</span></label>
                    <input type="text" id="split_udf5" name="udf5" placeholder="User defined field 5">
                </div>
            </div>
            
            <!-- Split Payment Configuration -->
            <div class="section">
                <h2 class="section-title">Split Payment Configuration <span class="required">*</span></h2>
                
                <div class="alert alert-warning">
                    <strong>Important:</strong> Split merchant keys must be pre-configured and linked to your parent merchant account. Contact PayU support for split setup.
                </div>
                
                <div class="form-group">
                    <label>Split Type <span class="required">*</span></label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="split_type" value="absolute" checked onchange="updateSplitPlaceholders()">
                            <span>Amount Based (Absolute)</span>
                            <small>Specify exact amounts in INR</small>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="split_type" value="percentage" onchange="updateSplitPlaceholders()">
                            <span>Percentage Based</span>
                            <small>Specify percentage of total amount</small>
                        </label>
                    </div>
                </div>
                
                <div id="splitDetailsContainer">
                    <h4>Split Details (Child Merchants)</h4>
                    <div id="splitRowsContainer">
                        <!-- Split rows will be added dynamically -->
                    </div>
                    <button type="button" class="button" onclick="addSplitRow()" style="margin-top: 10px;">
                        + Add Another Split Merchant
                    </button>
                </div>
                
            </div>
            
            <!-- Payment Methods -->
            <div class="section">
                <h2 class="section-title">Enforce Payment Methods <span class="optional">(Optional)</span></h2>
                
                <div class="payment-methods">
                    <label class="payment-method">
                        <input type="checkbox" id="split_cc" name="split_paymethod" value="CC">
                        <span>Credit Card</span>
                    </label>
                    <label class="payment-method">
                        <input type="checkbox" id="split_dc" name="split_paymethod" value="DC">
                        <span>Debit Card</span>
                    </label>
                    <label class="payment-method">
                        <input type="checkbox" id="split_nb" name="split_paymethod" value="NB">
                        <span>Net Banking</span>
                    </label>
                    <label class="payment-method">
                        <input type="checkbox" id="split_upi" name="split_paymethod" value="UPI">
                        <span>UPI</span>
                    </label>
                </div>
            </div>
            
            <!-- Redirect URLs -->
            <div class="section">
                <h2 class="section-title">Redirect URLs</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="split_surl">Success URL <span class="required">*</span></label>
                        <input type="url" id="split_surl" name="surl" required>
                    </div>
                    <div class="form-group">
                        <label for="split_furl">Failure URL <span class="required">*</span></label>
                        <input type="url" id="split_furl" name="furl" required>
                    </div>
                </div>
            </div>
                
            <!-- Action Buttons -->
            <div class="pay-button-wrapper">
                <div class="left-buttons">
                    <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                    </div>
                </div>
                <div class="button-group">
                    <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/split-settlments', '_blank')">
                        <i class="fas fa-book"></i> Document
                    </button>
                    <button type="button" class="button debug-button" onclick="showDebugInfo('split')">Show Debug Info</button>
                    <button type="button" class="button debug-button" onclick="showCurlCommand('split')">Generate CURL</button>
                    <button type="button" class="button code-gen-button" onclick="showCodeGeneratorModal('split')">Generate Code</button>
                    <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                        <i class="fas fa-credit-card"></i> Test Card Details
                    </button>
                    <button type="button" class="button" onclick="submitPayment('split')">Pay Now</button>
                </div>
            </div>
        </div>
        
        <!-- Debug Section -->
        <div class="debug-section" id="split-debugSection">
            <h3 class="debug-title">Debug Information</h3>
            <div id="split-debugContent"></div>
        </div>
        
        <!-- CURL Section -->
        <div class="curl-section" id="split-curlSection">
            <h3>CURL Command</h3>
            <button class="copy-button" onclick="copyCurlToClipboard('split')">Copy to Clipboard</button>
            <div class="curl-content" id="split-curlContent"></div>
        </div>
    </div>
    
    <!-- Split Payment Hidden Form -->
    <form id="split_payu_form" method="post" action="https://test.payu.in/_payment" style="display: none;">
        <input type="hidden" id="split_key" name="key">
        <input type="hidden" id="split_txnid_hidden" name="txnid">
        <input type="hidden" id="split_amount_hidden" name="amount">
        <input type="hidden" id="split_productinfo_hidden" name="productinfo">
        <input type="hidden" id="split_firstname_hidden" name="firstname">
        <input type="hidden" id="split_lastname_hidden" name="lastname">
        <input type="hidden" id="split_email_hidden" name="email">
        <input type="hidden" id="split_phone_hidden" name="phone">
        <input type="hidden" id="split_address1_hidden" name="address1">
        <input type="hidden" id="split_address2_hidden" name="address2">
        <input type="hidden" id="split_city_hidden" name="city">
        <input type="hidden" id="split_state_hidden" name="state">
        <input type="hidden" id="split_country_hidden" name="country">
        <input type="hidden" id="split_zipcode_hidden" name="zipcode">
        <input type="hidden" id="split_udf1_hidden" name="udf1">
        <input type="hidden" id="split_udf2_hidden" name="udf2">
        <input type="hidden" id="split_udf3_hidden" name="udf3">
        <input type="hidden" id="split_udf4_hidden" name="udf4">
        <input type="hidden" id="split_udf5_hidden" name="udf5">
        <input type="hidden" id="split_surl_hidden" name="surl">
        <input type="hidden" id="split_furl_hidden" name="furl">
        <input type="hidden" id="split_hash" name="hash">
        <input type="hidden" id="split_splitRequest_hidden" name="splitRequest">
    </form>
    
    <!-- Bank Offers Flow -->
    <div class="flow-content" id="bankofferFlow">
        <div class="flow-title">
            <h2>PayU Hosted Checkout Bank Offers</h2>
        </div>
        
        <div class="main-content">
            <!-- Configuration Settings -->
            <div class="section">
                <h2 class="section-title">Configuration Settings</h2>
                
                <div class="alert alert-info">
                    <strong>About Bank Offers:</strong> Test instant discount and cashback offers with SKU/item-based cart details. Supports both predefined test scenarios and custom cart configurations.
                    <br><strong>Note:</strong> Minimum transaction amount &#8377;20,000 required for bank offers (For Predefined Credentials).
                </div>
                
                <!-- Custom Key/Salt Toggle -->
                <div class="custom-key-toggle">
                    <label>
                        <input type="checkbox" id="bo_use_custom_keys" onchange="toggleCustomKeys('bankoffer')">
                        Use Your Merchant UAT Key & Salt (for testing with test/sandbox credentials provided by PayU payments)
                    </label>
                    <div class="custom-key-fields" id="bo-custom-key-fields">
                        <div class="form-group">
                            <label for="bo_custom_key">Custom Merchant Key <span class="required">*</span></label>
                            <input type="text" id="bo_custom_key" name="custom_key" placeholder="Enter your PayU Merchant Key">
                        </div>
                        <div class="form-group">
                            <label for="bo_custom_salt">Custom Merchant Salt <span class="required">*</span></label>
                            <div style="position: relative;">
                                <input type="password" id="bo_custom_salt" name="custom_salt" placeholder="Enter your PayU Merchant Salt" style="padding-right: 40px;">
                                <button type="button" onclick="toggleSaltVisibility('bankoffer')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 12px; color: #666;" title="Show/Hide Salt">Show</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Payment Details -->
            <div class="section">
                <h2 class="section-title">Payment Details</h2>
                
                <!-- Transaction ID (hidden but auto-generated) -->
                <input type="hidden" id="bo_txnid" name="txnid">
                
                <!-- Transaction ID Display (Auto-Generated) -->
                <div class="form-group">
                    <label for="bo_txnid_display">Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span></label>
                    <input type="text" id="bo_txnid_display" readonly maxlength="25" style="background-color: #f0f0f0; cursor: not-allowed; font-family: monospace;">
                    <span class="char-counter" id="bo_txnid_display_counter">0/25</span>
                </div>
                
                <!-- Fill with Sample Data Button (for Predefined Credentials) -->
                <div class="form-group" id="bo-generate-template-wrapper" style="margin-top: 0.5rem; margin-bottom: 1rem;">
                    <button type="button" class="button template-button" id="bo_generate_template_btn" onclick="generateTemplate('bankoffer')" style="font-size: 0.9rem; padding: 0.75rem 1.5rem;">
                        🔄 Fill with Sample Data
                    </button>
                    <small style="color: var(--text-tertiary); display: block; margin-top: 0.5rem;">Fill all form fields with predefined test data</small>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_amount">Amount (INR) <span class="required">*</span></label>
                        <input type="number" id="bo_amount" name="amount" placeholder="20000.00" step="0.01" min="20000" value="20000" required>
                        <small style="color: var(--warning-color); font-weight: 600;">&#9888;&#65039; Minimum amount &#8377;20,000 required for Bank Offers (For Predefined Credentials)</small>
                    </div>
                    <div class="form-group">
                        <label for="bo_productinfo">Product Info <span class="required">*</span></label>
                        <input type="text" id="bo_productinfo" name="productinfo" placeholder="Product description" required>
                    </div>
                </div>
                
                <!-- Non-SKU Offer Key (for custom credentials) -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_offer_key">Offer Key <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_offer_key" name="offer_key" placeholder="e.g., TestInstantDiscount@BVfeXGNr2FKy">
                        <small style="color: var(--text-tertiary);">For non-SKU based offers. Leave blank if using SKU details or to let PayU automatically apply the best available offer.</small>
                    </div>
                    <div class="form-group">
                        <label for="bo_user_token">User Token <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_user_token" name="user_token" placeholder="e.g., 1234567890">
                        <small style="color: var(--text-tertiary);">User token for bank offer transactions (both SKU and non-SKU)</small>
                    </div>
                </div>
                
                <!-- API Version (shown only when SKU is enabled) -->
                <div id="bo-api-version-section" style="display: none; margin-top: 1rem;">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="bo_api_version_display">
                                API Version 
                                <span class="required">*</span>
                                <span style="color: #48bb78;">(Auto-set for SKU)</span>
                            </label>
                            <input type="text" id="bo_api_version_display" value="19" readonly style="background-color: #f0f0f0; cursor: not-allowed; font-weight: 600;">
                            <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">
                                ⓘ API Version 19 is required for SKU-based cart details
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- SKU/Item Based Offers Configuration -->
            <div class="section">
                <h2 class="section-title">SKU/Item Based Offers</h2>
                
                <div class="alert alert-info">
                    <strong>Enable SKU Details:</strong> Add cart details with item-level information to test bank offers. Leave unchecked for standard payment without SKU offers.
                </div>
                
                <!-- Enable SKU Toggle -->
                <div class="custom-key-toggle" style="margin-bottom: 1.5rem;">
                    <label>
                        <input type="checkbox" id="bo_enable_sku" onchange="toggleSkuOffers('bankoffer')">
                        Enable SKU/Item Based Offers
                    </label>
                </div>
                
                <!-- SKU Configuration Section (Hidden by default) -->
                <div id="bo-sku-config" style="display: none;">
                    <div class="alert alert-warning" style="margin-bottom: 1.5rem;">
                        <strong>Note:</strong> For predefined credentials, SKU 1 and 2 will have prefilled IDs/names. You need to enter amount and quantity. Additional SKUs will be blank. Maximum 5 SKUs allowed.
                    </div>
                    
                    <!-- Cart Configuration Fields -->
                    <h3 style="color: var(--accent-primary); margin-bottom: 1rem;">Cart Configuration</h3>
                    <div class="form-row" style="margin-bottom: 1.5rem;">
                        <div class="form-group">
                            <label for="bo_surcharges">Surcharges <span class="optional">(Optional)</span></label>
                            <input type="text" id="bo_surcharges" name="surcharges" placeholder="e.g., 50.00 or leave empty" oninput="updateBankOfferSkuPreview()">
                            <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Additional charges applied to the cart (numeric or leave empty)</small>
                        </div>
                        <div class="form-group">
                            <label for="bo_pre_discount">Pre-Discount Amount <span class="optional">(Optional)</span></label>
                            <input type="number" id="bo_pre_discount" name="pre_discount" placeholder="0" value="0" step="0.01" min="0" oninput="updateBankOfferSkuPreview()">
                            <small style="color: var(--text-tertiary); display: block; margin-top: 0.25rem;">Discount amount before applying bank offers</small>
                        </div>
                    </div>
                    
                    <h3 style="color: var(--accent-primary); margin-bottom: 1rem;">SKU Items</h3>
                    
                    <div id="boSkuRowsContainer">
                        <!-- Dynamic SKU rows will be added here -->
                    </div>
                    
                    <button type="button" class="button" onclick="addBankOfferSkuRow()" style="margin-top: 1rem;">
                        <span style="font-size: 1.2rem; margin-right: 0.25rem;">+</span> Add SKU Item
                    </button>
                    <small id="bo-sku-limit-msg" style="display: block; margin-top: 0.5rem; color: var(--text-tertiary);"></small>
                    
                    <!-- Cart Summary -->
                    <div style="margin-top: 1.5rem; padding: 1rem; background: var(--info-bg); border-radius: 8px; border-left: 4px solid var(--accent-primary);">
                        <h4 style="margin: 0 0 0.75rem 0; color: var(--accent-primary);">Cart Summary</h4>
                        <div id="bo-cart-summary" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                            <p style="margin: 0;"><strong>Total Items:</strong> <span id="bo-total-items" style="color: var(--accent-primary);">0</span></p>
                            <p style="margin: 0;"><strong>Calculated Amount:</strong> <span style="color: var(--accent-primary);">&#8377;<span id="bo-calculated-amount">0.00</span></span></p>
                        </div>
                    </div>
                    
                    <!-- JSON Preview -->
                    <div style="margin-top: 1.5rem;">
                        <h4 style="color: var(--accent-primary); margin-bottom: 0.5rem;">Cart Details JSON Preview</h4>
                        <div style="position: relative;">
                            <pre id="bo-json-preview" style="background: var(--debug-bg); padding: 1rem; border-radius: 8px; overflow-x: auto; max-height: 400px; font-size: 0.85rem; border: 1px solid var(--border-color); min-height: 100px;"></pre>
                            <button type="button" class="button" onclick="copyBankOfferJson()" style="position: absolute; top: 10px; right: 10px; padding: 0.5rem 1rem; font-size: 0.85rem;">Copy JSON</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Customer Information -->
            <div class="section">
                <h2 class="section-title">Customer Information</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_firstname">First Name <span class="required">*</span></label>
                        <input type="text" id="bo_firstname" name="firstname" placeholder="John" required>
                    </div>
                    <div class="form-group">
                        <label for="bo_lastname">Last Name <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_lastname" name="lastname" placeholder="Doe">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_email">Email <span class="required">*</span></label>
                        <input type="email" id="bo_email" name="email" placeholder="john.doe@example.com" required>
                        <div id="bo-email-error" class="error-message" style="display: none;"></div>
                    </div>
                    <div class="form-group">
                        <label for="bo_phone">Phone (10 digits) <span class="required">*</span></label>
                        <input type="text" id="bo_phone" name="phone" placeholder="9876543210" required maxlength="10" pattern="[0-9]{10}">
                        <div id="bo-phone-error" class="error-message" style="display: none;"></div>
                    </div>
                </div>
            </div>
            
            <!-- Address Information -->
            <div class="section">
                <h2 class="section-title">Address Information <span class="optional">(Optional)</span></h2>
                
                <div class="form-group">
                    <label for="bo_address1">Address Line 1 <span class="optional">(Optional)</span></label>
                    <input type="text" id="bo_address1" name="address1" placeholder="Street address">
                </div>
                
                <div class="form-group">
                    <label for="bo_address2">Address Line 2 <span class="optional">(Optional)</span></label>
                    <input type="text" id="bo_address2" name="address2" placeholder="Apartment, suite, etc.">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_city">City <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_city" name="city" placeholder="Mumbai">
                    </div>
                    <div class="form-group">
                        <label for="bo_state">State <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_state" name="state" placeholder="Maharashtra">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_country">Country <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_country" name="country" placeholder="India">
                    </div>
                    <div class="form-group">
                        <label for="bo_zipcode">ZIP Code <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_zipcode" name="zipcode" placeholder="400001">
                    </div>
                </div>
            </div>
            
            <!-- UDF Parameters -->
            <div class="section">
                <h2 class="section-title">UDF Parameters (Optional)</h2>
                
                <div class="alert alert-info">
                    <strong>UDF Information:</strong> User Defined Fields for custom data - all optional.
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_udf1">UDF1 <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_udf1" name="udf1" placeholder="User defined field 1">
                    </div>
                    <div class="form-group">
                        <label for="bo_udf2">UDF2 <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_udf2" name="udf2" placeholder="User defined field 2">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_udf3">UDF3 <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_udf3" name="udf3" placeholder="User defined field 3">
                    </div>
                    <div class="form-group">
                        <label for="bo_udf4">UDF4 <span class="optional">(Optional)</span></label>
                        <input type="text" id="bo_udf4" name="udf4" placeholder="User defined field 4">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="bo_udf5">UDF5 <span class="optional">(Optional)</span></label>
                    <input type="text" id="bo_udf5" name="udf5" placeholder="User defined field 5">
                </div>
            </div>
            
            <!-- Payment Methods -->
            <div class="section">
                <h2 class="section-title">Enforce Payment Methods <span class="optional">(Optional)</span></h2>
                
                <div class="alert alert-info">
                    <strong>Enforce Payment Methods:</strong> Select specific payment methods to show on the payment page. Leave all unchecked to show all available payment methods.
                </div>
                
                <div class="payment-methods">
                    <label class="payment-method">
                        <input type="checkbox" id="bo_cc" name="bo_paymethod" value="CC">
                        <span>Credit Card</span>
                    </label>
                    <label class="payment-method">
                        <input type="checkbox" id="bo_dc" name="bo_paymethod" value="DC">
                        <span>Debit Card</span>
                    </label>
                    <label class="payment-method">
                        <input type="checkbox" id="bo_nb" name="bo_paymethod" value="NB">
                        <span>Net Banking</span>
                    </label>
                    <label class="payment-method">
                        <input type="checkbox" id="bo_upi" name="bo_paymethod" value="UPI">
                        <span>UPI</span>
                    </label>
                    <label class="payment-method">
                        <input type="checkbox" id="bo_emi" name="bo_paymethod" value="EMI">
                        <span>EMI</span>
                    </label>
                </div>
            </div>
            
            <!-- Redirect URLs -->
            <div class="section">
                <h2 class="section-title">Redirect URLs</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="bo_surl">Success URL <span class="required">*</span></label>
                        <input type="url" id="bo_surl" name="surl" required>
                    </div>
                    <div class="form-group">
                        <label for="bo_furl">Failure URL <span class="required">*</span></label>
                        <input type="url" id="bo_furl" name="furl" required>
                    </div>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="pay-button-wrapper">
                <div class="left-buttons">
                    <div class="back-arrow" onclick="backToLanding()" title="Back to Flow Selection">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                    </div>
                </div>
                <div class="button-group">
                    <button type="button" class="button doc-button" onclick="window.open('https://docs.payu.in/docs/payu-hosted-checkout-integration-with-offers', '_blank')">
                        <i class="fas fa-book"></i> Document
                    </button>
                    <button type="button" class="button debug-button" onclick="showDebugInfo('bankoffer')">Show Debug Info</button>
                    <button type="button" class="button debug-button" onclick="showCurlCommand('bankoffer')">Generate CURL</button>
                    <button type="button" class="button code-gen-button" onclick="showCodeGeneratorModal('bankoffer')">Generate Code</button>
                    <button type="button" class="button test-card-button" onclick="window.open('https://docs.payu.in/docs/test-cards-upi-id-and-wallets', '_blank')">
                        <i class="fas fa-credit-card"></i> Test Card Details
                    </button>
                    <button type="button" class="button" onclick="submitPayment('bankoffer')">Pay Now</button>
                </div>
            </div>
        </div>
        
        <!-- Debug Section -->
        <div class="debug-section" id="bo-debugSection">
            <h3 class="debug-title">Debug Information</h3>
            <div id="bo-debugContent"></div>
        </div>
        
        <!-- CURL Section -->
        <div class="curl-section" id="bo-curlSection">
            <h3 class="curl-title">CURL Command</h3>
            <div class="curl-content" id="bo-curlContent"></div>
            <button class="copy-button" onclick="copyCurlToClipboard('bankoffer')">Copy to Clipboard</button>
        </div>
    </div>
    
    <!-- Bank Offers Hidden Form -->
    <form id="bo_payu_form" method="post" action="https://test.payu.in/_payment" style="display: none;">
        <input type="hidden" id="bo_key" name="key">
        <input type="hidden" id="bo_txnid_hidden" name="txnid">
        <input type="hidden" id="bo_amount_hidden" name="amount">
        <input type="hidden" id="bo_productinfo_hidden" name="productinfo">
        <input type="hidden" id="bo_firstname_hidden" name="firstname">
        <input type="hidden" id="bo_lastname_hidden" name="lastname">
        <input type="hidden" id="bo_email_hidden" name="email">
        <input type="hidden" id="bo_phone_hidden" name="phone">
        <input type="hidden" id="bo_address1_hidden" name="address1">
        <input type="hidden" id="bo_address2_hidden" name="address2">
        <input type="hidden" id="bo_city_hidden" name="city">
        <input type="hidden" id="bo_state_hidden" name="state">
        <input type="hidden" id="bo_country_hidden" name="country">
        <input type="hidden" id="bo_zipcode_hidden" name="zipcode">
        <input type="hidden" id="bo_udf1_hidden" name="udf1">
        <input type="hidden" id="bo_udf2_hidden" name="udf2">
        <input type="hidden" id="bo_udf3_hidden" name="udf3">
        <input type="hidden" id="bo_udf4_hidden" name="udf4">
        <input type="hidden" id="bo_udf5_hidden" name="udf5">
        <input type="hidden" id="bo_surl_hidden" name="surl">
        <input type="hidden" id="bo_furl_hidden" name="furl">
        <input type="hidden" id="bo_hash" name="hash">
        <input type="hidden" id="bo_enforce_paymethod" name="enforce_paymethod">
        <input type="hidden" id="bo_cart_details_hidden" name="cart_details">
        <input type="hidden" id="bo_api_version_hidden" name="api_version">
        <input type="hidden" id="bo_offer_key_hidden" name="offer_key">
    </form>
    
    <!-- UPI OTM Hidden Form -->
    <form id="upi_payu_form" method="post" action="https://test.payu.in/_payment" style="display: none;">
        <input type="hidden" id="upi_key" name="key">
        <input type="hidden" id="upi_txnid" name="txnid">
        <input type="hidden" id="upi_amount_hidden" name="amount">
        <input type="hidden" id="upi_productinfo_hidden" name="productinfo">
        <input type="hidden" id="upi_firstname_hidden" name="firstname">
        <input type="hidden" id="upi_lastname_hidden" name="lastname">
        <input type="hidden" id="upi_email_hidden" name="email">
        <input type="hidden" id="upi_phone_hidden" name="phone">
        <input type="hidden" id="upi_address1_hidden" name="address1">
        <input type="hidden" id="upi_address2_hidden" name="address2">
        <input type="hidden" id="upi_city_hidden" name="city">
        <input type="hidden" id="upi_state_hidden" name="state">
        <input type="hidden" id="upi_country_hidden" name="country">
        <input type="hidden" id="upi_zipcode_hidden" name="zipcode">
        <input type="hidden" id="upi_udf1_hidden" name="udf1">
        <input type="hidden" id="upi_udf2_hidden" name="udf2">
        <input type="hidden" id="upi_udf3_hidden" name="udf3">
        <input type="hidden" id="upi_udf4_hidden" name="udf4">
        <input type="hidden" id="upi_udf5_hidden" name="udf5">
        <input type="hidden" id="upi_surl_hidden" name="surl">
        <input type="hidden" id="upi_furl_hidden" name="furl">
        <input type="hidden" id="upi_hash" name="hash">
        <input type="hidden" id="upi_api_version" name="api_version" value="7">
        <input type="hidden" id="upi_si_details" name="si_details">
        <input type="hidden" id="upi_pre_authorize" name="pre_authorize" value="1">
    </form>
    
    <!-- TPV Hidden Form -->
    <form id="tpv_payu_form" method="post" action="https://test.payu.in/_payment" style="display: none;">
        <input type="hidden" id="tpv_key" name="key">
        <input type="hidden" id="tpv_txnid" name="txnid">
        <input type="hidden" id="tpv_amount_hidden" name="amount">
        <input type="hidden" id="tpv_productinfo_hidden" name="productinfo">
        <input type="hidden" id="tpv_firstname_hidden" name="firstname">
        <input type="hidden" id="tpv_lastname_hidden" name="lastname">
        <input type="hidden" id="tpv_email_hidden" name="email">
        <input type="hidden" id="tpv_phone_hidden" name="phone">
        <input type="hidden" id="tpv_address1_hidden" name="address1">
        <input type="hidden" id="tpv_address2_hidden" name="address2">
        <input type="hidden" id="tpv_city_hidden" name="city">
        <input type="hidden" id="tpv_state_hidden" name="state">
        <input type="hidden" id="tpv_country_hidden" name="country">
        <input type="hidden" id="tpv_zipcode_hidden" name="zipcode">
        <input type="hidden" id="tpv_udf1_hidden" name="udf1">
        <input type="hidden" id="tpv_udf2_hidden" name="udf2">
        <input type="hidden" id="tpv_udf3_hidden" name="udf3">
        <input type="hidden" id="tpv_udf4_hidden" name="udf4">
        <input type="hidden" id="tpv_udf5_hidden" name="udf5">
        <input type="hidden" id="tpv_beneficiarydetail" name="beneficiarydetail">
        <input type="hidden" id="tpv_si_details" name="si_details">
        <input type="hidden" id="tpv_si" name="si">
        <input type="hidden" id="tpv_surl_hidden" name="surl">
        <input type="hidden" id="tpv_furl_hidden" name="furl">
        <input type="hidden" id="tpv_hash" name="hash">
        <input type="hidden" id="tpv_enforce_paymethod" name="enforce_paymethod">
        <input type="hidden" id="tpv_api_version" name="api_version" value="6">
    </form>
    
    
    <!-- Code Generator Modal -->
    <div id="codeGeneratorModal" class="code-modal" style="display: none;">
        <div class="code-modal-content">
            <div class="code-modal-header">
                <h2>Generate Integration Code - <span id="codeFlowName">Non-Seamless</span></h2>
                <button class="code-modal-close" onclick="closeCodeGeneratorModal()">&times;</button>
            </div>
            
            <div class="code-tabs">
                <button class="code-tab active" onclick="switchCodeLanguage('java')">Java</button>
                <button class="code-tab" onclick="switchCodeLanguage('php')">PHP</button>
                <button class="code-tab" onclick="switchCodeLanguage('python')">Python</button>
                <button class="code-tab" onclick="switchCodeLanguage('nodejs')">Node.js</button>
            </div>
            
            <div class="code-preview-container">
                <div class="code-action-icons">
                    <button class="code-icon-btn" onclick="copyGeneratedCode()" title="Copy Code">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                        </svg>
                    </button>
                    <button class="code-icon-btn" onclick="downloadGeneratedCode()" title="Download">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <pre id="generatedCodePreview" class="code-preview"></pre>
            </div>
            
            <div class="code-instructions">
                <h4>Instructions:</h4>
                <ol>
                    <li>Replace <code>YOUR_MERCHANT_KEY</code> with your actual PayU merchant key</li>
                    <li>Replace <code>YOUR_MERCHANT_SALT</code> with your actual PayU merchant salt</li>
                    <li>Update redirect URLs (SURL/FURL) as needed for your application</li>
                    <li>Test in PayU test environment before going live</li>
                </ol>
            </div>
        </div>
    </div>
    <script src="js/app.js"></script>
</body>
</html>
