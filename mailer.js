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

function sendEmail(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const sender = document.getElementById('sender').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Make a POST request to the server to send the email
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

  closeEmailWindow();

  // Submit message alert
  alert('Your email has been sent!');
}
