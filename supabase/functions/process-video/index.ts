import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoUploadEvent {
  id: string
  userId: string
  filename: string
  videoUrl: string
  status: string
}

interface AIAnalysisRequest {
  videoUrl: string
  userId: string
  analysisType: 'full' | 'tempo' | 'form'
  priority: 'low' | 'normal' | 'high'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const aiServiceUrl = Deno.env.get('AI_SERVICE_URL')
    const aiServiceApiKey = Deno.env.get('AI_SERVICE_API_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    if (!aiServiceUrl || !aiServiceApiKey) {
      throw new Error('Missing AI service environment variables')
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse the request body
    const { videoUploadEvent }: { videoUploadEvent: VideoUploadEvent } = await req.json()

    if (!videoUploadEvent) {
      throw new Error('Missing video upload event data')
    }

    const { id, userId, filename, videoUrl, status } = videoUploadEvent

    // Update video upload status to 'processing'
    const { error: updateError } = await supabase
      .from('video_uploads')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      throw new Error(`Failed to update video upload status: ${updateError.message}`)
    }

    // Prepare AI analysis request
    const aiRequest: AIAnalysisRequest = {
      videoUrl,
      userId,
      analysisType: 'full',
      priority: 'normal'
    }

    // Call AI microservice for analysis
    const aiResponse = await fetch(`${aiServiceUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiServiceApiKey}`,
        'X-User-ID': userId
      },
      body: JSON.stringify(aiRequest)
    })

    if (!aiResponse.ok) {
      throw new Error(`AI service error: ${aiResponse.statusText}`)
    }

    const aiResult = await aiResponse.json()

    // Create swing analysis record
    const { data: analysisData, error: analysisError } = await supabase
      .from('swing_analyses')
      .insert({
        id: aiResult.analysisId,
        user_id: userId,
        video_url: videoUrl,
        thumbnail_url: aiResult.thumbnailUrl,
        date: new Date().toISOString(),
        tempo_score: aiResult.tempo.score,
        tempo_breakdown: aiResult.tempo.breakdown,
        form_score: aiResult.form.score,
        form_breakdown: aiResult.form.breakdown,
        overall_score: aiResult.overall,
        key_insights: aiResult.keyInsights,
        recommendations: aiResult.recommendations,
        status: 'completed',
        processing_time: aiResult.processingTime,
        model_version: aiResult.modelVersion,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (analysisError) {
      throw new Error(`Failed to create swing analysis: ${analysisError.message}`)
    }

    // Update video upload with analysis ID and completed status
    const { error: finalUpdateError } = await supabase
      .from('video_uploads')
      .update({ 
        status: 'completed',
        analysis_id: aiResult.analysisId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (finalUpdateError) {
      throw new Error(`Failed to finalize video upload: ${finalUpdateError.message}`)
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Video analysis completed successfully',
        data: {
          analysisId: aiResult.analysisId,
          overallScore: aiResult.overall,
          processingTime: aiResult.processingTime
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error processing video:', error)

    // Update video upload status to 'error' if we have the ID
    try {
      const { videoUploadEvent } = await req.json()
      if (videoUploadEvent?.id) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        
        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey)
          
          await supabase
            .from('video_uploads')
            .update({ 
              status: 'error',
              error_message: error.message,
              updated_at: new Date().toISOString()
            })
            .eq('id', videoUploadEvent.id)
        }
      }
    } catch (updateError) {
      console.error('Failed to update error status:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
