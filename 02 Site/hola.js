// and the guided kitchen player (section 02). The 3D scene itself lives in assets/hola/kitchen/kitchen3d.js
// and is only imported when section 02 comes near and motion is allowed.
import { PARTS, TOTAL, SENT, STEPS, BEATS, RATE } from './assets/hola/kitchen/shots.js';

const root = document.documentElement;
const RM = root.classList.contains('rm');

/* ---------- Hero: scale the 1536 × 1024 (desktop) or 1024 × 1536 (phone) artboard, drive --p from scroll ---------- */
(() => {
  const frame = document.getElementById('hc-frame');
  if (!frame) return;
  const board = document.getElementById('hc-board'), boardM = document.getElementById('hc-board-m'), boardMF = document.getElementById('hc-board-mf');
  const hero = frame.parentElement;
  const set = (el, x, y, s) => { el.style.left = '0'; el.style.top = '0'; el.style.transform = `translate(${x}px,${y}px) scale(${s})`; };
  function layout() {
    const w = frame.clientWidth, h = frame.clientHeight;
    if (w <= 760) {   // phone: portrait photo, anchored left (front end visible) and bottom
      const s = Math.min(w / 830, h / 1536 * 1.25);
      set(boardM, 0, h - 1536 * s, s); set(boardMF, 0, h - 1536 * s, s); return;
    }
    const s = Math.max(w / 1536, h / 1024);   // desktop: cover the frame, composition centered
    set(board, (w - 1536 * s) / 2, (h - 1024 * s) / 2, s);
  }
  let ticking = false;
  function progress() {
    ticking = false;
    let p = 0;
    if (!RM) { const r = hero.getBoundingClientRect(), travel = hero.offsetHeight - innerHeight; p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0; }
    frame.style.setProperty('--p', p.toFixed(4));
  }
  layout(); progress();
  addEventListener('resize', () => { layout(); progress(); });
  if (!RM) addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });
})();

/* ---------- Case nav: script.js keeps it hidden until #intro has .is-reached (data-nav-start) ---------- */
(() => {
  const intro = document.getElementById('intro');
  if (!intro) return;
  let last = null;
  const check = () => {
    const on = intro.getBoundingClientRect().top < innerHeight * .6;
    intro.classList.toggle('is-reached', on);
    const changed = last !== null && on !== last; last = on;
    if (changed) dispatchEvent(new Event('scroll'));   // let script.js re-evaluate the nav
  };
  addEventListener('scroll', check, { passive: true }); addEventListener('resize', check); check();
})();

