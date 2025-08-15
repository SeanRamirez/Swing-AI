from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
from loguru import logger
import os
from dotenv import load_dotenv

from .models.analysis import AnalysisRequest, AnalysisResponse
from .services.golf_analyzer import GolfSwingAnalyzer
from .utils.auth import verify_api_key
from .utils.config import settings

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SwingAI Analysis Service",
    description="AI-powered golf swing analysis microservice",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Initialize analyzer
analyzer = GolfSwingAnalyzer()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting SwingAI Analysis Service...")
    try:
        await analyzer.initialize()
        logger.info("Golf Swing Analyzer initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize analyzer: {e}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down SwingAI Analysis Service...")
    await analyzer.cleanup()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SwingAI Analysis Service",
        "version": "1.0.0"
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_swing(
    request: AnalysisRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Analyze a golf swing video and return detailed analysis
    """
    try:
        # Verify API key
        if not verify_api_key(credentials.credentials):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key"
            )
        
        logger.info(f"Starting analysis for user {request.userId}")
        
        # Perform swing analysis
        analysis_result = await analyzer.analyze_swing(
            video_url=request.videoUrl,
            user_id=request.userId,
            analysis_type=request.analysisType,
            priority=request.priority
        )
        
        logger.info(f"Analysis completed for user {request.userId}")
        
        return analysis_result
        
    except Exception as e:
        logger.error(f"Analysis failed for user {request.userId}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@app.post("/analyze/batch")
async def analyze_batch(
    requests: list[AnalysisRequest],
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Analyze multiple golf swing videos in batch
    """
    try:
        # Verify API key
        if not verify_api_key(credentials.credentials):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key"
            )
        
        logger.info(f"Starting batch analysis for {len(requests)} videos")
        
        # Process batch analysis
        results = []
        for request in requests:
            try:
                result = await analyzer.analyze_swing(
                    video_url=request.videoUrl,
                    user_id=request.userId,
                    analysis_type=request.analysisType,
                    priority=request.priority
                )
                results.append(result)
            except Exception as e:
                logger.error(f"Failed to analyze video for user {request.userId}: {e}")
                results.append({
                    "success": False,
                    "error": str(e),
                    "userId": request.userId
                })
        
        return {
            "success": True,
            "results": results,
            "totalProcessed": len(requests),
            "successful": len([r for r in results if r.get("success", False)])
        }
        
    except Exception as e:
        logger.error(f"Batch analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch analysis failed: {str(e)}"
        )

@app.get("/models/status")
async def get_model_status(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Get the status of AI models
    """
    try:
        # Verify API key
        if not verify_api_key(credentials.credentials):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key"
            )
        
        status_info = await analyzer.get_model_status()
        return status_info
        
    except Exception as e:
        logger.error(f"Failed to get model status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get model status: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )
