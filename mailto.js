// Open the email modal
function openEmailWindow() {
  document.getElementById('emailModal').style.display = 'block';
}

// Close the email modal
function closeEmailWindow() {
  document.getElementById('emailModal').style.display = 'none';
}

// Handle the email form submission (you can customize this to send an actual email or save the data)
function sendEmail(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const recipient = document.getElementById('recipient').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Example: log to console (you can replace with actual email logic)
  console.log(`Sending email to ${recipient} with subject: ${subject} and message: ${message}`);

  // After sending, close the modal
  closeEmailWindow();

  // Optionally, alert the user that the email is being sent
  alert('Your email has been sent!');
}
