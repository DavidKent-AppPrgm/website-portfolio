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
  origin: ['https://davidkentdeveloper.com', 'http://localhost:3000'],  // Allow both production and local domains
  credentials: true,  // Allow cookies and headers (including CSRF token)
}));

// Set up body parser middleware to handle JSON requests
app.use(bodyParser.json());

// CSRF protection setup (with cookie settings)
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,  // Prevents access from JavaScript
    secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
    sameSite: 'Lax',
  },
});

app.use(csrfProtection);

// Set up a simple route to send the CSRF token
app.get('/csrf-token', csrfProtection, (req, res) => {
  console.log('Received CSRF token request');
  res.json({ csrfToken: req.csrfToken() });  // Sends the CSRF token in the response
});

// POST route for sending email
app.post('/send-email', csrfProtection, async (req, res) => {
  const { sender, subject, message } = req.body;

  // Simple validation of input fields to ensure they are not empty
  if (!sender || !subject || !message) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  // Set up nodemailer transporter using Gmail's service
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // Gmail as the email service
    auth: {
      user: process.env.GMAIL_USER,  // Environment variable for email
      pass: process.env.GMAIL_PASS,  // Environment variable for password
    },
  });

  // Email options (recipient, subject, text)
  const mailOptions = {
    from: sender,  // Sender's email (taken from form input)
    to: 'dkintxprof@gmail.com',  // Replace with actual recipient's email
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
