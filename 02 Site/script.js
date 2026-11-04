// Fixed section navigation: active section (aria-current), scroll progress, and mobile contrast over the eggplant section.
// Anchor links work without JavaScript; smooth scrolling is CSS-only and respects prefers-reduced-motion.
const nav = document.querySelector('.section-nav');
if (nav) {
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
  const work = document.querySelector('#work');
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

    // Mobile rail has no background, so its numbers switch to ivory over the eggplant Selected Work section.
    if (work) {
      const navBox = nav.getBoundingClientRect();
      const workBox = work.getBoundingClientRect();
      const center = navBox.top + navBox.height / 2;
      nav.classList.toggle('on-dark', center > workBox.top && center < workBox.bottom);
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
