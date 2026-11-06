// Fixed section navigation: active section (aria-current), scroll progress, and mobile contrast over the eggplant sections.
// Anchor links work without JavaScript; smooth scrolling is CSS-only and respects prefers-reduced-motion.
const nav = document.querySelector('.section-nav');
if (nav) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const darkSections = [...document.querySelectorAll('.work, .contact')];
  let ticking = false;

  // Mobile rail clarity: when the active section changes, show its name next to the number for a moment.
  let lastId = null;
  let labelTimer = 0;
  function announce() {
    if (window.innerWidth > 760) return;
    nav.classList.add('show-label');
    clearTimeout(labelTimer);
    labelTimer = setTimeout(() => nav.classList.remove('show-label'), 1800);
  }

  function setActive(id) {
    if (id !== lastId) { lastId = id; announce(); }
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

// Snoof case, section 4: before/after comparison. The (invisible) range input drives the divider position;
// it works with drag, touch, and arrow keys. Without JavaScript the CSS shows both screens side by side.
document.querySelectorAll('.cs-compare').forEach((figure) => {
  const range = figure.querySelector('.cs-compare-range');
  if (!range) return;
  // The copy beside the comparison follows the version that dominates the frame. A dead zone around the middle
  // (40 to 60) keeps it from flickering while dragging. The v1.0 / v2.0 tags select a version directly.
  const copy = figure.closest('.cs-before') && figure.closest('.cs-before').querySelector('.cs-before-copy');
  const panels = copy ? [...copy.querySelectorAll('.cs-version')] : [];
  const tags = [...figure.querySelectorAll('.cs-compare-tag[data-pos]')];
  let version = 'v1';
  const show = (v) => {
    if (v === version && panels.every((p) => p.hidden === (p.dataset.version !== v))) return;
    version = v;
    panels.forEach((p) => { p.hidden = p.dataset.version !== v; });
    tags.forEach((t) => t.setAttribute('aria-pressed', String((t.dataset.pos === '100') === (v === 'v1'))));
  };
  const sync = () => {
    const pos = Number(range.value);
    figure.style.setProperty('--pos', `${pos}%`);
    if (pos > 60) show('v1'); else if (pos < 40) show('v2');
  };
  range.addEventListener('input', sync);
  let raf = 0;
  tags.forEach((tag) => tag.addEventListener('click', () => {
    const to = Number(tag.dataset.pos); const from = Number(range.value);
    show(to === 100 ? 'v1' : 'v2');
    cancelAnimationFrame(raf);
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) { range.value = to; sync(); return; }
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 450); const e = 1 - (1 - k) ** 3;
      range.value = from + (to - from) * e; figure.style.setProperty('--pos', `${range.value}%`);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }));
  show('v1');
  sync();
});

// Snoof case, section 7: demo loop. Plays muted and looping only while in view and only with motion allowed; the file
// loads on first play. Without motion (or JavaScript) the poster stays. A small toggle pauses and resumes it.
(() => {
  const video = document.querySelector('.cs-demo');
  if (!video || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const toggle = document.querySelector('.cs-demo-toggle');
  let paused = false;
  let visible = false;
  const sync = () => {
    if (visible && !paused) {
      if (!video.src) video.src = video.dataset.src;
      const p = video.play(); if (p) p.catch(() => {});
    } else video.pause();
  };
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Play demo' : 'Pause demo';
      sync();
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => entries.forEach((e) => { visible = e.isIntersecting; sync(); }), { rootMargin: '200px 0px' }).observe(video);
  } else { visible = true; sync(); }
})();

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

  // Section 6: idle pet video. Loads on first view and plays only while on screen (motion only, see the .motion gate).
  const petVideo = document.querySelector('.cs-pet-video');
  if (petVideo) {
    checks.push(() => {
      const r = petVideo.getBoundingClientRect();
      const on = r.bottom > 0 && r.top < window.innerHeight;
      if (on) { if (!petVideo.src) petVideo.src = petVideo.dataset.src; if (petVideo.paused) { const p = petVideo.play(); if (p) p.catch(() => {}); } }
      else if (!petVideo.paused) petVideo.pause();
    });
  }
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
// without WebGL, the transparent still stays. Each skin gets its own video element (created on first use), so
// switching never reloads a shared element.
(() => {
  const box = document.querySelector('.hero-avatar');
  const first = box && box.querySelector('video');
  if (!first || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.width = 576; canvas.height = 1024;
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true });
  if (!gl) return;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 uv; void main(){ uv = vec2((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5); gl_Position = vec4(p, 0.0, 1.0); }'));
  // Stacked alpha: color in the top half, matte in the bottom half. During a skin switch (g from 0 to 1) the
  // outgoing frame (tPrev) and the incoming loop (tCur) trade places band by band, with sliding slices, an RGB
  // split, and scanlines that peak mid-switch: a short digital glitch, like changing skins in a game.
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, `precision mediump float;
varying vec2 uv; uniform sampler2D tCur; uniform sampler2D tPrev; uniform float g; uniform float seed;
float rnd(float n){ return fract(sin(n * 91.345 + seed * 47.13) * 43758.5453); }
vec4 px(sampler2D t, vec2 q){ q = clamp(q, 0.0, 1.0); vec3 c = texture2D(t, vec2(q.x, q.y * 0.5)).rgb; float a = smoothstep(0.05, 0.95, texture2D(t, vec2(q.x, 0.5 + q.y * 0.5)).r); return vec4(c * a, a); }
vec4 pick(vec2 q, float useCur){ return useCur > 0.5 ? px(tCur, q) : px(tPrev, q); }
void main(){
  if (g <= 0.0 || g >= 1.0) { gl_FragColor = g >= 1.0 ? px(tCur, uv) : px(tPrev, uv); return; }
  float amp = sin(3.14159 * g);
  float band = floor(uv.y * 22.0 + floor(g * 9.0) * 3.0);
  float useCur = step(0.25 + rnd(band) * 0.5, g);
  float shift = (rnd(band + 7.0) - 0.5) * 0.16 * amp * step(0.45, rnd(band + 3.0));
  vec2 q = vec2(uv.x + shift, uv.y);
  float split = 0.018 * amp;
  vec4 r = pick(q + vec2(split, 0.0), useCur); vec4 m = pick(q, useCur); vec4 b = pick(q - vec2(split, 0.0), useCur);
  float a = max(m.a, max(r.a, b.a));
  vec3 c = vec3(r.r, m.g, b.b);
  c *= 1.0 - 0.22 * amp * step(0.5, fract(uv.y * 180.0));
  gl_FragColor = vec4(c, a);
}`));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return; // keep the still image
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const makeTex = (unit) => {
    const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
    [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3));
    return t;
  };
  const texCur = makeTex(0); const texPrev = makeTex(1);
  gl.uniform1i(gl.getUniformLocation(prog, 'tCur'), 0);
  gl.uniform1i(gl.getUniformLocation(prog, 'tPrev'), 1);
  const uG = gl.getUniformLocation(prog, 'g'); const uSeed = gl.getUniformLocation(prog, 'seed');
  gl.uniform1f(uG, 1);
  gl.clearColor(0, 0, 0, 0);
  box.append(canvas);

  const GLITCH_MS = 460;
  const videos = {};
  let video = null;
  let visible = true;
  let waitTimer = 0;
  let glitch = null; // { start } while a switch is in progress; start stays null until the new loop has a frame
  const getVideo = (src) => {
    if (videos[src]) return videos[src];
    const v = src === first.dataset.src ? first : first.cloneNode(false);
    if (v !== first) { v.removeAttribute('data-src'); box.append(v); }
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.src = src;
    v.addEventListener('playing', () => { if (v === video) draw(); });
    videos[src] = v;
    return v;
  };
  const upload = (tex, unit, v) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v); };
  const render = () => {
    let g = 1;
    if (glitch) {
      if (glitch.start === null) g = 0;
      else { g = Math.min(1, (performance.now() - glitch.start) / GLITCH_MS); if (g >= 1) glitch = null; }
    }
    gl.uniform1f(uG, g);
    gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const draw = () => {
    const v = video;
    if (!v) return;
    if (v.readyState >= 2) {
      // Browsers block video textures on file:// pages (opaque origin); keep the still instead of failing.
      try { upload(texCur, 0, v); } catch (err) { v.pause(); canvas.remove(); video = null; return; }
      if (glitch && glitch.start === null) glitch.start = performance.now();
      render();
      box.classList.add('is-live');
    } else if (glitch) render();
    if (!v.paused && v === video) {
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(draw); else requestAnimationFrame(draw);
    }
  };
  // The glitch animates faster than the video frame rate, so it drives its own frames while it runs.
  const glitchLoop = () => { if (!glitch || !video) return; render(); requestAnimationFrame(glitchLoop); };
  const play = () => { if (!video || !visible) return; const p = video.play(); if (p) p.then(draw).catch(() => {}); else draw(); };
  const use = (src, animate) => {
    const prev = video;
    if (animate && prev && prev.readyState >= 2 && box.classList.contains('is-live')) {
      try { upload(texPrev, 1, prev); } catch (err) { /* keep the plain switch */ }
      glitch = { start: null }; gl.uniform1f(uSeed, Math.random() * 100);
      requestAnimationFrame(glitchLoop);
    } else glitch = null;
    Object.values(videos).forEach((v) => v.pause());
    video = getVideo(src);
    if (glitch && video.readyState >= 2) glitch.start = performance.now();
    clearTimeout(waitTimer);
    if (video.readyState < 2) {
      // If the new loop has no frame yet, fall back to its still (with the CSS glitch) instead of holding the old look.
      const v = video;
      waitTimer = setTimeout(() => { if (video === v && v.readyState < 2) { glitch = null; box.classList.remove('is-live'); } }, animate ? 380 : 0);
    }
    play();
  };
  use(first.dataset.src, false);
  box.addEventListener('skin:change', (e) => { use(e.detail.src, true); });
  // Desktop story: warm the other skins' loops after the page settles, so switches start without a wait.
  if (window.matchMedia('(min-width: 1025px)').matches) {
    window.addEventListener('load', () => setTimeout(() => {
      document.querySelectorAll('.skin-btn[data-video]').forEach((b) => getVideo(b.dataset.video));
    }, 1500), { once: true });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => entries.forEach((e) => {
      visible = e.isIntersecting;
      if (visible) play(); else if (video) video.pause();
    })).observe(box);
  }

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

