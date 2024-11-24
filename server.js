//server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cors = require('cors');
const app = express();

// Use the port from the environment variable (for Render) or fall back to 10000 for local development
const port = process.env.PORT || 10000;

// Enable CORS for all routes
app.use(cors()); // Allow all origins to access the server

// Set up body parser middleware to handle JSON requests
app.use(bodyParser.json());

// CSRF protection setup
const csrfProtection = csrf({ cookie: true });

// Set up a simple route to send the CSRF token
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// POST route for sending email
app.post('/send-email', csrfProtection, async (req, res) => {
  const { sender, subject, message } = req.body;

  // Set up nodemailer transporter using Gmail's service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail as the email service
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Email options (recipient, subject, text)
  const mailOptions = {
    from: sender,  // Sender's email (taken from form input)
    to: 'dkintxprof@gmail.com',
    subject: subject,
    text: message,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
