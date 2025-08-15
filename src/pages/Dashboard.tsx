import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Target, Award, Golf, Calendar } from 'lucide-react';

interface SwingData {
  id: string;
  date: string;
  tempo: number;
  form: number;
  overall: number;
  thumbnail: string;
}

const Dashboard = () => {
  const [recentSwings, setRecentSwings] = useState<SwingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: SwingData[] = [
      {
        id: '1',
        date: '2024-01-15',
        tempo: 85,
        form: 92,
        overall: 88,
        thumbnail: '/api/placeholder/150/100'
      },
      {
        id: '2',
        date: '2024-01-14',
        tempo: 78,
        form: 89,
        overall: 83,
        thumbnail: '/api/placeholder/150/100'
      },
      {
        id: '3',
        date: '2024-01-13',
        tempo: 91,
        form: 87,
        overall: 89,
        thumbnail: '/api/placeholder/150/100'
      }
    ];

    setTimeout(() => {
      setRecentSwings(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const metrics = [
    {
      name: 'Average Tempo',
      value: '84%',
      change: '+2.5%',
      changeType: 'positive',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      name: 'Form Score',
      value: '89%',
      change: '+1.2%',
      changeType: 'positive',
      icon: Target,
      color: 'text-green-600'
    },
    {
      name: 'Overall Rating',
      value: '86%',
      change: '+3.1%',
      changeType: 'positive',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      name: 'Sessions This Month',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your golf swing progress and performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">{metric.change}</span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Swings */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Swings</h2>
          <button className="btn-primary">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentSwings.map((swing) => (
            <div key={swing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Golf className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">{swing.date}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Tempo</p>
                      <p className="text-lg font-semibold text-blue-600">{swing.tempo}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Form</p>
                      <p className="text-lg font-semibold text-green-600">{swing.form}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Overall</p>
                      <p className="text-lg font-semibold text-purple-600">{swing.overall}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-gradient-to-r from-golf-50 to-golf-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Ready for Analysis?</h3>
          <p className="text-gray-600 mb-4">Upload a new swing video to get instant AI-powered feedback</p>
          <button className="btn-primary">Upload Swing</button>
        </div>
        
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">View Progress Report</h3>
          <p className="text-gray-600 mb-4">Check your monthly improvement trends and recommendations</p>
          <button className="btn-primary">View Report</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
