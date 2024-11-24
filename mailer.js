// mailer.js (Frontend)
function openEmailWindow() {
  const emailModal = document.getElementById('emailModal');
  emailModal.style.display = 'block'; // Make modal visible
  emailModal.classList.add('show'); // Add the 'show' class for the transition
}

function closeEmailWindow() {
  document.getElementById('emailModal').style.display = 'none';
}

function sendEmail(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const sender = document.getElementById('sender').value; // User's email
  const subject = document.getElementById('subject').value; // Subject of email
  const message = document.getElementById('message').value; // Message content

  if (!sender || !subject || !message) {
    alert('Please provide all required fields.');
    return;
  }

  if (!validateEmail(sender)) {
    alert('Please enter a valid email address');
    return;
  }

  // Sending email data to the server
  fetch('https://website-portfolio-dl6i.onrender.com/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sender, subject, message }),
  })
    .then(response => response.json())
    .then(data => {
      alert('Email sent successfully');
    })
    .catch(error => {
      alert('Email failed to send');
    });
}

// A simple email validation regex
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}
