// src/utils/mailer.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (
  email: string,
  subject: string,
  message: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"SwiftCare" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
      html,
    };

    const mailRes = await transporter.sendMail(mailOptions);
    console.log('Email status:', mailRes.response);

    if (mailRes.accepted.length > 0) return 'Email sent successfully';
    if (mailRes.rejected.length > 0) return 'Email not sent';
    return 'Unknown email server issue';
  } catch (error: any) {
    console.error('Email send error:', error);
    return 'Failed to send email: ' + error.message;
  }
};
