/* cf5.js */
// Every moving part has a static reduced-motion state.
(() => {
  const RM = document.documentElement.classList.contains('rm');

  // ---------- 03 · decisions: the step crossing the middle of the screen is active ----------
  const steps = [...document.querySelectorAll('.dec')], rail = document.querySelector('.dec-rail i');
  const setActive = (i) => { steps.forEach((s, k) => { s.classList.toggle('on', k === i); s.classList.toggle('past', k < i); });
    if (rail) rail.style.transform = `scaleY(${steps.length > 1 ? Math.max(0, i) / (steps.length - 1) : 1})`;
    steps[i] && steps[i].dispatchEvent(new CustomEvent('dec:on')); };
  if (RM) steps.forEach(s => s.classList.add('on'));
  else { const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(steps.indexOf(e.target)); }), { rootMargin: '-45% 0px -45% 0px' }); steps.forEach(s => so.observe(s)); }

  // ---------- magnetic board: the day's menu changes by moving real magnets ----------
  const board = document.getElementById('mboard');
  if (board) {
    const A = 'assets/hola/byc/';
    const POT = { w: 32.28, h: 23.04, cx: .499, cy: .5078, lab: [28, 50, 72, 68] }, RND = { w: 33.42, h: 20.10, cx: .499, cy: .499, lab: [28.5, 43.5, 71.5, 58.5] }, STR = { w: 18.39, h: 13.08, cx: .5073, cy: .4932, lab: [11, 37.5, 89, 60.5] };
    const F = [['nutella', 'Nutella'], ['dulce', 'Dulce de Leche'], ['fudge', 'Chocolate Fudge'], ['whitechoc', 'White Chocolate']];
    const T = [['kitkat', 'Kit Kat'], ['ovomaltine', 'Ovomaltine'], ['mms', 'M&M’s'], ['peanutcandy', 'Peanut Candy'], ['chocoball', 'Chocoball'], ['popping', 'Popping Candy'], ['strawberry', 'Strawberry'], ['coconut', 'Coconut']];
    const place = F.map(([k, en], i) => [k, en, 18.2 + i * 21.2, 38.6, k === 'whitechoc' ? { ...POT, lab: [28, 52.5, 72, 70.5] } : POT]);
    T.forEach(([k, en], i) => place.push([k, en, [18.2, 39.4, 60.6, 81.8][i % 4], 71 + Math.floor(i / 4) * 12.5, k === 'strawberry' ? STR : RND]));
    const mags = {};
    for (const [k, en, cx, cy, S] of place) { const m = document.createElement('span'); m.className = 'mm'; m.dataset.k = k;
      m.style.cssText = `left:${cx - S.w * S.cx}%;top:${cy - S.h * S.cy}%;width:${S.w}%`;
      const [x0, y0, x1, y1] = S.lab;
      m.innerHTML = `<img src="${A}magnets/${k}.webp" alt=""><span class="mm-l" style="left:${x0}%;top:${y0}%;width:${x1 - x0}%;height:${y1 - y0}%">${en}</span>`;
      board.appendChild(m); mags[k] = m; }
    // a short, repeating sequence: two items run out (magnets come off), then come back; nothing else moves
    const out = ['coconut', 'whitechoc', 'popping'], status = document.getElementById('mstatus');
    let t = 0, step = 0;
    const tick = () => { const k = out[step % out.length], gone = Math.floor(step / out.length) % 2 === 0;
      mags[k].classList.toggle('gone', gone);
      const names = out.filter(x => mags[x].classList.contains('gone')).map(x => place.find(p => p[0] === x)[1]);
      if (status) status.textContent = names.length ? `Sold out today: ${names.join(', ')}` : 'Everything available';
      step++; };
    const run = () => { if (t) return; tick(); t = setInterval(tick, 1600); };
    const stop = () => { clearInterval(t); t = 0; };
    if (RM) { mags.coconut.classList.add('gone'); if (status) status.textContent = 'Sold out today: Coconut'; }
    else new IntersectionObserver(([e]) => e.isIntersecting ? run() : stop(), { threshold: .35 }).observe(board);
  }

  // ---------- consistent core: two fixed dispensers, two that rotate with the day ----------
  const rot = [...document.querySelectorAll('.disp.rot img')];
  if (rot.length && !RM) { const L = ['assets/hola/kitchen/art/label-Laka.webp', 'assets/hola/kitchen/art/label-Morango.webp'];
    let n = 0; setInterval(() => { if (!document.querySelector('.dec-core.on')) return; n++; rot.forEach((img, i) => { img.classList.add('swap'); setTimeout(() => { img.src = L[(n + i) % 2]; img.classList.remove('swap'); }, 260); }); }, 2600); }

  // ---------- pickup display: the number advances when its step is reached ----------
  const svg = document.getElementById('led-digits');
  if (svg) { const DIG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd' }, W = 88, H = 150, Tk = 15, g = 2.5;
    const h = (x, y) => `${x + Tk / 2 + g},${y} ${x + W - Tk / 2 - g},${y} ${x + W - g},${y + Tk / 2} ${x + W - Tk / 2 - g},${y + Tk} ${x + Tk / 2 + g},${y + Tk} ${x + g},${y + Tk / 2}`;
    const v = (x, y, hh) => `${x},${y + Tk / 2 + g} ${x + Tk / 2},${y + g} ${x + Tk},${y + Tk / 2 + g} ${x + Tk},${y + hh - Tk / 2 - g} ${x + Tk / 2},${y + hh - g} ${x},${y + hh - Tk / 2 - g}`;
    const half = (H - Tk) / 2 + Tk / 2;
    const draw = (num) => { svg.innerHTML = String(num).padStart(3, '0').split('').map((d, i) => { const s = { a: h(0, 0), g: h(0, (H - Tk) / 2), d: h(0, H - Tk), f: v(0, 0, half + Tk / 2), b: v(W - Tk, 0, half + Tk / 2), e: v(0, half - Tk / 2, half + Tk / 2), c: v(W - Tk, half - Tk / 2, half + Tk / 2) };
      return `<g transform="translate(${12 + i * 108} 5) skewX(-5)">` + Object.entries(s).map(([k, p]) => `<polygon class="seg${DIG[d].includes(k) ? ' on' : ''}" points="${p}"/>`).join('') + '</g>'; }).join(''); };
    draw(3);
    const step = svg.closest('.dec');
    if (step && !RM) step.addEventListener('dec:on', () => { let n = 1; draw(n); const t = setInterval(() => { n++; draw(n); if (n >= 3) clearInterval(t); }, 700); });
  }
})();


