document.querySelectorAll('.timeline-icon.company-logo').forEach((logo) => {
  const image = logo.querySelector('img');
  const fallback = logo.querySelector('.company-logo-fallback');

  if (!image || !fallback) return;

  const showFallback = () => {
    image.hidden = true;
    fallback.hidden = false;
  };

  image.addEventListener('error', showFallback, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
});
