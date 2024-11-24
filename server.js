//server.js
require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const csrf = require('csurf');  // Import the csrf module
const cookieParser = require('cookie-parser'); // Import cookie-parser to parse cookies

const app = express();
const port = process.env.PORT || 3000;

// Set up body parser for JSON data
app.use(bodyParser.json());

// Use cookie-parser middleware for reading cookies (important for CSRF)
app.use(cookieParser());

// Set up csrf middleware
const csrfProtection = csrf({ cookie: true }); // Enable CSRF protection with cookies

// Set up OAuth2 Client
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://davidkent-appprgm.github.io/website-portfolio/'  // Redirect URL
);

// Store the refresh token in an environment variable or database
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Function to get a new access token using the refresh token
async function getNewAccessToken() {
  try {
    const { tokens } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(tokens); // Set the new access token
    console.log('New Access Token:', tokens.access_token);
    return tokens.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
}

// Example of how to check and refresh token if needed
async function checkAndRefreshToken() {
  const accessToken = oauth2Client.credentials.access_token;
  if (!accessToken) {
    await getNewAccessToken();
  }
  return oauth2Client.credentials.access_token;
}

// Create Nodemailer transporter using Gmail API
async function createTransporter() {
  const accessToken = await checkAndRefreshToken(); // Ensure the token is valid
  return nodemailer.createTransport({
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
}

// Serve the CSRF token to the front-end
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Handle the POST request to send an email
app.post('/send-email', csrfProtection, async (req, res) => {  // Apply CSRF protection here
  const { sender, subject, message } = req.body;  // Get form data from request body

  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: subject,
      text: message,
      replyTo: sender,              // The user's email will be used as the "Reply-To"
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
  } catch (error) {
    console.error('Error creating transporter:', error);
    res.status(500).send('Failed to create transporter');
  }
});

// OAuth2 callback route
app.get('/auth/callback', (req, res) => {
  const { code } = req.query;

  // Get the access token using the authorization code
  oauth2Client.getToken(code, (error, tokens) => {
    if (error) {
      console.error('Error during OAuth callback:', error);
      return res.status(500).send('Failed to authenticate');
    }

    // Set the credentials for future requests
    oauth2Client.setCredentials(tokens);

    // Redirect to home or success page
    res.redirect('https://davidkent-appprgm.github.io/website-portfolio');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
