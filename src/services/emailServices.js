// src/services/emailService.js
import nodemailer from 'nodemailer';
import {config as env} from '../config/env.js';

// 1. Configure your email transport.
//    This is an example using Gmail. For production, use a dedicated service
//    like SendGrid, Mailgun, or AWS SES.
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your email provider
    auth: {
        user: env.EMAIL_USER, // Your email address from .env file
        pass: env.EMAIL_PASS, // Your email password or app-specific password from .env file
    },
});

// 2. Create a function to send the verification email.
export async function sendVerificationEmail(userEmail, verificationToken) {
    // This is the link the user will click in their email.
    // In a real app, the `CLIENT_URL` should be in your .env file (e.g., http://localhost:3000)
    const verificationLink = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: `"TFB Studios" <${env.EMAIL_USER}>`, // Sender address
        to: userEmail, // List of receivers
        subject: 'Welcome! Please Verify Your Email Address', // Subject line
        // You can use a simple text body or a fancier HTML body.
        html: `
            <div style="font-family: sans-serif; text-align: center; padding: 40px;">
                <h2>Welcome to TFB Studios!</h2>
                <p>Thank you for signing up. Please click the button below to verify your email address and activate your account.</p>
                <a href="${verificationLink}"
                   style="background-color: #000; color: #fff; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-size: 16px; margin-top: 20px;">
                   Verify Email
                </a>
                <p style="margin-top: 30px;">If you cannot click the button, please copy and paste this link into your browser:</p>
                <p><a href="${verificationLink}">${verificationLink}</a></p>
            </div>
        `,
    };

    // 3. Send the email.
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending verification email:', error);
        // In a real app, you might want to handle this failure more gracefully.
        throw new Error('Could not send verification email.');
    }
}