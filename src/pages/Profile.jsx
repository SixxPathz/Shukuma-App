import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { getUserStats, getUserWorkouts } from '../utils/storageUtils';
import { auth } from '../firebase';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWorkouts, setExpandedWorkouts] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      console.log('Profile: Loading user data for:', user?.uid);
      if (user?.uid) {
        try {
          console.log('Profile: Fetching stats and workouts...');
          const token = await auth?.currentUser?.getIdToken();
          const [userStats, userWorkouts] = await Promise.all([
            getUserStats(user.uid, token),
            getUserWorkouts(user.uid, 5, token)
          ]);
          console.log('Profile: Stats received:', userStats);
          console.log('Profile: Workouts received:', userWorkouts);
          setStats(userStats);
          setWorkouts(userWorkouts);
        } catch (error) {
          console.error('Profile: Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Profile: No user or user.uid found');
        setLoading(false);
      }
    };

    loadUserData();
    const onSaved = () => loadUserData();
    window.addEventListener('workoutSaved', onSaved);
    return () => window.removeEventListener('workoutSaved', onSaved);
  }, [user]);

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    let date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (timestamp.toDate) {
      // Timestamp
      date = timestamp.toDate();
    } else if (timestamp.$date) {
      // handle object with $date (e.g., MongoDB extended JSON), or string dates
      date = new Date(timestamp.$date);
    } else {
      return 'N/A';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    let date;
    if (timestamp instanceof Date) date = timestamp;
    else if (typeof timestamp === 'string') date = new Date(timestamp);
    else if (timestamp.toDate) date = timestamp.toDate();
    else if (timestamp.$date) date = new Date(timestamp.$date);
    else return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const toggleWorkoutDetails = (id) => {
    setExpandedWorkouts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-black p-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="border-2 border-white p-6 rounded-lg bg-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">Your Profile</h2>
              {user && (
                <div className="text-black">
                  <p className="text-lg"><strong>Name:</strong> {user.displayName || 'User'}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              )}
            </div>
            <button 
              onClick={logout} 
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-white text-center py-8">Loading your stats...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="border-2 border-white bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Total Workouts</p>
                <p className="text-3xl font-bold text-black">{stats?.totalWorkouts || 0}</p>
              </div>
              <div className="border-2 border-white bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Total Exercises</p>
                <p className="text-3xl font-bold text-black">{stats?.totalExercises || 0}</p>
              </div>
              <div className="border-2 border-white bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Total Time</p>
                <p className="text-3xl font-bold text-black">{formatDuration(stats?.totalDuration)}</p>
              </div>
              <div className="border-2 border-white bg-white p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-medium">Weekly Streak</p>
                <p className="text-3xl font-bold text-black">{stats?.weeklyStreak || 0}</p>
              </div>
            </div>

            {/* Category Breakdown */}
            {stats?.categoriesCompleted && (
              <div className="border-2 border-white bg-white p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-black mb-4">Category Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats.categoriesCompleted).map(([category, count]) => (
                    <div key={category} className="text-center">
                      <p className="text-2xl font-bold text-black">{count}</p>
                      <p className="text-sm text-gray-600">{category}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Workouts */}
            <div className="border-2 border-white bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold text-black mb-4">Recent Workouts</h3>
              {workouts.length > 0 ? (
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <div key={workout.id} className="border border-gray-300 p-4 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-black">
                            {workout.completedExercises}/{workout.totalExercises} cards flipped
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDuration(workout.totalDuration)} • {formatDate(workout.completedAt || workout.createdAt)}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-black text-white text-xs rounded">
                          {workout.type || 'Random'}
                        </span>
                      </div>
                      {/* Expand details button */}
                      <div className="mt-3">
                        <button
                          onClick={() => toggleWorkoutDetails(workout._id || workout.id)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm"
                        >
                          {expandedWorkouts.includes(workout._id || workout.id) ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                      {expandedWorkouts.includes(workout._id || workout.id) && (
                        <div className="mt-4">
                          <h4 className="font-medium text-black mb-2">Exercises</h4>
                          <ul className="space-y-2">
                            {(workout.exercises || []).map((ex, idx) => (
                              <li key={idx} className="flex items-start justify-between">
                                <div>
                                  <p className="text-black font-medium">{ex.name || ex.exerciseName || ex.cardId}</p>
                                  <p className="text-sm text-gray-600">{ex.category || 'Unknown'} • {ex.difficulty || ex.difficulty}</p>
                                </div>
                                <div className="text-sm text-gray-500">{formatTime(ex.flippedAt || ex.flippedAt)}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No workouts yet. Start your first workout!</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;