/* ============================================================
   AAS TÍCH SẢN — INTERACTIVE APPLICATION LOGIC
   ============================================================ */
(function() {
  'use strict';

  // --- REGISTRATION LINK ---
  const REGISTRATION_URL = 'https://smarteb.aasp.vn/mo-tai-khoan';

  // --- UTILITY ---
  function formatVND(num) {
    num = Math.round(num);
    if (!isFinite(num) || num < 0) num = 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  }

  function parseVND(str) {
    const val = parseInt(String(str).replace(/[^0-9]/g, ''), 10);
    return isNaN(val) ? 0 : val;
  }

  // --- PREMIUM STROKE ICON SYSTEM ---
  const iconPaths = {
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M15 9l5-5m0 0v4m0-4h-4"/>',
    shield: '<path d="M12 3l7 3v5c0 4.7-2.8 8-7 10-4.2-2-7-5.3-7-10V6l7-3z"/><path d="M9 12l2 2 4-5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z"/>',
    eye: '<path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5M3 16l9 5 9-5"/>',
    sliders: '<path d="M4 6h7m4 0h5M4 12h2m4 0h10M4 18h10m4 0h2"/><circle cx="13" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
    analytics: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/><path d="M3 8l6-4 6 5 5-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.4 3.5-7 8-7s7.2 2.6 8 7"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M7.5 16.5c2-2 1-5 3-6.5s4 .5 6-2.5"/>',
    wallet: '<path d="M4 6h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a3 3 0 013-3h12"/><path d="M15 12h5v4h-5a2 2 0 010-4z"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M18.5 9A7 7 0 006 6.5L4 9m2 6a7 7 0 0012 2l2-2"/>',
    handshake: '<path d="M8 12l3-3a2 2 0 013 0l2 2m-8 1l4 4a2 2 0 003 0l5-5M2 8l4-3 3 3m13 0l-4-3-3 3"/><path d="M5 16l3 3m-1-5l4 4"/>',
    message: '<path d="M21 11.5a8.5 8.5 0 01-9 8.5 10 10 0 01-4-.8L3 21l1.8-4.5A8.5 8.5 0 1121 11.5z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>'
  };
  const strokeIcon = (name, tone = 'gold') => `<span class="stroke-icon ${tone}" aria-hidden="true"><svg viewBox="0 0 24 24">${iconPaths[name]}</svg></span>`;
  document.querySelectorAll('.why-header').forEach((el, i) => el.insertAdjacentHTML('afterbegin', strokeIcon(['target','shield','compass','eye'][i])));
  document.querySelectorAll('.method-card').forEach((el, i) => el.insertAdjacentHTML('afterbegin', strokeIcon(['layers','sliders','analytics'][i], 'inverse')));
  document.querySelector('.contact-form-card h3')?.insertAdjacentHTML('beforebegin', strokeIcon('message'));

  // --- NAVBAR SCROLL ---
  const navHeader = document.getElementById('navHeader');
  const allSections = Array.from(document.querySelectorAll('section'));

  function getLightSection() {
    const navH = navHeader ? navHeader.offsetHeight : 0;
    // Find which section's top edge has passed the bottom of navbar
    // (iterate in reverse → last one that scrolled past = current)
    let current = null;
    for (const sec of allSections) {
      const rect = sec.getBoundingClientRect();
      // section top is above or at navbar bottom AND section bottom is below navbar top
      if (rect.top <= navH && rect.bottom > 0) {
        current = sec;
      }
    }
    return current;
  }

  function handleNavScroll() {
    if (!navHeader) return;
    navHeader.classList.toggle('scrolled', window.scrollY > 40);

    const sec = getLightSection();
    const isLight = sec ? !sec.classList.contains('on-dark') : false;
    navHeader.classList.toggle('on-light', isLight);
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  // Also run on resize (section heights can change)
  window.addEventListener('resize', handleNavScroll, { passive: true });
  // Delay initial call so sections have rendered heights
  requestAnimationFrame(() => requestAnimationFrame(handleNavScroll));

  // --- MOBILE MENU DRAWER ---
  const burgerBtn    = document.getElementById('burgerBtn');
  const mobileMenu   = document.getElementById('mobileMenu');
  const menuOverlay  = document.getElementById('menuOverlay');
  const closeMenuBtn = document.getElementById('closeMenuBtn');

  function openMenu() {
    mobileMenu?.classList.add('open');
    menuOverlay?.classList.add('open');
    document.body.classList.add('menu-open');
    burgerBtn?.setAttribute('aria-expanded', 'true');
    mobileMenu?.setAttribute('aria-hidden', 'false');
  }
  function closeMenu() {
    mobileMenu?.classList.remove('open');
    menuOverlay?.classList.remove('open');
    document.body.classList.remove('menu-open');
    burgerBtn?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
  }

  burgerBtn?.addEventListener('click', openMenu);
  closeMenuBtn?.addEventListener('click', closeMenu);
  menuOverlay?.addEventListener('click', closeMenu);

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Close all mobile nav links (not just triggers)
  mobileMenu?.querySelectorAll('a').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  // Swipe left to close
  let touchStartX = 0;
  mobileMenu?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  mobileMenu?.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientX - touchStartX < -60) closeMenu();
  }, { passive: true });

  // --- AMBIENT CURSOR GLOW ---
  const glowHosts = document.querySelectorAll('.on-dark, .result-card');
  let glowRaf = null, lastEvent = null;

  function updateGlow() {
    glowRaf = null;
    if (!lastEvent) return;
    glowHosts.forEach(host => {
      const rect = host.getBoundingClientRect();
      if (lastEvent.clientX >= rect.left && lastEvent.clientX <= rect.right &&
          lastEvent.clientY >= rect.top  && lastEvent.clientY <= rect.bottom) {
        host.style.setProperty('--gx', (((lastEvent.clientX - rect.left) / rect.width)  * 100).toFixed(1) + '%');
        host.style.setProperty('--gy', (((lastEvent.clientY - rect.top)  / rect.height) * 100).toFixed(1) + '%');
      }
    });
  }

  document.addEventListener('mousemove', e => {
    lastEvent = e;
    if (!glowRaf) glowRaf = requestAnimationFrame(updateGlow);
  }, { passive: true });

  document.querySelectorAll('.spot-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (((e.clientX - r.left) / r.width)  * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (((e.clientY - r.top)  / r.height) * 100).toFixed(1) + '%');
    });
  });

  // --- REVEAL ON SCROLL & ANIMATIONS ---
  const revealEls = document.querySelectorAll('.reveal');
  
  function animateCounters(container) {
    container.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 2000; 
      let start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(ease * target);
        // format and preserve inner span
        const spanHTML = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
        const formatted = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        el.innerHTML = formatted + spanHTML;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          // Trigger fills
          e.target.querySelectorAll('.kpi-fill, .method-bar, .steps-progress-fill').forEach(bar => {
            bar.classList.add('animated');
          });
          // Trigger counters
          animateCounters(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => {
      el.classList.add('in');
      el.querySelectorAll('.kpi-fill, .method-bar, .steps-progress-fill').forEach(bar => bar.classList.add('animated'));
      animateCounters(el);
    });
  }

  // --- DONUT CHART ANIMATION ---
  const DONUT_CIRCUMFERENCE = 439.82;

  function animateDonut(panel) {
    const segs = panel?.querySelectorAll('.donut-seg');
    if (!segs || !segs.length) return;
    // Reset animation
    segs.forEach(seg => {
      seg.setAttribute('stroke-dasharray', `0 ${DONUT_CIRCUMFERENCE}`);
    });

    let start = null;
    const duration = 900;
    function step(ts) {
      if (!start) start = ts;
      const eased = 1 - Math.pow(1 - Math.min(1, (ts - start) / duration), 3);
      segs.forEach(seg => {
        const len = parseFloat(seg.getAttribute('data-len'));
        const off = parseFloat(seg.getAttribute('data-offset'));
        seg.setAttribute('stroke-dasharray', `${(len * eased).toFixed(2)} ${(DONUT_CIRCUMFERENCE - len * eased).toFixed(2)}`);
        seg.setAttribute('stroke-dashoffset', String(-off));
      });
      if (eased < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Tier pills switcher
  document.querySelectorAll('.tier-pill').forEach(pill => {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.tier-pill').forEach(p => { p.classList.remove('active'); p.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.tier-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      const target = document.querySelector(`.tier-panel[data-panel="${this.getAttribute('data-tier')}"]`);
      if (target) {
        target.classList.add('active');
        animateDonut(target);
      }
    });
  });

  // Trigger donut when section is visible
  const tierSection = document.getElementById('danh-muc');
  if (tierSection && 'IntersectionObserver' in window) {
    const tio = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const activePanel = document.querySelector('.tier-panel.active');
        if (activePanel) {
          animateDonut(activePanel);
        }
        tio.disconnect();
      }
    }, { threshold: 0.2 });
    tio.observe(tierSection);
  }

  // --- INVESTMENT CALCULATOR ---
  const GOAL_PRESETS = {
    nhaxuong: { target: 5000000000,  initial: 500000000,  return: 14, years: 10 },
    muaxe:    { target: 1000000000,  initial: 100000000,  return: 11, years: 2  },
    giaoduc:  { target: 1000000000,  initial: 50000000,   return: 10, years: 18 },
    huutri:   { target: 10000000000, initial: 500000000,  return: 11, years: 15 },
    tudotc:   { target: 15000000000, initial: 500000000,  return: 17, years: 20 }
  };

  const inpTarget   = document.getElementById('inpTarget');
  const inpInitial  = document.getElementById('inpInitial');
  const inpReturn   = document.getElementById('inpReturn');
  const inpYears    = document.getElementById('inpYears');
  const sliderYears = document.getElementById('sliderYears');
  const resMonthly  = document.getElementById('resMonthly');
  const resTotal    = document.getElementById('resTotal');
  const resGain     = document.getElementById('resGain');

  function calculatePlan() {
    const target      = parseVND(inpTarget?.value);
    const initial     = parseVND(inpInitial?.value);
    const annualRate  = (parseFloat(inpReturn?.value) || 10) / 100;
    const years       = parseInt(sliderYears?.value, 10) || 10;
    const nMonths     = years * 12;
    const rm          = Math.pow(1 + annualRate, 1 / 12) - 1;
    const fvInitial   = initial * Math.pow(1 + rm, nMonths);
    const remaining   = target - fvInitial;
    let pmt = 0;
    if (remaining > 0 && nMonths > 0) {
      pmt = rm > 0 ? remaining / ((Math.pow(1 + rm, nMonths) - 1) / rm) : remaining / nMonths;
    }
    if (pmt < 0) pmt = 0;
    const totalDeposit = initial + pmt * nMonths;
    if (resMonthly) resMonthly.textContent = formatVND(pmt);
    if (resTotal)   resTotal.textContent   = formatVND(totalDeposit);
    if (resGain)    resGain.textContent    = formatVND(Math.max(0, target - totalDeposit));
    renderCalcChart(initial, pmt, annualRate, years);
  }
  function renderCalcChart(initial, pmt, annualRate, years) {
    const svg = document.getElementById('calcChart');
    if (!svg) return;
    const w = 480, h = 180, pad = 20;
    const rm = Math.pow(1 + annualRate, 1 / 12) - 1;
    const gPts = [], pPts = [];
    // Use more steps for a smoother curve
    const numSteps = Math.max(60, years * 4);
    for (let i = 0; i <= numSteps; i++) {
      const y = (i / numSteps) * years;
      const m = y * 12;
      const fv = rm > 0
        ? initial * Math.pow(1 + rm, m) + pmt * ((Math.pow(1 + rm, m) - 1) / rm)
        : initial + pmt * m;
      gPts.push({ y, v: fv });
      pPts.push({ y, v: initial + pmt * m });
    }
    const maxV = Math.max(gPts[gPts.length - 1].v, 1) * 1.05;
    const X = y => pad + (y / years) * (w - 2 * pad);
    const Y = v => h - pad - (v / maxV) * (h - 2 * pad);
    const gD = gPts.map((p, i) => `${i ? 'L' : 'M'}${X(p.y).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
    const pD = pPts.map((p, i) => `${i ? 'L' : 'M'}${X(p.y).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
    const aD = `${gD} L${X(years).toFixed(1)},${(h - pad).toFixed(1)} L${pad},${(h - pad).toFixed(1)} Z`;

    const gLine = document.getElementById('calcGrowthLine');
    const pLine = document.getElementById('calcPrincipalLine');
    const area = document.getElementById('calcArea');

    if (gLine) gLine.setAttribute('d', gD);
    if (pLine) pLine.setAttribute('d', pD);
    if (area) area.setAttribute('d', aD);

    [gLine, pLine].forEach(line => {
      if (!line) return;
      const len = line.getTotalLength();
      line.style.transition = 'none';
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      line.getBoundingClientRect(); // Force reflow
      line.style.transition = ''; // Re-enable CSS transition
      line.style.strokeDashoffset = 0;
    });

    if (area) {
      area.style.transition = 'none';
      area.style.opacity = 0;
      area.getBoundingClientRect(); 
      area.style.transition = ''; 
      area.style.opacity = 1;
    }
    svg._chartState = { initial, pmt, annualRate, years, maxV, X, Y };
  }

  (function initChartTooltip() {
    const wrap = document.getElementById('calcChartWrap');
    const svg = document.getElementById('calcChart');
    const hoverLine = document.getElementById('calcHoverLine');
    const hoverDot = document.getElementById('calcHoverDot');
    const tooltip = document.getElementById('calcTooltip');

    if (!wrap || !svg || !hoverLine || !hoverDot || !tooltip) return;

    function handleMove(e) {
      const state = svg._chartState;
      if (!state) return;

      const rect = svg.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
        handleLeave();
        return;
      }

      const svgX = ((clientX - rect.left) / rect.width) * 480;
      const pad = 20, w = 480;
      const clampedX = Math.max(pad, Math.min(w - pad, svgX));

      const ratio = (clampedX - pad) / (w - 2 * pad);
      const currentYear = Math.max(1, Math.min(state.years, Math.round(ratio * state.years)));
      
      const m = currentYear * 12;
      const rm = Math.pow(1 + state.annualRate, 1 / 12) - 1;
      const principal = state.initial + state.pmt * m;
      const totalGrowth = rm > 0
        ? state.initial * Math.pow(1 + rm, m) + state.pmt * ((Math.pow(1 + rm, m) - 1) / rm)
        : principal;

      const dotX = state.X(currentYear);
      const dotY = state.Y(totalGrowth);

      hoverLine.setAttribute('x1', dotX);
      hoverLine.setAttribute('x2', dotX);
      hoverLine.setAttribute('opacity', '1');

      hoverDot.setAttribute('cx', dotX);
      hoverDot.setAttribute('cy', dotY);
      hoverDot.setAttribute('opacity', '1');

      tooltip.innerHTML = `
        <div class="tt-year">Mốc: Năm thứ ${currentYear}</div>
        <div class="tt-row">
          <span>Tổng giá trị:</span>
          <span class="tt-val-gain">${formatVND(totalGrowth)}</span>
        </div>
        <div class="tt-row">
          <span>Tiền gốc nộp:</span>
          <span class="tt-val-principal">${formatVND(principal)}</span>
        </div>
      `;

      const tooltipLeft = (dotX / 480) * 100;
      tooltip.style.left = tooltipLeft + '%';
      tooltip.style.top = (dotY / 180 * 100) + '%';
      tooltip.classList.add('show');
    }

    function handleLeave() {
      hoverLine.setAttribute('opacity', '0');
      hoverDot.setAttribute('opacity', '0');
      tooltip.classList.remove('show');
    }

    wrap.addEventListener('mousemove', handleMove);
    wrap.addEventListener('mouseleave', handleLeave);
    wrap.addEventListener('touchstart', handleMove, { passive: true });
    wrap.addEventListener('touchmove', handleMove, { passive: true });
    wrap.addEventListener('touchend', handleLeave);
  })();

  document.querySelectorAll('.goal-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const p = GOAL_PRESETS[this.getAttribute('data-goal')];
      if (p) {
        if (inpTarget)   inpTarget.value   = formatVND(p.target);
        if (inpInitial)  inpInitial.value  = formatVND(p.initial);
        if (inpReturn)   inpReturn.value   = p.return;
        if (sliderYears) sliderYears.value = p.years;
        if (inpYears)    inpYears.textContent = p.years + ' năm';
        calculatePlan();
      }
    });
  });

  sliderYears?.addEventListener('input', function () {
    if (inpYears) inpYears.textContent = this.value + ' năm';
    calculatePlan();
  });

  [inpTarget, inpInitial].forEach(inp => {
    if (!inp) return;
    inp.addEventListener('blur', function () { 
      this.value = formatVND(parseVND(this.value)); 
      calculatePlan(); 
    });
    inp.addEventListener('input', function () {
      const raw = parseVND(this.value);
      if (raw > 0) {
        this.value = formatVND(raw);
      }
      calculatePlan();
    });
  });

  inpReturn?.addEventListener('change', calculatePlan);

  // --- CUSTOM SELECT DROPDOWN ---
  (function initCustomSelect() {
    const wrapper = document.getElementById('customReturnSelect');
    const nativeSelect = document.getElementById('inpReturn');
    if (!wrapper || !nativeSelect) return;

    const trigger = wrapper.querySelector('.cs-selected');
    const valueLabel = wrapper.querySelector('.cs-value');
    const options = wrapper.querySelectorAll('.cs-option');

    function openDropdown() {
      wrapper.classList.add('open');
      wrapper.setAttribute('aria-expanded', 'true');
    }
    function closeDropdown() {
      wrapper.classList.remove('open');
      wrapper.setAttribute('aria-expanded', 'false');
    }
    function toggleDropdown() {
      wrapper.classList.contains('open') ? closeDropdown() : openDropdown();
    }

    function selectOption(li) {
      options.forEach(o => {
        o.classList.remove('cs-active');
        o.removeAttribute('aria-selected');
      });
      li.classList.add('cs-active');
      li.setAttribute('aria-selected', 'true');

      const rate = li.querySelector('span')?.textContent || '';
      const name = li.childNodes[0].textContent.trim();
      valueLabel.textContent = name + ' (' + rate + ')';

      nativeSelect.value = li.dataset.value;

      calculatePlan();
      closeDropdown();
    }

    trigger.addEventListener('click', e => { e.stopPropagation(); toggleDropdown(); });

    options.forEach(li => {
      li.addEventListener('click', e => { e.stopPropagation(); selectOption(li); });
    });

    document.addEventListener('click', closeDropdown);
    wrapper.addEventListener('click', e => e.stopPropagation());

    wrapper.addEventListener('keydown', e => {
      const active = [...options].findIndex(o => o.classList.contains('cs-active'));
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); openDropdown(); selectOption(options[Math.min(active + 1, options.length - 1)]); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); openDropdown(); selectOption(options[Math.max(active - 1, 0)]); }
      else if (e.key === 'Escape')    { closeDropdown(); }
    });
  })();

  calculatePlan();

  // --- FAQ ACCORDION ---
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function () {
      const item = this.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // --- TOAST NOTIFICATION COMPONENT ---
  function showToast(title, message, duration = 5000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast-card';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-desc">${message}</div>
      </div>
      <button class="toast-close" aria-label="Đóng">&times;</button>
    `;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    const removeFn = () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    };

    toast.querySelector('.toast-close').addEventListener('click', removeFn);
    setTimeout(removeFn, duration);
  }

  // --- CONTACT FORM WITH REAL-TIME VALIDATION ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const inpName = document.getElementById('contactName');
    const inpEmail = document.getElementById('contactEmail');
    const inpPhone = document.getElementById('contactPhone');
    const errName = document.getElementById('errName');
    const errEmail = document.getElementById('errEmail');
    const errPhone = document.getElementById('errPhone');

    function validateField(input, errEl, checkFn, errorMsg) {
      const val = input ? input.value.trim() : '';
      if (!checkFn(val)) {
        if (input) input.classList.add('error');
        if (errEl) errEl.textContent = errorMsg;
        return false;
      } else {
        if (input) input.classList.remove('error');
        if (errEl) errEl.textContent = '';
        return true;
      }
    }

    const checkNotEmpty = val => val.length >= 2;
    const checkEmail = val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const checkPhone = val => /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(val.replace(/\s/g, ''));

    inpName?.addEventListener('blur', () => validateField(inpName, errName, checkNotEmpty, 'Vui lòng nhập họ và tên của bạn'));
    inpEmail?.addEventListener('blur', () => validateField(inpEmail, errEmail, checkEmail, 'Vui lòng nhập địa chỉ Email hợp lệ'));
    inpPhone?.addEventListener('blur', () => validateField(inpPhone, errPhone, checkPhone, 'Vui lòng nhập số điện thoại hợp lệ (10 chữ số)'));

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const isNameValid = validateField(inpName, errName, checkNotEmpty, 'Vui lòng nhập họ và tên của bạn');
      const isEmailValid = validateField(inpEmail, errEmail, checkEmail, 'Vui lòng nhập địa chỉ Email hợp lệ');
      const isPhoneValid = validateField(inpPhone, errPhone, checkPhone, 'Vui lòng nhập số điện thoại hợp lệ (10 chữ số)');

      if (!isNameValid || !isEmailValid || !isPhoneValid) {
        return;
      }

      showToast('Gửi yêu cầu thành công!', 'Chuyên gia tư vấn AAS sẽ sớm liên hệ lại với bạn qua SĐT/Email.');
      
      setTimeout(() => {
        window.open(REGISTRATION_URL, '_blank');
      }, 1500);

      this.reset();
    });
  }

  // --- MOBILE STICKY CTA AUTO HIDE ON FOOTER/FORM ---
  const stickyCta = document.querySelector('.mobile-sticky-cta');
  const footerSec = document.querySelector('.footer-sec');
  const faqFormCard = document.querySelector('.contact-form-card');

  if (stickyCta && (footerSec || faqFormCard)) {
    function checkCtaVisibility() {
      const targets = [footerSec, faqFormCard].filter(Boolean);
      let isVisible = false;
      targets.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          isVisible = true;
        }
      });
      stickyCta.classList.toggle('hidden', isVisible);
    }
    window.addEventListener('scroll', checkCtaVisibility, { passive: true });
    window.addEventListener('resize', checkCtaVisibility, { passive: true });
  }

})();
