//server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // redirect URI for OAuth2
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

app.post('/send-email', async (req, res) => {
  const { sender, subject, message } = req.body;

  try {
    // Prepare the email message
    const email = [
      `From: ${sender}`,
      `To: ${process.env.GMAIL_USER}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n');

    const raw = Buffer.from(email).toString('base64');
    const encodedMessage = raw.replace(/=/g, '');

    // Send the email using Gmail API
    await gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: encodedMessage,
      },
    });

    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.log(error);
    res.status(500).send('Failed to send email');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
