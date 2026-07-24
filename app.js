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
  document.querySelectorAll('.step-card').forEach((el, i) => el.insertAdjacentHTML('afterbegin', strokeIcon(['user','route','wallet','eye','refresh','handshake'][i], 'inverse')));
  document.querySelector('.contact-form-card h3')?.insertAdjacentHTML('beforebegin', strokeIcon('message'));

  // --- NAVBAR SCROLL ---
  const navHeader = document.getElementById('navHeader');

  function getSectionUnderNav() {
    if (!navHeader) return null;
    const navH = navHeader.offsetHeight;
    // Sample element just below the navbar at center of page
    const el = document.elementFromPoint(window.innerWidth / 2, navH + 2);
    if (!el) return null;
    // Walk up DOM to find closest <section>
    return el.closest('section') || null;
  }

  function handleNavScroll() {
    if (!navHeader) return;
    navHeader.classList.toggle('scrolled', window.scrollY > 40);

    const sec = getSectionUnderNav();
    // Light section = no on-dark class (or no section found = hero = dark)
    const isLight = sec ? !sec.classList.contains('on-dark') : false;
    navHeader.classList.toggle('on-light', isLight);
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

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
      area.getBoundingClientRect(); // Force reflow
      area.style.transition = ''; // Re-enable CSS transition
      area.style.opacity = 1;
    }
  }

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
    inp.addEventListener('blur', function () { this.value = formatVND(parseVND(this.value)); calculatePlan(); });
    inp.addEventListener('input', calculatePlan);
  });

  inpReturn?.addEventListener('change', calculatePlan);

  // --- CUSTOM SELECT DROPDOWN ---
  (function initCustomSelect() {
    const wrapper = document.getElementById('customReturnSelect');
    const nativeSelect = document.getElementById('inpReturn');
    if (!wrapper || !nativeSelect) return;

    const trigger = wrapper.querySelector('.cs-selected');
    const valueLabel = wrapper.querySelector('.cs-value');
    const list = wrapper.querySelector('.cs-list');
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
      // Update UI
      options.forEach(o => {
        o.classList.remove('cs-active');
        o.removeAttribute('aria-selected');
      });
      li.classList.add('cs-active');
      li.setAttribute('aria-selected', 'true');

      // Update label (name only, trim the rate span text)
      const rate = li.querySelector('span')?.textContent || '';
      const name = li.childNodes[0].textContent.trim();
      valueLabel.textContent = name + ' (' + rate + ')';

      // Sync native select
      nativeSelect.value = li.dataset.value;

      // Trigger recalculation
      calculatePlan();
      closeDropdown();
    }

    // Click trigger
    trigger.addEventListener('click', e => { e.stopPropagation(); toggleDropdown(); });

    // Click option
    options.forEach(li => {
      li.addEventListener('click', e => { e.stopPropagation(); selectOption(li); });
    });

    // Close on outside click
    document.addEventListener('click', closeDropdown);
    wrapper.addEventListener('click', e => e.stopPropagation());

    // Keyboard navigation
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

  // --- CONTACT FORM ---
  document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Cảm ơn bạn đã đăng ký tư vấn! Chuyên gia AAS sẽ liên hệ phản hồi trong thời gian sớm nhất.');
    window.open(REGISTRATION_URL, '_blank');
    this.reset();
  });

})();
