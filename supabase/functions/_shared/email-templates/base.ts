interface BaseTemplateOptions {
  heading: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  previewText?: string;
}

/**
 * Returns a full HTML email string using the StudyBug branded base layout.
 * All styles are inline for maximum email client compatibility.
 */
export function baseTemplate(opts: BaseTemplateOptions): string {
  const { heading, body, ctaText, ctaUrl, previewText } = opts;

  const ctaButton =
    ctaText && ctaUrl
      ? `<a href="${ctaUrl}" style="display:inline-block; background:#8FD462; color:#ffffff; font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; font-size:16px; padding:14px 28px; border-radius:8px; text-decoration:none; margin-top:24px;">${ctaText}</a>`
      : '';

  const previewDiv = previewText
    ? `<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; color:#f9f9f9; line-height:1px;">${previewText}&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>${heading}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
      body { margin: 0; padding: 0; }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#f9f9f9; font-family:'Plus Jakarta Sans',sans-serif; -webkit-font-smoothing:antialiased;">
    ${previewDiv}

    <!-- Email wrapper -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9f9f9; padding:20px 0;">
      <tr>
        <td align="center" style="padding:20px 0;">

          <!-- Email card -->
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background:#ffffff; border:1px solid #E6E6E6; border-radius:12px; overflow:hidden; box-shadow:0 4px 6px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:#F6F1E5; padding:24px 32px; text-align:center;">
                <span style="font-family:'Quicksand',sans-serif; font-weight:700; font-size:24px; color:#212121; text-decoration:none;">study<span style="color:#8FD462;">bug</span></span>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <h1 style="font-family:'Quicksand',sans-serif; font-weight:700; font-size:28px; color:#212121; margin:0 0 16px 0; line-height:1.3;">${heading}</h1>
                ${body}
                ${ctaButton}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#F6F1E5; padding:20px 32px; text-align:center;">
                <p style="color:#666666; font-size:12px; margin:0; font-family:'Plus Jakarta Sans',sans-serif;">© 2025 StudyBug. All rights reserved.</p>
                <p style="color:#666666; font-size:12px; margin:8px 0 0 0; font-family:'Plus Jakarta Sans',sans-serif;">You received this email because you have an account on StudyBug.</p>
              </td>
            </tr>

          </table>
          <!-- /Email card -->

        </td>
      </tr>
    </table>
    <!-- /Email wrapper -->

  </body>
</html>`;
}
