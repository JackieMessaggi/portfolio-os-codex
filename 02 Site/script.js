// Fixed section navigation: active section (aria-current), scroll progress, and mobile contrast over the eggplant sections.
// Anchor links work without JavaScript; smooth scrolling is CSS-only and respects prefers-reduced-motion.
const nav = document.querySelector('.section-nav');
if (nav) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const darkSections = [...document.querySelectorAll('.work, .contact')];
  let ticking = false;

  function setActive(id) {
    links.forEach((link) => {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function update() {
    ticking = false;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    nav.style.setProperty('--progress', progress.toFixed(4));

    // Active section: the last one whose top has passed the upper third of the viewport, so short sections linked
    // from the nav become active when they reach the top. The end of the page selects the last section.
    const line = window.innerHeight * 0.35;
    let current = sections[0];
    sections.forEach((section) => { if (section.getBoundingClientRect().top <= line) current = section; });
    if (max > 0 && window.scrollY >= max - 2) current = sections[sections.length - 1];
    if (current) setActive(current.id);

    // Mobile rail has no background, so its numbers switch to ivory over the eggplant sections (Selected Work, Contact).
    if (darkSections.length) {
      const navBox = nav.getBoundingClientRect();
      const center = navBox.top + navBox.height / 2;
      nav.classList.toggle('on-dark', darkSections.some((s) => { const b = s.getBoundingClientRect(); return center > b.top && center < b.bottom; }));
    }
  }

  function requestUpdate() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

// Case study navigation (snoof.html only): current section label and number, scroll progress, and a section menu.
// The menu links are plain anchors and stay usable without JavaScript.
const caseNav = document.querySelector('.case-nav');
if (caseNav) {
  const toggle = caseNav.querySelector('.case-toggle');
  const links = [...caseNav.querySelectorAll('.case-menu a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const numEl = caseNav.querySelector('.case-current-num');
  const labelEl = caseNav.querySelector('.case-current-label');
  let ticking = false;
  let lastY = window.scrollY;

  function setOpen(open) {
    caseNav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    caseNav.style.setProperty('--progress', progress.toFixed(4));

    const line = window.innerHeight * 0.35;
    let index = 0;
    sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= line) index = i; });
    if (max > 0 && window.scrollY >= max - 2) index = sections.length - 1;
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (numEl) numEl.textContent = String(index + 1).padStart(2, '0');
    if (labelEl && sections[index]) labelEl.textContent = sections[index].dataset.label || '';

    // Hide the nav over the opening Hero and while reading downward, so it never covers content; show it when
    // scrolling up, at the end of the page, while the menu is open, or when it has keyboard focus.
    const y = window.scrollY;
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    const keep = y >= max - 120 || caseNav.classList.contains('is-open') || caseNav.contains(document.activeElement);
    const inHero = y < 320 && !caseNav.contains(document.activeElement) && !caseNav.classList.contains('is-open');
    if (inHero) caseNav.classList.add('is-hidden');
    else if (keep || goingUp) caseNav.classList.remove('is-hidden');
    else if (goingDown) caseNav.classList.add('is-hidden');
    if (goingDown || goingUp) lastY = y;
  }

  function requestUpdate() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }

  toggle.addEventListener('click', () => setOpen(!caseNav.classList.contains('is-open')));
  caseNav.addEventListener('focusin', () => caseNav.classList.remove('is-hidden'));
  links.forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && caseNav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (!caseNav.contains(event.target)) setOpen(false);
  });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
}

