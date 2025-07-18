# Contact Form & Email Setup

This guide explains how to set up the contact form with Resend email service.

## Features

- ✅ Contact form with validation
- ✅ Automatic email notifications to support team
- ✅ Confirmation emails to users
- ✅ Demo mode for testing without API keys
- ✅ Professional email templates
- ✅ Inquiry type categorization

## Setup Instructions

### 1. Get Resend API Key

1. Visit [Resend.com](https://resend.com) and create an account
2. Go to your dashboard and create an API key
3. Copy the API key for the next step

### 2. Configure Environment Variables

Add these to your `.env` file:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here

# Frontend URL (used in email links)
FRONTEND_URL=http://localhost:8080
```

### 3. Domain Verification (For Production)

For production use, you'll need to:

1. Add your domain to Resend
2. Verify domain ownership via DNS records
3. Update the email addresses in `server/routes/contact.ts`:
   - Change `from: "noreply@jaytec.com"` to your verified domain
   - Change `to: ["support@jaytec.com"]` to your support email

### 4. Customize Email Templates

Edit `server/routes/contact.ts` to customize:

- **Support notification email**: What your team receives
- **User confirmation email**: What users receive after submitting
- **Email styling**: HTML templates for both emails

## Demo Mode

When `RESEND_API_KEY` is not set or set to "demo-key", the contact form will:

- Log submissions to console
- Show success messages
- Not send actual emails
- Perfect for development and testing

## Contact Form Features

### Form Fields

- **Name**: User's full name (required)
- **Email**: User's email address (required)
- **Inquiry Type**: Dropdown selection (optional)
  - General Inquiry
  - Sales
  - Technical Support
  - Partnership
  - Media Inquiry
- **Subject**: Message subject (required)
- **Message**: Detailed message (required, min 10 characters)

### Email Templates

#### Support Team Email

- Clean, professional layout
- All form data clearly displayed
- Sender's email as reply-to address
- Inquiry type highlighted
- Easy to read formatting

#### User Confirmation Email

- Branded with JayTec E-Voting design
- Message summary for user reference
- Links back to platform
- Professional footer with contact info

### Validation

- Client-side validation using Zod schema
- Server-side validation for security
- Proper error handling and user feedback
- Required field enforcement

## Pricing Page Features

### Plans Available

1. **Starter Plan**: $29/month (Up to 100 voters)
2. **Professional Plan**: $79/month (Up to 1,000 voters) - Most Popular
3. **Enterprise Plan**: $199/month (Unlimited voters)

### Features

- Monthly/Yearly billing toggle (20% savings on yearly)
- Feature comparison table
- Responsive design
- Clear pricing display
- Call-to-action buttons

### Customization

Edit `client/pages/Pricing.tsx` to:

- Update pricing tiers
- Modify feature lists
- Change plan descriptions
- Adjust styling and branding

## API Endpoints

### POST /api/contact

Handles contact form submissions.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about pricing",
  "message": "I would like to know more about...",
  "inquiryType": "sales"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

## Troubleshooting

### Common Issues

1. **Emails not sending**

   - Check RESEND_API_KEY is set correctly
   - Verify domain in Resend dashboard
   - Check console for error messages

2. **Form validation errors**

   - Ensure all required fields are filled
   - Check email format is valid
   - Message must be at least 10 characters

3. **API endpoint not found**
   - Restart the development server
   - Check server routes are properly imported
   - Verify the API endpoint URL

### Contact Form Testing

1. Fill out the contact form
2. Check console logs in demo mode
3. Verify emails arrive in production
4. Test all inquiry types
5. Confirm validation works properly

## Security Considerations

- Form data is validated on both client and server
- Email content is sanitized
- Rate limiting should be implemented for production
- Environment variables keep API keys secure
- No sensitive data is logged