// Skin selector: swaps the avatar (still, loop, accessible name) and its object set. Works without motion too.
(() => {
  const buttons = [...document.querySelectorAll('.skin-btn')];
  const fig = document.querySelector('.hero-figure');
  const box = fig && fig.querySelector('.hero-avatar');
  if (!buttons.length || !box) return;
  const still = box.querySelector('.hero-avatar-still');
  const motion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const swapObjects = (skin) => {
    fig.dataset.skin = skin;
    fig.querySelectorAll('.hero-objects').forEach((g) => { g.hidden = g.dataset.skin !== skin; });
  };
  const swapAvatar = (btn) => {
    still.src = btn.dataset.poster;
    box.setAttribute('aria-label', btn.dataset.label);
    box.dispatchEvent(new CustomEvent('skin:change', { detail: { src: btn.dataset.video } }));
  };
  const apply = (btn) => { swapObjects(btn.dataset.skin); swapAvatar(btn); };

  // Orbit (motion only): the object set turns around the avatar like a ring while the avatar glitches. Moving to an
  // older stage (dir = 1), objects in front travel left to right and objects behind travel right to left; going back
  // reverses the turn. The old set leaves on the far half of the turn and the new set arrives into its own places.
  // Temporary copies do the travelling, so the real objects keep their float and parallax untouched.
  const ORBIT_MS = 800;
  let orbit = null;
  const endOrbit = () => {
    if (!orbit) return;
    clearTimeout(orbit.timer); clearTimeout(orbit.avatarTimer);
    orbit.anims.forEach((an) => an.cancel());
    orbit.layers.forEach((l) => l.remove());
    if (!orbit.avatarDone) swapAvatar(orbit.btn);
    fig.classList.remove('is-orbiting');
    orbit = null;
  };
  const snapshot = (img) => {
    // Layout box (unaffected by float, tilt, and parallax); object groups fill the figure, so offsets are figure-relative.
    const cs = getComputedStyle(img); const x = img.offsetLeft; const y = img.offsetTop; const w = img.offsetWidth; const h = img.offsetHeight;
    return { img, x, y, w, h, cx: x + w / 2, cy: y + h / 2, rot: parseFloat(cs.getPropertyValue('--r')) || 0, filter: cs.filter, opacity: parseFloat(cs.opacity) || 1 };
  };
  const startOrbit = (btn, dir) => {
    const fr = fig.getBoundingClientRect();
    const W = fr.width; const H = fr.height; const mid = W / 2;
    const visibleImgs = () => [...fig.querySelectorAll('.hero-objects:not([hidden]) .hero-obj')].filter((i) => i.offsetParent);
    const olds = visibleImgs().map(snapshot);
    swapObjects(btn.dataset.skin);
    const news = visibleImgs().map(snapshot);
    fig.classList.add('is-orbiting');
    const front = document.createElement('div'); front.className = 'orbit-layer orbit-front'; front.setAttribute('aria-hidden', 'true');
    const back = document.createElement('div'); back.className = 'orbit-layer orbit-back'; back.setAttribute('aria-hidden', 'true');
    fig.append(back, front);
    const anims = [];
    const fly = (o, leaving, order) => {
      // Which side of the ring: in front when travelling the "front" way for this direction.
      const onLeft = o.cx < mid;
      const inFront = leaving ? (onLeft === dir > 0) : (!onLeft === dir > 0);
      const mx = 2 * mid - o.cx; // mirrored x across the avatar's axis
      const fromX = leaving ? 0 : mx - o.cx; const toX = leaving ? mx - o.cx : 0;
      // Each object crosses at its own height: front crossings spread over torso-to-knee height (never the face),
      // back crossings rise a little. Spreading heights and start times keeps the middle of the turn from crowding.
      const midY = inFront ? H * (0.45 + 0.38 * (o.cy / H)) - o.cy : Math.max(H * 0.08, o.cy - H * 0.06) - o.cy;
      const sMid = inFront ? 1.18 : 0.78;
      const c = o.img.cloneNode(false);
      c.removeAttribute('loading');
      Object.assign(c.style, { left: `${o.x}px`, top: `${o.y}px`, width: `${o.w}px`, right: 'auto', margin: '0', animation: 'none', translate: 'none', filter: o.filter, opacity: '0' });
      (inFront ? front : back).append(c);
      const r = o.rot; const op = o.opacity;
      const t = (x, y, sc, rr) => `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${sc}) rotate(${rr}deg)`;
      const midX = (fromX + toX) / 2;
      const backFilter = `${o.filter === 'none' ? '' : o.filter} blur(2px)`.trim();
      const frontFilter = o.filter.replace(/blur\([^)]*\)/g, '').trim() || 'none'; // back-plane objects sharpen as they pass in front
      const frames = leaving
        ? [
          { offset: 0, transform: t(fromX, 0, 1, r), opacity: op, filter: o.filter },
          { offset: 0.5, transform: t(midX, midY, sMid, r + 8 * dir), opacity: inFront ? 1 : op * 0.55, filter: inFront ? frontFilter : backFilter },
          { offset: 0.82, transform: t(toX * 0.92, midY * 0.25, 0.92, r + 12 * dir), opacity: 0, filter: inFront ? o.filter : backFilter },
          { offset: 1, transform: t(toX, 0, 0.9, r + 14 * dir), opacity: 0, filter: o.filter },
        ]
        : [
          { offset: 0, transform: t(fromX, 0, 0.9, r - 14 * dir), opacity: 0, filter: inFront ? o.filter : backFilter },
          { offset: 0.2, transform: t(fromX * 0.92, midY * 0.25, 0.92, r - 12 * dir), opacity: 0, filter: inFront ? o.filter : backFilter },
          { offset: 0.5, transform: t(midX, midY, sMid, r - 8 * dir), opacity: inFront ? 1 : op * 0.55, filter: inFront ? frontFilter : backFilter },
          { offset: 1, transform: t(toX, 0, 1, r), opacity: op, filter: o.filter },
        ];
      // Old objects leave first (0 to ~620 ms), new ones arrive later (~180 to 800 ms), each staggered by its order.
      const stagger = order * 100;
      const delay = leaving ? stagger : 180 + stagger;
      const duration = leaving ? 520 : ORBIT_MS - 180 - stagger;
      anims.push(c.animate(frames, { duration, delay, easing: 'cubic-bezier(.45, .05, .35, 1)', fill: 'both' }));
    };
    const ordered = (list) => list.slice().sort((a, b) => a.cy - b.cy).map((o, i, arr) => [o, arr.length > 1 ? i / (arr.length - 1) : 0]);
    ordered(olds).forEach(([o, k]) => fly(o, true, k));
    ordered(news).forEach(([o, k]) => fly(o, false, k));
    orbit = { btn, anims, layers: [front, back], avatarDone: false };
    // The avatar glitch (460 ms) sits in the middle of the turn, so both read as one gesture.
    orbit.avatarTimer = setTimeout(() => {
      if (!orbit) return;
      orbit.avatarDone = true; swapAvatar(btn);
      fig.classList.remove('is-glitch-in'); void fig.offsetWidth; fig.classList.add('is-glitch-in');
      setTimeout(() => fig.classList.remove('is-glitch-in'), 420);
    }, 170);
    orbit.timer = setTimeout(endOrbit, ORBIT_MS + 20);
  };
  const select = (btn) => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    const prev = buttons.find((b) => b.getAttribute('aria-pressed') === 'true');
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    if (!motion) { apply(btn); return; }
    endOrbit();
    // Buttons run oldest first, so a lower index is an older stage: that is the forward (scroll down) direction.
    const dir = prev && buttons.indexOf(btn) > buttons.indexOf(prev) ? -1 : 1;
    startOrbit(btn, dir);
  };
  buttons.forEach((btn) => btn.addEventListener('click', () => select(btn)));
  // Lets other scripts (the Hero story) switch skins even when the picker itself is hidden or inert.
  document.addEventListener('skin:select', (e) => { const btn = buttons.find((b) => b.dataset.skin === e.detail); if (btn) select(btn); });
})();

