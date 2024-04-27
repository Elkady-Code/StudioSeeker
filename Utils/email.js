const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    // Create a Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: false, // Disable SSL/TLS
      tls: {
        rejectUnauthorized: false, // Disable certificate validation
      },
    });

    // Define email options
    const emailOptions = {
      from: "Cineflix support <support@cineflix.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Send email
    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to be handled elsewhere if needed
  }
};

module.exports = sendEmail;
