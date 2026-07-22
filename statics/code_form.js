document.addEventListener('DOMContentLoaded', function () {
  function initializeCf7Handlers(config) {
    const { isLang, EXCLUDED_SELECTOR, STYLE_ID, HIDE_CLASS, MESSAGES } = config;

    if (!isLang) return;

    // CSS to hide default messages, scoped to processed wrappers
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        .wpcf7.${HIDE_CLASS} .wpcf7-response-output,
        .wpcf7.${HIDE_CLASS} .screen-reader-response p,
        .wpcf7.${HIDE_CLASS} .screen-reader-response ul { display: none !important; }
      `;
      document.head.appendChild(style);
    }

    function clearMessages(form) {
      form.querySelector('.custom-error-message')?.remove();
      form.querySelector('.custom-success-message')?.remove();
    }

    function showMessage(form, text, type) {
      clearMessages(form);
      const box = document.createElement('div');
      box.className = type === 'success' ? 'custom-success-message' : 'custom-error-message';
      box.textContent = text;
      box.style.cssText =
        `padding:15px;margin:10px 0;background:${type === 'success' ? '#e8f5e9' : '#ffebee'};` +
        `color:${type === 'success' ? '#2e7d32' : '#c62828'};border-radius:4px;border-left:4px solid ${type === 'success' ? '#2e7d32' : '#c62828'};`;
      form.appendChild(box);
      if (type === 'success') setTimeout(() => box.remove(), 5000);
    }

    function setSubmittingState(form, on) {
      const btn = form.querySelector('button.wpcf7-submit');
      if (!btn) return;
      const textEl = btn.querySelector('.text') || btn; // fallback
      if (!btn.dataset.originalText) {
        btn.dataset.originalText =
          btn.getAttribute('data-original-text') ||
          (textEl.textContent || '').trim();
      }
      if (on) {
        textEl.textContent = MESSAGES.submitting;
        btn.disabled = true;
      } else {
        textEl.textContent = btn.dataset.originalText;
        btn.disabled = false;
      }
    }

    document.querySelectorAll('.wpcf7').forEach(wrapper => {
      const form = wrapper.querySelector('form.wpcf7-form');
      if (!form) return;

      if (form.querySelector(EXCLUDED_SELECTOR)) {
        return;
      }

      wrapper.classList.add(HIDE_CLASS);

      form.addEventListener('submit', function () {
        clearMessages(form);
        setSubmittingState(form, true);
      });

      form.addEventListener('wpcf7mailsent', function () {
        showMessage(form, MESSAGES.success, 'success');
        setSubmittingState(form, false);
      });

      form.addEventListener('wpcf7invalid', function () {
        showMessage(form, MESSAGES.invalid, 'error');
        setSubmittingState(form, false);
      });

      form.addEventListener('wpcf7mailfailed', function () {
        showMessage(form, MESSAGES.failed, 'error');
        setSubmittingState(form, false);
      });
    });
  }

  // --- Vietnamese Config ---
  initializeCf7Handlers({
    isLang: /^vi/i.test(document.documentElement.lang || '') || !/^\/en(\/|$)/i.test(location.pathname),
    EXCLUDED_SELECTOR: '#wp_112321',
    STYLE_ID: 'cf7-vi-style-scoped',
    HIDE_CLASS: 'cf7-vi-hide',
    MESSAGES: {
      submitting: 'Đang gửi...',
      success: 'Cảm ơn bạn! Yêu cầu của bạn đã được gửi.',
      invalid: 'Có một hoặc nhiều mục nhập có lỗi. Vui lòng kiểm tra lại.',
      failed: 'Không gửi được yêu cầu của bạn. Vui lòng thử lại.',
    },
  });

  // --- English Config ---
  initializeCf7Handlers({
    isLang: /^en/i.test(document.documentElement.lang || '') || /^\/en(\/|$)/i.test(location.pathname),
    EXCLUDED_SELECTOR: '#wp_112321_en',
    STYLE_ID: 'cf7-en-style',
    HIDE_CLASS: 'cf7-en-hide',
    MESSAGES: {
      submitting: 'Sending...',
      success: 'Thank you! Your request has been sent.',
      invalid: 'One or more fields have an error. Please check and try again.',
      failed: 'Your request could not be sent. Please try again.',
    },
  });
});