// Snoof case, Interface: short loops recorded from the prototype play over the still screens, only with motion allowed
// and only while in view (each file loads on first view). Each phone has a Pause toggle (WCAG 2.2.2).
(() => {
  const figs = [...document.querySelectorAll('.cs-phone-loop')];
  if (!figs.length || !document.documentElement.classList.contains('motion')) return;
  figs.forEach((fig) => {
    const v = fig.querySelector('.cs-loop'); const t = fig.querySelector('.cs-loop-toggle');
    let paused = false; let visible = false;
    const sync = () => {
      if (visible && !paused) {
        if (!v.src) { v.src = v.dataset.src; fig.classList.add('is-ready'); }
        const p = v.play(); if (p) p.catch(() => {});
      } else if (v.src) v.pause();
      t.setAttribute('aria-pressed', String(paused));
      t.textContent = paused ? 'Play' : 'Pause';
    };
    t.hidden = false;
    t.addEventListener('click', () => { paused = !paused; sync(); });
    fig.check = () => {
      const r = fig.getBoundingClientRect(); const vh = window.innerHeight;
      const now = r.top < vh * 0.8 && r.bottom > vh * 0.2;
      if (now !== visible) { visible = now; sync(); }
    };
  });
  let ticking = false;
  const check = () => { ticking = false; figs.forEach((f) => f.check()); };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  check();
})();

// Snoof case, The direction: mark the detail on the screen, then lift it out to the callout, once, when in view.
(() => {
  const v = document.querySelector('.cs-choice-visual');
  if (!v || !document.documentElement.classList.contains('motion') || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { v.classList.add('is-shown'); io.disconnect(); } }), { threshold: 0.45 });
  io.observe(v);
})();

// Snoof case Hero: the full Jäger story sits behind a "Read the full story" toggle (click or tap, not hover). Without
// JavaScript the story stays open and the toggle stays hidden. Collapsed content is inert, so it is skipped by focus.
(() => {
  const toggle = document.querySelector('.cs-story-toggle');
  const story = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
  if (!story) return;
  const label = toggle.querySelector('.cs-story-label');
  const set = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Hide the full story' : 'Read the full story';
    story.classList.toggle('is-collapsed', !open);
    story.inert = !open;
  };
  set(false);
  toggle.hidden = false;
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
})();

