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
  const sync = () => figure.style.setProperty('--pos', `${range.value}%`);
  range.addEventListener('input', sync);
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

  const videos = {};
  let video = null;
  let visible = true;
  const getVideo = (src) => {
    if (videos[src]) return videos[src];
    const v = src === first.dataset.src ? first : first.cloneNode(false);
    if (v !== first) { v.removeAttribute('data-src'); box.append(v); }
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto'; v.src = src;
    v.addEventListener('playing', () => { if (v === video) draw(); });
    videos[src] = v;
    return v;
  };
  const draw = () => {
    const v = video;
    if (!v) return;
    if (v.readyState >= 2) {
      // Browsers block video textures on file:// pages (opaque origin); keep the still instead of failing.
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v); } catch (err) { v.pause(); canvas.remove(); video = null; return; }
      gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      box.classList.add('is-live');
    }
    if (!v.paused && v === video) {
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(draw); else requestAnimationFrame(draw);
    }
  };
  const play = () => { if (!video || !visible) return; const p = video.play(); if (p) p.then(draw).catch(() => {}); else draw(); };
  const use = (src) => {
    Object.values(videos).forEach((v) => v.pause());
    video = getVideo(src);
    play();
  };
  use(first.dataset.src);
  box.addEventListener('skin:change', (e) => { box.classList.remove('is-live'); use(e.detail.src); });
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
  let switchTimer = 0; let revealTimer = 0;
  const apply = (btn) => {
    const skin = btn.dataset.skin;
    fig.dataset.skin = skin;
    still.src = btn.dataset.poster;
    box.setAttribute('aria-label', btn.dataset.label);
    fig.querySelectorAll('.hero-objects').forEach((g) => { g.hidden = g.dataset.skin !== skin; });
    box.dispatchEvent(new CustomEvent('skin:change', { detail: { src: btn.dataset.video } }));
  };
  const select = (btn) => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    if (!motion) { apply(btn); return; }
    fig.classList.add('is-switching');
    clearTimeout(switchTimer); clearTimeout(revealTimer);
    switchTimer = setTimeout(() => {
      apply(btn);
      const show = () => { clearTimeout(revealTimer); fig.classList.remove('is-switching'); };
      if (still.complete) setTimeout(show, 30);
      else { still.addEventListener('load', show, { once: true }); still.addEventListener('error', show, { once: true }); revealTimer = setTimeout(show, 700); }
    }, 280);
  };
  buttons.forEach((btn) => btn.addEventListener('click', () => select(btn)));
  // Lets other scripts (the Hero story) switch skins even when the picker itself is hidden or inert.
  document.addEventListener('skin:select', (e) => { const btn = buttons.find((b) => b.dataset.skin === e.detail); if (btn) select(btn); });
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
  const maskAll = document.createElementNS(NS, 'rect'); maskAll.setAttribute('fill', '#fff');
  const maskTitle = document.createElementNS(NS, 'rect'); maskTitle.setAttribute('fill', '#000'); maskTitle.setAttribute('rx', '8');
  mask.append(maskAll, maskTitle); defs.append(mask); svg.prepend(defs);
  path.setAttribute('mask', `url(#${maskId})`);
  hero.prepend(svg);
  const dot = document.createElement('span'); dot.className = 'story-dot'; dot.setAttribute('aria-hidden', 'true'); hero.append(dot);

  // Story states: intro (current skin), then one per chapter, in the order of the chapter list.
  const SKINS = ['current', ...chapters.map((c) => c.dataset.skin)];
  const N = chapters.length; // chapter k (1..N) is centered at s = k
  const T0 = 0.75; // headline shrink finishes here
  let g = {}; let skin = hero.querySelector('.hero-figure').dataset.skin; let ticking = false;

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
  const update = () => {
    ticking = false;
    const dist = pin.offsetHeight - sticky.offsetHeight;
    const p = dist > 0 ? clamp(-pin.getBoundingClientRect().top / dist) : 0;
    const s = p * (N + 0.4); // a short hold after the last chapter
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
    if (next !== skin) { skin = next; document.dispatchEvent(new CustomEvent('skin:select', { detail: next })); }
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
  // Lock points: one scroll gesture glides to the next chapter (or back) and stops there, so no chapter is skipped.
  // Steps are s = 0 (intro), 1..N (chapters), then N + 1 (start of Selected Work). Past that the page scrolls normally.
  const SPAN = N + 0.4;
  const stepY = (k) => pin.getBoundingClientRect().top + window.scrollY + (pin.offsetHeight - sticky.offsetHeight) * (k / SPAN);
  const range = () => { const top = stepY(0); return [top, top + (pin.offsetHeight - sticky.offsetHeight)]; };
  let animating = false; let lockedUntilQuiet = false; let lastWheel = 0; let settleTimer = 0;
  let glideTarget = 0; let raf = 0; let lastAbs = 0; let lastDir = 0;
  // Exit lock point (N + 1): the start of Selected Work, so leaving the last chapter is one gesture, not a long scroll.
  const work = document.getElementById('work');
  const exitY = () => (work ? work.getBoundingClientRect().top + window.scrollY : range()[1] + sticky.offsetHeight);
  const posY = (k) => (k > N ? exitY() : stepY(k));
  const nearestStep = () => {
    let best = 0; let bestD = Infinity;
    for (let k = 0; k <= N + 1; k += 1) { const d = Math.abs(window.scrollY - posY(k)); if (d < bestD) { bestD = d; best = k; } }
    return best;
  };
  // Ease-out: the page responds on the first frame and decelerates into the lock point. A new glide can
  // interrupt one in progress and continues from the current position, so quick swipes chain smoothly.
  const glideTo = (y, ms = 520) => {
    cancelAnimationFrame(raf);
    const from = window.scrollY; const t0 = performance.now(); animating = true;
    const ease = (t) => 1 - (1 - t) ** 4;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      window.scrollTo({ top: from + (y - from) * ease(t), behavior: 'instant' });
      update(); // render in the same frame as the scroll, not one frame later
      if (t < 1) raf = requestAnimationFrame(tick); else { animating = false; lockedUntilQuiet = true; }
    };
    raf = requestAnimationFrame(tick);
  };
  const currentS = () => { const [top, end] = range(); return ((window.scrollY - top) / Math.max(1, end - top)) * SPAN; };
  const step = (dir) => {
    const base = animating ? glideTarget : null;
    let target;
    if (base !== null) target = base + dir;
    else {
      const k = nearestStep();
      const offStep = Math.abs(window.scrollY - posY(k)) > 4;
      const sNow = window.scrollY > stepY(N) ? N + 0.5 : currentS();
      target = offStep ? (dir > 0 ? Math.ceil(sNow) : Math.floor(sNow)) : k + dir;
    }
    if (target < 0 || target > N + 1) return false; // leave the story: let the page scroll normally
    glideTarget = target;
    glideTo(posY(target), target > N ? 700 : 520);
    return true;
  };
  const inStory = (dir) => {
    const [top, end] = range(); const y = window.scrollY;
    if (dir > 0) return y >= top - 2 && y < exitY() - 2;
    return y > top + 2 && y <= exitY() + 2;
  };
  const onWheel = (e) => {
    const now = performance.now(); const quiet = now - lastWheel > 160; lastWheel = now;
    const abs = Math.abs(e.deltaY);
    if (abs < 1) return;
    const dir = e.deltaY > 0 ? 1 : -1;
    // Trackpad inertia decays steadily. A pause, a direction change, or a clear rise in speed means a new swipe.
    const fresh = quiet || dir !== lastDir || abs > lastAbs * 1.4 + 4;
    lastAbs = abs; lastDir = dir;
    if (animating || lockedUntilQuiet) {
      const [top] = range(); const inside = window.scrollY >= top - 2 && window.scrollY <= exitY() + 2;
      if (!fresh) { if (inside) e.preventDefault(); return; } // same gesture: one swipe moves one step
      lockedUntilQuiet = false;
      if (animating) { step(dir); e.preventDefault(); return; } // chain to the next step, or let the current glide finish
    }
    if (!inStory(dir)) return;
    if (step(dir)) e.preventDefault();
  };
  const onKey = (e) => {
    if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) return;
    const down = ['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey; const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
    if (!down && !up) return;
    const dir = down ? 1 : -1;
    if (animating) { if (step(dir)) e.preventDefault(); return; }
    if (!inStory(dir)) return;
    if (step(dir)) e.preventDefault();
  };
  // Scrollbar drags and other scroll sources settle on the nearest lock point.
  const settle = () => {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      if (animating) return;
      const [top] = range(); const y = window.scrollY;
      if (y <= top + 2 || y >= stepY(N) + 2) return;
      const k = nearestStep(); if (Math.abs(y - stepY(k)) > 3) { glideTarget = k; glideTo(stepY(k), 420); }
    }, 220);
  };
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  const onScroll = () => { settle(); if (!ticking) { ticking = true; requestAnimationFrame(() => { if (pin.isConnected) update(); }); } };
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
    window.removeEventListener('keydown', onKey);
    clearTimeout(settleTimer); cancelAnimationFrame(raf);
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
