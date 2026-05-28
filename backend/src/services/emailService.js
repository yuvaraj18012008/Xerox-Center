// Email service
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendOrderConfirmation = async (email, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Order Confirmation - Order ID: ${orderDetails.orderId}`,
    html: `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
      <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
      <p><strong>Expected Delivery:</strong> ${orderDetails.expectedDelivery}</p>
      <p>You can track your order using the order ID above.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendOrderStatusUpdate = async (email, orderId, status) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Order Status Update - Order ID: ${orderId}`,
    html: `
      <h2>Order Status Update</h2>
      <p>Your order status has been updated.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>New Status:</strong> ${status.toUpperCase()}</p>
      <p>Track your order for more details.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `${process.env.APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email - Smart Xerox Center',
    html: `
      <h2>Verify Your Email</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password - Smart Xerox Center',
    html: `
      <h2>Reset Your Password</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export const sendInvoice = async (email, invoiceData) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Invoice - Order ID: ${invoiceData.orderId}`,
    html: `
      <h2>Invoice</h2>
      <p><strong>Order ID:</strong> ${invoiceData.orderId}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Total:</strong> ₹${invoiceData.totalAmount}</p>
      <p>Thank you for your business!</p>
    `,
    attachments: [
      {
        filename: `Invoice-${invoiceData.orderId}.pdf`,
        content: invoiceData.pdfContent
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
  }
};

export default transporter;
