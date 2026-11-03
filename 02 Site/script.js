// Optional navigation enhancement. All content and anchor links work without JS.
const navigationLinks = document.querySelectorAll('nav a');
function updateCurrentLocation() {
  navigationLinks.forEach((link) => {
    if (link.hash === window.location.hash) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}
window.addEventListener('hashchange', updateCurrentLocation);
updateCurrentLocation();
