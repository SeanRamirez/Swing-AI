// User and Profile Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinDate: string;
  handicap?: number;
}

export interface UserProfile extends User {
  totalSessions: number;
  bestScore: number;
  averageScore: number;
  goals: {
    tempo: number;
    form: number;
    overall: number;
  };
}

// Swing Analysis Types
export interface SwingAnalysis {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  date: string;
  tempo: TempoAnalysis;
  form: FormAnalysis;
  overall: number;
  keyInsights: string[];
  recommendations: Recommendation[];
  status: 'processing' | 'completed' | 'error';
  processingTime?: number;
}

export interface TempoAnalysis {
  score: number;
  breakdown: {
    backswing: number;
    downswing: number;
    followThrough: number;
  };
  recommendations: string[];
  timingData?: {
    backswingDuration: number;
    downswingDuration: number;
    followThroughDuration: number;
  };
}

export interface FormAnalysis {
  score: number;
  breakdown: {
    stance: number;
    grip: number;
    alignment: number;
    posture: number;
    ballPosition: number;
    weightDistribution: number;
  };
  recommendations: string[];
  postureData?: {
    spineAngle: number;
    kneeFlex: number;
    armExtension: number;
  };
}

export interface Recommendation {
  id: string;
  category: 'tempo' | 'form' | 'general';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actionable: boolean;
  practiceDrills?: string[];
}

// Progress and Tracking Types
export interface MonthlyReport {
  month: string;
  tempo: number;
  form: number;
  overall: number;
  sessions: number;
  improvement: {
    tempo: number;
    form: number;
    overall: number;
  };
  goals: {
    tempo: number;
    form: number;
    overall: number;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'tempo' | 'form' | 'consistency' | 'milestone';
  date: string;
  icon: string;
  unlocked: boolean;
}

export interface TrendData {
  date: string;
  tempo: number;
  form: number;
  overall: number;
  sessionId: string;
}

// Upload and Video Types
export interface VideoUpload {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  analysisId?: string;
  errorMessage?: string;
}

export interface UploadProgress {
  uploaded: number;
  total: number;
  percentage: number;
  speed: number;
  remainingTime: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// AI Analysis Types
export interface AIAnalysisRequest {
  videoUrl: string;
  userId: string;
  analysisType: 'full' | 'tempo' | 'form';
  priority: 'low' | 'normal' | 'high';
}

export interface AIAnalysisResult {
  analysisId: string;
  tempo: TempoAnalysis;
  form: FormAnalysis;
  overall: number;
  confidence: number;
  processingTime: number;
  modelVersion: string;
  keyInsights: string[];
  recommendations: Recommendation[];
}

// Settings and Configuration Types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    weeklyReport: boolean;
    achievementAlerts: boolean;
  };
  privacy: {
    shareProgress: boolean;
    publicProfile: boolean;
    anonymousStats: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    units: 'metric' | 'imperial';
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current: boolean;
  badge?: number;
}

// Chart and Visualization Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}
