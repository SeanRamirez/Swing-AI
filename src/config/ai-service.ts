// AI Service Configuration
export const AI_SERVICE_CONFIG = {
  // Base URL for the AI microservice
  BASE_URL: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8000',
  
  // API Endpoints
  ENDPOINTS: {
    ANALYZE_SWING: '/analyze-swing',
    ANALYZE_SWING_URL: '/analyze-swing-url',
    HEALTH: '/health',
    MODELS: '/models'
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 30000,
  
  // Maximum file size (100MB)
  MAX_FILE_SIZE: 100 * 1024 * 1024,
  
  // Supported video formats
  SUPPORTED_FORMATS: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'],
  
  // File extensions
  SUPPORTED_EXTENSIONS: ['.mp4', '.mov', '.avi', '.mkv']
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${AI_SERVICE_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if AI service is available
export const checkAIServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl(AI_SERVICE_CONFIG.ENDPOINTS.HEALTH), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.status === 'healthy';
    }
    
    return false;
  } catch (error) {
    console.error('AI service health check failed:', error);
    return false;
  }
};