/* ---------- Section 02: the guided kitchen ---------- */
(() => {
  const box = document.getElementById('hk');
  if (!box) return;
  const $ = (id) => document.getElementById(id);
  const stage = $('hk-stage'), still = $('hk-still'), note = $('hk-note'), live = $('hk-live');
  const playBtn = $('hk-play'), backBtn = $('hk-back'), nextBtn = $('hk-next');
  const PHONE = matchMedia('(max-width: 860px)');
  const DESC = [
    'Part 1: the closed Hola! Churros trailer, about 3 by 2 meters, seen from outside before its windows open.',
    'Part 2: inside the open trailer, the camera moves from station to station: dough dispenser, fryer, trays, filling dispensers, toppings, and the register window.',
    'Part 3: one order through the kitchen, from the ticket at the register to the churro packed in its tray at the same window, then a dashed line tracing its path.',
    'Part 4: the kitchen staffed by three, then five, then eight people, each working at their own station.',
  ];
  const STOPS = [...PARTS.map(p => p.a), ...BEATS.slice(1).map(b => b[0])].sort((a, b) => a - b);   // parts, then the 5 and 8 team sizes
  const partAt = (x) => PARTS.findLast(p => x >= p.a) || PARTS[0];

  // state
  let mode = 'still';          // 'still' (key frames) or 'live' (3D)
  let t = 0, playing = false, userPaused = false, autoPaused = false, autoplayed = false;
  let K = null, loading = null, visible = 0, lastPartN = 0, raf = 0, last = 0, dirty = true;
  let stillPart = 1;           // part shown in still mode
  let holdTeam = false;

  // capability checks
  const gl = (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } })();
  const conn = navigator.connection;
  const lite = !!(conn && (conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType || '')));
  let liveAllowed = gl && !RM && !lite;   // automatic 3D; otherwise the reader opts in with "Play animation"

  // chapter timeline
  $('hk-tl').innerHTML = PARTS.map(p => `<button type="button" data-n="${p.n}"><i><b></b></i><span>${p.s}</span></button>`).join('');
  const tlBtns = [...$('hk-tl').children];

  function setNote(text, action) {
    note.hidden = !text; note.textContent = text || '';
    if (action) { const b = document.createElement('button'); b.type = 'button'; b.className = 'hk-link'; b.textContent = action.label; b.onclick = action.fn; note.append(' ', b); }
  }
  function rolesFor(x) {
    const b = BEATS.findLast(q => x >= q[0]); if (!b) return '';
    const prev = BEATS[BEATS.indexOf(b) - 1], n0 = prev ? prev[1] : 0;
    return b[2].map((r, i) => `<li class="${n0 && i >= n0 ? 'new' : ''}"><b>${i + 1}</b>${r}</li>`).join('');
  }
  function ui() {
    const p = mode === 'live' ? partAt(t) : PARTS[stillPart - 1];
    $('hk-count').innerHTML = `<b>0${p.n}</b> / 04`; $('hk-title').textContent = p.t;
    const full = mode === 'still';
    $('hk-cap').textContent = SENT.filter(x => x[1] === p.n && (full || Math.max(t, p.a + .6) >= x[0])).map(x => x[2]).join(' ');
    const st = !full && p.n === 3 ? STEPS.findLast(x => t >= x[0]) : null;
    $('hk-step').textContent = st ? st[1] : '';
    const roles = p.n === 4 ? (full ? rolesFor(TOTAL) : rolesFor(t)) : '';
    $('hk-roles').hidden = !roles; if (roles && $('hk-roles').innerHTML !== roles) $('hk-roles').innerHTML = roles;
    tlBtns.forEach((bt, i) => { const q = PARTS[i]; const f = full ? (q.n <= p.n ? 1 : 0) : Math.max(0, Math.min(1, (t - q.a) / (q.b - q.a)));
      bt.querySelector('b').style.width = `${f * 100}%`; if (q.n === p.n) bt.setAttribute('aria-current', 'step'); else bt.removeAttribute('aria-current'); });
    playBtn.textContent = mode === 'still' ? 'Play animation' : playing ? 'Pause' : t >= TOTAL ? 'Replay' : 'Play';
    playBtn.hidden = mode === 'still' && !gl;
    if (p.n !== lastPartN) {
      lastPartN = p.n; stage.setAttribute('aria-label', DESC[p.n - 1]);
      live.textContent = `Part ${p.n} of 4: ${p.t}`;
      if (mode === 'still') showStill(p.n);
    }
  }
  function showStill(n) {
    const src = (s) => `./assets/hola/kitchen/stills/part-${n}${s}.webp`;
    still.querySelector('source').srcset = src('-m'); still.querySelector('img').src = src('');
  }

  // ----- still mode
  function toStill(n, message) {
    mode = 'still'; playing = false; box.dataset.mode = 'still'; box.classList.remove('is-ready');
    stillPart = n; lastPartN = 0; stopLoop();
    setNote(message || '', null); ui();
  }

  // ----- live mode
  function ensureKitchen() {
    if (loading) return loading;
    setNote('Loading the kitchen…');
    loading = import('./assets/hola/kitchen/kitchen3d.js').then(m => {
      K = m; setNote('');
      m.teamReady.catch(() => { if (mode === 'live' && t >= PARTS[3].a) toStill(4); });
      return m;
    }).catch(() => { liveAllowed = false; toStill(partAt(t).n); return null; });
    return loading;
  }
  async function goLive(from, autoplay) {
    mode = 'live'; box.dataset.mode = 'live'; t = from; lastPartN = 0;
    const m = await ensureKitchen(); if (!m || mode !== 'live') return;
    dirty = true; if (autoplay) playing = true; startLoop(); ui();
  }

  // ----- frame loop: runs only while live and on screen; renders only when the time changed
  let fpsWin = [], fpsGrace = 0;
  function frame(now) {
    raf = 0;
    if (mode !== 'live' || !K || visible < .3 || document.hidden) return;
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    if (playing) {
      const next = Math.min(TOTAL, t + dt * RATE(t));
      holdTeam = next >= PARTS[3].a && !K.isTeamReady();
      if (holdTeam) { t = Math.max(t, PARTS[3].a); if (note.hidden) setNote('Loading the team…'); }
      else { if (note.textContent === 'Loading the team…') setNote(''); t = next; dirty = true; }
      if (t >= TOTAL) { playing = false; }
      // low-performance guard: under 24 fps for 3 s swaps to the stills at the same part
      if (now > fpsGrace) { fpsWin.push(now); while (fpsWin.length && now - fpsWin[0] > 3000) fpsWin.shift();
        if (fpsWin.length > 2 && now - fpsWin[0] > 2900 && fpsWin.length / 3 < 24) { const n = partAt(t).n; liveAllowed = false;
          toStill(n, 'The animation was running slowly here, so these are its key frames.'); return; } }
    }
    if (dirty) { K.frame(t); dirty = false; if (!box.classList.contains('is-ready')) box.classList.add('is-ready'); }
    ui();
    if (playing || dirty) raf = requestAnimationFrame(frame);
  }
  function startLoop() { if (!raf && mode === 'live' && K && visible >= .3 && !document.hidden) { last = performance.now(); fpsWin = []; fpsGrace = last + 2000; raf = requestAnimationFrame(frame); } }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function seek(x) { t = Math.max(0, Math.min(TOTAL, x)); dirty = true; ui(); startLoop(); }

  // ----- controls
  playBtn.addEventListener('click', () => {
    if (mode === 'still') { userPaused = false; goLive(PARTS[stillPart - 1].a, true); return; }
    if (t >= TOTAL) { t = 0; dirty = true; }
    playing = !playing; userPaused = !playing; autoPaused = false; startLoop(); ui();
  });
  backBtn.addEventListener('click', () => {
    if (mode === 'still') { if (stillPart > 1) { stillPart--; lastPartN = 0; ui(); } return; }
    const s = STOPS.filter(x => x < t - .6); seek(s.length ? s[s.length - 1] : 0);
  });
  nextBtn.addEventListener('click', () => {
    if (mode === 'still') { if (stillPart < 4) { stillPart++; lastPartN = 0; ui(); } return; }
    const s = STOPS.find(x => x > t + .05); if (s !== undefined) seek(s);
  });
  $('hk-tl').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return; const n = +b.dataset.n;
    if (mode === 'still') { stillPart = n; lastPartN = 0; ui(); } else seek(PARTS[n - 1].a);
  });

  // ----- visibility: load one screen early, autoplay once at 60%, pause under 30%, resume unless the reader paused
  const vh = () => innerHeight || 1;
  const io = new IntersectionObserver((es) => {
    for (const e of es) {
      const h = Math.min(e.boundingClientRect.height, vh());
      visible = e.isIntersecting ? Math.min(1, e.intersectionRect.height / h) : 0;
    }
    if (mode !== 'live') return;
    if (visible < .3) { if (playing) { playing = false; autoPaused = true; ui(); } stopLoop(); return; }
    if (visible >= .6 && K) {
      if (!autoplayed) { autoplayed = true; if (!userPaused) playing = true; }
      else if (autoPaused && !userPaused) { playing = true; autoPaused = false; }
    }
    startLoop(); if (K) ui();
  }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
  io.observe(box);
  const near = new IntersectionObserver((es) => {
    if (!es.some(e => e.isIntersecting)) return; near.disconnect();
    if (liveAllowed && mode !== 'live') goLive(0, false).then(() => { if (visible >= .6 && !autoplayed && mode === 'live') { autoplayed = true; playing = true; startLoop(); ui(); } });
  }, { rootMargin: '100% 0px 100% 0px' });
  near.observe(box);
  document.addEventListener('visibilitychange', () => {
    if (mode !== 'live') return;
    if (document.hidden) { if (playing) { playing = false; autoPaused = true; ui(); } stopLoop(); }
    else if (autoPaused && !userPaused && visible >= .6) { playing = true; autoPaused = false; startLoop(); }
  });
  new ResizeObserver(() => { if (mode === 'live' && K) { dirty = true; startLoop(); } }).observe(stage);
  PHONE.addEventListener?.('change', () => { if (mode === 'still') { lastPartN = 0; ui(); } });

  // initial state
  toStill(1, !gl ? '' : RM ? '' : lite ? 'The animation is off to save data.' : '');
  box.classList.add('has-js');
  // review aid: #t=<seconds> opens the live kitchen paused at that time (off by default)
  const fromHash = () => {
    const h = new URLSearchParams(location.hash.slice(1)); if (!h.has('t') || !gl) return;
    const x = +h.get('t'); autoplayed = true; userPaused = true; playing = false;
    if (mode === 'live') seek(x); else goLive(x, false);
  };
  fromHash(); addEventListener('hashchange', fromHash);
})();


/* Keep the approved photographic cover, but fit editorial text to the viewport. */
(() => {
 const frame=document.querySelector('#hc-frame'),board=document.querySelector('#hc-board');
 if(!frame||!board)return;
 const title=board.querySelector('.hc-title'),copy=board.querySelector('.hc-copy');
 function fit(){
  const w=frame.clientWidth,h=frame.clientHeight;
  if(w<=760){for(const e of[title,copy])e.removeAttribute('style');return;}
  const scale=Math.max(w/1536,h/1024),x=(w-1536*scale)/2,y=(h-1024*scale)/2;
  const typeScale=w/1536/scale;
  title.style.left=((w*.0625-x)/scale)+'px';
  title.style.top=((h*150/1024-y)/scale)+'px';
  title.style.fontSize=(112*typeScale)+'px';
  copy.style.left=((w*100/1536-x)/scale)+'px';
  copy.style.top=((h*150/1024+245*w/1536-y)/scale)+'px';
  copy.style.width=(400*typeScale)+'px';
  copy.querySelector('.sub').style.fontSize=(22*typeScale)+'px';
  copy.querySelector('.role').style.fontSize=(15*typeScale)+'px';
 }
 addEventListener('resize',fit);fit();
})();
