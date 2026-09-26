const nodemailer = require("nodemailer");

// In-memory audit log for sent notification messages
const emailAuditLog = [];

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  // 1. If explicit SMTP credentials are provided in env
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("[EmailService] Configured custom SMTP transporter for:", process.env.SMTP_USER);
    return transporter;
  }

  // 2. If Gmail credentials are provided
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
    console.log("[EmailService] Configured Gmail transporter for:", process.env.GMAIL_USER);
    return transporter;
  }

  // 3. Fallback to Ethereal / simulated test transporter
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("[EmailService] Initialized Ethereal test transporter:", testAccount.user);
    return transporter;
  } catch (err) {
    console.warn("[EmailService] Notice: Operating in safe fallback dispatch mode:", err.message);
    // Dummy transporter
    return {
      sendMail: async (options) => {
        return { messageId: "simulated-" + Date.now(), simulated: true };
      },
    };
  }
}

/**
 * Send a Login Security Notification email whenever any user logs in
 * (Standard Email/Password, Google OAuth, Facebook, or Mobile OTP)
 */
async function sendLoginAlertEmail({ to, name = "Traveler", loginMethod = "Standard Email", ip = "127.0.0.1", userAgent = "Web Browser" }) {
  if (!to) return { success: false, error: "No recipient email provided" };

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });

  const subject = `🔐 Travel Guruji: Successful Sign-In Alert (${loginMethod})`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 32px;">✈️</span>
        <h2 style="color: #0f766e; margin: 8px 0 4px; font-size: 22px;">Travel_Guruji Security Center</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Authentic Sign-In Notification</p>
      </div>

      <div style="background-color: #f0fdfa; border-left: 4px solid #0f766e; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
        <p style="color: #0f172a; margin: 0; font-size: 15px; font-weight: 600;">
          Hi ${name},
        </p>
        <p style="color: #334155; margin: 6px 0 0; font-size: 14px; line-height: 1.5;">
          A new sign-in was just recorded on your Travel Guruji account.
        </p>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; color: #334155;">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Sign-In Method:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0f766e;">${loginMethod}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Account Email:</td>
            <td style="padding: 6px 0; font-weight: 600;">${to}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Time (IST):</td>
            <td style="padding: 6px 0;">${timestamp}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #64748b;">Platform:</td>
            <td style="padding: 6px 0;">Travel Guruji Intelligent Tourism Engine</td>
          </tr>
        </table>
      </div>

      <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 16px;">
        If this was you, no action is needed. If you did not perform this login, please secure your account immediately or contact support.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

      <p style="color: #94a3b8; font-size: 11.5px; text-align: center; margin: 0;">
        &copy; 2026 Travel_Guruji &bull; Smart Tourism, Safe Detours & Contextual Journeys
      </p>
    </div>
  `;

  try {
    const mailer = await getTransporter();
    const info = await mailer.sendMail({
      from: `"Travel Guruji Security" <no-reply@travelguruji.com>`,
      to,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;

    const logEntry = {
      type: "LOGIN_ALERT",
      to,
      loginMethod,
      timestamp,
      messageId: info.messageId,
      previewUrl,
    };
    emailAuditLog.unshift(logEntry);
    if (emailAuditLog.length > 50) emailAuditLog.pop();

    console.log(`[EmailService] ✉️ Login security alert successfully sent to: ${to} (Method: ${loginMethod})`);
    if (previewUrl) {
      console.log(`[EmailService] 🔗 Preview email URL: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error("[EmailService] Failed to dispatch login alert email:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send an authentic Email Verification OTP
 */
async function sendVerificationOtpEmail({ to, name = "Traveler", otp }) {
  if (!to || !otp) return { success: false, error: "Missing email or OTP" };

  const subject = `🔐 Your Travel Guruji Verification Code: ${otp}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; background-color: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 32px;">🛡️</span>
        <h2 style="color: #0f766e; margin: 8px 0 4px; font-size: 22px;">Verify Your Email Address</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Travel_Guruji Authentic Verification</p>
      </div>

      <p style="color: #334155; font-size: 14.5px; line-height: 1.5;">
        Hi ${name}, welcome to Travel Guruji! Please use the following 6-digit one-time verification code to verify your account:
      </p>

      <div style="text-align: center; margin: 24px 0;">
        <div style="display: inline-block; padding: 14px 28px; background: #f0fdfa; border: 2px dashed #0f766e; border-radius: 12px; font-size: 28px; font-weight: 800; letter-spacing: 6px; color: #0f766e;">
          ${otp}
        </div>
        <p style="color: #64748b; font-size: 12px; margin: 8px 0 0;">Valid for 10 minutes. Never share this code with anyone.</p>
      </div>

      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 24px 0 0;">
        If you didn't request this verification code, you can safely disregard this email.
      </p>
    </div>
  `;

  try {
    const mailer = await getTransporter();
    const info = await mailer.sendMail({
      from: `"Travel Guruji Accounts" <verify@travelguruji.com>`,
      to,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;

    console.log(`[EmailService] ✉️ Verification OTP (${otp}) dispatched to: ${to}`);
    if (previewUrl) {
      console.log(`[EmailService] 🔗 Preview verification email: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (err) {
    console.error("[EmailService] Failed to send verification OTP:", err.message);
    return { success: false, error: err.message };
  }
}

function getRecentAuditLogs() {
  return emailAuditLog;
}

module.exports = {
  sendLoginAlertEmail,
  sendVerificationOtpEmail,
  getRecentAuditLogs,
};
