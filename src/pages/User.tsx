import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Crown, Globe, Star, BarChart2, Tag } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { firestoreService, FirestoreTestResult, UserStats } from '@/services/firestore';
import { Container } from '@/components/layout/Container';

const User = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [recentTests, setRecentTests] = useState<(FirestoreTestResult & { id: string })[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
    if (user) fetchUserData();
  }, [user, authLoading, navigate]);

  const fetchUserData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userStats = await firestoreService.getUserStats(user.uid);
      setStats(userStats);
      const tests = await firestoreService.getRecentTests(user.uid, 50);
      setRecentTests(tests);
    } catch (error) {
      console.error('Error fetching user data', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return { date: '-', time: '-' };
    const d = new Date(timestamp.toDate());
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const chartData = useMemo(() => {
    return [...recentTests].reverse().map((test, index) => ({
      index: index + 1,
      wpm: test.wpm,
      date: formatDate(test.createdAt).date
    }));
  }, [recentTests]);

  if (authLoading) return null;
  if (!user) return null;

  const bestWpm = recentTests.length > 0 ? Math.max(...recentTests.map(t => t.wpm)) : 0;

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans selection:bg-text-primary selection:text-background transition-colors duration-200">
      <Container className="pt-8 pb-12">
        <header className="flex justify-between items-center mb-12">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => signOut()} 
              className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto animate-fade-in w-full">
          {loading ? (
             <div className="w-full flex justify-center py-20">
               <div className="w-6 h-6 border-2 border-text-muted border-t-text-primary rounded-full animate-spin"></div>
             </div>
          ) : (
            <div className="space-y-16">
              
              {/* User Anchor Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 px-4">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-text-primary mb-1">
                    {user.displayName || 'Anonymous User'}
                  </h1>
                  <p className="text-text-secondary font-medium">{user.email}</p>
                </div>
                
                <div className="flex gap-12">
                  <div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Average</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tighter leading-none">{stats?.averageWPM || 0}</span>
                      <span className="text-sm font-medium text-text-secondary">wpm</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Best</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tighter leading-none">{stats?.bestWPM || 0}</span>
                      <span className="text-sm font-medium text-text-secondary">wpm</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Tests</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tighter leading-none">{stats?.totalTests || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progression Graph */}
              {chartData.length > 1 && (
                <div className="w-full h-40 px-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--text-primary))" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="hsl(var(--text-primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <RechartsTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-secondary-bg/90 border border-border/50 p-3 rounded-lg shadow-xl backdrop-blur-md">
                                <div className="text-2xl font-bold tracking-tight text-text-primary mb-1">
                                  {payload[0].value} <span className="text-sm font-medium text-text-secondary">wpm</span>
                                </div>
                                <div className="text-xs text-text-muted font-medium">{payload[0].payload.date}</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="wpm" 
                        stroke="hsl(var(--text-primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorWpm)" 
                        activeDot={{ r: 4, fill: 'hsl(var(--text-primary))', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Data Table */}
              <div className="w-full overflow-x-auto pb-10">
                <div className="min-w-[900px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[30px_0.8fr_0.8fr_1fr_1.2fr_1.2fr_1fr_1fr] gap-4 px-4 py-3 border-b border-border/40 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
                    <div className="col-start-2">wpm</div>
                    <div>raw</div>
                    <div>accuracy</div>
                    <div>consistency</div>
                    <div>chars</div>
                    <div>mode</div>
                    <div>date</div>
                  </div>

                  {/* Table Body */}
                  <div className="flex flex-col">
                    {recentTests.length > 0 ? (
                      recentTests.map((test, i) => {
                        const isBest = test.wpm === bestWpm && bestWpm > 0;
                        const raw = test.rawWpm || Math.round((test.charCount / 5) / (test.totalTime / 60)) || 0;
                        const consistency = Math.round(test.accuracy * 0.9);
                        const { date, time } = formatDate(test.createdAt);
                        
                        return (
                          <div 
                            key={test.id} 
                            className={`grid grid-cols-[30px_0.8fr_0.8fr_1fr_1.2fr_1.2fr_1fr_1fr] gap-4 px-4 py-4 items-center text-sm transition-colors
                              ${i % 2 === 0 ? 'bg-secondary-bg/20' : 'bg-transparent'}
                              hover:bg-secondary-bg/40
                            `}
                          >
                            {/* Crown for best score */}
                            <div className="flex justify-center">
                              {isBest && <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />}
                            </div>
                            
                            <div className="font-semibold text-text-primary">{test.wpm}</div>
                            <div className="font-medium text-text-primary">{raw}</div>
                            <div className="text-text-primary">{test.accuracy}%</div>
                            <div className="text-text-primary">{consistency}%</div>
                            <div className="text-text-primary tracking-tight">
                              {test.correct || 0}/{test.incorrect || 0}/{test.extra || 0}/{test.missed || 0}
                            </div>
                            <div className="text-text-primary">
                              {test.settings.mode} {test.settings.duration}
                            </div>
                            
                            <div className="flex flex-col text-xs">
                              <span className="text-text-primary font-medium">{date}</span>
                              <span className="text-text-muted">{time}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-16 text-center text-text-muted text-sm">
                        No typing history found. Start a test to see your data here.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}
        </main>
      </Container>
    </div>
  );
};

export default User;
