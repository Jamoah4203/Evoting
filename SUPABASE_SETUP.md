# Supabase Setup for JayTec E-Voting

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key

## 2. Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Database Schema

Run these SQL commands in the Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  voter_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT DEFAULT 'voter' CHECK (role IN ('voter', 'admin')),
  is_verified BOOLEAN DEFAULT false,
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
CREATE POLICY "Users can view all users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Everyone can view published elections" ON elections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage elections" ON elections FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Everyone can view positions" ON positions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage positions" ON positions FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Everyone can view candidates" ON candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage candidates" ON candidates FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view own votes" ON votes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own votes" ON votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all votes" ON votes FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
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

## 4. Authentication Setup

1. In Supabase Dashboard → Authentication → Settings
2. Enable email authentication
3. Configure email templates as needed
4. Set up any additional providers if required

## 5. Test the Application

1. Start the development server: `npm run dev`
2. Register a new user account
3. Create elections (as admin) or vote (as voter)
4. View results in real-time

## Features Available

- ✅ User registration (automatically assigned as voters)
- ✅ Email/password authentication with forgot password
- ✅ Role-based access control (admin roles manually assigned)
- ✅ Admin dashboard for election management
- ✅ Voter interface for casting votes
- ✅ Real-time results with charts
- ✅ User verification system
- ✅ Election status management
- ✅ Results publication controls
- ✅ Interactive demo slider on homepage
