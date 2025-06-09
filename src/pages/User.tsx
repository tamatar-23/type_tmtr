import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Clock, Target, Keyboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust import path as needed

interface TestResult {
  id: string;
  timestamp: Timestamp;
  results: {
    wpm: number;
    accuracy: number;
  };
  settings: {
    mode: string;
    difficulty: string;
  };
  totalTime: number;
}

interface UserStats {
  averageWPM: number;
  averageAccuracy: number;
  totalTime: number;
  testCount: number;
  bestWPM: number;
}

const User = () => {
  const { user, loading, signInWithGoogle, signInWithGithub, signOut } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    averageWPM: 0,
    averageAccuracy: 0,
    totalTime: 0,
    testCount: 0,
    bestWPM: 0
  });
  const [recentTests, setRecentTests] = useState<TestResult[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
      fetchRecentTests();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const testResultsRef = collection(db, `users/${user.uid}/testResults`);

      // Get all test results to calculate stats
      const allTestsQuery = query(testResultsRef, orderBy('timestamp', 'desc'));
      const allTestsSnapshot = await getDocs(allTestsQuery);

      if (allTestsSnapshot.empty) {
        setStatsLoading(false);
        return;
      }

      const tests = allTestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TestResult[];

      // Calculate stats
      const totalWPM = tests.reduce((sum, test) => sum + test.results.wpm, 0);
      const totalAccuracy = tests.reduce((sum, test) => sum + test.results.accuracy, 0);
      const totalTime = tests.reduce((sum, test) => sum + test.totalTime, 0);
      const bestWPM = Math.max(...tests.map(test => test.results.wpm));

      setUserStats({
        averageWPM: Math.round(totalWPM / tests.length),
        averageAccuracy: Math.round(totalAccuracy / tests.length),
        totalTime: Math.round(totalTime / 3600), // Convert to hours
        testCount: tests.length,
        bestWPM: bestWPM
      });

      setStatsLoading(false);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setStatsLoading(false);
    }
  };

  const fetchRecentTests = async () => {
    if (!user) return;

    try {
      const testResultsRef = collection(db, `users/${user.uid}/testResults`);

      // Get recent tests using the first composite index: timestamp (desc), results.wpm (desc)
      const recentTestsQuery = query(
          testResultsRef,
          orderBy('timestamp', 'desc'),
          orderBy('results.wpm', 'desc'),
          limit(10)
      );

      const recentTestsSnapshot = await getDocs(recentTestsQuery);
      const tests = recentTestsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TestResult[];

      setRecentTests(tests);
    } catch (error) {
      console.error('Error fetching recent tests:', error);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString();
  };

  const formatTime = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading || statsLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--theme-background)' }}>
          <div className="text-lg" style={{ color: 'var(--theme-stats)' }}>Loading...</div>
        </div>
    );
  }

  if (!user) {
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-typebox)' }}>
          {/* Header */}
          <header className="flex justify-between items-center p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ color: 'var(--theme-stats)' }}>
              <ArrowLeft className="h-4 w-4" />
              Back to Test
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>User Profile</h1>
            <div></div>
          </header>

          {/* Guest Mode Message */}
          <main className="container mx-auto px-6 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(180, 180, 180, 0.1)' }}>
                <Keyboard className="h-12 w-12" style={{ color: 'var(--theme-stats)' }} />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold" style={{ color: 'var(--theme-title)' }}>Guest Mode</h2>
                <p className="text-lg" style={{ color: 'var(--theme-stats)' }}>
                  You're currently using Type.TMTR as a guest. Your test results are not being saved.
                </p>
                <p style={{ color: 'var(--theme-stats)' }}>
                  Create an account to track your progress, view detailed statistics, and see your improvement over time.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" onClick={signInWithGoogle}>
                  Sign Up with Google
                </Button>
                <Button variant="outline" size="lg" onClick={signInWithGithub}>
                  Sign Up with GitHub
                </Button>
              </div>
            </div>
          </main>
        </div>
    );
  }

  // This is shown for logged-in users
  return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-typebox)' }}>
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ color: 'var(--theme-stats)' }}>
            <ArrowLeft className="h-4 w-4" />
            Back to Test
          </Link>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>
            Welcome, {user.displayName}
          </h1>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </header>

        {/* User Stats */}
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-8">
              {user.photoURL && (
                  <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-16 h-16 rounded-full"
                  />
              )}
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>
                  {user.displayName}
                </h2>
                <p style={{ color: 'var(--theme-stats)' }}>{user.email}</p>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--theme-stats)' }}>
                    <TrendingUp className="h-4 w-4" />
                    Average WPM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: 'var(--theme-title)' }}>
                    {userStats.averageWPM}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--theme-stats)' }}>
                    {userStats.testCount > 0 ? `From ${userStats.testCount} tests` : 'No tests yet'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--theme-stats)' }}>
                    <Target className="h-4 w-4" />
                    Average Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: 'var(--theme-title)' }}>
                    {userStats.averageAccuracy}%
                  </div>
                  <div className="text-xs" style={{ color: 'var(--theme-stats)' }}>
                    {userStats.testCount > 0 ? `From ${userStats.testCount} tests` : 'No tests yet'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--theme-stats)' }}>
                    <Clock className="h-4 w-4" />
                    Total Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: 'var(--theme-title)' }}>
                    {userStats.totalTime}h
                  </div>
                  <div className="text-xs" style={{ color: 'var(--theme-stats)' }}>
                    {userStats.testCount} tests completed
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--theme-stats)' }}>
                    <Keyboard className="h-4 w-4" />
                    Best WPM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: 'var(--theme-title)' }}>
                    {userStats.bestWPM}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--theme-stats)' }}>
                    {userStats.testCount > 0 ? 'Personal best' : 'No tests yet'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tests Table */}
            <Card>
              <CardHeader>
                <CardTitle style={{ color: 'var(--theme-title)' }}>Recent Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTests.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4" style={{ color: 'var(--theme-stats)' }}>Date</th>
                          <th className="text-left py-2 px-4" style={{ color: 'var(--theme-stats)' }}>Time</th>
                          <th className="text-left py-2 px-4" style={{ color: 'var(--theme-stats)' }}>WPM</th>
                          <th className="text-left py-2 px-4" style={{ color: 'var(--theme-stats)' }}>Accuracy</th>
                          <th className="text-left py-2 px-4" style={{ color: 'var(--theme-stats)' }}>Mode</th>
                          <th className="text-left py-2 px-4" style={{ color: 'var(--theme-stats)' }}>Duration</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentTests.map((test) => (
                            <tr key={test.id} className="border-b border-opacity-20">
                              <td className="py-2 px-4" style={{ color: 'var(--theme-title)' }}>
                                {formatDate(test.timestamp)}
                              </td>
                              <td className="py-2 px-4" style={{ color: 'var(--theme-title)' }}>
                                {formatTime(test.timestamp)}
                              </td>
                              <td className="py-2 px-4 font-bold" style={{ color: 'var(--theme-title)' }}>
                                {test.results.wpm}
                              </td>
                              <td className="py-2 px-4" style={{ color: 'var(--theme-title)' }}>
                                {test.results.accuracy}%
                              </td>
                              <td className="py-2 px-4" style={{ color: 'var(--theme-title)' }}>
                                {test.settings.mode}
                              </td>
                              <td className="py-2 px-4" style={{ color: 'var(--theme-title)' }}>
                                {test.totalTime}s
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                ) : (
                    <div className="text-center py-8" style={{ color: 'var(--theme-stats)' }}>
                      <Keyboard className="mx-auto h-12 w-12 mb-4" />
                      <p>Your test history will appear here once you complete some tests</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
  );
};

export default User;