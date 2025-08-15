import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  Clock, 
  Award,
  BarChart3,
  LineChart,
  Download,
  Share2
} from 'lucide-react';

interface MonthlyReport {
  month: string;
  tempo: number;
  form: number;
  overall: number;
  sessions: number;
  improvement: {
    tempo: number;
    form: number;
    overall: number;
  };
}

interface TrendData {
  date: string;
  tempo: number;
  form: number;
  overall: number;
}

const Progress = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReport[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockReports: MonthlyReport[] = [
        {
          month: '2024-01',
          tempo: 84,
          form: 89,
          overall: 86,
          sessions: 12,
          improvement: { tempo: 2.5, form: 1.2, overall: 3.1 }
        },
        {
          month: '2023-12',
          tempo: 81.5,
          form: 87.8,
          overall: 82.9,
          sessions: 10,
          improvement: { tempo: 1.8, form: 0.9, overall: 2.3 }
        },
        {
          month: '2023-11',
          tempo: 79.7,
          form: 86.9,
          overall: 80.6,
          sessions: 8,
          improvement: { tempo: 0.5, form: 0.3, overall: 1.1 }
        }
      ];

      const mockTrends: TrendData[] = [
        { date: '2024-01-01', tempo: 82, form: 88, overall: 85 },
        { date: '2024-01-05', tempo: 83, form: 89, overall: 86 },
        { date: '2024-01-10', tempo: 85, form: 90, overall: 87 },
        { date: '2024-01-15', tempo: 84, form: 89, overall: 86 },
        { date: '2024-01-20', tempo: 86, form: 91, overall: 88 },
        { date: '2024-01-25', tempo: 87, form: 92, overall: 89 }
      ];

      setMonthlyReports(mockReports);
      setTrendData(mockTrends);
      setIsLoading(false);
    }, 1000);
  }, []);

  const currentReport = monthlyReports.find(r => r.month === selectedMonth);

  const getImprovementIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 text-gray-400">—</div>;
  };

  const getImprovementColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600 mt-2">Monitor your improvement over time</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-field w-auto"
          >
            {monthlyReports.map((report) => (
              <option key={report.month} value={report.month}>
                {new Date(report.month + '-01').toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </option>
            ))}
          </select>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Monthly Overview */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Overview</h2>
            
            {currentReport && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {currentReport.tempo}%
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Tempo Score</div>
                  <div className="flex items-center justify-center space-x-1">
                    {getImprovementIcon(currentReport.improvement.tempo)}
                    <span className={`text-sm font-medium ${getImprovementColor(currentReport.improvement.tempo)}`}>
                      {currentReport.improvement.tempo > 0 ? '+' : ''}{currentReport.improvement.tempo}%
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {currentReport.form}%
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Form Score</div>
                  <div className="flex items-center justify-center space-x-1">
                    {getImprovementIcon(currentReport.improvement.form)}
                    <span className={`text-sm font-medium ${getImprovementColor(currentReport.improvement.form)}`}>
                      {currentReport.improvement.form > 0 ? '+' : ''}{currentReport.improvement.form}%
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {currentReport.overall}%
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Overall Score</div>
                  <div className="flex items-center justify-center space-x-1">
                    {getImprovementIcon(currentReport.improvement.overall)}
                    <span className={`text-sm font-medium ${getImprovementColor(currentReport.improvement.overall)}`}>
                      {currentReport.improvement.overall > 0 ? '+' : ''}{currentReport.improvement.overall}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress Trends</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <LineChart className="mx-auto h-12 w-12 mb-4" />
                <p>Progress chart visualization</p>
                <p className="text-sm">Chart component would be integrated here</p>
              </div>
            </div>
          </div>

          {/* Session Summary */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Session Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Total Sessions</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {currentReport?.sessions || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Best Session</span>
                </div>
                <span className="text-lg font-semibold text-green-600">
                  {Math.max(...trendData.map(t => t.overall))}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Improvement Rate</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">
                  +{currentReport?.improvement.overall || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentReport?.sessions || 0} sessions
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Score</span>
                <span className="text-sm font-medium text-gray-900">
                  {currentReport?.overall || 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Best Area</span>
                <span className="text-sm font-medium text-green-600">Form</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Needs Work</span>
                <span className="text-sm font-medium text-orange-600">Tempo</span>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Goals</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Complete 15 sessions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Improve tempo by 3%</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Maintain 90%+ form score</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card bg-gradient-to-r from-golf-50 to-blue-50 border-golf-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 This Month's Focus</h3>
            <p className="text-gray-700 text-sm mb-3">
              Based on your progress, focus on:
            </p>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>• Tempo consistency in downswing</li>
              <li>• Maintaining your excellent form</li>
              <li>• Increasing practice frequency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
