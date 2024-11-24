//server.js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const express = require('express')
const app = express()
const port = process.env.PORT || 10000;

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

async function sendEmail(event) {
  event.preventDefault(); // Prevent form submission from reloading the page

  const sender = document.getElementById('sender').value; // User's email
  const subject = document.getElementById('subject').value; // Subject of email
  const message = document.getElementById('message').value; // Message content

  if (!sender || !subject || !message) {
    alert('Please provide all required fields.');
    return;
  }

  if (!validateEmail(sender)) {
    alert('Please enter a valid From email');
    return;
  }
  console.log('Sending email with data:', { sender, subject, message });

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'dkintxprof@gmail.com',
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const mailOptions = {
      from: sender,  // Sender's email (taken from form input)
      to: 'dkintxprof@gmail.com',
      subject: subject,
      text: message,
    };

    const result = await transport.sendMail(mailOptions);
    alert('Email sent to dkintxprof@gmail.com');
    return result;

  } catch (error) {
    alert('Email failed to send');
    return error;
  }
}

function openEmailWindow() {
  const emailModal = document.getElementById('emailModal');
  emailModal.style.display = 'block'; // Make modal visible

  // Force a reflow/repaint to ensure the browser processes the style change
  // before adding the 'show' class for the transition
  emailModal.offsetHeight;  // This triggers a reflow, forcing the styles to update.

  emailModal.classList.add('show'); // Add the 'show' class for the transition
}

function closeEmailWindow() {
  document.getElementById('emailModal').style.display = 'none';
}

// A simple email validation regex
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
