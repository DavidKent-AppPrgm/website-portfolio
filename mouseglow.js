const glow = document.getElementById('glow');
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}

if (isMobile) {
  // Function to update glow position
  function updateGlowPosition() {
      if (window.innerWidth <= 768) { // Assuming mobile is when width is <= 768px
          // Center the glow on mobile devices
          glow.style.left = `${window.innerWidth / 2}px`;
          glow.style.top = `${window.innerHeight / 2}px`;
      }
  }

  // Listen for window resize to handle orientation changes
  window.addEventListener('resize', updateGlowPosition);

  // Initial positioning
  updateGlowPosition();
}
