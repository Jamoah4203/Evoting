// /api/contact.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  inquiryType: z.string().optional(),
});

const resend = new Resend(process.env.RESEND_API_KEY || "demo-key");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;
    const { name, email, subject, message, inquiryType } = contactSchema.parse(body);

    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "demo-key") {
      console.log("Demo contact form:", { name, email, subject, message });
      return res.status(200).json({ success: true, message: "Demo mode: received!" });
    }

    await resend.emails.send({
      from: "noreply@jaytecgh.com",
      to: ["support@jaytecgh.com"],
      subject: `[JayTec E-Voting] ${inquiryType ? `[${inquiryType}] ` : ""}${subject}`,
      html: `<p>${message}</p><p>From: ${name} (${email})</p>`,
      replyTo: email,
    });

    await resend.emails.send({
      from: "noreply@jaytecgh.com",
      to: [email],
      subject: "We've received your message",
      html: `<p>Hi ${name}, thanks for reaching out. We'll get back to you shortly.</p>`,
    });

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
    }

    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
}
