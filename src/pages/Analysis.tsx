import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Target, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface SwingAnalysis {
  id: string;
  date: string;
  videoUrl: string;
  tempo: {
    score: number;
    breakdown: {
      backswing: number;
      downswing: number;
      followThrough: number;
    };
    recommendations: string[];
  };
  form: {
    score: number;
    breakdown: {
      stance: number;
      grip: number;
      alignment: number;
      posture: number;
    };
    recommendations: string[];
  };
  overall: number;
  keyInsights: string[];
}

const Analysis = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<SwingAnalysis | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analysis data
    setTimeout(() => {
      const mockAnalysis: SwingAnalysis = {
        id: '1',
        date: '2024-01-15',
        videoUrl: '/api/placeholder/video',
        tempo: {
          score: 85,
          breakdown: {
            backswing: 90,
            downswing: 82,
            followThrough: 88
          },
          recommendations: [
            'Your backswing tempo is excellent - maintain this rhythm',
            'Focus on slowing down your downswing for better control',
            'Consider a 3:1 backswing to downswing ratio'
          ]
        },
        form: {
          score: 92,
          breakdown: {
            stance: 95,
            grip: 88,
            alignment: 94,
            posture: 90
          },
          recommendations: [
            'Your stance width is perfect for power and stability',
            'Grip pressure could be slightly lighter for better feel',
            'Excellent alignment with target line',
            'Maintain your current posture throughout the swing'
          ]
        },
        overall: 88,
        keyInsights: [
          'Strong fundamentals with room for tempo improvement',
          'Excellent posture and alignment consistency',
          'Consider working on downswing timing for better accuracy'
        ]
      };
      setCurrentAnalysis(mockAnalysis);
      setIsLoading(false);
    }, 1500);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const resetVideo = () => setCurrentTime(0);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 80) return 'bg-blue-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentAnalysis) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Available</h2>
          <p className="text-gray-600">Upload a swing video to get started with analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Swing Analysis</h1>
        <p className="text-gray-600 mt-2">
          Detailed breakdown of your swing from {currentAnalysis.date}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="mx-auto h-16 w-16 mb-4" />
                  <p className="text-lg">Video Player</p>
                  <p className="text-sm text-gray-300">Your swing video will appear here</p>
                </div>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="flex items-center space-x-2 px-4 py-2 bg-golf-600 text-white rounded-lg hover:bg-golf-700 transition-colors"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  onClick={resetVideo}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                Overall Score: <span className={`font-bold ${getScoreColor(currentAnalysis.overall)}`}>
                  {currentAnalysis.overall}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Sidebar */}
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Score</h3>
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBgColor(currentAnalysis.overall)} mb-3`}>
              <span className={`text-2xl font-bold ${getScoreColor(currentAnalysis.overall)}`}>
                {currentAnalysis.overall}%
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {currentAnalysis.overall >= 90 ? 'Excellent!' : 
               currentAnalysis.overall >= 80 ? 'Good job!' : 
               currentAnalysis.overall >= 70 ? 'Keep practicing!' : 'Room for improvement'}
            </p>
          </div>

          {/* Tempo Analysis */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tempo</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(currentAnalysis.tempo.score)} ${getScoreColor(currentAnalysis.tempo.score)}`}>
                {currentAnalysis.tempo.score}%
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Backswing</span>
                <span className="text-sm font-medium">{currentAnalysis.tempo.breakdown.backswing}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Downswing</span>
                <span className="text-sm font-medium">{currentAnalysis.tempo.breakdown.downswing}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Follow-through</span>
                <span className="text-sm font-medium">{currentAnalysis.tempo.breakdown.followThrough}%</span>
              </div>
            </div>
          </div>

          {/* Form Analysis */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Form</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(currentAnalysis.form.score)} ${getScoreColor(currentAnalysis.form.score)}`}>
                {currentAnalysis.form.score}%
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stance</span>
                <span className="text-sm font-medium">{currentAnalysis.form.breakdown.stance}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Grip</span>
                <span className="text-sm font-medium">{currentAnalysis.form.breakdown.grip}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alignment</span>
                <span className="text-sm font-medium">{currentAnalysis.form.breakdown.alignment}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Posture</span>
                <span className="text-sm font-medium">{currentAnalysis.form.breakdown.posture}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tempo Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            Tempo Recommendations
          </h3>
          <ul className="space-y-3">
            {currentAnalysis.tempo.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 text-green-600 mr-2" />
            Form Recommendations
          </h3>
          <ul className="space-y-3">
            {currentAnalysis.form.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card mt-8 bg-gradient-to-r from-blue-50 to-golf-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentAnalysis.keyInsights.map((insight, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-gray-700 text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
