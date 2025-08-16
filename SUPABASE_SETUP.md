# Supabase Setup Guide for Golf Swing Analyzer

## Overview
This guide will help you set up Supabase for your Golf Swing Analyzer application, including database tables, storage buckets, authentication, and Edge Functions.

## Prerequisites
- Supabase CLI installed (`brew install supabase/tap/supabase`)
- A Supabase project created at [supabase.com](https://supabase.com)
- Your project URL and anon key

## Step 1: Environment Variables
Update your `.env` file with your Supabase credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here

# AI Service Configuration
VITE_AI_SERVICE_URL=your_ai_microservice_url
VITE_AI_SERVICE_API_KEY=your_ai_service_api_key
```

**Important**: Replace the dashboard URL with the actual project URL format: `https://your-project-id.supabase.co`

## Step 2: Database Setup

### Option A: Using Supabase Dashboard (Recommended for Production)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/20240815_initial_schema.sql`
   - `supabase/migrations/20240815_storage_buckets.sql`
   - `supabase/migrations/20240815_functions.sql`

### Option B: Using Supabase CLI (Local Development)
```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset

# Stop local Supabase
supabase stop
```

## Step 3: Storage Buckets
The following storage buckets will be created:
- `swing-videos`: Private bucket for video uploads (100MB limit)
- `swing-thumbnails`: Public bucket for video thumbnails (5MB limit)
- `user-avatars`: Public bucket for profile pictures (5MB limit)

## Step 4: Authentication Setup
1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL and redirect URLs
3. Enable email confirmations if desired
4. Set up any OAuth providers (Google, GitHub, etc.)

## Step 5: Edge Functions
Deploy your Edge Function for video processing:

```bash
# Link to your remote project (first time only)
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy process-video

# Set environment variables for the function
supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set AI_SERVICE_URL=your_ai_service_url
supabase secrets set AI_SERVICE_API_KEY=your_ai_service_api_key
```

## Database Schema

### Tables Created:
- **users**: User profiles and authentication
- **video_uploads**: Video file metadata and processing status
- **swing_analyses**: Analysis results and scores
- **monthly_reports**: Progress tracking and insights
- **achievements**: User accomplishments
- **user_settings**: User preferences and settings

### Functions Created:
- **get_monthly_report()**: Generate monthly progress reports
- **get_swing_history()**: Retrieve user's swing analysis history
- **get_progress_trends()**: Track improvement over time
- **trigger_ai_analysis()**: Integration point for AI processing

## Security Features
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure storage policies for file uploads
- JWT-based authentication

## Testing Your Setup
1. Start your React app: `npm run dev`
2. Try to sign up/sign in
3. Test file upload functionality
4. Verify database connections

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check your Supabase project settings and allowed origins
2. **Authentication failures**: Verify your anon key and project URL
3. **Storage upload failures**: Check bucket policies and file size limits
4. **Database connection errors**: Ensure your database is running and accessible

### Getting Help:
- Check Supabase logs in the dashboard
- Use Supabase CLI for local debugging
- Review the [Supabase documentation](https://supabase.com/docs)

## Next Steps
1. Test the basic functionality
2. Set up your AI microservice
3. Configure video processing workflows
4. Add additional features like real-time updates

## Security Notes
- Never commit your `.env` file to version control
- Keep your service role key secure
- Regularly rotate your API keys
- Monitor your Supabase usage and costs