// Selected Work reveal (motion only): a lettering cover glitches into an animated view of the project on hover or
// keyboard focus, using the same digital glitch as the avatar skins; on touch screens it reveals while the card is in
// view. The canvas draws both states: the lettering (background + mark) and the reveal (video frames on a brand field).
// The video loads only on first reveal. Without WebGL or with reduced motion, the lettering simply stays.
(() => {
  const boxes = [...document.querySelectorAll('.work-letter[data-reveal-video]')];
  if (!boxes.length || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const MS = 460;
  const VERT = 'attribute vec2 p; varying vec2 uv; void main(){ uv = vec2((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5); gl_Position = vec4(p, 0.0, 1.0); }';
  const FRAG = `precision mediump float;
varying vec2 uv; uniform sampler2D tA; uniform sampler2D tB; uniform float g; uniform float seed;
float rnd(float n){ return fract(sin(n * 91.345 + seed * 47.13) * 43758.5453); }
vec3 px(sampler2D t, vec2 q){ return texture2D(t, clamp(q, 0.0, 1.0)).rgb; }
vec3 pick(vec2 q, float useB){ return useB > 0.5 ? px(tB, q) : px(tA, q); }
void main(){
  if (g <= 0.0) { gl_FragColor = vec4(px(tA, uv), 1.0); return; }
  if (g >= 1.0) { gl_FragColor = vec4(px(tB, uv), 1.0); return; }
  float amp = sin(3.14159 * g);
  float band = floor(uv.y * 16.0 + floor(g * 9.0) * 3.0);
  float useB = step(0.25 + rnd(band) * 0.5, g);
  float shift = (rnd(band + 7.0) - 0.5) * 0.12 * amp * step(0.45, rnd(band + 3.0));
  vec2 q = vec2(uv.x + shift, uv.y);
  float split = 0.012 * amp;
  vec3 c = vec3(pick(q + vec2(split, 0.0), useB).r, pick(q, useB).g, pick(q - vec2(split, 0.0), useB).b);
  c *= 1.0 - 0.18 * amp * step(0.5, fract(uv.y * 220.0));
  gl_FragColor = vec4(c, 1.0);
}`;
  const loadImg = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });

  boxes.forEach(async (box) => {
    const canvas = document.createElement('canvas'); canvas.className = 'work-reveal-canvas'; canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;
    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const makeTex = (unit) => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE)); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); return t; };
    const texA = makeTex(0); const texB = makeTex(1);
    gl.uniform1i(gl.getUniformLocation(prog, 'tA'), 0); gl.uniform1i(gl.getUniformLocation(prog, 'tB'), 1);
    const uG = gl.getUniformLocation(prog, 'g'); const uSeed = gl.getUniformLocation(prog, 'seed');

    const [mark, poster] = await Promise.all([loadImg(box.dataset.letterMark), loadImg(box.dataset.revealPoster)]);
    if (!mark) return;
    const restC = document.createElement('canvas'); const revealC = document.createElement('canvas');
    let video = null; let g = 0; let target = 0; let from = 0; let t0 = 0; let raf = 0;
    const W = () => canvas.width; const H = () => canvas.height;
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(2, Math.round(box.clientWidth * dpr)); const h = Math.max(2, Math.round(box.clientHeight * dpr));
      [canvas, restC, revealC].forEach((c) => { c.width = w; c.height = h; });
      gl.viewport(0, 0, w, h);
      // Rest state: the same lettering the page shows underneath (background + centered mark at 44% width).
      const x = restC.getContext('2d'); x.fillStyle = box.dataset.letterBg; x.fillRect(0, 0, w, h);
      const mw = w * 0.44; const mh = mw * (mark.naturalHeight / mark.naturalWidth);
      x.drawImage(mark, (w - mw) / 2, (h - mh) / 2, mw, mh);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texA); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, restC);
      drawReveal(); render();
    };
    // Reveal state: the phone recording, full height with a little air, rounded, on the brand field.
    const drawReveal = () => {
      const w = W(); const h = H(); const x = revealC.getContext('2d');
      x.fillStyle = box.dataset.revealBg; x.fillRect(0, 0, w, h);
      const src = video && video.readyState >= 2 ? video : poster;
      if (src) {
        const sw = src.videoWidth || src.naturalWidth; const shh = src.videoHeight || src.naturalHeight;
        const dh = h * 0.88; const dw = dh * (sw / shh); const dx = (w - dw) / 2; const dy = (h - dh) / 2; const r = dw * 0.07;
        const path = () => { x.beginPath(); if (x.roundRect) x.roundRect(dx, dy, dw, dh, r); else x.rect(dx, dy, dw, dh); };
        // Lift the screen off the brand field: soft shadow, then the frame, then a light hairline edge.
        x.save(); x.shadowColor = 'rgba(16, 40, 44, .35)'; x.shadowBlur = h * 0.05; x.shadowOffsetY = h * 0.012; path(); x.fillStyle = '#fff'; x.fill(); x.restore();
        x.save(); path(); x.clip(); x.drawImage(src, dx, dy, dw, dh); x.restore();
        x.save(); path(); x.lineWidth = Math.max(1, h * 0.003); x.strokeStyle = 'rgba(255, 255, 255, .55)'; x.stroke(); x.restore();
      }
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, texB); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, revealC);
    };
    const render = () => { gl.uniform1f(uG, g); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
    const loop = (now) => {
      if (g !== target) { const k = Math.min(1, (now - t0) / MS); g = from + (target - from) * k; if (k >= 1) g = target; }
      if (g > 0) drawReveal();
      render();
      const playing = video && !video.paused;
      if (g !== target || (g > 0 && playing)) raf = requestAnimationFrame(loop); else raf = 0;
      if (g === 0 && video && !video.paused) video.pause();
    };
    const go = (to) => {
      if (to === target) return;
      if (to === 1 && !video) {
        video = document.createElement('video'); video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto';
        video.src = box.dataset.revealVideo;
      }
      if (to === 1 && video) { const pr = video.play(); if (pr) pr.catch(() => {}); }
      from = g; target = to; t0 = performance.now(); gl.uniform1f(uSeed, Math.random() * 100);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    box.append(canvas);
    size();
    new ResizeObserver(() => size()).observe(box);
    const link = box.closest('a') || box;
    if (canHover) {
      link.addEventListener('pointerenter', () => go(1));
      link.addEventListener('pointerleave', () => go(0));
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver((es) => es.forEach((e) => go(e.intersectionRatio >= 0.6 ? 1 : 0)), { threshold: [0, 0.6, 1] }).observe(box);
    }
    link.addEventListener('focus', () => { if (link.matches(':focus-visible')) go(1); });
    link.addEventListener('blur', () => go(0));
  });
})();

