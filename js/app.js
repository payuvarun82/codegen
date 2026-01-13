        // Global Variables
        let currentFlow = '';
        let currentPaymentType = 'onetime';
        const DEFAULT_KEY = 'a4vGC2';
        const DEFAULT_SALT = 'hKvGJP28d2ZUuCRz5BnDag58QBdCxBli';
        
        // Default Callback URLs - Change these URLs in one place to update all flows
        const DEFAULT_SURL = 'http://localhost:8085/callback.php';
        const DEFAULT_FURL = 'http://localhost:8085/callback.php';
        
        // Back Button Detection - Auto-refresh for new transaction ID
        window.addEventListener('pageshow', function(event) {
            // Check if page was restored from browser cache (back/forward button)
            if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
                console.log('⟲ Page restored from cache (back button) - Refreshing for new transaction ID');
                window.location.reload(true); // Force reload from server
            }
        });
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🔄 Page Loaded - Generating fresh transaction IDs for all flows');
            
            // Initialize default callback URLs for all flows
            initializeCallbackUrls();
            
            // Initialize transaction IDs for all flows
            generateTransactionId('crossborder');
            generateTransactionId('nonseamless');
            generateTransactionId('subscription');
            generateTransactionId('tpv');
            generateTransactionId('upiotm');
            generateTransactionId('preauth');
            generateTransactionId('checkoutplus');
            generateTransactionId('split');
            generateTransactionId('bankoffer');
            
            // Initialize Fill with Sample Data button visibility based on custom keys state
            const flows = ['crossborder', 'nonseamless', 'subscription', 'tpv', 'upiotm', 'preauth', 'checkoutplus', 'split', 'bankoffer'];
            flows.forEach(function(flow) {
                const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
                const customKeysCheckbox = document.getElementById(prefix + '_use_custom_keys');
                const templateWrapper = document.getElementById(prefix + '-generate-template-wrapper');
                
                if (templateWrapper) {
                    // Show button only if custom keys are NOT checked (predefined credentials)
                    if (customKeysCheckbox && !customKeysCheckbox.checked) {
                        templateWrapper.style.display = 'block';
                    } else {
                        templateWrapper.style.display = 'none';
                    }
                }
            });
            
            // Set default values for subscription flows (both Cross Border and Non-Seamless)
            const today = new Date().toISOString().split('T')[0];
            
            console.log('=== Initializing Subscription Fields on Page Load ===');
            console.log('Current date:', today);
            
            // Cross Border subscription defaults
            const cbPaymentStartDate = document.getElementById('cb_payment_start_date');
            const cbBillingInterval = document.getElementById('cb_billing_interval');
            
            if (cbPaymentStartDate) {
                cbPaymentStartDate.value = today;
                cbPaymentStartDate.min = today; // Prevent past date selection
                console.log('✓ Cross Border payment_start_date set to:', cbPaymentStartDate.value);
            } else {
                console.error('✗ Cross Border payment_start_date field NOT FOUND');
            }
            
            if (cbBillingInterval) {
                cbBillingInterval.value = '1';
                console.log('✓ Cross Border billing_interval set to:', cbBillingInterval.value);
            } else {
                console.error('✗ Cross Border billing_interval field NOT FOUND');
            }
            
            // Cross Border SI and API version (prefilled fields)
            const cbSi = document.getElementById('cb_si');
            const cbApiVersion = document.getElementById('cb_api_version');
            
            if (cbSi) {
                cbSi.value = '1';
                console.log('✓ Cross Border SI set to:', cbSi.value);
            } else {
                console.error('✗ Cross Border SI field NOT FOUND');
            }
            
            if (cbApiVersion) {
                cbApiVersion.value = '7';
                console.log('✓ Cross Border API Version set to:', cbApiVersion.value);
            } else {
                console.error('✗ Cross Border API Version field NOT FOUND');
            }
            
            // Non-Seamless subscription defaults
            const subPaymentStartDate = document.getElementById('sub_payment_start_date');
            const subBillingInterval = document.getElementById('sub_billing_interval');
            
            if (subPaymentStartDate) {
                subPaymentStartDate.value = today;
                subPaymentStartDate.min = today; // Prevent past date selection
                console.log('✓ Non-Seamless payment_start_date set to:', subPaymentStartDate.value);
            } else {
                console.error('✗ Non-Seamless payment_start_date field NOT FOUND');
            }
            
            if (subBillingInterval) {
                subBillingInterval.value = '1';
                console.log('✓ Non-Seamless billing_interval set to:', subBillingInterval.value);
            } else {
                console.error('✗ Non-Seamless billing_interval field NOT FOUND');
            }
            
            // Non-Seamless SI and API version (prefilled fields)
            const subSi = document.getElementById('sub_si');
            const subApiVersion = document.getElementById('sub_api_version');
            
            if (subSi) {
                subSi.value = '1';
                console.log('✓ Non-Seamless SI set to:', subSi.value);
            } else {
                console.error('✗ Non-Seamless SI field NOT FOUND');
            }
            
            if (subApiVersion) {
                subApiVersion.value = '7';
                console.log('✓ Non-Seamless API Version set to:', subApiVersion.value);
            } else {
                console.error('✗ Non-Seamless API Version field NOT FOUND');
            }
            
            // UPI OTM defaults (start date = today, end date = today + 7 days)
            const upiPaymentStartDate = document.getElementById('upi_payment_start_date');
            const upiPaymentEndDate = document.getElementById('upi_payment_end_date');
            
            if (upiPaymentStartDate) {
                upiPaymentStartDate.value = today;
                upiPaymentStartDate.min = today; // Prevent past date selection
                console.log('✓ UPI OTM payment_start_date set to:', upiPaymentStartDate.value);
            } else {
                console.error('✗ UPI OTM payment_start_date field NOT FOUND');
            }
            
            if (upiPaymentEndDate) {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 7); // Default to 7 days from today
                upiPaymentEndDate.value = endDate.toISOString().split('T')[0];
                console.log('✓ UPI OTM payment_end_date set to:', upiPaymentEndDate.value);
            } else {
                console.error('✗ UPI OTM payment_end_date field NOT FOUND');
            }
            
            console.log('=== Subscription Fields Initialization Complete ===');
            
            // Add validation listeners
            addValidationListeners();
            
            // Restore flow from localStorage if page was refreshed
            const savedFlow = localStorage.getItem('currentPaymentFlow');
            const savedPaymentType = localStorage.getItem('currentPaymentType');
            
            if (savedFlow && savedFlow !== '') {
                console.log('=== Restoring Flow from localStorage ===');
                console.log('Saved Flow:', savedFlow);
                console.log('Saved Payment Type:', savedPaymentType);
                
                // Set the dropdown value
                document.getElementById('flowSelect').value = savedFlow;
                
                // Hide landing and show the saved flow
                document.getElementById('landingSection').style.display = 'none';
                document.getElementById(savedFlow + 'Flow').classList.add('active');
                currentFlow = savedFlow;
                
                // For cross border, restore payment type
                if (savedFlow === 'crossborder' && savedPaymentType) {
                    currentPaymentType = savedPaymentType;
                    // Update UI to show correct payment type
                    if (savedPaymentType === 'subscription') {
                        document.getElementById('cb-onetime-section').classList.remove('active');
                        document.getElementById('cb-subscription-section').classList.add('active');
                        document.getElementById('cb-onetime-udf-section').classList.remove('active');
                        document.getElementById('cb-subscription-udf-section').classList.add('active');
                        
                        // Show eNACH amount note for subscription
                        const enachNote = document.getElementById('cb_enach_amount_note');
                        if (enachNote) enachNote.style.display = 'block';
                    } else {
                        // Hide eNACH amount note for one-time payment
                        const enachNote = document.getElementById('cb_enach_amount_note');
                        if (enachNote) enachNote.style.display = 'none';
                    }
                }
                
                console.log('✓ Flow restored successfully');
            } else {
                console.log('No saved flow found - showing landing page');
            }
            
            // Initialize character counters for all fields with maxlength
            initializeCharCounters();
            
            // Initialize transaction ID field listeners (for custom credentials mode)
            initializeTxnidListeners();
        });
        
        // Character Counter Functions
        function updateCharCounter(inputElement) {
            const maxLength = parseInt(inputElement.getAttribute('maxlength'));
            const currentLength = inputElement.value.length;
            const remaining = maxLength - currentLength;
            
            // Find the associated counter element
            const counterId = inputElement.id + '_counter';
            let counter = document.getElementById(counterId);
            
            if (counter) {
                counter.textContent = `${currentLength}/${maxLength}`;
                
                // Update styling based on usage
                counter.classList.remove('warning', 'error');
                if (remaining === 0) {
                    counter.classList.add('error');
                } else if (remaining <= maxLength * 0.1) {  // Warning at 90% usage
                    counter.classList.add('warning');
                }
            }
        }
        
        function initializeCharCounters() {
            // Get all inputs with maxlength attribute
            const inputsWithMaxLength = document.querySelectorAll('input[maxlength]:not([type="hidden"])');
            
            inputsWithMaxLength.forEach(input => {
                // Add input event listener
                input.addEventListener('input', function() {
                    updateCharCounter(this);
                });
                
                // Initial update (handles pre-filled values)
                updateCharCounter(input);
            });
            
            // Re-initialize counters when form values change programmatically
            // This ensures counters update when default values are set
            setTimeout(() => {
                inputsWithMaxLength.forEach(input => {
                    if (input.value) {
                        updateCharCounter(input);
                    }
                });
            }, 100);
        }
        
        // Transaction ID Field Listeners (for custom credentials mode)
        function initializeTxnidListeners() {
            // All transaction ID display fields across flows
            const txnidFields = [
                'cb_txnid_display', 'ns_txnid_display', 'sub_txnid_display',
                'tpv_txnid_display', 'upi_txnid_display', 'preauth_txnid_display',
                'cp_txnid_display', 'split_txnid_display', 'bo_txnid_display'
            ];
            
            txnidFields.forEach(fieldId => {
                const displayField = document.getElementById(fieldId);
                if (!displayField) return;
                
                // Extract prefix from field ID (remove _txnid_display)
                const prefix = fieldId.replace('_txnid_display', '');
                const hiddenField = document.getElementById(prefix + '_txnid');
                const hashField = document.getElementById(prefix + '_hash');
                
                // Input event: sync display → hidden field and update counter
                displayField.addEventListener('input', function() {
                    if (hiddenField) {
                        hiddenField.value = this.value;
                    }
                    
                    // Clear hash (needs regeneration with new txnid)
                    if (hashField) {
                        hashField.value = '';
                    }
                    
                    // Update character counter
                    updateCharCounter(this);
                });
                
                // Blur event: validate format
                displayField.addEventListener('blur', function() {
                    const value = this.value.trim();
                    
                    // Skip validation if empty (will be caught by required validation)
                    if (!value) return;
                    
                    // Allow only alphanumeric, underscore, and hyphen
                    const validPattern = /^[A-Za-z0-9_-]+$/;
                    
                    if (!validPattern.test(value)) {
                        alert('Transaction ID can only contain letters, numbers, underscores (_), and hyphens (-).\nPlease remove any special characters.');
                        this.focus();
                        return;
                    }
                    
                    // Check length (should be enforced by maxlength, but double-check)
                    if (value.length > 25) {
                        alert('Transaction ID cannot exceed 25 characters.\nCurrent length: ' + value.length);
                        this.focus();
                    }
                });
            });
            
            console.log('✓ Transaction ID field listeners initialized for custom credentials mode');
        }
        
        // Initialize callback URLs for all flows with default values
        // Change DEFAULT_SURL and DEFAULT_FURL constants at the top of this file to update all flows
        function initializeCallbackUrls() {
            const flowPrefixes = ['cb', 'ns', 'sub', 'tpv', 'upi', 'preauth', 'cp', 'split', 'bo'];
            
            flowPrefixes.forEach(function(prefix) {
                const surlField = document.getElementById(prefix + '_surl');
                const furlField = document.getElementById(prefix + '_furl');
                
                if (surlField) {
                    surlField.value = DEFAULT_SURL;
                }
                if (furlField) {
                    furlField.value = DEFAULT_FURL;
                }
            });
            
            console.log('✓ All callback URLs initialized with defaults:', DEFAULT_SURL);
        }
        
        // UPI OTM Date Validation Function
        function validateUpiOtmDates() {
            const startDate = document.getElementById('upi_payment_start_date');
            const endDate = document.getElementById('upi_payment_end_date');
            
            if (!startDate || !endDate || !startDate.value || !endDate.value) {
                return true; // Let required validation handle empty fields
            }
            
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            
            // Check if end date is more than 14 days from start date
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays > 14) {
                alert('Error: Payment End Date cannot be more than 14 days from the Start Date.\n\nCurrent difference: ' + diffDays + ' days\nMaximum allowed: 14 days');
                // Reset end date to start date + 7 days
                const newEndDate = new Date(start);
                newEndDate.setDate(start.getDate() + 7);
                endDate.value = newEndDate.toISOString().split('T')[0];
                return false;
            }
            
            // Check if end date is before start date
            if (end < start) {
                alert('Error: Payment End Date cannot be before the Start Date.');
                endDate.value = startDate.value;
                return false;
            }
            
            return true;
        }
        
        // Add Validation Listeners
        function addValidationListeners() {
            // Cross border validation
            if (document.getElementById('cb_phone')) {
                document.getElementById('cb_phone').addEventListener('input', function() {
                    validatePhone('crossborder');
                });
                document.getElementById('cb_email').addEventListener('blur', function() {
                    validateEmail('crossborder');
                });
            }
            
            // Non-seamless validation
            if (document.getElementById('ns_phone')) {
                document.getElementById('ns_phone').addEventListener('input', function() {
                    validatePhone('nonseamless');
                });
                document.getElementById('ns_email').addEventListener('blur', function() {
                    validateEmail('nonseamless');
                });
            }
            
            // Subscription validation
            if (document.getElementById('sub_phone')) {
                document.getElementById('sub_phone').addEventListener('input', function() {
                    validatePhone('subscription');
                });
                document.getElementById('sub_email').addEventListener('blur', function() {
                    validateEmail('subscription');
                });
            }
            
            // UPI OTM validation
            if (document.getElementById('upi_phone')) {
                document.getElementById('upi_phone').addEventListener('input', function() {
                    validatePhone('upiotm');
                });
                document.getElementById('upi_email').addEventListener('blur', function() {
                    validateEmail('upiotm');
                });
            }
            
            // PreAuth validation
            if (document.getElementById('preauth_phone')) {
                document.getElementById('preauth_phone').addEventListener('input', function() {
                    validatePhone('preauth');
                });
                document.getElementById('preauth_email').addEventListener('blur', function() {
                    validateEmail('preauth');
                });
            }
            
            // Checkout Plus validation
            if (document.getElementById('cp_phone')) {
                document.getElementById('cp_phone').addEventListener('input', function() {
                    validatePhone('checkoutplus');
                });
                document.getElementById('cp_email').addEventListener('blur', function() {
                    validateEmail('checkoutplus');
                });
            }
            
            // Split Payment validation
            if (document.getElementById('split_phone')) {
                document.getElementById('split_phone').addEventListener('input', function() {
                    validatePhone('split');
                });
                document.getElementById('split_email').addEventListener('blur', function() {
                    validateEmail('split');
                });
            }
            
            // Bank Offers validation
            if (document.getElementById('bo_phone')) {
                document.getElementById('bo_phone').addEventListener('input', function() {
                    validatePhone('bankoffer');
                });
                document.getElementById('bo_email').addEventListener('blur', function() {
                    validateEmail('bankoffer');
                });
            }
            
            // TPV validation
            if (document.getElementById('tpv_phone')) {
                document.getElementById('tpv_phone').addEventListener('input', function() {
                    validatePhone('tpv');
                });
                document.getElementById('tpv_email').addEventListener('blur', function() {
                    validateEmail('tpv');
                });
            }
            
            // Initialize form validation for all flows (enable/disable buttons based on required fields)
            console.log('🔒 Initializing Button State Validation for all flows');
            setupFormValidation('crossborder');
            setupFormValidation('nonseamless');
            setupFormValidation('subscription');
            setupFormValidation('tpv');
            setupFormValidation('upiotm');
            setupFormValidation('preauth');
            setupFormValidation('checkoutplus');
            setupFormValidation('split');
            setupFormValidation('bankoffer');
            console.log('✓ Button State Validation initialized for all flows');
        }
        
        // ============================================
        // SPLIT PAYMENT SPECIFIC FUNCTIONS
        // ============================================
        
        let splitRowCounter = 0;
        
        // ============================================
        // BANK OFFERS SPECIFIC FUNCTIONS
        // ============================================
        
        let boSkuRowCounter = 0;
        
        // Add a new split row
        function addSplitRow() {
            splitRowCounter++;
            const container = document.getElementById('splitRowsContainer');
            
            if (!container) {
                console.error('✗ Split rows container not found!');
                return;
            }
            
            const splitType = document.querySelector('input[name="split_type"]:checked').value;
            
            // Check if using custom keys - if not, prefill child merchant key with test key based on position
            const useCustomKeysCheckbox = document.getElementById('split_use_custom_keys');
            const useCustomKeys = useCustomKeysCheckbox ? useCustomKeysCheckbox.checked : false;
            
            // Get existing rows count to determine which predefined key to use
            const existingRows = document.querySelectorAll('.split-row').length;
            let defaultMerchantKey = '';
            
            if (!useCustomKeys) {
                // For predefined credentials: first child = 'gYoEaY', second child = '5rgA73', third+ = blank
                if (existingRows === 0) {
                    defaultMerchantKey = 'gYoEaY';
                } else if (existingRows === 1) {
                    defaultMerchantKey = '5rgA73';
                } else {
                    defaultMerchantKey = '';
                }
            }
            
            const placeholderText = splitType === 'absolute' ? '500.00' : '50';
            const amountLabel = splitType === 'absolute' ? 'Amount (INR)' : 'Percentage';
            
            // Generate child transaction ID ONLY when NOT using custom keys
            // When using custom keys, merchant should provide their own transaction IDs
            let childTxnId = '';
            let isTxnIdReadonly = true;
            let txnIdPlaceholder = 'Auto-generated';
            let txnIdSmallText = 'Auto-generated unique ID';
            
            if (!useCustomKeys) {
                // Only generate transaction ID for predefined credentials
                const timestamp = Date.now();
                const randomSuffix = Math.floor(Math.random() * 10000);
                childTxnId = 'child_' + timestamp + '_' + randomSuffix;
            } else {
                // For custom keys, make it editable and don't prefill
                isTxnIdReadonly = false;
                txnIdPlaceholder = 'Enter child transaction ID';
                txnIdSmallText = 'Enter your own transaction ID';
            }
            
            const rowId = splitRowCounter;
            
            console.log('=== Adding Split Row #' + rowId + ' ===');
            console.log('  Custom Keys Checkbox Checked: ' + useCustomKeys);
            console.log('  Existing Rows Count: ' + existingRows);
            console.log('  Default Merchant Key: "' + defaultMerchantKey + '" (Position-based for predefined creds)');
            if (!useCustomKeys) {
                console.log('  Child Transaction ID: ' + childTxnId + ' (Auto-generated)');
            } else {
                console.log('  Child Transaction ID: (Not prefilled - merchant to provide)');
            }
            
            // Create row container
            const row = document.createElement('div');
            row.className = 'split-row';
            row.id = 'split_row_' + rowId;
            
            // Create form groups
            const formGroupMerchantKey = document.createElement('div');
            formGroupMerchantKey.className = 'form-group';
            formGroupMerchantKey.innerHTML = `
                <label>Child Merchant Key <span class="required">*</span></label>
                <input type="text" class="split-merchant-key" placeholder="e.g., gYoEaY" required>
                <small style="color: var(--text-tertiary);">Must be pre-configured with PayU</small>
            `;
            // Set value programmatically for reliability
            const merchantKeyInput = formGroupMerchantKey.querySelector('.split-merchant-key');
            if (merchantKeyInput) {
                merchantKeyInput.value = defaultMerchantKey;
                console.log('  Set Merchant Key Input Value: "' + merchantKeyInput.value + '"');
            }
            
            const formGroupTxnId = document.createElement('div');
            formGroupTxnId.className = 'form-group';
            const readonlyAttr = isTxnIdReadonly ? 'readonly' : '';
            const readonlyStyle = isTxnIdReadonly ? 'background-color: #f0f0f0; cursor: not-allowed;' : '';
            formGroupTxnId.innerHTML = `
                <label>Child Transaction ID <span class="required">*</span></label>
                <input type="text" class="split-txn-id" placeholder="${txnIdPlaceholder}" required ${readonlyAttr} style="${readonlyStyle}">
                <small style="color: var(--text-tertiary);">${txnIdSmallText}</small>
            `;
            // Set value programmatically only if not using custom keys
            const txnIdInput = formGroupTxnId.querySelector('.split-txn-id');
            if (txnIdInput && !useCustomKeys && childTxnId) {
                txnIdInput.value = childTxnId;
                console.log('  Set Transaction ID Input Value: "' + txnIdInput.value + '"');
            } else if (txnIdInput && useCustomKeys) {
                console.log('  Transaction ID field left empty for custom credentials (merchant to provide)');
            }
            
            const formGroupAmount = document.createElement('div');
            formGroupAmount.className = 'form-group';
            formGroupAmount.innerHTML = `
                <label>${amountLabel} <span class="required">*</span></label>
                <input type="number" class="split-amount" placeholder="${placeholderText}" step="0.01" min="0" required>
            `;
            
            const formGroupCharges = document.createElement('div');
            formGroupCharges.className = 'form-group';
            formGroupCharges.innerHTML = `
                <label>Charges <span class="optional">(Optional)</span></label>
                <input type="number" class="split-charges" placeholder="0.00" value="0.00" step="0.01" min="0">
            `;
            
            // Create remove button
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-split-btn';
            removeBtn.title = 'Remove this child';
            removeBtn.innerHTML = '&times;';
            removeBtn.onclick = function() {
                removeSplitRow(rowId);
            };
            
            // Append all elements to row
            row.appendChild(formGroupMerchantKey);
            row.appendChild(formGroupTxnId);
            row.appendChild(formGroupAmount);
            row.appendChild(formGroupCharges);
            row.appendChild(removeBtn);
            
            // Append row to container
            container.appendChild(row);
            
            // Verify the inputs have the correct values after appending
            setTimeout(function() {
                const merchantKeyInput = row.querySelector('.split-merchant-key');
                const txnIdInput = row.querySelector('.split-txn-id');
                const actualMerchantKey = merchantKeyInput ? merchantKeyInput.value : 'NOT FOUND';
                const actualTxnId = txnIdInput ? txnIdInput.value : 'NOT FOUND';
                
                console.log('✓ Split row #' + rowId + ' added and verified');
                console.log('  Expected Merchant Key: "' + defaultMerchantKey + '" | Actual: "' + actualMerchantKey + '"');
                
                if (!useCustomKeys) {
                    console.log('  Expected Transaction ID: "' + childTxnId + '" | Actual: "' + actualTxnId + '"');
                    if (actualMerchantKey !== defaultMerchantKey) {
                        console.error('✗ Merchant Key mismatch!');
                    }
                    if (actualTxnId !== childTxnId) {
                        console.error('✗ Transaction ID mismatch!');
                    }
                } else {
                    console.log('  Transaction ID: (Empty - merchant to provide) | Actual: "' + actualTxnId + '"');
                    if (actualMerchantKey !== defaultMerchantKey) {
                        console.error('✗ Merchant Key mismatch!');
                    }
                    if (actualTxnId && actualTxnId !== 'NOT FOUND') {
                        console.warn('⚠ Transaction ID should be empty for custom credentials');
                    }
                }
                
                // Add event listeners to the inputs for real-time validation
                // Reuse existing merchantKeyInput and txnIdInput from above
                const amountInput = row.querySelector('.split-amount');
                const chargesInput = row.querySelector('.split-charges');
                
                [merchantKeyInput, txnIdInput, amountInput, chargesInput].forEach(function(input) {
                    if (input) {
                        input.addEventListener('input', function() {
                            updateButtonStates('split');
                        });
                        input.addEventListener('change', function() {
                            updateButtonStates('split');
                        });
                    }
                });
                
                // Update button states after adding row
                updateButtonStates('split');
            }, 10);
        }
        
        // Remove a split row
        function removeSplitRow(rowId) {
            const row = document.getElementById('split_row_' + rowId);
            if (row) {
                row.remove();
                console.log('✓ Removed split row #' + rowId);
                
                // Update button states after removing row
                updateButtonStates('split');
            } else {
                console.error('✗ Could not find row with ID: split_row_' + rowId);
            }
        }
        
        // Regenerate all child transaction IDs (only for predefined credentials)
        function regenerateSplitChildTransactionIds() {
            // Check if using custom keys - if yes, don't regenerate
            const useCustomKeysCheckbox = document.getElementById('split_use_custom_keys');
            const useCustomKeys = useCustomKeysCheckbox ? useCustomKeysCheckbox.checked : false;
            
            if (useCustomKeys) {
                console.log('⚠ Skipping transaction ID regeneration - using custom credentials (merchant provides their own IDs)');
                return;
            }
            
            const splitRows = document.querySelectorAll('.split-row');
            let regeneratedCount = 0;
            
            splitRows.forEach((row, index) => {
                const txnIdInput = row.querySelector('.split-txn-id');
                if (txnIdInput && txnIdInput.readOnly) {
                    // Only regenerate readonly (auto-generated) transaction IDs
                    const timestamp = Date.now();
                    const randomSuffix = Math.floor(Math.random() * 10000);
                    const newChildTxnId = 'child_' + timestamp + '_' + randomSuffix;
                    txnIdInput.value = newChildTxnId;
                    regeneratedCount++;
                    console.log('  Child ' + (index + 1) + ' new txnId: ' + newChildTxnId);
                }
            });
            
            console.log('✓ Regenerated ' + regeneratedCount + ' child transaction IDs');
        }
        
        // Update split placeholders when type changes
        function updateSplitPlaceholders() {
            const splitType = document.querySelector('input[name="split_type"]:checked').value;
            const amountInputs = document.querySelectorAll('.split-amount');
            const placeholderText = splitType === 'absolute' ? '500.00' : '50';
            const amountLabel = splitType === 'absolute' ? 'Amount (INR)' : 'Percentage';
            
            amountInputs.forEach(input => {
                input.placeholder = placeholderText;
                const label = input.closest('.form-group').querySelector('label');
                if (label) {
                    label.innerHTML = amountLabel + ' <span class="required">*</span>';
                }
            });
            
            console.log('✓ Updated split placeholders for type:', splitType);
        }
        
        // Build splitRequest JSON from form inputs
        function buildSplitRequestJson() {
            const splitType = document.querySelector('input[name="split_type"]:checked').value;
            const splitRows = document.querySelectorAll('.split-row');
            
            console.log('=== Building splitRequest JSON ===');
            console.log('Split Type: ' + splitType);
            console.log('Total child rows: ' + splitRows.length);
            
            if (splitRows.length === 0) {
                alert('Please add at least one split merchant configuration');
                return null;
            }
            
            const splitInfo = {};
            let validRowCount = 0;
            const merchantKeys = [];
            
            splitRows.forEach((row, index) => {
                const merchantKey = row.querySelector('.split-merchant-key').value.trim();
                const txnId = row.querySelector('.split-txn-id').value.trim();
                const amount = row.querySelector('.split-amount').value.trim();
                const charges = row.querySelector('.split-charges').value.trim() || '0.00';
                
                console.log('Row ' + (index + 1) + ':', {
                    merchantKey: merchantKey,
                    txnId: txnId,
                    amount: amount,
                    charges: charges
                });
                
                if (!merchantKey || !txnId || !amount) {
                    console.warn('⚠ Skipping row ' + (index + 1) + ' - missing required fields');
                    return;
                }
                
                // Check for duplicate merchant keys
                if (splitInfo[merchantKey]) {
                    console.warn('⚠ Duplicate merchant key "' + merchantKey + '" found. Each child should have a unique merchant key.');
                }
                
                // Add child merchant details
                splitInfo[merchantKey] = {
                    "aggregatorSubTxnId": txnId,
                    "aggregatorSubAmt": amount,
                    "aggregatorCharges": charges
                };
                
                merchantKeys.push(merchantKey);
                validRowCount++;
            });
            
            console.log('Valid rows processed: ' + validRowCount);
            console.log('Merchant keys: ' + merchantKeys.join(', '));
            
            if (Object.keys(splitInfo).length === 0) {
                alert('Please fill in all required fields for split merchants');
                return null;
            }
            
            const splitRequest = {
                "type": splitType,
                "splitInfo": splitInfo
            };
            
            const splitRequestJson = JSON.stringify(splitRequest);
            console.log('✓ Built splitRequest JSON:');
            console.log(JSON.stringify(splitRequest, null, 2));
            
            return splitRequestJson;
        }
        
        // Validate split amounts
        function validateSplitAmounts() {
            const splitType = document.querySelector('input[name="split_type"]:checked').value;
            const totalAmount = parseFloat(document.getElementById('split_amount').value) || 0;
            const splitRows = document.querySelectorAll('.split-row');
            
            if (splitRows.length === 0) {
                alert('Please add at least one split merchant configuration');
                return false;
            }
            
            let splitTotal = 0;
            const amounts = [];
            
            splitRows.forEach(row => {
                const amount = parseFloat(row.querySelector('.split-amount').value) || 0;
                amounts.push(amount);
                splitTotal += amount;
            });
            
            if (splitType === 'percentage') {
                if (splitTotal > 100) {
                    alert('Split percentages cannot exceed 100%. Current total: ' + splitTotal + '%');
                    return false;
                }
            } else {
                // For absolute amounts, sum can be less than or equal to total
                // Remaining amount goes to parent merchant
            }
            
            return true;
        }
        
        // ============================================
        // BANK OFFERS - SKU MANAGEMENT FUNCTIONS
        // ============================================
        
        // Toggle SKU offers section
        function toggleSkuOffers(flow) {
            if (flow !== 'bankoffer') return;
            
            const skuCheckbox = document.getElementById('bo_enable_sku');
            const skuConfig = document.getElementById('bo-sku-config');
            const apiVersionSection = document.getElementById('bo-api-version-section');
            const isEnabled = skuCheckbox.checked;
            
            if (isEnabled) {
                skuConfig.style.display = 'block';
                apiVersionSection.style.display = 'block'; // Show API version field
                
                // Initialize cart configuration fields with default values
                document.getElementById('bo_surcharges').value = '';
                document.getElementById('bo_pre_discount').value = '0';
                
                // Clear existing SKU rows
                document.getElementById('boSkuRowsContainer').innerHTML = '';
                boSkuRowCounter = 0;
                
                // Check if using custom credentials
                const useCustomKeys = document.getElementById('bo_use_custom_keys').checked;
                
                if (!useCustomKeys) {
                    // Predefined credentials - add 2 SKUs with prefilled IDs/names
                    addBankOfferSkuRow('testProduct11', 'SkuTest11');
                    addBankOfferSkuRow('testProduct12', 'SkuTest12');
                    console.log('✓ SKU offers enabled with 2 predefined SKUs');
                    console.log('✓ API Version 19 will be used for SKU-based cart details');
                } else {
                    // Custom credentials - start with empty form
                    console.log('✓ SKU offers enabled for custom credentials (no prefilled SKUs)');
                    console.log('✓ API Version 19 will be used for SKU-based cart details');
                }
                
                updateSkuLimitMessage();
            } else {
                skuConfig.style.display = 'none';
                apiVersionSection.style.display = 'none'; // Hide API version field
                // Clear SKU rows
                document.getElementById('boSkuRowsContainer').innerHTML = '';
                boSkuRowCounter = 0;
                // Clear cart configuration fields
                document.getElementById('bo_surcharges').value = '';
                document.getElementById('bo_pre_discount').value = '0';
                // Clear JSON preview
                document.getElementById('bo-json-preview').textContent = '';
                document.getElementById('bo-total-items').textContent = '0';
                document.getElementById('bo-calculated-amount').textContent = '0.00';
                console.log('✓ SKU offers disabled for bank offers');
            }
            
            // Update button states after toggling SKU offers
            updateButtonStates('bankoffer');
        }
        
        // Update SKU limit message
        function updateSkuLimitMessage() {
            const currentCount = document.querySelectorAll('#boSkuRowsContainer > div').length;
            const limitMsg = document.getElementById('bo-sku-limit-msg');
            const addButton = document.querySelector('button[onclick="addBankOfferSkuRow()"]');
            
            if (currentCount >= 5) {
                limitMsg.textContent = 'Maximum 5 SKUs reached';
                limitMsg.style.color = 'var(--warning-color)';
                if (addButton) addButton.disabled = true;
            } else {
                limitMsg.textContent = `${currentCount} of 5 SKUs added`;
                limitMsg.style.color = 'var(--text-tertiary)';
                if (addButton) addButton.disabled = false;
            }
        }
        
        // Add SKU row to custom builder
        function addBankOfferSkuRow(prefilledSkuId, prefilledSkuName) {
            const container = document.getElementById('boSkuRowsContainer');
            
            if (!container) {
                console.error('✗ SKU rows container not found!');
                return;
            }
            
            // Check max limit
            const currentCount = document.querySelectorAll('#boSkuRowsContainer > div').length;
            if (currentCount >= 5) {
                alert('Maximum 5 SKUs allowed. Please remove an existing SKU to add a new one.');
                console.warn('⚠ Maximum SKU limit (5) reached');
                return;
            }
            
            // If no prefilled values provided, check if we should auto-prefill based on predefined keys
            if (!prefilledSkuId && !prefilledSkuName) {
                const useCustomKeys = document.getElementById('bo_use_custom_keys').checked;
                
                if (!useCustomKeys) {
                    // Using predefined keys - auto-prefill based on position
                    if (currentCount === 0) {
                        // First SKU
                        prefilledSkuId = 'testProduct11';
                        prefilledSkuName = 'SkuTest11';
                    } else if (currentCount === 1) {
                        // Second SKU
                        prefilledSkuId = 'testProduct12';
                        prefilledSkuName = 'SkuTest12';
                    }
                    // For 3rd, 4th, 5th SKUs: leave blank (prefilledSkuId and prefilledSkuName remain undefined)
                }
            }
            
            boSkuRowCounter++;
            const rowId = boSkuRowCounter;
            
            console.log('=== Adding SKU Row #' + rowId + ' ===');
            console.log('  Current SKU count before adding: ' + currentCount);
            if (prefilledSkuId) console.log('  Prefilled SKU ID: ' + prefilledSkuId);
            if (prefilledSkuName) console.log('  Prefilled SKU Name: ' + prefilledSkuName);
            
            // Create row container with full-width styling
            const row = document.createElement('div');
            row.id = 'bo_sku_row_' + rowId;
            row.style.cssText = `
                margin-bottom: 1.75rem;
                margin-left: -2rem;
                margin-right: -2rem;
                padding: 2.5rem 2rem;
                background: linear-gradient(to bottom, #ffffff, #fafbfc);
                border-radius: 0;
                position: relative;
                border-top: 2px solid #e2e8f0;
                border-bottom: 2px solid #e2e8f0;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            
            // Add hover effect for better UX - full width highlight
            row.onmouseenter = function() {
                this.style.borderTopColor = 'var(--accent-primary)';
                this.style.borderBottomColor = 'var(--accent-primary)';
                this.style.boxShadow = '0 4px 16px rgba(16, 132, 109, 0.12)';
                this.style.background = 'linear-gradient(to bottom, #f0f9f7, #e6f5f2)';
            };
            row.onmouseleave = function() {
                this.style.borderTopColor = '#e2e8f0';
                this.style.borderBottomColor = '#e2e8f0';
                this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                this.style.background = 'linear-gradient(to bottom, #ffffff, #fafbfc)';
            };
            
            // Create header with row number - improved styling
            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.75rem;
                padding-bottom: 1.25rem;
                border-bottom: 2px solid #e2e8f0;
            `;
            header.innerHTML = `
                <h4 style="margin: 0; color: var(--accent-primary); font-size: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
                    <span style="display: inline-block; width: 32px; height: 32px; border-radius: 50%; background: var(--accent-primary); color: white; text-align: center; line-height: 32px; font-size: 0.9rem;">${rowId}</span>
                    SKU Item #${rowId}
                </h4>
            `;
            
            // Create remove button - improved styling
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-split-btn';
            removeBtn.title = 'Remove this SKU';
            removeBtn.innerHTML = '&times;';
            removeBtn.style.cssText = `
                position: relative;
                top: 0;
                right: 0;
                background: var(--error-color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                cursor: pointer;
                font-size: 24px;
                font-weight: 700;
                line-height: 1;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 2px 8px rgba(245, 101, 101, 0.3);
            `;
            removeBtn.onmouseover = function() {
                this.style.background = '#c62828';
                this.style.transform = 'scale(1.15) rotate(90deg)';
                this.style.boxShadow = '0 4px 16px rgba(198, 40, 40, 0.4)';
            };
            removeBtn.onmouseout = function() {
                this.style.background = 'var(--error-color)';
                this.style.transform = 'scale(1) rotate(0deg)';
                this.style.boxShadow = '0 2px 8px rgba(245, 101, 101, 0.3)';
            };
            removeBtn.onclick = function() {
                removeBankOfferSkuRow(rowId);
            };
            
            header.appendChild(removeBtn);
            row.appendChild(header);
            
            // Create SKU fields using full page width with form-row layout
            // Set proper default values
            const skuIdValue = prefilledSkuId ? prefilledSkuId : '';
            const skuNameValue = prefilledSkuName ? prefilledSkuName : '';
            const skuIdBg = prefilledSkuId ? '#f0f9ff' : '#ffffff';
            const skuNameBg = prefilledSkuName ? '#f0f9ff' : '#ffffff';
            
            // Create container for all fields
            const fieldsContainer = document.createElement('div');
            fieldsContainer.style.cssText = 'padding: 0 1.5rem 1rem 1.5rem;';
            
            // First row: SKU ID and SKU Name
            const firstRow = document.createElement('div');
            firstRow.className = 'form-row';
            
            // SKU ID field
            const formGroupSkuId = document.createElement('div');
            formGroupSkuId.className = 'form-group';
            
            const labelSkuId = document.createElement('label');
            labelSkuId.innerHTML = 'SKU ID <span class="required">*</span>';
            
            const inputSkuId = document.createElement('input');
            inputSkuId.type = 'text';
            inputSkuId.className = 'bo-sku-id';
            inputSkuId.placeholder = 'e.g., testProduct11';
            inputSkuId.required = true;
            inputSkuId.value = skuIdValue; // Set value property directly
            inputSkuId.style.background = skuIdBg;
            
            formGroupSkuId.appendChild(labelSkuId);
            formGroupSkuId.appendChild(inputSkuId);
            
            // SKU Name field
            const formGroupSkuName = document.createElement('div');
            formGroupSkuName.className = 'form-group';
            
            const labelSkuName = document.createElement('label');
            labelSkuName.innerHTML = 'SKU Name <span class="required">*</span>';
            
            const inputSkuName = document.createElement('input');
            inputSkuName.type = 'text';
            inputSkuName.className = 'bo-sku-name';
            inputSkuName.placeholder = 'e.g., SkuTest11';
            inputSkuName.required = true;
            inputSkuName.value = skuNameValue; // Set value property directly
            inputSkuName.style.background = skuNameBg;
            
            formGroupSkuName.appendChild(labelSkuName);
            formGroupSkuName.appendChild(inputSkuName);
            
            firstRow.appendChild(formGroupSkuId);
            firstRow.appendChild(formGroupSkuName);
            
            // Second row: Amount and Quantity
            const secondRow = document.createElement('div');
            secondRow.className = 'form-row';
            
            // Amount field
            const formGroupAmount = document.createElement('div');
            formGroupAmount.className = 'form-group';
            
            const labelAmount = document.createElement('label');
            labelAmount.innerHTML = 'Amount per SKU (INR) <span class="required">*</span>';
            
            const inputAmount = document.createElement('input');
            inputAmount.type = 'number';
            inputAmount.className = 'bo-sku-amount';
            inputAmount.placeholder = '20000';
            inputAmount.step = '0.01';
            inputAmount.min = '0';
            inputAmount.required = true;
            
            formGroupAmount.appendChild(labelAmount);
            formGroupAmount.appendChild(inputAmount);
            
            // Quantity field
            const formGroupQuantity = document.createElement('div');
            formGroupQuantity.className = 'form-group';
            
            const labelQuantity = document.createElement('label');
            labelQuantity.innerHTML = 'Quantity <span class="required">*</span>';
            
            const inputQuantity = document.createElement('input');
            inputQuantity.type = 'number';
            inputQuantity.className = 'bo-sku-quantity';
            inputQuantity.placeholder = '1';
            inputQuantity.min = '1';
            inputQuantity.required = true;
            
            formGroupQuantity.appendChild(labelQuantity);
            formGroupQuantity.appendChild(inputQuantity);
            
            secondRow.appendChild(formGroupAmount);
            secondRow.appendChild(formGroupQuantity);
            
            // Third row: Offer Key (full width)
            const thirdRow = document.createElement('div');
            thirdRow.className = 'form-group';
            thirdRow.style.marginBottom = '0';
            
            const labelOfferKey = document.createElement('label');
            labelOfferKey.innerHTML = 'Offer Key <span class="optional">(Optional)</span>';
            
            const inputOfferKey = document.createElement('input');
            inputOfferKey.type = 'text';
            inputOfferKey.className = 'bo-sku-offer-key';
            inputOfferKey.placeholder = 'e.g., flat500@2022 (or comma-separated for multiple)';
            
            const smallNote = document.createElement('small');
            smallNote.style.cssText = 'color: #64748b; display: block; margin-top: 0.5rem; font-size: 0.875rem; line-height: 1.5;';
            smallNote.innerHTML = '<strong>Note:</strong> Leave blank for auto-apply. If specified, offer_auto_apply will be set to false for this SKU.';
            
            thirdRow.appendChild(labelOfferKey);
            thirdRow.appendChild(inputOfferKey);
            thirdRow.appendChild(smallNote);
            
            // Append all rows to fields container
            fieldsContainer.appendChild(firstRow);
            fieldsContainer.appendChild(secondRow);
            fieldsContainer.appendChild(thirdRow);
            
            // Append fields container to main row
            row.appendChild(fieldsContainer);
            
            // Append row to container
            container.appendChild(row);
            
            // Add event listeners to update preview on change
            const inputs = row.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    updateBankOfferSkuPreview();
                });
            });
            
            console.log('✓ SKU row #' + rowId + ' added successfully');
            
            // Verify prefilled values were set correctly
            setTimeout(function() {
                const skuIdInput = row.querySelector('.bo-sku-id');
                const skuNameInput = row.querySelector('.bo-sku-name');
                
                if (skuIdInput && skuNameInput) {
                    const actualSkuId = skuIdInput.value;
                    const actualSkuName = skuNameInput.value;
                    
                    console.log('  SKU ID in DOM: "' + actualSkuId + '" (Expected: "' + skuIdValue + '")');
                    console.log('  SKU Name in DOM: "' + actualSkuName + '" (Expected: "' + skuNameValue + '")');
                    
                    if (prefilledSkuId && actualSkuId !== prefilledSkuId) {
                        console.error('✗ SKU ID prefill FAILED! Expected: "' + prefilledSkuId + '", Got: "' + actualSkuId + '"');
                    } else if (prefilledSkuId) {
                        console.log('✓ SKU ID prefilled correctly');
                    }
                    
                    if (prefilledSkuName && actualSkuName !== prefilledSkuName) {
                        console.error('✗ SKU Name prefill FAILED! Expected: "' + prefilledSkuName + '", Got: "' + actualSkuName + '"');
                    } else if (prefilledSkuName) {
                        console.log('✓ SKU Name prefilled correctly');
                    }
                }
                
                // Add event listeners to all inputs for real-time validation
                // Reuse existing skuIdInput and skuNameInput from above
                const amountInput = row.querySelector('.bo-sku-amount');
                const quantityInput = row.querySelector('.bo-sku-quantity');
                const offerKeyInput = row.querySelector('.bo-sku-offer-key');
                
                [skuIdInput, skuNameInput, amountInput, quantityInput, offerKeyInput].forEach(function(input) {
                    if (input) {
                        input.addEventListener('input', function() {
                            updateBankOfferSkuPreview();
                            updateButtonStates('bankoffer');
                        });
                        input.addEventListener('change', function() {
                            updateBankOfferSkuPreview();
                            updateButtonStates('bankoffer');
                        });
                    }
                });
            }, 10);
            
            // Update preview and limit message
            updateBankOfferSkuPreview();
            updateSkuLimitMessage();
            
            // Update button states after adding row
            updateButtonStates('bankoffer');
        }
        
        // Remove SKU row from custom builder
        function removeBankOfferSkuRow(rowId) {
            const row = document.getElementById('bo_sku_row_' + rowId);
            if (row) {
                row.remove();
                console.log('✓ Removed SKU row #' + rowId);
                updateBankOfferSkuPreview();
                updateSkuLimitMessage();
                
                // Update button states after removing row
                updateButtonStates('bankoffer');
            } else {
                console.error('✗ Could not find row with ID: bo_sku_row_' + rowId);
            }
        }
        
        // Update SKU preview and cart summary
        function updateBankOfferSkuPreview() {
            const skuRows = document.querySelectorAll('#boSkuRowsContainer > div');
            
            if (skuRows.length === 0) {
                document.getElementById('bo-json-preview').textContent = '';
                document.getElementById('bo-total-items').textContent = '0';
                document.getElementById('bo-calculated-amount').textContent = '0';
                return;
            }
            
            const skuDetails = [];
            let totalItems = 0;
            let calculatedAmount = 0;
            
            // Build SKU details - each SKU independently handles offer_key and offer_auto_apply
            skuRows.forEach(row => {
                const skuId = row.querySelector('.bo-sku-id').value.trim();
                const skuName = row.querySelector('.bo-sku-name').value.trim();
                const amountPerSku = parseFloat(row.querySelector('.bo-sku-amount').value) || 0;
                const quantity = parseInt(row.querySelector('.bo-sku-quantity').value) || 1;
                const offerKeyInput = row.querySelector('.bo-sku-offer-key').value.trim();
                
                // Parse offer_key and set offer_auto_apply based on whether offer_key is provided
                let offerKey = null;
                let offerAutoApply = true;
                
                if (offerKeyInput) {
                    // If offer_key has value, parse it as array and set auto_apply to false
                    if (offerKeyInput.includes(',')) {
                        offerKey = offerKeyInput.split(',').map(k => k.trim()).filter(k => k);
                    } else {
                        offerKey = [offerKeyInput];
                    }
                    offerAutoApply = false;
                } else {
                    // If no offer_key provided, set to null with auto_apply true
                    offerKey = null;
                    offerAutoApply = true;
                }
                
                if (skuId && skuName) {
                    const skuItem = {
                        "sku_id": skuId,
                        "sku_name": skuName,
                        "amount_per_sku": amountPerSku,
                        "quantity": quantity,
                        "offer_key": offerKey,
                        "offer_auto_apply": offerAutoApply
                    };
                    
                    skuDetails.push(skuItem);
                    
                    totalItems += quantity;
                    calculatedAmount += (amountPerSku * quantity);
                }
            });
            
            // Get surcharges and pre_discount values from input fields
            const surchargesInput = document.getElementById('bo_surcharges').value.trim();
            const preDiscountInput = document.getElementById('bo_pre_discount').value.trim();
            
            // Parse surcharges - can be empty string or numeric value
            const surcharges = surchargesInput === '' ? '' : surchargesInput;
            
            // Parse pre_discount - default to 0 if empty
            const preDiscount = preDiscountInput === '' ? 0 : parseFloat(preDiscountInput) || 0;
            
            // Build cart details
            const cartDetails = {
                "amount": calculatedAmount,
                "items": totalItems,
                "surcharges": surcharges,
                "pre_discount": preDiscount,
                "sku_details": skuDetails
            };
            
            // Update JSON preview
            document.getElementById('bo-json-preview').textContent = JSON.stringify(cartDetails, null, 2);
            
            // Update cart summary
            document.getElementById('bo-total-items').textContent = totalItems;
            document.getElementById('bo-calculated-amount').textContent = calculatedAmount.toFixed(2);
            
            console.log('✓ SKU preview updated - Items: ' + totalItems + ', Amount: ₹' + calculatedAmount);
        }
        
        // Build cart details JSON from form data
        function buildBankOfferCartDetails() {
            const skuEnabled = document.getElementById('bo_enable_sku').checked;
            
            if (!skuEnabled) {
                console.log('SKU not enabled - no cart_details will be sent');
                return null;
            }
            
            // Get JSON from preview
            const jsonPreview = document.getElementById('bo-json-preview').textContent;
            
            if (!jsonPreview || jsonPreview.trim() === '') {
                console.warn('⚠ SKU enabled but no SKU items added');
                return null;
            }
            
            try {
                const cartDetails = JSON.parse(jsonPreview);
                console.log('✓ Using cart details:', cartDetails);
                return JSON.stringify(cartDetails);
            } catch (e) {
                console.error('✗ Failed to parse cart details:', e);
                return null;
            }
        }
        
        // Copy JSON to clipboard
        function copyBankOfferJson() {
            const jsonText = document.getElementById('bo-json-preview').textContent;
            if (!jsonText) {
                alert('No JSON to copy. Please select a scenario or build custom SKU items.');
                return;
            }
            
            navigator.clipboard.writeText(jsonText).then(function() {
                alert('JSON copied to clipboard!');
                console.log('✓ Cart details JSON copied to clipboard');
            }).catch(function(err) {
                console.error('✗ Failed to copy JSON:', err);
                alert('Failed to copy JSON. Please copy manually.');
            });
        }
        
        // Navigation Functions
        function loadSelectedFlow() {
            const flowSelect = document.getElementById('flowSelect');
            const selectedFlow = flowSelect.value;
            
            if (!selectedFlow) {
                alert('Please select a payment flow');
                return;
            }
            
            // If switching from a different flow, reset the new flow's fields
            if (currentFlow && currentFlow !== selectedFlow) {
                resetFormFields(selectedFlow);
                
                // Reset UDF fields for the new flow
                if (selectedFlow === 'nonseamless') {
                    document.getElementById('ns_udf1').value = '';
                    document.getElementById('ns_udf2').value = '';
                    document.getElementById('ns_udf3').value = '';
                    document.getElementById('ns_udf4').value = '';
                    document.getElementById('ns_udf5').value = '';
                } else if (selectedFlow === 'crossborder') {
                    // Reset to one-time by default
                    currentPaymentType = 'onetime';
                    document.getElementById('cb-onetime-btn').classList.add('active');
                    document.getElementById('cb-subscription-btn').classList.remove('active');
                    document.getElementById('cb-subscription-config').classList.remove('active');
                    document.getElementById('cb-onetime-udf-section').classList.remove('hidden');
                    document.getElementById('cb-subscription-udf-section').classList.add('hidden');
                    
                    // Hide eNACH amount note for one-time payment
                    const enachNote = document.getElementById('cb_enach_amount_note');
                    if (enachNote) enachNote.style.display = 'none';
                    
                    // Reset one-time UDF fields
                    document.getElementById('cb_udf1_input').value = '';
                    document.getElementById('cb_udf2_input').value = '';
                    document.getElementById('cb_udf3_input').value = '';
                    document.getElementById('cb_udf4_input').value = '';
                    document.getElementById('cb_udf5_input').value = '';
                    
                    // Initialize subscription fields with default values (current date and interval=1)
                    const today = new Date().toISOString().split('T')[0];
                    document.getElementById('cb_billing_cycle').value = 'MONTHLY';
                    document.getElementById('cb_billing_interval').value = '1';
                    document.getElementById('cb_payment_start_date').value = today;
                    document.getElementById('cb_payment_end_date').value = '';
                    
                    // Initialize SI and API version (prefilled fields for subscription)
                    document.getElementById('cb_si').value = '1';
                    document.getElementById('cb_api_version').value = '7';
                    
                    console.log('Cross Border flow loaded - subscription fields initialized with defaults');
                    
                    // Reset subscription UDF fields
                    document.getElementById('cb_sub_udf1_input').value = '';
                    document.getElementById('cb_sub_udf2_input').value = '';
                    document.getElementById('cb_sub_udf3_input').value = '';
                    document.getElementById('cb_sub_udf4_input').value = '';
                    document.getElementById('cb_sub_udf5_input').value = '';
                } else if (selectedFlow === 'subscription') {
                    // Reset subscription fields
                    document.getElementById('sub_billing_cycle').value = 'MONTHLY';
                    document.getElementById('sub_billing_interval').value = '1';
                    document.getElementById('sub_payment_start_date').value = new Date().toISOString().split('T')[0];
                    document.getElementById('sub_payment_end_date').value = '';
                    
                    document.getElementById('sub_udf1').value = '';
                    document.getElementById('sub_udf2').value = '';
                    document.getElementById('sub_udf3').value = '';
                    document.getElementById('sub_udf4').value = '';
                    document.getElementById('sub_udf5').value = '';
                } else if (selectedFlow === 'tpv') {
                    // Reset TPV UDF fields
                    document.getElementById('tpv_udf1').value = '';
                    document.getElementById('tpv_udf2').value = '';
                    document.getElementById('tpv_udf3').value = '';
                    document.getElementById('tpv_udf4').value = '';
                    document.getElementById('tpv_udf5').value = '';
                } else if (selectedFlow === 'upiotm') {
                    // Reset UPI OTM date fields and UDFs
                    const today = new Date().toISOString().split('T')[0];
                    const endDate = new Date();
                    endDate.setDate(endDate.getDate() + 7);
                    document.getElementById('upi_payment_start_date').value = today;
                    document.getElementById('upi_payment_end_date').value = endDate.toISOString().split('T')[0];
                    
                    document.getElementById('upi_udf1').value = '';
                    document.getElementById('upi_udf2').value = '';
                    document.getElementById('upi_udf3').value = '';
                    document.getElementById('upi_udf4').value = '';
                    document.getElementById('upi_udf5').value = '';
                } else if (selectedFlow === 'preauth') {
                    // Reset PreAuth UDF fields
                    document.getElementById('preauth_udf1').value = '';
                    document.getElementById('preauth_udf2').value = '';
                    document.getElementById('preauth_udf3').value = '';
                    document.getElementById('preauth_udf4').value = '';
                    document.getElementById('preauth_udf5').value = '';
                } else if (selectedFlow === 'checkoutplus') {
                    // Reset Checkout Plus UDF fields
                    document.getElementById('cp_udf1').value = '';
                    document.getElementById('cp_udf2').value = '';
                    document.getElementById('cp_udf3').value = '';
                    document.getElementById('cp_udf4').value = '';
                    document.getElementById('cp_udf5').value = '';
                } else if (selectedFlow === 'bankoffer') {
                    // Reset Bank Offer UDF fields
                    document.getElementById('bo_udf1').value = '';
                    document.getElementById('bo_udf2').value = '';
                    document.getElementById('bo_udf3').value = '';
                    document.getElementById('bo_udf4').value = '';
                    document.getElementById('bo_udf5').value = '';
                    // Reset offer_key
                    document.getElementById('bo_offer_key').value = '';
                    // Reset SKU configuration
                    document.getElementById('bo_enable_sku').checked = false;
                    document.getElementById('bo-sku-config').style.display = 'none';
                    document.getElementById('bo-custom-sku-builder').style.display = 'none';
                    document.getElementById('boSkuRowsContainer').innerHTML = '';
                    boSkuRowCounter = 0;
                    // Uncheck all scenario radios
                    const scenarioRadios = document.querySelectorAll('input[name="bo_sku_scenario"]');
                    scenarioRadios.forEach(radio => radio.checked = false);
                    // Clear JSON preview
                    document.getElementById('bo-json-preview').textContent = '';
                }
            }
            
            currentFlow = selectedFlow;
            
            // Hide landing section
            document.getElementById('landingSection').style.display = 'none';
            
            // Show selected flow
            document.getElementById(selectedFlow + 'Flow').classList.add('active');
            
            // Transaction ID already generated on page load - keeping it stable
            console.log('✓ Using stable transaction ID for ' + selectedFlow + ' flow');
            
            // Initialize split flow with a default row
            if (selectedFlow === 'split') {
                // Clear any existing rows
                document.getElementById('splitRowsContainer').innerHTML = '';
                splitRowCounter = 0;
                // Add one default split row
                addSplitRow();
                console.log('✓ Split flow initialized with default row');
            }
            
            // Save current flow to localStorage for persistence on refresh
            localStorage.setItem('currentPaymentFlow', selectedFlow);
            if (selectedFlow === 'crossborder') {
                localStorage.setItem('currentPaymentType', currentPaymentType);
            }
            console.log('✓ Flow saved to localStorage:', selectedFlow);
        }
        
        function backToLanding() {
            // Hide all flow sections
            document.querySelectorAll('.flow-content').forEach(function(section) {
                section.classList.remove('active');
            });
            
            // Show landing section
            document.getElementById('landingSection').style.display = 'block';
            
            // Reset flow selector
            document.getElementById('flowSelect').value = '';
            currentFlow = '';
            
            // Hide debug sections
            hideDebugAndCurl('crossborder');
            hideDebugAndCurl('nonseamless');
            hideDebugAndCurl('subscription');
            hideDebugAndCurl('tpv');
            hideDebugAndCurl('upiotm');
            hideDebugAndCurl('preauth');
            hideDebugAndCurl('checkoutplus');
            hideDebugAndCurl('split');
            hideDebugAndCurl('bankoffer');
            
            // Clear localStorage when going back to flow selection
            localStorage.removeItem('currentPaymentFlow');
            localStorage.removeItem('currentPaymentType');
            console.log('✓ localStorage cleared - returned to landing page');
        }
        
        // Transaction ID Generation
        function generateTransactionId(flow) {
            // Element ID prefix (matches HTML element IDs)
            const elementPrefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            
            // Short prefix for transaction ID value (to keep within 25 chars)
            const txnPrefix = flow === 'crossborder' ? 'CB' : (flow === 'subscription' ? 'SUB' : (flow === 'tpv' ? 'TPV' : (flow === 'upiotm' ? 'UPI' : (flow === 'preauth' ? 'PRE' : (flow === 'checkoutplus' ? 'CP' : (flow === 'split' ? 'SPL' : (flow === 'bankoffer' ? 'BO' : 'NS')))))));
            
            // Generate shorter transaction ID (max 25 chars)
            // Format: TXN_<PREFIX>_<TIMESTAMP_SEC>_<RANDOM>
            // Example: TXN_CB_1731849600_9234 = 24 chars (max 25 chars)
            const timestampSec = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
            const randomSuffix = Math.floor(Math.random() * 10000); // 4-digit random
            const txnId = 'TXN_' + txnPrefix + '_' + timestampSec + '_' + randomSuffix;
            
            // Verify length is within limit
            if (txnId.length > 25) {
                console.warn('⚠️ Generated txnId exceeds 25 chars:', txnId, '(', txnId.length, 'chars)');
            }
            
            // Update hidden field (for form submission)
            const txnidField = document.getElementById(elementPrefix + '_txnid');
            if (txnidField) {
                txnidField.value = txnId;
                console.log('🆔 Generated Transaction ID for ' + flow + ':', txnId, '(' + txnId.length + ' chars)');
                console.log('   ├─ Hidden Field: ' + elementPrefix + '_txnid ✓');
            } else {
                console.error('✗ Transaction ID field NOT FOUND:', elementPrefix + '_txnid');
            }
            
            // Update display field (for user visibility)
            const txnidDisplayField = document.getElementById(elementPrefix + '_txnid_display');
            if (txnidDisplayField) {
                txnidDisplayField.value = txnId;
                console.log('   └─ Display Field: ' + elementPrefix + '_txnid_display ✓');
                console.log('   💡 This ID will remain stable until payment or page refresh');
                
                // Update character counter if it exists
                updateCharCounter(txnidDisplayField);
            } else {
                console.error('✗ Transaction ID Display field NOT FOUND:', elementPrefix + '_txnid_display');
            }
            
            return txnId;
        }
        
        // Validation Functions
        function validatePhone(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const phoneInput = document.getElementById(prefix + '_phone');
            const phoneError = document.getElementById(prefix + '-phone-error');
            
            if (!phoneInput) return true;
            
            // Remove non-numeric characters
            const phone = phoneInput.value.replace(/[^0-9]/g, '');
            
            // Limit to maximum 10 digits
            const limitedPhone = phone.substring(0, 10);
            phoneInput.value = limitedPhone;
            
            if (limitedPhone.length === 0) {
                phoneInput.classList.remove('error');
                if (phoneError) phoneError.style.display = 'none';
                return true;
            }
            
            // All flows require exactly 10 digits
            if (limitedPhone.length !== 10) {
                phoneInput.classList.add('error');
                if (phoneError) {
                    if (limitedPhone.length < 10) {
                        phoneError.textContent = 'Phone number must be exactly 10 digits (currently ' + limitedPhone.length + ' digits)';
                    } else {
                        phoneError.textContent = 'Phone number cannot exceed 10 digits';
                    }
                    phoneError.style.display = 'block';
                }
                return false;
            }
            
            phoneInput.classList.remove('error');
            if (phoneError) phoneError.style.display = 'none';
            return true;
        }
        
        function validateEmail(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const emailInput = document.getElementById(prefix + '_email');
            const emailError = document.getElementById(prefix + '-email-error');
            
            if (!emailInput) return true;
            
            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email.length === 0) {
                emailInput.classList.remove('error');
                if (emailError) emailError.style.display = 'none';
                return true;
            }
            
            if (!emailRegex.test(email)) {
                emailInput.classList.add('error');
                if (emailError) {
                    emailError.textContent = 'Please enter a valid email address';
                    emailError.style.display = 'block';
                }
                return false;
            }
            
            emailInput.classList.remove('error');
            if (emailError) emailError.style.display = 'none';
            return true;
        }
        
        // Validate Subscription Start Date (prevent past dates)
        function validateSubscriptionStartDate(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : 'sub';
            const startDateInput = document.getElementById(prefix + '_payment_start_date');
            
            if (!startDateInput || !startDateInput.value) return true;
            
            const selectedDate = new Date(startDateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to compare only dates
            
            if (selectedDate < today) {
                alert('Payment Start Date cannot be in the past. Please select current date or a future date.');
                // Reset to today's date
                const todayStr = new Date().toISOString().split('T')[0];
                startDateInput.value = todayStr;
                startDateInput.min = todayStr;
                return false;
            }
            
            return true;
        }
        
        // Validate UPI OTM Start Date (prevent past dates)
        function validateUpiOtmStartDate() {
            const startDateInput = document.getElementById('upi_payment_start_date');
            
            if (!startDateInput || !startDateInput.value) return true;
            
            const selectedDate = new Date(startDateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to compare only dates
            
            if (selectedDate < today) {
                alert('Payment Start Date cannot be in the past. Please select current date or a future date.');
                // Reset to today's date
                const todayStr = new Date().toISOString().split('T')[0];
                startDateInput.value = todayStr;
                startDateInput.min = todayStr;
                return false;
            }
            
            return true;
        }
        
        // Fill with Sample Data Function - Fill form fields with predefined test data
        function generateTemplate(flow) {
            // Get flow prefix
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            
            // Check if custom keys are enabled - if yes, show alert and return
            const customKeysCheckbox = document.getElementById(prefix + '_use_custom_keys');
            if (customKeysCheckbox && customKeysCheckbox.checked) {
                alert('Fill with Sample Data is only available when using predefined credentials.\nPlease uncheck "Use Your Merchant UAT Key & Salt" to use this feature.');
                return;
            }
            
            // Predefined template values
            const templateData = {
                amount: '15000',
                productinfo: 'DESKTOP',
                firstname: 'Sunit',
                lastname: 'Kumar',
                email: 'sunit.kumar@mail.com',
                phone: '9876543210',
                address1: 'FIRST FLOOR',
                address2: 'NEW ASHOK NAGAR',
                city: 'Delhi',
                state: 'Delhi',
                country: 'INDIA',
                zipcode: '201303',
                udf1: 'Testing UDF 1',
                udf2: 'Testing UDF2',
                udf5: 'Sample_Invoice_11',
                user_token: '1234567890'  // Default user_token for bank offers
            };
            
            // Helper function to set field value and trigger events
            function setFieldValue(fieldId, value) {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = value;
                    // Trigger input event for character counters and validation
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            
            // Fill common fields
            setFieldValue(prefix + '_amount', templateData.amount);
            setFieldValue(prefix + '_productinfo', templateData.productinfo);
            setFieldValue(prefix + '_firstname', templateData.firstname);
            setFieldValue(prefix + '_lastname', templateData.lastname);
            setFieldValue(prefix + '_email', templateData.email);
            setFieldValue(prefix + '_phone', templateData.phone);
            
            // Fill address fields (if they exist)
            setFieldValue(prefix + '_address1', templateData.address1);
            setFieldValue(prefix + '_address2', templateData.address2);
            setFieldValue(prefix + '_city', templateData.city);
            setFieldValue(prefix + '_state', templateData.state);
            setFieldValue(prefix + '_country', templateData.country);
            setFieldValue(prefix + '_zipcode', templateData.zipcode);
            
            // Fill UDF fields based on flow-specific naming
            if (flow === 'crossborder') {
                // Cross Border uses _input suffix for UDFs
                setFieldValue(prefix + '_udf1_input', templateData.udf1);
                setFieldValue(prefix + '_udf2_input', templateData.udf2);
                setFieldValue(prefix + '_udf5_input', templateData.udf5);
            } else {
                // Other flows use direct naming
                setFieldValue(prefix + '_udf1', templateData.udf1);
                setFieldValue(prefix + '_udf2', templateData.udf2);
                setFieldValue(prefix + '_udf5', templateData.udf5);
            }
            
            // Special handling for subscription flow in cross-border
            if (flow === 'crossborder') {
                // Check if subscription UDF fields exist
                setFieldValue('cb_sub_udf1_input', templateData.udf1);
                setFieldValue('cb_sub_udf2_input', templateData.udf2);
                setFieldValue('cb_sub_udf5_input', templateData.udf5);
            }
            
            // Special handling for bankoffer flow - add user_token
            if (flow === 'bankoffer') {
                setFieldValue('bo_user_token', templateData.user_token);
            }
            
            console.log('✓ Template data filled for ' + flow + ' flow');
        }
        
        // Custom Keys Functions
        function toggleCustomKeys(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const isCustom = document.getElementById(prefix + '_use_custom_keys').checked;
            const customFields = document.getElementById(prefix + '-custom-key-fields');
            
            // Get transaction ID fields
            const txnidDisplay = document.getElementById(prefix + '_txnid_display');
            const txnidHidden = document.getElementById(prefix + '_txnid');
            const txnidLabel = document.querySelector('label[for="' + prefix + '_txnid_display"]');
            
            // Get Fill with Sample Data button wrapper
            const templateWrapper = document.getElementById(prefix + '-generate-template-wrapper');
            
            // Get user_credentials field
            const userCredsField = document.getElementById(prefix + '_user_credentials');
            const enableSavedCardCheckbox = document.getElementById(prefix + '_enable_saved_card');
            
            if (isCustom) {
                // Enable custom credentials mode
                customFields.classList.add('active');
                document.getElementById(prefix + '_custom_key').value = '';
                document.getElementById(prefix + '_custom_salt').value = '';
                document.getElementById(prefix + '_custom_salt').type = 'password';
                
                // Clear user_credentials field for custom credentials
                if (userCredsField) {
                    userCredsField.value = '';
                    userCredsField.placeholder = 'YourMerchantKey:UniqueUserIdentifier';
                }
                
                // Hide Fill with Sample Data button (only available for predefined credentials)
                if (templateWrapper) {
                    templateWrapper.style.display = 'none';
                }
                
                // Make Transaction ID editable
                if (txnidDisplay) {
                    txnidDisplay.removeAttribute('readonly');
                    txnidDisplay.style.backgroundColor = '#ffffff';
                    txnidDisplay.style.cursor = 'text';
                    txnidDisplay.value = ''; // Clear for merchant input
                    
                    if (txnidHidden) {
                        txnidHidden.value = ''; // Clear hidden field too
                    }
                    
                    console.log('✓ Transaction ID field enabled for editing');
                }
                
                // Update label to indicate custom txnid
                if (txnidLabel) {
                    txnidLabel.innerHTML = 'Transaction ID <span class="required">*</span> <span style="color: #ed8936;">(Enter Your Custom txnid - Max 25 chars)</span>';
                }
            } else {
                // Disable custom credentials mode
                customFields.classList.remove('active');
                document.getElementById(prefix + '_custom_key').value = '';
                document.getElementById(prefix + '_custom_salt').value = '';
                
                // Set placeholder for user_credentials with predefined key for predefined credentials
                if (userCredsField && enableSavedCardCheckbox && enableSavedCardCheckbox.checked) {
                    userCredsField.value = DEFAULT_KEY + ':';
                    userCredsField.placeholder = DEFAULT_KEY + ':UserIdentifier';
                }
                
                // Show Fill with Sample Data button (available for predefined credentials)
                if (templateWrapper) {
                    templateWrapper.style.display = 'block';
                }
                
                // Make Transaction ID readonly again
                if (txnidDisplay) {
                    txnidDisplay.setAttribute('readonly', true);
                    txnidDisplay.style.backgroundColor = '#f0f0f0';
                    txnidDisplay.style.cursor = 'not-allowed';
                    
                    console.log('✓ Transaction ID field disabled - regenerating auto txnid');
                }
                
                // Update label back to auto-generated
                if (txnidLabel) {
                    txnidLabel.innerHTML = 'Transaction ID <span style="color: #48bb78;">(Auto-Generated from Back-end - Non Editable)</span>';
                }
                
                // Regenerate auto transaction ID
                generateTransactionId(flow);
            }
            
            // Clear cached hash
            const hashField = document.getElementById(prefix + '_hash');
            if (hashField) hashField.value = '';
            
            // For split payment, update existing child merchant keys and transaction IDs when toggle changes
            if (flow === 'split') {
                const splitRows = document.querySelectorAll('.split-row');
                const rowCount = splitRows.length;
                
                splitRows.forEach((row, index) => {
                    const merchantKeyInput = row.querySelector('.split-merchant-key');
                    const txnIdInput = row.querySelector('.split-txn-id');
                    
                    if (merchantKeyInput) {
                        if (isCustom) {
                            // Clear child merchant key when using custom keys
                            merchantKeyInput.value = '';
                        } else {
                            // Prefill with test child merchant key when not using custom keys
                            // First child = 'gYoEaY', second child = '5rgA73', third+ = blank
                            if (index === 0) {
                                merchantKeyInput.value = 'gYoEaY';
                            } else if (index === 1) {
                                merchantKeyInput.value = '5rgA73';
                            } else {
                                merchantKeyInput.value = '';
                            }
                        }
                    }
                    
                    if (txnIdInput) {
                        if (isCustom) {
                            // Clear transaction ID and make it editable when using custom keys
                            txnIdInput.value = '';
                            txnIdInput.removeAttribute('readonly');
                            txnIdInput.style.backgroundColor = '';
                            txnIdInput.style.cursor = '';
                            txnIdInput.placeholder = 'Enter child transaction ID';
                            // Update small text
                            const smallText = txnIdInput.closest('.form-group').querySelector('small');
                            if (smallText) {
                                smallText.textContent = 'Enter your own transaction ID';
                            }
                        } else {
                            // Generate and set transaction ID when not using custom keys
                            const timestamp = Date.now();
                            const randomSuffix = Math.floor(Math.random() * 10000);
                            const newChildTxnId = 'child_' + timestamp + '_' + randomSuffix;
                            txnIdInput.value = newChildTxnId;
                            txnIdInput.setAttribute('readonly', 'readonly');
                            txnIdInput.style.backgroundColor = '#f0f0f0';
                            txnIdInput.style.cursor = 'not-allowed';
                            txnIdInput.placeholder = 'Auto-generated';
                            // Update small text
                            const smallText = txnIdInput.closest('.form-group').querySelector('small');
                            if (smallText) {
                                smallText.textContent = 'Auto-generated unique ID';
                            }
                        }
                    }
                });
                
                console.log('✓ Updated ' + rowCount + ' child merchant key(s) and transaction ID(s) - Custom keys: ' + isCustom);
                
                // If no child rows exist and not using custom keys, add one default row
                if (rowCount === 0 && !isCustom) {
                    addSplitRow();
                    console.log('✓ Added default child row after unchecking custom keys');
                }
            }
            
            // For bank offers, update SKU items when toggle changes
            if (flow === 'bankoffer') {
                const skuEnabled = document.getElementById('bo_enable_sku').checked;
                
                if (skuEnabled) {
                    // Clear existing SKU rows
                    document.getElementById('boSkuRowsContainer').innerHTML = '';
                    boSkuRowCounter = 0;
                    
                    if (!isCustom) {
                        // Predefined credentials - add 2 SKUs with prefilled IDs/names
                        addBankOfferSkuRow('testProduct11', 'SkuTest11');
                        addBankOfferSkuRow('testProduct12', 'SkuTest12');
                        console.log('✓ Switched to predefined credentials - 2 prefilled SKUs added');
                    } else {
                        // Custom credentials - clear all SKUs
                        console.log('✓ Switched to custom credentials - SKUs cleared');
                    }
                    
                    updateSkuLimitMessage();
                }
            }
            
            // Update button states after toggling custom keys
            updateButtonStates(flow);
        }
        
        // Toggle Saved Card Feature Field
        function toggleSavedCardField(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const enableSavedCardCheckbox = document.getElementById(prefix + '_enable_saved_card');
            const savedCardField = document.getElementById(prefix + '-saved-card-field');
            const userCredsInput = document.getElementById(prefix + '_user_credentials');
            const useCustomKeys = document.getElementById(prefix + '_use_custom_keys');
            
            if (!enableSavedCardCheckbox || !savedCardField || !userCredsInput) {
                return;
            }
            
            if (enableSavedCardCheckbox.checked) {
                // Show the field
                savedCardField.classList.add('active');
                
                // Check if using predefined or custom credentials
                if (useCustomKeys && !useCustomKeys.checked) {
                    // Predefined credentials: pre-fill with DEFAULT_KEY and show UserIdentifier as placeholder
                    userCredsInput.value = DEFAULT_KEY + ':';
                    userCredsInput.placeholder = DEFAULT_KEY + ':UserIdentifier';
                } else {
                    // Custom credentials: keep blank
                    userCredsInput.value = '';
                    userCredsInput.placeholder = 'YourMerchantKey:UniqueUserIdentifier';
                }
                
                console.log('✓ Saved Card Feature enabled for ' + flow);
            } else {
                // Hide the field and clear value
                savedCardField.classList.remove('active');
                userCredsInput.value = '';
                console.log('✓ Saved Card Feature disabled for ' + flow);
            }
        }
        
        function toggleSaltVisibility(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const saltInput = document.getElementById(prefix + '_custom_salt');
            const toggleButton = event.target;
            
            if (saltInput.type === 'password') {
                saltInput.type = 'text';
                toggleButton.textContent = 'Hide';
            } else {
                saltInput.type = 'password';
                toggleButton.textContent = 'Show';
            }
        }
        
        function getCredentials(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const useCustom = document.getElementById(prefix + '_use_custom_keys').checked;
            
            if (useCustom) {
                const customKey = document.getElementById(prefix + '_custom_key').value;
                const customSalt = document.getElementById(prefix + '_custom_salt').value;
                
                if (!customKey || !customSalt) {
                    console.warn('Custom credentials not fully provided, using defaults');
                    return { key: DEFAULT_KEY, salt: DEFAULT_SALT };
                }
                
                return { key: customKey, salt: customSalt };
            }
            
            return { key: DEFAULT_KEY, salt: DEFAULT_SALT };
        }
        
        // Cross Border Payment Type Selection
        function selectPaymentType(type, flow) {
            if (flow !== 'crossborder') return;
            
            // Don't reset if already on the same type
            if (currentPaymentType === type) {
                console.log('Already on ' + type + ' payment type, no reset needed');
                return;
            }
            
            console.log('Switching from ' + currentPaymentType + ' to ' + type);
            currentPaymentType = type;
            
            // Update button states
            document.querySelectorAll('#crossborderFlow .payment-type-btn').forEach(function(btn) {
                btn.classList.remove('active');
            });
            document.getElementById('cb-' + type + '-btn').classList.add('active');
            
            // Show/hide sections
            const subscriptionConfig = document.getElementById('cb-subscription-config');
            const onetimeUdfSection = document.getElementById('cb-onetime-udf-section');
            const subscriptionUdfSection = document.getElementById('cb-subscription-udf-section');
            
            if (type === 'subscription') {
                subscriptionConfig.classList.add('active');
                onetimeUdfSection.classList.add('hidden');
                subscriptionUdfSection.classList.remove('hidden');
                
                // Show eNACH amount note for subscription
                const enachNote = document.getElementById('cb_enach_amount_note');
                if (enachNote) enachNote.style.display = 'block';
                
                // SI and API Version are already set in HTML with readonly values - no need to set again
                // They have value="1" and value="7" hardcoded
                
                // Set default values for subscription fields (editable) - ALWAYS set these values
                const today = new Date().toISOString().split('T')[0];
                
                // Force set the values - these must be current date and 1
                document.getElementById('cb_billing_amount').value = '';  // Clear billing amount - merchant must fill
                document.getElementById('cb_billing_cycle').value = 'MONTHLY';
                document.getElementById('cb_billing_interval').value = '1';
                document.getElementById('cb_payment_start_date').value = today;
                document.getElementById('cb_payment_end_date').value = '';
                
                console.log('✓ Cross Border Subscription fields set:');
                console.log('  - SI: 1 (readonly, pre-filled in HTML)');
                console.log('  - API Version: 7 (readonly, pre-filled in HTML)');
                console.log('  - Billing Amount: (empty - merchant must fill)');
                console.log('  - Payment Start Date:', today);
                console.log('  - Billing Interval: 1');
                console.log('  - Billing Cycle: MONTHLY');
                
                // Reset subscription UDF fields only
                document.getElementById('cb_sub_udf1_input').value = '';
                document.getElementById('cb_sub_udf2_input').value = '';
                document.getElementById('cb_sub_udf3_input').value = '';
                document.getElementById('cb_sub_udf4_input').value = '';
                document.getElementById('cb_sub_udf5_input').value = '';
            } else {
                subscriptionConfig.classList.remove('active');
                onetimeUdfSection.classList.remove('hidden');
                subscriptionUdfSection.classList.add('hidden');
                
                // Hide eNACH amount note for one-time payment
                const enachNote = document.getElementById('cb_enach_amount_note');
                if (enachNote) enachNote.style.display = 'none';
                
                // Keep SI and API version values - they're readonly and prefilled in HTML
                // Only clear the si_details as it's user-configurable
                document.getElementById('cb_si_details').value = '';
                
                // Reset one-time UDF fields only
                document.getElementById('cb_udf1_input').value = '';
                document.getElementById('cb_udf2_input').value = '';
                document.getElementById('cb_udf3_input').value = '';
                document.getElementById('cb_udf4_input').value = '';
                document.getElementById('cb_udf5_input').value = '';
            }
            
            // Clear hash when switching payment types
            const hashField = document.getElementById('cb_hash');
            if (hashField) hashField.value = '';
            
            // Hide debug output when switching
            hideDebugAndCurl('crossborder');
            
            // Save payment type to localStorage for persistence
            localStorage.setItem('currentPaymentType', type);
            console.log('✓ Payment type saved to localStorage:', type);
            
            // Update button states after switching payment type
            updateButtonStates('crossborder');
        }
        
        // Toggle UDF Params (UDF7 & UDF8) for Cross Border
        function toggleUdfParams(flow, paymentType) {
            if (flow !== 'crossborder') return;
            
            let checkboxId, fieldsId;
            
            if (paymentType === 'onetime') {
                checkboxId = 'cb_enable_udf_params';
                fieldsId = 'cb-udf-params-fields';
            } else if (paymentType === 'subscription') {
                checkboxId = 'cb_sub_enable_udf_params';
                fieldsId = 'cb-sub-udf-params-fields';
            } else {
                return;
            }
            
            const checkbox = document.getElementById(checkboxId);
            const fieldsContainer = document.getElementById(fieldsId);
            
            if (!checkbox || !fieldsContainer) return;
            
            if (checkbox.checked) {
                fieldsContainer.style.display = 'block';
                console.log('✓ UDF Params enabled for ' + paymentType);
            } else {
                fieldsContainer.style.display = 'none';
                console.log('✓ UDF Params disabled for ' + paymentType);
                
                // Clear UDF7 and UDF8 fields when disabled
                if (paymentType === 'onetime') {
                    document.getElementById('cb_udf7_input').value = '';
                    document.getElementById('cb_udf8_input').value = '';
                } else if (paymentType === 'subscription') {
                    document.getElementById('cb_sub_udf7_input').value = '';
                    document.getElementById('cb_sub_udf8_input').value = '';
                }
            }
        }
        
        // TPV Payment Type Selection
        // Reset Form Fields - Refresh page for new transaction ID
        function resetFormFields(flow) {
            console.log('🔄 Generate New Payment requested for flow:', flow);
            
            // Ask for confirmation before refreshing
            const confirmed = confirm(
                '🔄 Generate New Payment\n\n' +
                'This will refresh the page and generate a new Transaction ID.\n\n' +
                'Current data will be cleared. Do you want to continue?'
            );
            
            if (confirmed) {
                console.log('✓ User confirmed - Refreshing page for new transaction ID');
                // Refresh the page to get fresh transaction IDs
                window.location.reload();
            } else {
                console.log('✗ User cancelled - Keeping current data');
            }
        }
        
        // Hide Debug and CURL
        function hideDebugAndCurl(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            document.getElementById(prefix + '-debugSection').style.display = 'none';
            document.getElementById(prefix + '-curlSection').style.display = 'none';
        }
        
        // Validate Form
        function validateForm(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            
            // Validate Custom Transaction ID (if using custom credentials)
            const useCustomKeys = document.getElementById(prefix + '_use_custom_keys');
            if (useCustomKeys && useCustomKeys.checked) {
                const txnidDisplay = document.getElementById(prefix + '_txnid_display');
                const txnidHidden = document.getElementById(prefix + '_txnid');
                
                console.log('=== Custom Credentials Mode - Validating Transaction ID ===');
                
                // CRITICAL FIX: Sync display → hidden field BEFORE validation
                // This ensures the hidden field always has the latest value
                if (txnidDisplay && txnidHidden) {
                    txnidHidden.value = txnidDisplay.value.trim();
                    console.log('  Synced display → hidden:', txnidDisplay.value.trim());
                }
                
                // Get the value from the display field (where user enters it)
                const txnid = txnidDisplay ? txnidDisplay.value.trim() : '';
                
                console.log('  Display field value:', txnid);
                console.log('  Display field empty?', !txnid);
                
                // Check if transaction ID is provided
                if (!txnid || txnid === '') {
                    alert('Transaction ID is required when using custom credentials.\nPlease enter a custom Transaction ID (max 25 characters).');
                    if (txnidDisplay) txnidDisplay.focus();
                    return false;
                }
                
                // Validate format (alphanumeric, underscore, hyphen only)
                const validPattern = /^[A-Za-z0-9_-]+$/;
                if (!validPattern.test(txnid)) {
                    alert('Invalid Transaction ID format.\n\nTransaction ID can only contain:\n- Letters (A-Z, a-z)\n- Numbers (0-9)\n- Underscores (_)\n- Hyphens (-)\n\nPlease remove any special characters.');
                    if (txnidDisplay) txnidDisplay.focus();
                    return false;
                }
                
                // Validate length (max 25 characters)
                if (txnid.length > 25) {
                    alert('Transaction ID exceeds maximum length.\n\nMaximum: 25 characters\nCurrent: ' + txnid.length + ' characters\n\nPlease shorten your Transaction ID.');
                    if (txnidDisplay) txnidDisplay.focus();
                    return false;
                }
                
                console.log('✓ Custom Transaction ID validated:', txnid, '(' + txnid.length + ' chars)');
            } else {
                // Using predefined credentials - auto-generated txnid should already be set
                const txnid = document.getElementById(prefix + '_txnid').value;
                if (!txnid) {
                    alert('Transaction ID is missing. Please refresh the page.');
                    return false;
                }
                console.log('✓ Auto-generated Transaction ID:', txnid);
            }
            
            // Common required fields
            let requiredFields = ['amount', 'productinfo', 'firstname', 'email', 'phone'];
            
            // Flow-specific required fields
            if (flow === 'split') {
                // Split payment specific validation
                if (!validateSplitAmounts()) {
                    return false;
                }
                console.log('Split Payment - Split amounts validated');
            } else if (flow === 'crossborder') {
                requiredFields.push('address1', 'city', 'state', 'country', 'zipcode', 'lastname');
                
                if (currentPaymentType === 'onetime') {
                    requiredFields.push('udf5_input');
                } else {
                    // Cross border subscription
                    requiredFields.push('billing_amount', 'payment_start_date', 'payment_end_date', 'billing_cycle', 'billing_interval');
                    
                    console.log('=== Cross Border Subscription Validation ===');
                    
                    // Validate billing amount (must be positive number)
                    const billingAmountField = document.getElementById('cb_billing_amount');
                    if (!billingAmountField || !billingAmountField.value || parseFloat(billingAmountField.value) <= 0) {
                        alert('Please enter a valid billing amount (must be greater than 0)');
                        if (billingAmountField) billingAmountField.focus();
                        return false;
                    }
                    
                    // Validate payment start date (no past dates)
                    if (!validateSubscriptionStartDate('crossborder')) {
                        return false;
                    }
                    
                    // Check enforced payment methods for cross border subscription
                    const paymethodCheckboxes = document.querySelectorAll('input[name="cb_paymethod"]:checked');
                    const selectedPaymethods = [];
                    paymethodCheckboxes.forEach(checkbox => {
                        selectedPaymethods.push(checkbox.id);
                    });
                    
                    console.log('Selected payment methods:', selectedPaymethods);
                    
                    // Dynamic UDF validation based on payment method for Cross Border Subscription
                    if (selectedPaymethods.length > 0) {
                        // Payment methods are enforced
                        if (selectedPaymethods.includes('cb_upi')) {
                            // UPI is selected - UDF3 is mandatory (field ID: cb_sub_udf3_input)
                            const udf3Field = document.getElementById('cb_sub_udf3_input');
                            if (!udf3Field || !udf3Field.value.trim()) {
                                alert('UDF3 is required when UPI payment method is enforced for Cross Border Subscription');
                                if (udf3Field) udf3Field.focus();
                                return false;
                            }
                            console.log('✓ UPI enforced - UDF3 validated');
                        } else {
                            // Other payment methods (not UPI) - UDF5 is mandatory (field ID: cb_sub_udf5_input)
                            const udf5Field = document.getElementById('cb_sub_udf5_input');
                            if (!udf5Field || !udf5Field.value.trim()) {
                                alert('UDF5 is required when Cards/NetBanking payment method is enforced for Cross Border Subscription');
                                if (udf5Field) udf5Field.focus();
                                return false;
                            }
                            console.log('✓ Non-UPI payment method enforced - UDF5 validated');
                        }
                    } else {
                        // No payment method enforced - All UDF fields are optional
                        console.log('✓ No payment method enforced - All UDF fields are OPTIONAL');
                    }
                }
            } else if (flow === 'subscription') {
                // Non-Seamless Subscription - only subscription fields are mandatory
                requiredFields.push('billing_amount', 'payment_start_date', 'payment_end_date', 'billing_cycle', 'billing_interval');
                
                // Validate billing amount (must be positive number)
                const billingAmountField = document.getElementById('sub_billing_amount');
                if (!billingAmountField || !billingAmountField.value || parseFloat(billingAmountField.value) <= 0) {
                    alert('Please enter a valid billing amount (must be greater than 0)');
                    if (billingAmountField) billingAmountField.focus();
                    return false;
                }
                
                // Validate payment start date (no past dates)
                if (!validateSubscriptionStartDate('subscription')) {
                    return false;
                }
                
                // Note: For Non-Seamless Subscription, UDF fields are all optional
                // No dynamic UDF validation for this flow
                console.log('Non-Seamless Subscription - All UDF fields are optional');
            } else if (flow === 'tpv') {
                // TPV One Time specific validation
                requiredFields.push('beneficiary_account', 'ifsc_code');
                console.log('TPV One Time - Beneficiary account and IFSC code are mandatory');
            } else if (flow === 'upiotm') {
                // UPI OTM specific validation
                requiredFields.push('payment_start_date', 'payment_end_date');
                
                // Validate payment start date (no past dates)
                if (!validateUpiOtmStartDate()) {
                    return false;
                }
                
                // Validate date range (14-day limit)
                if (!validateUpiOtmDates()) {
                    return false;
                }
                
                console.log('UPI OTM - Payment dates validated');
            } else if (flow === 'preauth') {
                // PreAuth specific validation - enforce payment method is required
                const paymethodCheckboxes = document.querySelectorAll('input[name="preauth_paymethod"]:checked');
                if (paymethodCheckboxes.length === 0) {
                    alert('Please select at least one payment method (Credit Card is required for PreAuth flow)');
                    return false;
                }
                console.log('PreAuth - Payment method validated');
            }
            
            // Check custom keys if enabled
            if (document.getElementById(prefix + '_use_custom_keys').checked) {
                const customKey = document.getElementById(prefix + '_custom_key').value;
                const customSalt = document.getElementById(prefix + '_custom_salt').value;
                if (!customKey || !customSalt) {
                    alert('Please provide both custom merchant key and salt');
                    return false;
                }
            }
            
            // Validate required fields
            for (let i = 0; i < requiredFields.length; i++) {
                const fieldName = requiredFields[i];
                const fieldId = prefix + '_' + fieldName;
                const field = document.getElementById(fieldId);
                
                if (!field || !field.value.trim()) {
                    let fieldLabel = fieldName.replace(/_/g, ' ').toUpperCase();
                    if (fieldName === 'udf3') {
                        fieldLabel = 'UDF3 (Required when UPI payment method is enforced)';
                    } else if (fieldName === 'udf5') {
                        fieldLabel = 'UDF5 (Required when payment method is enforced)';
                    } else if (fieldName === 'sub_udf3_input') {
                        if (flow === 'crossborder') {
                            fieldLabel = 'UDF3 (Required when UPI payment method is enforced for Cross Border Subscription)';
                        } else {
                            fieldLabel = 'UDF3 (Invoice ID & Merchant Name - Required for Subscription)';
                        }
                    } else if (fieldName === 'sub_udf5_input') {
                        fieldLabel = 'UDF5 (Required when non-UPI payment method is enforced for Cross Border Subscription)';
                    }
                    alert('Please fill the required field: ' + fieldLabel);
                    if (field) field.focus();
                    return false;
                }
            }
            
            // Validate email and phone
            if (!validateEmail(flow) || !validatePhone(flow)) {
                return false;
            }
            
            return true;
        }
        
        // Real-time Form Validation - Check if all mandatory fields are filled
        function checkFormFieldsValidity(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            
            // Common required fields for all flows
            let requiredFields = ['amount', 'productinfo', 'firstname', 'email', 'phone'];
            
            // Flow-specific required fields
            if (flow === 'crossborder') {
                requiredFields.push('address1', 'city', 'state', 'country', 'zipcode', 'lastname');
                
                if (currentPaymentType === 'subscription') {
                    // Cross border subscription
                    requiredFields.push('billing_amount', 'payment_start_date', 'payment_end_date', 'billing_cycle', 'billing_interval');
                } else {
                    // Cross border one-time - UDF5 is mandatory
                    requiredFields.push('udf5_input');
                }
            } else if (flow === 'subscription') {
                // Non-Seamless Subscription - subscription fields are mandatory
                requiredFields.push('billing_amount', 'payment_start_date', 'payment_end_date', 'billing_cycle', 'billing_interval');
            } else if (flow === 'tpv') {
                // TPV One Time specific
                requiredFields.push('beneficiary_account', 'ifsc_code');
            } else if (flow === 'upiotm') {
                // UPI OTM specific
                requiredFields.push('payment_start_date', 'payment_end_date');
            } else if (flow === 'split') {
                // Split payment - validate split rows
                const splitRows = document.querySelectorAll('.split-row');
                
                // Must have at least one split row
                if (splitRows.length === 0) {
                    return false;
                }
                
                // Validate each split row has all mandatory fields
                for (let i = 0; i < splitRows.length; i++) {
                    const row = splitRows[i];
                    
                    // Get all input fields in this row
                    const merchantKeyInput = row.querySelector('.split-merchant-key');
                    const amountInput = row.querySelector('.split-amount');
                    const txnIdInput = row.querySelector('.split-txn-id');
                    
                    // Check if all mandatory fields are filled
                    // Merchant Key is mandatory
                    if (!merchantKeyInput || !merchantKeyInput.value.trim()) {
                        return false;
                    }
                    
                    // Amount is mandatory and must be > 0
                    if (!amountInput || !amountInput.value.trim() || parseFloat(amountInput.value) <= 0) {
                        return false;
                    }
                    
                    // Transaction ID is mandatory
                    if (!txnIdInput || !txnIdInput.value.trim()) {
                        return false;
                    }
                }
            } else if (flow === 'bankoffer') {
                // Bank offer - validate SKU rows if SKU toggle is enabled
                const skuCheckbox = document.getElementById('bo_enable_sku');
                
                if (skuCheckbox && skuCheckbox.checked) {
                    // SKU-based offers are enabled - validate SKU rows
                    const skuRows = document.querySelectorAll('#boSkuRowsContainer > div');
                    
                    // Must have at least one SKU row
                    if (skuRows.length === 0) {
                        return false;
                    }
                    
                    // Validate each SKU row has all mandatory fields
                    for (let i = 0; i < skuRows.length; i++) {
                        const row = skuRows[i];
                        
                        // Get all input fields in this row
                        const skuIdInput = row.querySelector('.bo-sku-id');
                        const skuNameInput = row.querySelector('.bo-sku-name');
                        const amountInput = row.querySelector('.bo-sku-amount');
                        const quantityInput = row.querySelector('.bo-sku-quantity');
                        
                        // SKU ID is mandatory
                        if (!skuIdInput || !skuIdInput.value.trim()) {
                            return false;
                        }
                        
                        // SKU Name is mandatory
                        if (!skuNameInput || !skuNameInput.value.trim()) {
                            return false;
                        }
                        
                        // Amount is mandatory and must be > 0
                        if (!amountInput || !amountInput.value.trim() || parseFloat(amountInput.value) <= 0) {
                            return false;
                        }
                        
                        // Quantity is mandatory and must be > 0
                        if (!quantityInput || !quantityInput.value.trim() || parseInt(quantityInput.value) <= 0) {
                            return false;
                        }
                    }
                }
            }
            
            // Check custom keys if enabled
            const useCustomKeys = document.getElementById(prefix + '_use_custom_keys');
            if (useCustomKeys && useCustomKeys.checked) {
                requiredFields.push('custom_key', 'custom_salt');
                
                // Also check custom transaction ID
                const txnidDisplay = document.getElementById(prefix + '_txnid_display');
                if (!txnidDisplay || !txnidDisplay.value.trim()) {
                    return false;
                }
            }
            
            // Validate all required fields
            for (let i = 0; i < requiredFields.length; i++) {
                const fieldName = requiredFields[i];
                const fieldId = prefix + '_' + fieldName;
                const field = document.getElementById(fieldId);
                
                if (!field || !field.value.trim()) {
                    return false;
                }
            }
            
            return true;
        }
        
        // Update Button States - Enable/Disable action buttons
        function updateButtonStates(flow) {
            const isValid = checkFormFieldsValidity(flow);
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            
            // Get all buttons in the button-group for this flow
            const flowElement = document.getElementById(flow + 'Flow');
            if (!flowElement) return;
            
            const buttonGroup = flowElement.querySelector('.button-group');
            if (!buttonGroup) return;
            
            // Get all action buttons (exclude document and test-card buttons)
            const actionButtons = buttonGroup.querySelectorAll('.button:not(.doc-button):not(.test-card-button), .debug-button, .code-gen-button');
            
            actionButtons.forEach(button => {
                if (isValid) {
                    button.disabled = false;
                    button.style.opacity = '1';
                    button.style.cursor = 'pointer';
                } else {
                    button.disabled = true;
                    button.style.opacity = '0.5';
                    button.style.cursor = 'not-allowed';
                }
            });
        }
        
        // Setup Form Validation - Add event listeners to form inputs
        function setupFormValidation(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            
            // Get all input, select, and textarea elements in this flow
            const flowElement = document.getElementById(flow + 'Flow');
            if (!flowElement) return;
            
            const formElements = flowElement.querySelectorAll('input[id^="' + prefix + '_"], select[id^="' + prefix + '_"], textarea[id^="' + prefix + '_"]');
            
            formElements.forEach(element => {
                // Add event listeners for input and change events
                element.addEventListener('input', function() {
                    updateButtonStates(flow);
                });
                
                element.addEventListener('change', function() {
                    updateButtonStates(flow);
                });
            });
            
            // Also listen to custom keys checkbox
            const customKeysCheckbox = document.getElementById(prefix + '_use_custom_keys');
            if (customKeysCheckbox) {
                customKeysCheckbox.addEventListener('change', function() {
                    updateButtonStates(flow);
                });
            }
            
            // For bank offer flow, listen to SKU enable checkbox
            if (flow === 'bankoffer') {
                const skuCheckbox = document.getElementById('bo_enable_sku');
                if (skuCheckbox) {
                    skuCheckbox.addEventListener('change', function() {
                        updateButtonStates(flow);
                    });
                }
            }
            
            // Initial button state check
            updateButtonStates(flow);
        }
        
        // Generate Hash
        function generateHash(flow) {
            // Set correct prefix based on flow
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const credentials = getCredentials(flow);
            
            const txnid = document.getElementById(prefix + '_txnid').value;
            const amount = document.getElementById(prefix + '_amount').value;
            const productinfo = document.getElementById(prefix + '_productinfo').value;
            const firstname = document.getElementById(prefix + '_firstname').value;
            const email = document.getElementById(prefix + '_email').value;
            
            let udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '';
            let hashString = '';
            let hashFormula = '';
            let siDetailsJson = '';
            
            if (flow === 'crossborder' && currentPaymentType === 'subscription') {
                // Cross Border Subscription hash
                udf1 = document.getElementById('cb_sub_udf1_input').value || '';
                udf2 = document.getElementById('cb_sub_udf2_input').value || '';
                udf3 = document.getElementById('cb_sub_udf3_input').value || '';
                udf4 = document.getElementById('cb_sub_udf4_input').value || '';
                udf5 = document.getElementById('cb_sub_udf5_input').value || '';
                
                const billingAmount = document.getElementById('cb_billing_amount').value;
                const billingCycle = document.getElementById('cb_billing_cycle').value;
                const billingInterval = document.getElementById('cb_billing_interval').value;
                const paymentStartDate = document.getElementById('cb_payment_start_date').value;
                const paymentEndDate = document.getElementById('cb_payment_end_date').value;
                
                const siDetails = {
                    "billingAmount": billingAmount,
                    "billingCurrency": "INR",
                    "billingCycle": billingCycle,
                    "billingInterval": parseInt(billingInterval),
                    "paymentStartDate": paymentStartDate
                };
                
                if (paymentEndDate) {
                    siDetails.paymentEndDate = paymentEndDate;
                }
                
                siDetailsJson = JSON.stringify(siDetails);
                document.getElementById('cb_si_details').value = siDetailsJson;
                
                // Check if UDF params (UDF7 & UDF8) are enabled for subscription
                const enableUdfParams = document.getElementById('cb_sub_enable_udf_params').checked;
                let udfParamsJson = '';
                
                if (enableUdfParams) {
                    const udf7 = document.getElementById('cb_sub_udf7_input').value || '';
                    const udf8 = document.getElementById('cb_sub_udf8_input').value || '';
                    
                    if (udf7 || udf8) {
                        const udfParamsObj = {};
                        if (udf7) udfParamsObj.udf7 = udf7;
                        if (udf8) udfParamsObj.udf8 = udf8;
                        udfParamsJson = JSON.stringify(udfParamsObj);
                    }
                }
                
                // Check if buyer_type_business has a value (0 or 1)
                const buyerTypeBusiness = document.getElementById('cb_buyer_type').value;
                
                // Build hash based on what parameters are present
                if (udfParamsJson && buyerTypeBusiness !== '') {
                    // Hash with both udf_params and buyer_type_business
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + siDetailsJson + '|' + credentials.salt + '|' + udfParamsJson + '|' + buyerTypeBusiness;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||si_details|SALT|udf_params|buyer_type_business)';
                } else if (udfParamsJson) {
                    // Hash with only udf_params
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + siDetailsJson + '|' + credentials.salt + '|' + udfParamsJson;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||si_details|SALT|udf_params)';
                } else if (buyerTypeBusiness !== '') {
                    // Hash with only buyer_type_business (backward compatible)
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + siDetailsJson + '|' + credentials.salt + '|' + buyerTypeBusiness;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||si_details|SALT|buyer_type_business)';
                } else {
                    // Hash without udf_params and buyer_type_business (backward compatible)
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + siDetailsJson + '|' + credentials.salt;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||si_details|SALT)';
                }
            } else if (flow === 'subscription') {
                // Non-Seamless Subscription hash
                udf1 = document.getElementById('sub_udf1').value || '';
                udf2 = document.getElementById('sub_udf2').value || '';
                udf3 = document.getElementById('sub_udf3').value || '';
                udf4 = document.getElementById('sub_udf4').value || '';
                udf5 = document.getElementById('sub_udf5').value || '';
                
                const billingAmount = document.getElementById('sub_billing_amount').value;
                const billingCycle = document.getElementById('sub_billing_cycle').value;
                const billingInterval = document.getElementById('sub_billing_interval').value;
                const paymentStartDate = document.getElementById('sub_payment_start_date').value;
                const paymentEndDate = document.getElementById('sub_payment_end_date').value;
                
                const siDetails = {
                    "billingAmount": billingAmount,
                    "billingCurrency": "INR",
                    "billingCycle": billingCycle,
                    "billingInterval": parseInt(billingInterval),
                    "paymentStartDate": paymentStartDate
                };
                
                if (paymentEndDate) {
                    siDetails.paymentEndDate = paymentEndDate;
                }
                
                siDetailsJson = JSON.stringify(siDetails);
                document.getElementById('sub_si_details').value = siDetailsJson;
                hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + siDetailsJson + '|' + credentials.salt;
                hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||si_details|SALT)';
            } else if (flow === 'crossborder') {
                // Cross border one-time
                udf1 = document.getElementById('cb_udf1_input').value || '';
                udf2 = document.getElementById('cb_udf2_input').value || '';
                udf3 = document.getElementById('cb_udf3_input').value || '';
                udf4 = document.getElementById('cb_udf4_input').value || '';
                udf5 = document.getElementById('cb_udf5_input').value || '';
                
                // Check if UDF params (UDF7 & UDF8) are enabled
                const enableUdfParams = document.getElementById('cb_enable_udf_params').checked;
                let udfParamsJson = '';
                
                if (enableUdfParams) {
                    const udf7 = document.getElementById('cb_udf7_input').value || '';
                    const udf8 = document.getElementById('cb_udf8_input').value || '';
                    
                    if (udf7 || udf8) {
                        const udfParamsObj = {};
                        if (udf7) udfParamsObj.udf7 = udf7;
                        if (udf8) udfParamsObj.udf8 = udf8;
                        udfParamsJson = JSON.stringify(udfParamsObj);
                    }
                }
                
                // Check if buyer_type_business has a value (0 or 1)
                const buyerTypeBusiness = document.getElementById('cb_buyer_type').value;
                
                // Build hash based on what parameters are present
                if (udfParamsJson && buyerTypeBusiness !== '') {
                    // Hash with both udf_params and buyer_type_business
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt + '|' + udfParamsJson + '|' + buyerTypeBusiness;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT|udf_params|buyer_type_business)';
                } else if (udfParamsJson) {
                    // Hash with only udf_params
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt + '|' + udfParamsJson;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT|udf_params)';
                } else if (buyerTypeBusiness !== '') {
                    // Hash with only buyer_type_business (backward compatible)
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt + '|' + buyerTypeBusiness;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT|buyer_type_business)';
                } else {
                    // Hash without udf_params and buyer_type_business (backward compatible)
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)';
                }
                
                // Store udf_params for later use in form submission
                siDetailsJson = udfParamsJson; // Reuse siDetailsJson variable to store udf_params
            } else if (flow === 'tpv') {
                // TPV One Time
                udf1 = document.getElementById('tpv_udf1').value || '';
                udf2 = document.getElementById('tpv_udf2').value || '';
                udf3 = document.getElementById('tpv_udf3').value || '';
                udf4 = document.getElementById('tpv_udf4').value || '';
                udf5 = document.getElementById('tpv_udf5').value || '';
                
                // Construct beneficiarydetail JSON
                const beneficiaryAccount = document.getElementById('tpv_beneficiary_account').value || '';
                const ifscCode = document.getElementById('tpv_ifsc_code').value || '';
                
                const beneficiaryDetail = {
                    "beneficiaryAccountNumber": beneficiaryAccount,
                    "ifscCode": ifscCode
                };
                
                const beneficiaryDetailJson = JSON.stringify(beneficiaryDetail);
                document.getElementById('tpv_beneficiarydetail').value = beneficiaryDetailJson;
                
                hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + beneficiaryDetailJson + '|' + credentials.salt;
                hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||beneficiarydetail|SALT)';
            } else if (flow === 'upiotm') {
                // UPI OTM (One Time Mandate)
                udf1 = document.getElementById('upi_udf1').value || '';
                udf2 = document.getElementById('upi_udf2').value || '';
                udf3 = document.getElementById('upi_udf3').value || '';
                udf4 = document.getElementById('upi_udf4').value || '';
                udf5 = document.getElementById('upi_udf5').value || '';
                
                // Construct siDetails JSON (only dates, no billing cycle/interval for UPI OTM)
                const paymentStartDate = document.getElementById('upi_payment_start_date').value || '';
                const paymentEndDate = document.getElementById('upi_payment_end_date').value || '';
                
                const siDetails = {
                    "paymentStartDate": paymentStartDate,
                    "paymentEndDate": paymentEndDate
                };
                
                siDetailsJson = JSON.stringify(siDetails);
                document.getElementById('upi_si_details').value = siDetailsJson;
                hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + siDetailsJson + '|' + credentials.salt;
                hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||si_details|SALT)';
            } else if (flow === 'preauth') {
                // PreAuth Card - Standard hash (no si_details, no special parameters)
                udf1 = document.getElementById('preauth_udf1').value || '';
                udf2 = document.getElementById('preauth_udf2').value || '';
                udf3 = document.getElementById('preauth_udf3').value || '';
                udf4 = document.getElementById('preauth_udf4').value || '';
                udf5 = document.getElementById('preauth_udf5').value || '';
                
                hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt;
                hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)';
            } else if (flow === 'checkoutplus') {
                // Checkout Plus - Standard hash
                udf1 = document.getElementById('cp_udf1').value || '';
                udf2 = document.getElementById('cp_udf2').value || '';
                udf3 = document.getElementById('cp_udf3').value || '';
                udf4 = document.getElementById('cp_udf4').value || '';
                udf5 = document.getElementById('cp_udf5').value || '';
                
                hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt;
                hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)';
            } else if (flow === 'split') {
                // Split Payment - Modified hash with splitRequest after SALT
                udf1 = document.getElementById('split_udf1').value || '';
                udf2 = document.getElementById('split_udf2').value || '';
                udf3 = document.getElementById('split_udf3').value || '';
                udf4 = document.getElementById('split_udf4').value || '';
                udf5 = document.getElementById('split_udf5').value || '';
                
                // Build splitRequest JSON
                const splitRequestJson = buildSplitRequestJson();
                if (!splitRequestJson) {
                    throw new Error('Failed to build splitRequest JSON');
                }
                
                siDetailsJson = splitRequestJson; // Store full splitRequest for form submission
                
                // Modified hash formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT|splitRequest
                hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt + '|' + splitRequestJson;
                hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT|splitRequest)';
            } else if (flow === 'bankoffer') {
                // Bank Offers - check if cart_details is present for extended hash
                udf1 = document.getElementById('bo_udf1').value || '';
                udf2 = document.getElementById('bo_udf2').value || '';
                udf3 = document.getElementById('bo_udf3').value || '';
                udf4 = document.getElementById('bo_udf4').value || '';
                udf5 = document.getElementById('bo_udf5').value || '';
                
                const cartDetails = buildBankOfferCartDetails();
                const phone = document.getElementById('bo_phone').value || '';
                const offerKey = document.getElementById('bo_offer_key').value.trim() || '';
                const userToken = document.getElementById('bo_user_token').value.trim() || '';  // Get from UI field
                
                if (cartDetails) {
                    // Extended hash formula when cart_details is present
                    // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||user_token|offer_key|offer_auto_apply|cart_details|extra_charges|phone|SALT)
                    const offerAutoApply = '';  // Empty by default
                    const extraCharges = '';  // Empty by default
                    
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + userToken + '|' + offerKey + '|' + offerAutoApply + '|' + cartDetails + '|' + extraCharges + '|' + phone + '|' + credentials.salt;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||user_token|offer_key|offer_auto_apply|cart_details|extra_charges|phone|SALT)';
                } else {
                    // Standard hash formula when cart_details is not present
                    hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt;
                    hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)';
                }
            } else {
                // Non-seamless one-time
                udf1 = document.getElementById('ns_udf1').value || '';
                udf2 = document.getElementById('ns_udf2').value || '';
                udf3 = document.getElementById('ns_udf3').value || '';
                udf4 = document.getElementById('ns_udf4').value || '';
                udf5 = document.getElementById('ns_udf5').value || '';
                
                hashString = credentials.key + '|' + txnid + '|' + amount + '|' + productinfo + '|' + firstname + '|' + email + '|' + udf1 + '|' + udf2 + '|' + udf3 + '|' + udf4 + '|' + udf5 + '||||||' + credentials.salt;
                hashFormula = 'SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)';
            }
            
            const hash = CryptoJS.SHA512(hashString).toString();
            
            console.log('=== Hash Generation ===');
            console.log('Flow:', flow);
            console.log('Prefix:', prefix);
            console.log('Payment Type:', currentPaymentType);
            console.log('Hash Formula:', hashFormula);
            console.log('Hash String:', hashString);
            console.log('Generated Hash:', hash);
            
            // For crossborder flow, extract udf_params from siDetailsJson if it's not a subscription
            let udfParams = '';
            if (flow === 'crossborder' && currentPaymentType === 'onetime' && siDetailsJson) {
                udfParams = siDetailsJson; // siDetailsJson contains udf_params for one-time crossborder
            } else if (flow === 'crossborder' && currentPaymentType === 'subscription') {
                // For subscription, check if udf_params is enabled
                const enableUdfParams = document.getElementById('cb_sub_enable_udf_params').checked;
                if (enableUdfParams) {
                    const udf7 = document.getElementById('cb_sub_udf7_input').value || '';
                    const udf8 = document.getElementById('cb_sub_udf8_input').value || '';
                    if (udf7 || udf8) {
                        const udfParamsObj = {};
                        if (udf7) udfParamsObj.udf7 = udf7;
                        if (udf8) udfParamsObj.udf8 = udf8;
                        udfParams = JSON.stringify(udfParamsObj);
                    }
                }
            }
            
            return { 
                hash: hash, 
                hashString: hashString, 
                hashFormula: hashFormula,
                siDetails: (flow === 'crossborder' && currentPaymentType === 'onetime') ? '' : siDetailsJson,
                splitRequest: flow === 'split' ? siDetailsJson : '',
                udfParams: udfParams,
                udf1: udf1, 
                udf2: udf2, 
                udf3: udf3, 
                udf4: udf4, 
                udf5: udf5, 
                credentials: credentials 
            };
        }
        
        // Submit Payment
        function submitPayment(flow) {
            // Using stable transaction ID from page load
            console.log('=== Submitting Payment with Stable Transaction ID ===');
            
            // For split payment, regenerate all child transaction IDs
            if (flow === 'split') {
                regenerateSplitChildTransactionIds();
            }
            
            if (!validateForm(flow)) return;
            
            // Set correct prefix based on flow
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const hashData = generateHash(flow);
            
            console.log('=== Submitting Payment ===');
            console.log('Flow:', flow);
            console.log('Prefix:', prefix);
            
            // Create dynamic form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://test.payu.in/_payment';
            form.style.display = 'none';
            
            const fields = [
                { name: 'key', value: hashData.credentials.key },
                { name: 'txnid', value: document.getElementById(prefix + '_txnid').value },
                { name: 'amount', value: document.getElementById(prefix + '_amount').value },
                { name: 'productinfo', value: document.getElementById(prefix + '_productinfo').value },
                { name: 'firstname', value: document.getElementById(prefix + '_firstname').value },
                { name: 'email', value: document.getElementById(prefix + '_email').value },
                { name: 'phone', value: document.getElementById(prefix + '_phone').value },
                { name: 'surl', value: document.getElementById(prefix + '_surl').value },
                { name: 'furl', value: document.getElementById(prefix + '_furl').value },
                { name: 'hash', value: hashData.hash }
            ];
            
            console.log('Mandatory fields added:', fields.length);
            
            // Add optional fields
            const lastname = document.getElementById(prefix + '_lastname');
            if (lastname && lastname.value) {
                fields.push({ name: 'lastname', value: lastname.value });
            }
            
            // Add address fields if they have values
            const addressFields = ['address1', 'address2', 'city', 'state', 'country', 'zipcode'];
            addressFields.forEach(fieldName => {
                const field = document.getElementById(prefix + '_' + fieldName);
                if (field && field.value) {
                    fields.push({ name: fieldName, value: field.value });
                }
            });
            
            // Add UDF fields if they have values
            if (hashData.udf1) fields.push({ name: 'udf1', value: hashData.udf1 });
            if (hashData.udf2) fields.push({ name: 'udf2', value: hashData.udf2 });
            if (hashData.udf3) fields.push({ name: 'udf3', value: hashData.udf3 });
            if (hashData.udf4) fields.push({ name: 'udf4', value: hashData.udf4 });
            if (hashData.udf5) fields.push({ name: 'udf5', value: hashData.udf5 });
            
            // Add subscription fields for cross border subscription
            if (flow === 'crossborder' && currentPaymentType === 'subscription') {
                fields.push({ name: 'si', value: '1' });
                fields.push({ name: 'api_version', value: '7' });
                fields.push({ name: 'si_details', value: document.getElementById('cb_si_details').value });
                
                // Add buyer_type_business if selected
                const buyerTypeBusiness = document.getElementById('cb_buyer_type').value;
                if (buyerTypeBusiness) {
                    fields.push({ name: 'buyer_type_business', value: buyerTypeBusiness });
                    console.log('Cross Border subscription fields added with buyer_type_business:', buyerTypeBusiness);
                } else {
                    console.log('Cross Border subscription fields added');
                }
            }
            
            // Add buyer_type_business for cross border one-time
            if (flow === 'crossborder' && currentPaymentType === 'onetime') {
                const buyerTypeBusiness = document.getElementById('cb_buyer_type').value;
                if (buyerTypeBusiness) {
                    fields.push({ name: 'buyer_type_business', value: buyerTypeBusiness });
                    console.log('Cross Border one-time: buyer_type_business added:', buyerTypeBusiness);
                }
            }
            
            // Add udf_params for cross border (both one-time and subscription)
            if (flow === 'crossborder' && hashData.udfParams) {
                fields.push({ name: 'udf_params', value: hashData.udfParams });
                console.log('Cross Border: udf_params added:', hashData.udfParams);
            }
            
            // Add subscription fields for non-seamless subscription
            if (flow === 'subscription') {
                fields.push({ name: 'si', value: '1' });
                fields.push({ name: 'api_version', value: '7' });
                fields.push({ name: 'si_details', value: document.getElementById('sub_si_details').value });
                console.log('Non-Seamless subscription fields added');
            }
            
            // Add TPV fields
            if (flow === 'tpv') {
                fields.push({ name: 'api_version', value: '6' });
                fields.push({ name: 'beneficiarydetail', value: document.getElementById('tpv_beneficiarydetail').value });
                console.log('TPV One Time fields added');
            }
            
            // Add UPI OTM fields
            if (flow === 'upiotm') {
                fields.push({ name: 'api_version', value: '7' });
                fields.push({ name: 'si_details', value: document.getElementById('upi_si_details').value });
                fields.push({ name: 'pre_authorize', value: '1' });
                console.log('UPI OTM fields added');
            }
            
            // Add PreAuth fields
            if (flow === 'preauth') {
                fields.push({ name: 'pre_authorize', value: '1' });
                console.log('PreAuth Card fields added');
            }
            
            // Add Split Payment fields
            if (flow === 'split') {
                fields.push({ name: 'splitRequest', value: hashData.splitRequest });
                console.log('Split Payment fields added');
                console.log('splitRequest:', hashData.splitRequest);
            }
            
            // Add Bank Offers fields (cart_details and offer_key)
            if (flow === 'bankoffer') {
                const cartDetails = buildBankOfferCartDetails();
                if (cartDetails) {
                    fields.push({ name: 'cart_details', value: cartDetails });
                    fields.push({ name: 'api_version', value: '19' });
                    console.log('Bank Offers fields added');
                    console.log('cart_details:', cartDetails);
                    console.log('api_version: 19');
                } else {
                    console.log('No cart_details - proceeding as standard payment');
                }
                
                // Add offer_key for non-SKU offers (independent of cart_details)
                const offerKey = document.getElementById('bo_offer_key').value.trim();
                if (offerKey) {
                    fields.push({ name: 'offer_key', value: offerKey });
                    console.log('Non-SKU offer_key added:', offerKey);
                }
                
                // Add user_token for bank offers (both SKU and non-SKU)
                const userToken = document.getElementById('bo_user_token').value.trim();
                if (userToken) {
                    fields.push({ name: 'user_token', value: userToken });
                    console.log('user_token added:', userToken);
                }
            }
            
            // Add user_credentials if Saved Card Feature is enabled
            const userCredentials = document.getElementById(prefix + '_user_credentials');
            if (userCredentials && userCredentials.value.trim()) {
                fields.push({ name: 'user_credentials', value: userCredentials.value.trim() });
                console.log('user_credentials added:', userCredentials.value.trim());
            }
            
            // Add enforce paymethod if selected
            const paymethodCheckboxes = document.querySelectorAll('input[name="' + prefix + '_paymethod"]:checked');
            if (paymethodCheckboxes.length > 0) {
                const selectedPaymethods = [];
                paymethodCheckboxes.forEach(checkbox => {
                    let paymethodValue;
                    const id = checkbox.id.replace(prefix + '_', '');
                    
                    // Check if this is a subscription flow (Cross Border subscription or Non-Seamless subscription)
                    if ((flow === 'crossborder' && currentPaymentType === 'subscription') || flow === 'subscription') {
                        // Subscription payment methods
                        switch (id) {
                            case 'nb': paymethodValue = 'enach'; break;
                            case 'cc': paymethodValue = 'creditcard'; break;
                            case 'dc': paymethodValue = 'debitcard'; break;
                            case 'upi': paymethodValue = 'upi'; break;
                            default: paymethodValue = checkbox.value.toLowerCase();
                        }
                    } else {
                        // One-time payment methods
                        switch (id) {
                            case 'nb': paymethodValue = 'netbanking'; break;
                            case 'cc': paymethodValue = 'creditcard'; break;
                            case 'dc': paymethodValue = 'debitcard'; break;
                            case 'upi': paymethodValue = 'upi'; break;
                            default: paymethodValue = checkbox.value.toLowerCase();
                        }
                    }
                    selectedPaymethods.push(paymethodValue);
                });
                fields.push({ name: 'enforce_paymethod', value: selectedPaymethods.join('|') });
            }
            
            // Create hidden inputs
            fields.forEach(field => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = field.name;
                input.value = field.value;
                form.appendChild(input);
            });
            
            // Submit form
            document.body.appendChild(form);
            form.submit();
        }
        
        // Helper function to determine if a field is mandatory or optional
        function getFieldType(fieldName, flow) {
            // Define mandatory fields (common across all flows)
            const mandatoryFields = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'phone', 'surl', 'furl', 'hash'];
            
            // Define optional fields (common)
            const optionalFields = ['lastname', 'address1', 'address2', 'city', 'state', 'country', 'zipcode', 
                                   'udf1', 'udf2', 'udf3', 'udf4', 'udf5', 'buyer_type_business', 'offer_key'];
            
            // Flow-specific mandatory fields
            
            // Cross Border flow - additional mandatory fields for PACB compliance
            if (flow === 'crossborder') {
                // Mandatory fields for all cross-border payments
                if (['lastname', 'address1', 'city', 'state', 'country', 'zipcode'].includes(fieldName)) {
                    return 'mandatory';
                }
                // UDF5 is mandatory for cross-border one-time payments
                if (fieldName === 'udf5' && currentPaymentType === 'onetime') {
                    return 'mandatory';
                }
                // Subscription-specific mandatory fields
                if (currentPaymentType === 'subscription') {
                    if (['si', 'api_version', 'si_details'].includes(fieldName)) return 'mandatory';
                }
            }
            
            if (flow === 'subscription') {
                if (['si', 'api_version', 'si_details'].includes(fieldName)) return 'mandatory';
            }
            
            if (flow === 'tpv') {
                if (['api_version', 'beneficiarydetail'].includes(fieldName)) return 'mandatory';
            }
            
            if (flow === 'upiotm') {
                if (['api_version', 'si_details', 'pre_authorize'].includes(fieldName)) return 'mandatory';
            }
            
            if (flow === 'preauth') {
                if (['pre_authorize'].includes(fieldName)) return 'mandatory';
                // enforce_paymethod is mandatory for PreAuth flow
                if (fieldName === 'enforce_paymethod') return 'mandatory';
            }
            
            if (flow === 'split') {
                if (['splitRequest'].includes(fieldName)) return 'mandatory';
            }
            
            if (flow === 'bankoffer') {
                if (['api_version', 'cart_details'].includes(fieldName)) return 'mandatory';
            }
            
            // Check if in mandatory list
            if (mandatoryFields.includes(fieldName)) return 'mandatory';
            
            // Check if in optional list
            if (optionalFields.includes(fieldName)) return 'optional';
            
            // Special cases
            if (fieldName === 'enforce_paymethod') return 'optional';
            if (fieldName === 'Payment Type' || fieldName === 'Flow' || fieldName === 'Endpoint') return '';
            
            // Default to optional for any other field
            return 'optional';
        }
        
        // Show Debug Info
        function showDebugInfo(flow) {
            // Using stable transaction ID - showing actual ID that will be used
            console.log('ℹ️ Displaying debug info with stable transaction ID');
            
            // For split payment, regenerate all child transaction IDs
            if (flow === 'split') {
                regenerateSplitChildTransactionIds();
            }
            
            if (!validateForm(flow)) return;
            
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const hashData = generateHash(flow);
            
            let debugHtml = '<table class="debug-table">';
            debugHtml += '<tr><th>Parameter</th><th>Value</th></tr>';
            debugHtml += '<tr><td>Flow</td><td>' + flow.toUpperCase() + '</td></tr>';
            if (flow === 'crossborder') {
                debugHtml += '<tr><td>Payment Type</td><td>' + currentPaymentType + '</td></tr>';
            }
            debugHtml += '<tr><td>Endpoint</td><td>https://test.payu.in/_payment</td></tr>';
            
            // Show all request body parameters
            debugHtml += '<tr style="background: #e6f7ff;"><td colspan="2"><strong>REQUEST BODY PARAMETERS</strong></td></tr>';
            
            // Helper function to add field label
            const addFieldLabel = (fieldName) => {
                const fieldType = getFieldType(fieldName, flow);
                return fieldType ? ' <span style="color: ' + (fieldType === 'mandatory' ? '#d32f2f' : '#1976d2') + '; font-size: 0.85em;">(' + fieldType + ')</span>' : '';
            };
            
            debugHtml += '<tr><td>key' + addFieldLabel('key') + '</td><td>' + hashData.credentials.key + '</td></tr>';
            debugHtml += '<tr><td>txnid' + addFieldLabel('txnid') + '</td><td>' + document.getElementById(prefix + '_txnid').value + '</td></tr>';
            debugHtml += '<tr><td>amount' + addFieldLabel('amount') + '</td><td>' + document.getElementById(prefix + '_amount').value + '</td></tr>';
            debugHtml += '<tr><td>productinfo' + addFieldLabel('productinfo') + '</td><td>' + document.getElementById(prefix + '_productinfo').value + '</td></tr>';
            debugHtml += '<tr><td>firstname' + addFieldLabel('firstname') + '</td><td>' + document.getElementById(prefix + '_firstname').value + '</td></tr>';
            
            // Add lastname if present
            const lastname = document.getElementById(prefix + '_lastname');
            if (lastname && lastname.value) {
                debugHtml += '<tr><td>lastname' + addFieldLabel('lastname') + '</td><td>' + lastname.value + '</td></tr>';
            }
            
            debugHtml += '<tr><td>email' + addFieldLabel('email') + '</td><td>' + document.getElementById(prefix + '_email').value + '</td></tr>';
            debugHtml += '<tr><td>phone' + addFieldLabel('phone') + '</td><td>' + document.getElementById(prefix + '_phone').value + '</td></tr>';
            
            // Add address fields if present
            const addressFields = ['address1', 'address2', 'city', 'state', 'country', 'zipcode'];
            addressFields.forEach(fieldName => {
                const field = document.getElementById(prefix + '_' + fieldName);
                if (field && field.value) {
                    debugHtml += '<tr><td>' + fieldName + addFieldLabel(fieldName) + '</td><td>' + field.value + '</td></tr>';
                }
            });
            
            // Add UDF fields
            if (hashData.udf1) debugHtml += '<tr><td>udf1' + addFieldLabel('udf1') + '</td><td>' + hashData.udf1 + '</td></tr>';
            if (hashData.udf2) debugHtml += '<tr><td>udf2' + addFieldLabel('udf2') + '</td><td>' + hashData.udf2 + '</td></tr>';
            if (hashData.udf3) debugHtml += '<tr><td>udf3' + addFieldLabel('udf3') + '</td><td>' + hashData.udf3 + '</td></tr>';
            if (hashData.udf4) debugHtml += '<tr><td>udf4' + addFieldLabel('udf4') + '</td><td>' + hashData.udf4 + '</td></tr>';
            if (hashData.udf5) debugHtml += '<tr><td>udf5' + addFieldLabel('udf5') + '</td><td>' + hashData.udf5 + '</td></tr>';
            
            // Add subscription fields for cross border
            // Add subscription specific fields
            if (flow === 'crossborder' && currentPaymentType === 'subscription') {
                debugHtml += '<tr><td>si' + addFieldLabel('si') + '</td><td>1</td></tr>';
                debugHtml += '<tr><td>api_version' + addFieldLabel('api_version') + '</td><td>7</td></tr>';
                debugHtml += '<tr><td>si_details' + addFieldLabel('si_details') + '</td><td>' + document.getElementById('cb_si_details').value + '</td></tr>';
                
                // Add buyer_type_business if selected
                const buyerTypeBusiness = document.getElementById('cb_buyer_type').value;
                if (buyerTypeBusiness) {
                    debugHtml += '<tr><td>buyer_type_business' + addFieldLabel('buyer_type_business') + '</td><td>' + buyerTypeBusiness + '</td></tr>';
                }
            } else if (flow === 'crossborder' && currentPaymentType === 'onetime') {
                // Add buyer_type_business for cross border one-time
                const buyerTypeBusiness = document.getElementById('cb_buyer_type').value;
                if (buyerTypeBusiness) {
                    debugHtml += '<tr><td>buyer_type_business' + addFieldLabel('buyer_type_business') + '</td><td>' + buyerTypeBusiness + '</td></tr>';
                }
            }
            
            // Add udf_params for cross border (both one-time and subscription)
            if (flow === 'crossborder' && hashData.udfParams) {
                debugHtml += '<tr><td>udf_params' + addFieldLabel('udf_params') + '</td><td>' + hashData.udfParams + '</td></tr>';
            }
            
            if (flow === 'subscription') {
                debugHtml += '<tr><td>si' + addFieldLabel('si') + '</td><td>1</td></tr>';
                debugHtml += '<tr><td>api_version' + addFieldLabel('api_version') + '</td><td>7</td></tr>';
                debugHtml += '<tr><td>si_details' + addFieldLabel('si_details') + '</td><td>' + hashData.siDetails + '</td></tr>';
            } else if (flow === 'tpv') {
                debugHtml += '<tr><td>api_version' + addFieldLabel('api_version') + '</td><td>6</td></tr>';
                debugHtml += '<tr><td>beneficiarydetail' + addFieldLabel('beneficiarydetail') + '</td><td>' + document.getElementById('tpv_beneficiarydetail').value + '</td></tr>';
            } else if (flow === 'upiotm') {
                debugHtml += '<tr><td>api_version' + addFieldLabel('api_version') + '</td><td>7</td></tr>';
                debugHtml += '<tr><td>si_details' + addFieldLabel('si_details') + '</td><td>' + hashData.siDetails + '</td></tr>';
                debugHtml += '<tr><td>pre_authorize' + addFieldLabel('pre_authorize') + '</td><td>1</td></tr>';
            } else if (flow === 'preauth') {
                debugHtml += '<tr><td>pre_authorize' + addFieldLabel('pre_authorize') + '</td><td>1</td></tr>';
            } else if (flow === 'split') {
                debugHtml += '<tr><td>splitRequest' + addFieldLabel('splitRequest') + '</td><td><pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto;">' + JSON.stringify(JSON.parse(hashData.splitRequest), null, 2) + '</pre></td></tr>';
            } else if (flow === 'bankoffer') {
                const cartDetails = buildBankOfferCartDetails();
                if (cartDetails) {
                    debugHtml += '<tr><td>api_version' + addFieldLabel('api_version') + '</td><td>19</td></tr>';
                    debugHtml += '<tr><td>cart_details' + addFieldLabel('cart_details') + '</td><td><pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto;">' + JSON.stringify(JSON.parse(cartDetails), null, 2) + '</pre></td></tr>';
                }
                
                // Add offer_key for non-SKU offers
                const offerKey = document.getElementById('bo_offer_key').value.trim();
                if (offerKey) {
                    debugHtml += '<tr><td>offer_key' + addFieldLabel('offer_key') + '</td><td>' + offerKey + '</td></tr>';
                }
                
                // Add user_token for bank offers (both SKU and non-SKU)
                const userToken = document.getElementById('bo_user_token').value.trim();
                if (userToken) {
                    debugHtml += '<tr><td>user_token' + addFieldLabel('user_token') + '</td><td>' + userToken + '</td></tr>';
                }
            }
            
            debugHtml += '<tr><td>surl' + addFieldLabel('surl') + '</td><td>' + document.getElementById(prefix + '_surl').value + '</td></tr>';
            debugHtml += '<tr><td>furl' + addFieldLabel('furl') + '</td><td>' + document.getElementById(prefix + '_furl').value + '</td></tr>';
            
            // Add user_credentials if Saved Card Feature is enabled
            const userCredentialsDebug = document.getElementById(prefix + '_user_credentials');
            if (userCredentialsDebug && userCredentialsDebug.value.trim()) {
                debugHtml += '<tr><td>user_credentials' + addFieldLabel('user_credentials') + '</td><td>' + userCredentialsDebug.value.trim() + '</td></tr>';
            }
            
            // Add enforce_paymethod if payment methods are selected
            const paymethodCheckboxes = document.querySelectorAll('input[name="' + prefix + '_paymethod"]:checked');
            if (paymethodCheckboxes.length > 0) {
                const selectedPaymethods = [];
                paymethodCheckboxes.forEach(checkbox => {
                    let paymethodValue;
                    const id = checkbox.id.replace(prefix + '_', '');
                    
                    // Check if this is a subscription flow (Cross Border subscription or Non-Seamless subscription)
                    if ((flow === 'crossborder' && currentPaymentType === 'subscription') || flow === 'subscription') {
                        // Subscription payment methods
                        switch (id) {
                            case 'nb': paymethodValue = 'enach'; break;
                            case 'cc': paymethodValue = 'creditcard'; break;
                            case 'dc': paymethodValue = 'debitcard'; break;
                            case 'upi': paymethodValue = 'upi'; break;
                            default: paymethodValue = checkbox.value.toLowerCase();
                        }
                    } else {
                        // One-time payment methods
                        switch (id) {
                            case 'nb': paymethodValue = 'netbanking'; break;
                            case 'cc': paymethodValue = 'creditcard'; break;
                            case 'dc': paymethodValue = 'debitcard'; break;
                            case 'upi': paymethodValue = 'upi'; break;
                            default: paymethodValue = checkbox.value.toLowerCase();
                        }
                    }
                    selectedPaymethods.push(paymethodValue);
                });
                debugHtml += '<tr><td>enforce_paymethod' + addFieldLabel('enforce_paymethod') + '</td><td>' + selectedPaymethods.join('|') + '</td></tr>';
            }
            
            debugHtml += '<tr><td>hash' + addFieldLabel('hash') + '</td><td>' + hashData.hash.substring(0, 20) + '... (truncated)</td></tr>';
            
            const saltDisplay = '***' + hashData.credentials.salt.slice(-4);
            debugHtml += '<tr style="background: #f0f0f0;"><td colspan="2"><strong>HASH CALCULATION INFO</strong></td></tr>';
            debugHtml += '<tr><td>Salt (masked)</td><td>' + saltDisplay + '</td></tr>';
            debugHtml += '</table>';
            
            // Show hash formula (from hashData)
            debugHtml += '<h4>Hash Formula:</h4>';
            debugHtml += '<div class="hash-string-display" style="background: #fff3cd; border-color: #ffc107; color: #856404; font-weight: 600;">' + hashData.hashFormula + '</div>';
            
            debugHtml += '<h4>Hash String:</h4>';
            debugHtml += '<div class="hash-string-display">' + hashData.hashString.replace(hashData.credentials.salt, saltDisplay) + '</div>';
            debugHtml += '<h4>Generated Hash:</h4>';
            debugHtml += '<div class="hash-output">' + hashData.hash + '</div>';
            debugHtml += '<div class="hash-output">Hash Length: ' + hashData.hash.length + ' characters</div>';
            
            document.getElementById(prefix + '-debugContent').innerHTML = debugHtml;
            document.getElementById(prefix + '-debugSection').style.display = 'block';
            document.getElementById(prefix + '-debugSection').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Show CURL Command
        function showCurlCommand(flow) {
            // Using stable transaction ID - CURL shows actual ID that will be used
            console.log('📋 Generating CURL command with stable transaction ID');
            
            // For split payment, regenerate all child transaction IDs
            if (flow === 'split') {
                regenerateSplitChildTransactionIds();
            }
            
            if (!validateForm(flow)) return;
            
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const hashData = generateHash(flow);
            
            let curlCommand = 'curl -X POST "https://test.payu.in/_payment" \\\n';
            curlCommand += '  -H "Content-Type: application/x-www-form-urlencoded" \\\n';
            
            // Add parameters (curl -d handles encoding automatically, no need for encodeURIComponent)
            curlCommand += '  -d "key=' + hashData.credentials.key + '" \\\n';
            curlCommand += '  -d "txnid=' + document.getElementById(prefix + '_txnid').value + '" \\\n';
            curlCommand += '  -d "amount=' + document.getElementById(prefix + '_amount').value + '" \\\n';
            curlCommand += '  -d "productinfo=' + document.getElementById(prefix + '_productinfo').value + '" \\\n';
            curlCommand += '  -d "firstname=' + document.getElementById(prefix + '_firstname').value + '" \\\n';
            
            const lastname = document.getElementById(prefix + '_lastname');
            if (lastname && lastname.value) {
                curlCommand += '  -d "lastname=' + lastname.value + '" \\\n';
            }
            
            curlCommand += '  -d "email=' + document.getElementById(prefix + '_email').value + '" \\\n';
            curlCommand += '  -d "phone=' + document.getElementById(prefix + '_phone').value + '" \\\n';
            
            // Add address fields if present
            const addressFields = ['address1', 'address2', 'city', 'state', 'country', 'zipcode'];
            addressFields.forEach(fieldName => {
                const field = document.getElementById(prefix + '_' + fieldName);
                if (field && field.value) {
                    curlCommand += '  -d "' + fieldName + '=' + field.value + '" \\\n';
                }
            });
            
            // Add UDF fields (now properly reading from hashData which includes values from all flows)
            if (hashData.udf1) curlCommand += '  -d "udf1=' + hashData.udf1 + '" \\\n';
            if (hashData.udf2) curlCommand += '  -d "udf2=' + hashData.udf2 + '" \\\n';
            if (hashData.udf3) curlCommand += '  -d "udf3=' + hashData.udf3 + '" \\\n';
            if (hashData.udf4) curlCommand += '  -d "udf4=' + hashData.udf4 + '" \\\n';
            if (hashData.udf5) curlCommand += '  -d "udf5=' + hashData.udf5 + '" \\\n';
            
            // Add subscription fields
            // Add subscription fields (si_details displayed in readable format for easy copy-paste)
            if (flow === 'crossborder' && currentPaymentType === 'subscription') {
                curlCommand += '  -d "si=1" \\\n';
                curlCommand += '  -d "api_version=7" \\\n';
                curlCommand += '  -d \'si_details=' + document.getElementById('cb_si_details').value + '\' \\\n';
                
                // Add buyer_type_business if selected
                const buyerTypeBusiness = document.getElementById('cb_buyer_type').value;
                if (buyerTypeBusiness) {
                    curlCommand += '  -d "buyer_type_business=' + buyerTypeBusiness + '" \\\n';
                }
            } else if (flow === 'crossborder' && currentPaymentType === 'onetime') {
                // Add buyer_type_business for cross border one-time
                const buyerTypeBusiness = document.getElementById('cb_buyer_type').value;
                if (buyerTypeBusiness) {
                    curlCommand += '  -d "buyer_type_business=' + buyerTypeBusiness + '" \\\n';
                }
            }
            
            // Add udf_params for cross border (both one-time and subscription)
            if (flow === 'crossborder' && hashData.udfParams) {
                curlCommand += '  --data-urlencode \'udf_params=' + hashData.udfParams + '\' \\\n';
            }
            
            if (flow === 'subscription') {
                curlCommand += '  -d "si=1" \\\n';
                curlCommand += '  -d "api_version=7" \\\n';
                curlCommand += '  -d \'si_details=' + hashData.siDetails + '\' \\\n';
            } else if (flow === 'tpv') {
                curlCommand += '  -d "api_version=6" \\\n';
                curlCommand += '  -d \'beneficiarydetail=' + document.getElementById('tpv_beneficiarydetail').value + '\' \\\n';
            } else if (flow === 'upiotm') {
                curlCommand += '  -d "api_version=7" \\\n';
                curlCommand += '  -d \'si_details=' + hashData.siDetails + '\' \\\n';
                curlCommand += '  -d "pre_authorize=1" \\\n';
            } else if (flow === 'preauth') {
                curlCommand += '  -d "pre_authorize=1" \\\n';
            } else if (flow === 'split') {
                curlCommand += '  --data-urlencode \'splitRequest=' + hashData.splitRequest + '\' \\\n';
            } else if (flow === 'bankoffer') {
                const cartDetails = buildBankOfferCartDetails();
                if (cartDetails) {
                    curlCommand += '  -d "api_version=19" \\\n';
                    curlCommand += '  --data-urlencode \'cart_details=' + cartDetails + '\' \\\n';
                }
                
                // Add offer_key for non-SKU offers
                const offerKey = document.getElementById('bo_offer_key').value.trim();
                if (offerKey) {
                    curlCommand += '  -d "offer_key=' + offerKey + '" \\\n';
                }
                
                // Add user_token for bank offers (both SKU and non-SKU)
                const userToken = document.getElementById('bo_user_token').value.trim();
                if (userToken) {
                    curlCommand += '  -d "user_token=' + userToken + '" \\\n';
                }
            }
            
            curlCommand += '  -d "surl=' + document.getElementById(prefix + '_surl').value + '" \\\n';
            curlCommand += '  -d "furl=' + document.getElementById(prefix + '_furl').value + '" \\\n';
            
            // Add user_credentials if Saved Card Feature is enabled
            const userCredentialsCurl = document.getElementById(prefix + '_user_credentials');
            if (userCredentialsCurl && userCredentialsCurl.value.trim()) {
                curlCommand += '  -d "user_credentials=' + userCredentialsCurl.value.trim() + '" \\\n';
            }
            
            // Add enforce paymethod
            const paymethodCheckboxes = document.querySelectorAll('input[name="' + prefix + '_paymethod"]:checked');
            if (paymethodCheckboxes.length > 0) {
                const selectedPaymethods = [];
                paymethodCheckboxes.forEach(checkbox => {
                    let paymethodValue;
                    const id = checkbox.id.replace(prefix + '_', '');
                    
                    // Check if this is a subscription flow (Cross Border subscription or Non-Seamless subscription)
                    if ((flow === 'crossborder' && currentPaymentType === 'subscription') || flow === 'subscription') {
                        // Subscription payment methods
                        switch (id) {
                            case 'nb': paymethodValue = 'enach'; break;
                            case 'cc': paymethodValue = 'creditcard'; break;
                            case 'dc': paymethodValue = 'debitcard'; break;
                            case 'upi': paymethodValue = 'upi'; break;
                            default: paymethodValue = checkbox.value.toLowerCase();
                        }
                    } else {
                        // One-time payment methods
                        switch (id) {
                            case 'nb': paymethodValue = 'netbanking'; break;
                            case 'cc': paymethodValue = 'creditcard'; break;
                            case 'dc': paymethodValue = 'debitcard'; break;
                            case 'upi': paymethodValue = 'upi'; break;
                            default: paymethodValue = checkbox.value.toLowerCase();
                        }
                    }
                    selectedPaymethods.push(paymethodValue);
                });
                curlCommand += '  -d "enforce_paymethod=' + selectedPaymethods.join('|') + '" \\\n';
            }
            
            curlCommand += '  -d "hash=' + hashData.hash + '"';
            
            document.getElementById(prefix + '-curlContent').textContent = curlCommand;
            document.getElementById(prefix + '-curlSection').style.display = 'block';
            document.getElementById(prefix + '-curlSection').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Copy CURL to Clipboard
        function copyCurlToClipboard(flow) {
            const prefix = flow === 'crossborder' ? 'cb' : (flow === 'subscription' ? 'sub' : (flow === 'tpv' ? 'tpv' : (flow === 'upiotm' ? 'upi' : (flow === 'preauth' ? 'preauth' : (flow === 'checkoutplus' ? 'cp' : (flow === 'split' ? 'split' : (flow === 'bankoffer' ? 'bo' : 'ns')))))));
            const curlContent = document.getElementById(prefix + '-curlContent').textContent;
            navigator.clipboard.writeText(curlContent).then(function() {
                alert('CURL command copied to clipboard!');
            }).catch(function(err) {
                console.error('Failed to copy CURL to clipboard:', err);
                alert('Failed to copy CURL command. Please copy manually from the text above.');
            });
        }
        
        // ============================================
        // CHECKOUT PLUS SPECIFIC FUNCTIONS
        // ============================================
        
        // Launch Checkout Plus Payment
        function launchCheckoutPlus() {
            if (!validateForm('checkoutplus')) return;
            
            // Check if SDK is loaded
            if (typeof bolt === 'undefined') {
                alert('Checkout Plus SDK is not loaded. Please refresh the page and try again.');
                return;
            }
            
            // Using stable transaction ID from page load
            console.log('✓ Checkout Plus using stable transaction ID');
            
            const prefix = 'cp';
            const credentials = getCredentials('checkoutplus');
            const hashData = generateHash('checkoutplus');
            
            // Prepare payment data
            const paymentData = {
                key: credentials.key,
                txnid: document.getElementById(prefix + '_txnid').value,
                amount: document.getElementById(prefix + '_amount').value,
                productinfo: document.getElementById(prefix + '_productinfo').value,
                firstname: document.getElementById(prefix + '_firstname').value,
                email: document.getElementById(prefix + '_email').value,
                phone: document.getElementById(prefix + '_phone').value,
                surl: document.getElementById(prefix + '_surl').value,
                furl: document.getElementById(prefix + '_furl').value,
                hash: hashData.hash
            };
            
            // Add optional lastname
            const lastname = document.getElementById(prefix + '_lastname').value;
            if (lastname) paymentData.lastname = lastname;
            
            // Add address fields if present
            const addressFields = ['address1', 'address2', 'city', 'state', 'country', 'zipcode'];
            addressFields.forEach(field => {
                const value = document.getElementById(prefix + '_' + field).value;
                if (value) paymentData[field] = value;
            });
            
            // Add UDF fields
            if (hashData.udf1) paymentData.udf1 = hashData.udf1;
            if (hashData.udf2) paymentData.udf2 = hashData.udf2;
            if (hashData.udf3) paymentData.udf3 = hashData.udf3;
            if (hashData.udf4) paymentData.udf4 = hashData.udf4;
            if (hashData.udf5) paymentData.udf5 = hashData.udf5;
            
            // Add enforce_paymethod if selected
            const paymethodCheckboxes = document.querySelectorAll('input[name="cp_paymethod"]:checked');
            if (paymethodCheckboxes.length > 0) {
                const selectedPaymethods = [];
                paymethodCheckboxes.forEach(checkbox => {
                    const id = checkbox.id.replace('cp_', '');
                    const paymethodValue = id === 'nb' ? 'netbanking' : 
                                          id === 'cc' ? 'creditcard' : 
                                          id === 'dc' ? 'debitcard' : 
                                          id === 'upi' ? 'upi' : checkbox.value.toLowerCase();
                    selectedPaymethods.push(paymethodValue);
                });
                paymentData.enforce_paymethod = selectedPaymethods.join('|');
            }
            
            console.log('=== Launching Checkout Plus ===');
            console.log('Payment Data:', paymentData);
            console.log('Note: Payment will redirect to callback page after completion (GET method)');
            
            // Setup response handlers to redirect to callback.php
            const handlers = {
                responseHandler: function(BOLT) {
                    checkoutPlusResponseHandler(BOLT);
                },
                catchException: function(BOLT) {
                    checkoutPlusCatchException(BOLT);
                }
            };
            
            // Launch payment
            try {
                bolt.launch(paymentData, handlers);
            } catch (error) {
                console.error('Error launching Checkout Plus:', error);
                alert('Failed to launch Checkout Plus: ' + error.message);
            }
        }
        
        // Checkout Plus Response Handler
        // Redirects to callback.php with response data as GET parameters
        function checkoutPlusResponseHandler(BOLT) {
            console.log('=== Checkout Plus Response ===');
            console.log('Transaction Response:', BOLT.response);
            
            const res = BOLT.response;
            
            // Build callback URL with response data as GET parameters
            const callbackUrl = document.getElementById('cp_surl').value || 'callback.php';
            const params = new URLSearchParams();
            
            // Add all response fields to GET parameters
            for (const key in res) {
                if (res.hasOwnProperty(key) && res[key] !== null && res[key] !== undefined) {
                    params.append(key, res[key]);
                }
            }
            
            // Map Checkout Plus status fields to callback.php compatible format
            let finalStatus = '';
            
            // Priority 1: Check unmappedstatus (Checkout Plus specific)
            if (res.unmappedstatus) {
                const unmappedStatus = res.unmappedstatus.toLowerCase();
                console.log('Checkout Plus unmappedstatus:', unmappedStatus);
                
                if (unmappedStatus === 'captured') {
                    finalStatus = 'success';
                } else if (unmappedStatus === 'failed') {
                    finalStatus = 'failure';
                } else if (unmappedStatus === 'inprogress') {
                    finalStatus = 'pending';
                } else {
                    finalStatus = unmappedStatus; // Use as-is for other statuses
                }
            }
            // Priority 2: Fallback to txnStatus
            else if (res.txnStatus) {
                finalStatus = res.txnStatus.toLowerCase();
            }
            // Priority 3: Fallback to status field if present
            else if (res.status) {
                finalStatus = res.status.toLowerCase();
            }
            
            // Set the final status for callback.php
            if (finalStatus) {
                params.set('status', finalStatus);
                console.log('Mapped status for callback.php:', finalStatus);
            }
            
            // Convert txnId to txnid for callback.php compatibility
            if (res.txnId && !res.txnid) {
                params.set('txnid', res.txnId);
            }
            
            console.log('Redirecting to callback with GET parameters:', params.toString());
            
            // Redirect to callback page with GET parameters
            const redirectUrl = callbackUrl + '?' + params.toString();
            window.location.href = redirectUrl;
        }
        
        // Checkout Plus Exception Handler
        // Redirects to callback.php with error information
        function checkoutPlusCatchException(BOLT) {
            console.log('=== Checkout Plus Exception ===');
            console.log('Exception Message:', BOLT.message);
            
            // Build callback URL with error data
            const callbackUrl = document.getElementById('cp_furl').value || 'callback.php';
            const params = new URLSearchParams();
            const credentials = getCredentials('checkoutplus');
            
            params.append('status', 'failure');
            params.append('error', BOLT.message || 'Payment exception occurred');
            params.append('txnid', document.getElementById('cp_txnid').value || 'N/A');
            params.append('amount', document.getElementById('cp_amount').value || '0');
            params.append('firstname', document.getElementById('cp_firstname').value || '');
            params.append('email', document.getElementById('cp_email').value || '');
            params.append('productinfo', document.getElementById('cp_productinfo').value || '');
            params.append('key', credentials.key);
            
            console.log('Redirecting to callback (error) with GET parameters');
            
            // Redirect to callback page with error info
            const redirectUrl = callbackUrl + '?' + params.toString();
            window.location.href = redirectUrl;
        }
        
        // ============================================
        // CODE GENERATOR FUNCTIONS
        // ============================================
        
        let currentGeneratedLanguage = 'java';
        let currentGeneratedFlow = '';
        let currentGeneratedParams = {};
        
        // Show Code Generator Modal
        function showCodeGeneratorModal(flow) {
            console.log('[DEBUG] showCodeGeneratorModal called with flow:', flow);
            
            // Using stable transaction ID - code examples show actual ID that will be used
            console.log('💻 Generating code snippets with stable transaction ID');
            
            // For split payment, regenerate all child transaction IDs
            if (flow === 'split') {
                regenerateSplitChildTransactionIds();
            }
            
            if (!validateForm(flow)) {
                console.log('[DEBUG] Form validation failed for flow:', flow);
                return;
            }
            
            currentGeneratedFlow = flow;
            currentGeneratedLanguage = 'java';
            currentGeneratedParams = extractFlowParameters(flow);
            
            console.log('[DEBUG] Extracted parameters:', currentGeneratedParams);
            console.log('[DEBUG] Number of params:', Object.keys(currentGeneratedParams).length);
            
            // Update modal title
            const flowNames = {
                'nonseamless': 'Non-Seamless',
                'crossborder': 'Cross Border',
                'subscription': 'Subscription',
                'tpv': 'TPV',
                'upiotm': 'UPI OTM',
                'preauth': 'PreAuth',
                'checkoutplus': 'Checkout Plus',
                'split': 'Split Payment',
                'bankoffer': 'Bank Offers'
            };
            document.getElementById('codeFlowName').textContent = flowNames[flow] || flow;
            
            // Generate and display code
            generateAndDisplayCode(flow, 'java');
            
            // Show modal
            document.getElementById('codeGeneratorModal').style.display = 'flex';
            console.log('Code generator modal opened for flow:', flow);
        }
        
        // Close Code Generator Modal
        function closeCodeGeneratorModal() {
            document.getElementById('codeGeneratorModal').style.display = 'none';
            currentGeneratedFlow = '';
            currentGeneratedParams = {};
        }
        
        // Switch Code Language
        function switchCodeLanguage(language) {
            currentGeneratedLanguage = language;
            
            // Update active tab
            document.querySelectorAll('.code-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Generate and display code for selected language
            generateAndDisplayCode(currentGeneratedFlow, language);
        }
        
        // Extract Flow Parameters (Enhanced for all flows)
        function extractFlowParameters(flow) {
            console.log('[DEBUG] extractFlowParameters called for flow:', flow);
            
            const prefix = flow === 'nonseamless' ? 'ns' : 
                          (flow === 'crossborder' ? 'cb' : 
                          (flow === 'subscription' ? 'sub' : 
                          (flow === 'tpv' ? 'tpv' :
                          (flow === 'upiotm' ? 'upi' :
                          (flow === 'preauth' ? 'preauth' :
                          (flow === 'checkoutplus' ? 'cp' :
                          (flow === 'split' ? 'split' :
                          (flow === 'bankoffer' ? 'bo' : 'ns'))))))));
            
            console.log('[DEBUG] Using prefix:', prefix);
            console.log('[DEBUG] Looking for element:', prefix + '_amount');
            const amountEl = document.getElementById(prefix + '_amount');
            console.log('[DEBUG] Amount element:', amountEl);
            console.log('[DEBUG] Amount value:', amountEl?.value);
            
            const params = {
                txnid: document.getElementById(prefix + '_txnid')?.value || '',
                amount: document.getElementById(prefix + '_amount')?.value || '',
                productinfo: document.getElementById(prefix + '_productinfo')?.value || '',
                firstname: document.getElementById(prefix + '_firstname')?.value || '',
                email: document.getElementById(prefix + '_email')?.value || '',
                phone: document.getElementById(prefix + '_phone')?.value || '',
                surl: document.getElementById(prefix + '_surl')?.value || 'https://test.payu.in/admin/test_response',
                furl: document.getElementById(prefix + '_furl')?.value || 'https://test.payu.in/admin/test_response'
            };
            
            console.log('[DEBUG] Initial params extracted:', params);
            
            // Optional common fields
            const lastname = document.getElementById(prefix + '_lastname')?.value;
            if (lastname) params.lastname = lastname;
            
            const address1 = document.getElementById(prefix + '_address1')?.value;
            if (address1) params.address1 = address1;
            
            const address2 = document.getElementById(prefix + '_address2')?.value;
            if (address2) params.address2 = address2;
            
            const city = document.getElementById(prefix + '_city')?.value;
            if (city) params.city = city;
            
            const state = document.getElementById(prefix + '_state')?.value;
            if (state) params.state = state;
            
            const country = document.getElementById(prefix + '_country')?.value;
            if (country) params.country = country;
            
            const zipcode = document.getElementById(prefix + '_zipcode')?.value;
            if (zipcode) params.zipcode = zipcode;
            
            // UDF fields
            for (let i = 1; i <= 5; i++) {
                let udf = null;
                
                // Special handling for cross-border subscription: check cb_sub_udfX_input
                if (flow === 'crossborder' && currentPaymentType === 'subscription') {
                    udf = document.getElementById('cb_sub_udf' + i + '_input')?.value;
                }
                
                // Try _udfX_input first (for cross border one-time, subscription), then fall back to _udfX
                if (!udf) {
                    udf = document.getElementById(prefix + '_udf' + i + '_input')?.value;
                }
                if (!udf) {
                    udf = document.getElementById(prefix + '_udf' + i)?.value;
                }
                if (udf) params['udf' + i] = udf;
            }
            
            // Flow-specific parameters
            const flowSpecific = {};
            
            // Subscription flows: Both Non-Seamless Subscription and Cross Border Subscription
            // Both use the same subscription parameters (si_details, billing cycle, etc.)
            // The difference is that Cross Border Subscription also includes buyer_type_business (handled below)
            if (flow === 'subscription' || (flow === 'crossborder' && currentPaymentType === 'subscription')) {
                // Subscription-specific fields
                flowSpecific.billingAmount = document.getElementById(prefix + '_billing_amount')?.value;
                flowSpecific.billingCycle = document.getElementById(prefix + '_billing_cycle')?.value;
                flowSpecific.billingInterval = document.getElementById(prefix + '_billing_interval')?.value;
                flowSpecific.paymentStartDate = document.getElementById(prefix + '_payment_start_date')?.value;
                flowSpecific.paymentEndDate = document.getElementById(prefix + '_payment_end_date')?.value;
                flowSpecific.hasSubscription = true;
            }
            
            if (flow === 'tpv') {
                // TPV-specific fields
                flowSpecific.beneficiaryAccount = document.getElementById('tpv_beneficiary_account')?.value || '';
                flowSpecific.ifscCode = document.getElementById('tpv_ifsc_code')?.value || '';
                flowSpecific.hasBeneficiary = true;
            }
            
            if (flow === 'upiotm') {
                // UPI OTM-specific fields
                flowSpecific.paymentStartDate = document.getElementById('upi_payment_start_date')?.value;
                flowSpecific.paymentEndDate = document.getElementById('upi_payment_end_date')?.value;
                flowSpecific.hasUPIOTM = true;
            }
            
            if (flow === 'preauth') {
                // PreAuth-specific fields
                flowSpecific.isPreauth = true;
                
                // Add mandatory PreAuth parameter
                params.pre_authorize = '1';
                
                // Add enforce_paymethod (creditcard for PreAuth)
                const paymethodCheckboxes = document.querySelectorAll('input[name="preauth_paymethod"]:checked');
                if (paymethodCheckboxes.length > 0) {
                    const selectedMethods = Array.from(paymethodCheckboxes).map(cb => cb.value).join('|');
                    params.enforce_paymethod = selectedMethods.toLowerCase();
                }
            }
            
            if (flow === 'split') {
                // Split payment-specific fields
                const splitType = document.querySelector('input[name="split_type"]:checked')?.value || 'absolute';
                const splitRows = document.querySelectorAll('.split-row');
                const splitMerchants = [];
                
                splitRows.forEach(row => {
                    const merchantKey = row.querySelector('.split-merchant-key')?.value.trim();
                    const txnId = row.querySelector('.split-txn-id')?.value.trim();
                    const amount = row.querySelector('.split-amount')?.value.trim();
                    const charges = row.querySelector('.split-charges')?.value.trim() || '0.00';
                    
                    if (merchantKey && txnId && amount) {
                        splitMerchants.push({
                            merchantKey: merchantKey,
                            txnId: txnId,
                            amount: amount,
                            charges: charges
                        });
                    }
                });
                
                flowSpecific.hasSplit = true;
                flowSpecific.splitType = splitType;
                flowSpecific.splitMerchants = splitMerchants;
                
                console.log('✓ Split parameters extracted:', {
                    type: splitType,
                    merchantCount: splitMerchants.length,
                    merchants: splitMerchants
                });
            }
            
            if (flow === 'bankoffer') {
                // Bank Offers-specific fields
                const offerKey = document.getElementById('bo_offer_key')?.value;
                const skuEnabled = document.getElementById('bo_enable_sku')?.checked;
                const userToken = document.getElementById('bo_user_token')?.value.trim();
                
                flowSpecific.hasBankOffer = true;
                
                if (offerKey) {
                    flowSpecific.offerKey = offerKey;
                }
                
                // Store user_token for code generation (both SKU and non-SKU)
                if (userToken) {
                    params.user_token = userToken;
                    flowSpecific.userToken = userToken;
                    console.log('✓ Bank Offer user_token collected for code generation:', userToken);
                }
                
                // Check if cart_details (SKU) is enabled and available
                if (skuEnabled) {
                    const cartDetailsJson = document.getElementById('bo-json-preview')?.textContent;
                    if (cartDetailsJson && cartDetailsJson.trim()) {
                        flowSpecific.cartDetails = cartDetailsJson;
                        flowSpecific.hasCartDetails = true;
                        console.log('✓ Bank Offer SKU enabled - cart_details collected for code generation');
                    }
                }
                
                // Store phone for extended hash
                const phone = document.getElementById('bo_phone')?.value;
                if (phone) {
                    flowSpecific.phone = phone;
                }
            }
            
            if (flow === 'crossborder') {
                // Cross Border-specific fields
                // buyer_type_business is ONLY for Cross Border flow (both one-time and subscription)
                // Non-Seamless Subscription (flow='subscription') does NOT use buyer_type_business
                const buyerType = document.getElementById('cb_buyer_type')?.value;
                if (buyerType !== '') {
                    flowSpecific.buyerTypeBusiness = buyerType;
                }
            }
            
            // COLLECT ALL OPTIONAL PARAMETERS (for dynamic code generation)
            // This ensures ALL parameters from debug info are included in generated code
            
            // Collect enforce_paymethod from checked payment method checkboxes
            const paymethodCheckboxes = document.querySelectorAll('input[name="' + prefix + '_paymethod"]:checked');
            if (paymethodCheckboxes.length > 0) {
                const selectedPaymethods = [];
                paymethodCheckboxes.forEach(checkbox => {
                    let paymethodValue;
                    const id = checkbox.id.replace(prefix + '_', '');
                    
                    // Handle different flow types
                    if ((flow === 'crossborder' && currentPaymentType === 'subscription') || flow === 'subscription') {
                        // Subscription payment methods (enach for NB)
                        switch (id) {
                            case 'nb': paymethodValue = 'enach'; break;
                            case 'cc': paymethodValue = 'creditcard'; break;
                            case 'dc': paymethodValue = 'debitcard'; break;
                            case 'upi': paymethodValue = 'upi'; break;
                            default: paymethodValue = checkbox.value.toLowerCase();
                        }
                    } else {
                        // One-time payment methods (use proper PayU format)
                        switch (id) {
                            case 'nb': paymethodValue = 'netbanking'; break;
                            case 'cc': paymethodValue = 'creditcard'; break;
                            case 'dc': paymethodValue = 'debitcard'; break;
                            case 'upi': paymethodValue = 'upi'; break;
                            default: paymethodValue = checkbox.value.toLowerCase();
                        }
                    }
                    selectedPaymethods.push(paymethodValue);
                });
                
                if (selectedPaymethods.length > 0) {
                    params.enforce_paymethod = selectedPaymethods.join('|');
                }
            }
            
            // Add offer_key for bank offers (if not already added)
            if (flow === 'bankoffer' && flowSpecific.offerKey && !params.offer_key) {
                params.offer_key = flowSpecific.offerKey;
            }
            
            // Collect any other optional hidden fields that might be set
            const hiddenFields = ['pg', 'api_version', 'drop_category', 'card_num'];
            hiddenFields.forEach(fieldName => {
                const field = document.getElementById(prefix + '_' + fieldName);
                if (field && field.value) {
                    params[fieldName] = field.value;
                }
            });
            
            // Add buyer_type_business to params for cross border (if present)
            if (flow === 'crossborder' && flowSpecific.buyerTypeBusiness !== undefined) {
                params.buyer_type_business = flowSpecific.buyerTypeBusiness;
            }
            
            // Add udf_params for cross border (if enabled)
            if (flow === 'crossborder') {
                let udfParamsJson = '';
                
                // Check which checkbox is enabled based on payment type
                if (currentPaymentType === 'subscription') {
                    const enableUdfParams = document.getElementById('cb_sub_enable_udf_params')?.checked;
                    if (enableUdfParams) {
                        const udf7 = document.getElementById('cb_sub_udf7_input')?.value || '';
                        const udf8 = document.getElementById('cb_sub_udf8_input')?.value || '';
                        
                        if (udf7 || udf8) {
                            const udfParamsObj = {};
                            if (udf7) udfParamsObj.udf7 = udf7;
                            if (udf8) udfParamsObj.udf8 = udf8;
                            udfParamsJson = JSON.stringify(udfParamsObj);
                        }
                    }
                } else {
                    // One-time payment
                    const enableUdfParams = document.getElementById('cb_enable_udf_params')?.checked;
                    if (enableUdfParams) {
                        const udf7 = document.getElementById('cb_udf7_input')?.value || '';
                        const udf8 = document.getElementById('cb_udf8_input')?.value || '';
                        
                        if (udf7 || udf8) {
                            const udfParamsObj = {};
                            if (udf7) udfParamsObj.udf7 = udf7;
                            if (udf8) udfParamsObj.udf8 = udf8;
                            udfParamsJson = JSON.stringify(udfParamsObj);
                        }
                    }
                }
                
                // Add to params if we have udf_params
                if (udfParamsJson) {
                    params.udf_params = udfParamsJson;
                    console.log('✓ Cross Border udf_params collected for code generation:', udfParamsJson);
                }
            }
            
            // Add si_details to params for subscription flows (if present)
            if (flowSpecific.hasSubscription) {
                // Generate si_details JSON
                const siDetailsData = {
                    billingAmount: flowSpecific.billingAmount,
                    billingCurrency: 'INR',
                    billingCycle: flowSpecific.billingCycle,
                    billingInterval: parseInt(flowSpecific.billingInterval),
                    paymentStartDate: flowSpecific.paymentStartDate
                };
                
                // Add paymentEndDate if present
                if (flowSpecific.paymentEndDate) {
                    siDetailsData.paymentEndDate = flowSpecific.paymentEndDate;
                }
                
                params.si_details = JSON.stringify(siDetailsData);
                
                // Add mandatory subscription parameters
                params.si = '1';
                params.api_version = '7';
            }
            
            // Add beneficiarydetail to params for TPV flows (if present)
            if (flowSpecific.hasBeneficiary) {
                const beneficiaryData = {
                    beneficiaryAccountNumber: flowSpecific.beneficiaryAccount,
                    ifscCode: flowSpecific.ifscCode
                };
                params.beneficiarydetail = JSON.stringify(beneficiaryData);
                
                // Add mandatory TPV parameter
                params.api_version = '6';
            }
            
            // Add si_details for UPI OTM (if present)
            if (flowSpecific.hasUPIOTM) {
                const upiOtmData = {
                    paymentStartDate: flowSpecific.paymentStartDate,
                    paymentEndDate: flowSpecific.paymentEndDate
                };
                params.si_details = JSON.stringify(upiOtmData);
                
                // Add mandatory UPI OTM parameters
                params.api_version = '7';
                params.pre_authorize = '1';
            }
            
            // Add cart_details and api_version for Bank Offers with SKU (if present)
            if (flowSpecific.hasBankOffer && flowSpecific.hasCartDetails) {
                params.cart_details = flowSpecific.cartDetails;
                
                // Add mandatory api_version for Bank Offer SKU
                params.api_version = '19';
                
                console.log('✓ Bank Offer SKU params added to code generation:');
                console.log('  - api_version: 19');
                console.log('  - cart_details: ' + (flowSpecific.cartDetails.length > 100 ? flowSpecific.cartDetails.substring(0, 100) + '...' : flowSpecific.cartDetails));
            }
            
            // Add flow metadata
            params._flow = flow;
            params._flowSpecific = flowSpecific;
            
            return params;
        }
        
        // Get Flow-Specific Hash Logic Metadata
        function getFlowHashMetadata(flow, params) {
            const flowSpec = params._flowSpecific || {};
            const metadata = {
                hashType: 'standard',
                hashComponents: ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'salt'],
                requiresJSON: false,
                jsonField: null,
                jsonData: null,
                additionalComponents: {}
            };
            
            // Subscription flow (Non-Seamless Subscription)
            // This applies to both flow='subscription' and flow='crossborder' with type='subscription'
            // However, crossborder subscription will be overridden below if buyer_type_business is present
            if (flowSpec.hasSubscription) {
                metadata.hashType = 'subscription';
                metadata.requiresJSON = true;
                metadata.jsonField = 'si_details';
                metadata.jsonData = {
                    billingAmount: flowSpec.billingAmount || params.amount,
                    billingCurrency: 'INR',
                    billingCycle: flowSpec.billingCycle || 'MONTHLY',
                    billingInterval: parseInt(flowSpec.billingInterval) || 1,
                    paymentStartDate: flowSpec.paymentStartDate || '',
                    paymentEndDate: flowSpec.paymentEndDate || ''
                };
                // Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT
                metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'si_details', 'salt'];
            }
            
            // TPV flow
            if (flowSpec.hasBeneficiary) {
                metadata.hashType = 'tpv';
                metadata.requiresJSON = true;
                metadata.jsonField = 'beneficiarydetail';
                metadata.jsonData = {
                    beneficiaryAccountNumber: flowSpec.beneficiaryAccount || '',
                    ifscCode: flowSpec.ifscCode || ''
                };
                metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'beneficiarydetail', 'salt'];
            }
            
            // UPI OTM flow
            if (flowSpec.hasUPIOTM) {
                metadata.hashType = 'upiotm';
                metadata.requiresJSON = true;
                metadata.jsonField = 'si_details';
                metadata.jsonData = {
                    paymentStartDate: flowSpec.paymentStartDate || '',
                    paymentEndDate: flowSpec.paymentEndDate || ''
                };
                metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'si_details', 'salt'];
            }
            
            // Split Payment flow
            if (flowSpec.hasSplit) {
                metadata.hashType = 'split';
                metadata.requiresJSON = true;
                metadata.jsonField = 'splitRequest';
                metadata.jsonData = null; // Complex, will be handled separately
                metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'salt', 'splitRequest'];
                metadata.note = 'Split payment requires complex splitRequest JSON. Please configure child merchants.';
            }
            
            // Bank Offer flow
            if (flowSpec.hasBankOffer) {
                if (flowSpec.hasCartDetails) {
                    // Extended hash formula when cart_details is present
                    metadata.hashType = 'bankoffer_sku';
                    metadata.requiresJSON = true;
                    metadata.jsonField = 'cart_details';
                    metadata.jsonData = flowSpec.cartDetails;
                    metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'user_token', 'offer_key', 'offer_auto_apply', 'cart_details', 'extra_charges', 'phone', 'salt'];
                    metadata.additionalComponents = {
                        user_token: '',
                        offer_key: flowSpec.offerKey || '',
                        offer_auto_apply: '',
                        extra_charges: '',
                        phone: flowSpec.phone || ''
                    };
                } else {
                    // Standard hash formula when cart_details is not present
                    metadata.hashType = 'bankoffer_standard';
                    metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'salt'];
                }
            }
            
            // Cross Border with buyer_type_business and/or udf_params
            // This overrides the 'subscription' hashType set above to 'crossborder_subscription'
            // ONLY when buyer_type_business or udf_params parameter is present (cross border flow)
            if (flowSpec.buyerTypeBusiness !== undefined || params.udf_params) {
                const hasUdfParams = !!params.udf_params;
                const hasBuyerType = flowSpec.buyerTypeBusiness !== undefined;
                
                // Determine hash type based on what parameters are present
                if (flowSpec.hasSubscription) {
                    metadata.hashType = 'crossborder_subscription';
                    if (hasUdfParams && hasBuyerType) {
                        // Cross Border Subscription: Hash includes both udf_params and buyer_type_business
                        // Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT|udf_params|buyer_type_business
                        metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'si_details', 'salt', 'udf_params', 'buyer_type_business'];
                        metadata.additionalComponents.udf_params = params.udf_params;
                    } else if (hasUdfParams) {
                        // Cross Border Subscription: Hash includes only udf_params
                        // Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT|udf_params
                        metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'si_details', 'salt', 'udf_params'];
                        metadata.additionalComponents.udf_params = params.udf_params;
                    } else {
                        // Cross Border Subscription: Hash includes only buyer_type_business (backward compatible)
                    // Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT|buyer_type_business
                    metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'si_details', 'salt', 'buyer_type_business'];
                    }
                } else {
                    metadata.hashType = 'crossborder';
                    if (hasUdfParams && hasBuyerType) {
                        // Cross Border One-Time: Hash includes both udf_params and buyer_type_business
                        // Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||SALT|udf_params|buyer_type_business
                        metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'salt', 'udf_params', 'buyer_type_business'];
                        metadata.additionalComponents.udf_params = params.udf_params;
                    } else if (hasUdfParams) {
                        // Cross Border One-Time: Hash includes only udf_params
                        // Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||SALT|udf_params
                        metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'salt', 'udf_params'];
                        metadata.additionalComponents.udf_params = params.udf_params;
                    } else {
                        // Cross Border One-Time: Hash includes only buyer_type_business (backward compatible)
                    // Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||SALT|buyer_type_business
                    metadata.hashComponents = ['key', 'txnid', 'amount', 'productinfo', 'firstname', 'email', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5', '', '', '', '', '', '', 'salt', 'buyer_type_business'];
                    }
                }
            }
            
            return metadata;
        }
        
        // Generate and Display Code
        function generateAndDisplayCode(flow, language) {
            console.log('[DEBUG] generateAndDisplayCode called');
            console.log('[DEBUG] flow parameter:', flow);
            console.log('[DEBUG] flow type:', typeof flow);
            console.log('[DEBUG] flow length:', flow ? flow.length : 'flow is falsy');
            console.log('[DEBUG] language:', language);
            console.log('[DEBUG] currentGeneratedParams:', currentGeneratedParams);
            console.log('[DEBUG] currentGeneratedParams keys:', Object.keys(currentGeneratedParams));
            
            let code = '';
            
            switch(language) {
                case 'java':
                    code = generateJavaCode(flow, currentGeneratedParams);
                    break;
                case 'php':
                    code = generatePHPCode(flow, currentGeneratedParams);
                    break;
                case 'python':
                    code = generatePythonCode(flow, currentGeneratedParams);
                    break;
                case 'nodejs':
                    code = generateNodeJSCode(flow, currentGeneratedParams);
                    break;
            }
            
            console.log('[DEBUG] Generated code length:', code ? code.length : 0);
            console.log('[DEBUG] Generated code first 500 chars:', code ? code.substring(0, 500) : 'No code generated');
            
            document.getElementById('generatedCodePreview').textContent = code;
        }
        
        // Copy Generated Code
        function copyGeneratedCode() {
            const code = document.getElementById('generatedCodePreview').textContent;
            navigator.clipboard.writeText(code).then(function() {
                alert('Code copied to clipboard successfully!');
                console.log('Code copied successfully');
            }).catch(function(err) {
                console.error('Failed to copy code:', err);
                alert('Failed to copy code. Please copy manually.');
            });
        }
        
        // Download Generated Code
        function downloadGeneratedCode() {
            const code = document.getElementById('generatedCodePreview').textContent;
            const extensions = {
                'java': 'java',
                'php': 'php',
                'python': 'py',
                'nodejs': 'js'
            };
            const ext = extensions[currentGeneratedLanguage];
            const filename = `PayUIntegration.${ext}`;
            
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('Code downloaded as:', filename);
        }
        
        // ============================================
        // CODE TEMPLATES
        // ============================================
        
        /*
         * CODE GENERATION FLOW DOCUMENTATION
         * ==================================
         * 
         * SUBSCRIPTION FLOWS:
         * -------------------
         * 
         * 1. NON-SEAMLESS SUBSCRIPTION (flow='subscription')
         *    - Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT
         *    - Does NOT include buyer_type_business in hash or body parameters
         *    - Parameters: si=1, api_version=7, si_details (JSON)
         *    - hashType: 'subscription'
         * 
         * 2. CROSS BORDER SUBSCRIPTION (flow='crossborder' + paymentType='subscription')
         *    - Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT|buyer_type_business
         *    - INCLUDES buyer_type_business in hash and body parameters
         *    - Parameters: si=1, api_version=7, si_details (JSON), buyer_type_business
         *    - hashType: 'crossborder_subscription'
         * 
         * Both flows share the same subscription configuration:
         * - si_details structure (billingAmount, billingCurrency, billingCycle, billingInterval, paymentStartDate, paymentEndDate)
         * - Billing cycle and interval parameters
         * - Payment start/end date parameters
         * 
         * TPV FLOW (Third Party Verification):
         * ------------------------------------
         * 
         * TPV PAYMENT (flow='tpv')
         *    - Hash: key|txnid|amount|productinfo|firstname|email|udf1-5||||||beneficiarydetail|SALT
         *    - Parameters: api_version=6, beneficiarydetail (JSON)
         *    - beneficiarydetail structure: {"beneficiaryAccountNumber":"xxx","ifscCode":"xxx"}
         *    - hashType: 'tpv'
         * 
         * MULTIPLE BENEFICIARY ACCOUNTS (TPV):
         * - Supports up to 4 beneficiary accounts
         * - Separate multiple accounts with pipe (|) symbol
         * - Account numbers and IFSC codes must be in the same order
         * - Example single: "919013353419388" and "UTIB9992478"
         * - Example multiple: "919013353419388|account2|account3" and "UTIB9992478|IFSC2|IFSC3"
         * 
         * The code generation templates below handle all flows correctly by checking the hashType.
         */
        
        function generateJavaCode(flow, params) {
            console.log('[DEBUG] generateJavaCode called with flow:', flow);
            console.log('[DEBUG] generateJavaCode params:', params);
            
            // Get flow-specific hash metadata
            const hashMetadata = getFlowHashMetadata(flow, params);
            const flowSpec = params._flowSpecific || {};
            
            console.log('[DEBUG] hashMetadata:', hashMetadata);
            
            // Build params assignment with values from form
            // Filter out JSON fields that will be generated by helper methods (si_details, beneficiarydetail, cart_details, splitRequest)
            // Also filter out subscription-only params (api_version, si, pre_authorize) for flows that don't need them
            const jsonFieldsToSkip = ['si_details', 'beneficiarydetail', 'cart_details', 'splitRequest'];
            const subscriptionOnlyParams = ['api_version', 'si', 'pre_authorize'];
            const paramsStr = Object.entries(params)
                .filter(([key]) => {
                    // Skip internal fields and txnid
                    if (key.startsWith('_') || key === 'txnid') return false;
                    // Skip JSON fields that will be generated by helper methods
                    if (jsonFieldsToSkip.includes(key)) return false;
                    // Skip subscription-only params for flows that don't need them
                    if (!flowSpec.hasSubscription && !flowSpec.hasUPIOTM && !flowSpec.isPreauth && !flowSpec.hasCartDetails && subscriptionOnlyParams.includes(key)) return false;
                    // Skip 'si' for TPV, UPI OTM, PreAuth, and Bank Offer flows
                    if ((flowSpec.hasBeneficiary || flowSpec.hasUPIOTM || flowSpec.isPreauth || flowSpec.hasBankOffer) && key === 'si') return false;
                    // Skip 'pre_authorize' for flows that don't need it
                    if (!flowSpec.hasUPIOTM && !flowSpec.isPreauth && key === 'pre_authorize') return false;
                    // Skip 'api_version' for PreAuth and non-SKU Bank Offers (only UPI OTM, subscriptions, and SKU Bank Offers need it)
                    if (flowSpec.isPreauth && key === 'api_version') return false;
                    if (flowSpec.hasBankOffer && !flowSpec.hasCartDetails && key === 'api_version') return false;
                    // Skip 'api_version' and 'offer_key' for SKU Bank Offers (they're added in jsonParamCode)
                    if (flowSpec.hasCartDetails && (key === 'api_version' || key === 'offer_key')) return false;
                    return true;
                }) // Skip internal, txnid, and JSON fields
                .map(([key, value]) => {
                    // Escape special characters for Java strings
                    const escapedValue = String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
                    return '        params.put("' + key + '", "' + escapedValue + '");';
                })
                .join('\n');
            
            console.log('[DEBUG] paramsStr length:', paramsStr.length);
            console.log('[DEBUG] paramsStr:', paramsStr);
            
            // Generate JSON-related code if needed
            let jsonImports = '';
            let jsonMethodCode = '';
            let jsonParamCode = '';
            
            // Handle Split Payment separately (like PHP, Python, NodeJS) - OUTSIDE the main JSON block
            if (flowSpec.hasSplit) {
                // Split Payment - Generate helper method for splitRequest JSON
                const splitMerchants = flowSpec.splitMerchants || [];
                
                // Build split merchant initialization code
                let splitMerchantCode = '';
                splitMerchants.forEach((merchant, index) => {
                    splitMerchantCode += `
        // Child Merchant ${index + 1}: ${merchant.merchantKey}
        Map<String, String> child${index + 1} = new HashMap<>();
        child${index + 1}.put("txnId", "${merchant.txnId}");
        child${index + 1}.put("amount", "${merchant.amount}");
        child${index + 1}.put("charges", "${merchant.charges}");
        splitInfo.put("${merchant.merchantKey}", child${index + 1});
`;
                });
                
                const jsonMethodBody = `        int count = 0;
        for (Map.Entry<String, Map<String, String>> entry : splitInfo.entrySet()) {
            if (count > 0) json.append(",");
            json.append("\\"").append(entry.getKey()).append("\\":{");
            Map<String, String> details = entry.getValue();
            json.append("\\"aggregatorSubTxnId\\":\\"").append(details.get("txnId")).append("\\",");
            json.append("\\"aggregatorSubAmt\\":\\"").append(details.get("amount")).append("\\",");
            json.append("\\"aggregatorCharges\\":\\"").append(details.get("charges")).append("\\"");
            json.append("}");
            count++;
        }`;
                
                jsonMethodCode = '\n    /**\n' +
                                 '     * Generate splitRequest JSON for Split Payment\n' +
                                 '     * \n' +
                                 '     * This method builds a properly formatted splitRequest JSON with child merchant details.\n' +
                                 '     * Supports both absolute (amount in INR) and percentage-based splits.\n' +
                                 '     * \n' +
                                 '     * @param type split type - "absolute" for amount-based or "percentage" for percentage-based\n' +
                                 '     * @param splitInfo map of merchant keys to their split details (txnId, amount, charges)\n' +
                                 '     * @return String JSON representation of splitRequest\n' +
                                 '     */\n' +
                                 '    public static String generateSplitRequest(String type, Map<String, Map<String, String>> splitInfo) {\n' +
                                 '        // Note: For production use, consider using a JSON library like Gson or Jackson\n' +
                                 '        StringBuilder json = new StringBuilder();\n' +
                                 '        json.append("{\\"type\\":\\"").append(type).append("\\",");\n' +
                                 '        json.append("\\"splitInfo\\":{");\n' +
                                 jsonMethodBody + '\n' +
                                 '        json.append("}}");\n' +
                                 '        return json.toString();\n' +
                                 '    }\n';
                
                jsonParamCode = `
        // Build split merchants data
        Map<String, Map<String, String>> splitInfo = new HashMap<>();${splitMerchantCode}
        // Generate splitRequest JSON
        String splitRequest = generateSplitRequest("${flowSpec.splitType}", splitInfo);
        params.put("splitRequest", splitRequest);
`;
            } else if (hashMetadata.requiresJSON && hashMetadata.jsonData) {
                // Build JSON method body based on flow type
                let jsonMethodBody = '';
                if (flowSpec.hasSubscription) {
                    jsonMethodBody = '        json.append("\\"billingAmount\\":\\"").append(billingAmount).append("\\",");\n' +
                                     '        json.append("\\"billingCurrency\\":\\"INR\\",");\n' +
                                     '        json.append("\\"billingCycle\\":\\"").append(billingCycle).append("\\",");\n' +
                                     '        json.append("\\"billingInterval\\":").append(billingInterval).append(",");\n' +
                                     '        json.append("\\"paymentStartDate\\":\\"").append(paymentStartDate).append("\\"");\n' +
                                     '        if (paymentEndDate != null && !paymentEndDate.isEmpty()) {\n' +
                                     '            json.append(",\\"paymentEndDate\\":\\"").append(paymentEndDate).append("\\"");\n' +
                                     '        }';
                } else if (flowSpec.hasBeneficiary) {
                    jsonMethodBody = '        json.append("\\"beneficiaryAccountNumber\\":\\"").append(beneficiaryAccount).append("\\",");\n' +
                                     '        json.append("\\"ifscCode\\":\\"").append(ifscCode).append("\\"");';
                } else if (flowSpec.hasUPIOTM) {
                    jsonMethodBody = '        json.append("\\"paymentStartDate\\":\\"").append(paymentStartDate).append("\\",");\n' +
                                     '        json.append("\\"paymentEndDate\\":\\"").append(paymentEndDate).append("\\"");';
                }
                
                const methodParams = flowSpec.hasSubscription ? ', String billingAmount, String billingCycle, int billingInterval, String paymentStartDate, String paymentEndDate' : 
                                    flowSpec.hasBeneficiary ? ', String beneficiaryAccount, String ifscCode' : 
                                    flowSpec.hasUPIOTM ? ', String paymentStartDate, String paymentEndDate' : '';
                
                // Convert snake_case to CamelCase for method name (e.g., si_details -> SiDetails)
                const methodName = hashMetadata.jsonField
                    .split('_')
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                    .join('');
                
                // Build proper JavaDoc based on flow type
                let javaDocParams = '';
                if (flowSpec.hasSubscription) {
                    javaDocParams += '     * @param billingAmount billing amount to be charged per cycle\n' +
                                    '     * @param billingCycle billing cycle (MONTHLY, YEARLY, etc.)\n' +
                                    '     * @param billingInterval billing interval\n' +
                                    '     * @param paymentStartDate payment start date in YYYY-MM-DD format\n' +
                                    '     * @param paymentEndDate payment end date in YYYY-MM-DD format (can be null)\n';
                } else if (flowSpec.hasBeneficiary) {
                    javaDocParams += '     * @param beneficiaryAccount beneficiary account number(s) - supports up to 4 accounts separated by pipe (|)\n' +
                                    '     * @param ifscCode IFSC code(s) - must match account count and order, separated by pipe (|)\n' +
                                    '     * \n' +
                                    '     * Example single account: "919013353419388" and "UTIB9992478"\n' +
                                    '     * Example multiple accounts: "919013353419388|account2|account3" and "UTIB9992478|IFSC2|IFSC3"\n';
                } else if (flowSpec.hasUPIOTM) {
                    javaDocParams += '     * @param paymentStartDate payment start date in YYYY-MM-DD format\n' +
                                    '     * @param paymentEndDate payment end date in YYYY-MM-DD format\n';
                }
                
                jsonMethodCode = '\n    /**\n' +
                                 '     * Generate ' + hashMetadata.jsonField + ' JSON\n' +
                                 javaDocParams +
                                 '     * @return String JSON representation of ' + hashMetadata.jsonField + '\n' +
                                 '     */\n' +
                                 '    public static String generate' + methodName + '(' + (methodParams ? methodParams.substring(2) : '') + ') {\n' +
                                 '        // Note: For production use, consider using a JSON library like Gson or Jackson\n' +
                                 '        StringBuilder json = new StringBuilder();\n' +
                                 '        json.append("{");\n' +
                                 jsonMethodBody + '\n' +
                                 '        json.append("}");\n' +
                                 '        return json.toString();\n' +
                                 '    }\n';
                
                if (flowSpec.hasSubscription) {
                    jsonParamCode = `
        // Generate SI Details JSON
        String siDetails = generate${methodName}("${flowSpec.billingAmount}", "${flowSpec.billingCycle}", ${flowSpec.billingInterval}, "${flowSpec.paymentStartDate}", "${flowSpec.paymentEndDate}");
        params.put("si_details", siDetails);
`;
                } else if (flowSpec.hasBeneficiary) {
                    jsonParamCode = `
        // Generate Beneficiary Detail JSON
        String beneficiaryDetail = generate${methodName}("${flowSpec.beneficiaryAccount}", "${flowSpec.ifscCode}");
        params.put("beneficiarydetail", beneficiaryDetail);
        
        // TPV (Third Party Verification) requires api_version = 6
        params.put("api_version", "6");
`;
                } else if (flowSpec.hasUPIOTM) {
                    jsonParamCode = `
        // Generate SI Details JSON for UPI OTM
        String siDetails = generate${methodName}("${flowSpec.paymentStartDate}", "${flowSpec.paymentEndDate}");
        params.put("si_details", siDetails);
        
        // UPI OTM mandatory parameters
        params.put("api_version", "7");
        params.put("pre_authorize", "1");
`;
                } else if (flowSpec.hasCartDetails) {
                    // Bank Offer with SKU/cart_details - Generate helper method similar to subscription
                    const cartData = JSON.parse(flowSpec.cartDetails);
                    
                    // Build SKU details array code
                    let skuArrayCode = '';
                    cartData.sku_details.forEach((sku, index) => {
                        // Handle offer_key properly - array of strings or null
                        let offerKeyCode;
                        if (sku.offer_key && Array.isArray(sku.offer_key) && sku.offer_key.length > 0) {
                            const offerKeys = sku.offer_key.map(k => `\\"${k}\\"`).join(',');
                            offerKeyCode = `"[${offerKeys}]"`;
                        } else {
                            offerKeyCode = '"null"';
                        }
                        
                        skuArrayCode += `
        // SKU Item ${index + 1}: ${sku.sku_name}
        skuItem = new StringBuilder();
        skuItem.append("{\\"sku_id\\":\\"").append("${sku.sku_id}").append("\\",");
        skuItem.append("\\"sku_name\\":\\"").append("${sku.sku_name}").append("\\",");
        skuItem.append("\\"amount_per_sku\\":").append(${sku.amount_per_sku}).append(",");
        skuItem.append("\\"quantity\\":").append(${sku.quantity}).append(",");
        skuItem.append("\\"offer_key\\":").append(${offerKeyCode}).append(",");
        skuItem.append("\\"offer_auto_apply\\":").append(${sku.offer_auto_apply}).append("}");
        skuDetails.add(skuItem.toString());
`;
                    });
                    
                    jsonMethodBody = `        List<String> skuDetails = new ArrayList<>();
        StringBuilder skuItem;
${skuArrayCode}
        // Build cart details JSON
        json.append("\\"amount\\":").append(amount).append(",");
        json.append("\\"items\\":").append(items).append(",");
        json.append("\\"surcharges\\":\\"").append(surcharges).append("\\",");
        json.append("\\"pre_discount\\":").append(preDiscount).append(",");
        json.append("\\"sku_details\\":[");
        json.append(String.join(",", skuDetails));
        json.append("]");`;
                    
                    jsonMethodCode = '\n    /**\n' +
                                     '     * Generate cart_details JSON for Bank Offer with SKU\n' +
                                     '     * \n' +
                                     '     * This method builds a properly formatted cart_details JSON with SKU information.\n' +
                                     '     * SKU items include product details, quantities, and offer configurations.\n' +
                                     '     * \n' +
                                     '     * @param amount total cart amount\n' +
                                     '     * @param items total number of items in cart\n' +
                                     '     * @param surcharges additional surcharges as string (can be empty "")\n' +
                                     '     * @param preDiscount pre-discount amount applied before bank offers\n' +
                                     '     * @return String JSON representation of cart_details\n' +
                                     '     */\n' +
                                     '    public static String generateCartDetails(String amount, int items, String surcharges, double preDiscount) {\n' +
                                     '        // Note: For production, consider using a JSON library like Gson or Jackson\n' +
                                     '        StringBuilder json = new StringBuilder();\n' +
                                     '        json.append("{");\n' +
                                     jsonMethodBody + '\n' +
                                     '        json.append("}");\n' +
                                     '        return json.toString();\n' +
                                     '    }\n';
                    
                    const offerKeyParam = hashMetadata.additionalComponents.offer_key ? `\n        params.put("offer_key", "${hashMetadata.additionalComponents.offer_key}");` : '';
                    
                    jsonParamCode = `
        // Generate Cart Details JSON for Bank Offer with SKU
        String cartDetails = generateCartDetails("${cartData.amount}", ${cartData.items}, "${cartData.surcharges}", ${cartData.pre_discount});
        params.put("cart_details", cartDetails);
        
        // Bank Offer with SKU requires api_version = 19
        params.put("api_version", "19");${offerKeyParam}
`;
                }
            }
            
            // Generate hash string building code based on flow
            let hashStringCode = '';
            if (hashMetadata.hashType === 'standard') {
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           MERCHANT_SALT;';
            } else if (hashMetadata.hashType === 'subscription' || hashMetadata.hashType === 'upiotm') {
                // Non-Seamless Subscription or UPI OTM: Hash WITHOUT buyer_type_business
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           params.get("si_details") + "|" +\n' +
                           '                           MERCHANT_SALT;';
            } else if (hashMetadata.hashType === 'tpv') {
                // TPV (Third Party Verification): Hash with beneficiarydetail JSON
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||beneficiarydetail|SALT
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           params.get("beneficiarydetail") + "|" +\n' +
                           '                           MERCHANT_SALT;';
            } else if (hashMetadata.hashType === 'bankoffer_sku') {
                // Bank Offer with SKU/cart_details - Extended hash formula
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           params.getOrDefault("user_token", "") + "|" +\n' +
                           '                           params.getOrDefault("offer_key", "") + "|" +\n' +
                           '                           params.getOrDefault("offer_auto_apply", "") + "|" +\n' +
                           '                           params.getOrDefault("cart_details", "") + "|" +\n' +
                           '                           params.getOrDefault("extra_charges", "") + "|" +\n' +
                           '                           params.getOrDefault("phone", "") + "|" +\n' +
                           '                           MERCHANT_SALT;';
            } else if (hashMetadata.hashType === 'bankoffer_standard') {
                // Bank Offer without SKU - Standard hash formula
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           MERCHANT_SALT;';
            } else if (hashMetadata.hashType === 'split') {
                // Split Payment: Hash with splitRequest at the end
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||SALT|splitRequest
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           MERCHANT_SALT + "|" +\n' +
                           '                           params.get("splitRequest");';
            } else if (hashMetadata.hashType === 'crossborder') {
                // Cross Border One-Time - Check for udf_params and buyer_type_business
                const hasUdfParams = params.udf_params !== undefined;
                const hasBuyerType = params.buyer_type_business !== undefined;
                
                if (hasUdfParams && hasBuyerType) {
                    // With both udf_params and buyer_type_business
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           MERCHANT_SALT + "|" +\n' +
                               '                           params.get("udf_params") + "|" +\n' +
                           '                           params.get("buyer_type_business");';
                } else if (hasUdfParams) {
                    // With only udf_params
                    hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                               '                           params.get("txnid") + "|" +\n' +
                               '                           params.get("amount") + "|" +\n' +
                               '                           params.get("productinfo") + "|" +\n' +
                               '                           params.get("firstname") + "|" +\n' +
                               '                           params.get("email") + "|" +\n' +
                               '                           params.getOrDefault("udf1", "") + "|" +\n' +
                               '                           params.getOrDefault("udf2", "") + "|" +\n' +
                               '                           params.getOrDefault("udf3", "") + "|" +\n' +
                               '                           params.getOrDefault("udf4", "") + "|" +\n' +
                               '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                               '                           MERCHANT_SALT + "|" +\n' +
                               '                           params.get("udf_params");';
                } else {
                    // With only buyer_type_business (backward compatible)
                    hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                               '                           params.get("txnid") + "|" +\n' +
                               '                           params.get("amount") + "|" +\n' +
                               '                           params.get("productinfo") + "|" +\n' +
                               '                           params.get("firstname") + "|" +\n' +
                               '                           params.get("email") + "|" +\n' +
                               '                           params.getOrDefault("udf1", "") + "|" +\n' +
                               '                           params.getOrDefault("udf2", "") + "|" +\n' +
                               '                           params.getOrDefault("udf3", "") + "|" +\n' +
                               '                           params.getOrDefault("udf4", "") + "|" +\n' +
                               '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                               '                           MERCHANT_SALT + "|" +\n' +
                               '                           params.get("buyer_type_business");';
                }
            } else if (hashMetadata.hashType === 'crossborder_subscription') {
                // Cross Border Subscription - Check for udf_params and buyer_type_business
                const hasUdfParams = params.udf_params !== undefined;
                const hasBuyerType = params.buyer_type_business !== undefined;
                
                if (hasUdfParams && hasBuyerType) {
                    // With both udf_params and buyer_type_business
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           params.get("si_details") + "|" +\n' +
                           '                           MERCHANT_SALT + "|" +\n' +
                               '                           params.get("udf_params") + "|" +\n' +
                           '                           params.get("buyer_type_business");';
                } else if (hasUdfParams) {
                    // With only udf_params
                    hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                               '                           params.get("txnid") + "|" +\n' +
                               '                           params.get("amount") + "|" +\n' +
                               '                           params.get("productinfo") + "|" +\n' +
                               '                           params.get("firstname") + "|" +\n' +
                               '                           params.get("email") + "|" +\n' +
                               '                           params.getOrDefault("udf1", "") + "|" +\n' +
                               '                           params.getOrDefault("udf2", "") + "|" +\n' +
                               '                           params.getOrDefault("udf3", "") + "|" +\n' +
                               '                           params.getOrDefault("udf4", "") + "|" +\n' +
                               '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                               '                           params.get("si_details") + "|" +\n' +
                               '                           MERCHANT_SALT + "|" +\n' +
                               '                           params.get("udf_params");';
                } else {
                    // With only buyer_type_business (backward compatible)
                    hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                               '                           params.get("txnid") + "|" +\n' +
                               '                           params.get("amount") + "|" +\n' +
                               '                           params.get("productinfo") + "|" +\n' +
                               '                           params.get("firstname") + "|" +\n' +
                               '                           params.get("email") + "|" +\n' +
                               '                           params.getOrDefault("udf1", "") + "|" +\n' +
                               '                           params.getOrDefault("udf2", "") + "|" +\n' +
                               '                           params.getOrDefault("udf3", "") + "|" +\n' +
                               '                           params.getOrDefault("udf4", "") + "|" +\n' +
                               '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                               '                           params.get("si_details") + "|" +\n' +
                               '                           MERCHANT_SALT + "|" +\n' +
                               '                           params.get("buyer_type_business");';
                }
            } else {
                // Default to standard hash if no specific type matched
                hashStringCode = '        String hashString = MERCHANT_KEY + "|" +\n' +
                           '                           params.get("txnid") + "|" +\n' +
                           '                           params.get("amount") + "|" +\n' +
                           '                           params.get("productinfo") + "|" +\n' +
                           '                           params.get("firstname") + "|" +\n' +
                           '                           params.get("email") + "|" +\n' +
                           '                           params.getOrDefault("udf1", "") + "|" +\n' +
                           '                           params.getOrDefault("udf2", "") + "|" +\n' +
                           '                           params.getOrDefault("udf3", "") + "|" +\n' +
                           '                           params.getOrDefault("udf4", "") + "|" +\n' +
                           '                           params.getOrDefault("udf5", "") + "||||||" +\n' +
                           '                           MERCHANT_SALT;';
            }
            
            const flowName = flow.charAt(0).toUpperCase() + flow.slice(1);
            const hashNote = hashMetadata.note ? '\n * NOTE: ' + hashMetadata.note : '';
            
            console.log('[DEBUG] flowName:', flowName);
            console.log('[DEBUG] hashMetadata.hashType:', hashMetadata.hashType);
            console.log('[DEBUG] Using STRING CONCATENATION instead of template literals');
            
            const generatedCode = 'import java.io.*;\n' +
'import java.net.*;\n' +
'import java.security.MessageDigest;\n' +
'import java.util.*;\n' +
'\n' +
'/**\n' +
' * PayU Integration - ' + flowName + ' Flow\n' +
' * Generated by PayU Payment Hub' + hashNote + '\n' +
' * \n' +
' * Instructions:\n' +
' * 1. Replace YOUR_MERCHANT_KEY with your actual PayU merchant key\n' +
' * 2. Replace YOUR_MERCHANT_SALT with your actual PayU merchant salt\n' +
' * 3. Compile: javac PayUIntegration.java\n' +
' * 4. Run: java PayUIntegration\n' +
' * 5. The program will print HTML code to console - copy and save as .html file\n' +
' * 6. Open the HTML file in a browser to complete payment (auto-redirects to PayU)\n' +
' * \n' +
' * Flow Type: ' + flowName + '\n' +
' * Hash Type: ' + hashMetadata.hashType + '\n' +
' */\n' +
'public class PayUIntegration {\n' +
'    \n' +
'    // REPLACE THESE WITH YOUR ACTUAL CREDENTIALS\n' +
'    private static final String MERCHANT_KEY = "YOUR_MERCHANT_KEY";\n' +
'    private static final String MERCHANT_SALT = "YOUR_MERCHANT_SALT";\n' +
'    private static final String PAYU_URL = "https://test.payu.in/_payment";\n' +
'    \n' +
'    /**\n' +
'     * Generate unique transaction ID with random component\n' +
'     * @return String unique transaction ID\n' +
'     */\n' +
'    public static String generateTransactionId() {\n' +
'        return "TXN" + System.currentTimeMillis() + (int)(Math.random() * 10000);\n' +
'    }\n' +
jsonMethodCode +
'    /**\n' +
'     * Generate SHA512 hash for payment parameters\n' +
'     * Hash Type: ' + hashMetadata.hashType + '\n' +
'     * \n' +
'     * NOTE: The hash formula reads values from the params map.\n' +
'     * If you modify parameter values in the code, the hash will automatically\n' +
'     * adapt to use the new values. This makes the code flexible and reusable.\n' +
'     * \n' +
'     * Hash Formula: ' + hashMetadata.hashComponents.join('|') + '\n' +
'     * \n' +
'     * @param params Map containing payment parameters\n' +
'     * @return String SHA512 hash\n' +
'     * @throws Exception if hash generation fails\n' +
'     */\n' +
'    public static String generateHash(Map<String, String> params) throws Exception {\n' +
'        // Build hash string in PayU format for ' + flowName + ' flow\n' +
hashStringCode + '\n' +
'        \n' +
'        // Print hash formula and raw string for debugging\n' +
'        System.out.println("\\nHash Formula:");\n' +
'        System.out.println("' + hashMetadata.hashComponents.join('|') + '");\n' +
'        \n' +
'        System.out.println("\\nRaw Hash String:");\n' +
'        System.out.println(hashString);\n' +
'        \n' +
'        // Generate SHA512 hash\n' +
'        MessageDigest md = MessageDigest.getInstance("SHA-512");\n' +
'        byte[] hash = md.digest(hashString.getBytes("UTF-8"));\n' +
'        \n' +
'        // Convert to hex string\n' +
'        StringBuilder hexString = new StringBuilder();\n' +
'        for (byte b : hash) {\n' +
'            String hex = Integer.toHexString(0xff & b);\n' +
'            if (hex.length() == 1) {\n' +
'                hexString.append(\'0\');\n' +
'            }\n' +
'            hexString.append(hex);\n' +
'        }\n' +
'        \n' +
'        return hexString.toString();\n' +
'    }\n' +
'    \n' +
'    /**\n' +
'     * Generate HTML form and display in console\n' +
'     * @throws Exception if hash generation fails\n' +
'     */\n' +
'    public static void initiatePayment() throws Exception {\n' +
'        // Payment parameters - prefilled from your form\n' +
'        Map<String, String> params = new LinkedHashMap<>();\n' +
'        params.put("key", MERCHANT_KEY);\n' +
'        \n' +
'        // Generate unique transaction ID with random component\n' +
'        params.put("txnid", generateTransactionId());\n' +
'        \n' +
paramsStr + '\n' +
jsonParamCode + '\n' +
'        \n' +
'        // Generate hash\n' +
'        String hash = generateHash(params);\n' +
'        params.put("hash", hash);\n' +
'        \n' +
'        // Create HTML form with auto-submit\n' +
'        StringBuilder html = new StringBuilder();\n' +
'        html.append("<!DOCTYPE html>\\n");\n' +
'        html.append("<html>\\n<head>\\n");\n' +
"        html.append(\"<meta charset='UTF-8'>\\n\");\n" +
'        html.append("<title>Redirecting to PayU...</title>\\n");\n' +
'        html.append("<style>\\n");\n' +
'        html.append("body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }\\n");\n' +
'        html.append("h3 { color: #333; }\\n");\n' +
'        html.append(".loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px auto; }\\n");\n' +
'        html.append("@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\\n");\n' +
'        html.append("</style>\\n");\n' +
'        html.append("</head>\\n");\n' +
"        html.append(\"<body onload='document.payuForm.submit()'>\\n\");\n" +
'        html.append("<h3>Please wait while we redirect you to PayU...</h3>\\n");\n' +
"        html.append(\"<div class='loader'></div>\\n\");\n" +
"        html.append(\"<form name='payuForm' method='post' action='\" + PAYU_URL + \"'>\\n\");\n" +
'        \n' +
'        for (Map.Entry<String, String> entry : params.entrySet()) {\n' +
"            html.append(\"  <input type='hidden' name='\" + entry.getKey() + \n" +
"                       \"' value='\" + entry.getValue() + \"' />\\n\");\n" +
'        }\n' +
'        \n' +
"        html.append(\"  <button type='submit' style='margin-top: 20px; padding: 10px 30px; font-size: 16px; cursor: pointer;'>Pay Now</button>\\n\");\n" +
'        html.append("</form>\\n");\n' +
'        html.append("</body>\\n</html>");\n' +
'        \n' +
'        System.out.println("\\nGenerated SHA512 Hash:");\n' +
'        System.out.println(hash);\n' +
'        \n' +
'        // Print HTML form\n' +
'        System.out.println("\\nHTML Payment Form:");\n' +
'        System.out.println(html.toString());\n' +
'        \n' +
'        // Print simple instructions\n' +
'        System.out.println("\\nInstructions:");\n' +
'        System.out.println("1. Copy the HTML code above");\n' +
'        System.out.println("2. Save it as payu_payment.html");\n' +
'        System.out.println("3. Open the file in a web browser");\n' +
'        System.out.println("4. The page will redirect to PayU payment gateway");\n' +
'    }\n' +
'    \n' +
'    /**\n' +
'     * Main method to run the PayU integration\n' +
'     * @param args command line arguments (not used)\n' +
'     */\n' +
'    public static void main(String[] args) {\n' +
'        try {\n' +
'            System.out.println("====================================");\n' +
'            System.out.println("   PayU Payment Integration");\n' +
'            System.out.println("   Flow: ' + flow.toUpperCase() + '");\n' +
'            System.out.println("====================================");\n' +
'            System.out.println("\\nInitiating payment...");\n' +
'            initiatePayment();\n' +
'        } catch (Exception e) {\n' +
'            System.err.println("\\n[ERROR] " + e.getMessage());\n' +
'            e.printStackTrace();\n' +
'        }\n' +
'    }\n' +
'}';
            
            console.log('[DEBUG] Generated code first 1000 chars:', generatedCode.substring(0, 1000));
            console.log('[DEBUG] Generated code length:', generatedCode.length);
            console.log('[DEBUG] Looking for "Flow Type:" in code:', generatedCode.includes('Flow Type:'));
            console.log('[DEBUG] Searching for flowName in generated code...');
            const flowTypeMatch = generatedCode.match(/Flow Type: (.*)/);
            if (flowTypeMatch) {
                console.log('[DEBUG] Found Flow Type line:', flowTypeMatch[0]);
            } else {
                console.log('[DEBUG] Flow Type line not found!');
            }
            
            return generatedCode;
        }
        
        function generatePHPCode(flow, params) {
            console.log('[DEBUG] generatePHPCode called with flow:', flow);
            console.log('[DEBUG] generatePHPCode params:', params);
            console.log('[DEBUG] generatePHPCode params keys:', Object.keys(params));
            
            // Get flow-specific hash metadata
            const hashMetadata = getFlowHashMetadata(flow, params);
            const flowSpec = params._flowSpecific || {};
            
            console.log('[DEBUG] PHP hashMetadata:', hashMetadata);
            console.log('[DEBUG] PHP hashMetadata.hashType:', hashMetadata.hashType);
            
            // Build params array with values from form, excluding txnid and internal params
            // Filter out subscription-only params (api_version, si, pre_authorize) for flows that don't need them
            // EXCEPTION: TPV flows require api_version = 6, UPI OTM requires api_version = 7 and pre_authorize = 1, PreAuth requires pre_authorize = 1, Bank Offer SKU requires api_version = 19
            const subscriptionOnlyParams = ['api_version', 'si', 'pre_authorize'];
            const jsonFieldsToSkip = ['cart_details', 'splitRequest']; // Will be generated by helper function
            const paramsArray = Object.entries(params)
                .filter(([key]) => {
                    // Skip internal fields and txnid
                    if (key.startsWith('_') || key === 'txnid') return false;
                    // Skip JSON fields that will be generated by helper functions
                    if (jsonFieldsToSkip.includes(key)) return false;
                    // Skip subscription-only params for flows that don't need them
                    if (!flowSpec.hasSubscription && !flowSpec.hasBeneficiary && !flowSpec.hasUPIOTM && !flowSpec.isPreauth && !flowSpec.hasCartDetails && subscriptionOnlyParams.includes(key)) return false;
                    // Skip 'si' for TPV, UPI OTM, PreAuth, and Bank Offer flows
                    if ((flowSpec.hasBeneficiary || flowSpec.hasUPIOTM || flowSpec.isPreauth || flowSpec.hasBankOffer) && key === 'si') return false;
                    // Skip 'pre_authorize' for flows that don't need it
                    if (!flowSpec.hasUPIOTM && !flowSpec.isPreauth && key === 'pre_authorize') return false;
                    // Skip 'api_version' for PreAuth and non-SKU Bank Offers (only UPI OTM, subscriptions, and SKU Bank Offers need it)
                    if (flowSpec.isPreauth && key === 'api_version') return false;
                    if (flowSpec.hasBankOffer && !flowSpec.hasCartDetails && key === 'api_version') return false;
                    // Skip 'api_version' and 'offer_key' for SKU Bank Offers (they're added in jsonParamCode)
                    if (flowSpec.hasCartDetails && (key === 'api_version' || key === 'offer_key')) return false;
                    return true;
                })
                .map(([key, value]) => {
                    // Escape special characters for PHP strings
                    const escapedValue = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
                    return "        '" + key + "' => '" + escapedValue + "',";
                })
                .join('\n');
            
            console.log('[DEBUG] PHP paramsArray length:', paramsArray.length);
            console.log('[DEBUG] PHP paramsArray:', paramsArray);
            
            // Generate hash string code based on flow
            let hashStringCode = '';
            if (hashMetadata.hashType === 'standard') {
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  MERCHANT_SALT;";
            } else if (hashMetadata.hashType === 'subscription' || hashMetadata.hashType === 'upiotm') {
                // Non-Seamless Subscription or UPI OTM: Hash WITHOUT buyer_type_business
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  $params['si_details'] . '|' .\n" +
                               "                  MERCHANT_SALT;";
            } else if (hashMetadata.hashType === 'tpv') {
                // TPV (Third Party Verification): Hash with beneficiarydetail JSON
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||beneficiarydetail|SALT
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  $params['beneficiarydetail'] . '|' .\n" +
                               "                  MERCHANT_SALT;";
            } else if (hashMetadata.hashType === 'bankoffer_sku') {
                // Bank Offer with SKU/cart_details - Extended hash formula
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  ($params['user_token'] ?? '') . '|' .\n" +
                               "                  ($params['offer_key'] ?? '') . '|' .\n" +
                               "                  ($params['offer_auto_apply'] ?? '') . '|' .\n" +
                               "                  ($params['cart_details'] ?? '') . '|' .\n" +
                               "                  ($params['extra_charges'] ?? '') . '|' .\n" +
                               "                  ($params['phone'] ?? '') . '|' .\n" +
                               "                  MERCHANT_SALT;";
            } else if (hashMetadata.hashType === 'bankoffer_standard') {
                // Bank Offer without SKU - Standard hash formula
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  MERCHANT_SALT;";
            } else if (hashMetadata.hashType === 'split') {
                // Split Payment: Hash with splitRequest at the end
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||SALT|splitRequest
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  MERCHANT_SALT . '|' .\n" +
                               "                  $params['splitRequest'];";
            } else if (hashMetadata.hashType === 'crossborder') {
                // Cross Border One-Time - Check for udf_params and buyer_type_business
                const hasUdfParams = params.udf_params !== undefined;
                const hasBuyerType = params.buyer_type_business !== undefined;
                
                if (hasUdfParams && hasBuyerType) {
                    // With both udf_params and buyer_type_business
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  MERCHANT_SALT . '|' .\n" +
                                   "                  $params['udf_params'] . '|' .\n" +
                               "                  $params['buyer_type_business'];";
                } else if (hasUdfParams) {
                    // With only udf_params
                    hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                                   "                  $params['txnid'] . '|' .\n" +
                                   "                  $params['amount'] . '|' .\n" +
                                   "                  $params['productinfo'] . '|' .\n" +
                                   "                  $params['firstname'] . '|' .\n" +
                                   "                  $params['email'] . '|' .\n" +
                                   "                  ($params['udf1'] ?? '') . '|' .\n" +
                                   "                  ($params['udf2'] ?? '') . '|' .\n" +
                                   "                  ($params['udf3'] ?? '') . '|' .\n" +
                                   "                  ($params['udf4'] ?? '') . '|' .\n" +
                                   "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                                   "                  MERCHANT_SALT . '|' .\n" +
                                   "                  $params['udf_params'];";
                } else {
                    // With only buyer_type_business (backward compatible)
                    hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                                   "                  $params['txnid'] . '|' .\n" +
                                   "                  $params['amount'] . '|' .\n" +
                                   "                  $params['productinfo'] . '|' .\n" +
                                   "                  $params['firstname'] . '|' .\n" +
                                   "                  $params['email'] . '|' .\n" +
                                   "                  ($params['udf1'] ?? '') . '|' .\n" +
                                   "                  ($params['udf2'] ?? '') . '|' .\n" +
                                   "                  ($params['udf3'] ?? '') . '|' .\n" +
                                   "                  ($params['udf4'] ?? '') . '|' .\n" +
                                   "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                                   "                  MERCHANT_SALT . '|' .\n" +
                                   "                  $params['buyer_type_business'];";
                }
            } else if (hashMetadata.hashType === 'crossborder_subscription') {
                // Cross Border Subscription - Check for udf_params and buyer_type_business
                const hasUdfParams = params.udf_params !== undefined;
                const hasBuyerType = params.buyer_type_business !== undefined;
                
                if (hasUdfParams && hasBuyerType) {
                    // With both udf_params and buyer_type_business
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  $params['si_details'] . '|' .\n" +
                               "                  MERCHANT_SALT . '|' .\n" +
                                   "                  $params['udf_params'] . '|' .\n" +
                               "                  $params['buyer_type_business'];";
                } else if (hasUdfParams) {
                    // With only udf_params
                    hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                                   "                  $params['txnid'] . '|' .\n" +
                                   "                  $params['amount'] . '|' .\n" +
                                   "                  $params['productinfo'] . '|' .\n" +
                                   "                  $params['firstname'] . '|' .\n" +
                                   "                  $params['email'] . '|' .\n" +
                                   "                  ($params['udf1'] ?? '') . '|' .\n" +
                                   "                  ($params['udf2'] ?? '') . '|' .\n" +
                                   "                  ($params['udf3'] ?? '') . '|' .\n" +
                                   "                  ($params['udf4'] ?? '') . '|' .\n" +
                                   "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                                   "                  $params['si_details'] . '|' .\n" +
                                   "                  MERCHANT_SALT . '|' .\n" +
                                   "                  $params['udf_params'];";
                } else {
                    // With only buyer_type_business (backward compatible)
                    hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                                   "                  $params['txnid'] . '|' .\n" +
                                   "                  $params['amount'] . '|' .\n" +
                                   "                  $params['productinfo'] . '|' .\n" +
                                   "                  $params['firstname'] . '|' .\n" +
                                   "                  $params['email'] . '|' .\n" +
                                   "                  ($params['udf1'] ?? '') . '|' .\n" +
                                   "                  ($params['udf2'] ?? '') . '|' .\n" +
                                   "                  ($params['udf3'] ?? '') . '|' .\n" +
                                   "                  ($params['udf4'] ?? '') . '|' .\n" +
                                   "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                                   "                  $params['si_details'] . '|' .\n" +
                                   "                  MERCHANT_SALT . '|' .\n" +
                                   "                  $params['buyer_type_business'];";
                }
            } else {
                hashStringCode = "    $hashString = MERCHANT_KEY . '|' .\n" +
                               "                  $params['txnid'] . '|' .\n" +
                               "                  $params['amount'] . '|' .\n" +
                               "                  $params['productinfo'] . '|' .\n" +
                               "                  $params['firstname'] . '|' .\n" +
                               "                  $params['email'] . '|' .\n" +
                               "                  ($params['udf1'] ?? '') . '|' .\n" +
                               "                  ($params['udf2'] ?? '') . '|' .\n" +
                               "                  ($params['udf3'] ?? '') . '|' .\n" +
                               "                  ($params['udf4'] ?? '') . '|' .\n" +
                               "                  ($params['udf5'] ?? '') . '||||||' .\n" +
                               "                  MERCHANT_SALT;";
            }
            
            // Generate PHP helper function for Bank Offer cart_details or Split Payment splitRequest if needed
            let phpCartDetailsFunction = '';
            let phpCartDetailsUsage = '';
            let phpSplitFunction = '';
            let phpSplitUsage = '';
            
            if (flowSpec.hasSplit) {
                // Split Payment - Generate helper function for splitRequest JSON
                const splitMerchants = flowSpec.splitMerchants || [];
                
                // Build split merchant initialization code for PHP
                let phpSplitMerchantsCode = '';
                splitMerchants.forEach((merchant, index) => {
                    phpSplitMerchantsCode += `
        '${merchant.merchantKey}' => [
            'aggregatorSubTxnId' => '${merchant.txnId}',
            'aggregatorSubAmt' => '${merchant.amount}',
            'aggregatorCharges' => '${merchant.charges}'
        ]${index < splitMerchants.length - 1 ? ',' : ''}
`;
                });
                
                phpSplitFunction = '\n/**\n' +
                    ' * Generate splitRequest JSON for Split Payment\n' +
                    ' * \n' +
                    ' * Builds a properly formatted splitRequest JSON with child merchant details.\n' +
                    ' * Supports both absolute (amount in INR) and percentage-based splits.\n' +
                    ' * \n' +
                    ' * @param string $type Split type - "absolute" or "percentage"\n' +
                    ' * @param array $splitInfo Associative array of merchant keys to their details\n' +
                    ' * @return string JSON representation of splitRequest\n' +
                    ' */\n' +
                    'function generateSplitRequest($type, $splitInfo) {\n' +
                    '    $splitRequest = [\n' +
                    '        \'type\' => $type,\n' +
                    '        \'splitInfo\' => $splitInfo\n' +
                    '    ];\n' +
                    '    \n' +
                    '    return json_encode($splitRequest);\n' +
                    '}\n';
                
                phpSplitUsage = `\n    // Build split merchants data
    $splitInfo = [${phpSplitMerchantsCode}
    ];
    
    // Generate splitRequest JSON
    $params['splitRequest'] = generateSplitRequest('${flowSpec.splitType}', $splitInfo);
    \n`;
            } else if (flowSpec.hasCartDetails) {
                const cartData = JSON.parse(flowSpec.cartDetails);
                
                // Build SKU details array code for PHP
                let phpSkuArrayCode = '';
                cartData.sku_details.forEach((sku, index) => {
                    const offerKeyValue = sku.offer_key && Array.isArray(sku.offer_key) && sku.offer_key.length > 0
                        ? `[${sku.offer_key.map(k => `"${k}"`).join(', ')}]`
                        : 'null';
                    
                    phpSkuArrayCode += `
        // SKU Item ${index + 1}: ${sku.sku_name}
        $skuDetails[] = [
            'sku_id' => '${sku.sku_id}',
            'sku_name' => '${sku.sku_name}',
            'amount_per_sku' => ${sku.amount_per_sku},
            'quantity' => ${sku.quantity},
            'offer_key' => ${offerKeyValue},
            'offer_auto_apply' => ${sku.offer_auto_apply}
        ];
`;
                });
                
                phpCartDetailsFunction = '\n/**\n' +
                    ' * Generate cart_details JSON for Bank Offer with SKU\n' +
                    ' * \n' +
                    ' * Builds a properly formatted cart_details JSON with SKU information.\n' +
                    ' * \n' +
                    ' * @param string $amount Total cart amount\n' +
                    ' * @param int $items Total number of items\n' +
                    ' * @param string $surcharges Additional surcharges (can be empty string)\n' +
                    ' * @param float $preDiscount Pre-discount amount\n' +
                    ' * @return string JSON representation of cart_details\n' +
                    ' */\n' +
                    'function generateCartDetails($amount, $items, $surcharges, $preDiscount) {\n' +
                    '    $skuDetails = [];\n' +
                    phpSkuArrayCode + '\n' +
                    '    $cartDetails = [\n' +
                    '        \'amount\' => (int)$amount,\n' +
                    '        \'items\' => $items,\n' +
                    '        \'surcharges\' => $surcharges,\n' +
                    '        \'pre_discount\' => $preDiscount,\n' +
                    '        \'sku_details\' => $skuDetails\n' +
                    '    ];\n' +
                    '    \n' +
                    '    return json_encode($cartDetails);\n' +
                    '}\n';
                
                const offerKeyLine = hashMetadata.additionalComponents.offer_key 
                    ? `\n    $params['offer_key'] = '${hashMetadata.additionalComponents.offer_key}';` 
                    : '';
                
                phpCartDetailsUsage = `\n    // Generate Cart Details JSON for Bank Offer with SKU
    $params['cart_details'] = generateCartDetails('${cartData.amount}', ${cartData.items}, '${cartData.surcharges}', ${cartData.pre_discount});
    
    // Bank Offer with SKU requires api_version = 19
    $params['api_version'] = '19';${offerKeyLine}
    \n`;
            }
            
            const flowName = flow.charAt(0).toUpperCase() + flow.slice(1);
            
            const generatedCode = '<?php\n' +
'/**\n' +
' * PayU Integration - ' + flowName + ' Flow\n' +
' * Generated by PayU Payment Hub\n' +
' * Hash Type: ' + hashMetadata.hashType + '\n' +
' * \n' +
' * Instructions:\n' +
' * 1. Replace YOUR_MERCHANT_KEY with your actual PayU merchant key\n' +
' * 2. Replace YOUR_MERCHANT_SALT with your actual PayU merchant salt\n' +
' * 3. Run: php payu_integration.php\n' +
' * 4. The program will print HTML code to console - copy and save as .html file\n' +
' * 5. Open the HTML file in a browser to complete payment (auto-redirects to PayU)\n' +
' */\n' +
'\n' +
'// REPLACE THESE WITH YOUR ACTUAL CREDENTIALS\n' +
"define('MERCHANT_KEY', 'YOUR_MERCHANT_KEY');\n" +
"define('MERCHANT_SALT', 'YOUR_MERCHANT_SALT');\n" +
"define('PAYU_URL', 'https://test.payu.in/_payment');\n" +
'\n' +
'/**\n' +
' * Generate unique transaction ID with random component\n' +
' */\n' +
'function generateTransactionId() {\n' +
"    return 'TXN' . round(microtime(true) * 1000) . rand(1000, 9999);\n" +
'}\n' +
'\n' +
'/**\n' +
' * Generate SHA512 hash for payment parameters\n' +
' * Hash Type: ' + hashMetadata.hashType + '\n' +
' */\n' +
'function generateHash($params) {\n' +
'    // Build hash string in PayU format for ' + flowName + ' flow\n' +
hashStringCode + '\n' +
'    \n' +
'    // Generate SHA512 hash\n' +
"    return hash('sha512', $hashString);\n" +
'}\n' +
phpSplitFunction +
phpCartDetailsFunction +
'\n' +
'/**\n' +
' * Initiate payment\n' +
' */\n' +
'function initiatePayment() {\n' +
'    // Payment parameters - prefilled from your form\n' +
'    $params = [\n' +
"        'key' => MERCHANT_KEY,\n" +
'        \n' +
'        // Generate unique transaction ID\n' +
"        'txnid' => generateTransactionId(),\n" +
'        \n' +
paramsArray + '\n' +
'    ];\n' +
phpSplitUsage +
phpCartDetailsUsage +
'    \n' +
'    // Generate hash\n' +
'    $hash = generateHash($params);\n' +
"    $params['hash'] = $hash;\n" +
'    \n' +
'    echo "<!DOCTYPE html>\\\\n";\n' +
'    echo "<html>\\\\n<head>\\\\n";\n' +
'    echo "<meta charset=\'UTF-8\'>\\\\n";\n' +
'    echo "<title>Redirecting to PayU...</title>\\\\n";\n' +
'    echo "<style>\\\\n";\n' +
'    echo "body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }\\\\n";\n' +
'    echo "h3 { color: #333; }\\\\n";\n' +
'    echo ".loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px auto; }\\\\n";\n' +
'    echo "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\\\\n";\n' +
'    echo "</style>\\\\n";\n' +
'    echo "</head>\\\\n";\n' +
'    echo "<body onload=\'document.payuForm.submit()\'>\\\\n";\n' +
'    echo "<h3>Please wait while we redirect you to PayU...</h3>\\\\n";\n' +
'    echo "<div class=\'loader\'></div>\\\\n";\n' +
'    echo "<form name=\'payuForm\' method=\'post\' action=\'" . PAYU_URL . "\'>\\\\n";\n' +
'    \n' +
'    foreach ($params as $key => $value) {\n' +
'        echo "  <input type=\'hidden\' name=\'$key\' value=\'" . htmlspecialchars($value) . "\' />\\\\n";\n' +
'    }\n' +
'    \n' +
'    echo "  <button type=\'submit\' style=\'margin-top: 20px; padding: 10px 30px; font-size: 16px; cursor: pointer;\'>Pay Now</button>\\\\n";\n' +
'    echo "</form>\\\\n";\n' +
'    echo "</body>\\\\n</html>";\n' +
'    \n' +
'    echo "\\\\n\\\\n<!-- Debug Info (remove in production) -->\\\\n";\n' +
'    echo "<!-- Transaction ID: " . $params[\'txnid\'] . " -->\\\\n";\n' +
'    echo "<!-- Generated Hash: " . $hash . " -->\\\\n";\n' +
'}\n' +
'\n' +
'// Execute payment\n' +
'echo "\\\\n=== Payment Integration Ready ===\\\\n";\n' +
'echo "[SUCCESS] Transaction ID will be generated\\\\n";\n' +
'echo "\\\\n=== COPY THE HTML BELOW ===\\\\n\\\\n";\n' +
'initiatePayment();\n' +
'echo "\\\\n\\\\n=== END OF HTML ===\\\\n";\n' +
'echo "\\\\n[INSTRUCTIONS]:\\\\n";\n' +
'echo "1. Copy the HTML code above (between the markers)\\\\n";\n' +
'echo "2. Save it as a .html file (e.g., payu_payment.html)\\\\n";\n' +
'echo "3. Open the file in a browser to complete payment\\\\n";\n' +
'echo "4. The page will auto-redirect to PayU payment gateway\\\\n";\n' +
'?>';
            
            return generatedCode;
        }
        
        function generatePythonCode(flow, params) {
            // Get flow-specific hash metadata
            const hashMetadata = getFlowHashMetadata(flow, params);
            const flowSpec = params._flowSpecific || {};
            
            // Build params dict with values from form, excluding txnid and internal params
            // Filter out subscription-only params (api_version, si, pre_authorize) for flows that don't need them
            // EXCEPTION: TPV flows require api_version = 6, UPI OTM requires api_version = 7 and pre_authorize = 1, PreAuth requires pre_authorize = 1, Bank Offer SKU requires api_version = 19
            const subscriptionOnlyParams = ['api_version', 'si', 'pre_authorize'];
            const jsonFieldsToSkipPython = ['cart_details', 'splitRequest']; // Will be generated by helper function
            const paramsDict = Object.entries(params)
                .filter(([key]) => {
                    // Skip internal fields and txnid
                    if (key.startsWith('_') || key === 'txnid') return false;
                    // Skip JSON fields that will be generated by helper functions
                    if (jsonFieldsToSkipPython.includes(key)) return false;
                    // Skip subscription-only params for flows that don't need them
                    if (!flowSpec.hasSubscription && !flowSpec.hasBeneficiary && !flowSpec.hasUPIOTM && !flowSpec.isPreauth && !flowSpec.hasCartDetails && subscriptionOnlyParams.includes(key)) return false;
                    // Skip 'si' for TPV, UPI OTM, PreAuth, and Bank Offer flows
                    if ((flowSpec.hasBeneficiary || flowSpec.hasUPIOTM || flowSpec.isPreauth || flowSpec.hasBankOffer) && key === 'si') return false;
                    // Skip 'pre_authorize' for flows that don't need it
                    if (!flowSpec.hasUPIOTM && !flowSpec.isPreauth && key === 'pre_authorize') return false;
                    // Skip 'api_version' for PreAuth and non-SKU Bank Offers (only UPI OTM, subscriptions, and SKU Bank Offers need it)
                    if (flowSpec.isPreauth && key === 'api_version') return false;
                    if (flowSpec.hasBankOffer && !flowSpec.hasCartDetails && key === 'api_version') return false;
                    // Skip 'api_version' and 'offer_key' for SKU Bank Offers (they're added in jsonParamCode)
                    if (flowSpec.hasCartDetails && (key === 'api_version' || key === 'offer_key')) return false;
                    return true;
                })
                .map(([key, value]) => {
                    // Escape special characters for Python strings
                    const escapedValue = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
                    return "        '" + key + "': '" + escapedValue + "',";
                })
                .join('\n');
            
            // Generate hash string code based on flow
            let hashStringCode = '';
            if (hashMetadata.hashType === 'standard') {
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{MERCHANT_SALT}\"\n" +
                               "    )";
            } else if (hashMetadata.hashType === 'subscription' || hashMetadata.hashType === 'upiotm') {
                // Non-Seamless Subscription or UPI OTM: Hash WITHOUT buyer_type_business
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{params['si_details']}|\"\n" +
                               "        f\"{MERCHANT_SALT}\"\n" +
                               "    )";
            } else if (hashMetadata.hashType === 'tpv') {
                // TPV (Third Party Verification): Hash with beneficiarydetail JSON
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||beneficiarydetail|SALT
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{params['beneficiarydetail']}|\"\n" +
                               "        f\"{MERCHANT_SALT}\"\n" +
                               "    )";
            } else if (hashMetadata.hashType === 'bankoffer_sku') {
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{params.get('user_token', '')}|\"\n" +
                               "        f\"{params.get('offer_key', '')}|\"\n" +
                               "        f\"{params.get('offer_auto_apply', '')}|\"\n" +
                               "        f\"{params.get('cart_details', '')}|\"\n" +
                               "        f\"{params.get('extra_charges', '')}|\"\n" +
                               "        f\"{params.get('phone', '')}|\"\n" +
                               "        f\"{MERCHANT_SALT}\"\n" +
                               "    )";
            } else if (hashMetadata.hashType === 'bankoffer_standard') {
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{MERCHANT_SALT}\"\n" +
                               "    )";
            } else if (hashMetadata.hashType === 'split') {
                // Split Payment: Hash with splitRequest at the end
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||SALT|splitRequest
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{MERCHANT_SALT}|\"\n" +
                               "        f\"{params['splitRequest']}\"\n" +
                               "    )";
            } else if (hashMetadata.hashType === 'crossborder') {
                // Cross Border One-Time - Check for udf_params and buyer_type_business
                const hasUdfParams = params.udf_params !== undefined;
                const hasBuyerType = params.buyer_type_business !== undefined;
                
                if (hasUdfParams && hasBuyerType) {
                    // With both udf_params and buyer_type_business
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{MERCHANT_SALT}|\"\n" +
                                   "        f\"{params['udf_params']}|\"\n" +
                               "        f\"{params['buyer_type_business']}\"\n" +
                               "    )";
                } else if (hasUdfParams) {
                    // With only udf_params
                    hashStringCode = "    hash_string = (\n" +
                                   "        f\"{MERCHANT_KEY}|\"\n" +
                                   "        f\"{params['txnid']}|\"\n" +
                                   "        f\"{params['amount']}|\"\n" +
                                   "        f\"{params['productinfo']}|\"\n" +
                                   "        f\"{params['firstname']}|\"\n" +
                                   "        f\"{params['email']}|\"\n" +
                                   "        f\"{params.get('udf1', '')}|\"\n" +
                                   "        f\"{params.get('udf2', '')}|\"\n" +
                                   "        f\"{params.get('udf3', '')}|\"\n" +
                                   "        f\"{params.get('udf4', '')}|\"\n" +
                                   "        f\"{params.get('udf5', '')}||||||\"\n" +
                                   "        f\"{MERCHANT_SALT}|\"\n" +
                                   "        f\"{params['udf_params']}\"\n" +
                                   "    )";
                } else {
                    // With only buyer_type_business (backward compatible)
                    hashStringCode = "    hash_string = (\n" +
                                   "        f\"{MERCHANT_KEY}|\"\n" +
                                   "        f\"{params['txnid']}|\"\n" +
                                   "        f\"{params['amount']}|\"\n" +
                                   "        f\"{params['productinfo']}|\"\n" +
                                   "        f\"{params['firstname']}|\"\n" +
                                   "        f\"{params['email']}|\"\n" +
                                   "        f\"{params.get('udf1', '')}|\"\n" +
                                   "        f\"{params.get('udf2', '')}|\"\n" +
                                   "        f\"{params.get('udf3', '')}|\"\n" +
                                   "        f\"{params.get('udf4', '')}|\"\n" +
                                   "        f\"{params.get('udf5', '')}||||||\"\n" +
                                   "        f\"{MERCHANT_SALT}|\"\n" +
                                   "        f\"{params['buyer_type_business']}\"\n" +
                                   "    )";
                }
            } else if (hashMetadata.hashType === 'crossborder_subscription') {
                // Cross Border Subscription - Check for udf_params and buyer_type_business
                const hasUdfParams = params.udf_params !== undefined;
                const hasBuyerType = params.buyer_type_business !== undefined;
                
                if (hasUdfParams && hasBuyerType) {
                    // With both udf_params and buyer_type_business
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{params['si_details']}|\"\n" +
                               "        f\"{MERCHANT_SALT}|\"\n" +
                                   "        f\"{params['udf_params']}|\"\n" +
                               "        f\"{params['buyer_type_business']}\"\n" +
                               "    )";
                } else if (hasUdfParams) {
                    // With only udf_params
                    hashStringCode = "    hash_string = (\n" +
                                   "        f\"{MERCHANT_KEY}|\"\n" +
                                   "        f\"{params['txnid']}|\"\n" +
                                   "        f\"{params['amount']}|\"\n" +
                                   "        f\"{params['productinfo']}|\"\n" +
                                   "        f\"{params['firstname']}|\"\n" +
                                   "        f\"{params['email']}|\"\n" +
                                   "        f\"{params.get('udf1', '')}|\"\n" +
                                   "        f\"{params.get('udf2', '')}|\"\n" +
                                   "        f\"{params.get('udf3', '')}|\"\n" +
                                   "        f\"{params.get('udf4', '')}|\"\n" +
                                   "        f\"{params.get('udf5', '')}||||||\"\n" +
                                   "        f\"{params['si_details']}|\"\n" +
                                   "        f\"{MERCHANT_SALT}|\"\n" +
                                   "        f\"{params['udf_params']}\"\n" +
                                   "    )";
                } else {
                    // With only buyer_type_business (backward compatible)
                    hashStringCode = "    hash_string = (\n" +
                                   "        f\"{MERCHANT_KEY}|\"\n" +
                                   "        f\"{params['txnid']}|\"\n" +
                                   "        f\"{params['amount']}|\"\n" +
                                   "        f\"{params['productinfo']}|\"\n" +
                                   "        f\"{params['firstname']}|\"\n" +
                                   "        f\"{params['email']}|\"\n" +
                                   "        f\"{params.get('udf1', '')}|\"\n" +
                                   "        f\"{params.get('udf2', '')}|\"\n" +
                                   "        f\"{params.get('udf3', '')}|\"\n" +
                                   "        f\"{params.get('udf4', '')}|\"\n" +
                                   "        f\"{params.get('udf5', '')}||||||\"\n" +
                                   "        f\"{params['si_details']}|\"\n" +
                                   "        f\"{MERCHANT_SALT}|\"\n" +
                                   "        f\"{params['buyer_type_business']}\"\n" +
                                   "    )";
                }
            } else {
                hashStringCode = "    hash_string = (\n" +
                               "        f\"{MERCHANT_KEY}|\"\n" +
                               "        f\"{params['txnid']}|\"\n" +
                               "        f\"{params['amount']}|\"\n" +
                               "        f\"{params['productinfo']}|\"\n" +
                               "        f\"{params['firstname']}|\"\n" +
                               "        f\"{params['email']}|\"\n" +
                               "        f\"{params.get('udf1', '')}|\"\n" +
                               "        f\"{params.get('udf2', '')}|\"\n" +
                               "        f\"{params.get('udf3', '')}|\"\n" +
                               "        f\"{params.get('udf4', '')}|\"\n" +
                               "        f\"{params.get('udf5', '')}||||||\"\n" +
                               "        f\"{MERCHANT_SALT}\"\n" +
                               "    )";
            }
            
            // Generate Python helper function for Bank Offer cart_details or Split Payment splitRequest if needed
            let pythonCartDetailsFunction = '';
            let pythonCartDetailsUsage = '';
            let pythonSplitFunction = '';
            let pythonSplitUsage = '';
            
            if (flowSpec.hasSplit) {
                // Split Payment - Generate helper function for splitRequest JSON
                const splitMerchants = flowSpec.splitMerchants || [];
                
                // Build split merchant initialization code for Python
                let pythonSplitMerchantsCode = '';
                splitMerchants.forEach((merchant, index) => {
                    pythonSplitMerchantsCode += `
        '${merchant.merchantKey}': {
            'aggregatorSubTxnId': '${merchant.txnId}',
            'aggregatorSubAmt': '${merchant.amount}',
            'aggregatorCharges': '${merchant.charges}'
        }${index < splitMerchants.length - 1 ? ',' : ''}
`;
                });
                
                pythonSplitFunction = '\ndef generate_split_request(split_type, split_info):\n' +
                    '    """\n' +
                    '    Generate splitRequest JSON for Split Payment\n' +
                    '    \n' +
                    '    Builds a properly formatted splitRequest JSON with child merchant details.\n' +
                    '    Supports both absolute (amount in INR) and percentage-based splits.\n' +
                    '    \n' +
                    '    Args:\n' +
                    '        split_type (str): Split type - "absolute" or "percentage"\n' +
                    '        split_info (dict): Dictionary of merchant keys to their details\n' +
                    '    \n' +
                    '    Returns:\n' +
                    '        str: JSON representation of splitRequest\n' +
                    '    """\n' +
                    '    import json\n' +
                    '    split_request = {\n' +
                    '        \'type\': split_type,\n' +
                    '        \'splitInfo\': split_info\n' +
                    '    }\n' +
                    '    \n' +
                    '    return json.dumps(split_request)\n';
                
                pythonSplitUsage = `\n    # Build split merchants data
    split_info = {${pythonSplitMerchantsCode}
    }
    
    # Generate splitRequest JSON
    params['splitRequest'] = generate_split_request('${flowSpec.splitType}', split_info)
    \n`;
            } else if (flowSpec.hasCartDetails) {
                const cartData = JSON.parse(flowSpec.cartDetails);
                
                // Build SKU details array code for Python
                let pythonSkuArrayCode = '';
                cartData.sku_details.forEach((sku, index) => {
                    const offerKeyValue = sku.offer_key && Array.isArray(sku.offer_key) && sku.offer_key.length > 0
                        ? `[${sku.offer_key.map(k => `"${k}"`).join(', ')}]`
                        : 'None';
                    
                    pythonSkuArrayCode += `
    # SKU Item ${index + 1}: ${sku.sku_name}
    sku_details.append({
        'sku_id': '${sku.sku_id}',
        'sku_name': '${sku.sku_name}',
        'amount_per_sku': ${sku.amount_per_sku},
        'quantity': ${sku.quantity},
        'offer_key': ${offerKeyValue},
        'offer_auto_apply': ${sku.offer_auto_apply ? 'True' : 'False'}
    })
`;
                });
                
                pythonCartDetailsFunction = '\ndef generate_cart_details(amount, items, surcharges, pre_discount):\n' +
                    '    """\n' +
                    '    Generate cart_details JSON for Bank Offer with SKU\n' +
                    '    \n' +
                    '    Builds a properly formatted cart_details JSON with SKU information.\n' +
                    '    \n' +
                    '    Args:\n' +
                    '        amount (str): Total cart amount\n' +
                    '        items (int): Total number of items\n' +
                    '        surcharges (str): Additional surcharges (can be empty string)\n' +
                    '        pre_discount (float): Pre-discount amount\n' +
                    '    \n' +
                    '    Returns:\n' +
                    '        str: JSON representation of cart_details\n' +
                    '    """\n' +
                    '    import json\n' +
                    '    sku_details = []\n' +
                    pythonSkuArrayCode + '\n' +
                    '    cart_details = {\n' +
                    '        \'amount\': int(amount),\n' +
                    '        \'items\': items,\n' +
                    '        \'surcharges\': surcharges,\n' +
                    '        \'pre_discount\': pre_discount,\n' +
                    '        \'sku_details\': sku_details\n' +
                    '    }\n' +
                    '    \n' +
                    '    return json.dumps(cart_details)\n';
                
                const offerKeyLine = hashMetadata.additionalComponents.offer_key 
                    ? `\n    params['offer_key'] = '${hashMetadata.additionalComponents.offer_key}'` 
                    : '';
                
                pythonCartDetailsUsage = `\n    # Generate Cart Details JSON for Bank Offer with SKU
    params['cart_details'] = generate_cart_details('${cartData.amount}', ${cartData.items}, '${cartData.surcharges}', ${cartData.pre_discount})
    
    # Bank Offer with SKU requires api_version = 19
    params['api_version'] = '19'${offerKeyLine}
    \n`;
            }
            
            const flowName = flow.charAt(0).toUpperCase() + flow.slice(1);
            
            const generatedCode = '#!/usr/bin/env python3\n' +
'\n' +
'"""\n' +
'PayU Integration - ' + flowName + ' Flow\n' +
'Generated by PayU Payment Hub\n' +
'Hash Type: ' + hashMetadata.hashType + '\n' +
'\n' +
'Instructions:\n' +
'1. Replace YOUR_MERCHANT_KEY with your actual PayU merchant key\n' +
'2. Replace YOUR_MERCHANT_SALT with your actual PayU merchant salt\n' +
'3. Run: python3 payu_integration.py\n' +
'4. The program will print HTML code to console - copy and save as .html file\n' +
'5. Open the HTML file in a browser to complete payment (auto-redirects to PayU)\n' +
'"""\n' +
'\n' +
'import hashlib\n' +
'import time\n' +
'import random\n' +
'\n' +
'# REPLACE THESE WITH YOUR ACTUAL CREDENTIALS\n' +
"MERCHANT_KEY = 'YOUR_MERCHANT_KEY'\n" +
"MERCHANT_SALT = 'YOUR_MERCHANT_SALT'\n" +
"PAYU_URL = 'https://test.payu.in/_payment'\n" +
'\n' +
'def generate_transaction_id():\n' +
'    """Generate unique transaction ID with random component"""\n' +
'    timestamp = int(time.time() * 1000)\n' +
'    random_num = random.randint(1000, 9999)\n' +
"    return f'TXN{timestamp}{random_num}'\n" +
'\n' +
'def generate_hash(params):\n' +
'    """Generate SHA512 hash for payment parameters\n' +
'    Hash Type: ' + hashMetadata.hashType + '\n' +
'    """\n' +
'    # Build hash string in PayU format for ' + flowName + ' flow\n' +
hashStringCode + '\n' +
'    \n' +
'    # Generate SHA512 hash\n' +
"    return hashlib.sha512(hash_string.encode('utf-8')).hexdigest()\n" +
pythonSplitFunction +
pythonCartDetailsFunction +
'\n' +
'def initiate_payment():\n' +
'    """Initiate payment"""\n' +
'    # Payment parameters - prefilled from your form\n' +
'    params = {\n' +
"        'key': MERCHANT_KEY,\n" +
'        \n' +
'        # Generate unique transaction ID\n' +
"        'txnid': generate_transaction_id(),\n" +
'        \n' +
paramsDict + '\n' +
'    }\n' +
pythonSplitUsage +
pythonCartDetailsUsage +
'    \n' +
'    # Generate hash\n' +
'    hash_value = generate_hash(params)\n' +
"    params['hash'] = hash_value\n" +
'    \n' +
'    # Create HTML form with auto-submit\n' +
'    html = f"""<!DOCTYPE html>\n' +
'<html>\n' +
'<head>\n' +
"<meta charset='UTF-8'>\n" +
'<title>Redirecting to PayU...</title>\n' +
'<style>\n' +
'body {{ font-family: Arial, sans-serif; text-align: center; padding: 50px; }}\n' +
'h3 {{ color: #333; }}\n' +
'.loader {{ border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px auto; }}\n' +
'@keyframes spin {{ 0% {{ transform: rotate(0deg); }} 100% {{ transform: rotate(360deg); }} }}\n' +
'</style>\n' +
'</head>\n' +
"<body onload='document.payuForm.submit()'>\n" +
'<h3>Please wait while we redirect you to PayU...</h3>\n' +
"<div class='loader'></div>\n" +
"<form name='payuForm' method='post' action='{PAYU_URL}'>\n" +
'"""\n' +
'    \n' +
'    for key, value in params.items():\n' +
'        html += f"  <input type=\'hidden\' name=\'{key}\' value=\'{value}\' />\\n"\n' +
'    \n' +
'    html += """  <button type=\'submit\' style=\'margin-top: 20px; padding: 10px 30px; font-size: 16px; cursor: pointer;\'>Pay Now</button>\n' +
'</form>\n' +
'</body>\n' +
'</html>"""\n' +
'    \n' +
'    # Print HTML to console (merchant can copy-paste and save as .html file)\n' +
'    print("\\\\n=== Payment Integration Ready ===")\n' +
'    print(f"[SUCCESS] Transaction ID: {params[\'txnid\']}")\n' +
'    print(f"[SUCCESS] Generated Hash: {hash_value}")\n' +
'    print("\\\\n=== COPY THE HTML BELOW ===\\\\n")\n' +
'    print(html)\n' +
'    print("\\\\n=== END OF HTML ===")\n' +
'    print("\\\\n[INSTRUCTIONS]:")\n' +
'    print("1. Copy the HTML code above (between the markers)")\n' +
'    print("2. Save it as a .html file (e.g., payu_payment.html)")\n' +
'    print("3. Open the file in a browser to complete payment")\n' +
'    print("4. The page will auto-redirect to PayU payment gateway")\n' +
'\n' +
"if __name__ == '__main__':\n" +
'    print("====================================")\n' +
'    print("   PayU Payment Integration")\n' +
'    print(f"   Flow: ' + flowName.toUpperCase() + '")\n' +
'    print("====================================")\n' +
'    print("\\\\nInitiating payment...")\n' +
'    initiate_payment()';
            
            return generatedCode;
        }
        
        function generateNodeJSCode(flow, params) {
            // Get flow-specific hash metadata
            const hashMetadata = getFlowHashMetadata(flow, params);
            const flowSpec = params._flowSpecific || {};
            
            // Build params object with values from form, excluding txnid and internal params
            // Filter out subscription-only params (api_version, si, pre_authorize) for flows that don't need them
            // EXCEPTION: TPV flows require api_version = 6, UPI OTM requires api_version = 7 and pre_authorize = 1, PreAuth requires pre_authorize = 1, Bank Offer SKU requires api_version = 19
            const subscriptionOnlyParams = ['api_version', 'si', 'pre_authorize'];
            const jsonFieldsToSkipNode = ['cart_details', 'splitRequest']; // Will be generated by helper function
            const paramsObj = Object.entries(params)
                .filter(([key]) => {
                    // Skip internal fields and txnid
                    if (key.startsWith('_') || key === 'txnid') return false;
                    // Skip JSON fields that will be generated by helper functions
                    if (jsonFieldsToSkipNode.includes(key)) return false;
                    // Skip subscription-only params for flows that don't need them
                    if (!flowSpec.hasSubscription && !flowSpec.hasBeneficiary && !flowSpec.hasUPIOTM && !flowSpec.isPreauth && !flowSpec.hasCartDetails && subscriptionOnlyParams.includes(key)) return false;
                    // Skip 'si' for TPV, UPI OTM, PreAuth, and Bank Offer flows
                    if ((flowSpec.hasBeneficiary || flowSpec.hasUPIOTM || flowSpec.isPreauth || flowSpec.hasBankOffer) && key === 'si') return false;
                    // Skip 'pre_authorize' for flows that don't need it
                    if (!flowSpec.hasUPIOTM && !flowSpec.isPreauth && key === 'pre_authorize') return false;
                    // Skip 'api_version' for PreAuth and non-SKU Bank Offers (only UPI OTM, subscriptions, and SKU Bank Offers need it)
                    if (flowSpec.isPreauth && key === 'api_version') return false;
                    if (flowSpec.hasBankOffer && !flowSpec.hasCartDetails && key === 'api_version') return false;
                    // Skip 'api_version' and 'offer_key' for SKU Bank Offers (they're added in jsonParamCode)
                    if (flowSpec.hasCartDetails && (key === 'api_version' || key === 'offer_key')) return false;
                    return true;
                })
                .map(([key, value]) => {
                    // Escape special characters for JavaScript strings
                    const escapedValue = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
                    return "        " + key + ": '" + escapedValue + "',";
                })
                .join('\n');
            
            // Generate hash string code based on flow
            let hashStringCode = '';
            if (hashMetadata.hashType === 'standard') {
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        MERCHANT_SALT\n" +
                               "    ].join('|');";
            } else if (hashMetadata.hashType === 'subscription' || hashMetadata.hashType === 'upiotm') {
                // Non-Seamless Subscription or UPI OTM: Hash WITHOUT buyer_type_business
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||si_details|SALT
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        params.si_details,\n" +
                               "        MERCHANT_SALT\n" +
                               "    ].join('|');";
            } else if (hashMetadata.hashType === 'tpv') {
                // TPV (Third Party Verification): Hash with beneficiarydetail JSON
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||beneficiarydetail|SALT
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        params.beneficiarydetail,\n" +
                               "        MERCHANT_SALT\n" +
                               "    ].join('|');";
            } else if (hashMetadata.hashType === 'bankoffer_sku') {
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        (params.user_token || ''),\n" +
                               "        (params.offer_key || ''),\n" +
                               "        (params.offer_auto_apply || ''),\n" +
                               "        (params.cart_details || ''),\n" +
                               "        (params.extra_charges || ''),\n" +
                               "        (params.phone || ''),\n" +
                               "        MERCHANT_SALT\n" +
                               "    ].join('|');";
            } else if (hashMetadata.hashType === 'bankoffer_standard') {
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        MERCHANT_SALT\n" +
                               "    ].join('|');";
            } else if (hashMetadata.hashType === 'split') {
                // Split Payment: Hash with splitRequest at the end
                // Hash formula: key|txnid|amount|productinfo|firstname|email|udf1-5||||||SALT|splitRequest
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        MERCHANT_SALT,\n" +
                               "        params.splitRequest\n" +
                               "    ].join('|');";
            } else if (hashMetadata.hashType === 'crossborder') {
                // Cross Border One-Time - Check for udf_params and buyer_type_business
                const hasUdfParams = params.udf_params !== undefined;
                const hasBuyerType = params.buyer_type_business !== undefined;
                
                if (hasUdfParams && hasBuyerType) {
                    // With both udf_params and buyer_type_business
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        MERCHANT_SALT,\n" +
                                   "        params.udf_params,\n" +
                               "        params.buyer_type_business\n" +
                               "    ].join('|');";
                } else if (hasUdfParams) {
                    // With only udf_params
                    hashStringCode = "    const hashString = [\n" +
                                   "        MERCHANT_KEY,\n" +
                                   "        params.txnid,\n" +
                                   "        params.amount,\n" +
                                   "        params.productinfo,\n" +
                                   "        params.firstname,\n" +
                                   "        params.email,\n" +
                                   "        (params.udf1 || ''),\n" +
                                   "        (params.udf2 || ''),\n" +
                                   "        (params.udf3 || ''),\n" +
                                   "        (params.udf4 || ''),\n" +
                                   "        (params.udf5 || ''),\n" +
                                   "        '', '', '', '', '',\n" +
                                   "        MERCHANT_SALT,\n" +
                                   "        params.udf_params\n" +
                                   "    ].join('|');";
                } else {
                    // With only buyer_type_business (backward compatible)
                    hashStringCode = "    const hashString = [\n" +
                                   "        MERCHANT_KEY,\n" +
                                   "        params.txnid,\n" +
                                   "        params.amount,\n" +
                                   "        params.productinfo,\n" +
                                   "        params.firstname,\n" +
                                   "        params.email,\n" +
                                   "        (params.udf1 || ''),\n" +
                                   "        (params.udf2 || ''),\n" +
                                   "        (params.udf3 || ''),\n" +
                                   "        (params.udf4 || ''),\n" +
                                   "        (params.udf5 || ''),\n" +
                                   "        '', '', '', '', '',\n" +
                                   "        MERCHANT_SALT,\n" +
                                   "        params.buyer_type_business\n" +
                                   "    ].join('|');";
                }
            } else if (hashMetadata.hashType === 'crossborder_subscription') {
                // Cross Border Subscription - Check for udf_params and buyer_type_business
                const hasUdfParams = params.udf_params !== undefined;
                const hasBuyerType = params.buyer_type_business !== undefined;
                
                if (hasUdfParams && hasBuyerType) {
                    // With both udf_params and buyer_type_business
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        params.si_details,\n" +
                               "        MERCHANT_SALT,\n" +
                                   "        params.udf_params,\n" +
                               "        params.buyer_type_business\n" +
                               "    ].join('|');";
                } else if (hasUdfParams) {
                    // With only udf_params
                    hashStringCode = "    const hashString = [\n" +
                                   "        MERCHANT_KEY,\n" +
                                   "        params.txnid,\n" +
                                   "        params.amount,\n" +
                                   "        params.productinfo,\n" +
                                   "        params.firstname,\n" +
                                   "        params.email,\n" +
                                   "        (params.udf1 || ''),\n" +
                                   "        (params.udf2 || ''),\n" +
                                   "        (params.udf3 || ''),\n" +
                                   "        (params.udf4 || ''),\n" +
                                   "        (params.udf5 || ''),\n" +
                                   "        '', '', '', '', '',\n" +
                                   "        params.si_details,\n" +
                                   "        MERCHANT_SALT,\n" +
                                   "        params.udf_params\n" +
                                   "    ].join('|');";
                } else {
                    // With only buyer_type_business (backward compatible)
                    hashStringCode = "    const hashString = [\n" +
                                   "        MERCHANT_KEY,\n" +
                                   "        params.txnid,\n" +
                                   "        params.amount,\n" +
                                   "        params.productinfo,\n" +
                                   "        params.firstname,\n" +
                                   "        params.email,\n" +
                                   "        (params.udf1 || ''),\n" +
                                   "        (params.udf2 || ''),\n" +
                                   "        (params.udf3 || ''),\n" +
                                   "        (params.udf4 || ''),\n" +
                                   "        (params.udf5 || ''),\n" +
                                   "        '', '', '', '', '',\n" +
                                   "        params.si_details,\n" +
                                   "        MERCHANT_SALT,\n" +
                                   "        params.buyer_type_business\n" +
                                   "    ].join('|');";
                }
            } else {
                hashStringCode = "    const hashString = [\n" +
                               "        MERCHANT_KEY,\n" +
                               "        params.txnid,\n" +
                               "        params.amount,\n" +
                               "        params.productinfo,\n" +
                               "        params.firstname,\n" +
                               "        params.email,\n" +
                               "        (params.udf1 || ''),\n" +
                               "        (params.udf2 || ''),\n" +
                               "        (params.udf3 || ''),\n" +
                               "        (params.udf4 || ''),\n" +
                               "        (params.udf5 || ''),\n" +
                               "        '', '', '', '', '',\n" +
                               "        MERCHANT_SALT\n" +
                               "    ].join('|');";
            }
            
            // Generate Node.js helper function for Bank Offer cart_details or Split Payment splitRequest if needed
            let nodeCartDetailsFunction = '';
            let nodeCartDetailsUsage = '';
            let nodeSplitFunction = '';
            let nodeSplitUsage = '';
            
            if (flowSpec.hasSplit) {
                // Split Payment - Generate helper function for splitRequest JSON
                const splitMerchants = flowSpec.splitMerchants || [];
                
                // Build split merchant initialization code for Node.js
                let nodeSplitMerchantsCode = '';
                splitMerchants.forEach((merchant, index) => {
                    nodeSplitMerchantsCode += `
        '${merchant.merchantKey}': {
            aggregatorSubTxnId: '${merchant.txnId}',
            aggregatorSubAmt: '${merchant.amount}',
            aggregatorCharges: '${merchant.charges}'
        }${index < splitMerchants.length - 1 ? ',' : ''}
`;
                });
                
                nodeSplitFunction = '\n/**\n' +
                    ' * Generate splitRequest JSON for Split Payment\n' +
                    ' * \n' +
                    ' * Builds a properly formatted splitRequest JSON with child merchant details.\n' +
                    ' * Supports both absolute (amount in INR) and percentage-based splits.\n' +
                    ' * \n' +
                    ' * @param {string} type - Split type - "absolute" or "percentage"\n' +
                    ' * @param {Object} splitInfo - Object of merchant keys to their details\n' +
                    ' * @returns {string} JSON representation of splitRequest\n' +
                    ' */\n' +
                    'function generateSplitRequest(type, splitInfo) {\n' +
                    '    const splitRequest = {\n' +
                    '        type: type,\n' +
                    '        splitInfo: splitInfo\n' +
                    '    };\n' +
                    '    \n' +
                    '    return JSON.stringify(splitRequest);\n' +
                    '}\n';
                
                nodeSplitUsage = `\n    // Build split merchants data
    const splitInfo = {${nodeSplitMerchantsCode}
    };
    
    // Generate splitRequest JSON
    params.splitRequest = generateSplitRequest('${flowSpec.splitType}', splitInfo);
    \n`;
            } else if (flowSpec.hasCartDetails) {
                const cartData = JSON.parse(flowSpec.cartDetails);
                
                // Build SKU details array code for Node.js
                let nodeSkuArrayCode = '';
                cartData.sku_details.forEach((sku, index) => {
                    const offerKeyValue = sku.offer_key && Array.isArray(sku.offer_key) && sku.offer_key.length > 0
                        ? `[${sku.offer_key.map(k => `"${k}"`).join(', ')}]`
                        : 'null';
                    
                    nodeSkuArrayCode += `
    // SKU Item ${index + 1}: ${sku.sku_name}
    skuDetails.push({
        sku_id: '${sku.sku_id}',
        sku_name: '${sku.sku_name}',
        amount_per_sku: ${sku.amount_per_sku},
        quantity: ${sku.quantity},
        offer_key: ${offerKeyValue},
        offer_auto_apply: ${sku.offer_auto_apply}
    });
`;
                });
                
                nodeCartDetailsFunction = '\n/**\n' +
                    ' * Generate cart_details JSON for Bank Offer with SKU\n' +
                    ' * \n' +
                    ' * Builds a properly formatted cart_details JSON with SKU information.\n' +
                    ' * \n' +
                    ' * @param {string} amount - Total cart amount\n' +
                    ' * @param {number} items - Total number of items\n' +
                    ' * @param {string} surcharges - Additional surcharges (can be empty string)\n' +
                    ' * @param {number} preDiscount - Pre-discount amount\n' +
                    ' * @returns {string} JSON representation of cart_details\n' +
                    ' */\n' +
                    'function generateCartDetails(amount, items, surcharges, preDiscount) {\n' +
                    '    const skuDetails = [];\n' +
                    nodeSkuArrayCode + '\n' +
                    '    const cartDetails = {\n' +
                    '        amount: parseInt(amount),\n' +
                    '        items: items,\n' +
                    '        surcharges: surcharges,\n' +
                    '        pre_discount: preDiscount,\n' +
                    '        sku_details: skuDetails\n' +
                    '    };\n' +
                    '    \n' +
                    '    return JSON.stringify(cartDetails);\n' +
                    '}\n';
                
                const offerKeyLine = hashMetadata.additionalComponents.offer_key 
                    ? `\n    params.offer_key = '${hashMetadata.additionalComponents.offer_key}';` 
                    : '';
                
                nodeCartDetailsUsage = `\n    // Generate Cart Details JSON for Bank Offer with SKU
    params.cart_details = generateCartDetails('${cartData.amount}', ${cartData.items}, '${cartData.surcharges}', ${cartData.pre_discount});
    
    // Bank Offer with SKU requires api_version = 19
    params.api_version = '19';${offerKeyLine}
    \n`;
            }
            
            const flowName = flow.charAt(0).toUpperCase() + flow.slice(1);
            
            const generatedCode = '/**\n' +
' * PayU Integration - ' + flowName + ' Flow\n' +
' * Generated by PayU Payment Hub\n' +
' * Hash Type: ' + hashMetadata.hashType + '\n' +
' * \n' +
' * Instructions:\n' +
' * 1. Replace YOUR_MERCHANT_KEY with your actual PayU merchant key\n' +
' * 2. Replace YOUR_MERCHANT_SALT with your actual PayU merchant salt\n' +
' * 3. Run: node payu_integration.js\n' +
' * 4. The program will print HTML code to console - copy and save as .html file\n' +
' * 5. Open the HTML file in a browser to complete payment (auto-redirects to PayU)\n' +
' * \n' +
' * Note: crypto module is built-in to Node.js, no installation needed\n' +
' */\n' +
'\n' +
"const crypto = require('crypto');\n" +
'\n' +
'// REPLACE THESE WITH YOUR ACTUAL CREDENTIALS\n' +
"const MERCHANT_KEY = 'YOUR_MERCHANT_KEY';\n" +
"const MERCHANT_SALT = 'YOUR_MERCHANT_SALT';\n" +
"const PAYU_URL = 'https://test.payu.in/_payment';\n" +
'\n' +
'/**\n' +
' * Generate unique transaction ID with random component\n' +
' */\n' +
'function generateTransactionId() {\n' +
'    const timestamp = Date.now();\n' +
'    const random = Math.floor(Math.random() * 10000);\n' +
'    return `TXN$' + '{timestamp}' + '$' + '{random}' + '`;\n' +
'}\n' +
'\n' +
'/**\n' +
' * Generate SHA512 hash for payment parameters\n' +
' * Hash Type: ' + hashMetadata.hashType + '\n' +
' */\n' +
'function generateHash(params) {\n' +
'    // Build hash string in PayU format for ' + flowName + ' flow\n' +
hashStringCode + '\n' +
'    \n' +
'    // Debug: Print hash string (remove in production)\n' +
'    console.log("[DEBUG] Hash String:", hashString);\n' +
'    \n' +
"    return crypto.createHash('sha512').update(hashString).digest('hex');\n" +
'}\n' +
nodeSplitFunction +
nodeCartDetailsFunction +
'\n' +
'/**\n' +
' * Initiate payment\n' +
' */\n' +
'function initiatePayment() {\n' +
'    // Payment parameters - prefilled from your form\n' +
'    const params = {\n' +
'        key: MERCHANT_KEY,\n' +
'        \n' +
'        // Generate unique transaction ID\n' +
'        txnid: generateTransactionId(),\n' +
'        \n' +
paramsObj + '\n' +
'    };\n' +
nodeSplitUsage +
nodeCartDetailsUsage +
'    \n' +
'    // Generate hash\n' +
'    const hash = generateHash(params);\n' +
'    params.hash = hash;\n' +
'    \n' +
'    // Create HTML form with auto-submit\n' +
'    let html = `<!DOCTYPE html>\n' +
'<html>\n' +
'<head>\n' +
"<meta charset='UTF-8'>\n" +
'<title>Redirecting to PayU...</title>\n' +
'<style>\n' +
'body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }\n' +
'h3 { color: #333; }\n' +
'.loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px auto; }\n' +
'@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\n' +
'</style>\n' +
'</head>\n' +
"<body onload='document.payuForm.submit()'>\n" +
'<h3>Please wait while we redirect you to PayU...</h3>\n' +
"<div class='loader'></div>\n" +
"<form name='payuForm' method='post' action='$" + '{PAYU_URL}' + "'>\n" +
'`;\n' +
'    \n' +
'    for (const [key, value] of Object.entries(params)) {\n' +
"        html += `  <input type='hidden' name='$" + '{key}' + "' value='$" + '{value}' + "' />\\n`;\n" +
'    }\n' +
'    \n' +
"    html += `  <button type='submit' style='margin-top: 20px; padding: 10px 30px; font-size: 16px; cursor: pointer;'>Pay Now</button>\n" +
'</form>\n' +
'</body>\n' +
'</html>`;\n' +
'    \n' +
'    // Print HTML to console (merchant can copy-paste and save as .html file)\n' +
"    console.log('\\\\n=== Payment Integration Ready ===');\n" +
'    console.log(`[SUCCESS] Transaction ID: $' + '{params.txnid}' + '`);\n' +
'    console.log(`[SUCCESS] Generated Hash: $' + '{hash}' + '`);\n' +
"    console.log('\\\\n=== COPY THE HTML BELOW ===\\\\n');\n" +
'    console.log(html);\n' +
"    console.log('\\\\n=== END OF HTML ===');\n" +
"    console.log('\\\\n[INSTRUCTIONS]:');\n" +
"    console.log('1. Copy the HTML code above (between the markers)');\n" +
"    console.log('2. Save it as a .html file (e.g., payu_payment.html)');\n" +
"    console.log('3. Open the file in a browser to complete payment');\n" +
"    console.log('4. The page will auto-redirect to PayU payment gateway');\n" +
'}\n' +
'\n' +
'// Execute payment\n' +
"console.log('====================================');\n" +
"console.log('   PayU Payment Integration');\n" +
"console.log('   Flow: " + flowName.toUpperCase() + "');\n" +
"console.log('====================================');\n" +
"console.log('\\\\nInitiating payment...');\n" +
'initiatePayment();';
            
            return generatedCode;
        }
        
        // Make all functions globally accessible for inline onclick handlers
        window.loadSelectedFlow = loadSelectedFlow;
        window.backToLanding = backToLanding;
        window.selectPaymentType = selectPaymentType;
        window.toggleCustomKeys = toggleCustomKeys;
        window.toggleSaltVisibility = toggleSaltVisibility;
        window.toggleUdfParams = toggleUdfParams;
        window.generateTemplate = generateTemplate;
        window.addSplitRow = addSplitRow;
        window.removeSplitRow = removeSplitRow;
        window.updateSplitPlaceholders = updateSplitPlaceholders;
        window.addBankOfferSkuRow = addBankOfferSkuRow;
        window.removeBankOfferSkuRow = removeBankOfferSkuRow;
        window.toggleSkuOffers = toggleSkuOffers;
        window.copyBankOfferJson = copyBankOfferJson;
        window.showDebugInfo = showDebugInfo;
        window.showCurlCommand = showCurlCommand;
        window.showCodeGeneratorModal = showCodeGeneratorModal;
        window.closeCodeGeneratorModal = closeCodeGeneratorModal;
        window.switchCodeTab = switchCodeTab;
        window.copyCode = copyCode;
        window.downloadCode = downloadCode;
        window.submitPayment = submitPayment;
        window.launchCheckoutPlus = launchCheckoutPlus;
        window.resetFormFields = resetFormFields;
