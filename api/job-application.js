const formidableLib = require("formidable");
const nodemailer = require("nodemailer");

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const formidable = formidableLib.formidable || formidableLib;
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 8 * 1024 * 1024,
      multiples: false,
    });

    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve({ fields, files });
    });
  });

const firstValue = (value) => {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildRows = (entries) =>
  entries
    .map(
      ([label, value]) => `
        <tr>
          <th style="width:32%;padding:14px 16px;border:1px solid #d9e0e5;text-align:left;background:#f6f9fb;color:#0c2530;font:700 14px Arial,sans-serif;">${escapeHtml(label)}</th>
          <td style="padding:14px 16px;border:1px solid #d9e0e5;color:#263943;font:14px Arial,sans-serif;">${escapeHtml(value || "Not provided")}</td>
        </tr>`
    )
    .join("");

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { fields, files } = await parseForm(req);

    if (firstValue(fields._honey)) {
      res.status(200).json({ ok: true });
      return;
    }

    const application = {
      Position: firstValue(fields.Position),
      Name: firstValue(fields.Name),
      Phone: firstValue(fields.Phone),
      Email: firstValue(fields.Email),
      Experience: firstValue(fields.Experience),
      Message: firstValue(fields.Message),
    };

    if (!application.Name || !application.Phone || !application.Email || !application.Position) {
      res.status(400).json({ error: "Missing required application details" });
      return;
    }

    const resumeFile = Array.isArray(files.Resume) ? files.Resume[0] : files.Resume;
    const subject = `New PlumbPro Tech Job Application - ${application.Name} - ${application.Position}`;
    const rows = buildRows([
      ["Position", application.Position],
      ["Name", application.Name],
      ["Phone", application.Phone],
      ["Email", application.Email],
      ["Experience", application.Experience],
      ["Message", application.Message],
      ["Resume", resumeFile?.originalFilename || "Not attached"],
    ]);

    const html = `
      <div style="margin:0;padding:24px;background:#eef4f5;">
        <div style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #d9e0e5;">
          <div style="padding:24px 28px;background:#071f33;color:#ffffff;">
            <p style="margin:0 0 8px;color:#f5b72e;font:700 12px Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;">PlumbPro Tech Careers</p>
            <h1 style="margin:0;font:700 26px Arial,sans-serif;line-height:1.25;">${escapeHtml(application.Name)} submitted a job application</h1>
          </div>
          <div style="padding:24px 28px;">
            <p style="margin:0 0 18px;color:#263943;font:15px Arial,sans-serif;">A new candidate application has been received from the careers page.</p>
            <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;">
              ${rows}
            </table>
          </div>
        </div>
      </div>`;

    const text = [
      `${application.Name} submitted a job application`,
      "",
      `Position: ${application.Position}`,
      `Name: ${application.Name}`,
      `Phone: ${application.Phone}`,
      `Email: ${application.Email}`,
      `Experience: ${application.Experience || "Not provided"}`,
      `Message: ${application.Message || "Not provided"}`,
      `Resume: ${resumeFile?.originalFilename || "Not attached"}`,
    ].join("\n");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") !== "false",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO || "suresht2127@gmail.com",
      replyTo: application.Email,
      subject,
      html,
      text,
      attachments: resumeFile
        ? [
            {
              filename: resumeFile.originalFilename || "resume",
              path: resumeFile.filepath,
              contentType: resumeFile.mimetype,
            },
          ]
        : [],
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Job application email failed", error);
    res.status(500).json({ error: "Could not send application" });
  }
};

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
