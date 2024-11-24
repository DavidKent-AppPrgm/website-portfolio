//server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const cors = require('cors');
const app = express();

// Use the port from the environment variable (for Render) or fall back to 10000 for local development
const port = process.env.PORT || 10000;

// Enable CORS for all routes (update with your frontend URL)
app.use(cors({
  origin: 'https://davidkentdeveloper.com',  // Replace with your actual frontend URL
  credentials: true,  // Allow cookies and headers (including CSRF token)
}));

// Set up body parser middleware to handle JSON requests
app.use(bodyParser.json());

// CSRF protection setup (with cookie settings)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,  // Make sure the cookie is only accessible via HTTP (not JavaScript)
    secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
    sameSite: 'Strict',  // or 'Lax', depending on your needs
  },
});

// Set up a simple route to send the CSRF token
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// POST route for sending email
app.post('/send-email', csrfProtection, async (req, res) => {
  const { sender, subject, message } = req.body;

  // Set up nodemailer transporter using Gmail's service
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // Gmail as the email service
    auth: {
      user: process.env.GMAIL_USER,  // Use environment variable for email
      pass: process.env.GMAIL_PASS,  // Use environment variable for password
    },
  });

  // Email options (recipient, subject, text)
  const mailOptions = {
    from: sender,  // Sender's email (taken from form input)
    to: 'dkintxprof@gmail.com',  // Replace with the recipient's email
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
