import { AI_SERVICE_CONFIG, getApiUrl } from '../config/ai-service';

// Types for AI service responses
export interface SwingAnalysisResponse {
  success: boolean;
  message: string;
  data?: SwingAnalysisData;
  error?: string;
  request_id?: string;
  timestamp: string;
}

export interface SwingAnalysisData {
  video_filename: string;
  analysis_timestamp: number;
  processing_time: number;
  scores: {
    form_score: number;
    tempo_score: number;
    power_score: number;
    accuracy_score: number;
    overall_score: number;
  };
  metrics: {
    backswing_angle: number;
    downswing_speed: number;
    follow_through: number;
    hip_rotation: number;
    shoulder_alignment: number;
    weight_transfer: number;
    tempo_ratio: number;
  };
  recommendations: {
    strengths: string[];
    areas_for_improvement: string[];
    specific_recommendations: string[];
    practice_drills: string[];
    priority_level: string;
  };
  confidence_score: number;
  frame_count: number;
  video_duration: number;
  model_version: string;
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  ai_model_loaded: boolean;
}

export interface ModelInfoResponse {
  models: {
    form_model: boolean;
    tempo_model: boolean;
    power_model: boolean;
    accuracy_model: boolean;
    mediapipe_pose: boolean;
  };
  capabilities: string[];
}

// AI Service API class
export class AIService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = AI_SERVICE_CONFIG.BASE_URL;
    this.timeout = AI_SERVICE_CONFIG.TIMEOUT;
  }

  // Analyze swing from uploaded video file
  async analyzeSwing(videoFile: File): Promise<SwingAnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('video_file', videoFile);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(getApiUrl(AI_SERVICE_CONFIG.ENDPOINTS.ANALYZE_SWING), {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: SwingAnalysisResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      return result;

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - analysis is taking longer than expected');
        }
        throw error;
      }
      throw new Error('Unknown error occurred during analysis');
    }
  }

  // Analyze swing from video URL
  async analyzeSwingFromUrl(videoUrl: string): Promise<SwingAnalysisResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(getApiUrl(AI_SERVICE_CONFIG.ENDPOINTS.ANALYZE_SWING_URL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ video_url: videoUrl }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: SwingAnalysisResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      return result;

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - analysis is taking longer than expected');
        }
        throw error;
      }
      throw new Error('Unknown error occurred during analysis');
    }
  }

  // Check AI service health
  async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await fetch(getApiUrl(AI_SERVICE_CONFIG.ENDPOINTS.HEALTH), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      throw new Error('AI service is not available');
    }
  }

  // Get model information
  async getModelInfo(): Promise<ModelInfoResponse> {
    try {
      const response = await fetch(getApiUrl(AI_SERVICE_CONFIG.ENDPOINTS.MODELS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      throw new Error('Failed to get model information');
    }
  }

  // Validate video file
  validateVideoFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > AI_SERVICE_CONFIG.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed (100MB)`
      };
    }

    // Check file type
    if (!AI_SERVICE_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not supported. Please use: ${AI_SERVICE_CONFIG.SUPPORTED_EXTENSIONS.join(', ')}`
      };
    }

    return { isValid: true };
  }
}

// Export singleton instance
export const aiService = new AIService();
