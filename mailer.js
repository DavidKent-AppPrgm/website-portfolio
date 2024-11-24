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

  if (!sender || !validateEmail(sender)) {
    alert('Please enter a valid From email');
    return;
  }

  if (!subject || !message) {
    alert("Please fill in both the subject and message.");
    return;
  }

  // Get the CSRF token from the server to include it in the request headers
  const csrfResponse = await fetch('/csrf-token', {
    credentials: 'include',  // Ensure credentials are included in the request
  });
  if (!csrfResponse.ok) {
    alert('Failed to get CSRF token');
    return;
  }
  const csrfData = await csrfResponse.json();
  const csrfToken = csrfData.csrfToken;

  alert('Email sending...');

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

// A simple email validation regex
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}