/* idea.js */
// Section 01 only: assemble once when the scrapbook enters view, then remain static.
(() => {
  const book = document.querySelector('#intro .idea-scrap');
  if (!book) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let observer, completion;
  const finish = () => {
    clearTimeout(completion);
    observer?.disconnect();
    book.dataset.entry = 'complete';
  };
  if (preference.matches || !('IntersectionObserver' in window)) { finish(); return; }
  book.dataset.entry = 'armed';
  observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    book.dataset.entry = 'assembling';
    // Compact entry: 8 ×35ms stagger +350ms, then static.
    completion = setTimeout(finish, 700);
  }, { threshold: .01, rootMargin: '0px 0px 120px 0px' });
  observer.observe(book);
  preference.addEventListener('change', event => { if (event.matches) finish(); });
})();


/* mall-menu.js */

(() => {
  const open = document.getElementById('mall-menu-open');
  const dialog = document.getElementById('mall-menu-dialog');
  if (!open || !dialog || !dialog.showModal) return;
  const zoom = document.getElementById('mall-menu-zoom');
  let session = null;
  const restore = () => {
    if (!session) return;
    const previous = session;
    session = null;
    document.body.style.overflow = previous.overflow;
    dialog.classList.remove('is-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'Zoom in';
    dialog.querySelector('.mall-menu-viewport').scrollTo(0, 0);
    if (previous.opener?.isConnected) previous.opener.focus({ preventScroll: true });
  };
  const close = () => {
    if (dialog.open) dialog.close();
    restore();
  };
  open.addEventListener('click', event => {
    event.preventDefault();
    if (dialog.open) return;
    session = { overflow: document.body.style.overflow, opener: event.currentTarget };
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  document.getElementById('mall-menu-close').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href], [tabindex]')]
      .filter(element => !element.disabled && element.tabIndex >= 0 && element.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (!first) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  zoom.addEventListener('click', () => {
    const active = dialog.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(active));
    zoom.textContent = active ? 'Zoom out' : 'Zoom in';
  });
  dialog.addEventListener('click', event => {
    const r = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) close();
  });
  // Fallback for any programmatic native close; duplicate cleanup is harmless.
  dialog.addEventListener('close', () => { if (!dialog.open) restore(); });
})();


/* dispensers.js */
// Use the supplied mockups as source material. Never crossfade their mismatched whole frames.
(() => {
  const scene = document.querySelector('#serve .dispenser-scene');
  if (!scene) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const PAD = 110, JOINT = 636, LARGE_JOINT = 710;
  const source = 'assets/hola/dispensers/';
  let observer, hold, settle, started = false;
  const finish = () => {
    clearTimeout(hold); clearTimeout(settle); observer?.disconnect();
    started = true; scene.dataset.state = 'complete';
  };
  const load = async (name) => {
    const image = new Image(); image.src = source + name; await image.decode(); return image;
  };
  const draw = async () => {
    const [equal, large] = await Promise.all([
      load('HOLA!%20Churros%20Dispenser%20Array.png'),
      load('Oversized%20Churro%20Sauce%20Dispenser%20Set.png'),
    ]);
    const fixed = scene.querySelector('.dispenser-fixed').getContext('2d');
    const a = scene.querySelector('.dispenser-equal').getContext('2d');
    const b = scene.querySelector('.dispenser-large').getContext('2d');
    // The first mockup supplies ALL unchanged pixels: base, levers, mechanisms, pink and cream.
    fixed.drawImage(equal, 0, PAD);
    const parts = [
      { x: 90, width: 260, lx: 55, lw: 315, shift: 6 },
      { x: 637, width: 253, lx: 600, lw: 320, shift: 1 },
    ];
    for (const p of parts) {
      // A shared neck datum holds both upper reservoirs on their original fixed mechanism.
      fixed.clearRect(p.x, PAD, p.width, JOINT);
      a.drawImage(equal, p.x, 0, p.width, JOINT, p.x, PAD, p.width, JOINT);
      b.drawImage(large, p.lx, 0, p.lw, LARGE_JOINT,
        p.lx + p.shift, PAD + JOINT - LARGE_JOINT, p.lw, LARGE_JOINT);
    }
    scene.dataset.ready = '';
    if (reduced.matches) { finish(); return; }
    observer = new IntersectionObserver(entries => {
      if (started || !entries.some(entry => entry.isIntersecting)) return;
      started = true; observer.disconnect();
      scene.dataset.state = 'holding';
      hold = setTimeout(() => {
        if (reduced.matches) { finish(); return; }
        scene.dataset.state = 'growing';
        settle = setTimeout(finish, 1450);
      }, 1800);
    }, { threshold: .4 });
    observer.observe(scene);
  };
  // The original equal-size PNG remains a stable fallback if either source fails.
  draw().catch(() => { scene.dataset.state = 'fallback'; });
  reduced.addEventListener('change', event => { if (event.matches && scene.hasAttribute('data-ready')) finish(); });
})();


/* byc.js */
// a purpose-built send transition (stamp, tear, ticket leaves, LED lights up), pickup display, full-bleed reveal.
(() => {
  const $ = (id) => document.getElementById('byc-' + id);   // every id in the component is prefixed
  const exp = $('exp'), RM = () => document.documentElement.classList.contains('rm');
  const toStage = () => { const r = exp.getBoundingClientRect(); if (Math.abs(r.top) > 1) window.scrollTo({ top: Math.round(window.scrollY + r.top), behavior: 'instant' }); };
  const wait = (ms) => new Promise(r => setTimeout(r, RM() ? Math.min(ms, 40) : ms));

  // ---------- menu (ticket order, approved English labels; orig = Brazilian name as printed) ----------
  const FILL = [['nutella', 'Nutella', 'Nutella'], ['dulce', 'Dulce de Leche', 'Doce de leite'], ['fudge', 'Chocolate Fudge', 'Brigadeiro'],
    ['whitechoc', 'White Chocolate', 'Laka']].map(([k, en, orig]) => ({ k, en, orig, fam: 'pot' }));
  const TOPS = [['kitkat', 'Kit Kat', 'Kit Kat'], ['ovomaltine', 'Ovomaltine', 'Ovomaltine'], ['mms', 'M&M’s', 'Disqueti'],
    ['peanutcandy', 'Peanut Candy', 'Paçoquita'], ['chocoball', 'Chocoball', 'Chocoball'],
    ['popping', 'Popping Candy', 'Explosivo'], ['strawberry', 'Strawberry', 'Morango'], ['coconut', 'Coconut', 'Coco']].map(([k, en, orig]) => ({ k, en, orig, fam: 'round' }));
  const ALL = Object.fromEntries([...FILL, ...TOPS].map(x => [x.k, x]));
  const HAVE = { fill: ['nutella', 'dulce', 'fudge', 'whitechoc'], tops: ['kitkat', 'ovomaltine', 'mms', 'peanutcandy', 'chocoball', 'popping', 'strawberry', 'coconut'] };   // produced churro photos
  const FULL = HAVE.tops;   // every topping is a full-coverage photo: it hides the spread and leaves the open end to the filling, so it works over any filling
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---------- board magnets (layout in % of the 60 × 90 face; all magnets at the same 80% scale) ----------
  const POT = { w: 32.28, h: 23.04, cx: .499, cy: .5078, lab: [28, 50, 72, 68], box: [26.04, 21.6, 73.75, 79.96], shape: '18%' };
  const RND = { w: 33.42, h: 20.10, cx: .499, cy: .499, lab: [28.5, 43.5, 71.5, 58.5], box: [24.17, 21.48, 75.63, 78.29], shape: '50%' };
  const STR = { w: 18.39, h: 13.08, cx: .5073, cy: .4932, lab: [11, 37.5, 89, 60.5], box: [3.96, 5.66, 97.5, 92.97], shape: '50%' };
  const place = [];
  FILL.forEach((f, i) => place.push([f, 18.2 + i * 21.2, 38.6,   // four pots, on the topping columns
    f.k === 'whitechoc' ? { ...POT, lab: [28, 52.5, 72, 70.5], box: [26.04, 24.12, 73.75, 82.68] } : POT]));
  const rows = [[18.2, 39.4, 60.6, 81.8], [18.2, 39.4, 60.6, 81.8]]; let ti = 0;   // eight toppings, two rows of four
  rows.forEach((xs, r) => xs.forEach(x => { const t = TOPS[ti++]; place.push([t, x, 71 + r * 12.5, t.k === 'strawberry' ? STR : RND]); }));
  const mags = {};
  for (const [it, cx, cy, T] of place) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'mag ' + it.fam; b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); b.dataset.k = it.k;
    b.style.cssText = `left:${cx - T.w * T.cx}%;top:${cy - T.h * T.cy}%;width:${T.w}%;--r:${((it.k.charCodeAt(0) * 7 + it.k.length * 13) % 5 - 2) * .6}deg`;
    const [x0, y0, x1, y1] = T.lab;
    b.innerHTML = `<img src="assets/hola/byc/magnets/${it.k}.webp" alt="" decoding="async"><span class="mag-label" style="left:${x0}%;top:${y0}%;width:${x1 - x0}%;height:${y1 - y0}%">${it.en}</span><span class="mag-hit" style="left:${T.box[0]}%;top:${T.box[1]}%;width:${T.box[2] - T.box[0]}%;height:${T.box[3] - T.box[1]}%;border-radius:${T.shape}"></span><span class="mag-check" style="top:${T === POT ? 20 : 22}%;right:${T === STR ? 6 : 24}%">${CHECK}</span>`;
    b.addEventListener('click', () => choose(it.k, 'board'));
    $('magnets').appendChild(b); mags[it.k] = b;
  }

  // ---------- ticket: header translated over the artwork; option rows rebuilt on the grey band ----------
  const main = $('tk-main'), stub = $('tk-stub');
  const patch = (host, cls, x0, y0, x1, y1, html, bg = '#fff') => { const d = document.createElement('div'); d.className = 'tk-patch ' + cls;
    d.style.cssText = `left:${x0}%;top:${y0}%;width:${x1 - x0}%;height:${y1 - y0}%;background:${bg}`; d.innerHTML = html; host.appendChild(d); return d; };
  patch(main, 'title', 40.5, 6.3, 67, 12.4, '<span>ORDER</span><span>TICKET</span>');
  patch(stub, 'title', 40, 90.9, 67, 96.7, '<span>ORDER</span><span>TICKET</span>');
  patch(main, 'togo', 47.6, 14.4, 68, 16.8, 'TO GO');
  patch(main, 'head', 36, 21.2, 64, 24.0, 'FILLING', '#e8e9ea');
  patch(main, 'head', 36, 34.2, 64, 37.2, 'TOPPINGS', '#e8e9ea');
  const numTop = patch(main, 'num', 69.4, 6.5, 93.5, 12.3, ''), numStub = patch(stub, 'num', 71.2, 90.9, 94.5, 96.6, '');
  const grid = (y0, y1, items, type) => { patch(main, '', 4.2, y0 - .25, 95.8, y1 + .25, '', '#e8e9ea');
    const g = document.createElement('div'); g.className = 'tk-opts'; g.style.cssText = `left:6%;width:90%;top:${y0}%;height:${y1 - y0}%;grid-template-rows:repeat(${Math.ceil(items.length / (type === 'radio' ? 2 : 3))}, 1fr)`;   // four fillings sit 2 × 2 on the first two topping columns
    g.setAttribute('role', 'group'); g.setAttribute('aria-label', type === 'radio' ? 'Filling, choose one (choosing another replaces it)' : 'Toppings, up to two');
    items.forEach((it, i) => { const l = document.createElement('label'); l.className = 'tk-opt'; l.dataset.k = it.k; if (type === 'radio') l.style.gridColumn = String(i % 2 + 1);
      l.innerHTML = `<input type="checkbox" name="${type === 'radio' ? 'fill' : 'top'}" value="${it.k}" aria-label="${it.en}${it.orig !== it.en ? ` (${it.orig})` : ''}"><span class="tk-box"><svg viewBox="0 0 100 100"><path d="M16 18 Q48 50 84 84"/><path d="M84 16 Q52 50 18 86"/></svg></span><span>${it.en}</span>`;
      l.querySelector('input').addEventListener('change', (e) => choose(it.k, 'ticket', e.target)); g.appendChild(l); });
    main.appendChild(g); };
  grid(24.85, 30.8, FILL, 'radio');
  grid(37.15, 50.35, TOPS, 'checkbox');
  const inputs = Object.fromEntries([...main.querySelectorAll('input')].map(i => [i.value, i]));

  // ---------- order state ----------
  let fill = null, tops = [], n = 3, busy = false, wasComplete = false, autoT = 0;
  const num = () => String(n).padStart(3, '0');
  const setNumber = () => { numTop.textContent = num(); numStub.textContent = num(); $('stampnum').textContent = num(); $('rnum').textContent = num(); };
  function choose(k, from, input) {
    if (exp.dataset.stage !== 'order' || busy) return;
    if (ALL[k].fam === 'pot') fill = fill === k ? null : k;
    else if (tops.includes(k)) tops = tops.filter(x => x !== k);
    else if (tops.length < 2) tops.push(k);
    else { if (input) input.checked = false; const m = mags[k]; m.classList.remove('nudge'); void m.offsetWidth; m.classList.add('nudge');
      const row = inputs[k].closest('.tk-opt'); row.classList.remove('nudge'); void row.offsetWidth; row.classList.add('nudge');
      $('rulemsg').textContent = 'Up to two toppings per churro. Remove one to swap.'; pulse(); barNote('Up to two toppings. Remove one to swap.'); return; }
    const complete = !!fill && tops.length === 2;
    render(); pulse();
    if (complete && !wasComplete) autoShowTicket();
    wasComplete = complete;
  }
  function render() {
    for (const k in ALL) { const on = k === fill || tops.includes(k); mags[k].classList.toggle('on', on); inputs[k].checked = on;
      inputs[k].closest('.tk-opt').classList.toggle('off', ALL[k].fam === 'round' && tops.length >= 2 && !on); }
    $('magnets').classList.toggle('fill-chosen', !!fill); $('magnets').classList.toggle('tops-full', tops.length >= 2); $('magnets').classList.toggle('tops-some', tops.length === 1);
    const s = fill ? [ALL[fill].en, ...tops.map(k => ALL[k].en)].join(' · ') : (tops.length ? 'Now choose one filling.' : 'Choose a filling to start.');
    for (const id of ['summary', 'msummary']) { $(id).textContent = s; $(id).classList.toggle('empty', !fill); }
    $('send').disabled = $('msend').disabled = !fill; $('mnum').textContent = num();
    $('rulemsg').textContent = tops.length >= 2 ? 'Two toppings chosen. Remove one to swap.' : '';
  }
  // ---------- mobile: the ticket is a sheet opened from the mini ticket in the bottom bar ----------
  const MOB = matchMedia('(max-width: 860px)'), sheet = $('ticket-sheet');
  const setSheet = (open) => { exp.classList.toggle('sheet-open', open); $('mticket').setAttribute('aria-expanded', open);
    $('mticket').querySelector('em').textContent = open ? 'Hide order ticket' : 'Show order ticket';
    if (MOB.matches) sheet.inert = !open; else sheet.inert = false; };
  $('mticket').addEventListener('click', () => setSheet(!exp.classList.contains('sheet-open')));
  $('scrim').addEventListener('click', () => setSheet(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && exp.classList.contains('sheet-open') && !busy) { setSheet(false); $('mticket').focus(); } });
  MOB.addEventListener('change', () => setSheet(false));
  // the order is complete: give the magnet a moment to settle, then slide the filled ticket up (mobile only)
  const autoShowTicket = () => { clearTimeout(autoT); if (!MOB.matches) return;   // mobile only: on desktop the ticket is always on screen
    autoT = setTimeout(() => { if (exp.dataset.stage === 'order' && !busy && fill && tops.length === 2) { setSheet(true); say('Order complete. Your ticket is ready to send.'); } }, RM() ? 0 : 650); };
  let noteT = 0; const barNote = (t) => { if (!MOB.matches) return; clearTimeout(noteT); $('msummary').textContent = t; $('msummary').classList.add('note'); noteT = setTimeout(() => { $('msummary').classList.remove('note'); render(); }, 1800); };
  const pulse = () => { const b = $('mbar'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); };
  const say = (t) => { $('announce').textContent = ''; setTimeout(() => $('announce').textContent = t, 40); };

  // ---------- LED display: three seven-segment digits ----------
  const svg = $('digits'), NS = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '<defs><filter id="byc-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
  const DIG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
  const W = 88, Hh = 150, T = 15, gp = 2.5;
  const hseg = (x, y) => `${x + T / 2 + gp},${y} ${x + W - T / 2 - gp},${y} ${x + W - gp},${y + T / 2} ${x + W - T / 2 - gp},${y + T} ${x + T / 2 + gp},${y + T} ${x + gp},${y + T / 2}`;
  const vseg = (x, y, h) => `${x},${y + T / 2 + gp} ${x + T / 2},${y + gp} ${x + T},${y + T / 2 + gp} ${x + T},${y + h - T / 2 - gp} ${x + T / 2},${y + h - gp} ${x},${y + h - T / 2 - gp}`;
  const digits = [0, 1, 2].map(i => { const x = 12 + i * 108, g = document.createElementNS(NS, 'g'); g.setAttribute('transform', `translate(${x} 5) skewX(-5)`);
    const half = (Hh - T) / 2 + T / 2, segs = { a: hseg(0, 0), g: hseg(0, (Hh - T) / 2), d: hseg(0, Hh - T), f: vseg(0, 0, half + T / 2), b: vseg(W - T, 0, half + T / 2), e: vseg(0, half - T / 2, half + T / 2), c: vseg(W - T, half - T / 2, half + T / 2) };
    const out = {}; for (const [k, p] of Object.entries(segs)) { const el = document.createElementNS(NS, 'polygon'); el.setAttribute('points', p); el.setAttribute('class', 'seg'); g.appendChild(el); out[k] = el; }
    svg.appendChild(g); return out; });
  const showDigit = (i, d, on = true) => { for (const k in digits[i]) digits[i][k].classList.toggle('on', on && DIG[d].includes(k)); };
  const clearLED = () => digits.forEach((_, i) => showDigit(i, 8, false));

  // optional activation sound: off by default, only after the visitor turns it on, never with reduced motion
  let ac = null, soundOn = false;
  const wake = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { ac = null; } } if (ac && ac.state !== 'running') ac.resume().catch(() => {}); };
  $('sound').addEventListener('click', () => { soundOn = !soundOn; $('sound').setAttribute('aria-pressed', soundOn); $('sound').textContent = soundOn ? 'Sound on' : 'Sound off';
    if (soundOn) { wake(); setTimeout(() => blip(1320, true), 60); } });
  window.__sound = { get on() { return soundOn; }, get state() { return ac ? ac.state : 'none'; }, played: 0 };
  const blip = (f, force) => { if (!soundOn || !ac || (RM() && !force)) return; window.__sound.played++; const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .14); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + .16); };

  // ---------- send: stamp, tear, the ticket leaves, the display lights up (~2.5 s) ----------
  async function send() {
    if (!fill || busy) return; busy = true; if (soundOn) wake();
    if (MOB.matches && !exp.classList.contains('sheet-open')) { setSheet(true); await wait(460); }   // frame the whole ticket before the stamp
    say(`Order ${num()} sent to the kitchen.`);
    exp.classList.add('s-stamp'); await wait(380);
    exp.classList.add('s-tear'); await wait(280);
    exp.classList.add('s-leave'); await wait(650);
    clearLED(); $('ledpanel').setAttribute('aria-label', `Order display: ${num()}`); exp.dataset.stage = 'pickup'; exp.classList.remove('sheet-open'); toStage();   // the display always lands in view
    await wait(300);
    const s = num();
    for (let i = 0; i < 3; i++) { const d = +s[i];
      if (!RM()) { showDigit(i, 8); await wait(60); showDigit(i, 8, false); await wait(50); }
      showDigit(i, d); blip(1180 + i * 140); await wait(i < 2 ? 200 : 70); }   // the burst follows the last digit almost at once
    window.__t = { ledDone: performance.now() };
    celebrate();
    exp.classList.add('s-ready'); say(`Your churro is ready. Order ${s}.`); busy = false;   // the button works as soon as it appears
    await wait(650); if (exp.dataset.stage === 'pickup') $('pick').focus({ preventScroll: true });
  }
  $('send').addEventListener('click', send); $('msend').addEventListener('click', send);

  // ---------- pick up: the churro, exactly as ordered (or a flagged placeholder) ----------
  $('pick').addEventListener('click', () => {
    if (busy) return; busy = true; stopBurst();
    const fillOK = HAVE.fill.includes(fill), topsOK = tops.every(t => HAVE.tops.includes(t)), exact = fillOK && topsOK && tops.every(t => FULL.includes(t) || fill === 'nutella');
    const L = (k) => exp.querySelector(`.hero .layer[data-l="${k}"]`);
    exp.querySelectorAll('.hero .layer').forEach(l => { l.classList.remove('on', 'm-front', 'm-far'); l.style.zIndex = ''; });
    if (exact) { L(fill).classList.add('on'); tops.forEach((t, i) => { const el = L(t); el.classList.add('on'); el.style.zIndex = 2 + i; if (tops.length === 2) el.classList.add(i ? 'm-far' : 'm-front'); }); }
    $('reveal').classList.toggle('placeholder', !exact);
    $('reveal-h').textContent = `${ALL[fill].en} churro`;
    $('rlist').textContent = tops.length === 2 ? `${ALL[tops[0]].en} on one half, ${ALL[tops[1]].en} on the other` : tops.length ? `Topped with ${ALL[tops[0]].en}` : 'Sugar and cinnamon, no toppings';
    const missing = [fill, ...tops].filter(k => !(ALL[k].fam === 'pot' ? HAVE.fill : HAVE.tops).includes(k)).map(k => ALL[k].en);
    const what = missing.length ? missing.join(', ') : `${ALL[fill].en} with ${tops.map(k => ALL[k].en).join(' and ')}`;
    exp.dataset.stage = 'reveal'; exp.classList.remove('s-stamp', 's-tear', 's-leave', 's-ready');
    const cb = exp.querySelector('.reveal-copy').getBoundingClientRect().bottom - $('reveal').getBoundingClientRect().top; $('reveal').style.setProperty('--copy-b', Math.round(cb) + 'px'); toStage();
    say(`${$('reveal-h').textContent}. ${$('rlist').textContent}.`); $('reveal').focus({ preventScroll: true });
    if (window.__t) window.__t.reveal = performance.now(); busy = false;
  });

  // ---------- celebration: candy-coated chocolates and fine sugar burst from behind the LED panel (~1.4 s) ----------
  // The canvas sits under the panel, so pieces appear around its edges and never cover the digits.
  const CANDY = ['#d42f28', '#f4c21b', '#1f6fd1', '#2e9a45', '#ef7a1d', '#6a3a22'];
  let burstRAF = 0;
  const stopBurst = () => { cancelAnimationFrame(burstRAF); const cv = $('celebrate'); cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); cv.classList.remove('on'); };
  function celebrate() {
    if (window.__t) window.__t.celebStart = performance.now();
    if (RM()) { if (window.__t) window.__t.celebEnd = window.__t.celebStart; return; }
    const cv = $('celebrate'), host = cv.parentElement.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1), W = host.width, H = host.height;
    cv.width = W * dpr; cv.height = H * dpr; cv.classList.add('on'); const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const pr = $('ledpanel').getBoundingClientRect(), cx = pr.left - host.left + pr.width / 2, cy = pr.top - host.top + pr.height / 2, hw = pr.width / 2, hh = pr.height / 2;
    const S = Math.min(1.15, Math.max(.6, pr.width / 620)), rnd = (a, b) => a + Math.random() * (b - a);
    const parts = [];
    // start just inside the panel outline (hidden behind it), fly outward with an upward bias
    const spawn = (candy) => { const t = Math.random(), side = Math.random(); let x, y;
      if (side < .45) { x = cx + (t * 2 - 1) * hw * .92; y = cy - hh * .8; } else if (side < .7) { x = cx - hw * .85; y = cy + (t * 2 - 1) * hh * .7; } else if (side < .95) { x = cx + hw * .85; y = cy + (t * 2 - 1) * hh * .7; } else { x = cx + (t * 2 - 1) * hw * .8; y = cy + hh * .7; }
      let dx = (x - cx) / hw, dy = (y - cy) / hh - .9; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
      const v = (candy ? rnd(7, 13) : rnd(3, 10)) * S; return { x, y, vx: dx * v * (candy ? 1.15 : 1.3), vy: dy * v };
    };
    for (let i = 0; i < 42; i++) parts.push({ c: 1, ...spawn(1), rot: rnd(0, 6.3), vr: rnd(-.2, .2), flip: rnd(0, 6.3), vf: rnd(.12, .32), s: rnd(8.5, 12.5) * S, col: CANDY[i % 6], d: rnd(0, 140) });
    for (let i = 0; i < 150; i++) parts.push({ c: 0, ...spawn(0), s: rnd(.8, 2), a0: rnd(.45, .95), warm: Math.random() < .35, d: rnd(0, 220) });
    const t0 = performance.now(), DUR = 1450;
    const frame = (now) => {
      const t = now - t0; g.clearRect(0, 0, W, H);
      for (const p of parts) { if (t < p.d) continue;
        p.vy += p.c ? .3 * S : .1 * S; p.vx *= p.c ? .992 : .975; p.vy *= p.c ? 1 : .985; p.x += p.vx; p.y += p.vy;
        const fade = Math.max(0, Math.min(1, (DUR - t) / 420));
        if (p.c) { p.rot += p.vr; p.flip += p.vf; const sy = .42 + .58 * Math.abs(Math.cos(p.flip));
          g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.scale(1, sy); g.globalAlpha = fade;
          g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(1.2, 2, p.s, p.s * .92, 0, 0, 7); g.fill();
          g.fillStyle = p.col; g.beginPath(); g.ellipse(0, 0, p.s, p.s * .92, 0, 0, 7); g.fill();
          const hl = g.createRadialGradient(-p.s * .35, -p.s * .42, 0, -p.s * .35, -p.s * .42, p.s * .85); hl.addColorStop(0, 'rgba(255,255,255,.78)'); hl.addColorStop(1, 'rgba(255,255,255,0)');
          g.fillStyle = hl; g.beginPath(); g.ellipse(0, 0, p.s, p.s * .92, 0, 0, 7); g.fill(); g.restore(); }
        else { g.globalAlpha = p.a0 * fade; g.fillStyle = p.warm ? '#ecc99a' : '#fffaf0'; g.fillRect(p.x, p.y, p.s, p.s); }
      }
      g.globalAlpha = 1;
      if (t < DUR) burstRAF = requestAnimationFrame(frame); else { stopBurst(); if (window.__t) window.__t.celebEnd = performance.now(); }
    };
    burstRAF = requestAnimationFrame(frame);
  }

  // ---------- another order ----------
  $('again').addEventListener('click', () => { stopBurst(); clearTimeout(autoT); wasComplete = false; setSheet(false); exp.classList.remove('sheet-open'); n++; fill = null; tops = []; setNumber(); exp.dataset.stage = 'order'; render(); clearLED();
    toStage(); exp.querySelector('.tk-opt input').focus({ preventScroll: true }); say(`New ticket, order ${num()}.`); });

  // the stage is "in view" while it crosses the middle of the viewport; leaving it closes the mobile sheet
  new IntersectionObserver(([e]) => { exp.classList.toggle('in-view', e.isIntersecting); if (!e.isIntersecting && exp.classList.contains('sheet-open') && !busy) setSheet(false); },
    { rootMargin: '-40% 0px -40% 0px' }).observe(exp);
  setNumber(); render(); setSheet(false);
  // review hook (study only)
  window.__sheet = setSheet;
  window.__order = { set: (f, t) => { fill = f; tops = t; wasComplete = !!f && t.length === 2; render(); }, get state() { return { fill, tops: [...tops] }; } };
})();
