from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class SwingAnalysisRequest(BaseModel):
    """Request model for analyzing a swing from URL"""
    video_url: str = Field(..., description="URL of the video to analyze")
    analysis_type: Optional[str] = Field("full", description="Type of analysis to perform")
    user_id: Optional[str] = Field(None, description="User ID for tracking")

class SwingMetrics(BaseModel):
    """Detailed swing metrics"""
    backswing_angle: float = Field(..., description="Backswing angle in degrees")
    downswing_speed: float = Field(..., description="Downswing speed (m/s)")
    follow_through: float = Field(..., description="Follow-through angle in degrees")
    hip_rotation: float = Field(..., description="Hip rotation angle in degrees")
    shoulder_alignment: float = Field(..., description="Shoulder alignment angle in degrees")
    weight_transfer: float = Field(..., description="Weight transfer efficiency (0-100)")
    tempo_ratio: float = Field(..., description="Backswing to downswing tempo ratio")

class SwingScores(BaseModel):
    """Individual component scores"""
    form_score: float = Field(..., description="Form score (0-100)")
    tempo_score: float = Field(..., description="Tempo score (0-100)")
    power_score: float = Field(..., description="Power score (0-100)")
    accuracy_score: float = Field(..., description="Accuracy score (0-100)")
    overall_score: float = Field(..., description="Overall composite score (0-100)")

class SwingRecommendations(BaseModel):
    """AI-generated recommendations for improvement"""
    strengths: List[str] = Field(..., description="List of swing strengths")
    areas_for_improvement: List[str] = Field(..., description="Areas that need work")
    specific_recommendations: List[str] = Field(..., description="Specific improvement tips")
    practice_drills: List[str] = Field(..., description="Recommended practice drills")
    priority_level: str = Field(..., description="Priority level: low/medium/high")

class SwingAnalysisData(BaseModel):
    """Complete swing analysis data"""
    # Basic info
    video_filename: str = Field(..., description="Original video filename")
    analysis_timestamp: datetime = Field(..., description="When analysis was performed")
    processing_time: float = Field(..., description="Processing time in seconds")
    
    # Scores
    scores: SwingScores = Field(..., description="All component scores")
    
    # Detailed metrics
    metrics: SwingMetrics = Field(..., description="Detailed swing metrics")
    
    # AI insights
    recommendations: SwingRecommendations = Field(..., description="Improvement recommendations")
    
    # Technical details
    confidence_score: float = Field(..., description="AI confidence in analysis (0-100)")
    frame_count: int = Field(..., description="Number of frames analyzed")
    video_duration: float = Field(..., description="Video duration in seconds")
    
    # Pose detection results
    pose_landmarks: Optional[List[Dict[str, Any]]] = Field(None, description="Key pose landmarks")
    
    # Analysis metadata
    model_version: str = Field(..., description="AI model version used")
    analysis_parameters: Dict[str, Any] = Field(..., description="Parameters used for analysis")

class SwingAnalysisResponse(BaseModel):
    """API response model"""
    success: bool = Field(..., description="Whether the analysis was successful")
    message: str = Field(..., description="Human-readable message")
    data: Optional[SwingAnalysisData] = Field(None, description="Analysis results if successful")
    error: Optional[str] = Field(None, description="Error message if failed")
    request_id: Optional[str] = Field(None, description="Unique request identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")

class BatchAnalysisRequest(BaseModel):
    """Request model for analyzing multiple swings"""
    video_urls: List[str] = Field(..., description="List of video URLs to analyze")
    user_id: Optional[str] = Field(None, description="User ID for tracking")
    priority: Optional[str] = Field("normal", description="Processing priority")

class BatchAnalysisResponse(BaseModel):
    """Response model for batch analysis"""
    success: bool = Field(..., description="Whether batch processing was successful")
    message: str = Field(..., description="Human-readable message")
    results: List[SwingAnalysisData] = Field(..., description="List of analysis results")
    failed_videos: List[str] = Field(..., description="List of videos that failed to process")
    total_processed: int = Field(..., description="Total number of videos processed")
    total_successful: int = Field(..., description="Number of successful analyses")
    processing_time: float = Field(..., description="Total processing time for batch")
