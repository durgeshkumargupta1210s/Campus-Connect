import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send registration confirmation email
export const sendRegistrationConfirmation = async (userEmail, userName, eventTitle, eventDate, eventLocation, isPaid = false, amount = 0) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email service not configured. Skipping email to:', userEmail);
      return { success: true, skipped: true };
    }

    const transporter = createTransporter();

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #4f46e5; margin: 0; font-size: 28px; }
          .content { color: #333; line-height: 1.6; }
          .event-box { background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #4f46e5; margin: 20px 0; }
          .payment-box { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
          .footer { text-align: center; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666; }
          .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Registration Confirmed</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>Thank you for registering for our event! Your registration is now confirmed.</p>
            
            <div class="event-box">
              <h2 style="color: #4f46e5; margin-top: 0;">Event Details</h2>
              <p><strong>Event:</strong> ${eventTitle}</p>
              <p><strong>Date:</strong> ${eventDate}</p>
              ${eventLocation ? `<p><strong>Location:</strong> ${eventLocation}</p>` : ''}
            </div>

            ${isPaid ? `
              <div class="payment-box">
                <p style="margin: 0;"><strong>Payment Amount:</strong> ₹${amount}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #856404;">Payment received and confirmed.</p>
              </div>
            ` : ''}

            <p>You will receive a separate email with your ticket and QR code for venue entry.</p>
            
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/my-tickets" class="button">View My Tickets</a>
            </p>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Best regards,<br><strong>Campus Connect Hub Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Campus Connect Hub. All rights reserved.</p>
            <p><a href="mailto:support@campusconnecthub.com">support@campusconnecthub.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const plainText = `
Hi ${userName},

Thank you for registering for our event!

Event: ${eventTitle}
Date: ${eventDate}
${eventLocation ? `Location: ${eventLocation}` : ''}
${isPaid ? `Payment Amount: ₹${amount}` : ''}

You will receive a separate email with your ticket and QR code for venue entry.

Best regards,
Campus Connect Hub Team
    `;

    const info = await transporter.sendMail({
      from: `"Campus Connect Hub" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Registration Confirmed - ${eventTitle}`,
      text: plainText,
      html: htmlBody
    });

    console.log('✓ Registration confirmation email sent to:', userEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send event creation notification to subscribers
export const sendEventCreatedNotification = async (eventData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email service not configured. Skipping event notification.');
      return { success: true, skipped: true, count: 0 };
    }

    // Get all users who should be notified (all users for now, or implement subscription system)
    // For now, we'll just log it. In production, you'd fetch subscribed users from database
    const transporter = createTransporter();

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #4f46e5; margin: 0; font-size: 28px; }
          .content { color: #333; line-height: 1.6; }
          .event-box { background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #4f46e5; margin: 20px 0; }
          .footer { text-align: center; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666; }
          .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Event Available!</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We're excited to announce a new event on Campus Connect Hub!</p>
            
            <div class="event-box">
              <h2 style="color: #4f46e5; margin-top: 0;">${eventData.title}</h2>
              <p><strong>Date:</strong> ${eventData.date}</p>
              ${eventData.location ? `<p><strong>Location:</strong> ${eventData.location}</p>` : ''}
              ${eventData.description ? `<p>${eventData.description.substring(0, 200)}${eventData.description.length > 200 ? '...' : ''}</p>` : ''}
            </div>

            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${eventData.id}" class="button">View Event Details</a>
            </p>
            
            <p>Don't miss out on this exciting opportunity!</p>
            
            <p>Best regards,<br><strong>Campus Connect Hub Team</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Campus Connect Hub. All rights reserved.</p>
            <p><a href="mailto:support@campusconnecthub.com">support@campusconnecthub.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    const plainText = `
New Event Available!

${eventData.title}

Date: ${eventData.date}
${eventData.location ? `Location: ${eventData.location}` : ''}

${eventData.description ? eventData.description.substring(0, 200) : ''}

Visit: ${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${eventData.id}

Best regards,
Campus Connect Hub Team
    `;

    // Note: In production, you'd send this to all subscribed users
    // For now, we'll just log it. You can implement a subscription system later
    console.log('📧 Event creation notification prepared for:', eventData.title);
    console.log('   (In production, this would be sent to all subscribed users)');

    return { success: true, count: 0 };
  } catch (error) {
    console.error('Error sending event notification:', error);
    return { success: false, error: error.message, count: 0 };
  }
};

// Send email to admin when event is created
export const sendEventCreatedToAdmin = async (adminEmail, eventData) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email service not configured. Skipping admin notification.');
      return { success: true, skipped: true };
    }

    const transporter = createTransporter();

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #10b981; margin: 0; font-size: 28px; }
          .content { color: #333; line-height: 1.6; }
          .event-box { background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0; }
          .footer { text-align: center; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Event Created Successfully</h1>
          </div>
          <div class="content">
            <p>Hello Admin,</p>
            <p>Your event has been successfully created and is now live on Campus Connect Hub!</p>
            
            <div class="event-box">
              <h2 style="color: #10b981; margin-top: 0;">${eventData.title}</h2>
              <p><strong>Date:</strong> ${eventData.date}</p>
              ${eventData.location ? `<p><strong>Location:</strong> ${eventData.location}</p>` : ''}
              ${eventData.category ? `<p><strong>Category:</strong> ${eventData.category}</p>` : ''}
              ${eventData.capacity ? `<p><strong>Capacity:</strong> ${eventData.capacity} participants</p>` : ''}
            </div>

            <p>Students can now view and register for this event on the platform.</p>
            
            <p>Best regards,<br><strong>Campus Connect Hub System</strong></p>
          </div>
          <div class="footer">
            <p>© 2025 Campus Connect Hub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const plainText = `
Event Created Successfully

Your event "${eventData.title}" has been successfully created and is now live!

Date: ${eventData.date}
${eventData.location ? `Location: ${eventData.location}` : ''}
${eventData.category ? `Category: ${eventData.category}` : ''}

Students can now view and register for this event.

Best regards,
Campus Connect Hub System
    `;

    const info = await transporter.sendMail({
      from: `"Campus Connect Hub" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `Event Created: ${eventData.title}`,
      text: plainText,
      html: htmlBody
    });

    console.log('✓ Event creation confirmation sent to admin:', adminEmail);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message };
  }
};