// Snoof case P1 scroll storytelling (sections 4 and 5B). Progressive enhancement: without JavaScript or with
// prefers-reduced-motion, the static layouts and captions stay as they are. One rAF-throttled scroll check drives
// all three effects; the reveals run once.
(() => {
  if (!document.querySelector('.case-nav')) return;
  const motionOK = window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (!motionOK) return;
  document.documentElement.classList.add('motion');
  const checks = [];

  // Section 4: the three ideas start folded into one v1.0-style verdict, then split apart.
  const layers = document.querySelector('.cs-layers3');
  if (layers) {
    const wrap = document.createElement('div');
    wrap.className = 'cs-layers-wrap';
    layers.before(wrap);
    wrap.append(layers);
    const chip = document.createElement('p');
    chip.className = 'cs-verdict-chip';
    chip.setAttribute('aria-hidden', 'true');
    chip.innerHTML = '<span>v1.0</span> Good Match';
    wrap.append(chip);
    checks.push(() => {
      if (wrap.classList.contains('is-split')) return;
      const r = wrap.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.65 && r.bottom > 0) wrap.classList.add('is-split');
    });
  }

  // Section 5B: one phone stays pinned while three steps scroll past; the phone crossfades in sync.
  const trip = document.querySelector('.cs-triptych');
  if (trip) {
    const steps = [...trip.children];
    const scrolly = document.createElement('div');
    scrolly.className = 'cs-scrolly';
    const stage = document.createElement('div');
    stage.className = 'cs-stage';
    trip.before(scrolly);
    scrolly.append(stage, trip);
    trip.classList.add('is-scrolly');
    steps.forEach((step, i) => {
      const fig = step.querySelector('figure');
      if (fig) { fig.dataset.step = String(i); stage.append(fig); }
      step.dataset.step = String(i);
    });
    let current = -1;
    const setStep = (i) => {
      if (i === current) return;
      current = i;
      stage.dataset.active = String(i);
      stage.querySelectorAll('figure').forEach((fig) => fig.classList.toggle('is-active', fig.dataset.step === String(i)));
      steps.forEach((step) => step.classList.toggle('is-active', step.dataset.step === String(i)));
    };
    setStep(0);
    // Active step: the one whose center is closest to the viewport center (only while the sequence is near).
    checks.push(() => {
      const box = scrolly.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;
      // On mobile the phone is pinned at the top, so the reading area is the space below it.
      const sb = stage.getBoundingClientRect();
      const pinnedTop = window.innerWidth <= 760 && sb.top <= 1;
      const mid = pinnedTop ? sb.bottom + (window.innerHeight - sb.bottom) / 2 : window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      steps.forEach((step, i) => {
        const r = step.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setStep(best);
    });
  }

  // Section 5B, after the sequence: the three layers start stacked as one card and fan out.
  const exploded = document.querySelector('.cs-exploded-layers');
  if (exploded) {
    checks.push(() => {
      if (exploded.classList.contains('is-in')) return;
      const r = exploded.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.75 && r.bottom > 0) exploded.classList.add('is-in');
    });
  }

  // Section 2: the Origin strip is pinned and moves sideways with the vertical scroll (no manual horizontal scroll).
  const strip = document.querySelector('.cs-strip');
  const track = strip && strip.querySelector('.cs-strip-track');
  if (strip && track) {
    const pin = document.createElement('div');
    pin.className = 'cs-strip-pin';
    const sticky = document.createElement('div');
    sticky.className = 'cs-strip-sticky';
    strip.before(pin);
    pin.append(sticky);
    sticky.append(strip);
    strip.classList.add('is-pinned');
    strip.removeAttribute('tabindex');
    const hint = document.querySelector('.cs-strip-hint');
    if (hint) hint.textContent = 'Keep scrolling ↓';
    const tiles = [...track.querySelectorAll('.cs-tile')];
    let distance = 0;
    let stickyTop = 0;
    const measure = () => {
      track.style.transform = '';
      distance = Math.max(0, track.scrollWidth - strip.clientWidth);
      const h = sticky.offsetHeight;
      stickyTop = Math.max(16, (window.innerHeight - h) / 2);
      sticky.style.top = `${stickyTop}px`;
      pin.style.height = `${h + distance}px`;
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    checks.push(() => {
      const top = pin.getBoundingClientRect().top;
      const p = distance > 0 ? Math.min(1, Math.max(0, (stickyTop - top) / distance)) : 0;
      track.style.transform = `translate3d(${(-p * distance).toFixed(1)}px, 0, 0)`;
      // One tile in focus at a time, stepping through all of them across the pinned scroll.
      const focus = Math.min(tiles.length - 1, Math.round(p * (tiles.length - 1)));
      tiles.forEach((tile, i) => tile.classList.toggle('is-focus', i === focus));
    });
  }

  // Section 6: idle pet. The loop only runs while the card is on screen.
  const pet = document.querySelector('.cs-pet-anim');
  if (pet) {
    checks.push(() => {
      const r = pet.getBoundingClientRect();
      pet.classList.toggle('is-live', r.bottom > 0 && r.top < window.innerHeight);
    });
  }

  // Remaining P1 entrances: short fade-ups that run once. Elements that enter together are staggered.
  // Only applied with motion allowed; without it (or without JavaScript) everything is visible as is.
  const groups = [
    ['.cs-origin .cs-split > *', ''], ['.cs-tile', ''],
    ['#research > .cs-eyebrow, #research > .cs-h2, #research > .cs-copy', ''], ['.cs-toxic-label', 'rv-pop'], ['.cs-toxic-question', ''],
    ['.cs-finding > div, .cs-quote', ''], ['.cs-behaviors li', ''], ['.cs-research-foot > *', ''],
    ['.cs-dots > .cs-eyebrow, .cs-dots > .cs-h2, .cs-dots > .cs-copy', ''], ['.cs-alts li', ''],
    ['.cs-choice-copy > .cs-label, .cs-choice-title', ''], ['.cs-criteria li', 'rv-side'], ['.cs-choice-copy > p:not(.cs-label):not(.cs-rule)', ''],
    ['.cs-rule', 'rv-pop'], ['.cs-choice-visual .cs-phone', ''], ['.cs-callout', 'rv-side'],
    ['.cs-brand-intro > *', ''], ['.cs-brand-hero img', 'rv-scale'], ['.cs-brand-hero p', ''],
    ['.cs-group-label', ''], ['.cs-palette li', ''], ['.cs-palette figcaption', ''], ['.cs-pets figure', ''], ['.cs-brand-v2', ''],
    ['.cs-bento > *', ''], ['.cs-tone-lede', ''], ['.cs-tone figure', ''],
    ['.cs-proto-copy > *:not(.cs-steps)', ''], ['.cs-steps li', 'rv-side'], ['.cs-video', 'rv-scale'],
    ['#next > .cs-eyebrow, #next > .cs-h2', ''], ['.cs-next-grid > div', ''], ['.cs-takeaways li', ''], ['.cs-later', ''], ['.cs-end', ''],
  ];
  const revealEls = [];
  groups.forEach(([selector, variant]) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.classList.contains('rv')) return;
      el.classList.add('rv');
      if (variant) el.classList.add(variant);
      revealEls.push(el);
    });
  });
  // Checked on the shared rAF-throttled scroll pass (and on the Origin strip's own scroll); revealed items drop out.
  let waiting = revealEls.slice();
  checks.push(() => {
    if (!waiting.length) return;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    let batch = 0;
    waiting = waiting.filter((el) => {
      const r = el.getBoundingClientRect();
      const visible = r.top < vh * 0.92 && r.bottom > 0 && r.left < vw && r.right > 0;
      if (!visible) return true;
      el.style.setProperty('--rv-d', `${Math.min(batch, 5) * 0.09}s`);
      el.classList.add('is-in');
      batch += 1;
      return false;
    });
  });

  let pending = false;
  const run = () => { pending = false; checks.forEach((check) => check()); };
  const request = () => { if (!pending) { pending = true; window.requestAnimationFrame(run); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  run();
})();

