(function () {
  'use strict';

  /* ---------- 语言与站点根路径 ---------- */
  // 中 / 英两个页面共用本脚本：文案按 <html lang> 选择，
  // 资源路径前缀由 <html data-root> 声明（根目录页为 ""，/en/ 子目录页为 "../"）。
  const LANG = (document.documentElement.getAttribute('lang') || 'zh').toLowerCase();
  const IS_EN = LANG.indexOf('en') === 0;
  const ROOT = document.documentElement.getAttribute('data-root') || '';
  const img = (name) => ROOT + 'pic/' + name;

  const TEXT = IS_EN
    ? {
        phrases: [
          'SSH terminal · dangerous-command blocking · AI inspection · MCP server',
          'Describe the task — the AI does the ops',
          'Bilingual UI · credentials encrypted locally',
        ],
        imagesSuffix: (n) => n + ' images',
        imageLabel: (i) => 'Image ' + i,
        modules: [
          { title: 'AI Agent chat', imgs: [img('ai-agent.webp')] },
          { title: 'MCP server', imgs: [img('ai-mcp.webp')] },
          { title: 'AI model settings', imgs: [img('ai-api-conf.webp')] },
          { title: 'Terminal guard', imgs: [img('ai-terminal-protection-01.webp'), img('ai-terminal-protection-02.webp')] },
          { title: 'AI inspection', imgs: [img('ai-inspection-01.webp'), img('ai-inspection-02.webp')] },
          { title: 'Metrics monitoring', imgs: [img('data-monitor.webp')] },
        ],
      }
    : {
        phrases: [
          'SSH 终端 · 危险命令拦截 · AI 巡检整改 · MCP 服务',
          '自然语言让 AI 帮你运维服务器',
          '中英双语界面 · 凭据本地加密',
        ],
        imagesSuffix: (n) => n + ' 图',
        imageLabel: (i) => '第 ' + i + ' 张',
        modules: [
          { title: 'AI Agent 会话', imgs: [img('ai-agent.webp')] },
          { title: '开放 MCP 服务', imgs: [img('ai-mcp.webp')] },
          { title: 'AI 大模型配置', imgs: [img('ai-api-conf.webp')] },
          { title: '终端防护', imgs: [img('ai-terminal-protection-01.webp'), img('ai-terminal-protection-02.webp')] },
          { title: 'AI 巡检', imgs: [img('ai-inspection-01.webp'), img('ai-inspection-02.webp')] },
          { title: '指标监控', imgs: [img('data-monitor.webp')] },
        ],
      };

  /* ---------- 粒子网络背景 ---------- */
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], raf;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initParticles() {
    const n = Math.min(90, Math.floor(W * H / 16000));
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34,211,238,.5)';
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          const o = 0.25 * (1 - Math.sqrt(d2) / 120);
          ctx.strokeStyle = 'rgba(96,165,250,' + o + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }
  let started = false;
  function startBg() {
    if (started) return;
    started = true;
    resize(); initParticles(); draw();
  }
  window.addEventListener('resize', () => { resize(); initParticles(); });
  // 降低移动端开销
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.getElementById('bg').style.display = 'none';
  } else {
    startBg();
  }

  /* ---------- 打字机 ---------- */
  const phrases = TEXT.phrases;
  const tw = document.getElementById('typewriter');
  let pi = 0, ci = 0, deleting = false;
  function type() {
    const cur = phrases[pi];
    tw.textContent = cur.slice(0, ci) + (deleting ? '' : '|');
    if (!deleting) {
      if (ci < cur.length) { ci++; setTimeout(type, 70); return; }
      deleting = true; setTimeout(type, 1800);
    } else {
      if (ci > 0) { ci--; setTimeout(type, 34); return; }
      deleting = false; pi = (pi + 1) % phrases.length; setTimeout(type, 500);
    }
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tw.textContent = phrases[0];
  } else {
    setTimeout(type, 500);
  }

  /* ---------- 滚动渐现 ---------- */
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- 数字滚动 ---------- */
  const nio = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const b = e.target.querySelector('b');
      const target = +b.dataset.count;
      const dur = 1400, t0 = performance.now();
      (function tick(t) {
        const p = Math.min(1, (t - t0) / dur);
        b.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
      nio.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat').forEach((el) => nio.observe(el));

  /* ---------- 卡片 3D 与光效 ---------- */
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = 'perspective(800px) rotateY(' + ((px - 0.5) * 8) + 'deg) rotateX(' + ((0.5 - py) * 8) + 'deg) translateY(-4px)';
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 实拍切换（文字导航 + 多图） ---------- */
  const SHOW_MODULES = TEXT.modules;
  const main = document.getElementById('showMain');
  const cap = document.getElementById('showCaption');
  const showNav = document.getElementById('showNav');
  const dots = document.getElementById('showDots');
  const prevBtn = document.getElementById('prevImg');
  const nextBtn = document.getElementById('nextImg');
  let modIdx = 0, imgIdx = 0;

  function renderNav() {
    showNav.innerHTML = '';
    SHOW_MODULES.forEach((m, i) => {
      const btn = document.createElement('button');
      btn.className = 'show-item' + (i === modIdx ? ' active' : '');
      btn.innerHTML = '<span class="show-idx">0' + (i + 1) + '</span>' + m.title +
        (m.imgs.length > 1 ? '<span class="show-multi">' + TEXT.imagesSuffix(m.imgs.length) + '</span>' : '');
      btn.addEventListener('click', () => { select(i, 0); });
      showNav.appendChild(btn);
    });
  }
  function renderDots() {
    const m = SHOW_MODULES[modIdx];
    dots.innerHTML = '';
    if (m.imgs.length < 2) { dots.style.display = 'none'; return; }
    dots.style.display = 'flex';
    m.imgs.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = i === imgIdx ? 'active' : '';
      d.setAttribute('aria-label', TEXT.imageLabel(i + 1));
      d.addEventListener('click', () => select(modIdx, i));
      dots.appendChild(d);
    });
  }
  // 预加载全部实拍图，切换即时生效
  SHOW_MODULES.forEach((m) => m.imgs.forEach((src) => { const im = new Image(); im.src = src; }));

  function show() {
    const m = SHOW_MODULES[modIdx];
    main.src = m.imgs[imgIdx];
    main.alt = m.title;
    cap.textContent = m.title + (m.imgs.length > 1 ? ' · ' + (imgIdx + 1) + '/' + m.imgs.length : '');
    // 弹出动画：先重置再触发，保证每次切换都有动画
    main.classList.remove('switching');
    void main.offsetWidth;
    main.classList.add('switching');
  }
  function select(mi, ii) { modIdx = mi; imgIdx = ii; renderNav(); renderDots(); show(); }
  function step(d) {
    const m = SHOW_MODULES[modIdx];
    imgIdx = (imgIdx + d + m.imgs.length) % m.imgs.length;
    renderDots(); show();
  }
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); step(1); });
  renderNav(); renderDots();

  /* ---------- 灯箱 ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  function openLightbox() { lbImg.src = main.src; lb.hidden = false; }
  function closeLightbox() { lb.hidden = true; lbImg.src = ''; }
  document.querySelector('.showcase-main').addEventListener('click', openLightbox);
  lb.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- 导航 ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.nav-links');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
})();
