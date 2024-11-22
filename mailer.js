//mailer.js
// Opens the email modal
function openEmailWindow() {
  const emailModal = document.getElementById('emailModal');
  emailModal.style.display = 'block'; // Make modal visible
  setTimeout(() => {
    emailModal.classList.add('show'); // Add "show" class for smooth transition
  }, 10);
}

// Closes the email modal
function closeEmailWindow() {
  const emailModal = document.getElementById('emailModal');
  emailModal.classList.remove('show'); // Remove "show" class
  setTimeout(() => {
    emailModal.style.display = 'none'; // Hide modal after transition
  }, 300);
}

// Sends the email
function sendEmail(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const sender = document.getElementById('sender').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Make POST request to the server
  fetch('/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: sender,
      subject: subject,
      message: message,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email.');
      }
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      alert('Error sending email.');
    });

  closeEmailWindow();
}
