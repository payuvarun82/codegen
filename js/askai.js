/**
 * PayU Ask AI — Integration Lab chat client
 * Talks to Ask AI via same-origin askai-proxy.php (avoids docs-only CORS).
 */
(function (window, $) {
    'use strict';

    if (!$ || !$.fn) {
        console.error('Ask AI requires jQuery');
        return;
    }

    var BaseUrl = 'askai-proxy.php';
    var sessionId = '';
    var deviceId = '';
    var isFirstMessage = true;
    var isTyping = false;
    var typingTimeout = null;
    var messages = { queries: [] };
    var originalContent = '';
    var exampleQuestions = [
        'How do I integrate PayU Hosted Checkout?',
        'Where do I find test credentials?',
        'How do I handle webhooks for refunds?'
    ];

    var replySvg =
        '<svg width="22" class="reply-svg" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M1.34375 8.04219V3.33003C1.34375 1.15192 3.3989 -0.438905 5.50481 0.108667L18.9801 3.61242C20.4459 3.99355 21.4699 5.31771 21.4699 6.83378V18.6962C21.4697 20.1298 20.552 21.4025 19.193 21.8547L6.86947 25.9552C6.41101 26.1075 5.91586 25.8589 5.76348 25.4C5.61105 24.9409 5.85948 24.4454 6.31807 24.2929L18.6416 20.1924C19.2851 19.9781 19.7186 19.3751 19.7188 18.6962V6.83378C19.7188 6.11571 19.2347 5.48843 18.5404 5.30781L5.06518 1.80406C4.06764 1.54469 3.09376 2.29829 3.09376 3.33003V8.04219C3.09376 8.52597 2.70202 8.91812 2.21875 8.91812C1.73549 8.91812 1.34375 8.52597 1.34375 8.04219Z" fill="url(#askaiPaint0)"/>' +
        '<path d="M2.29202 18.3608C2.31904 18.263 2.45779 18.263 2.48481 18.3608L2.74185 19.2917C2.8367 19.6352 3.10718 19.9022 3.45185 19.9927L4.40841 20.2439C4.50788 20.27 4.50788 20.4112 4.40841 20.4373L3.45185 20.6884C3.10718 20.7789 2.8367 21.046 2.74185 21.3895L2.48481 22.3204C2.45779 22.4182 2.31904 22.4182 2.29202 22.3204L2.03497 21.3895C1.94012 21.046 1.66965 20.7789 1.32498 20.6884L0.368417 20.4373C0.268941 20.4112 0.268941 20.27 0.368417 20.2439L1.32498 19.9927C1.66965 19.9022 1.94012 19.6352 2.03497 19.2917L2.29202 18.3608Z" fill="url(#askaiPaint1)"/>' +
        '<path d="M7.72026 7.13175C7.77429 6.93607 8.05179 6.93607 8.10583 7.13175L9.13199 10.8479C9.41654 11.8784 10.228 12.6796 11.262 12.9511L15.0893 13.9559C15.2882 14.0081 15.2882 14.2905 15.0893 14.3428L11.262 15.3476C10.228 15.619 9.41654 16.4202 9.13199 17.4507L8.10583 21.1669C8.05179 21.3626 7.77429 21.3626 7.72026 21.1669L6.69409 17.4507C6.40954 16.4202 5.59812 15.619 4.56411 15.3476L0.736834 14.3428C0.537882 14.2905 0.537882 14.0081 0.736834 13.9559L4.56411 12.9511C5.59812 12.6796 6.40954 11.8784 6.69409 10.8479L7.72026 7.13175Z" fill="url(#askaiPaint2)"/>' +
        '<defs>' +
        '<linearGradient id="askaiPaint0" x1="5.37" y1="1.18" x2="16.16" y2="33.35" gradientUnits="userSpaceOnUse"><stop stop-color="#9E25C9"/><stop offset="0.52" stop-color="#D22777"/><stop offset="1" stop-color="#D28E27"/></linearGradient>' +
        '<linearGradient id="askaiPaint1" x1="0.96" y1="18.22" x2="2.48" y2="24.25" gradientUnits="userSpaceOnUse"><stop stop-color="#9E25C9"/><stop offset="0.52" stop-color="#D22777"/><stop offset="1" stop-color="#D28E27"/></linearGradient>' +
        '<linearGradient id="askaiPaint2" x1="3.17" y1="7.14" x2="12.86" y2="40.62" gradientUnits="userSpaceOnUse"><stop stop-color="#9E25C9"/><stop offset="0.52" stop-color="#D22777"/><stop offset="1" stop-color="#D28E27"/></linearGradient>' +
        '</defs></svg>';

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function scrollToBottom() {
        var chatMessages = document.querySelector('.chat-messages');
        if (!chatMessages) return;
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
    }

    function updatePlaceholder() {
        var inputField = document.querySelector('.chat-input textarea');
        if (!inputField) return;
        inputField.placeholder = isFirstMessage
            ? 'Write an elaborate query and press enter to get a response'
            : 'Ask a follow-up question';
    }

    function updateButton(typing) {
        var inputField = document.querySelector('.chat-input textarea');
        var button = document.querySelector('.send-btn');
        if (!inputField || !button) return;
        var inputValue = inputField.value.trim();
        button.classList.toggle('is-ready', !!inputValue && !typing);
        button.classList.toggle('is-typing', !!typing);
        if (!typing) {
            // Circle + arrow live entirely in the SVG (no CSS background behind it)
            var circleFill = inputValue ? '#E6F5F1' : '#F5F5F5';
            var arrowFill = inputValue ? '#0C6150' : '#999999';
            button.innerHTML =
                '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
                '<circle cx="16" cy="16" r="16" fill="' + circleFill + '"/>' +
                '<path d="M21.92 15.62C21.8724 15.4973 21.801 15.3851 21.71 15.29L16.71 10.29C16.6168 10.1968 16.5061 10.1228 16.3842 10.0723C16.2624 10.0219 16.1319 9.99591 16 9.99591C15.7337 9.99591 15.4783 10.1017 15.29 10.29C15.1968 10.3832 15.1228 10.4939 15.0723 10.6158C15.0219 10.7376 14.9959 10.8681 14.9959 11C14.9959 11.2663 15.1017 11.5217 15.29 11.71L18.59 15H11C10.7348 15 10.4804 15.1054 10.2929 15.2929C10.1054 15.4804 10 15.7348 10 16C10 16.2652 10.1054 16.5196 10.2929 16.7071C10.4804 16.8946 10.7348 17 11 17H18.59L15.29 20.29C15.1963 20.383 15.1219 20.4936 15.0711 20.6154C15.0203 20.7373 14.9942 20.868 14.9942 21C14.9942 21.132 15.0203 21.2627 15.0711 21.3846C15.1219 21.5064 15.1963 21.617 15.29 21.71C15.383 21.8037 15.4936 21.8781 15.6154 21.9289C15.7373 21.9797 15.868 22.0058 16 22.0058C16.132 22.0058 16.2627 21.9797 16.3846 21.9289C16.5064 21.8781 16.617 21.8037 16.71 21.71L21.71 16.71C21.801 16.6149 21.8724 16.5028 21.92 16.38C22.02 16.1365 22.02 15.8635 21.92 15.62Z" fill="' +
                arrowFill +
                '"/>' +
                '</svg>';
        } else {
            button.innerHTML =
                '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
                '<circle cx="16" cy="16" r="16" fill="#F5F5F5"/>' +
                '<rect x="11" y="9" width="3.5" height="14" rx="1" fill="#999999"/>' +
                '<rect x="17.5" y="9" width="3.5" height="14" rx="1" fill="#999999"/>' +
                '</svg>';
        }
    }

    function adjustTextareaAndScroll() {
        var inputField = document.querySelector('.chat-input textarea');
        if (!inputField) return;
        var minHeight = 44;
        var maxHeight = 150;
        inputField.style.height = 'auto';
        var newHeight = Math.max(minHeight, Math.min(inputField.scrollHeight, maxHeight));
        inputField.style.height = newHeight + 'px';
        scrollToBottom();
    }

    function appendQuestions(questions) {
        var questionsList = $('.questions-list');
        questionsList.empty();
        questions.forEach(function (question) {
            questionsList.append(
                '<div class="example-question"><div class="question-content"><span>' +
                    escapeHtml(question) +
                    '</span></div></div>'
            );
        });
    }

    function ensureDeviceId(callback) {
        if (deviceId) {
            callback(deviceId);
            return;
        }
        if (window.FingerprintJS) {
            FingerprintJS.load()
                .then(function (fp) { return fp.get(); })
                .then(function (result) {
                    deviceId = result.visitorId;
                    callback(deviceId);
                })
                .catch(function () {
                    deviceId = 'lab-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
                    callback(deviceId);
                });
        } else {
            deviceId = 'lab-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
            callback(deviceId);
        }
    }

    function openChatModal() {
        $('.chat-overlay').addClass('is-visible');
        $('.chat-container').addClass('is-visible');
        $('body').css({ overflow: 'hidden' });
        adjustTextareaAndScroll();
        if (typeof trackEvent === 'function') {
            trackEvent('ask_ai_opened', { source: 'integration_lab_header' });
        }
    }

    function closeChatModal() {
        $('.chat-overlay').removeClass('is-visible');
        $('.chat-container').removeClass('is-visible');
        $('body').css('overflow', 'auto');
        setTimeout(refreshChatModal, 300);
    }

    function refreshChatModal() {
        $('#chat-messages').html(originalContent);
        appendQuestions(exampleQuestions);
        $('.chat-input textarea').val('');
        sessionId = '';
        $('.response-footer').hide();
        $('.restart-btn').removeClass('is-visible').hide();
        isFirstMessage = true;
        updatePlaceholder();
        isTyping = false;
        updateButton(false);
        adjustTextareaAndScroll();
        $('.chat-messages').addClass('initial-view');
        messages = { queries: [] };
    }

    function formatText(text) {
        return String(text || '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/```([\s\S]*?)```/g, '<code>$1</code>')
            .replace(/^\d+\.\s*(.*)$/gm, '')
            .replace(/(?<!<pre>[\s\S]*?)\\n/g, '<br>')
            .replace(/["“”']/g, '')
            .replace(/⚠/g, '')
            .replace(/`/g, '')
            .replace(/\n\n+/g, '\n\n')
            .trim();
    }

    function replacePreTags(htmlString, codeId) {
        return htmlString.replace(
            /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
            function (_, lang, codeContent) {
                return (
                    '<div class="bot-message terminal-style">' +
                    '<div class="terminal-header">' +
                    '<span class="terminal-language">' +
                    escapeHtml(lang) +
                    '</span>' +
                    '<span class="copy-btn" data-code-id="' +
                    escapeHtml(codeId) +
                    '">' +
                    '<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 6.45C15.49 6.37 15.47 6.3 15.45 6.23V6.15C15.41 6.06 15.36 5.99 15.29 5.92L10.29 0.92C10.22 0.85 10.14 0.8 10.06 0.76C10.03 0.75 10.01 0.75 9.98 0.76C9.9 0.71 9.81 0.68 9.71 0.67H6.33C5.67 0.67 5.03 0.93 4.57 1.4C4.1 1.87 3.83 2.5 3.83 3.17V4H3C2.34 4 1.7 4.26 1.23 4.73C0.76 5.2 0.5 5.84 0.5 6.5V14.83C0.5 15.5 0.76 16.13 1.23 16.6C1.7 17.07 2.34 17.33 3 17.33H9.67C10.33 17.33 10.97 17.07 11.43 16.6C11.9 16.13 12.17 15.5 12.17 14.83V14H13C13.66 14 14.3 13.74 14.77 13.27C15.24 12.8 15.5 12.16 15.5 11.5V6.5V6.45ZM10.5 3.51L12.66 5.67H11.33C11.11 5.67 10.9 5.58 10.74 5.42C10.59 5.27 10.5 5.05 10.5 4.83V3.51ZM10.5 14.83C10.5 15.05 10.41 15.27 10.26 15.42C10.1 15.58 9.89 15.67 9.67 15.67H3C2.78 15.67 2.57 15.58 2.41 15.42C2.25 15.27 2.17 15.05 2.17 14.83V6.5C2.17 6.28 2.25 6.07 2.41 5.91C2.57 5.75 2.78 5.67 3 5.67H3.83V11.5C3.83 12.16 4.1 12.8 4.57 13.27C5.03 13.74 5.67 14 6.33 14H10.5V14.83ZM13.83 11.5C13.83 11.72 13.75 11.93 13.59 12.09C13.43 12.25 13.22 12.33 13 12.33H6.33C6.11 12.33 5.9 12.25 5.74 12.09C5.59 11.93 5.5 11.72 5.5 11.5V3.17C5.5 2.95 5.59 2.73 5.74 2.58C5.9 2.42 6.11 2.33 6.33 2.33H8.83V4.83C8.83 5.5 9.1 6.13 9.57 6.6C10.03 7.07 10.67 7.33 11.33 7.33H13.83V11.5Z" fill="#999999" stroke="#E5E7E9" stroke-width="0.5"/></svg>' +
                    '</span></div>' +
                    '<pre><code id="' +
                    escapeHtml(codeId) +
                    '" class="language-' +
                    escapeHtml(lang) +
                    ' code-to-animate">' +
                    codeContent +
                    '</code></pre></div>'
                );
            }
        );
    }

    function typeText(element, text, delay, callback) {
        var index = 0;
        var markUp = '';
        isTyping = true;
        updateButton(true);

        function type() {
            if (index < text.length) {
                markUp += text.charAt(index);
                element.innerHTML = markUp;
                index++;
                typingTimeout = setTimeout(type, delay);
            } else {
                isTyping = false;
                updateButton(false);
                if (callback) callback();
            }
        }
        type();
    }

    function animateFragment(container, fragment, callback) {
        var nodes = Array.from(fragment.childNodes);
        var i = 0;

        function renderNext() {
            if (i >= nodes.length) {
                if (callback) callback();
                return;
            }
            var node = nodes[i++];
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                var span = document.createElement('span');
                container.appendChild(span);
                typeText(span, node.textContent, 5, renderNext);
            } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.tagName !== 'PRE' &&
                node.tagName !== 'CODE'
            ) {
                var clone = node.cloneNode(false);
                container.appendChild(clone);
                animateFragment(clone, node, renderNext);
            } else {
                container.appendChild(node);
                renderNext();
            }
        }
        renderNext();
    }

    function getChatMessages() {
        var chatContainer = document.querySelector('.chat-container');
        if (!chatContainer) return messages;
        chatContainer.querySelectorAll('.user-message').forEach(function (msg) {
            var text = msg.innerText.trim();
            if (text && messages.queries.indexOf(text) === -1) {
                messages.queries.push(text);
            }
        });
        return messages;
    }

    function appendSourcesAndFeedback(container, sources, geminiResponse) {
        getChatMessages();
        if (typeof container === 'string') container = document.querySelector(container);
        if (!container) return;

        var sourcesHTML = '';
        if (sources && sources.length > 0) {
            sourcesHTML = '<div class="sources-section"><h4>Top Sources</h4><ol class="sources-list">';
            sources.forEach(function (source) {
                var formattedName = String(source.name || '')
                    .split('-')
                    .map(function (word) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    })
                    .join(' ');
                sourcesHTML +=
                    '<li><a href="' +
                    escapeHtml(source.link) +
                    '" target="_blank" rel="noopener noreferrer">' +
                    escapeHtml(formattedName) +
                    '</a></li>';
            });
            sourcesHTML += '</ol></div>';
        }

        var feedbackHTML = geminiResponse.feedback_required
            ? '<div class="feedback-section" data-response-id="' +
              escapeHtml(geminiResponse.response_id) +
              '" data-session-id="' +
              escapeHtml(geminiResponse.session_id) +
              '" data-current-feedback="none">' +
              '<button class="feedback-btn" data-feedback="true" type="button" aria-label="Helpful"><span><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.96209 11.594C3.91689 14.5622 6.3276 16.7846 10.0491 16.8147L11.134 16.8223C12.151 16.8298 12.9194 16.7545 13.3714 16.6415C14.0494 16.4682 14.6521 16.0463 14.6521 15.2779C14.6521 14.9841 14.5768 14.7581 14.4788 14.5848C14.4261 14.4944 14.4412 14.4266 14.5165 14.389C15.0288 14.1629 15.4205 13.6883 15.4205 13.0555C15.4205 12.709 15.315 12.385 15.1493 12.1515C15.074 12.0536 15.089 11.9632 15.2096 11.8878C15.5712 11.6618 15.8198 11.2023 15.8198 10.6749C15.8198 10.2983 15.6993 9.90653 15.4958 9.70313C15.3904 9.60519 15.4054 9.53739 15.5185 9.43945C15.7746 9.21345 15.9177 8.83678 15.9177 8.3923C15.9177 7.57868 15.2924 6.9308 14.4638 6.9308H11.6613C10.9833 6.9308 10.5388 6.58426 10.5388 6.04185C10.5388 4.98717 11.8798 3.02846 11.8798 1.60463C11.8798 0.836218 11.3826 0.361609 10.7121 0.361609C10.132 0.361609 9.82314 0.745817 9.49167 1.3937C8.30891 3.69141 6.73441 5.55218 5.52905 7.15681C4.4819 8.54297 3.99222 9.73326 3.96209 11.594ZM0.0371466 11.6618C0.0371466 14.0725 1.53631 16.0614 3.54022 16.0614H4.88871C3.48748 14.9916 2.817 13.3945 2.84713 11.579C2.87727 9.62026 3.57788 8.20396 4.31616 7.22461H3.23888C1.42331 7.22461 0.0371466 9.16825 0.0371466 11.6618Z" stroke="#A4B0AD" stroke-width="1" fill="none"/></svg></span></button>' +
              '<button class="feedback-btn" data-feedback="false" type="button" aria-label="Not helpful"><span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.1738 9.36831C20.1738 6.70899 18.4713 4.53181 16.2866 4.53181H13.808C12.791 4.012 11.5857 3.71066 10.2598 3.71066H9.20508C8.22573 3.71066 7.38951 3.77093 6.8471 3.90653C5.73968 4.17774 5.03906 4.96875 5.03906 5.95564C5.03906 6.12891 5.0692 6.29465 5.1144 6.45285C4.59459 6.85966 4.30078 7.44727 4.30078 8.09515C4.30078 8.39649 4.36105 8.69029 4.46652 8.9389C4.11998 9.30804 3.91657 9.84292 3.91657 10.3929C3.91657 10.7545 4.00698 11.1236 4.15765 11.4099C3.94671 11.7263 3.82617 12.1557 3.82617 12.6303C3.82617 13.8357 4.74526 14.7623 5.93555 14.7623H8.738C8.89621 14.7623 9.00167 14.8376 8.99414 14.9808C8.95647 15.7567 7.73605 17.625 7.73605 19.1543C7.73605 20.2768 8.52706 21.0979 9.61942 21.0979C10.4104 21.0979 10.9528 20.6836 11.4727 19.6967C12.4143 17.8887 13.5444 16.3066 15.2243 14.2349H16.5728C18.6219 14.2349 20.1738 12.0728 20.1738 9.36831ZM15.4805 9.42858C15.4805 11.0257 15.1264 12.0427 14.1018 13.4138C12.9643 14.9356 11.3823 16.7737 10.2447 19.0488C10.0036 19.5234 9.83789 19.6364 9.60435 19.6364C9.31808 19.6364 9.12974 19.433 9.12974 19.0714C9.12974 17.9565 10.4029 16.0882 10.4029 14.8602C10.4029 13.9562 9.67215 13.3686 8.67773 13.3686H5.97321C5.53627 13.3686 5.21233 13.0446 5.21233 12.6077C5.21233 12.2988 5.3178 12.0954 5.57394 11.8393C5.76981 11.6359 5.79994 11.3496 5.62667 11.1537C5.4082 10.8449 5.3178 10.649 5.3178 10.3929C5.3178 10.084 5.46094 9.82032 5.76228 9.59431C6.01842 9.41351 6.10882 9.10464 5.95815 8.8033C5.79994 8.50196 5.71708 8.34375 5.71708 8.11022C5.71708 7.74861 5.95061 7.46987 6.41769 7.22127C6.66629 7.08566 6.7341 6.82199 6.62863 6.58092C6.47042 6.19671 6.44782 6.12891 6.45536 5.96317C6.45536 5.63923 6.6889 5.3831 7.19364 5.25503C7.63811 5.14202 8.34626 5.09682 9.28041 5.10436L10.2522 5.11189C13.3711 5.14202 15.4805 6.88979 15.4805 9.42858ZM18.8103 9.36831C18.8103 11.2818 17.8234 12.8111 16.6934 12.8563C16.4975 12.8638 16.3016 12.8638 16.1057 12.8638C16.6406 11.8167 16.8742 10.7319 16.8742 9.42858C16.8742 8.04241 16.392 6.82199 15.5181 5.86524C15.7969 5.86524 16.0831 5.87277 16.3694 5.87277C17.6878 5.92551 18.8103 7.46987 18.8103 9.36831Z" fill="#A4B0AD"/></svg></span></button>' +
              '</div>'
            : '';

        container.insertAdjacentHTML(
            'beforeend',
            '<div class="response-footer">' + sourcesHTML + feedbackHTML + '</div>'
        );
        setTimeout(scrollToBottom, 100);
    }

    function updateFeedbackButtonUI(isLiked, feedbackSection) {
        var likeBtn = feedbackSection.find('.feedback-btn[data-feedback="true"]');
        var dislikeBtn = feedbackSection.find('.feedback-btn[data-feedback="false"]');
        likeBtn.find('svg path').css({ fill: 'none', stroke: '#A4B0AD' });
        dislikeBtn.find('svg path').css({ fill: '#A4B0AD', stroke: '' });
        if (isLiked === true) {
            feedbackSection.attr('data-current-feedback', 'true');
            likeBtn.find('svg path').css({ fill: '#0C6150', stroke: '#0C6150' });
        } else if (isLiked === false) {
            feedbackSection.attr('data-current-feedback', 'false');
            dislikeBtn.find('svg path').css({ fill: '#0C6150', stroke: '#0C6150' });
        } else {
            feedbackSection.attr('data-current-feedback', 'none');
        }
    }

    function handleFeedback(responseId, feedbackSessionId, isLiked, feedbackSection) {
        var payload = {
            response_id: responseId,
            session_id: feedbackSessionId,
            is_liked: isLiked,
            deviceId: deviceId
        };
        var previousFeedback = feedbackSection.attr('data-current-feedback');
        updateFeedbackButtonUI(isLiked, feedbackSection);
        $.ajax({
            url: BaseUrl + '?action=feedback',
            method: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            dataType: 'json',
            error: function () {
                var revertValue =
                    previousFeedback === 'true' ? true : previousFeedback === 'false' ? false : null;
                updateFeedbackButtonUI(revertValue, feedbackSection);
            }
        });
    }

    function sendQuery(querys, currentDeviceId) {
        var inputField = document.querySelector('.chat-input textarea');
        var query = inputField ? inputField.value.trim() : '';
        var userQuery = query || querys;
        if (!userQuery) return;

        $('.initial-content-wrapper').hide();
        $('.chat-messages').removeClass('initial-view');
        $('.restart-btn').addClass('is-visible').show();
        $('.chat-messages').append(
            '<div class="user-message"><span class="user-message-text">' +
                escapeHtml(userQuery) +
                '</span></div>'
        );
        $('.chat-input textarea').val('').prop('disabled', true);
        setTimeout(scrollToBottom, 100);
        $('.chat-messages').append(
            '<div class="thinking-indicators">' +
                replySvg +
                '<span class="thinking-text">Thinking</span>' +
                '<svg class="dots" width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="4" r="1.5" fill="#D22777"/><circle cx="4" cy="8" r="1.5" fill="#D22777"/><circle cx="4" cy="12" r="1.5" fill="#D22777"/></svg>' +
                '</div>'
        );

        var requestData = {
            question: userQuery
        };
        if (sessionId) requestData.session_id = sessionId;
        if (currentDeviceId) requestData.deviceId = currentDeviceId;

        var isResponseAdded = false;

        $.ajax({
            url: BaseUrl + '?action=ask',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestData),
            success: function (responses) {
                $('.chat-messages .thinking-indicators').remove();
                $('.chat-input textarea').val('').prop('disabled', false);

                if (!responses || responses.error) {
                    $('.chat-messages').append(
                        '<div class="bot-message-error"><div class="error-container"><span>' +
                            escapeHtml((responses && (responses.error || responses.detail)) || 'Something went wrong. Please try again.') +
                            '</span></div></div>'
                    );
                    updateButton(false);
                    return;
                }

                if (responses.session_id) sessionId = responses.session_id;
                var chatContainer = document.getElementById('chat-messages');
                setTimeout(scrollToBottom, 100);

                var responseText = responses.response || '';
                if (
                    responseText.indexOf('Connection timed out') !== -1 ||
                    responseText.indexOf('Error during chat processing') !== -1
                ) {
                    $('.chat-messages').append(
                        '<div class="bot-message-error"><div class="error-container"><span>' +
                            formatText(responseText) +
                            '</span></div></div>'
                    );
                    updateButton(false);
                    return;
                }

                if (isResponseAdded) return;
                isResponseAdded = true;
                updateButton(false);

                var formattedResponse = responseText
                    .replace(/```markdown\n?/g, '')
                    .replace(/```$/g, '');

                var summaryContainer = document.createElement('div');
                summaryContainer.className = 'reply-message';
                summaryContainer.insertAdjacentHTML('afterbegin', replySvg);
                var summaryP = document.createElement('p');
                summaryP.className = 'reply-text';
                summaryContainer.appendChild(summaryP);
                chatContainer.appendChild(summaryContainer);

                var cleaned = formattedResponse
                    .replace(/\\n/g, '\n')
                    .trim()
                    .replace(/ {2,}/g, ' ')
                    .replace(/([,:;])\s{2,}/g, '$1 ')
                    .replace(/\n-\s+/g, '\n- ')
                    .replace(/(-\s[^\n]+)\n([^-\n#])/g, '$1\n\n$2')
                    .replace(/([^\n])\n+(#{1,6}\s)/g, '$1\n\n$2')
                    .replace(/(#{1,6}\s+[^\n]+)\n+(?!\n)/g, '$1\n\n')
                    .replace(/([.!?])\n([A-Z])/g, '$1\n\n$2');

                var markedResponse = '';
                if (window.marked && typeof marked.parse === 'function') {
                    markedResponse = marked.parse(cleaned);
                } else {
                    markedResponse = '<p>' + escapeHtml(cleaned).replace(/\n/g, '<br>') + '</p>';
                }

                markedResponse = markedResponse.replace(
                    /<a\s+(?:[^>]*?)href="([^"]*?)"((?:[^>]*?)?)>/gi,
                    function (match, href, attrs) {
                        if (!attrs || attrs.indexOf('target="_blank"') === -1) {
                            return (
                                '<a href="' +
                                href +
                                '" target="_blank" rel="noopener noreferrer"' +
                                (attrs ? ' ' + attrs.trim() : '') +
                                '>'
                            );
                        }
                        return match;
                    }
                );

                var finalResult = replacePreTags(markedResponse, responses.response_id || 'code-' + Date.now());
                summaryP.textContent = '';
                var tempWrapper = document.createElement('div');
                tempWrapper.innerHTML = finalResult;

                animateFragment(summaryP, tempWrapper, function () {
                    if (window.hljs) hljs.highlightAll();
                    scrollToBottom();
                });
                if (window.hljs) hljs.highlightAll();

                setTimeout(function () {
                    appendSourcesAndFeedback(chatContainer, responses.sources || [], responses);
                    $('.response-footer').hide().fadeIn(500);
                }, 300);
            },
            error: function (xhr) {
                $('.chat-messages .thinking-indicators').remove();
                $('.chat-input textarea').val('').prop('disabled', false);
                var msg = 'Unable to reach Ask AI. Please try again.';
                try {
                    var parsed = JSON.parse(xhr.responseText);
                    if (parsed && (parsed.error || parsed.detail || parsed.response)) {
                        msg = parsed.error || parsed.detail || parsed.response;
                    }
                } catch (e) { /* ignore */ }
                $('.chat-messages').append(
                    '<div class="bot-message-error"><div class="error-container"><span>' +
                        escapeHtml(msg) +
                        '</span></div></div>'
                );
                updateButton(false);
            }
        });
    }

    function initAskAi() {
        if (!$('#chat-messages').length) return;

        if (window.marked && marked.setOptions) {
            marked.setOptions({ gfm: true, breaks: true, tables: true, langPrefix: 'language-' });
        }

        originalContent = $('#chat-messages').html();
        appendQuestions(exampleQuestions);
        updatePlaceholder();
        updateButton(false);
        $('.restart-btn').removeClass('is-visible').hide();

        var inputField = document.querySelector('.chat-input textarea');
        if (inputField) {
            inputField.addEventListener('input', function () {
                adjustTextareaAndScroll();
                updateButton(false);
            });
            inputField.addEventListener('keydown', function (event) {
                if (event.key === 'ArrowUp' && this.value.trim() === '') {
                    event.preventDefault();
                    if (messages.queries.length > 0) {
                        $(this).val(messages.queries[messages.queries.length - 1]);
                        adjustTextareaAndScroll();
                    }
                }
            });
        }

        $(document).on('click', '.header-askai-btn, .model-btn, .model-btn_mob', function (e) {
            e.preventDefault();
            openChatModal();
        });

        $(document).on('click', '.chat-overlay', function () {
            closeChatModal();
        });

        $(document).on('click', '.chat-container .close-btn', function () {
            closeChatModal();
        });

        $(document).on('click', '.restart-btn', function () {
            refreshChatModal();
        });

        $(document).on('click', '.send-btn', function () {
            if (isTyping) {
                clearTimeout(typingTimeout);
                updateButton(false);
                isTyping = false;
                return;
            }
            var value = $('.chat-input textarea').val().trim();
            if (!value) return;
            ensureDeviceId(function (id) {
                sendQuery(null, id);
                $('.chat-input textarea').val('');
                updateButton(false);
                isFirstMessage = false;
                updatePlaceholder();
            });
        });

        $(document).on('keypress', '.chat-input textarea', function (event) {
            if (event.which === 13 && !event.shiftKey) {
                event.preventDefault();
                ensureDeviceId(function (id) {
                    sendQuery(null, id);
                    $('.chat-input textarea').val('');
                    updateButton(false);
                    isFirstMessage = false;
                    updatePlaceholder();
                    adjustTextareaAndScroll();
                });
            }
        });

        $(document).on('click', '.example-question', function () {
            var questionText = $(this).find('span').text();
            $('.chat-input textarea').val(questionText);
            ensureDeviceId(function (id) {
                sendQuery(null, id);
                isFirstMessage = false;
                updatePlaceholder();
            });
        });

        $(document).on('click', '.copy-btn', function () {
            var codeId = $(this).attr('data-code-id');
            var codeBlock = document.getElementById(codeId);
            var btn = $(this);
            if (!codeBlock) return;
            navigator.clipboard.writeText(codeBlock.innerText.trim()).then(function () {
                var prev = btn.html();
                btn.text('Copied');
                setTimeout(function () { btn.html(prev); }, 1000);
            });
        });

        $(document).on('click', '.feedback-btn', function () {
            var button = this;
            var feedbackSection = $(button).closest('.feedback-section');
            var isLikeBtn = button.getAttribute('data-feedback') === 'true';
            var responseId = feedbackSection.attr('data-response-id');
            var feedbackSessionId = feedbackSection.attr('data-session-id');
            var currentState = feedbackSection.attr('data-current-feedback');
            var isLiked;
            if ((isLikeBtn && currentState === 'true') || (!isLikeBtn && currentState === 'false')) {
                isLiked = null;
            } else {
                isLiked = isLikeBtn;
            }
            handleFeedback(responseId, feedbackSessionId, isLiked, feedbackSection);
        });

        $(document).on('keydown', function (ev) {
            if (ev.key === 'Escape' && $('.chat-container').hasClass('is-visible')) {
                closeChatModal();
            }
        });
    }

    window.AskAI = {
        open: openChatModal,
        close: closeChatModal,
        refresh: refreshChatModal
    };

    // Keep existing header onclick="openAskAiModal()" working
    window.openAskAiModal = openChatModal;
    window.closeAskAiModal = closeChatModal;

    $(function () {
        initAskAi();
    });
})(window, window.jQuery);
