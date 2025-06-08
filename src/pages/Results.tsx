
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TestResult } from '@/types/typing';

const Results = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    console.log('Results page loaded');
    const storedResult = sessionStorage.getItem('lastResult');
    console.log('Stored result:', storedResult);
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        console.log('Parsed result:', parsedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error('Error parsing result:', error);
        navigate('/');
      }
    } else {
      console.log('No stored result found, redirecting to home');
      navigate('/');
    }
  }, [navigate]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-typebox)' }}>
        <div>Loading results...</div>
      </div>
    );
  }

  const retryTest = () => {
    sessionStorage.removeItem('lastResult');
    navigate('/');
  };

  const formatTooltipValue = (value: any) => {
    return [`${value}`, 'WPM'];
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-typebox)' }}>
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <Link to="/" className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>
          Type.TMTR
        </Link>
        <Button onClick={retryTest} variant="outline" className="bg-transparent border-opacity-60 hover:border-opacity-100 transition-opacity" style={{ borderColor: 'var(--theme-stats)', color: 'var(--theme-stats)' }}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </header>

      {/* Results Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Layout - Left side WPM/Accuracy, Right side Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Left side - WPM and Accuracy - full height with larger fonts */}
            <div className="lg:col-span-1 flex flex-col justify-center space-y-8">
              <div className="text-center">
                <div className="text-8xl font-bold mb-2" style={{ color: 'var(--theme-title)' }}>{result.wpm}</div>
                <div className="text-xl" style={{ color: 'var(--theme-stats)' }}>wpm</div>
              </div>
              
              <div className="text-center">
                <div className="text-8xl font-bold mb-2" style={{ color: 'var(--theme-title)' }}>{result.accuracy}%</div>
                <div className="text-xl" style={{ color: 'var(--theme-stats)' }}>acc</div>
              </div>
            </div>

            {/* Right side - WPM Chart */}
            <div className="lg:col-span-3">
              {result.wpmHistory && result.wpmHistory.length > 1 && (
                <div className="rounded-lg p-6 h-full" style={{ backgroundColor: 'rgba(180, 180, 180, 0.05)' }}>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.wpmHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-stats)" opacity={0.3} />
                        <XAxis 
                          dataKey="time" 
                          tickFormatter={(value) => `${Math.round(Number(value) || 0)}s`}
                          stroke="var(--theme-stats)"
                        />
                        <YAxis stroke="var(--theme-stats)" />
                        <Tooltip 
                          formatter={formatTooltipValue}
                          labelStyle={{ display: 'none' }}
                          contentStyle={{ 
                            backgroundColor: 'var(--theme-background)', 
                            border: `1px solid var(--theme-stats)`,
                            borderRadius: '6px',
                            color: 'var(--theme-typebox)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="wpm" 
                          stroke="var(--theme-title)" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: 'var(--theme-title)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Stats - Full width with equal spacing */}
          <div className="w-full mb-12">
            <div className="flex justify-between items-center w-full px-4" style={{ color: 'var(--theme-stats)' }}>
              <div className="text-center flex-1">
                <div className="text-sm mb-1">test type</div>
                <div style={{ color: 'var(--theme-title)' }}>
                  {result.settings.mode === 'time' ? `time ${result.settings.duration}` : `words ${result.settings.duration}`}
                </div>
              </div>
              
              <div className="text-center flex-1">
                <div className="text-sm mb-1">raw</div>
                <div style={{ color: 'var(--theme-title)' }}>{Math.round(result.wpm * 1.2)}</div>
              </div>
              
              <div className="text-center flex-1">
                <div className="text-sm mb-1">characters</div>
                <div style={{ color: 'var(--theme-title)' }}>{result.correct}/{result.incorrect}/{result.missed}/{result.charCount}</div>
              </div>
              
              <div className="text-center flex-1">
                <div className="text-sm mb-1">consistency</div>
                <div style={{ color: 'var(--theme-title)' }}>{Math.round(result.accuracy * 0.9)}%</div>
              </div>
              
              <div className="text-center flex-1">
                <div className="text-sm mb-1">time</div>
                <div style={{ color: 'var(--theme-title)' }}>{Math.round(result.totalTime)}s</div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-center gap-4 mt-12">
            <Button onClick={retryTest} variant="outline" className="bg-transparent border-opacity-60 hover:border-opacity-100 transition-opacity" style={{ borderColor: 'var(--theme-stats)', color: 'var(--theme-stats)' }}>
              Next Test
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
