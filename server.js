//server.js
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const app = express();
const port = process.env.PORT || 3000;

// Set up body parser for JSON data
app.use(bodyParser.json());

// Set up OAuth2 Client
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://davidkent-appprgm.github.io/website-portfolio/'  // Redirect URL
);

// Set credentials with the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Get the access token
const accessToken = oauth2Client.getAccessToken();

// Create Nodemailer transporter using Gmail API
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: accessToken,
  },
});

// Handle the POST request to send an email
app.post('/send-email', (req, res) => {
  const { sender, subject, message } = req.body;  // Get form data from request body

  const mailOptions = {
    from: sender,
    to: process.env.GMAIL_USER,
    subject: subject,
    text: message,
  };

  // Send the email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
