import { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Calendar, 
  BarChart3, 
  ArrowUp, 
  ArrowDown, 
  Minus,
  Star,
  Trophy,
  Zap,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';

interface MonthlyReport {
  month: string;
  overallScore: number;
  swingCount: number;
  improvement: number;
  topAreas: string[];
  goals: {
    completed: number;
    total: number;
    description: string;
  };
}

interface PerformanceMetric {
  name: string;
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  improvement: number;
}

const Progress = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('6m');

  // Mock data - replace with real data from your backend
  const monthlyReports: MonthlyReport[] = [
    {
      month: 'January 2024',
      overallScore: 87,
      swingCount: 24,
      improvement: 12,
      topAreas: ['Form consistency', 'Tempo control', 'Power generation'],
      goals: { completed: 3, total: 5, description: 'Improve overall swing consistency' }
    },
    {
      month: 'December 2023',
      overallScore: 82,
      swingCount: 18,
      improvement: 8,
      topAreas: ['Address position', 'Backswing timing', 'Follow-through'],
      goals: { completed: 4, total: 5, description: 'Master basic swing fundamentals' }
    },
    {
      month: 'November 2023',
      overallScore: 78,
      swingCount: 15,
      improvement: 5,
      topAreas: ['Grip pressure', 'Stance width', 'Ball contact'],
      goals: { completed: 2, total: 4, description: 'Establish consistent setup routine' }
    }
  ];

  const performanceMetrics: PerformanceMetric[] = [
    { name: 'Overall Score', current: 87, previous: 82, trend: 'up', improvement: 6.1 },
    { name: 'Form Score', current: 92, previous: 88, trend: 'up', improvement: 4.5 },
    { name: 'Tempo Score', current: 85, previous: 90, trend: 'down', improvement: -5.6 },
    { name: 'Power Score', current: 78, previous: 75, trend: 'up', improvement: 4.0 },
    { name: 'Accuracy Score', current: 89, previous: 85, trend: 'up', improvement: 4.7 }
  ];

  const achievements = [
    { name: 'First Analysis', description: 'Completed your first swing analysis', icon: Star, earned: true, date: 'Nov 15, 2023' },
    { name: 'Consistency Master', description: 'Analyzed 10 swings in one month', icon: Trophy, earned: true, date: 'Dec 20, 2023' },
    { name: 'Form Improver', description: 'Improved form score by 15%', icon: TrendingUp, earned: true, date: 'Jan 10, 2024' },
    { name: 'Power Player', description: 'Achieved 90+ power score', icon: Zap, earned: false, date: null },
    { name: 'Accuracy Expert', description: 'Maintained 90+ accuracy for 3 months', icon: Eye, earned: false, date: null }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const currentReport = monthlyReports[selectedMonth];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-gray-600 mt-2">
              Monitor your improvement and track your golf journey
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '3m' | '6m' | '1y')}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Report Card */}
      <div className="card mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Monthly Report</h2>
            <p className="text-blue-100">Your performance overview for {currentReport.month}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
              disabled={selectedMonth === 0}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium">{selectedMonth + 1} of {monthlyReports.length}</span>
            <button
              onClick={() => setSelectedMonth(Math.min(monthlyReports.length - 1, selectedMonth + 1))}
              disabled={selectedMonth === monthlyReports.length - 1}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{currentReport.overallScore}</div>
            <div className="text-blue-100 text-sm">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{currentReport.swingCount}</div>
            <div className="text-blue-100 text-sm">Swings Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1 flex items-center justify-center gap-1">
              {currentReport.improvement > 0 ? '+' : ''}{currentReport.improvement}%
              {currentReport.improvement > 0 ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
            </div>
            <div className="text-blue-100 text-sm">Improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{currentReport.goals.completed}/{currentReport.goals.total}</div>
            <div className="text-blue-100 text-sm">Goals Met</div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-lg font-semibold mb-3">Top Areas of Focus</h3>
          <div className="flex flex-wrap gap-2">
            {currentReport.topAreas.map((area, index) => (
              <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Metrics */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              Performance Trends
            </h3>
            
            <div className="space-y-4">
              {performanceMetrics.map((metric) => (
                <div key={metric.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(metric.trend)}
                    <div>
                      <div className="font-medium text-gray-900">{metric.name}</div>
                      <div className="text-sm text-gray-500">
                        Previous: {metric.previous} | Current: {metric.current}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${getTrendColor(metric.trend)}`}>
                      {metric.improvement > 0 ? '+' : ''}{metric.improvement.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {metric.trend === 'up' ? 'Improved' : metric.trend === 'down' ? 'Declined' : 'Stable'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Chart Placeholder */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Progress chart will be displayed here</p>
                <p className="text-sm text-gray-400">Visualize your improvement journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Current Goals */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-600" />
              Current Goals
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Swing Consistency</h4>
                  <span className="text-sm text-emerald-600 font-medium">
                    {currentReport.goals.completed}/{currentReport.goals.total}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{currentReport.goals.description}</p>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentReport.goals.completed / currentReport.goals.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gray-600" />
              Achievements
            </h3>
            
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  achievement.earned 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      achievement.earned 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <achievement.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </div>
                      <div className={`text-sm ${
                        achievement.earned ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </div>
                      {achievement.earned && (
                        <div className="text-xs text-green-600 mt-1">
                          Earned {achievement.date}
                        </div>
                      )}
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Swings</span>
                <span className="font-semibold text-gray-900">57</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Best Score</span>
                <span className="font-semibold text-gray-900">92</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Streak</span>
                <span className="font-semibold text-gray-900">8 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Improvement</span>
                <span className="font-semibold text-green-600">+3.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button className="btn-primary flex items-center gap-2">
          <Target className="w-5 h-5" />
          Set New Goals
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Report
        </button>
        <button className="btn-secondary flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Progress
        </button>
      </div>
    </div>
  );
};

export default Progress;
