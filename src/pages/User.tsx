
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, User as UserIcon, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { firestoreService, UserStats, FirestoreTestResult } from '@/services/firestore';

const User = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentTests, setRecentTests] = useState<(FirestoreTestResult & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, authLoading, navigate]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      console.log('=== Starting user data fetch ===');
      console.log('User ID:', user.uid);
      console.log('User email:', user.email);

      setLoading(true);
      setError(null);
      setDetailedError(null);

      // Fetch user stats
      console.log('Fetching user stats...');
      const userStats = await firestoreService.getUserStats(user.uid);
      console.log('User stats result:', userStats);
      setStats(userStats);

      // Fetch recent tests
      console.log('Fetching recent tests...');
      const tests = await firestoreService.getRecentTests(user.uid, 5);
      console.log('Recent tests result:', tests);
      setRecentTests(tests);

      console.log('=== User data fetch completed successfully ===');
    } catch (error: any) {
      console.error('=== Error fetching user data ===');
      console.error('Error object:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));

      setDetailedError(error);

      // Provide user-friendly error messages
      if (error.code === 'permission-denied') {
        setError('Permission denied: Please check your authentication status and try again.');
      } else if (error.code === 'failed-precondition' || error.message.includes('index')) {
        setError('Database index missing: The required Firestore indexes are not set up. Please contact support.');
      } else if (error.code === 'unavailable') {
        setError('Database temporarily unavailable: Please try again in a few moments.');
      } else {
        setError(`Failed to load user data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading) {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: 'var(--theme-background)' }}
        >
          <div className="animate-spin rounded-full h-32 w-32 border-b-2" style={{ borderColor: 'var(--theme-title)' }}></div>
        </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-typebox)' }}>
        {/* Header */}
        <header className="flex justify-between items-center p-6">
          <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:bg-white/10"
              style={{ color: 'var(--theme-title)' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Type.TMTR
          </Button>

          <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2"
              style={{
                borderColor: 'var(--theme-stats)',
                color: 'var(--theme-typebox)',
                backgroundColor: 'transparent'
              }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* User Info */}
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                  <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                  />
              ) : (
                  <div
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--theme-key-bg)' }}
                  >
                    <UserIcon className="h-8 w-8" style={{ color: 'var(--theme-key-text)' }} />
                  </div>
              )}
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--theme-title)' }}>
                  {user.displayName || 'Anonymous User'}
                </h1>
                <p style={{ color: 'var(--theme-stats)' }}>
                  {user.email}
                </p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
                <Card style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                  <CardContent className="p-4">
                    <p style={{ color: 'var(--theme-title)' }} className="font-semibold">{error}</p>

                    {/* Detailed error for debugging */}
                    {detailedError && (
                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm" style={{ color: 'var(--theme-stats)' }}>
                            Technical Details (for debugging)
                          </summary>
                          <pre className="mt-2 text-xs p-2 bg-black/20 rounded overflow-auto" style={{ color: 'var(--theme-stats)' }}>
                      {JSON.stringify(detailedError, null, 2)}
                    </pre>
                        </details>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                          onClick={fetchUserData}
                          variant="outline"
                          style={{
                            borderColor: 'var(--theme-stats)',
                            color: 'var(--theme-typebox)',
                            backgroundColor: 'transparent'
                          }}
                      >
                        Try Again
                      </Button>

                      <Button
                          onClick={() => console.log('Current user:', user)}
                          variant="outline"
                          style={{
                            borderColor: 'var(--theme-stats)',
                            color: 'var(--theme-typebox)',
                            backgroundColor: 'transparent'
                          }}
                      >
                        Log Debug Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                      <Card key={i} style={{ backgroundColor: 'var(--theme-key-bg)', borderColor: 'var(--theme-stats)' }}>
                        <CardContent className="p-6">
                          <Skeleton className="h-8 w-8 mb-2" />
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-6 w-16" />
                        </CardContent>
                      </Card>
                  ))
              ) : (
                  <>
                    <Card style={{ backgroundColor: 'var(--theme-key-bg)', borderColor: 'var(--theme-stats)' }}>
                      <CardContent className="p-6">
                        <Trophy className="h-8 w-8 mb-2" style={{ color: 'var(--theme-title)' }} />
                        <p className="text-sm" style={{ color: 'var(--theme-stats)' }}>Best WPM</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>
                          {stats?.bestWPM || 0}
                        </p>
                      </CardContent>
                    </Card>

                    <Card style={{ backgroundColor: 'var(--theme-key-bg)', borderColor: 'var(--theme-stats)' }}>
                      <CardContent className="p-6">
                        <TrendingUp className="h-8 w-8 mb-2" style={{ color: 'var(--theme-title)' }} />
                        <p className="text-sm" style={{ color: 'var(--theme-stats)' }}>Average WPM</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>
                          {stats?.averageWPM || 0}
                        </p>
                      </CardContent>
                    </Card>

                    <Card style={{ backgroundColor: 'var(--theme-key-bg)', borderColor: 'var(--theme-stats)' }}>
                      <CardContent className="p-6">
                        <Target className="h-8 w-8 mb-2" style={{ color: 'var(--theme-title)' }} />
                        <p className="text-sm" style={{ color: 'var(--theme-stats)' }}>Average Accuracy</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>
                          {stats?.averageAccuracy || 0}%
                        </p>
                      </CardContent>
                    </Card>

                    <Card style={{ backgroundColor: 'var(--theme-key-bg)', borderColor: 'var(--theme-stats)' }}>
                      <CardContent className="p-6">
                        <Clock className="h-8 w-8 mb-2" style={{ color: 'var(--theme-title)' }} />
                        <p className="text-sm" style={{ color: 'var(--theme-stats)' }}>Tests Completed</p>
                        <p className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>
                          {stats?.totalTests || 0}
                        </p>
                      </CardContent>
                    </Card>
                  </>
              )}
            </div>

            {/* Recent Tests */}
            <Card style={{ backgroundColor: 'var(--theme-key-bg)', borderColor: 'var(--theme-stats)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--theme-title)' }}>Recent Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="flex justify-between items-center p-4 rounded border" style={{ borderColor: 'var(--theme-stats)' }}>
                            <div className="flex gap-4">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-4 w-20" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                          </div>
                      ))}
                    </div>
                ) : recentTests.length > 0 ? (
                    <div className="space-y-4">
                      {recentTests.map((test) => (
                          <div
                              key={test.id}
                              className="flex justify-between items-center p-4 rounded border"
                              style={{ borderColor: 'var(--theme-stats)' }}
                          >
                            <div className="flex gap-6">
                              <div>
                                <span className="text-sm" style={{ color: 'var(--theme-stats)' }}>WPM: </span>
                                <span className="font-semibold" style={{ color: 'var(--theme-title)' }}>{test.wpm}</span>
                              </div>
                              <div>
                                <span className="text-sm" style={{ color: 'var(--theme-stats)' }}>Accuracy: </span>
                                <span className="font-semibold" style={{ color: 'var(--theme-title)' }}>{test.accuracy}%</span>
                              </div>
                              <div>
                                <span className="text-sm" style={{ color: 'var(--theme-stats)' }}>Mode: </span>
                                <span className="font-semibold" style={{ color: 'var(--theme-title)' }}>
                            {test.settings.mode} - {test.settings.duration}{test.settings.mode === 'time' ? 's' : ' words'}
                          </span>
                              </div>
                            </div>
                            <div className="text-sm" style={{ color: 'var(--theme-stats)' }}>
                              {test.createdAt ? new Date(test.createdAt.toDate()).toLocaleDateString() : 'Unknown date'}
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--theme-stats)' }}>
                      {stats?.totalTests === 0 ? 'No tests completed yet. Start typing to see your progress!' : 'No recent tests found.'}
                    </p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
};

export default User;
