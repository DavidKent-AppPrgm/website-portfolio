// server.js (Backend)
const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors');  // Import CORS middleware

const app = express();
const port = process.env.PORT || 10000;

alert('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID);
alert('GOOGLE_CLIENT_SECRET', process.env.GOOGLE_CLIENT_SECRET);
alert('GOOGLE_REDIRECT_URI', process.env.GOOGLE_REDIRECT_URI);
alert('GOOGLE_REFRESH_TOKEN', process.env.GOOGLE_REFRESH_TOKEN);

// Enable CORS for a specific origin (your frontend domain)
app.use(cors({
  origin: 'https://davidkentdeveloper.com',  // Allow requests only from this domain
  methods: ['GET', 'POST'],  // Allow GET and POST methods
  allowedHeaders: ['Content-Type'],  // Allow specific headers
}));

app.use(express.json());  // To parse JSON request body

// Set up the OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

// Send email route
app.post('/send-email', async (req, res) => {
  const { sender, subject, message } = req.body;

  if (!sender || !subject || !message) {
    return res.status(400).send('Please provide all required fields.');
  }

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: sender,
      to: process.env.GMAIL_USER,
      subject: subject,
      text: message,
    };

    const result = await transport.sendMail(mailOptions);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
