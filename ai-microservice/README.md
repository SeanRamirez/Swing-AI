# 🏌️‍♂️ Golf Swing Analysis AI Microservice

A **FastAPI-based microservice** that provides AI-powered golf swing analysis using **MediaPipe** for pose detection and **machine learning models** for scoring.

## 🚀 **Features**

- **🎥 Video Processing**: Accepts video uploads and URLs
- **🧍 Pose Detection**: Uses MediaPipe for accurate body landmark detection
- **🤖 AI Analysis**: ML-powered scoring for form, tempo, power, and accuracy
- **📊 Detailed Metrics**: Comprehensive swing analysis with specific measurements
- **💡 Smart Recommendations**: AI-generated improvement suggestions
- **🔌 RESTful API**: Clean, documented API endpoints
- **📈 Performance Tracking**: Processing time and confidence scoring

## 🏗️ **Architecture**

```
Frontend (React) ←→ AI Microservice ←→ ML Models
     ↓                    ↓              ↓
  UI/UX              FastAPI API    MediaPipe + Scikit-learn
```

## 🛠️ **Technology Stack**

- **Framework**: FastAPI (Python)
- **Pose Detection**: MediaPipe
- **Computer Vision**: OpenCV
- **Machine Learning**: Scikit-learn, Joblib
- **Data Validation**: Pydantic
- **Server**: Uvicorn

## 📋 **Prerequisites**

- Python 3.8+
- FFmpeg (for video processing)
- Sufficient RAM for video processing (4GB+ recommended)

## 🚀 **Quick Start**

### 1. **Clone and Setup**

```bash
# Navigate to the AI microservice directory
cd ai-microservice

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. **Run the Service**

```bash
# Start the development server
python main.py

# Or use uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. **Access the API**

- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **API Root**: http://localhost:8000/

## 📚 **API Endpoints**

### **Core Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check and service info |
| `GET` | `/health` | Detailed health status |
| `POST` | `/analyze-swing` | Analyze uploaded video file |
| `POST` | `/analyze-swing-url` | Analyze video from URL |
| `GET` | `/models` | Get model information |

### **Request Examples**

#### **Upload Video File**
```bash
curl -X POST "http://localhost:8000/analyze-swing" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "video_file=@your_swing.mp4"
```

#### **Analyze from URL**
```bash
curl -X POST "http://localhost:8000/analyze-swing-url" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"video_url": "https://example.com/swing.mp4"}'
```

## 🔧 **Configuration**

### **Environment Variables**

Create a `.env` file in the `ai-microservice` directory:

```env
# Service Configuration
PORT=8000
HOST=0.0.0.0
DEBUG=true

# MediaPipe Configuration
MEDIAPIPE_COMPLEXITY=2
MIN_DETECTION_CONFIDENCE=0.5
MIN_TRACKING_CONFIDENCE=0.5

# Model Configuration
MODELS_DIR=models
```

### **MediaPipe Settings**

Adjust pose detection parameters in `services/golf_analyzer.py`:

```python
self.pose = self.mp_pose.Pose(
    static_image_mode=False,
    model_complexity=2,  # 0, 1, or 2 (higher = more accurate, slower)
    smooth_landmarks=True,
    min_detection_confidence=0.5,  # Lower = more detections, less accurate
    min_tracking_confidence=0.5    # Lower = more tracking, less stable
)
```

## 🤖 **Machine Learning Models**

### **Model Structure**

The service expects ML models in the `models/` directory:

```
models/
├── form_scorer.pkl      # Form scoring model
├── tempo_analyzer.pkl   # Tempo analysis model
├── power_assessor.pkl   # Power assessment model
└── accuracy_evaluator.pkl # Accuracy evaluation model
```

### **Training Your Own Models**

1. **Collect Data**: Gather golf swing videos with expert ratings
2. **Extract Features**: Use MediaPipe to extract pose landmarks
3. **Train Models**: Use Scikit-learn to train scoring models
4. **Save Models**: Export as `.pkl` files using Joblib

### **Example Training Script**

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib

# Load your training data
X = pose_features  # MediaPipe landmarks
y = expert_scores  # Expert ratings

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestRegressor(n_estimators=100)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'models/form_scorer.pkl')
```

## 📊 **Response Format**

### **Successful Analysis Response**

```json
{
  "success": true,
  "message": "Swing analysis completed successfully",
  "data": {
    "video_filename": "swing.mp4",
    "analysis_timestamp": 1703123456.789,
    "processing_time": 2.45,
    "scores": {
      "form_score": 87.5,
      "tempo_score": 82.3,
      "power_score": 78.9,
      "accuracy_score": 91.2,
      "overall_score": 84.98
    },
    "metrics": {
      "backswing_angle": 95.2,
      "downswing_speed": 18.7,
      "follow_through": 88.1,
      "hip_rotation": 76.3,
      "shoulder_alignment": 72.8,
      "weight_transfer": 79.5,
      "tempo_ratio": 2.9
    },
    "recommendations": {
      "strengths": ["Excellent follow-through", "Good weight transfer"],
      "areas_for_improvement": ["Shoulder alignment", "Hip rotation timing"],
      "specific_recommendations": ["Focus on shoulder alignment at address"],
      "practice_drills": ["Alignment stick drills"],
      "priority_level": "medium"
    },
    "confidence_score": 89.2,
    "frame_count": 150,
    "video_duration": 5.0,
    "model_version": "1.0.0"
  }
}
```

## 🚀 **Deployment**

### **Local Development**

```bash
python main.py
```

### **Production with Gunicorn**

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### **Docker Deployment**

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Cloud Deployment**

- **Vercel**: Use Vercel Python runtime
- **AWS Lambda**: Package with dependencies
- **Google Cloud Run**: Containerized deployment
- **Heroku**: Standard Python deployment

## 🔍 **Troubleshooting**

### **Common Issues**

1. **MediaPipe Installation**
   ```bash
   # If you get MediaPipe installation errors
   pip install mediapipe --upgrade
   ```

2. **OpenCV Issues**
   ```bash
   # Alternative OpenCV installation
   pip uninstall opencv-python
   pip install opencv-python-headless
   ```

3. **Memory Issues**
   - Reduce video resolution
   - Lower MediaPipe complexity
   - Process videos in smaller chunks

### **Performance Optimization**

- **Batch Processing**: Process multiple videos simultaneously
- **Video Compression**: Reduce file sizes before analysis
- **Model Optimization**: Use quantized models for faster inference
- **Caching**: Cache analysis results for repeated videos

## 🤝 **Integration with Frontend**

### **Frontend API Call Example**

```typescript
const analyzeSwing = async (videoFile: File) => {
  const formData = new FormData();
  formData.append('video_file', videoFile);
  
  const response = await fetch('http://localhost:8000/analyze-swing', {
    method: 'POST',
    body: formData,
  });
  
  const result = await response.json();
  return result;
};
```

### **Error Handling**

```typescript
try {
  const result = await analyzeSwing(videoFile);
  if (result.success) {
    // Handle successful analysis
    console.log(result.data);
  } else {
    // Handle error
    console.error(result.error);
  }
} catch (error) {
  console.error('Analysis failed:', error);
}
```

## 📈 **Future Enhancements**

- **Real-time Analysis**: Live video stream processing
- **Advanced Metrics**: Club head speed, ball flight analysis
- **Comparative Analysis**: Compare swings over time
- **Coach Integration**: Share results with golf instructors
- **Mobile Optimization**: Lightweight models for mobile devices

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 **Support**

For questions and support:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the troubleshooting section

---

**Happy Golfing! 🏌️‍♂️⛳**
