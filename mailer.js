function openEmailWindow() {
  document.getElementById('emailModal').style.display = 'block';
}

function closeEmailWindow() {
  document.getElementById('emailModal').style.display = 'none';
}

function sendEmail(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const recipient = document.getElementById('recipient').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  console.log(`Sending email to ${recipient} with subject: ${subject} and message: ${message}`);

  closeEmailWindow();

  // Submit message alert
  alert('Your email has been sent!');
}
