import { RequestHandler } from "express";
import { Resend } from "resend";
import { z } from "zod";

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  inquiryType: z.string().optional(),
});

// Initialize Resend (you'll need to set RESEND_API_KEY in your environment)
const resend = new Resend(process.env.RESEND_API_KEY || "demo-key");

export const handleContact: RequestHandler = async (req, res) => {
  try {
    // Validate the request body
    const validatedData = contactSchema.parse(req.body);
    const { name, email, subject, message, inquiryType } = validatedData;

    // In demo mode or if no API key is set
    if (
      !process.env.RESEND_API_KEY ||
      process.env.RESEND_API_KEY === "demo-key"
    ) {
      console.log("Demo mode: Contact form submitted:", {
        name,
        email,
        subject,
        message,
        inquiryType,
      });

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return res.json({
        success: true,
        message: "Demo mode: Message received successfully!",
      });
    }

    // Send email to support team
    const emailToSupport = await resend.emails.send({
      from: "noreply@jaytec.com", // Replace with your verified domain
      to: ["support@jaytec.com"], // Replace with your support email
      subject: `[JayTec E-Voting] ${inquiryType ? `[${inquiryType}] ` : ""}${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">New Contact Form Submission</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${inquiryType ? `<p><strong>Inquiry Type:</strong> ${inquiryType}</p>` : ""}
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
            <p>This message was sent via the JayTec E-Voting contact form.</p>
            <p>Reply to this email to respond directly to the sender.</p>
          </div>
        </div>
      `,
      replyTo: email, // This allows direct reply to the sender
    });

    // Send confirmation email to the user
    const confirmationEmail = await resend.emails.send({
      from: "noreply@jaytec.com", // Replace with your verified domain
      to: [email],
      subject: "Thank you for contacting JayTec E-Voting",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px;">
            <div style="width: 64px; height: 64px; background: #8b5cf6; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m6-6h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m-6 0V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2Z"/>
              </svg>
            </div>
            <h1 style="color: #1e293b; margin-bottom: 8px;">Thank You, ${name}!</h1>
            <p style="color: #64748b; font-size: 16px; margin-bottom: 30px;">
              We've received your message and will get back to you within 24 hours.
            </p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            ${inquiryType ? `<p><strong>Inquiry Type:</strong> ${inquiryType}</p>` : ""}
            <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 6px;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px;">
            <p style="color: #64748b; margin-bottom: 15px;">
              In the meantime, feel free to explore our platform:
            </p>
            <a href="${process.env.FRONTEND_URL || "http://localhost:8080"}" 
               style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Visit JayTec E-Voting
            </a>
          </div>
          
          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 12px; color: #64748b;">
            <p>This is an automated response. Please do not reply to this email.</p>
            <p>If you need immediate assistance, please contact us at support@jaytec.com</p>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", {
      supportEmail: emailToSupport.data?.id,
      confirmationEmail: confirmationEmail.data?.id,
    });

    res.json({
      success: true,
      message:
        "Message sent successfully! You should receive a confirmation email shortly.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};
