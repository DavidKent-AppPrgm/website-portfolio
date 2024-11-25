// authCallback.js
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    // Send the code to the server to exchange for an access token
    fetch('/auth/callback?code=' + code)
      .then(response => response.json())
      .then(data => {
        // Handle the response, maybe store the token in localStorage or sessionStorage
        if (data.success) {
          console.log('Authentication successful');
          // Redirect to home page or dashboard
          window.location.href = 'https://davidkent-appprgm.github.io/website-portfolio';
        } else {
          console.error('Authentication failed');
        }
      })
      .catch(error => {
        console.error('Error during authentication:', error);
      });
  }
};
