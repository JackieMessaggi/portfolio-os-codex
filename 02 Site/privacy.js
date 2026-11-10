/* Privacy preference for Cloudflare Web Analytics.
   Model: opt-out (see 00 Context/decision-log.md). Analytics runs by default; visitors can decline.

   - The Cloudflare beacon is no longer hard-coded in the pages. This script injects it only when
     the visitor has not declined, so a saved "Decline" is respected before anything is requested.
   - The choice lives in localStorage under "pos-analytics" ("declined" or "allowed"). No cookies.
   - Declining also drops any further beacon sends from the current page. Requests that already
     happened cannot be undone.
   - Footer buttons with [data-privacy-settings] reopen the notice to change the choice.
   - A future privacy page can be linked by adding data-privacy-url="privacy.html" to this script tag.
   Loaded with `defer` on the three top-level pages only; never inside the Snoof prototype iframe. */
(() => {
  'use strict';

  const KEY = 'pos-analytics';
  const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';
  const BEACON_CONFIG = '{"token": "0859ee09588c492f97b0d13c07f94b79"}';
  const CF_HOST = 'cloudflareinsights.com';
  const privacyUrl = (document.currentScript && document.currentScript.dataset.privacyUrl) || '';

  /* ---------- preference ---------- */

  let memoryChoice = null; // fallback when storage is blocked (choice then lasts for this page only)
  const getChoice = () => {
    try { return localStorage.getItem(KEY) || memoryChoice; } catch (e) { return memoryChoice; }
  };
  const setChoice = (value) => {
    memoryChoice = value;
    try { localStorage.setItem(KEY, value); } catch (e) { /* storage blocked: keep in memory */ }
  };
  const isDeclined = () => getChoice() === 'declined';

  /* ---------- guard: stop further beacon sends after a decline on this page ---------- */

  const toCf = (url) => String(url || '').indexOf(CF_HOST) !== -1;
  try {
    if (navigator.sendBeacon) {
      const send = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = (url, data) => (isDeclined() && toCf(url) ? true : send(url, data));
    }
    const open = XMLHttpRequest.prototype.open;
    const xhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      this.__posCf = toCf(url);
      return open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
      if (this.__posCf && isDeclined()) return undefined;
      return xhrSend.apply(this, arguments);
    };
  } catch (e) { /* if the browser forbids wrapping, declining still stops loading on later pages */ }

  /* ---------- beacon ---------- */

  let beaconRequested = false;
  const loadBeacon = () => {
    if (beaconRequested || isDeclined()) return;
    beaconRequested = true;
    const s = document.createElement('script');
    s.type = 'module';
    s.src = BEACON_SRC;
    s.setAttribute('data-cf-beacon', BEACON_CONFIG);
    document.head.appendChild(s);
  };

  /* ---------- notice ---------- */

  // Approved copy (November 10, 2026). Settings view reuses the same voice.
  const COPY = {
    firstTitle: 'A little insight?',
    first: 'I use Cloudflare Web Analytics to understand how this portfolio is visited. No cookies, no ads. You can turn it off anytime.',
    settingsTitle: 'Privacy settings',
    on: 'Cloudflare Web Analytics is on. No cookies, no ads.',
    off: 'Cloudflare Web Analytics is off in this browser.'
  };

  let notice = null;
  let lastFocus = null;
  const status = document.createElement('p');
  status.className = 'visually-hidden';
  status.setAttribute('role', 'status');

  /* Legal pages (privacy.html, impressum.html): the first-visit notice is placed in the page flow above the title,
     so it never covers the text or the footer at any width. When opened from Privacy settings it floats as on the
     other pages; while it floats, the page reserves room at the bottom (the end of the text and the footer can
     scroll clear of it) and scroll padding keeps keyboard focus from being hidden behind it.
     The homepage, Snoof, and the prototype keep their approved placement. */
  const root = document.documentElement;
  let currentMode = null;
  const isLegalPage = () => document.body.classList.contains('legal-page');

  const reserve = () => {
    const floating = notice && !notice.hidden && !notice.classList.contains('privacy-notice--inline');
    if (isLegalPage() && floating) {
      root.style.setProperty('--privacy-notice-h', notice.offsetHeight + 'px');
      root.classList.add('privacy-notice-reserve');
    } else {
      root.classList.remove('privacy-notice-reserve');
      root.style.removeProperty('--privacy-notice-h');
    }
  };

  const place = () => {
    if (!notice) return;
    const main = document.querySelector('main');
    const inline = isLegalPage() && currentMode === 'first' && main;
    if (inline) {
      if (notice.parentNode !== main) main.prepend(notice);
      notice.classList.add('privacy-notice--inline');
    } else {
      if (notice.parentNode !== document.body) document.body.appendChild(notice);
      notice.classList.remove('privacy-notice--inline');
    }
    reserve();
  };

  const close = () => {
    if (!notice) return;
    notice.hidden = true;
    reserve();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  };

  const choose = (value) => {
    setChoice(value);
    if (value === 'allowed') loadBeacon();
    status.textContent = value === 'declined' ? 'Analytics turned off.' : 'Analytics turned on.';
    close();
  };

  const button = (label, onClick) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'privacy-notice-btn';
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  };

  // mode: 'first' (no choice yet) or 'settings' (opened from the footer)
  const render = (mode) => {
    if (!notice) {
      notice = document.createElement('section');
      notice.className = 'privacy-notice';
      notice.setAttribute('aria-labelledby', 'privacy-notice-title');
      document.body.appendChild(notice);
    }
    const declined = isDeclined();
    const text = mode === 'first' ? COPY.first : (declined ? COPY.off : COPY.on);
    notice.replaceChildren();

    const title = document.createElement('p');
    title.className = 'privacy-notice-title';
    title.id = 'privacy-notice-title';
    title.textContent = mode === 'first' ? COPY.firstTitle : COPY.settingsTitle;

    const p = document.createElement('p');
    p.className = 'privacy-notice-text';
    p.id = 'privacy-notice-text';
    p.textContent = text + ' ';
    if (privacyUrl) {
      const a = document.createElement('a');
      a.href = privacyUrl;
      a.textContent = 'Privacy Policy';
      p.appendChild(a);
    }
    notice.setAttribute('aria-describedby', p.id);

    const actions = document.createElement('div');
    actions.className = 'privacy-notice-actions';
    if (mode === 'first') {
      actions.append(button('Decline', () => choose('declined')), button('Got it', () => choose('allowed')));
    } else if (declined) {
      actions.append(button('Turn on', () => choose('allowed')), button('Close', close));
    } else {
      actions.append(button('Decline', () => choose('declined')), button('Close', close));
    }

    notice.append(title, p, actions);
    notice.hidden = false;
    currentMode = mode;
    place();
    // Keep the escape handler in sync with the current mode.
    notice.onkeydown = (e) => { if (e.key === 'Escape' && mode !== 'first') { e.preventDefault(); close(); } };
  };

  const openSettings = (trigger) => {
    lastFocus = trigger || document.activeElement;
    render('settings');
    const first = notice.querySelector('button');
    if (first) first.focus();
  };

  /* ---------- start ---------- */

  loadBeacon(); // no-op when the visitor has declined

  const init = () => {
    document.body.appendChild(status);
    if (!getChoice()) render('first'); // non-modal: no focus move, nothing blocked
    document.querySelectorAll('[data-privacy-settings]').forEach((el) => {
      el.addEventListener('click', () => openSettings(el));
    });
    window.addEventListener('resize', reserve);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
