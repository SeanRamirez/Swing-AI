from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
import tempfile
import shutil
from pathlib import Path
import logging
from typing import Dict, Any

# Import our analysis modules
from services.golf_analyzer import GolfSwingAnalyzer
from models.analysis import SwingAnalysisRequest, SwingAnalysisResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Golf Swing Analysis AI Service",
    description="AI-powered golf swing analysis using MediaPipe and machine learning",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the golf analyzer service
analyzer = GolfSwingAnalyzer()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Golf Swing Analysis AI Service",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "golf-swing-analyzer",
        "version": "1.0.0",
        "ai_model_loaded": analyzer.is_model_loaded()
    }

@app.post("/analyze-swing", response_model=SwingAnalysisResponse)
async def analyze_swing(video_file: UploadFile = File(...)):
    """
    Analyze a golf swing video and return detailed analysis results
    
    Args:
        video_file: Uploaded video file (MP4, MOV, AVI supported)
    
    Returns:
        SwingAnalysisResponse: Detailed analysis with scores and recommendations
    """
    try:
        # Validate file type
        if not video_file.content_type.startswith('video/'):
            raise HTTPException(
                status_code=400, 
                detail="File must be a video (MP4, MOV, AVI, etc.)"
            )
        
        # Validate file size (max 100MB)
        if video_file.size and video_file.size > 100 * 1024 * 1024:
            raise HTTPException(
                status_code=400, 
                detail="File size must be less than 100MB"
            )
        
        logger.info(f"Processing video: {video_file.filename} ({video_file.size} bytes)")
        
        # Save uploaded file to temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=Path(video_file.filename).suffix) as temp_file:
            shutil.copyfileobj(video_file.file, temp_file)
            temp_path = temp_file.name
        
        try:
            # Analyze the swing video
            analysis_result = await analyzer.analyze_swing(temp_path)
            
            logger.info(f"Analysis completed successfully for {video_file.filename}")
            
            return SwingAnalysisResponse(
                success=True,
                message="Swing analysis completed successfully",
                data=analysis_result
            )
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.unlink(temp_path)
                
    except Exception as e:
        logger.error(f"Error analyzing swing: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing video: {str(e)}"
        )

@app.post("/analyze-swing-url")
async def analyze_swing_from_url(request: SwingAnalysisRequest):
    """
    Analyze a golf swing from a video URL
    
    Args:
        request: SwingAnalysisRequest containing video URL
    
    Returns:
        SwingAnalysisResponse: Detailed analysis results
    """
    try:
        logger.info(f"Processing video from URL: {request.video_url}")
        
        # Analyze the swing from URL
        analysis_result = await analyzer.analyze_swing_from_url(request.video_url)
        
        logger.info("Analysis completed successfully from URL")
        
        return SwingAnalysisResponse(
            success=True,
            message="Swing analysis completed successfully",
            data=analysis_result
        )
        
    except Exception as e:
        logger.error(f"Error analyzing swing from URL: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing video URL: {str(e)}"
        )

@app.get("/models")
async def get_model_info():
    """Get information about loaded AI models"""
    return {
        "models": analyzer.get_model_info(),
        "capabilities": [
            "Pose detection using MediaPipe",
            "Form scoring using ML models",
            "Tempo analysis",
            "Power assessment",
            "Accuracy evaluation"
        ]
    }

if __name__ == "__main__":
    # Run the service
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
