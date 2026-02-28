export function passwordResetTemplate(resetPasswordLink, name){
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset</title>
      <style>
        body, table, td, a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table, td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          height: 100% !important;
          background-color: #f4f6f8;
          font-family: Arial, Helvetica, sans-serif;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
        }
        .email-header {
          background-color: #0f172a;
          padding: 24px;
          text-align: center;
        }
        .email-header h1 {
          color: #ffffff;
          font-size: 20px;
          margin: 0;
        }
        .email-body {
          padding: 32px 24px;
          color: #1f2937;
          font-size: 15px;
          line-height: 1.6;
        }
        .email-body h2 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #111827;
        }
        .verify-button {
          display: inline-block;
          margin: 24px 0;
          padding: 14px 28px;
          background-color: #2563eb;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        }
        .email-footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          background-color: #f9fafb;
        }
      </style>
    </head>

    <body>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 24px">
            <table class="email-container" width="100%">
              <!-- Header -->
              <tr>
                <td class="email-header">
                  <h1>Password Reset Request</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td class="email-body">
                  <h2>Hello, ${name}👋</h2>

                  <p>
                    We received a request to reset your password. Click the button
                    below to create a new password.
                  </p>

                  <a href="${resetPasswordLink}"style="display: inline-block; padding: 14px 28px; background-color: #2563eb; 
                  color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center;">Reset Password</a>
                  
                  <p style="margin-top: 24px">
                    This link will expire in <strong> 2 minutes</strong> for
                    security reasons.
                  </p>

                  <p>
                    If you did not request a password reset, please ignore this
                    email your account remains secure.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td class="email-footer">
                  <p>© ${year} EduLearn. All rights reserved.</p>
                  <p>
                    Need help? Contact us at
                    <a href="mailto:support@EduLearn.com">
                      support@EduLearn.com
                    </a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`
};