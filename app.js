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

  // --- NAVBAR SCROLL ---
  const navHeader = document.getElementById('navHeader');
  function handleNavScroll() {
    if (!navHeader) return;
    navHeader.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- MOBILE MENU DRAWER ---
  const burgerBtn   = document.getElementById('burgerBtn');
  const mobileMenu  = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenuBtn = document.getElementById('closeMenuBtn');

  function openMenu()  { mobileMenu?.classList.add('open');    menuOverlay?.classList.add('open'); }
  function closeMenu() { mobileMenu?.classList.remove('open'); menuOverlay?.classList.remove('open'); }

  burgerBtn?.addEventListener('click', openMenu);
  closeMenuBtn?.addEventListener('click', closeMenu);
  menuOverlay?.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-close-trigger').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

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

  // --- 3D DONUT CHART ---
  function create3dDonut(panel) {
    const container = panel.querySelector('.donut-wrap');
    if (!container || !window.Highcharts) {
      console.warn('Highcharts or container not found for donut chart.');
      return;
    }

    // Clear previous chart/SVG
    container.innerHTML = '';

    const assetItems = panel.querySelectorAll('.asset-item');
    const chartData = [];

    assetItems.forEach(item => {
        const name = item.querySelector('.asset-name')?.innerText.trim();
        const pctText = item.querySelector('.asset-pct')?.innerText.trim();
        const pct = parseFloat(pctText.replace('%', ''));
        const colorDot = item.querySelector('.asset-color-dot');
        const color = colorDot ? window.getComputedStyle(colorDot).backgroundColor : null;

        if (name && !isNaN(pct)) {
            chartData.push({
                name: name,
                y: pct,
                color: color
            });
        }
    });

    const centerValEl = panel.querySelector('.donut-center-val');
    const centerLblEl = panel.querySelector('.donut-center-lbl');

    const titleText = centerLblEl ? centerLblEl.innerText : '';
    const subtitleText = centerValEl ? centerValEl.innerText : '';

    Highcharts.chart(container, {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0,
                depth: 35,
                viewDistance: 25
            }
        },
        title: {
            text: titleText,
            align: 'center',
            verticalAlign: 'middle',
            y: -15,
            style: {
                fontSize: '0.8rem',
                color: 'var(--sage-text)',
                textTransform: 'uppercase',
                fontWeight: '700'
            }
        },
        subtitle: {
            text: subtitleText,
            align: 'center',
            verticalAlign: 'middle',
            y: 10,
            style: {
                fontSize: '1.7rem',
                fontWeight: '800',
                color: 'var(--brand-green)'
            }
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                innerSize: '70%',
                depth: 35,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: { enabled: false },
                showInLegend: false
            }
        },
        series: [{
            name: 'Phân bổ',
            data: chartData
        }],
        credits: {
            enabled: false
        }
    });
  }

  // Native animated 3D donut. This intentionally has no third-party dependency.
  function createNative3dDonut(panel) {
    const container = panel.querySelector('.donut-wrap');
    if (!container) return;

    const chartData = [...panel.querySelectorAll('.asset-item')].map(item => ({
      name: item.querySelector('.asset-name')?.innerText.trim() || '',
      value: parseFloat(item.querySelector('.asset-pct')?.innerText) || 0,
      color: getComputedStyle(item.querySelector('.asset-color-dot')).backgroundColor
    })).filter(item => item.name && item.value);
    if (!chartData.length) return;

    const label = panel.querySelector('.donut-center-lbl')?.innerText || 'Tăng trưởng';
    const value = panel.querySelector('.donut-center-val')?.innerText || '';
    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    const segments = chartData.map((item, index) => {
      const length = circumference * item.value / 100;
      const markup = `<circle class="donut3d-segment" cx="110" cy="110" r="${radius}" pathLength="${circumference}" stroke="${item.color}" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}" style="--segment-delay:${index * 140}ms"><title>${item.name}: ${item.value}%</title></circle>`;
      offset += length;
      return markup;
    }).join('');
    const filterId = `donutShadow-${panel.dataset.panel}`;

    container.innerHTML = `<div class="donut3d-scene" role="img" aria-label="Phân bổ danh mục: ${chartData.map(item => `${item.name} ${item.value}%`).join(', ')}">
      <div class="donut3d-float">
        <svg class="donut3d-chart" viewBox="0 0 220 220" aria-hidden="true">
          <defs><filter id="${filterId}" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="18" stdDeviation="10" flood-color="#052e24" flood-opacity=".32"/></filter></defs>
          <g class="donut3d-depth" filter="url(#${filterId})"><circle cx="110" cy="122" r="${radius}"/><circle cx="110" cy="117" r="${radius}"/><circle cx="110" cy="112" r="${radius}"/></g>
          <g class="donut3d-face"><circle class="donut3d-track" cx="110" cy="110" r="${radius}"/>${segments}<ellipse class="donut3d-highlight" cx="110" cy="91" rx="57" ry="32"/></g>
        </svg>
        <div class="donut3d-center"><span>${label}</span><strong>${value}</strong></div>
      </div><span class="donut3d-orbit" aria-hidden="true"></span>
    </div>`;
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
        // Use a small timeout to ensure the panel is visible before rendering the chart
        setTimeout(() => createNative3dDonut(target), 50);
      }
    });
  });

  // Trigger donut when section is visible
  const tierSection = document.getElementById('danh-muc');
  if (tierSection) {
    if ('IntersectionObserver' in window) {
        const tio = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                const activePanel = document.querySelector('.tier-panel.active');
                if (activePanel) {
                    createNative3dDonut(activePanel);
                }
                tio.disconnect();
            }
        }, { threshold: 0.2 });
        tio.observe(tierSection);
    } else {
        // Fallback for older browsers
        const activePanel = document.querySelector('.tier-panel.active');
        if (activePanel) {
            createNative3dDonut(activePanel);
        }
    }
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
    for (let y = 0; y <= years; y++) {
      const m = y * 12;
      const fv = rm > 0
        ? initial * Math.pow(1 + rm, m) + pmt * ((Math.pow(1 + rm, m) - 1) / rm)
        : initial + pmt * m;
      gPts.push({ y, v: fv });
      pPts.push({ y, v: initial + pmt * m });
    }
    const maxV = Math.max(gPts[gPts.length - 1].v, 1) * 1.1;
    const X = y => pad + (y / years) * (w - 2 * pad);
    const Y = v => h - pad - (v / maxV) * (h - 2 * pad);
    const gD = gPts.map((p, i) => `${i ? 'L' : 'M'}${X(p.y).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
    const pD = pPts.map((p, i) => `${i ? 'L' : 'M'}${X(p.y).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
    const aD = `${gD} L${X(years).toFixed(1)},${(h - pad).toFixed(1)} L${pad},${(h - pad).toFixed(1)} Z`;
    document.getElementById('calcGrowthLine')?.setAttribute('d', gD);
    document.getElementById('calcPrincipalLine')?.setAttribute('d', pD);
    document.getElementById('calcArea')?.setAttribute('d', aD);
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
