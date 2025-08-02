# Clerk + Supabase + Vercel Setup Guide

This guide walks you through setting up JayTec E-Voting with Clerk authentication, Supabase database, and Vercel deployment.

## 🔧 Environment Setup

### Required Environment Variables

Create a `.env` file with the following variables:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Resend Email Configuration
RESEND_API_KEY=your-resend-api-key

# Frontend URL (for email links and webhooks)
VITE_FRONTEND_URL=https://your-app.vercel.app
```

## 🎭 Clerk Setup

### 1. Create Clerk Application

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose your preferred sign-in methods (Email, Social, etc.)
4. Copy the publishable key and secret key

### 2. Configure Authentication

In your Clerk dashboard:

1. **Authentication Settings**:
   - Enable email/password authentication
   - Configure social sign-ins if desired
   - Set up email verification

2. **User Profile Settings**:
   - Require first name and last name
   - Optional: Add custom fields if needed

### 3. Set up Webhooks

1. Go to **Webhooks** in Clerk dashboard
2. Create a new webhook endpoint: `https://your-app.vercel.app/api/webhook/clerk`
3. Subscribe to these events:
   - `user.created`
   - `user.updated` 
   - `user.deleted`
4. Copy the webhook secret

## 🗄️ Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key
4. Get your service role key from Settings > API

### 2. Database Schema

Run this SQL in the Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced from Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY, -- This will match Clerk user ID
  email TEXT UNIQUE NOT NULL,
  voter_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT DEFAULT 'voter' CHECK (role IN ('voter', 'admin')),
  is_verified BOOLEAN DEFAULT true, -- Clerk handles verification
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Elections table
CREATE TABLE elections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT false,
  results_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Positions table
CREATE TABLE positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  election_id UUID REFERENCES elections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  max_votes INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  position_id UUID REFERENCES positions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  candidate_id UUID REFERENCES candidates(id),
  position_id UUID REFERENCES positions(id),
  election_id UUID REFERENCES elections(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, position_id, election_id)
);

-- Function to increment vote count
CREATE OR REPLACE FUNCTION increment_vote(candidate_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE candidates
  SET vote_count = vote_count + 1
  WHERE id = candidate_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Everyone can view elections" ON elections FOR SELECT USING (true);
CREATE POLICY "Admins can manage elections" ON elections FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Everyone can view positions" ON positions FOR SELECT USING (true);
CREATE POLICY "Admins can manage positions" ON positions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Everyone can view candidates" ON candidates FOR SELECT USING (true);
CREATE POLICY "Admins can manage candidates" ON candidates FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Users can view own votes" ON votes FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own votes" ON votes FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Admins can view all votes" ON votes FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND role = 'admin')
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_elections_updated_at BEFORE UPDATE ON elections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Configure RLS for Clerk

The RLS policies above assume `auth.uid()` returns the Clerk user ID. You may need to adjust based on your JWT configuration.

## 🚀 Vercel Deployment

### 1. Connect Repository

1. Push your code to GitHub
2. Connect repository to Vercel
3. Vercel will auto-detect the build settings

### 2. Environment Variables

In Vercel dashboard, add all environment variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_live_key
CLERK_SECRET_KEY=sk_live_your_live_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
RESEND_API_KEY=your-resend-api-key
VITE_FRONTEND_URL=https://your-app.vercel.app
```

### 3. Build Configuration

Vercel automatically detects the build settings from the `vercel.json` file:

- **Build Command**: `npm run build` (builds only the client)
- **Output Directory**: `dist/spa`
- **API Functions**: Handled by `api/[...path].ts`
- **Install Command**: `npm install`

### 4. Vercel API Functions

The application uses Vercel's API functions instead of a traditional server:

- **Webhook endpoint**: `https://your-app.vercel.app/api/webhook/clerk`
- **Contact form**: `https://your-app.vercel.app/api/contact`
- **Health check**: `https://your-app.vercel.app/api/health`

All API routes are handled by the `api/[...path].ts` function.

## 📧 Email Verification Flow

### How It Works

1. User signs up via Clerk
2. Clerk sends verification email to user
3. User enters verification code on `/verify-email` page
4. Once verified, Clerk sends webhook to `/api/webhook/clerk`
5. Webhook creates user profile in Supabase
6. User can now access the voting platform

### Verification Features

- **Custom verification page**: `/verify-email` with clean UI
- **Code resend functionality**: Users can request new verification codes
- **Automatic redirects**: Unverified users are redirected to verification page
- **Protected routes**: All voting features require email verification

## 🔄 Webhook Integration

### Webhook Events

- **user.created**: Creates new user in Supabase with voter role
- **user.updated**: Updates user information in Supabase
- **user.deleted**: Removes user from Supabase

### Voter ID Generation

The webhook automatically generates unique voter IDs:
- Format: `V{timestamp}{random}`
- Example: `V123456ABC`

## 👨‍💼 Admin Access

### Making Users Admins

Users are created as voters by default. To make someone an admin:

1. Go to Supabase dashboard
2. Open the `users` table
3. Find the user and change `role` from `voter` to `admin`
4. The user will have admin access on next login

### Admin Capabilities

Admins can:
- Create and manage elections
- Add positions and candidates
- Activate/deactivate elections
- Publish/unpublish results
- Verify voters
- View all votes and analytics

## 🧪 Testing

### Local Development

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start development server: `npm run dev`
4. Test authentication flow
5. Verify webhook integration

### Production Testing

1. Deploy to Vercel
2. Update Clerk webhook URL
3. Test user registration flow
4. Verify Supabase data sync
5. Test admin functionality

## 🔒 Security Considerations

- **Environment Variables**: Never commit secrets to git
- **Webhook Security**: Clerk webhooks are signed and verified
- **RLS Policies**: Supabase enforces row-level security
- **Role-Based Access**: Admin functions are protected
- **Data Validation**: All inputs are validated server-side

## �� Email Configuration

The platform uses Resend for contact form emails. To set up:

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Get API key and add to environment variables
4. Update email addresses in `server/routes/contact.ts`

## 🆘 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL in Clerk dashboard
   - Verify webhook secret matches
   - Check Vercel function logs

2. **User not created in Supabase**
   - Check webhook endpoint logs
   - Verify Supabase service role key
   - Check database permissions

3. **Authentication not working**
   - Verify Clerk publishable key
   - Check environment variables
   - Clear browser cache/cookies

4. **Admin access not working**
   - Check user role in Supabase
   - Verify RLS policies
   - Check authentication state

### Getting Help

- Check Vercel function logs for webhook issues
- Use Supabase logs for database errors
- Clerk dashboard shows authentication events
- Contact support if issues persist

## 🎉 Next Steps

After setup:

1. Create your first admin user
2. Set up initial elections
3. Add candidates and positions
4. Test the voting flow
5. Configure email notifications
6. Customize branding and styling

Your JayTec E-Voting platform is now ready for production use!
