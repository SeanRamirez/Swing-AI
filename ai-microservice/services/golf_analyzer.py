import cv2
import mediapipe as mp
import numpy as np
import joblib
import os
import logging
import time
from typing import Dict, List, Tuple, Optional, Any
from pathlib import Path
import requests
import tempfile

from models.analysis import (
    SwingAnalysisData, SwingScores, SwingMetrics, 
    SwingRecommendations
)

logger = logging.getLogger(__name__)

class GolfSwingAnalyzer:
    """Main golf swing analysis service using MediaPipe and ML models"""
    
    def __init__(self):
        """Initialize the analyzer with MediaPipe and ML models"""
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=2,
            smooth_landmarks=True,
            enable_segmentation=False,
            smooth_segmentation=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Initialize ML models (placeholder - you'll need to train these)
        self.form_model = None
        self.tempo_model = None
        self.power_model = None
        self.accuracy_model = None
        
        # Load models if they exist
        self._load_models()
        
        logger.info("Golf Swing Analyzer initialized successfully")
    
    def _load_models(self):
        """Load pre-trained ML models"""
        models_dir = Path("models")
        
        try:
            if (models_dir / "form_scorer.pkl").exists():
                self.form_model = joblib.load(models_dir / "form_scorer.pkl")
                logger.info("Form scoring model loaded")
            
            if (models_dir / "tempo_analyzer.pkl").exists():
                self.tempo_model = joblib.load(models_dir / "tempo_analyzer.pkl")
                logger.info("Tempo analysis model loaded")
            
            if (models_dir / "power_assessor.pkl").exists():
                self.power_model = joblib.load(models_dir / "power_assessor.pkl")
                logger.info("Power assessment model loaded")
            
            if (models_dir / "accuracy_evaluator.pkl").exists():
                self.accuracy_model = joblib.load(models_dir / "accuracy_evaluator.pkl")
                logger.info("Accuracy evaluation model loaded")
                
        except Exception as e:
            logger.warning(f"Could not load some models: {e}")
    
    def is_model_loaded(self) -> bool:
        """Check if any ML models are loaded"""
        return any([
            self.form_model, self.tempo_model, 
            self.power_model, self.accuracy_model
        ])
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        return {
            "form_model": self.form_model is not None,
            "tempo_model": self.tempo_model is not None,
            "power_model": self.power_model is not None,
            "accuracy_model": self.accuracy_model is not None,
            "mediapipe_pose": True
        }
    
    async def analyze_swing(self, video_path: str) -> SwingAnalysisData:
        """
        Analyze a golf swing video file
        
        Args:
            video_path: Path to the video file
            
        Returns:
            SwingAnalysisData: Complete analysis results
        """
        start_time = time.time()
        
        try:
            logger.info(f"Starting analysis of {video_path}")
            
            # Extract video information
            video_info = self._get_video_info(video_path)
            
            # Process video frames and extract pose data
            pose_data = self._extract_pose_data(video_path)
            
            # Analyze swing phases
            swing_phases = self._analyze_swing_phases(pose_data)
            
            # Calculate metrics
            metrics = self._calculate_swing_metrics(pose_data, swing_phases)
            
            # Generate scores using ML models
            scores = self._generate_scores(pose_data, metrics)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(scores, metrics)
            
            processing_time = time.time() - start_time
            
            # Create analysis result
            analysis_data = SwingAnalysisData(
                video_filename=Path(video_path).name,
                analysis_timestamp=time.time(),
                processing_time=processing_time,
                scores=scores,
                metrics=metrics,
                recommendations=recommendations,
                confidence_score=self._calculate_confidence(pose_data),
                frame_count=video_info["frame_count"],
                video_duration=video_info["duration"],
                pose_landmarks=pose_data.get("landmarks", []),
                model_version="1.0.0",
                analysis_parameters={
                    "mediapipe_complexity": 2,
                    "min_detection_confidence": 0.5,
                    "min_tracking_confidence": 0.5
                }
            )
            
            logger.info(f"Analysis completed in {processing_time:.2f} seconds")
            return analysis_data
            
        except Exception as e:
            logger.error(f"Error analyzing swing: {e}")
            raise
    
    async def analyze_swing_from_url(self, video_url: str) -> SwingAnalysisData:
        """
        Analyze a golf swing from a video URL
        
        Args:
            video_url: URL of the video to analyze
            
        Returns:
            SwingAnalysisData: Complete analysis results
        """
        try:
            # Download video from URL
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_file:
                response = requests.get(video_url, stream=True)
                response.raise_for_status()
                
                for chunk in response.iter_content(chunk_size=8192):
                    temp_file.write(chunk)
                
                temp_path = temp_file.name
            
            try:
                # Analyze the downloaded video
                return await self.analyze_swing(temp_path)
            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
                    
        except Exception as e:
            logger.error(f"Error downloading/analyzing video from URL: {e}")
            raise
    
    def _get_video_info(self, video_path: str) -> Dict[str, Any]:
        """Extract basic video information"""
        cap = cv2.VideoCapture(video_path)
        
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        duration = frame_count / fps if fps > 0 else 0
        
        cap.release()
        
        return {
            "frame_count": frame_count,
            "fps": fps,
            "duration": duration
        }
    
    def _extract_pose_data(self, video_path: str) -> Dict[str, Any]:
        """Extract pose data from video frames"""
        cap = cv2.VideoCapture(video_path)
        pose_data = {
            "landmarks": [],
            "frame_timestamps": [],
            "confidence_scores": []
        }
        
        frame_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Process frame with MediaPipe
            results = self.pose.process(rgb_frame)
            
            if results.pose_landmarks:
                # Extract landmark coordinates
                landmarks = []
                for landmark in results.pose_landmarks.landmark:
                    landmarks.append({
                        "x": landmark.x,
                        "y": landmark.y,
                        "z": landmark.z,
                        "visibility": landmark.visibility
                    })
                
                pose_data["landmarks"].append(landmarks)
                pose_data["frame_timestamps"].append(frame_count / cap.get(cv2.CAP_PROP_FPS))
                pose_data["confidence_scores"].append(results.pose_landmarks.landmark[0].visibility)
            
            frame_count += 1
        
        cap.release()
        
        logger.info(f"Extracted pose data from {len(pose_data['landmarks'])} frames")
        return pose_data
    
    def _analyze_swing_phases(self, pose_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze different phases of the golf swing"""
        landmarks = pose_data["landmarks"]
        
        if len(landmarks) < 10:
            raise ValueError("Insufficient frames for swing analysis")
        
        # Define key swing phases
        phases = {
            "address": range(0, len(landmarks) // 4),
            "backswing": range(len(landmarks) // 4, len(landmarks) // 2),
            "downswing": range(len(landmarks) // 2, 3 * len(landmarks) // 4),
            "impact": range(3 * len(landmarks) // 4, 4 * len(landmarks) // 5),
            "follow_through": range(4 * len(landmarks) // 5, len(landmarks))
        }
        
        return phases
    
    def _calculate_swing_metrics(self, pose_data: Dict[str, Any], 
                                swing_phases: Dict[str, Any]) -> SwingMetrics:
        """Calculate detailed swing metrics from pose data"""
        landmarks = pose_data["landmarks"]
        
        # Calculate backswing angle (shoulder rotation)
        backswing_angle = self._calculate_backswing_angle(landmarks, swing_phases["backswing"])
        
        # Calculate downswing speed
        downswing_speed = self._calculate_downswing_speed(landmarks, swing_phases["downswing"])
        
        # Calculate follow-through angle
        follow_through = self._calculate_follow_through(landmarks, swing_phases["follow_through"])
        
        # Calculate hip rotation
        hip_rotation = self._calculate_hip_rotation(landmarks, swing_phases["downswing"])
        
        # Calculate shoulder alignment
        shoulder_alignment = self._calculate_shoulder_alignment(landmarks, swing_phases["address"])
        
        # Calculate weight transfer
        weight_transfer = self._calculate_weight_transfer(landmarks, swing_phases)
        
        # Calculate tempo ratio
        tempo_ratio = self._calculate_tempo_ratio(pose_data["frame_timestamps"], swing_phases)
        
        return SwingMetrics(
            backswing_angle=backswing_angle,
            downswing_speed=downswing_speed,
            follow_through=follow_through,
            hip_rotation=hip_rotation,
            shoulder_alignment=shoulder_alignment,
            weight_transfer=weight_transfer,
            tempo_ratio=tempo_ratio
        )
    
    def _calculate_backswing_angle(self, landmarks: List, backswing_range: range) -> float:
        """Calculate backswing angle from shoulder positions"""
        if len(backswing_range) < 2:
            return 0.0
        
        # Get shoulder landmarks (MediaPipe pose indices 11 and 12)
        start_frame = landmarks[backswing_range.start]
        end_frame = landmarks[backswing_range.stop - 1]
        
        # Calculate angle between shoulders and vertical
        # This is a simplified calculation - you'd want more sophisticated geometry
        angle = 45.0  # Placeholder - implement actual calculation
        
        return max(0.0, min(180.0, angle))
    
    def _calculate_downswing_speed(self, landmarks: List, downswing_range: range) -> float:
        """Calculate downswing speed in m/s"""
        if len(downswing_range) < 2:
            return 0.0
        
        # Calculate speed based on hand movement
        # This is a simplified calculation
        speed = 15.0  # Placeholder - implement actual calculation
        
        return max(0.0, speed)
    
    def _calculate_follow_through(self, landmarks: List, follow_through_range: range) -> float:
        """Calculate follow-through angle"""
        if len(follow_through_range) < 2:
            return 0.0
        
        # Calculate follow-through angle
        angle = 60.0  # Placeholder - implement actual calculation
        
        return max(0.0, min(180.0, angle))
    
    def _calculate_hip_rotation(self, landmarks: List, downswing_range: range) -> float:
        """Calculate hip rotation during downswing"""
        if len(downswing_range) < 2:
            return 0.0
        
        # Calculate hip rotation angle
        angle = 75.0  # Placeholder - implement actual calculation
        
        return max(0.0, min(180.0, angle))
    
    def _calculate_shoulder_alignment(self, landmarks: List, address_range: range) -> float:
        """Calculate shoulder alignment at address"""
        if len(address_range) < 1:
            return 0.0
        
        # Calculate shoulder alignment relative to target line
        alignment = 68.0  # Placeholder - implement actual calculation
        
        return max(0.0, min(100.0, alignment))
    
    def _calculate_weight_transfer(self, landmarks: List, swing_phases: Dict[str, Any]) -> float:
        """Calculate weight transfer efficiency"""
        # Analyze weight distribution throughout swing
        efficiency = 75.0  # Placeholder - implement actual calculation
        
        return max(0.0, min(100.0, efficiency))
    
    def _calculate_tempo_ratio(self, timestamps: List[float], 
                              swing_phases: Dict[str, Any]) -> float:
        """Calculate backswing to downswing tempo ratio"""
        if len(timestamps) < 2:
            return 1.0
        
        # Calculate tempo ratio (ideal is around 3:1)
        ratio = 2.8  # Placeholder - implement actual calculation
        
        return max(0.5, min(5.0, ratio))
    
    def _generate_scores(self, pose_data: Dict[str, Any], 
                        metrics: SwingMetrics) -> SwingScores:
        """Generate scores using ML models or rule-based logic"""
        # If ML models are available, use them
        if self.form_model:
            form_score = self._predict_form_score(pose_data, metrics)
        else:
            form_score = self._rule_based_form_score(metrics)
        
        if self.tempo_model:
            tempo_score = self._predict_tempo_score(pose_data, metrics)
        else:
            tempo_score = self._rule_based_tempo_score(metrics)
        
        if self.power_model:
            power_score = self._predict_power_score(pose_data, metrics)
        else:
            power_score = self._rule_based_power_score(metrics)
        
        if self.accuracy_model:
            accuracy_score = self._predict_accuracy_score(pose_data, metrics)
        else:
            accuracy_score = self._rule_based_accuracy_score(metrics)
        
        # Calculate overall score
        overall_score = (form_score + tempo_score + power_score + accuracy_score) / 4
        
        return SwingScores(
            form_score=form_score,
            tempo_score=tempo_score,
            power_score=power_score,
            accuracy_score=accuracy_score,
            overall_score=overall_score
        )
    
    def _rule_based_form_score(self, metrics: SwingMetrics) -> float:
        """Rule-based form scoring when ML model is not available"""
        score = 70.0  # Base score
        
        # Adjust based on metrics
        if metrics.shoulder_alignment > 80:
            score += 10
        if metrics.hip_rotation > 70:
            score += 10
        if metrics.weight_transfer > 80:
            score += 10
        
        return min(100.0, score)
    
    def _rule_based_tempo_score(self, metrics: SwingMetrics) -> float:
        """Rule-based tempo scoring"""
        score = 70.0
        
        # Ideal tempo ratio is around 3:1
        if 2.5 <= metrics.tempo_ratio <= 3.5:
            score += 20
        elif 2.0 <= metrics.tempo_ratio <= 4.0:
            score += 10
        
        return min(100.0, score)
    
    def _rule_based_power_score(self, metrics: SwingMetrics) -> float:
        """Rule-based power scoring"""
        score = 70.0
        
        if metrics.downswing_speed > 20:
            score += 15
        if metrics.hip_rotation > 80:
            score += 15
        
        return min(100.0, score)
    
    def _rule_based_accuracy_score(self, metrics: SwingMetrics) -> float:
        """Rule-based accuracy scoring"""
        score = 70.0
        
        if metrics.shoulder_alignment > 85:
            score += 15
        if metrics.weight_transfer > 85:
            score += 15
        
        return min(100.0, score)
    
    def _predict_form_score(self, pose_data: Dict[str, Any], 
                           metrics: SwingMetrics) -> float:
        """Predict form score using ML model"""
        # This would use your trained model
        # For now, return rule-based score
        return self._rule_based_form_score(metrics)
    
    def _predict_tempo_score(self, pose_data: Dict[str, Any], 
                            metrics: SwingMetrics) -> float:
        """Predict tempo score using ML model"""
        return self._rule_based_tempo_score(metrics)
    
    def _predict_power_score(self, pose_data: Dict[str, Any], 
                            metrics: SwingMetrics) -> float:
        """Predict power score using ML model"""
        return self._rule_based_power_score(metrics)
    
    def _predict_accuracy_score(self, pose_data: Dict[str, Any], 
                               metrics: SwingMetrics) -> float:
        """Predict accuracy score using ML model"""
        return self._rule_based_accuracy_score(metrics)
    
    def _generate_recommendations(self, scores: SwingScores, 
                                 metrics: SwingMetrics) -> SwingRecommendations:
        """Generate AI-powered recommendations for improvement"""
        strengths = []
        areas_for_improvement = []
        specific_recommendations = []
        practice_drills = []
        
        # Analyze strengths
        if scores.form_score > 85:
            strengths.append("Excellent form fundamentals")
        if scores.tempo_score > 85:
            strengths.append("Good tempo control")
        if scores.power_score > 85:
            strengths.append("Strong power generation")
        if scores.accuracy_score > 85:
            strengths.append("Consistent accuracy")
        
        # Identify areas for improvement
        if scores.form_score < 80:
            areas_for_improvement.append("Form consistency")
            specific_recommendations.append("Focus on maintaining proper posture throughout swing")
            practice_drills.append("Mirror work for posture awareness")
        
        if scores.tempo_score < 80:
            areas_for_improvement.append("Tempo control")
            specific_recommendations.append("Work on 3:1 backswing to downswing ratio")
            practice_drills.append("Metronome practice with slow motion swings")
        
        if scores.power_score < 80:
            areas_for_improvement.append("Power generation")
            specific_recommendations.append("Improve hip rotation and weight transfer")
            practice_drills.append("Medicine ball throws for power development")
        
        if scores.accuracy_score < 80:
            areas_for_improvement.append("Accuracy and consistency")
            specific_recommendations.append("Focus on shoulder alignment and target awareness")
            practice_drills.append("Alignment stick drills")
        
        # Determine priority level
        lowest_score = min(scores.form_score, scores.tempo_score, 
                          scores.power_score, scores.accuracy_score)
        
        if lowest_score < 70:
            priority_level = "high"
        elif lowest_score < 80:
            priority_level = "medium"
        else:
            priority_level = "low"
        
        return SwingRecommendations(
            strengths=strengths if strengths else ["Good overall technique"],
            areas_for_improvement=areas_for_improvement,
            specific_recommendations=specific_recommendations,
            practice_drills=practice_drills,
            priority_level=priority_level
        )
    
    def _calculate_confidence(self, pose_data: Dict[str, Any]) -> float:
        """Calculate confidence score for the analysis"""
        if not pose_data["confidence_scores"]:
            return 0.0
        
        # Average confidence across frames
        avg_confidence = np.mean(pose_data["confidence_scores"])
        
        # Convert to 0-100 scale
        confidence_score = avg_confidence * 100
        
        return max(0.0, min(100.0, confidence_score))
