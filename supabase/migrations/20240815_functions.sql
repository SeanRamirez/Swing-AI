-- Function to get monthly report
CREATE OR REPLACE FUNCTION get_monthly_report(
  user_uuid UUID,
  month_year TEXT
)
RETURNS TABLE (
  total_swings INTEGER,
  average_score DECIMAL(3,1),
  improvement_rate DECIMAL(5,2),
  top_insights TEXT[],
  goals_met INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(sa.id)::INTEGER as total_swings,
    ROUND(AVG(sa.overall_score), 1) as average_score,
    ROUND(
      (AVG(sa.overall_score) - LAG(AVG(sa.overall_score)) OVER (ORDER BY sa.date)) / 
      NULLIF(LAG(AVG(sa.overall_score)) OVER (ORDER BY sa.date), 0) * 100, 2
    ) as improvement_rate,
    ARRAY_AGG(DISTINCT unnest(sa.key_insights)) FILTER (WHERE sa.key_insights IS NOT NULL) as top_insights,
    COUNT(CASE WHEN sa.overall_score >= 8.0 THEN 1 END)::INTEGER as goals_met
  FROM swing_analyses sa
  WHERE sa.user_id = user_uuid 
    AND sa.status = 'completed'
    AND TO_CHAR(sa.date, 'YYYY-MM') = month_year
  GROUP BY sa.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get swing history
CREATE OR REPLACE FUNCTION get_swing_history(
  user_uuid UUID,
  limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  date TIMESTAMP WITH TIME ZONE,
  overall_score DECIMAL(3,1),
  tempo_score DECIMAL(3,1),
  form_score DECIMAL(3,1),
  thumbnail_url TEXT,
  key_insights TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.id,
    sa.date,
    sa.overall_score,
    sa.tempo_score,
    sa.form_score,
    sa.thumbnail_url,
    sa.key_insights
  FROM swing_analyses sa
  WHERE sa.user_id = user_uuid 
    AND sa.status = 'completed'
  ORDER BY sa.date DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get progress trends
CREATE OR REPLACE FUNCTION get_progress_trends(
  user_uuid UUID,
  days_back INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  average_score DECIMAL(3,1),
  swing_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.date::DATE,
    ROUND(AVG(sa.overall_score), 1) as average_score,
    COUNT(sa.id)::INTEGER as swing_count
  FROM swing_analyses sa
  WHERE sa.user_id = user_uuid 
    AND sa.status = 'completed'
    AND sa.date >= NOW() - INTERVAL '1 day' * days_back
  GROUP BY sa.date::DATE
  ORDER BY sa.date::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to trigger AI analysis (placeholder for Edge Function integration)
CREATE OR REPLACE FUNCTION trigger_ai_analysis(
  video_upload_id UUID
)
RETURNS TEXT AS $$
BEGIN
  -- This function will be called by the Edge Function
  -- For now, it just returns a success message
  RETURN 'AI analysis triggered for video upload: ' || video_upload_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