// Selected Work: on desktop with motion allowed, pin the section and move the cards sideways with vertical scroll.
(() => {
  const section = document.querySelector('.work');
  const heading = section && section.querySelector('.work-heading');
  const track = section && section.querySelector('.work-track');
  if (!track || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  const desktop = window.matchMedia('(min-width: 761px)');
  const counter = section.querySelector('.work-counter-current');
  const cards = [...track.querySelectorAll('.work-card')];
  let pin = null; let sticky = null; let distance = 0; let ticking = false;
  const setX = (x) => cards.forEach((c) => { c.style.transform = x ? `translate3d(${x}px, 0, 0)` : ''; });
  const build = () => {
    if (pin) return;
    pin = document.createElement('div'); pin.className = 'work-pin';
    sticky = document.createElement('div'); sticky.className = 'work-sticky';
    heading.before(pin); pin.append(sticky); sticky.append(heading, track);
    track.classList.add('is-pinned'); track.removeAttribute('tabindex'); track.scrollLeft = 0;
  };
  const teardown = () => {
    if (!pin) return;
    pin.before(heading, track); pin.remove(); pin = sticky = null;
    track.classList.remove('is-pinned'); track.setAttribute('tabindex', '0'); setX(0);
  };
  const measure = () => {
    if (!desktop.matches) { teardown(); return; }
    build(); setX(0);
    distance = Math.max(0, track.scrollWidth - track.clientWidth);
    pin.style.height = `${sticky.offsetHeight + distance}px`;
    update();
  };
  const update = () => {
    ticking = false;
    if (!pin) return;
    const p = distance > 0 ? Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / distance)) : 0;
    setX(-p * distance);
    if (counter) counter.textContent = String(Math.round(p * (cards.length - 1)) + 1).padStart(2, '0');
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  measure();
})();

