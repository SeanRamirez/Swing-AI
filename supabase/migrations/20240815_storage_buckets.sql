-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('swing-videos', 'swing-videos', false, 104857600, ARRAY['video/mp4', 'video/mov', 'video/avi', 'video/mkv']),
  ('swing-thumbnails', 'swing-thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('user-avatars', 'user-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for swing-videos bucket
CREATE POLICY "Users can upload own videos" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'swing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own videos" ON storage.objects FOR SELECT 
  USING (bucket_id = 'swing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own videos" ON storage.objects FOR UPDATE 
  USING (bucket_id = 'swing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own videos" ON storage.objects FOR DELETE 
  USING (bucket_id = 'swing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for swing-thumbnails bucket
CREATE POLICY "Users can upload own thumbnails" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'swing-thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own thumbnails" ON storage.objects FOR SELECT 
  USING (bucket_id = 'swing-thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own thumbnails" ON storage.objects FOR UPDATE 
  USING (bucket_id = 'swing-thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own thumbnails" ON storage.objects FOR DELETE 
  USING (bucket_id = 'swing-thumbnails' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for user-avatars bucket
CREATE POLICY "Users can upload own avatars" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view all avatars" ON storage.objects FOR SELECT 
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE 
  USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatars" ON storage.objects FOR DELETE 
  USING (bucket_id = 'user-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
