import { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  History, 
  Trophy, 
  Edit, 
  Save, 
  X,
  Camera,
  Calendar,
  Target,
  Clock
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalSessions: number;
  bestScore: number;
  averageScore: number;
  handicap: number;
  goals: {
    tempo: number;
    form: number;
    overall: number;
  };
}

interface SwingHistory {
  id: string;
  date: string;
  tempo: number;
  form: number;
  overall: number;
  notes: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [swingHistory, setSwingHistory] = useState<SwingHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      const mockProfile: UserProfile = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/api/placeholder/150/150',
        joinDate: '2023-06-15',
        totalSessions: 45,
        bestScore: 94,
        averageScore: 86,
        handicap: 12,
        goals: {
          tempo: 90,
          form: 95,
          overall: 92
        }
      };

      const mockHistory: SwingHistory[] = [
        {
          id: '1',
          date: '2024-01-15',
          tempo: 85,
          form: 92,
          overall: 88,
          notes: 'Great session, tempo felt consistent'
        },
        {
          id: '2',
          date: '2024-01-14',
          tempo: 78,
          form: 89,
          overall: 83,
          notes: 'Struggled with downswing timing'
        },
        {
          id: '3',
          date: '2024-01-13',
          tempo: 91,
          form: 87,
          overall: 89,
          notes: 'Excellent form, tempo could improve'
        },
        {
          id: '4',
          date: '2024-01-12',
          tempo: 82,
          form: 90,
          overall: 86,
          notes: 'Good overall session'
        },
        {
          id: '5',
          date: '2024-01-11',
          tempo: 88,
          form: 93,
          overall: 90,
          notes: 'Best session this week!'
        }
      ];

      setProfile(mockProfile);
      setSwingHistory(mockHistory);
      setEditForm(mockProfile);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(profile || {});
  };

  const handleSave = () => {
    if (profile) {
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile || {});
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and view swing history</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="h-16 w-16 text-gray-400" />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-golf-600 text-white p-2 rounded-full hover:bg-golf-700 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Profile Info */}
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input-field text-center text-lg font-semibold"
                  />
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field text-center"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="btn-primary flex-1 flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex-1 flex items-center justify-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{profile.name}</h2>
                  <p className="text-gray-600 mb-4">{profile.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(profile.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-golf-600">{profile.totalSessions}</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.bestScore}%</div>
                  <div className="text-sm text-gray-600">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.averageScore}%</div>
                  <div className="text-sm text-gray-600">Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{profile.handicap}</div>
                  <div className="text-sm text-gray-600">Handicap</div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 text-golf-600 mr-2" />
              Monthly Goals
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tempo</span>
                <span className="text-sm font-medium text-blue-600">{profile.goals.tempo}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Form</span>
                <span className="text-sm font-medium text-green-600">{profile.goals.form}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overall</span>
                <span className="text-sm font-medium text-purple-600">{profile.goals.overall}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Swing History */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <History className="h-5 w-5 text-gray-600 mr-2" />
                Swing History
              </h2>
              <button className="btn-secondary">View All</button>
            </div>
            
            <div className="space-y-4">
              {swingHistory.map((swing) => (
                <div key={swing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-golf-500" />
                      <span className="font-medium text-gray-900">
                        {new Date(swing.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Tempo</div>
                        <div className="text-sm font-semibold text-blue-600">{swing.tempo}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Form</div>
                        <div className="text-sm font-semibold text-green-600">{swing.form}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Overall</div>
                        <div className="text-sm font-semibold text-purple-600">{swing.overall}%</div>
                      </div>
                    </div>
                  </div>
                  
                  {swing.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {swing.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Perfect Form</h4>
                    <p className="text-sm text-gray-600">Achieved 95%+ form score</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Tempo Master</h4>
                    <p className="text-sm text-gray-600">Consistent tempo for 5 sessions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
