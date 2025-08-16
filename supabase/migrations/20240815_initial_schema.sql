-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create video_uploads table
CREATE TABLE IF NOT EXISTS video_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  duration_seconds INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  analysis_id UUID,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create swing_analyses table
CREATE TABLE IF NOT EXISTS swing_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tempo_score DECIMAL(3,1),
  tempo_breakdown JSONB,
  form_score DECIMAL(3,1),
  form_breakdown JSONB,
  overall_score DECIMAL(3,1),
  key_insights TEXT[],
  recommendations TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
  processing_time INTEGER,
  model_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monthly_reports table
CREATE TABLE IF NOT EXISTS monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  total_swings INTEGER DEFAULT 0,
  average_score DECIMAL(3,1),
  improvement_rate DECIMAL(5,2),
  top_insights TEXT[],
  goals_met INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  notification_preferences JSONB DEFAULT '{}',
  privacy_settings JSONB DEFAULT '{}',
  analysis_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_video_uploads_user_id ON video_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_video_uploads_status ON video_uploads(status);
CREATE INDEX IF NOT EXISTS idx_swing_analyses_user_id ON swing_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_swing_analyses_date ON swing_analyses(date);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_user_id ON monthly_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reports_month_year ON monthly_reports(month_year);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE swing_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own video uploads" ON video_uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own video uploads" ON video_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own video uploads" ON video_uploads FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own swing analyses" ON swing_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own swing analyses" ON swing_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own swing analyses" ON swing_analyses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own monthly reports" ON monthly_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own monthly reports" ON monthly_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
