import { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  ArrowRight,
  Star,
  Eye,
  Zap
} from 'lucide-react';

interface SwingAnalysis {
  id: string;
  date: string;
  videoUrl: string;
  thumbnail: string;
  overallScore: number;
  formScore: number;
  tempoScore: number;
  powerScore: number;
  accuracyScore: number;
  recommendations: string[];
  strengths: string[];
  areasForImprovement: string[];
  swingMetrics: {
    backswingAngle: number;
    downswingSpeed: number;
    followThrough: number;
    hipRotation: number;
    shoulderAlignment: number;
  };
}

const Analysis = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('latest');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock data - replace with real data from your backend
  const mockAnalysis: SwingAnalysis = {
    id: '1',
    date: '2024-01-15',
    videoUrl: '/sample-swing.mp4', // Replace with actual video URL
    thumbnail: '/sample-thumbnail.jpg',
    overallScore: 87,
    formScore: 92,
    tempoScore: 85,
    powerScore: 78,
    accuracyScore: 89,
    recommendations: [
      'Focus on maintaining hip rotation through impact',
      'Work on consistent tempo in your backswing',
      'Improve shoulder alignment at address'
    ],
    strengths: [
      'Excellent follow-through position',
      'Good weight transfer',
      'Consistent ball contact'
    ],
    areasForImprovement: [
      'Hip rotation timing',
      'Backswing tempo consistency',
      'Address position setup'
    ],
    swingMetrics: {
      backswingAngle: 95,
      downswingSpeed: 78,
      followThrough: 92,
      hipRotation: 75,
      shoulderAlignment: 68
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Star className="w-5 h-5 text-green-600" />;
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-blue-600" />;
    if (score >= 70) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Swing Analysis</h1>
            <p className="text-gray-600 mt-2">
              Detailed breakdown of your golf swing performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Video Player */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Swing Video</h2>
              <p className="text-sm text-gray-500">Recorded on {new Date(mockAnalysis.date).toLocaleDateString()}</p>
            </div>
            
            {/* Video Player */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-96 object-cover"
                poster={mockAnalysis.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source src={mockAnalysis.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  <button className="text-white hover:text-gray-300 transition-colors">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Swing Metrics */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Swing Metrics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(mockAnalysis.swingMetrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{value}°</div>
                  <div className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Analysis Results */}
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{mockAnalysis.overallScore}</div>
              <div className="text-blue-100 mb-4">Overall Score</div>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(mockAnalysis.overallScore / 20)
                        ? 'text-yellow-300'
                        : 'text-blue-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Individual Scores */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Form', score: mockAnalysis.formScore, icon: Target },
                { label: 'Tempo', score: mockAnalysis.tempoScore, icon: Clock },
                { label: 'Power', score: mockAnalysis.powerScore, icon: Zap },
                { label: 'Accuracy', score: mockAnalysis.accuracyScore, icon: Eye }
              ].map(({ label, score, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{label}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
                    {score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {mockAnalysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {mockAnalysis.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">AI Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockAnalysis.recommendations.map((recommendation, index) => (
              <div key={index} className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900">Recommendation {index + 1}</h4>
                </div>
                <p className="text-gray-700">{recommendation}</p>
                <button className="mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                  Learn More <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button className="btn-primary flex items-center gap-2">
          <Target className="w-5 h-5" />
          Practice This Swing
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Track Progress
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share with Coach
        </button>
      </div>
    </div>
  );
};

export default Analysis;