// Hero scroll storytelling (test, v2 after Jackie's draft): on desktop with motion allowed, the header and Hero pin.
// Scroll first shrinks the headline to the top of the text column, then a timeline line travels through a fixed
// orange marker: the marker follows the curved path as each career chapter arrives, and the avatar switches in place. Otherwise the chapters
// stay a static list after the Hero.
(() => {
  const hero = document.querySelector('.hero');
  const list = document.querySelector('.hero-chapters');
  const header = document.querySelector('.site-header');
  if (!hero || !list || !header) return;
  const mode = window.matchMedia('(min-width: 1025px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
  const setup = () => {
  const copy = hero.querySelector('.hero-copy');
  const title = copy.querySelector('h1');
  const rest = [...copy.children].filter((el) => el !== title);
  const chapters = [...list.querySelectorAll('.chapter')];

  const originals = new Map([title, ...rest, ...chapters].map((el) => [el, el.getAttribute('style')]));
  const headerAnchor = document.createComment('Header position outside story mode');
  header.before(headerAnchor);
  const pin = document.createElement('div'); pin.className = 'hero-story-pin';
  const sticky = document.createElement('div'); sticky.className = 'hero-story-sticky';
  hero.before(pin); pin.append(sticky); sticky.append(header, hero);
  hero.classList.add('hero-story');
  const stage = document.createElement('div'); stage.className = 'story-stage';
  chapters.forEach((c) => stage.append(c));
  copy.append(stage);
  list.hidden = true;

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.classList.add('story-line'); svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path'); svg.append(path);
  // Mask: the line shows everywhere except behind the (shrunk) headline, so it can run up to the top of the screen.
  const maskId = 'story-line-mask';
  const defs = document.createElementNS(NS, 'defs');
  const mask = document.createElementNS(NS, 'mask'); mask.setAttribute('id', maskId); mask.setAttribute('maskUnits', 'userSpaceOnUse');
  // An SVG mask only covers 10% beyond the drawing by default; on wide screens the line swings further into the
  // margin and was cut there. Give the mask region explicit room in every direction.
  [['x', -20000], ['y', -20000], ['width', 60000], ['height', 1000000]].forEach(([k, v]) => mask.setAttribute(k, v));
  const maskAll = document.createElementNS(NS, 'rect'); maskAll.setAttribute('fill', '#fff');
  const maskTitle = document.createElementNS(NS, 'rect'); maskTitle.setAttribute('fill', '#000'); maskTitle.setAttribute('rx', '8');
  const maskLogo = document.createElementNS(NS, 'rect'); maskLogo.setAttribute('fill', '#000'); maskLogo.setAttribute('rx', '8');
  mask.append(maskAll, maskTitle, maskLogo); defs.append(mask); svg.prepend(defs);
  path.setAttribute('mask', `url(#${maskId})`);
  hero.prepend(svg);
  const dot = document.createElement('span'); dot.className = 'story-dot'; dot.setAttribute('aria-hidden', 'true'); hero.append(dot);

  // Story states: intro (current skin), then one per chapter, in the order of the chapter list.
  const SKINS = ['current', ...chapters.map((c) => c.dataset.skin)];
  const N = chapters.length; // chapter k (1..N) is centered at s = k
  const T0 = 0.75; // headline shrink finishes here
  let g = {}; let skin = hero.querySelector('.hero-figure').dataset.skin; let ticking = false;
  let navJump = false; // true while an in-page link glides past the story (no snapping, no skin changes on the way)

  const measure = () => {
    [title, ...rest, stage, ...chapters].forEach((el) => { el.style.transform = ''; el.style.opacity = ''; });
    const H = window.innerHeight;
    pin.style.height = `${sticky.offsetHeight + H * 0.67 * N}px`; // about two-thirds of a screen per chapter
    const hr = hero.getBoundingClientRect();
    const tr = title.getBoundingClientRect();
    const cr = copy.getBoundingClientRect();
    const scale = 0.5;
    const targetTop = hr.top + Math.max(96, H * 0.16);
    g = { H, scale, dy: targetTop - tr.top, titleBottom: targetTop - hr.top + tr.height * scale };
    // Separate the career block from the headline; align its text to one shared left edge.
    const stageTop = g.titleBottom + (H < 820 ? 48 : 72);
    stage.style.top = `${stageTop - (cr.top - hr.top)}px`;
    stage.style.left = '0px';
    stage.style.height = `${Math.max(0, hero.clientHeight - stageTop - 48)}px`;
    const first = chapters[0].querySelector('.chapter-title');
    const markerY = stageTop + (first.offsetTop + first.offsetHeight / 2);
    const markerInset = Math.min(20, Math.max(10, (cr.left - 12) * 0.35));
    const dotX = cr.left - hr.left - markerInset;
    // Chapters at rest sit below their marker (role, experience, summary, skill pills). Sweeps into the text column
    // happen only between the bottom of the tallest chapter and a clear gap above the next role title.
    const textBelow = Math.max(...chapters.map((c) => {
      const t = c.querySelector('.chapter-title');
      return c.offsetHeight - (t.offsetTop + t.offsetHeight / 2);
    })) + 28;
    const gapAbove = first.offsetHeight / 2 + 44;
    g.markerY = markerY; g.dotX = dotX;
    g.seg = Math.max(H * 0.55, textBelow + gapAbove + 170); // short journey, but always room for the sweep
    dot.style.left = `${dotX}px`; dot.style.top = `${markerY}px`;
    // Organic, non-linear career line. Between two chapters the line sweeps out into the free space below the
    // text, winding through loops (a trochoid on a curved spine), then returns to the marker for the next chapter.
    // Each segment has its own reach, loop count, and phase so the path never repeats itself.
    const S = g.seg;
    const total = markerY + N * S + window.innerHeight + 200;
    svg.setAttribute('viewBox', `0 0 ${hr.width} ${total}`);
    svg.style.height = `${total}px`;
    const gutter = Math.max(0, hr.left + dotX - 20);            // free space left of the marker, keeping 20 px from the screen edge
    const reach = Math.min(cr.width * 0.62, 420);               // how far a sweep may travel into the text column
    // Hand-authored gestures, one per chapter-to-chapter segment, built from a few spine points plus round loops.
    // Spine points are [x, y]: x in px offset from the marker column (positive into the free space below the text,
    // negative into the page margin), y from 0 (this marker) to 1 (next marker). A loop is { loop: [x, y, r, turns] }.
    // Near each marker (first and last ~30% of a segment) the line stays left of the text column, so it never crosses
    // a chapter's copy at rest; the sweeps and loops happen in the middle of the journey.
    const SEGMENTS = [
      [[0, 0], [-gutter * 0.25, 0.14], [-gutter * 0.3, 0.28], [reach * 0.12, 0.38], { loop: [reach * 0.24, 0.52, 40, 1] }, [reach * 0.46, 0.56], [reach * 0.2, 0.66], [-gutter * 0.2, 0.76], [-gutter * 0.15, 0.88], [0, 1]],
      [[0, 0], [-gutter * 0.5, 0.15], [-gutter * 0.45, 0.3], [reach * 0.08, 0.4], { loop: [reach * 0.14, 0.52, 34, 1] }, [reach * 0.34, 0.54], { loop: [reach * 0.34, 0.66, 26, 1] }, [reach * 0.1, 0.72], [-gutter * 0.3, 0.8], [-gutter * 0.1, 0.9], [0, 1]],
      [[0, 0], [-gutter * 0.3, 0.15], [-gutter * 0.2, 0.3], [reach * 0.16, 0.4], { loop: [reach * 0.26, 0.54, 38, 1] }, [reach * 0.4, 0.6], [reach * 0.12, 0.7], [-gutter * 0.25, 0.8], [0, 1]],
    ];
    // Remap each gesture's vertical rhythm: margin-only start down to yA, sweeps and loops between yA and yB,
    // margin-only approach from yB to the next marker.
    const yA = Math.max(0.3, textBelow / S);
    const yB = Math.max(yA + 0.1, 1 - gapAbove / S);
    const remap = (y) => {
      if (y <= 0.3) return y * (yA / 0.3);
      if (y <= 0.72) return yA + (y - 0.3) * ((yB - yA) / 0.42);
      return yB + (y - 0.72) * ((1 - yB) / 0.28);
    };
    const expand = (shape, y0) => {
      const out = [];
      shape.forEach((item) => {
        if (!item.loop) { out.push([dotX + item[0], y0 + remap(item[1]) * S]); return; }
        // Cursive loop: arrive at the bottom of the loop heading right, curl up and back over the top (counter-
        // clockwise on screen), and leave from the bottom heading right again, drifting down a little on the way.
        const [lx, ly, r] = item.loop;
        const cx = dotX + lx; const cy = Math.max(y0 + remap(ly) * S, y0 + textBelow + 2 * r) - r;
        for (let i = 0; i <= 14; i += 1) {
          const t = i / 14;
          const th = Math.PI / 2 - t * Math.PI * 2;
          out.push([cx + r * 1.15 * Math.cos(th) + t * r * 0.6, cy + r * Math.sin(th) + t * r * 0.35]);
        }
      });
      return out;
    };
    const smooth = (pts) => {
      let out = '';
      for (let i = 0; i < pts.length - 1; i += 1) {
        const p0 = pts[i - 1] || pts[i]; const p1 = pts[i]; const p2 = pts[i + 1]; const p3 = pts[i + 2] || p2;
        out += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      return out;
    };
    // Lead-in from above, arriving vertically at the first marker.
    // Lead-in from above the top of the screen, winding down the margin to the first marker.
    const topY = -hr.top - 60;
    let d = `M ${dotX - gutter * 0.3} ${topY}`;
    d += smooth([[dotX - gutter * 0.3, topY], [dotX - gutter * 0.7, topY + (markerY - topY) * 0.35], [dotX - gutter * 0.2, topY + (markerY - topY) * 0.7], [dotX, markerY]]);
    path.setAttribute('d', d);
    g.nodes = [path.getTotalLength()];
    for (let k = 0; k < N - 1; k += 1) {
      const y0 = markerY + k * S;
      const shape = SEGMENTS[k % SEGMENTS.length];
      const soft = expand(shape, y0);
      d += smooth(soft);
      path.setAttribute('d', d);
      g.nodes.push(path.getTotalLength());
    }
    const yN = markerY + (N - 1) * S;
    // Tail: keeps winding down past the bottom of the screen, so the story does not end on a loose stub.
    d += smooth([[dotX, yN - 30], [dotX, yN], [dotX - gutter * 0.25, yN + 120], [dotX + reach * 0.06, yN + Math.max(260, textBelow + 40)], [dotX - gutter * 0.4, yN + Math.max(420, textBelow + 200)], [dotX - gutter * 0.1, yN + window.innerHeight]]).replace(/^ C [^C]*?(?= C)/, '');
    path.setAttribute('d', d);
    update();
  };

  const clamp = (v) => Math.min(1, Math.max(0, v));
  // Plateaus: each chapter holds still for a stretch of scroll (DWELL on each side of its center), and the change
  // between chapters happens in the stretch between plateaus, eased in and out. Raw r is linear in scroll.
  const DWELL = 0.16;
  const dwell = (r) => {
    if (r <= 0) return 0;
    if (r < 1 - DWELL) return r / (1 - DWELL);
    if (r >= N) return N;
    const k = Math.round(r); const f = r - k; const a = Math.abs(f);
    if (a <= DWELL) return k;
    const u = (a - DWELL) / (0.5 - DWELL); const e = u * u * (3 - 2 * u);
    return k + Math.sign(f) * e * 0.5;
  };
  const update = () => {
    ticking = false;
    const dist = pin.offsetHeight - sticky.offsetHeight;
    const p = dist > 0 ? clamp(-pin.getBoundingClientRect().top / dist) : 0;
    const s = dwell(p * (N + 0.4)); // plateaus per chapter, plus a short hold after the last one
    // 1. Headline shrinks and moves up; band and supporting text leave upward.
    const t = clamp(s / T0); const e = t * t * (3 - 2 * t);
    title.style.transform = `translateY(${(g.dy * e).toFixed(1)}px) scale(${(1 - (1 - g.scale) * e).toFixed(4)})`;
    rest.forEach((el) => { el.style.opacity = (1 - clamp(t * 1.6)).toFixed(3); el.style.transform = `translateY(${(-40 * e).toFixed(1)}px)`; el.inert = t > 0.3; });
    // 2. Timeline: chapter k reaches the marker at s = k; the line scrolls with it.
    const phase = Math.min(s, N);
    const lineOn = clamp((s - 0.55) / 0.35);
    const journey = Math.max(0, phase - 1);
    const from = Math.min(N - 1, Math.floor(journey));
    const to = Math.min(N - 1, from + 1);
    const along = g.nodes[from] + (g.nodes[to] - g.nodes[from]) * (journey - from);
    const point = path.getPointAtLength(along);
    // Follow arc length even while the curve turns upward; keep its reading position beside the chapter.
    const shift = point.y - g.markerY;
    svg.style.transform = `translateY(${(-shift).toFixed(1)}px)`;
    // No clipping: the mask hides the line only where it would cross the headline (in line coordinates, so add shift).
    svg.style.clipPath = '';
    const hr2 = hero.getBoundingClientRect(); const tb = title.getBoundingClientRect();
    maskAll.setAttribute('x', -hr2.left - 50); maskAll.setAttribute('y', -2000 + shift);
    maskAll.setAttribute('width', window.innerWidth + 100); maskAll.setAttribute('height', 99999);
    maskTitle.setAttribute('x', tb.left - hr2.left - 14); maskTitle.setAttribute('y', tb.top - hr2.top - 10 + shift);
    maskTitle.setAttribute('width', tb.width + 28); maskTitle.setAttribute('height', tb.height + 20);
    const logo = header.querySelector('img'); const lb = logo ? logo.getBoundingClientRect() : null; // keep the line off the logo too
    if (lb) { maskLogo.setAttribute('x', lb.left - hr2.left - 12); maskLogo.setAttribute('y', lb.top - hr2.top - 10 + shift); maskLogo.setAttribute('width', lb.width + 24); maskLogo.setAttribute('height', lb.height + 20); }
    svg.style.opacity = lineOn.toFixed(3);
    dot.style.opacity = lineOn.toFixed(3);
    dot.style.left = `${point.x}px`;
    dot.style.top = `${g.markerY}px`;
    chapters.forEach((c, i) => {
      const k = i + 1; const dd = phase - k;
      // Text is only on screen near its marker, so the line can sweep through the column without crossing copy.
      const travel = clamp((Math.abs(dd) - 0.06) / 0.14);
      const vis = 1 - travel;
      c.style.opacity = (i === 0 ? Math.min(vis, lineOn) : vis).toFixed(3);
      c.style.transform = `translateY(${(-Math.sign(dd) * travel * 220).toFixed(1)}px)`;
      c.style.visibility = vis <= 0 ? 'hidden' : 'visible';
    });
    const next = SKINS[Math.min(N, Math.max(0, Math.round(s)))];
    if (next !== skin && !navJump) { skin = next; document.dispatchEvent(new CustomEvent('skin:select', { detail: next })); }
  };
  // A fragment targeting a sticky Hero can otherwise land at its last pinned position.
  const homeLinks = [...document.querySelectorAll('a[href="#hero"]')];
  const goHome = (event) => {
    if (event && (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return;
    if (event) { event.preventDefault(); history.pushState(null, '', '#hero'); }
    window.scrollTo({ top: pin.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
    update();
  };
  homeLinks.forEach((link) => link.addEventListener('click', goHome));
  const onHash = () => { if (location.hash === '#hero') goHome(); };
  window.addEventListener('hashchange', onHash);
  // Smooth scroll for the story (in the spirit of Lenis, without the library): wheel input moves a target, and the
  // page eases toward it every frame, so scrolling always responds and always glides. Plateaus are k = 0 (intro),
  // 1..N (chapters), and N + 1 (top of Selected Work). Two guards keep the story readable without fighting the user:
  // - speed limit: the target never runs past the next plateau until the page has settled on it (a short pause in
  //   input, or MIN_DWELL ms on the plateau), so even a hard swipe shows every chapter;
  // - soft snap: when input stops between plateaus, the page eases to the one it was heading for.
  const SPAN = N + 0.4;
  const LERP = 0.1; const MIN_DWELL = 700; const QUIET = 140;
  const stepY = (k) => pin.getBoundingClientRect().top + window.scrollY + (pin.offsetHeight - sticky.offsetHeight) * (k / SPAN);
  const range = () => { const top = stepY(0); return [top, top + (pin.offsetHeight - sticky.offsetHeight)]; };
  const work = document.getElementById('work');
  const exitY = () => (work ? work.getBoundingClientRect().top + window.scrollY : range()[1] + sticky.offsetHeight);
  const posY = (k) => (k > N ? exitY() : stepY(Math.max(0, k)));
  const rawAt = (y) => { const [top, end] = range(); return ((y - top) / Math.max(1, end - top)) * SPAN; };
  // Plateau index for a scroll position, or -1 when between plateaus.
  const EXIT_ZONE = 40; // the Work link lands scroll-margin (24 px) above the section; that still counts as "at Work"
  const plateauAt = (y) => {
    if (y >= exitY() - EXIT_ZONE && y <= exitY() + 3) return N + 1;
    const r = rawAt(y);
    if (r < 0.02) return 0;
    if (r > N - DWELL) return r <= SPAN + 0.001 ? N : -1;
    const k = Math.round(r);
    return k >= 1 && Math.abs(r - k) <= DWELL ? k : -1;
  };
  // Nearest plateau for any position, so the speed limit never works from a stale chapter after jumps or native scrolling.
  const nearestK = (y) => {
    if (y >= exitY() - EXIT_ZONE) return N + 1;
    if (y > stepY(N)) return (y - stepY(N)) < (exitY() - y) ? N : N + 1;
    return Math.max(0, Math.min(N, Math.round(rawAt(y))));
  };
  let current = window.scrollY; let target = current; let raf = 0; let running = false; let lastSet = current;
  let lastAnyWheel = 0; let strict = false; // strict: a native gesture was already moving when the story took over
  let anchor = 0; let enteredAt = 0; let enteredK = -1; let lastInput = 0; let lastDir = 1; let keyNav = false;
  const clampTarget = () => {
    const lo = posY(Math.max(0, anchor - 1)); const hi = posY(Math.min(N + 1, anchor + 1));
    target = Math.min(hi, Math.max(lo, target));
  };
  const snapTarget = () => {
    // Between plateaus: any deliberate move off a plateau carries on to the next one in that direction.
    const y = current; const r = rawAt(y);
    if (y > stepY(N) + 3) { const t = (y - stepY(N)) / Math.max(1, exitY() - stepY(N)); return lastDir > 0 ? (t > 0.05 ? exitY() : stepY(N)) : (t < 0.95 ? stepY(N) : exitY()); }
    const lo = r < 1 ? 0 : Math.floor(r); const hi = lo + 1;
    const t = r < 1 ? r / (1 - DWELL) : (r - lo - DWELL) / (1 - 2 * DWELL);
    return posY(lastDir > 0 ? (t > 0.05 ? hi : lo) : (t < 0.95 ? lo : hi));
  };
  const tick = () => {
    const now = performance.now();
    // External scroll (scrollbar drag, anchor jump, find-in-page): adopt it instead of fighting it.
    if (Math.abs(window.scrollY - lastSet) > 2) { lastDir = window.scrollY < lastSet ? -1 : 1; current = target = window.scrollY; lastSet = Math.round(current); anchor = nearestK(current); lastInput = now; navJump = false; }
    // Release the speed limit once the page sits on a new plateau long enough, or input pauses there.
    const k = plateauAt(current);
    if (k >= 0 && k !== anchor) {
      if (enteredK !== k) { enteredK = k; enteredAt = now; }
      if (now - lastInput > QUIET || (!strict && now - enteredAt > MIN_DWELL) || keyNav) { anchor = k; keyNav = false; strict = false; }
    } else if (k === anchor) enteredK = -1;
    // Soft snap after input stops between plateaus.
    if (!navJump && now - lastInput > 180 && Math.abs(target - current) < 1.5 && k < 0 && current > posY(0) + 2 && current < exitY() - 2) target = snapTarget();
    const gap = target - current;
    if (Math.abs(gap) > 0.5) {
      const dt = tick.last ? Math.min(0.05, (now - tick.last) / 1000) : 1 / 60;
      current += gap * (1 - Math.exp(-60 * (navJump ? 0.16 : LERP) * dt));
      if (Math.abs(target - current) < 0.5) current = target;
      lastSet = Math.round(current);
      window.scrollTo({ top: current, behavior: 'instant' });
      update();
    }
    tick.last = now;
    if (navJump && Math.abs(target - current) <= 0.5) { navJump = false; anchor = nearestK(current); update(); }
    if (Math.abs(target - current) > 0.5 || now - lastInput < 400) raf = requestAnimationFrame(tick);
    else { running = false; tick.last = 0; }
  };
  const kick = () => { if (!running) { running = true; tick.last = 0; raf = requestAnimationFrame(tick); } };
  const inRange = (dir) => {
    const y = running ? current : window.scrollY; const top = posY(0); const end = exitY();
    if (dir > 0) return y >= top - 2 && y < end - EXIT_ZONE;
    return y > top + 1 && y <= end + 2;
  };
  // Wheel or keys during a link glide: stop the glide where it is and continue from the nearest plateau.
  const cancelJump = () => {
    if (!navJump) return;
    navJump = false; target = current;
    anchor = current > stepY(N) + 3 ? (current >= exitY() - 3 ? N + 1 : N) : Math.max(0, Math.min(N, Math.round(rawAt(current))));
  };
  const onWheel = (e) => {
    if (e.ctrlKey) return; // pinch zoom
    cancelJump();
    let dy = e.deltaY; if (e.deltaMode === 1) dy *= 16; else if (e.deltaMode === 2) dy *= window.innerHeight;
    if (Math.abs(dy) < 0.5) return;
    const dir = dy > 0 ? 1 : -1;
    const nowW = performance.now(); const midGesture = nowW - lastAnyWheel < 120; lastAnyWheel = nowW;
    // A gesture that began as native scrolling (e.g. up through Selected Work) stays native: the browser marks the rest
    // of it non-cancelable, so taking over would fight it. Follow along instead and settle on a chapter once it ends.
    if (!e.cancelable) return;
    if (!inRange(dir) && !(running && Math.abs(target - current) > 1)) return; // outside the story: native scroll
    if (!running) {
      current = target = window.scrollY; lastSet = current; anchor = nearestK(current);
      // Momentum that was already scrolling the page natively (e.g. up from Selected Work) may move one chapter, then
      // must pause before the next, so it cannot carry straight through the last chapter.
      strict = midGesture;
    }
    e.preventDefault();
    lastInput = performance.now(); lastDir = dir;
    target += dy;
    clampTarget();
    kick();
  };
  const onKey = (e) => {
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    const down = ['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey; const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (!down && !up) return;
    const dir = down ? 1 : -1;
    cancelJump();
    if (!running) { current = target = window.scrollY; lastSet = current; }
    if (!inRange(dir)) return;
    // One key press, one chapter: from the plateau the page is on or heading to.
    let k = plateauAt(target);
    if (k < 0) { const r = rawAt(target); k = dir > 0 ? Math.floor(r) : Math.ceil(r); if (target > stepY(N) + 3) k = N; }
    const next = Math.max(0, Math.min(N + 1, k + dir));
    e.preventDefault();
    lastInput = performance.now(); lastDir = dir; keyNav = true; anchor = k;
    target = posY(next);
    kick();
  };
  // In-page links (Work, About, Contact): glide straight to the section through the story, instead of a native smooth
  // scroll that the story would read as a stop between chapters and snap back. Home has its own handler (goHome).
  const onAnchor = (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const id = a.getAttribute('href');
    if (id === '#' || id === '#hero') return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    history.pushState(null, '', id);
    current = window.scrollY; lastSet = Math.round(current);
    target = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
    navJump = true; lastInput = performance.now();
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    kick();
  };
  document.addEventListener('click', onAnchor);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  const onScroll = () => {
    if (running) return; // the smooth loop renders its own frames
    // Scrollbar drags and other native scrolling inside the story also settle on a plateau.
    if (Math.abs(window.scrollY - lastSet) > 2) { lastDir = window.scrollY < lastSet ? -1 : 1; current = target = lastSet = window.scrollY; anchor = nearestK(current); if (current < exitY() - EXIT_ZONE) { lastInput = performance.now(); kick(); } }
    if (!ticking) { ticking = true; requestAnimationFrame(() => { if (pin.isConnected) update(); }); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (pin.isConnected) measure(); });
  measure();
  return () => {
    homeLinks.forEach((link) => link.removeEventListener('click', goHome));
    window.removeEventListener('hashchange', onHash);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('wheel', onWheel);
    document.removeEventListener('click', onAnchor);
    window.removeEventListener('keydown', onKey);
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', measure);
    window.removeEventListener('load', measure);
    headerAnchor.replaceWith(header);
    pin.before(hero);
    chapters.forEach((chapter) => list.append(chapter));
    list.hidden = false;
    stage.remove(); svg.remove(); dot.remove(); pin.remove();
    hero.classList.remove('hero-story');
    originals.forEach((value, el) => { if (value === null) el.removeAttribute('style'); else el.setAttribute('style', value); });
    rest.forEach((el) => { el.inert = false; });
  };
  };
  let cleanup = null;
  const syncMode = () => {
    if (mode.matches && !cleanup) cleanup = setup();
    else if (!mode.matches && cleanup) { cleanup(); cleanup = null; }
  };
  mode.addEventListener('change', syncMode);
  syncMode();
})();
