(function () {
  'use strict';

  /* ---------- 语言与站点根路径 ---------- */
  // 中 / 英两个页面共用本脚本：文案按 <html lang> 选择，
  // 资源路径前缀由 <html data-root> 声明（根目录页为 ""，/en/ 子目录页为 "../"）。
  const LANG = (document.documentElement.getAttribute('lang') || 'zh').toLowerCase();
  const IS_EN = LANG.indexOf('en') === 0;
  const ROOT = document.documentElement.getAttribute('data-root') || '';
  const img = (name) => ROOT + 'pic/' + name;
  const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COPIED_LABEL = IS_EN ? 'Copied' : '已复制';

  const TEXT = IS_EN
    ? {
        phrases: [
          'SSH terminal\u00A0· dangerous-command blocking\u00A0· AI inspection\u00A0· MCP\u00A0server',
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
          'SSH 终端\u00A0· 危险命令拦截\u00A0· AI 巡检整改\u00A0· MCP\u00A0服务',
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
  let W, H, particles = [], rafId = null, started = false, heroInView = true;

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
    rafId = requestAnimationFrame(draw);
  }
  function startBg() {
    if (started || REDUCE_MOTION || document.hidden || !heroInView) return;
    started = true;
    resize(); initParticles(); draw();
  }
  function stopBg() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    started = false;
  }
  window.addEventListener('resize', () => { if (started) { resize(); initParticles(); } });
  if (REDUCE_MOTION) {
    canvas.style.display = 'none';
  } else {
    startBg();
    document.addEventListener('visibilitychange', () => { document.hidden ? stopBg() : startBg(); });
    const heroEl = document.querySelector('.hero');
    if (heroEl && 'IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        heroInView = entries[0].isIntersecting;
        heroInView ? startBg() : stopBg();
      }, { threshold: 0 }).observe(heroEl);
    }
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
      if (REDUCE_MOTION) { b.textContent = target; nio.unobserve(e.target); return; }
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
      btn.setAttribute('aria-current', i === modIdx ? 'true' : 'false');
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
      d.setAttribute('aria-current', i === imgIdx ? 'true' : 'false');
      d.addEventListener('click', () => select(modIdx, i));
      dots.appendChild(d);
    });
  }
  // 只预加载当前、下一张和下一个模块的首图，避免首屏把全部截图拉下来
  function preloadAround(mi, ii) {
    const m = SHOW_MODULES[mi];
    if (!m) return;
    const next = SHOW_MODULES[(mi + 1) % SHOW_MODULES.length];
    [m.imgs[ii], m.imgs[(ii + 1) % m.imgs.length], next.imgs[0]].forEach((src) => {
      if (src) { const im = new Image(); im.src = src; }
    });
  }

  function show() {
    const m = SHOW_MODULES[modIdx];
    preloadAround(modIdx, imgIdx);
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
  const lbClose = document.getElementById('lightboxClose');
  let lastFocus = null;

  function openLightbox(src, alt) {
    if (!lb || !lbImg) return;
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  }
  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  const heroImg = document.querySelector('.hero-shot img');
  [main, heroImg].forEach((trigger) => {
    if (!trigger) return;
    trigger.addEventListener('click', () => openLightbox(trigger.src, trigger.alt));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(trigger.src, trigger.alt);
      }
    });
  });
  if (lbClose) lbClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  if (lb) {
    lb.addEventListener('click', closeLightbox);
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); if (lbClose) lbClose.focus(); }
    });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- 导航 ---------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  function setMenu(open) {
    if (!links || !burger) return;
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });
  if (burger) burger.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!links.classList.contains('open')); });
  if (links) links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => { if (nav && !nav.contains(e.target)) setMenu(false); });

  /* ---------- 复制提示词 / MCP 配置 ---------- */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const prompt = btn.closest('.prompt-card');
      const code = btn.closest('.code-block');
      let text = '';
      if (prompt) {
        text = (prompt.querySelector('.prompt-text')?.textContent || '').trim();
        text = text.replace(/^[“"']+|[”"']+$/g, '').trim();
      } else if (code) {
        text = (code.querySelector('code')?.textContent || '').trim();
      }
      if (!text) return;
      const original = btn.textContent;
      const ok = await copyText(text);
      if (!ok) return;
      btn.textContent = COPIED_LABEL;
      btn.disabled = true;
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1600);
    });
  });

  /* ---------- 最新版本 / 更新日志 ---------- */
  const RELEASES_API = 'https://api.github.com/repos/shaguocgl/buff-term/releases?per_page=3';
  const RELEASES_CACHE_KEY = 'buffterm-releases-v2';
  const RELEASES_CACHE_TTL = 60 * 60 * 1000;

  function readReleaseCache() {
    try {
      const raw = sessionStorage.getItem(RELEASES_CACHE_KEY);
      if (!raw) return null;
      const cached = JSON.parse(raw);
      if (!cached || Date.now() - cached.ts > RELEASES_CACHE_TTL) return null;
      return cached.data;
    } catch { return null; }
  }

  function writeReleaseCache(data) {
    try { sessionStorage.setItem(RELEASES_CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch { /* ignore */ }
  }

  async function loadReleases() {
    const cached = readReleaseCache();
    if (cached && cached.length) return cached;
    const res = await fetch(RELEASES_API, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error('release fetch failed: ' + res.status);
    const data = await res.json();
    if (Array.isArray(data) && data.length) writeReleaseCache(data);
    return data;
  }

  function formatBytes(bytes) {
    if (!bytes) return '';
    return bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + ' MB' : Math.round(bytes / 1024) + ' KB';
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(IS_EN ? 'en-US' : 'zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function detectOS() {
    const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    const p = platform.toLowerCase();
    if (p.indexOf('mac') === 0 || p.includes('mac')) return 'mac';
    if (p.includes('win')) return 'win';
    return '';
  }

  function renderChangelog(releases) {
    const list = document.getElementById('changelogList');
    if (!list) return;
    list.innerHTML = '';
    releases.forEach((r) => {
      const a = document.createElement('a');
      a.className = 'release-item';
      a.href = r.html_url;
      a.target = '_blank';
      a.rel = 'noopener';
      const tag = document.createElement('span');
      tag.className = 'release-tag';
      tag.textContent = r.tag_name || '';
      const date = document.createElement('span');
      date.className = 'release-date';
      date.textContent = formatDate(r.published_at);
      const link = document.createElement('span');
      link.className = 'release-link';
      link.textContent = IS_EN ? 'View details →' : '查看详情 →';
      a.append(tag, date, link);
      list.append(a);
    });
  }

  function applyReleases(releases) {
    const latest = releases[0];
    if (!latest) return;
    const assets = latest.assets || [];
    const mac = assets.find((a) => /\.dmg$/i.test(a.name));
    const win = assets.find((a) => /setup\.exe$/i.test(a.name));
    document.querySelectorAll('.download-btn').forEach((btn) => {
      const asset = btn.dataset.os === 'mac' ? mac : win;
      if (asset) btn.href = asset.browser_download_url;
    });
    const os = detectOS();
    document.querySelectorAll('.download-btn').forEach((btn) => {
      btn.classList.toggle('is-recommended', btn.dataset.os === os);
    });
    const meta = document.getElementById('releaseMeta');
    if (meta) {
      const parts = [(IS_EN ? 'Latest ' : '最新版本 ') + latest.tag_name, formatDate(latest.published_at)];
      if (win) parts.push('Windows\u00A0' + formatBytes(win.size));
      if (mac) parts.push('macOS\u00A0' + formatBytes(mac.size));
      meta.textContent = parts.filter(Boolean).join(' · ');
    }
    renderChangelog(releases);
  }

  loadReleases().then((releases) => { if (Array.isArray(releases) && releases.length) applyReleases(releases); }).catch(() => { /* keep static fallback */ });
})();
