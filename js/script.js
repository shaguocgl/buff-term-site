(function () {
  'use strict';

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
  const phrases = ['SSH 终端 · 危险命令拦截 · AI 巡检整改 · MCP 服务', '自然语言让 AI 帮你运维服务器', '本地优先 · 数据不出本机'];
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

  /* ---------- 截图切换 ---------- */
  const main = document.getElementById('showMain');
  const cap = document.getElementById('showCaption');
  const thumbs = document.getElementById('showThumbs');
  thumbs.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    thumbs.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    main.style.opacity = 0;
    setTimeout(() => {
      main.src = btn.dataset.src;
      main.alt = btn.dataset.cap;
      cap.textContent = btn.dataset.cap;
      main.style.opacity = 1;
    }, 160);
  });
  main.style.transition = 'opacity .16s';

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