// Hero idle avatar: a stacked-alpha H.264 loop (color on top, alpha matte below) composited by WebGL into a
// transparent canvas, so objects can sit behind and in front of the avatar. Only with motion allowed; otherwise, or
// without WebGL, the transparent still stays. The video is fetched only when it will play.
(() => {
  const box = document.querySelector('.hero-avatar');
  const video = box && box.querySelector('video');
  if (!video || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.width = 576; canvas.height = 1024;
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true });
  if (!gl) return;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 uv; void main(){ uv = vec2((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5); gl_Position = vec4(p, 0.0, 1.0); }'));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, 'precision mediump float; varying vec2 uv; uniform sampler2D t; void main(){ vec3 c = texture2D(t, vec2(uv.x, uv.y * 0.5)).rgb; float a = smoothstep(0.05, 0.95, texture2D(t, vec2(uv.x, 0.5 + uv.y * 0.5)).r); gl_FragColor = vec4(c * a, a); }'));
  gl.linkProgram(prog); gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.clearColor(0, 0, 0, 0);
  box.append(canvas);
  const draw = () => {
    if (video.readyState >= 2) {
      // Browsers block video textures on file:// pages (opaque origin); keep the still instead of failing.
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video); } catch (err) { video.pause(); canvas.remove(); return; }
      gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      box.classList.add('is-live');
    }
    if (!video.paused) {
      if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(draw); else requestAnimationFrame(draw);
    }
  };
  video.muted = true;
  video.src = video.dataset.src;
  const play = () => { const p = video.play(); if (p) p.then(draw).catch(() => {}); else draw(); };
  video.addEventListener('playing', draw);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? play() : video.pause()))).observe(box);
  } else { play(); }

  // Gentle pointer parallax for the object planes (desktop pointers only).
  const fig = box.closest('.hero-figure');
  if (fig && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = fig.closest('.hero') || fig;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      fig.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      fig.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => { fig.style.setProperty('--mx', '0'); fig.style.setProperty('--my', '0'); });
  }
})();
