// server.js (CommonJS)
require('dotenv').config();
console.log("TOKEN:", process.env.TELEGRAM_TOKEN);
console.log("CHAT_ID:", process.env.TELEGRAM_CHAT_ID);

const express = require('express');
const path = require('path');
const axios = require('axios');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error("Missing TELEGRAM_TOKEN or TELEGRAM_CHAT_ID in .env. Exiting.");
  process.exit(1);
}

// Basic rate limiter: 10 submissions per 10 minutes per IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Too many submissions from this IP, please try again later."
});

app.use(limiter);
app.use(express.urlencoded({ extended: true })); // for form POST
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serve the frontend from /public

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/send', async (req, res) => {
  try {
    const { name, email } = req.body || {};

    // Simple validation
    if (!name || !email) {
      return res.status(400).send('Name and email are required.');
    }
    // basic sanity: length checks
    if (name.length > 200 || email.length > 200) {
      return res.status(400).send('Input too long.');
    }

    const text = `New submission:\nName: ${name}\nEmail: ${email}\nIP: ${req.ip}`;
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const resp = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    }, { timeout: 10000 });

    if (resp.data && resp.data.ok) {
      // In production you might redirect to a thank-you page
      return res.send('Message sent to Telegram!');
    } else {
      console.error('Telegram API response:', resp.data);
      return res.status(500).send('Failed to send message to Telegram.');
    }
  } catch (err) {
    console.error('Error in /send:', err?.response?.data || err.message || err);
    return res.status(500).send('Server error: ' + (err.message || 'unknown'));
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
