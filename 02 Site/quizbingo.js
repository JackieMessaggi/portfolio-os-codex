// Quiz Bingo case study (quizbingo.html). Page-specific: hero, playable loop, and the case sections.
(() => {
  const root = document.documentElement, RM = root.classList.contains('rm');
  const $ = s => document.querySelector(s);
  const stage = $('#stage'), sticky = $('#sticky'), screen = $('#screen'), art = $('#art'), slot = $('#slot');
  const cardpos = $('#cardpos'), cardHost = $('#cardHost'), logo = $('#logo'), decorBox = $('#decor');
  const sideL = $('#sideL'), sideR = $('#sideR'), mini = $('#mini'), city = $('#city'), rays = $('#rays'), live = $('#live');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
  const ss = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

  /* ---------- Card (Figma geometry, relative to the card panel at 117, 661) ---------- */
  const COLS = [59, 322, 584], ROWS = [201, 439, 677];   // Figma cell positions, relative to the card panel at 105, 648
  const NUMS = [10, 23, 35, 9, 17, 41, 3, 28, 32];
  const PRE = [0, 5, 6];       // 41 is daubed in the reference; 10 and 3 are daubed for the demo
  const TARGET = 3, LINE = [0, 3, 6];   // Geography 9 completes the Geography column, the vertical goal shown in the HUD
  function makeCard() {
    const c = document.createElement('div'); c.className = 'card';
    c.setAttribute('role', 'img'); c.setAttribute('aria-label', 'A 3 by 3 bingo card with Geography, History, and Culture columns');
    c.innerHTML = '<img class="panel" src="assets/quizbingo/img/card-crop.webp" width="892" height="935" alt="">' +
      NUMS.map((n, i) => `<div class="cell" data-i="${i}" style="left:${COLS[i % 3]}px;top:${ROWS[Math.floor(i / 3)]}px"><b>${n}</b><img class="daub" src="assets/quizbingo/img/daub.webp" alt=""></div>`).join('');
    return c;
  }
  const cells = c => [...c.querySelectorAll('.cell')];
  function setCard(c, { daub9 = false, hit = false, line = false } = {}) {
    cells(c).forEach((el, i) => { el.className = 'cell' + (PRE.includes(i) || (i === TARGET && daub9) ? ' done' : '') + (i === TARGET && hit && !daub9 ? ' hit' : '') + (line && LINE.includes(i) ? ' line' : ''); });
  }
  const heroCard = makeCard(); setCard(heroCard); cardHost.appendChild(heroCard);
  let gameCard = heroCard;
  if (RM) { gameCard = makeCard(); setCard(gameCard); slot.appendChild(gameCard); sticky.after($('#gamewrap')); }

  /* ---------- Decor (popcorn removed) ---------- */
  const DECOR = [
    { img: 'blur-Blur_Purple', D: [.80, .07, .30], M: [.94, .50, .40], d: 1.7, del: .7, fx: '40vw', fy: '-30vh', bd: 9, b: '-14px' },
    { img: 'blur-Blue_Blur', D: [.03, .12, .26], M: null, d: 1.8, del: .8, fx: '-30vw', fy: '-30vh', bd: 10, b: '12px' },
    { img: 'blur-Blur_Yellow', D: [.71, .96, .12], M: null, d: 1.5, del: .9, fx: '0', fy: '40vh', bd: 8, b: '-10px' },
    { img: 'ball-Yellow_7', trail: 'trail-Yellow_7', tr: [.22, .18, 1.75], D: [.17, .23, .17], M: [.12, .15, .22], d: 1.0, del: .75, fx: '-45vw', fy: '-35vh', fr: '-160deg', bd: 6.5, b: '-12px', br: '-4deg' },
    { img: 'ball-Turquoise_5', trail: 'trail-Turquoise_5', tr: [.15, .55, 1.4], D: [.32, .09, .085], M: null, d: .7, del: .85, fx: '-10vw', fy: '-50vh', fr: '120deg', bd: 7.5, b: '-8px', br: '6deg' },
    { img: 'ball-Pink_4', trail: 'trail-Pink_4', tr: [-.95, .25, 2.0], D: [.87, .25, .11], M: [.88, .12, .17], d: .9, del: .9, fx: '45vw', fy: '-20vh', fr: '200deg', bd: 6, b: '-10px', br: '5deg' },
    { img: 'ball-Green_6', trail: 'trail-Green_6', tr: [-.35, -.85, 1.7], D: [.11, .63, .14], M: [.10, .56, .20], d: 1.1, del: 1.0, fx: '-50vw', fy: '10vh', fr: '-200deg', bd: 7, b: '-11px', br: '-6deg' },
    { img: 'ic3d-Sports', D: [.27, .80, .13], M: [.88, .72, .18], d: .8, del: 1.25, fs: .2, fr: '-30deg', bd: 8, b: '-8px', br: '-5deg' },
    { img: 'lc-Star', D: [.585, .17, .11], M: [.12, .70, .16], d: .6, del: 1.15, fs: .2, fr: '-40deg', bd: 5.5, b: '-7px', br: '8deg' },
    { img: 'lc-Reward_Coin', D: [.37, .90, .07], M: null, d: .9, del: 1.4, fs: .2, fr: '90deg', bd: 6, b: '-6px' },
    { img: 'lc-Reward_Coin', D: [.955, .86, .055], M: null, d: 1.0, del: 1.5, fs: .2, fr: '-90deg', bd: 6.8, b: '-7px' }
  ];
  const decor = DECOR.map(o => {
    const L = document.createElement('div'); L.className = 'layer';
    const e = document.createElement('div'); e.className = 'e';
    e.style.cssText = `--d:${o.del}s;--fx:${o.fx || 0};--fy:${o.fy || 0};--fs:${o.fs || .7};--fr:${o.fr || '0deg'};--bd:${o.bd}s;--b:${o.b};--br:${o.br || '0deg'}`;
    if (o.trail) { const t = new Image(); t.src = `assets/quizbingo/img/${o.trail}.webp`; t.className = 'trail'; t.alt = ''; t.style.cssText = `left:${o.tr[0] * 100}%;top:${o.tr[1] * 100}%;width:${o.tr[2] * 100}%`; e.appendChild(t); }
    const im = new Image(); im.src = `assets/quizbingo/img/${o.img}.webp`; im.alt = ''; im.style.position = 'relative'; e.appendChild(im);
    L.appendChild(e); decorBox.appendChild(L); return { o, L };
  });
  const sp = $('#sparks'); [[.08,.12],[.24,.36],[.47,.08],[.66,.14],[.74,.33],[.9,.08],[.6,.5],[.18,.5],[.38,.6],[.82,.55]].forEach(([x, y], i) => { const s = document.createElement('i'); s.style.cssText = `left:${x * 100}%;top:${y * 100}%;animation-delay:${(i * .53) % 4.5}s`; sp.appendChild(s); });

  /* ---------- Layout ---------- */
  let vw, vh, mob, wide, k = .4, poses = {};
  function layout() {
    vw = innerWidth; vh = sticky.clientHeight || innerHeight; mob = vw < 760; wide = vw >= 1100;
    const reserve = (!wide && !RM) ? 150 : 0;           // room for the compact explanation
    let sh = Math.min((vh - reserve) * (wide ? .88 : .86), 920), sw = sh * 1080 / 2048;
    if (sw > vw - 32) { sw = vw - 32; sh = sw * 2048 / 1080; }
    k = sw / 1080; art.style.transform = `scale(${k})`;
    screen.style.width = sw + 'px'; screen.style.height = sh + 'px';
    const sl = (vw - sw) / 2, st = wide ? (vh - sh) / 2 : Math.max(54, (vh - reserve - sh) / 2 + 20);
    if (!RM) { screen.style.left = sl + 'px'; screen.style.top = st + 'px'; }
    sideL.style.display = sideR.style.display = (wide || RM) ? '' : 'none';
    mini.style.display = (!wide && !RM) ? '' : 'none';
    if (wide && !RM) {
      sideL.style.left = (sl - 48 - 248) + 'px'; sideL.style.top = (st + sh * .28) + 'px';
      sideR.style.left = (sl + sw + 48) + 'px'; sideR.style.top = (st + sh * .2) + 'px';
    }
    if (!wide && !RM) mini.style.top = (st + sh + 14) + 'px';
    poses.game = { cx: sl + (105 + 446) * k, cy: st + (648 + 467.5) * k, sc: k, rx: 0, ry: 0, rz: 0 };
    const hw = mob ? Math.min(vw * .5, vh * .26) : Math.min(vw * .27, vh * .48);
    poses.hero = mob ? { cx: vw * .5, cy: vh * .6, sc: hw / 892, rx: 10, ry: 0, rz: -5 } : { cx: vw * .695, cy: vh * .62, sc: hw / 892, rx: 10, ry: -18, rz: 8 };
    const lw = mob ? Math.min(vw * .78, vh * .4) : Math.min(vw * .34, vh * .54);
    poses.logo = { w: lw, cx: mob ? vw * .5 : vw * .43, cy: mob ? vh * .27 : vh * .44 };
    logo.style.width = lw + 'px'; logo.style.height = lw * 1.23 + 'px';
    rays.style.left = poses.logo.cx + 'px'; rays.style.top = (poses.logo.cy - lw * .1) + 'px';
    decor.forEach(({ o, L }) => { const p = mob ? o.M : o.D; L.style.display = p ? '' : 'none'; if (!p) { o._w = null; return; } const w = (mob ? vw : vh) * p[2]; o._x = vw * p[0]; o._y = vh * p[1]; o._w = w; L.style.width = w + 'px'; });
    frame(true);
  }

  /* ---------- Scroll, pointer, morph ---------- */
  let mx = 0, my = 0, tx = 0, ty = 0, prog = -1, active = false, t0 = 0;
  const intro = (a, d) => RM ? 1 : ss(a, a + d, (performance.now() - t0) / 1000);
  if (!RM && matchMedia('(pointer: fine)').matches) addEventListener('pointermove', e => { tx = e.clientX / vw * 2 - 1; ty = e.clientY / vh * 2 - 1; }, { passive: true });
  const progress = () => { if (RM) return 0; const r = stage.getBoundingClientRect(); return clamp(-r.top / (r.height - vh)); };
  function frame(force) {
    mx += (tx - mx) * .07; my += (ty - my) * .07;
    const p = progress(), introing = !RM && performance.now() - t0 < 3200;
    if (!force && !introing && Math.abs(p - prog) < .0005 && Math.abs(tx - mx) < .001 && Math.abs(ty - my) < .001) return;
    prog = p;
    const out = ss(.04, .5, p), morph = ss(.08, .62, p), game = ss(.4, .72, p), par = 1 - out;
    const L = poses.logo;
    logo.style.transform = `translate3d(${L.cx - L.w / 2 + mx * 6 * par}px, ${L.cy - L.w * .615 - out * vh * .55 + my * 5 * par}px, 0) scale(${1 - out * .35})`;
    logo.style.opacity = 1 - ss(.1, .42, p);
    decor.forEach(({ o, L: el }) => {
      if (o._w == null) return;
      const dx = o._x - vw / 2, dy = o._y - vh / 2, len = Math.hypot(dx, dy) || 1, push = out * (vw * .55) * o.d;
      el.style.transform = `translate3d(${o._x - o._w / 2 + dx / len * push + mx * 18 * o.d * par}px, ${o._y - o._w / 2 + dy / len * push + my * 12 * o.d * par}px, 0) scale(${1 + out * .5 * o.d})`;
      el.style.opacity = 1 - ss(.15, .55, p);
    });
    rays.style.opacity = .85 * intro(.05, 1.2) * (1 - ss(.1, .5, p));
    $('#monuments').style.opacity = .8 * intro(.2, 1.4) * (1 - ss(.05, .4, p));
    $('#cap').style.opacity = intro(1.5, .8) * (1 - ss(.02, .15, p));
    $('#cue').style.opacity = intro(2, .8) * (1 - ss(.01, .08, p));
    city.style.opacity = game;
    const H = poses.hero, G = poses.game;
    if (!RM) {
      const t = morph;
      const cx = lerp(H.cx, G.cx, t) + mx * 9 * par, cy = lerp(H.cy, G.cy, t) + my * 7 * par, sc = lerp(H.sc, G.sc, t);
      const rx = lerp(H.rx, 0, t) - my * 4 * par, ry = lerp(H.ry, 0, t) + mx * 6 * par, rz = lerp(H.rz, 0, t);
      cardpos.style.transform = `translate3d(${cx - 446}px, ${cy - 467.5}px, 0) perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
      screen.style.opacity = game;
      const docked = cur > 0 || busy || (heroCard.parentNode === slot ? p >= .6 : p >= .72);
      if (docked && heroCard.parentNode !== slot) { slot.appendChild(heroCard); cardpos.style.visibility = 'hidden'; }
      else if (!docked && heroCard.parentNode !== cardHost) { cardHost.appendChild(heroCard); cardpos.style.visibility = ''; }
      const sv = ss(.62, .8, p);
      [sideL, sideR, mini].forEach(el => { el.style.opacity = sv; el.style.transform = `translateY(${(1 - sv) * 20}px)`; });
      const on = p > .74 || (cur > 0 && p > .5);
      if (on !== active) { active = on; screen.toggleAttribute('inert', !on); [sideL, sideR, mini].forEach(el => el.classList.toggle('on', on)); }
    } else {
      cardpos.style.transform = `translate3d(${H.cx - 446}px, ${H.cy - 467.5}px, 0) perspective(1600px) rotateX(${H.rx}deg) rotateY(${H.ry}deg) rotateZ(${H.rz}deg) scale(${H.sc})`;
    }
  }
  function loop() { frame(false); requestAnimationFrame(loop); }

  /* ---------- Game: a small state machine with revisitable steps ---------- */
  const STEPS = [
    { key: 'spin', title: 'Spin', body: 'Each spin draws a question ball: one category and one number. A highlight runs across the card and stops on the matching cell.', ui: 'The card itself shows the result, in the category’s color, before any text appears.' },
    { key: 'category', title: 'Category', body: 'The draw takes over the whole screen in the category’s color, with its 3D icon, then slides away to the question.', ui: 'Each category keeps one color on the card, the reveal, and the question screen.' },
    { key: 'question', title: 'Question', body: 'One question, four answers, fifteen seconds. A wrong answer opens “Another question?”, and a timeout offers more time, instead of ending the level.', ui: 'The chosen answer turns yellow first, then the result shows in green or red.' },
    { key: 'daub', title: 'Daub', body: 'A right answer stamps the cell. Lines count across, down, or diagonally, and the Goals panel shows which bingos the level asks for.', ui: 'The completed column lights up before the Bingo plays, matching the vertical goal in the HUD.' },
    { key: 'bingo', title: 'Bingo', body: 'A completed line triggers the Bingo moment, then the level reward. Early levels use this 3×3 card; the 5×5 card unlocks as players progress.', ui: 'The disc flips in, overshoots with the lettering, and settles, as in the original animation.' }
  ];
  const QS = [
    { q: 'Which famous square is located in Berlin, Germany?', a: ['Alexanderplatz', 'Trafalgar Square', 'Times Square', 'Red Square'], c: 0 },
    { q: 'In which country was the Berlin Wall located?', a: ['Belgium', 'France', 'Germany', 'Italy'], c: 2 }
  ];
  const TOPS = [1024, 1173.87, 1323.75, 1473.62];
  let cur = 0, seen = 0, qi = 0, busy = false, timer = null, timeouts = [], left = 15;
  const later = (fn, ms) => { const id = setTimeout(fn, RM ? Math.min(ms, 200) : ms); timeouts.push(id); return id; };
  const clearAll = () => { timeouts.forEach(clearTimeout); timeouts = []; clearInterval(timer); };
  const show = (id, on = true) => $(id).classList.toggle('show', on);
  const hideAll = () => ['#reveal', '#question', '#again', '#moretime', '#bingo', '#level', '#done'].forEach(id => { show(id, false); $(id).classList.remove('enter', 'exit'); });
  const restart = el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; };
  const spinBtn = $('#spin');

  const stepsOl = $('#steps');
  STEPS.forEach((s, i) => { const li = document.createElement('li'); li.innerHTML = `<button type="button" aria-label="Step ${i + 1}: ${s.title}">${i + 1}</button>`; li.firstChild.addEventListener('click', () => goTo(i)); stepsOl.appendChild(li); });
  function updateUI() {
    stepsOl.querySelectorAll('button').forEach((b, i) => { b.disabled = i > seen || busy; b.classList.toggle('seen', i <= seen); if (i === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    const s = STEPS[cur], info = $('#info');
    if (info.dataset.step !== String(cur)) {
      info.dataset.step = cur;
      info.innerHTML = `<p class="n">Step ${cur + 1} of 5</p><h3>${s.title}</h3><p>${s.body}</p><p class="ui">${s.ui}</p>`;
      info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
    }
    $('#miniN').textContent = `${cur + 1} / 5 · ${s.title}`; $('#miniT').textContent = s.body;
    ['#back', '#mBack'].forEach(id => $(id).disabled = cur === 0 || busy);
    ['#next', '#mNext'].forEach(id => $(id).disabled = cur >= seen || busy);
    $('#redo').disabled = busy;
  }
  function setStep(i) { cur = i; seen = Math.max(seen, i); updateUI(); live.textContent = `Step ${i + 1}: ${STEPS[i].title}`; }

  // Each step has a resting state, used when playing forward and when revisiting
  function enter(i, { playing = false } = {}) {
    clearAll(); hideAll(); busy = false;
    screen.classList.toggle('tut-off', i !== 0);
    spinBtn.disabled = i !== 0;
    if (i === 0) setCard(gameCard);
    if (i === 1) { setCard(gameCard, { hit: true }); show('#reveal'); restartReveal(); if (playing) later(toQuestion, 1500); }
    if (i === 2) { setCard(gameCard, { hit: true }); askQuestion(false); }
    if (i === 3) { setCard(gameCard, { daub9: true }); stampTarget(); later(() => setCard(gameCard, { daub9: true, line: true }), 650); if (playing) later(() => goPlay(4), 1500); }
    setStep(i);
    if (i === 4) { setCard(gameCard, { daub9: true, line: true }); playBingo(); }
  }
  const goPlay = i => enter(i, { playing: true });
  function goTo(i) { if (i < 0 || i > seen || busy) return; qi = 0; enter(i); }
  function restartReveal() { const r = $('#reveal'); r.classList.remove('exit'); r.querySelectorAll('.ico,.word').forEach(restart); }

  spinBtn.addEventListener('click', () => {
    if (cur !== 0 || busy) return;
    busy = true; updateUI(); spinBtn.disabled = true; screen.classList.add('tut-off');
    spinBtn.classList.add('pressed'); later(() => spinBtn.classList.remove('pressed'), 140);
    live.textContent = 'Spinning';
    const all = cells(gameCard), open = [1, 2, 4, 7, 8, 3];
    const seq = [70, 80, 90, 100, 115, 130, 150, 170, 200, 240, 280];
    let n = 0;
    const tick = () => {
      all.forEach(c => c.classList.remove('shuf'));
      if (n < seq.length) { all[open[(n * 3 + 1) % open.length]].classList.add('shuf'); later(tick, seq[n++]); }
      else { all[TARGET].classList.add('hit'); live.textContent = 'You drew Geography 9'; later(() => { busy = false; goPlay(1); }, 700); }
    };
    tick();
  });

  function toQuestion() {
    const r = $('#reveal'); r.classList.add('exit');
    askQuestion(true);
    later(() => { show('#reveal', false); r.classList.remove('exit'); }, 450);
    setStep(2);
  }
  function askQuestion(slide) {
    const Q = QS[qi];
    $('#qtext').textContent = Q.q;
    $('#answers').innerHTML = Q.a.map((t, i) => `<button class="ans" type="button" data-i="${i}" style="top:${TOPS[i]}px">${t}</button>`).join('');
    const q = $('#question'); q.classList.remove('enter'); if (slide && !RM) { void q.offsetWidth; q.classList.add('enter'); }
    show('#question');
    later(() => $('#answers .ans').focus({ preventScroll: true }), slide ? 480 : 60);
    startTimer(15);
  }
  function startTimer(s) {
    clearInterval(timer); left = s; $('#timer').textContent = left;
    timer = setInterval(() => { left--; $('#timer').textContent = Math.max(left, 0); if (left <= 0) { clearInterval(timer); lock(); show('#moretime'); later(() => $('#moretime .hot').focus({ preventScroll: true }), 300); } }, 1000);
  }
  const lock = () => $('#answers').querySelectorAll('.ans').forEach(b => b.disabled = true);
  $('#answers').addEventListener('click', e => {
    const b = e.target.closest('.ans'); if (!b || b.disabled) return;
    clearInterval(timer); lock(); busy = true; updateUI();
    const i = +b.dataset.i, Q = QS[qi]; b.classList.add('sel');
    later(() => {
      b.classList.remove('sel'); const btns = $('#answers').querySelectorAll('.ans');
      btns[Q.c].classList.add('right');
      if (i === Q.c) { live.textContent = 'Correct'; later(() => { busy = false; goPlay(3); }, 900); }
      else { b.classList.add('wrong'); live.textContent = 'Not quite. The answer is ' + Q.a[Q.c]; later(() => { busy = false; updateUI(); show('#again'); later(() => $('#again .hot').focus({ preventScroll: true }), 300); }, 1100); }
    }, 500);
  });
  document.querySelectorAll('[data-retry]').forEach(b => b.addEventListener('click', () => { show('#again', false); qi = (qi + 1) % QS.length; askQuestion(false); }));
  document.querySelectorAll('[data-more]').forEach(b => b.addEventListener('click', () => { show('#moretime', false); $('#answers').querySelectorAll('.ans').forEach(x => x.disabled = false); startTimer(15); $('#answers .ans').focus({ preventScroll: true }); }));

  function stampTarget() { const t = cells(gameCard)[TARGET]; t.classList.remove('stamping'); void t.offsetWidth; t.classList.add('stamping'); }
  function playBingo() {
    busy = true; updateUI();
    const b = $('#bingo'); show('#bingo'); b.querySelectorAll('.disc,.lt,.cf').forEach(restart);
    later(() => { show('#bingo', false); show('#level'); busy = false; updateUI(); later(() => $('#level .hot').focus({ preventScroll: true }), 300); }, 2100);
  }
  document.querySelectorAll('[data-cont]').forEach(b => b.addEventListener('click', () => { show('#level', false); show('#done'); live.textContent = 'Level complete'; later(() => $('#replay').focus({ preventScroll: true }), 250); }));
  $('#replay').addEventListener('click', () => { qi = 0; seen = 0; enter(0); spinBtn.focus({ preventScroll: true }); });
  $('#back').addEventListener('click', () => goTo(cur - 1)); $('#mBack').addEventListener('click', () => goTo(cur - 1));
  $('#next').addEventListener('click', () => goTo(cur + 1)); $('#mNext').addEventListener('click', () => goTo(cur + 1));
  $('#redo').addEventListener('click', () => { if (!busy) enter(cur); });

  /* ---------- Start ---------- */
  addEventListener('resize', layout);
  document.fonts.load('140px "Paytone One"').then(() => document.fonts.load('600 48px "Nunito Sans"')).catch(() => {}).then(() => Promise.all([...document.images].slice(0, 14).map(i => i.decode ? i.decode().catch(() => {}) : null))).then(() => {
    t0 = performance.now(); enter(0); layout();
    requestAnimationFrame(() => document.body.classList.add('go'));
    if (!RM) loop(); else screen.removeAttribute('inert');
  });
})();

(() => {
  const RM = document.documentElement.classList.contains('rm');
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const IO = 'IntersectionObserver' in window;

  /* Reveal on scroll */
  if (!RM && IO) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.qb-rv').forEach(el => io.observe(el));
  } else $$('.qb-rv').forEach(el => el.classList.add('in'));

  /* Looping videos: play in view, pause out of view, always pausable. Reduced motion: never autoplay. */
  function wireVideo(v) {
    const btn = v.parentElement.querySelector('.vp');
    const sync = () => { if (!btn) return; const on = !v.paused; btn.textContent = on ? '❚❚' : '▶'; btn.setAttribute('aria-label', on ? 'Pause video' : 'Play video'); };
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    if (btn) btn.addEventListener('click', () => { if (v.paused) { v.dataset.user = ''; v.preload = 'auto'; v.play().catch(() => {}); } else { v.dataset.user = 'paused'; v.pause(); } });
    sync();
    if (RM || !IO) { v.preload = 'metadata'; return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { if (v.dataset.user !== 'paused') { v.preload = 'auto'; v.play().catch(() => {}); } } else v.pause(); }), { threshold: .35 });
    io.observe(v);
  }
  $$('video[data-auto]').forEach(wireVideo);

  /* 2 · Stages deck */
  const SHOTS = {
    card: ['assets/quizbingo/img/deck-ftue-2.webp', 'assets/quizbingo/img/soft-card3.webp', 'assets/quizbingo/img/deck-rel-card.webp'],
    quiz: ['assets/quizbingo/img/deck-ftue-3.webp', 'assets/quizbingo/img/deck-soft-quiz.webp', 'assets/quizbingo/img/deck-rel-quiz.webp'],
    map:  ['assets/quizbingo/img/deck-ftue-7.webp', 'assets/quizbingo/img/soft-chapters.webp', 'assets/quizbingo/img/rel-chapters.webp'],
    pop:  ['assets/quizbingo/img/deck-ftue-8.webp', 'assets/quizbingo/img/soft-popup.webp', 'assets/quizbingo/img/deck-rel-pop.webp']
  };
  const PH = ['Concept & Validation', 'Soft Launch · Late 2024', 'Official Release · 2025'];
  const NOTES = [
    ['Quiz Arena: prove the gameplay', 'High-fidelity UI built straight from the wireframes: a purple world, star daubs, a saga map, and tutorial tips inside the screens. Question photos were stock. The goal was a playable concept, not a brand.'],
    ['Quiz Bingo World Tour: build its world', 'With the gameplay validated, there was time for identity: the World Tour theme, the logo, and the visual direction. Landmark chapter cards arrived, and the HUD carried more, with the Goals panel, a ball machine, rewards, and a shop. Soft launch in English-speaking markets.'],
    ['Polish, expand, and add motion', 'The same world with more craft: 3D icons and landmarks, a color for every category, a timer on every question, and a new navigation. Duels and player profiles came later in this stage.']
  ];
  let phase = 0, shot = 'card';
  const deck = $('#st-deck');
  function renderDeck(rebuild) {
    if (rebuild) deck.innerHTML = SHOTS[shot].map((src, i) => `<div class="st-card" data-i="${i}"><img src="${src}" alt="${PH[i]}: ${shot === 'quiz' ? 'question' : shot === 'map' ? 'chapters' : shot === 'pop' ? 'pop-up' : 'bingo card'} screen" loading="lazy"></div>`).join('');
    deck.querySelectorAll('.st-card').forEach(c => { const d = +c.dataset.i - phase; c.dataset.d = d; c.setAttribute('aria-hidden', d !== 0); });
    $$('#st-rail button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.p === phase));
    $$('#st-chips button').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === shot));
    $('#st-cur').textContent = PH[phase];
    const n = $('#st-note'); n.innerHTML = `<p class="s3-tag">${PH[phase]}</p><h3 style="margin-top:.7rem">${NOTES[phase][0]}</h3><p>${NOTES[phase][1]}</p>`;
    n.classList.remove('swap'); void n.offsetWidth; n.classList.add('swap');
  }
  $$('#st-rail button').forEach(b => b.addEventListener('click', () => { phase = +b.dataset.p; renderDeck(); }));
  $$('#st-chips button').forEach(b => b.addEventListener('click', () => { shot = b.dataset.s; renderDeck(true); }));
  deck.addEventListener('click', e => { const c = e.target.closest('.st-card'); if (c && c.dataset.d !== '0') { phase = +c.dataset.i; renderDeck(); } });
  renderDeck(true);

  /* 3 · Marquee: repeat each set until each half is wider than the screen */
  if (!RM) $$('.w-track[data-loop]').forEach(t => {
    const set = [...t.children], setW = Math.max(1, t.scrollWidth), reps = Math.max(1, Math.ceil(Math.max(innerWidth, 1600) * 1.1 / setW));
    const add = () => set.forEach(c => { const d = c.cloneNode(true); d.setAttribute('aria-hidden', 'true'); t.appendChild(d); });
    for (let k = 1; k < reps * 2; k++) add();
    t.style.animationDuration = Math.round(setW * reps / (+t.dataset.speed || 38)) + 's';
  });

  /* 4 · Storyboard scrubber (Level Complete) */
  $$('.m-pane').forEach(pane => {
    const v = pane.querySelector('video'), r = pane.querySelector('input'), play = pane.querySelector('.m-play');
    const times = pane.dataset.times.split(',').map(Number), btns = [...pane.querySelectorAll('.m-frames button')];
    const mark = t => { let k = 0; times.forEach((x, i) => { if (t >= x - .4) k = i; }); btns.forEach((b, i) => b.classList.toggle('on', i === k)); };
    const seek = t => { v.currentTime = t; mark(t); if (v.duration) r.value = t / v.duration * 1000; };
    const setPlay = on => { play.textContent = on ? '❚❚' : '▶'; play.setAttribute('aria-label', on ? 'Pause' : 'Play'); };
    btns.forEach((b, i) => b.addEventListener('click', () => { v.pause(); setPlay(false); seek(times[i]); }));
    r.addEventListener('input', () => { if (!v.duration) return; v.pause(); setPlay(false); seek(r.value / 1000 * v.duration); });
    play.addEventListener('click', () => { if (v.paused) { v.play(); setPlay(true); } else { v.pause(); setPlay(false); } });
    v.addEventListener('timeupdate', () => { if (!v.paused && v.duration) { r.value = v.currentTime / v.duration * 1000; mark(v.currentTime); } });
    v.addEventListener('ended', () => setPlay(false));
    v.addEventListener('loadedmetadata', () => seek(times[0]));
    mark(times[0]);
  });

  /* 5 · System hand: one focal card, supporting cards behind it */
  const PV = ' · approval preview by our Motion/3D Designer';
  const HANDS = {
    rewards: { feature: 1, note: 'Each reward type has its own chest: gold on purple for the Daily Chest, gold with jewels for the Monthly Chest, gold, silver, and bronze for the leaderboard top three, and silver on lighter blue for duel winners. Tap a card to bring it forward.', cards: [
      ['assets/quizbingo/img/sys-monthly.webp', 'Monthly Chest', 'c'], ['assets/quizbingo/video/v-chest-daily.mp4', 'Daily Chest opening' + PV, 'v'], ['assets/quizbingo/video/v-chest-duel.mp4', 'Duel winner chest opening' + PV, 'v'], ['assets/quizbingo/img/sys-leaderboard-21.webp', 'Leaderboard rewards, top three', 'c']] },
    feedback: { feature: 2, note: 'Celebrations, second chances, and offers all live in the same popup system: one frame, one ribbon, one hero object. Tap a card to bring it forward.', cards: [
      ['assets/quizbingo/img/fb-level.webp', 'Well Done', 'c'], ['assets/quizbingo/img/fb-mastery.webp', 'Mastery Up', 'c'], ['assets/quizbingo/img/fb-again.webp', 'Another question?', 'c'], ['assets/quizbingo/img/fb-moretime.webp', 'Need more time?', 'c'], ['assets/quizbingo/img/fb-lives.webp', 'Refill lives', 'c']] },
    duels: { feature: 1, note: 'Competition and identity get the same frames, ribbons, and buttons as everything else. Tap a card to bring it forward.', cards: [
      ['assets/quizbingo/img/pvp-arena.webp', 'Duel Arena'], ['assets/quizbingo/img/sys-duel-won.webp', 'Duel result', 'c'], ['assets/quizbingo/img/sys-editprofile.webp', 'Edit Profile', 'c'], ['assets/quizbingo/img/profile-leaderboard.webp', 'Weekly leaderboard']] },
    shop: { feature: 0, note: 'Offers, bundles, and the Starter Pack all use the same popup frame, and each one gets its own 3D object and color story. Tap a card to bring it forward.', cards: [
      ['assets/quizbingo/img/rel-shop.webp', 'The shop'], ['assets/quizbingo/img/sys-starter.webp', 'Starter Pack', 'c'], ['assets/quizbingo/img/sys-removeads.webp', 'Remove Ads', 'c'], ['assets/quizbingo/img/sys-rightanswer.webp', 'Right Answer', 'c'], ['assets/quizbingo/img/sys-normal.webp', 'Normal Bundle', 'c'], ['assets/quizbingo/img/sys-super.webp', 'Super Bundle', 'c'], ['assets/quizbingo/img/sys-mega.webp', 'Mega Bundle', 'c'], ['assets/quizbingo/img/sys-legendary.webp', 'Legendary Bundle', 'c']] }
  };
  const hand = $('#y-hand');
  let seen = false, cards = [], selIdx = -1, curTab = 'rewards';
  const OFF = [0, .76, 1.36, 1.86, 2.28], SC = [1, .84, .74, .66, .6];
  function poseOf(c, sel) {
    const p = c._pose; let x = p.x, sc = p.sc, rot = p.rot, y = p.y;
    if (sel) {
      sc = Math.max(p.sc * 1.18, .9); rot = p.rot * .4; y = p.y - 6;
      // keep the lifted card inside the visible area, nudging it only when it would clip
      const W = c.offsetWidth, hr = hand.getBoundingClientRect(), cx = hr.left + hr.width / 2 + x / 100 * W, half = W * sc / 2, pad = 10;
      const lo = Math.max(pad, hr.left - 40), hi = Math.min(innerWidth - pad, hr.right + 40);
      if (cx - half < lo) x += (lo - (cx - half)) / W * 100;
      if (cx + half > hi) x -= ((cx + half) - hi) / W * 100;
    }
    return `translateX(${x}%) rotate(${rot}deg) translateY(${y}%) scale(${sc})`;
  }
  function select(i, focus) {
    if (i === selIdx) return;
    const prev = cards[selIdx];
    if (prev) { prev.classList.remove('sel'); prev.setAttribute('aria-pressed', 'false'); prev.style.zIndex = prev._pose.z; prev.style.transform = poseOf(prev, false); prev.querySelectorAll('video').forEach(v => v.pause()); }
    const c = cards[i]; selIdx = i;
    c.classList.add('sel'); c.setAttribute('aria-pressed', 'true'); c.style.zIndex = 40; c.style.transform = poseOf(c, true);
    const v = c.querySelector('video'); if (v && !RM && seen) v.play().catch(() => {});
    if (focus) c.focus({ preventScroll: true });
  }
  function build(g, entrance) {
    const H = HANDS[g], n = H.cards.length, mob = innerWidth < 900, center = H.feature || 0;
    const rest = [...Array(n).keys()].filter(k => k !== center), k = mob ? (rest.length > 4 ? .58 : .7) : 1;
    hand.querySelectorAll('.y-card').forEach(c => { c.querySelectorAll('video').forEach(v => v.pause()); c.remove(); });
    hand.classList.remove('ready'); selIdx = -1;
    cards = H.cards.map(([src, cap, kind], i) => {
      const f = document.createElement('figure');
      f.className = 'y-card' + (kind === 'c' ? ' clear' : '') + (entrance ? ' out' : ' fade');
      f.innerHTML = kind === 'v'
        ? `<video src="${src}" poster="${src.replace('/video/', '/img/').replace('.mp4', '.webp')}" muted loop playsinline preload="metadata" aria-label="${cap}"></video><figcaption>${cap}</figcaption>`
        : `<img src="${src}" alt="${cap}"><figcaption>${cap}</figcaption>`;
      if (i === center) f._pose = { x: 0, rot: 0, y: 0, sc: 1, z: 20 };
      else { const r = rest.indexOf(i), dir = r % 2 ? 1 : -1, dist = Math.floor(r / 2) + 1; f._pose = { x: dir * OFF[dist] * 100 * k, rot: dir * (3 + dist * 2), y: 4 + dist * 3, sc: SC[dist], z: 10 - dist }; }
      f.style.zIndex = f._pose.z;
      f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-pressed', 'false'); f.setAttribute('aria-label', 'Show ' + cap.split(' · ')[0]);
      f.addEventListener('click', () => select(i));
      f.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const order = cards.map((c, j) => j).sort((x, y) => cards[x]._pose.x - cards[y]._pose.x), at = order.indexOf(i), nx = order[Math.max(0, Math.min(order.length - 1, at + (e.key === 'ArrowRight' ? 1 : -1)))]; select(nx, true); }
      });
      hand.appendChild(f);
      return f;
    });
    const place = () => { cards.forEach(c => { c.classList.remove('out', 'fade'); c.style.transform = poseOf(c, false); }); select(center); setTimeout(() => hand.classList.add('ready'), RM || !entrance ? 0 : 700); };
    if (entrance) cards.forEach(c => { c.style.transform = ''; });
    if (!entrance || seen) requestAnimationFrame(() => requestAnimationFrame(place)); else hand._place = place;
  }
  function showTab(g) {
    curTab = g;
    $$('#y-tabs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.g === g));
    $('#y-note').textContent = HANDS[g].note;
    build(g, false);
  }
  $$('#y-tabs button').forEach(b => b.addEventListener('click', () => { if (b.dataset.g !== curTab) showTab(b.dataset.g); }));
  $('#y-note').textContent = HANDS.rewards.note;
  if (RM || !IO) { seen = true; build('rewards', false); }
  else {
    build('rewards', true);
    new IntersectionObserver((es, o) => es.forEach(e => {
      if (e.isIntersecting && !seen) { seen = true; if (hand._place) { hand._place(); hand._place = null; } }
      const v = cards[selIdx] && cards[selIdx].querySelector('video');
      if (v) e.isIntersecting ? v.play().catch(() => {}) : v.pause();
    }), { threshold: .3 }).observe(hand);
  }
  addEventListener('resize', () => { clearTimeout(hand._rz); hand._rz = setTimeout(() => cards.forEach((c, j) => { c.style.transform = poseOf(c, j === selIdx); }), 150); });

  /* 6 · Layered popup: assembled reference -> staggered 2D layers, back to front */
  const ex = $('#u-ex'), ub = $('#u-btn');
  const ref = ex.querySelector('.ref'), refCap = ex.querySelector('.ref + figcaption'), arrow = ex.querySelector('.arrow');
  const lays = [...ex.querySelectorAll('.lay')], tiles = [...ex.querySelectorAll('.tile')], lbls = [...ex.querySelectorAll('.lbl')];
  const GEO = [[0, .058, .975], [.152, .015, .682], [.06, .117, .303], [.09, .134, .242], [.331, .156, .581], [.073, .318, .278], [.073, .39, .841], [.103, .805, .77], [.884, .037, .115]];
  function layout() {
    const W = ex.clientWidth, mob = W < 640;
    const n = lays.length, cols = mob ? 3 : Math.ceil(n / 2), rows = Math.ceil(n / cols);
    const refH = mob ? Math.min(320, W * .9) : 500, refW = refH * 637 / 1100;
    const gap = mob ? 10 : 18;
    const areaX = mob ? 0 : refW + 70, areaY = mob ? refH + 56 : 0, areaW = W - areaX;
    const cw = (areaW - gap * (cols - 1)) / cols, ch = mob ? cw * 1.2 : (refH - 64 * rows) / rows, stair = 0;
    ex.style.height = (mob ? areaY + rows * (ch + 36) + 4 : Math.max(refH + 30, rows * (ch + 64))) + 'px';
    const rx = mob ? (W - refW) / 2 : 0;
    Object.assign(ref.style, { width: refW + 'px', transform: `translate(${rx}px, 0)` });
    Object.assign(refCap.style, { left: rx + 'px', top: refH + 8 + 'px' });
    Object.assign(arrow.style, { left: refW + 22 + 'px', top: refH / 2 - 18 + 'px', display: mob ? 'none' : '' });
    lays.forEach((el, i) => {
      const [gx, gy, gw] = GEO[i], img = el.querySelector('img'), ar = (img.naturalHeight || 1) / (img.naturalWidth || 1);
      const aw = gw * refW, ax = rx + gx * refW, ay = gy * refH;
      const c = i % cols, r = Math.floor(i / cols);
      const tx0 = areaX + c * (cw + gap), ty0 = areaY + r * (ch + (mob ? 36 : 64));
      const ph = cw * .14, pv = Math.max(ch * .09, 26), tw = Math.min(cw - ph * 2, (ch - pv * 2) / ar), th = tw * ar;
      const tx = tx0 + (cw - tw) / 2, ty = ty0 + (ch - th) / 2;
      el.style.width = aw + 'px';
      el.dataset.a = `translate(${ax}px, ${ay}px)`;
      el.dataset.b = `translate(${tx}px, ${ty}px) scale(${tw / aw})`;
      el.style.transform = ex.classList.contains('open') ? el.dataset.b : el.dataset.a;
      Object.assign(tiles[i].style, { width: cw + 'px', height: ch + 'px', left: tx0 + 'px', top: ty0 + 'px' });
      Object.assign(lbls[i].style, { left: tx0 + 'px', top: ty0 + ch + 8 + 'px', width: cw + 'px' });
    });
  }
  function setOpen(on) {
    ex.classList.toggle('open', on);
    lays.forEach(el => { el.style.transform = on ? el.dataset.b : el.dataset.a; });
    ub.setAttribute('aria-pressed', on); ub.textContent = on ? 'Put it back together' : 'Take it apart';
  }
  ub.addEventListener('click', () => setOpen(!ex.classList.contains('open')));
  Promise.all(lays.map(l => { const im = l.querySelector('img'); im.loading = 'eager'; return im.decode ? im.decode().catch(() => {}) : null; })).then(layout);
  layout(); addEventListener('resize', layout);
  if (RM) setOpen(true);
  else if (IO) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !ex.dataset.auto) { ex.dataset.auto = 1; setTimeout(() => setOpen(true), 500); } }), { threshold: .5 });
    io.observe(ex);
  }
})();

/* Case nav start: script.js keeps the nav hidden until #gamewrap has .is-reached (data-nav-start on .case-nav). */
(() => {
  const g = document.getElementById('gamewrap'), screen = document.getElementById('screen'), ftue = document.getElementById('ftue');
  if (!g) return;
  const rm = document.documentElement.classList.contains('rm');
  let last = null;
  const check = () => {
    const on = !!((!rm && screen && !screen.hasAttribute('inert')) || (rm && g.getBoundingClientRect().top < innerHeight * .6) || (ftue && ftue.getBoundingClientRect().top < innerHeight));
    g.classList.toggle('is-reached', on);
    const changed = last !== null && on !== last;
    last = on;
    if (changed) dispatchEvent(new Event('scroll'));   // let script.js re-evaluate the nav
  };
  if (screen) new MutationObserver(check).observe(screen, { attributes: true, attributeFilter: ['inert'] });
  addEventListener('scroll', check, { passive: true }); addEventListener('resize', check); check();
})();
