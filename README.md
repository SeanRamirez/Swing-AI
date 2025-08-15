# 🏌️ SwingAI - Golf Swing Analyzer

An AI-powered golf swing analysis web application that provides instant feedback on tempo, form, and overall swing quality using computer vision and machine learning.

## ✨ Features

- **🎯 Real-time Analysis**: Upload swing videos and get instant AI-powered feedback
- **⏱️ Tempo Analysis**: Analyze swing rhythm, timing, and consistency
- **🎭 Form Check**: Evaluate stance, grip, alignment, and posture
- **📊 Progress Tracking**: Monthly reports and improvement trends
- **🏆 Achievement System**: Track milestones and celebrate progress
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **React Router** for navigation
- **Lucide React** for beautiful icons

### Backend
- **Supabase** for database and authentication
- **Supabase Edge Functions** (TypeScript) for serverless backend
- **Python AI Microservice** for ML/AI processing

### AI/ML Components
- **Computer Vision**: OpenCV and MediaPipe for pose estimation
- **Tempo Analysis**: Custom algorithms for swing timing
- **Form Analysis**: Machine learning models for swing mechanics
- **Real-time Processing**: Optimized for quick analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Supabase account
- Vercel account (for hosting)

### 1. Clone and Setup Frontend

```bash
# Clone the repository
git clone <your-repo-url>
cd golf-swing-analyzer

# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Start development server
npm run dev
```

### 2. Configure Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AI_SERVICE_URL=your_ai_microservice_url
VITE_AI_SERVICE_API_KEY=your_ai_service_api_key
```

### 3. Setup Supabase

1. Create a new Supabase project
2. Run the database migrations (see `supabase/migrations/`)
3. Configure storage buckets for videos and thumbnails
4. Set up Edge Functions

### 4. Deploy AI Microservice

```bash
cd ai-microservice

# Install Python dependencies
pip install -r requirements.txt

# Set environment variables
export AI_SERVICE_API_KEY=your_secret_key
export SUPABASE_URL=your_supabase_url
export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Run the service
python -m app.main
```

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📁 Project Structure

```
golf-swing-analyzer/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utility libraries
│   └── hooks/              # Custom React hooks
├── supabase/
│   └── functions/          # Edge Functions
├── ai-microservice/        # Python AI service
│   ├── app/
│   │   ├── services/       # Core analysis services
│   │   ├── models/         # Data models
│   │   └── utils/          # Utility functions
│   └── requirements.txt
└── README.md
```

## 🔧 Development

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

### AI Service Development

```bash
cd ai-microservice

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Format code
black app/
```

### Supabase Edge Functions

```bash
# Deploy functions
supabase functions deploy process-video

# Test locally
supabase functions serve process-video --env-file .env.local
```

## 🎯 AI Analysis Features

### Tempo Analysis
- **Backswing Timing**: Measures backswing duration and consistency
- **Downswing Rhythm**: Analyzes downswing speed and control
- **Follow-through**: Evaluates completion of swing motion
- **Overall Rhythm**: Calculates tempo consistency score

### Form Analysis
- **Stance**: Evaluates foot positioning and width
- **Grip**: Analyzes hand placement and pressure
- **Alignment**: Checks body alignment with target
- **Posture**: Measures spine angle and balance
- **Ball Position**: Verifies ball placement relative to stance

### Machine Learning Models
- **Pose Estimation**: MediaPipe for body landmark detection
- **Swing Classification**: Custom CNN for swing phase identification
- **Quality Assessment**: Regression models for scoring
- **Recommendation Engine**: Rule-based system for improvement tips

## 📊 Database Schema

### Core Tables
- `users`: User profiles and settings
- `swing_analyses`: Analysis results and scores
- `video_uploads`: Video metadata and processing status
- `monthly_reports`: Progress tracking and trends
- `achievements`: User accomplishments and milestones

### Key Relationships
- Users have many swing analyses
- Each analysis is linked to a video upload
- Monthly reports aggregate analysis data
- Achievements are unlocked based on performance

## 🚀 Deployment

### Frontend (Vercel)
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- CDN distribution for global performance

### AI Microservice
- Deploy to Vercel Serverless Functions
- Or use dedicated Python hosting (Railway, Heroku)
- Configure environment variables for production

### Supabase
- Production database with proper security rules
- Edge Functions deployed and monitored
- Storage buckets configured for video processing

## 🔒 Security

- **API Key Authentication**: Secure communication between services
- **Row Level Security**: Database access control
- **CORS Configuration**: Restricted cross-origin requests
- **Input Validation**: Sanitized video uploads and analysis requests

## 📈 Performance

- **Video Processing**: Optimized for 1080p videos under 100MB
- **Analysis Speed**: Results in under 30 seconds for most videos
- **Caching**: Intelligent caching of analysis results
- **CDN**: Global content delivery for fast loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe** for pose estimation capabilities
- **OpenCV** for computer vision processing
- **Supabase** for backend infrastructure
- **Vercel** for hosting and deployment
- **Tailwind CSS** for beautiful UI components

## 📞 Support

- **Documentation**: [Project Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@swingai.com

---

**Built with ❤️ for golfers everywhere**

*Improve your swing, one analysis at a time.*
