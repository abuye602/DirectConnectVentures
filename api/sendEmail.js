import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Received request body:", req.body);
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        message: "Missing required fields",
        received: { firstName, lastName, email, message },
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Direct Connect Ventures" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #16b3ce; text-align: center;">New Contact Form Submission</h2>
          <p style="font-size: 16px; color: #333;">You have received a new message from your contact form:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>First Name:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${firstName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Last Name:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Message:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
            </tr>
          </table>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
}
