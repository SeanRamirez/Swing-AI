import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar, 
  Play, 
  Upload, 
  BarChart3, 
  ExternalLink,
  BarChart,
  ArrowRight
} from 'lucide-react';

interface SwingData {
  id: string;
  title: string;
  club: string;
  date: string;
  form: number;
  tempo: number;
  thumbnail?: string;
}

const Dashboard = () => {
  const [recentSwings, setRecentSwings] = useState<SwingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: SwingData[] = [
      {
        id: '1',
        title: 'Morning Practice - Driver',
        club: 'driver',
        date: 'Aug 13, 2025 at 10:46 PM',
        form: 82,
        tempo: 78
      },
      {
        id: '2',
        title: 'Iron Practice Session',
        club: 'iron',
        date: 'Aug 13, 2025 at 10:46 PM',
        form: 88,
        tempo: 85
      },
      {
        id: '3',
        title: 'Wedge Short Game',
        club: 'wedge',
        date: 'Aug 13, 2025 at 10:46 PM',
        form: 75,
        tempo: 72
      }
    ];

    setTimeout(() => {
      setRecentSwings(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getClubColor = (club: string) => {
    switch (club) {
      case 'driver': return 'bg-red-100 text-red-800';
      case 'iron': return 'bg-blue-100 text-blue-800';
      case 'wedge': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Golf Dashboard</h1>
          <p className="text-slate-600 mt-2">Track your swing progress and master your technique</p>
        </div>
        <button className="btn-primary mt-4 md:mt-0 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Analyze New Swing
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Swings</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-500">3 this week</p>
            </div>
            <BarChart className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Form</p>
              <p className="text-3xl font-bold text-gray-900">81.7%</p>
              <p className="text-sm text-gray-500">Overall technique</p>
            </div>
            <Target className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tempo Score</p>
              <p className="text-3xl font-bold text-gray-900">78.3%</p>
              <p className="text-sm text-gray-500">3:1</p>
            </div>
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Improvement</p>
              <p className="text-3xl font-bold text-green-600">+12%</p>
              <p className="text-sm text-gray-500">From last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Swings Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Recent Swings</h2>
              </div>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                View All
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentSwings.map((swing) => (
                <div key={swing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <button className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                      <Play className="w-4 h-4 text-white" />
                    </button>
                    <div>
                      <h3 className="font-medium text-gray-900">{swing.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClubColor(swing.club)}`}>
                          {swing.club}
                        </span>
                        <span className="text-sm text-gray-500">{swing.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Form</p>
                      <p className={`font-semibold ${getScoreColor(swing.form)}`}>{swing.form}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tempo</p>
                      <p className={`font-semibold ${getScoreColor(swing.tempo)}`}>{swing.tempo}</p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Upload Swing</p>
                      <p className="text-sm text-gray-500">Get instant AI analysis</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">View Analysis</p>
                      <p className="text-sm text-gray-500">Detailed breakdown</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Progress Report</p>
                      <p className="text-sm text-gray-500">Monthly insights</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>

          {/* Goal This Month */}
          <div className="card bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Goal This Month</h3>
            </div>
            <p className="text-sm opacity-90 mb-3">Target: 20 swing analyses</p>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">3/20</span>
                <span className="text-sm opacity-90">15%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <p className="text-sm opacity-90">Keep practicing to improve your form!</p>
          </div>
        </div>
      </div>

      {/* Performance Trend Section */}
      <div className="mt-8">
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900">Performance Trend</h3>
          </div>
          
          {/* Placeholder for chart - you can add a real chart library later */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Performance chart will be displayed here</p>
              <p className="text-sm text-gray-400">Form and Tempo trends over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
