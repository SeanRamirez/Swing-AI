import asyncio
import time
from typing import Optional, Dict, Any
from loguru import logger
import cv2
import numpy as np
import mediapipe as mp
from moviepy.editor import VideoFileClip
import tempfile
import os

from ..models.analysis import (
    AnalysisRequest, AnalysisResponse, TempoAnalysis, FormAnalysis,
    TempoBreakdown, FormBreakdown, Recommendation
)
from .tempo_analyzer import TempoAnalyzer
from .form_analyzer import FormAnalyzer
from .pose_estimator import PoseEstimator
from .video_processor import VideoProcessor

class GolfSwingAnalyzer:
    """
    Main service that coordinates golf swing analysis
    """
    
    def __init__(self):
        self.tempo_analyzer = TempoAnalyzer()
        self.form_analyzer = FormAnalyzer()
        self.pose_estimator = PoseEstimator()
        self.video_processor = VideoProcessor()
        self.model_version = "1.0.0"
        self.initialized = False
        
    async def initialize(self):
        """Initialize all components"""
        try:
            logger.info("Initializing Golf Swing Analyzer...")
            
            # Initialize components
            await self.tempo_analyzer.initialize()
            await self.form_analyzer.initialize()
            await self.pose_estimator.initialize()
            await self.video_processor.initialize()
            
            self.initialized = True
            logger.info("Golf Swing Analyzer initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Golf Swing Analyzer: {e}")
            raise
    
    async def cleanup(self):
        """Cleanup resources"""
        try:
            await self.tempo_analyzer.cleanup()
            await self.form_analyzer.cleanup()
            await self.pose_estimator.cleanup()
            await self.video_processor.cleanup()
            logger.info("Golf Swing Analyzer cleanup completed")
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
    
    async def analyze_swing(
        self,
        video_url: str,
        user_id: str,
        analysis_type: str = "full",
        priority: str = "normal"
    ) -> AnalysisResponse:
        """
        Analyze a golf swing video and return comprehensive results
        """
        if not self.initialized:
            raise RuntimeError("Analyzer not initialized")
        
        start_time = time.time()
        
        try:
            logger.info(f"Starting analysis for user {user_id}, type: {analysis_type}")
            
            # Download and process video
            video_path = await self.video_processor.download_video(video_url)
            if not video_path:
                raise ValueError("Failed to download video")
            
            # Extract video metadata
            video_info = await self.video_processor.get_video_info(video_path)
            logger.info(f"Video info: {video_info}")
            
            # Generate thumbnail
            thumbnail_path = await self.video_processor.generate_thumbnail(video_path)
            
            # Perform pose estimation
            pose_data = await self.pose_estimator.estimate_pose(video_path)
            if not pose_data:
                raise ValueError("Failed to estimate pose from video")
            
            # Analyze tempo
            tempo_analysis = None
            if analysis_type in ["full", "tempo"]:
                tempo_analysis = await self.tempo_analyzer.analyze_tempo(
                    video_path, pose_data
                )
            
            # Analyze form
            form_analysis = None
            if analysis_type in ["full", "form"]:
                form_analysis = await self.form_analyzer.analyze_form(
                    video_path, pose_data
                )
            
            # Calculate overall score
            overall_score = self._calculate_overall_score(tempo_analysis, form_analysis)
            
            # Generate key insights
            key_insights = self._generate_key_insights(tempo_analysis, form_analysis)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(tempo_analysis, form_analysis)
            
            # Calculate confidence
            confidence = self._calculate_confidence(tempo_analysis, form_analysis)
            
            processing_time = time.time() - start_time
            
            # Create response
            response = AnalysisResponse(
                success=True,
                tempo=tempo_analysis or self._create_default_tempo_analysis(),
                form=form_analysis or self._create_default_form_analysis(),
                overall=overall_score,
                confidence=confidence,
                processingTime=processing_time,
                modelVersion=self.model_version,
                keyInsights=key_insights,
                recommendations=recommendations,
                thumbnailUrl=thumbnail_path if thumbnail_path else None
            )
            
            logger.info(f"Analysis completed for user {user_id} in {processing_time:.2f}s")
            
            # Cleanup temporary files
            await self._cleanup_temp_files([video_path, thumbnail_path])
            
            return response
            
        except Exception as e:
            processing_time = time.time() - start_time
            logger.error(f"Analysis failed for user {user_id}: {e}")
            
            # Cleanup on error
            await self._cleanup_temp_files([video_path, thumbnail_path])
            
            # Return error response
            return AnalysisResponse(
                success=False,
                tempo=self._create_default_tempo_analysis(),
                form=self._create_default_form_analysis(),
                overall=0,
                confidence=0,
                processingTime=processing_time,
                modelVersion=self.model_version,
                keyInsights=[],
                recommendations=[],
                error=str(e)
            )
    
    def _calculate_overall_score(
        self,
        tempo_analysis: Optional[TempoAnalysis],
        form_analysis: Optional[FormAnalysis]
    ) -> float:
        """Calculate overall score from tempo and form analysis"""
        if tempo_analysis and form_analysis:
            # Weighted average: 40% tempo, 60% form
            return (tempo_analysis.score * 0.4) + (form_analysis.score * 0.6)
        elif tempo_analysis:
            return tempo_analysis.score
        elif form_analysis:
            return form_analysis.score
        else:
            return 0.0
    
    def _calculate_confidence(
        self,
        tempo_analysis: Optional[TempoAnalysis],
        form_analysis: Optional[TempoAnalysis]
    ) -> float:
        """Calculate confidence level of the analysis"""
        confidence_scores = []
        
        if tempo_analysis:
            # Base confidence on tempo analysis quality
            confidence_scores.append(min(95, 70 + (tempo_analysis.score * 0.25)))
        
        if form_analysis:
            # Base confidence on form analysis quality
            confidence_scores.append(min(95, 70 + (form_analysis.score * 0.25)))
        
        if not confidence_scores:
            return 50.0
        
        return sum(confidence_scores) / len(confidence_scores)
    
    def _generate_key_insights(
        self,
        tempo_analysis: Optional[TempoAnalysis],
        form_analysis: Optional[FormAnalysis]
    ) -> list[str]:
        """Generate key insights from analysis results"""
        insights = []
        
        if tempo_analysis:
            if tempo_analysis.score >= 90:
                insights.append("Excellent tempo consistency throughout the swing")
            elif tempo_analysis.score >= 80:
                insights.append("Good tempo with room for improvement")
            elif tempo_analysis.score >= 70:
                insights.append("Tempo needs work - focus on rhythm and timing")
            else:
                insights.append("Significant tempo issues - consider professional coaching")
            
            # Add specific tempo insights
            breakdown = tempo_analysis.breakdown
            if breakdown.backswing < breakdown.downswing:
                insights.append("Backswing is faster than downswing - aim for 3:1 ratio")
            if breakdown.followThrough < 80:
                insights.append("Follow-through could be more complete")
        
        if form_analysis:
            if form_analysis.score >= 90:
                insights.append("Outstanding form fundamentals")
            elif form_analysis.score >= 80:
                insights.append("Solid form with minor adjustments needed")
            elif form_analysis.score >= 70:
                insights.append("Form needs attention - focus on basics")
            else:
                insights.append("Form requires significant improvement")
            
            # Add specific form insights
            breakdown = form_analysis.breakdown
            if breakdown.posture < 80:
                insights.append("Posture needs improvement - maintain spine angle")
            if breakdown.alignment < 80:
                insights.append("Alignment could be more precise")
        
        if not insights:
            insights.append("Analysis completed successfully")
        
        return insights[:5]  # Limit to top 5 insights
    
    def _generate_recommendations(
        self,
        tempo_analysis: Optional[TempoAnalysis],
        form_analysis: Optional[FormAnalysis]
    ) -> list[Recommendation]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if tempo_analysis:
            # Add tempo recommendations
            if tempo_analysis.score < 80:
                recommendations.append(Recommendation(
                    category="tempo",
                    priority="high",
                    title="Improve Tempo Consistency",
                    description="Work on maintaining consistent rhythm throughout your swing",
                    actionable=True,
                    practiceDrills=[
                        "Practice with a metronome",
                        "Count your swing phases",
                        "Use tempo training aids"
                    ]
                ))
        
        if form_analysis:
            # Add form recommendations
            if form_analysis.score < 80:
                recommendations.append(Recommendation(
                    category="form",
                    priority="high",
                    title="Focus on Fundamentals",
                    description="Strengthen your basic swing mechanics",
                    actionable=True,
                    practiceDrills=[
                        "Mirror work for posture",
                        "Alignment stick drills",
                        "Slow motion practice swings"
                    ]
                ))
        
        # Add general recommendations
        recommendations.append(Recommendation(
            category="general",
            priority="medium",
            title="Regular Practice",
            description="Consistent practice is key to improvement",
            actionable=True,
            practiceDrills=[
                "Practice 3-4 times per week",
                "Focus on quality over quantity",
                "Record and review your swings"
            ]
        ))
        
        return recommendations
    
    def _create_default_tempo_analysis(self) -> TempoAnalysis:
        """Create default tempo analysis for error cases"""
        return TempoAnalysis(
            score=0,
            breakdown=TempoBreakdown(
                backswing=0,
                downswing=0,
                followThrough=0
            ),
            recommendations=[]
        )
    
    def _create_default_form_analysis(self) -> FormAnalysis:
        """Create default form analysis for error cases"""
        return FormAnalysis(
            score=0,
            breakdown=FormBreakdown(
                stance=0,
                grip=0,
                alignment=0,
                posture=0,
                ballPosition=0,
                weightDistribution=0
            ),
            recommendations=[]
        )
    
    async def _cleanup_temp_files(self, file_paths: list[str]):
        """Clean up temporary files"""
        for file_path in file_paths:
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    logger.debug(f"Cleaned up temporary file: {file_path}")
                except Exception as e:
                    logger.warning(f"Failed to cleanup file {file_path}: {e}")
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get status of all AI models"""
        try:
            tempo_status = await self.tempo_analyzer.get_status()
            form_status = await self.form_analyzer.get_status()
            pose_status = await self.pose_estimator.get_status()
            
            # Determine overall health
            health_scores = [
                tempo_status.get("health", "unknown"),
                form_status.get("health", "unknown"),
                pose_status.get("health", "unknown")
            ]
            
            if all(h == "healthy" for h in health_scores):
                overall_health = "healthy"
            elif any(h == "unhealthy" for h in health_scores):
                overall_health = "unhealthy"
            else:
                overall_health = "degraded"
            
            return {
                "tempoModel": tempo_status,
                "formModel": form_status,
                "poseModel": pose_status,
                "overallHealth": overall_health,
                "lastUpdated": time.time(),
                "version": self.model_version
            }
            
        except Exception as e:
            logger.error(f"Failed to get model status: {e}")
            return {
                "overallHealth": "unhealthy",
                "error": str(e),
                "version": self.model_version
            }
