// Email Service - Handles ticket confirmations and event notifications
// Mock implementation that simulates sending emails
// In production, integrate with SendGrid, AWS SES, or EmailJS

export interface SubscriptionData {
  email: string;
  timestamp?: Date;
}

const SUBSCRIPTIONS_KEY = 'campus_connect_subscriptions';
const EMAIL_LOGS_KEY = 'campus_connect_email_logs';

class EmailServiceClass {
  // Subscribe user for notifications
  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      const subscriptions = localStorage.getItem(SUBSCRIPTIONS_KEY);
      const subscribedEmails = subscriptions ? JSON.parse(subscriptions) : [];

      if (subscribedEmails.includes(email)) {
        return { success: false, message: 'This email is already subscribed' };
      }

      subscribedEmails.push(email);
      localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscribedEmails));
      await this.sendThankYouEmail(email);

      return { success: true, message: 'Thank you for subscribing! Check your email for confirmation.' };
    } catch (error) {
      console.error('Subscription error:', error);
      return { success: false, message: 'Failed to subscribe. Please try again.' };
    }
  }

  // Send thank you email
  async sendThankYouEmail(email: string): Promise<boolean> {
    try {
      console.log(`📧 Thank you email sent to: ${email}`);
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`✅ Email confirmed for: ${email}`);
          resolve(true);
        }, 500);
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send event notification to all subscribers
  async notifyEventCreated(eventData: {
    name: string;
    date: string;
    description: string;
  }): Promise<{ success: boolean; count: number }> {
    try {
      const subscriptions = localStorage.getItem(SUBSCRIPTIONS_KEY);
      const subscribedEmails = subscriptions ? JSON.parse(subscriptions) : [];

      if (subscribedEmails.length === 0) {
        return { success: true, count: 0 };
      }

      for (const email of subscribedEmails) {
        await this.sendEventNotificationEmail(email, eventData);
      }

      console.log(`📧 Event notification sent to ${subscribedEmails.length} subscribers`);
      return { success: true, count: subscribedEmails.length };
    } catch (error) {
      console.error('Error notifying subscribers:', error);
      return { success: false, count: 0 };
    }
  }

  // Send ticket confirmation email with QR code
  async sendTicketConfirmationEmail(
    userEmail: string,
    userName: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    ticketNumber: string,
    verificationCode: string,
    qrCodeDataUrl?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const htmlBody = this.generateTicketEmailHTML(
        userName,
        eventTitle,
        eventDate,
        eventLocation,
        ticketNumber,
        verificationCode,
        qrCodeDataUrl
      );

      const plainText = this.generatePlainTextEmail(
        userName,
        eventTitle,
        eventDate,
        ticketNumber,
        verificationCode
      );

      const emailLog = {
        to: userEmail,
        subject: `Your Event Ticket Confirmation - ${eventTitle}`,
        htmlBody,
        plainText,
        ticketNumber,
        sentAt: new Date().toISOString(),
        type: 'ticket_confirmation'
      };

      this.storeEmailLog(emailLog);
      console.log(`🎫 Ticket confirmation email sent to ${userEmail}`);

      // In production: make API call to SendGrid/AWS SES
      // const response = await fetch('/api/send-email', { ... });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  }

  // Generate HTML email template
  private generateTicketEmailHTML(
    userName: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    ticketNumber: string,
    verificationCode: string,
    qrCodeDataUrl?: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #4f46e5; margin: 0; font-size: 28px; }
          .ticket-section { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5; }
          .ticket-detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .qr-code { text-align: center; margin: 20px 0; }
          .qr-code img { max-width: 200px; }
          .verification { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
          .verification-code { font-size: 24px; font-weight: bold; color: #856404; font-family: monospace; }
          .instructions { background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .instructions h3 { color: #004085; margin-top: 0; }
          .footer { text-align: center; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Event Ticket Confirmed</h1>
          </div>
          <div style="color: #333; line-height: 1.6;">
            <p>Hi <strong>${userName}</strong>,</p>
            <p>Your ticket for <strong>${eventTitle}</strong> is confirmed!</p>
            
            <div class="ticket-section">
              <h2 style="color: #4f46e5; margin-top: 0;">Ticket Details</h2>
              <div class="ticket-detail">
                <span class="detail-label">Ticket Number:</span>
                <span>${ticketNumber}</span>
              </div>
              <div class="ticket-detail">
                <span class="detail-label">Event:</span>
                <span>${eventTitle}</span>
              </div>
              <div class="ticket-detail">
                <span class="detail-label">Date:</span>
                <span>${eventDate}</span>
              </div>
              <div class="ticket-detail">
                <span class="detail-label">Location:</span>
                <span>${eventLocation}</span>
              </div>
            </div>

            ${qrCodeDataUrl ? `
              <div class="qr-code">
                <p style="color: #666;">Scan at venue for quick entry:</p>
                <img src="${qrCodeDataUrl}" alt="Entry QR Code" />
              </div>
            ` : ''}

            <div class="verification">
              <p style="margin: 0 0 10px 0;">Verification Code:</p>
              <div class="verification-code">${verificationCode}</div>
            </div>

            <div class="instructions">
              <h3>📋 Entry Instructions</h3>
              <ol>
                <li>Arrive 15 minutes early</li>
                <li>Show this email or QR code at entry</li>
                <li>Staff will verify and stamp your entry</li>
              </ol>
            </div>

            <p style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:5173/my-tickets" style="background: #4f46e5; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; display: inline-block;">View My Tickets</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Campus Connect Hub | support@campusconnecthub.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate plain text email
  private generatePlainTextEmail(
    userName: string,
    eventTitle: string,
    eventDate: string,
    ticketNumber: string,
    verificationCode: string
  ): string {
    return `
EVENT TICKET CONFIRMATION

Hello ${userName},

Your ticket for ${eventTitle} is confirmed!

TICKET DETAILS
Ticket Number: ${ticketNumber}
Event: ${eventTitle}
Date: ${eventDate}
Verification Code: ${verificationCode}

ENTRY INSTRUCTIONS
1. Arrive 15 minutes early
2. Show this email at entry
3. Staff will verify your ticket

© 2025 Campus Connect Hub
support@campusconnecthub.com
    `;
  }

  // Store email log in localStorage
  private storeEmailLog(log: { to: string; subject: string; htmlBody: string; plainText: string; ticketNumber: string; sentAt: string; type: string }): void {
    try {
      const logs = JSON.parse(localStorage.getItem(EMAIL_LOGS_KEY) || '[]');
      logs.push(log);
      localStorage.setItem(EMAIL_LOGS_KEY, JSON.stringify(logs.slice(-50)));
    } catch (error) {
      console.error('Error storing email log:', error);
    }
  }

  // Get subscriptions
  getSubscriptions(): string[] {
    const subscriptions = localStorage.getItem(SUBSCRIPTIONS_KEY);
    return subscriptions ? JSON.parse(subscriptions) : [];
  }

  // Unsubscribe
  async unsubscribe(email: string): Promise<boolean> {
    try {
      const subscriptions = localStorage.getItem(SUBSCRIPTIONS_KEY);
      const subscribedEmails = subscriptions ? JSON.parse(subscriptions) : [];
      const filtered = subscribedEmails.filter((e: string) => e !== email);
      localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(filtered));
      console.log(`🚫 Unsubscribed: ${email}`);
      return true;
    } catch (error) {
      console.error('Unsubscribe error:', error);
      return false;
    }
  }

  // Send event notification
  private async sendEventNotificationEmail(email: string, eventData: {
    name: string;
    date: string;
    description: string;
  }): Promise<void> {
    console.log(`📧 Event notification for ${email}:`, eventData.name);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`✅ Event notification sent to ${email}`);
        resolve();
      }, 300);
    });
  }

  // Send registration confirmation email
  async sendRegistrationConfirmation(
    userEmail: string,
    userName: string,
    eventTitle: string,
    eventDate: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const htmlBody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #4f46e5; margin: 0; font-size: 28px; }
            .content { color: #333; line-height: 1.6; }
            .event-box { background: #f0f7ff; padding: 20px; border-radius: 8px; border-left: 4px solid #4f46e5; margin: 20px 0; }
            .footer { text-align: center; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666; }
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
              </div>

              <p>You will receive a separate email with your ticket and QR code for venue entry.</p>
              
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

You will receive a separate email with your ticket and QR code for venue entry.

Best regards,
Campus Connect Hub Team
      `;

      const emailLog = {
        to: userEmail,
        subject: `Registration Confirmed - ${eventTitle}`,
        htmlBody,
        plainText,
        sentAt: new Date().toISOString(),
        type: 'registration_confirmation',
        ticketNumber: ''
      };

      this.storeEmailLog(emailLog);
      console.log(`✓ Registration confirmation email sent to ${userEmail}`);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      };
    }
  }
}

export const emailService = new EmailServiceClass();
