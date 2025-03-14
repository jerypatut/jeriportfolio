const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Pastikan ada file .env di folder yang sama

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Untuk menangani form-urlencoded

// Nodemailer Transporter
const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verifikasi koneksi ke email
contactEmail.verify((error) => {
  if (error) {
    console.error('Error verifying email transport:', error);
  } else {
    console.log('Ready to send emails!');
  }
});

// Route untuk menangani kontak
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Konfigurasi email
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: subject || 'No Subject',
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await contactEmail.sendMail(mailOptions); // Kirim email
    res.status(200).json({ code: 200, status: 'Message Sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      code: 500,
      status: 'Failed to send message',
      error: error.message,
    });
  }
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
