from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from datetime import datetime
import uuid

class AnalysisRequest(BaseModel):
    """Request model for swing analysis"""
    videoUrl: str = Field(..., description="URL of the video to analyze")
    userId: str = Field(..., description="ID of the user requesting analysis")
    analysisType: Literal["full", "tempo", "form"] = Field(
        default="full", 
        description="Type of analysis to perform"
    )
    priority: Literal["low", "normal", "high"] = Field(
        default="normal", 
        description="Priority level for processing"
    )
    
    @validator('videoUrl')
    def validate_video_url(cls, v):
        if not v.startswith(('http://', 'https://')):
            raise ValueError('Video URL must be a valid HTTP/HTTPS URL')
        return v

class TempoBreakdown(BaseModel):
    """Breakdown of tempo analysis"""
    backswing: float = Field(..., ge=0, le=100, description="Backswing tempo score")
    downswing: float = Field(..., ge=0, le=100, description="Downswing tempo score")
    followThrough: float = Field(..., ge=0, le=100, description="Follow-through tempo score")
    
    @property
    def average(self) -> float:
        return (self.backswing + self.downswing + self.followThrough) / 3

class FormBreakdown(BaseModel):
    """Breakdown of form analysis"""
    stance: float = Field(..., ge=0, le=100, description="Stance score")
    grip: float = Field(..., ge=0, le=100, description="Grip score")
    alignment: float = Field(..., ge=0, le=100, description="Alignment score")
    posture: float = Field(..., ge=0, le=100, description="Posture score")
    ballPosition: float = Field(..., ge=0, le=100, description="Ball position score")
    weightDistribution: float = Field(..., ge=0, le=100, description="Weight distribution score")
    
    @property
    def average(self) -> float:
        return sum([
            self.stance, self.grip, self.alignment, 
            self.posture, self.ballPosition, self.weightDistribution
        ]) / 6

class Recommendation(BaseModel):
    """Individual recommendation for improvement"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: Literal["tempo", "form", "general"] = Field(..., description="Category of recommendation")
    priority: Literal["low", "medium", "high"] = Field(..., description="Priority level")
    title: str = Field(..., description="Short title of the recommendation")
    description: str = Field(..., description="Detailed description")
    actionable: bool = Field(..., description="Whether the recommendation is actionable")
    practiceDrills: Optional[List[str]] = Field(default=None, description="Suggested practice drills")

class TempoAnalysis(BaseModel):
    """Complete tempo analysis results"""
    score: float = Field(..., ge=0, le=100, description="Overall tempo score")
    breakdown: TempoBreakdown = Field(..., description="Detailed tempo breakdown")
    recommendations: List[Recommendation] = Field(default_factory=list, description="Tempo-specific recommendations")
    timingData: Optional[dict] = Field(default=None, description="Raw timing measurements")

class FormAnalysis(BaseModel):
    """Complete form analysis results"""
    score: float = Field(..., ge=0, le=100, description="Overall form score")
    breakdown: FormBreakdown = Field(..., description="Detailed form breakdown")
    recommendations: List[Recommendation] = Field(default_factory=list, description="Form-specific recommendations")
    postureData: Optional[dict] = Field(default=None, description="Raw posture measurements")

class AnalysisResponse(BaseModel):
    """Complete analysis response"""
    analysisId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    success: bool = Field(..., description="Whether the analysis was successful")
    tempo: TempoAnalysis = Field(..., description="Tempo analysis results")
    form: FormAnalysis = Field(..., description="Form analysis results")
    overall: float = Field(..., ge=0, le=100, description="Overall combined score")
    confidence: float = Field(..., ge=0, le=100, description="Confidence level of the analysis")
    processingTime: float = Field(..., description="Time taken to process the analysis (seconds)")
    modelVersion: str = Field(..., description="Version of the AI model used")
    keyInsights: List[str] = Field(default_factory=list, description="Key insights from the analysis")
    recommendations: List[Recommendation] = Field(default_factory=list, description="Overall recommendations")
    thumbnailUrl: Optional[str] = Field(default=None, description="URL of generated thumbnail")
    error: Optional[str] = Field(default=None, description="Error message if analysis failed")
    
    @validator('overall')
    def validate_overall_score(cls, v):
        if v < 0 or v > 100:
            raise ValueError('Overall score must be between 0 and 100')
        return v
    
    @property
    def grade(self) -> str:
        """Get letter grade based on overall score"""
        if self.overall >= 90:
            return "A+"
        elif self.overall >= 85:
            return "A"
        elif self.overall >= 80:
            return "A-"
        elif self.overall >= 75:
            return "B+"
        elif self.overall >= 70:
            return "B"
        elif self.overall >= 65:
            return "B-"
        elif self.overall >= 60:
            return "C+"
        elif self.overall >= 55:
            return "C"
        elif self.overall >= 50:
            return "C-"
        else:
            return "F"

class BatchAnalysisRequest(BaseModel):
    """Request model for batch analysis"""
    requests: List[AnalysisRequest] = Field(..., description="List of analysis requests")
    batchId: str = Field(default_factory=lambda: str(uuid.uuid4()), description="Unique batch identifier")

class BatchAnalysisResponse(BaseModel):
    """Response model for batch analysis"""
    batchId: str = Field(..., description="Batch identifier")
    success: bool = Field(..., description="Whether the batch processing was successful")
    results: List[AnalysisResponse] = Field(..., description="Individual analysis results")
    totalProcessed: int = Field(..., description="Total number of videos processed")
    successful: int = Field(..., description="Number of successful analyses")
    failed: int = Field(..., description="Number of failed analyses")
    processingTime: float = Field(..., description="Total time taken for batch processing")
    errors: List[str] = Field(default_factory=list, description="List of error messages")

class ModelStatus(BaseModel):
    """Status information about AI models"""
    tempoModel: dict = Field(..., description="Tempo analysis model status")
    formModel: dict = Field(..., description="Form analysis model status")
    poseModel: dict = Field(..., description="Pose estimation model status")
    overallHealth: Literal["healthy", "degraded", "unhealthy"] = Field(..., description="Overall system health")
    lastUpdated: datetime = Field(..., description="Last time models were updated")
    version: str = Field(..., description="Current model version")
