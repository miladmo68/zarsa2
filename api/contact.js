// import { Resend } from "resend";
// import formidable from "formidable";
// import fs from "fs";

// const TO = process.env.CONTACT_TO || "ZARSAGOLD@GMAIL.COM";
// const FROM = process.env.CONTACT_FROM || "Zarsa Form <onboarding@resend.dev>";
// const BCC = process.env.CONTACT_BCC || "";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.status(405).json({ message: "Method Not Allowed" });
//     return;
//   }

//   const resend = new Resend(process.env.RESEND_API_KEY);
//   const form = formidable({ multiples: false, maxFileSize: 10 * 1024 * 1024 });

//   try {
//     const { fields, files } = await new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//     const name = String(fields.name || "").trim();
//     const email = String(fields.email || "").trim();
//     const phone = String(fields.phone || "N/A").trim();
//     const category = String(fields.category || "N/A").trim();
//     const message = String(fields.message || "").trim();

//     let attachments = [];
//     const file = files.reference;
//     if (
//       file &&
//       ((Array.isArray(file) && file[0]?.size > 0) ||
//         (!Array.isArray(file) && file.size > 0))
//     ) {
//       const fobj = Array.isArray(file) ? file[0] : file;
//       const content = fs.readFileSync(fobj.filepath);
//       attachments.push({
//         filename: fobj.originalFilename || "reference",
//         content,
//       });
//     }

//     const html = `
//       <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;">
//         <h2>New Custom Order / Contact</h2>
//         <p><strong>Name:</strong> ${escapeHtml(name)}</p>
//         <p><strong>Email:</strong> ${escapeHtml(email)}</p>
//         <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
//         <p><strong>Category:</strong> ${escapeHtml(category)}</p>
//         <p><strong>Message:</strong><br/>${escapeHtml(message).replace(
//           /\n/g,
//           "<br/>"
//         )}</p>
//         <p style="color:#666;">Sent from Zarsa Gold website on Vercel.</p>
//       </div>
//     `;

//     const { error } = await resend.emails.send({
//       from: FROM,
//       to: [TO],
//       reply_to: email || undefined,
//       subject: `Zarsa Gold — New Inquiry from ${name || "Website"}`,
//       html,
//       bcc: BCC ? [BCC] : undefined,
//       attachments,
//     });

//     if (error) {
//       console.error(error);
//       res.status(500).json({ message: "Email send failed", error });
//       return;
//     }

//     res.status(200).json({ message: "Thanks! Your message has been sent." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error", error: String(err) });
//   }
// }

// function escapeHtml(str) {
//   return String(str).replace(
//     /[&<>"']/g,
//     (s) =>
//       ({
//         "&": "&amp;",
//         "<": "&lt;",
//         ">": "&gt;",
//         '"': "&quot;",
//         "'": "&#39;",
//       }[s])
//   );
// }
// api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true, // 465 → SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `New message from website — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ error: "Send failed" });
  }
}
