import { Resend } from "resend";
import formidable from "formidable";
import fs from "fs";

const TO = process.env.CONTACT_TO || "ZARSAGOLD@GMAIL.COM";
const FROM = process.env.CONTACT_FROM || "Zarsa Form <onboarding@resend.dev>";
const BCC = process.env.CONTACT_BCC || "";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const form = formidable({
    multiples: false,
    maxFileSize: 10 * 1024 * 1024,
    allowEmptyFiles: true, // an empty file input must not break the request
    minFileSize: 0,
  });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const one = (v) => (Array.isArray(v) ? v[0] : v);
    const name = String(one(fields.name) || "").trim();
    const email = String(one(fields.email) || "").trim();
    const phone = String(one(fields.phone) || "N/A").trim();
    const category = String(one(fields.category) || "N/A").trim();
    const message = String(one(fields.message) || "").trim();

    if (!name || !email || !message) {
      res.status(400).json({ message: "Name, email and message are required." });
      return;
    }
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      res.status(500).json({ message: "Email service is not configured." });
      return;
    }

    let attachments = [];
    const file = files.reference;
    if (
      file &&
      ((Array.isArray(file) && file[0]?.size > 0) ||
        (!Array.isArray(file) && file.size > 0))
    ) {
      const fobj = Array.isArray(file) ? file[0] : file;
      const content = fs.readFileSync(fobj.filepath);
      attachments.push({
        filename: fobj.originalFilename || "reference",
        content,
      });
    }

    const html = `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;">
        <h2>New Custom Order / Contact</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Category:</strong> ${escapeHtml(category)}</p>
        <p><strong>Message:</strong><br/>${escapeHtml(message).replace(
          /\n/g,
          "<br/>"
        )}</p>
        <p style="color:#666;">Sent from Zarsa Gold website on Vercel.</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      reply_to: email || undefined,
      subject: `Zarsa Gold — New Inquiry from ${name || "Website"}`,
      html,
      bcc: BCC ? [BCC] : undefined,
      attachments,
    });

    if (error) {
      console.error(error);
      res.status(500).json({ message: "Email send failed", error });
      return;
    }

    res.status(200).json({ message: "Thanks! Your message has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: String(err) });
  }
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (s) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[s])
  );
}
