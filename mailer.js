//mailer.js
function openEmailWindow() {
  const emailModal = document.getElementById('emailModal');
  emailModal.style.display = 'block'; // Make modal visible
  setTimeout(() => {
    emailModal.classList.add('show'); // Add the show class after a slight delay for transition
  }, 10);
}

function closeEmailWindow() {
  document.getElementById('emailModal').style.display = 'none';
}

async function sendEmail(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const sender = document.getElementById('sender').value; // User's email
  const subject = document.getElementById('subject').value; // Subject of email
  const message = document.getElementById('message').value; // Message content

  // Get the CSRF token from the server to include it in the request headers
  const csrfResponse = await fetch('/csrf-token');
  const csrfData = await csrfResponse.json();
  const csrfToken = csrfData.csrfToken;

  // Make a POST request to the server to send the email
  fetch('/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken, // Include the CSRF token in the request header
    },
    body: JSON.stringify({
      sender: sender,
      subject: subject,
      message: message,
    }),
  })
  .then(response => {
    if (response.ok) {
      alert('Email sent successfully!');
    } else {
      alert('Failed to send email');
    }
  })
  .catch(error => {
    console.error('Error sending email:', error);
    alert('Error sending email');
  });

  closeEmailWindow(); // Close modal after sending email
}
