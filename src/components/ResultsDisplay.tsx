
import { TestResult } from '@/types/typing';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Clock, Zap } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ResultsDisplayProps {
  result: TestResult;
  onRestart: () => void;
}

const chartConfig = {
  wpm: {
    label: "WPM",
    color: "var(--theme-title)",
  },
}

export function ResultsDisplay({ result, onRestart }: ResultsDisplayProps) {
  console.log('ResultsDisplay - WPM History:', result.wpmHistory);
  console.log('ResultsDisplay - Full result:', result);

  const formatTooltipLabel = (value: any) => {
    const timeValue = Number(value);
    return isNaN(timeValue) ? 'Time: 0s' : `Time: ${Math.round(timeValue)}s`;
  };

  const formatTooltipValue = (value: any) => {
    return [`${value}`, 'WPM'];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pt-8">
      {/* Main WPM and Accuracy on left, Graph on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Left side - WPM and Accuracy - smaller space */}
        <div className="flex flex-col justify-center h-full px-2">
          <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-left">
              <div className="text-m font-medium opacity-85 mb-2" style={{ color: 'var(--theme-stats)' }}>
                wpm
              </div>
              <div className="text-7xl font-bold" style={{ color: 'var(--theme-stats)' }}>
                {result.wpm}
              </div>
            </div>
          </div>

          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-left">
              <div className="text-m font-medium opacity-85 mb-2" style={{ color: 'var(--theme-stats)' }}>
                acc
              </div>
              <div className="text-7xl font-bold" style={{ color: 'var(--theme-stats)' }}>
                {result.accuracy}%
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Graph - takes 3 columns for wider display */}
        <div className="lg:col-span-3 animate-fade-in px-2" style={{ animationDelay: '0.3s' }}>
          {result.wpmHistory && result.wpmHistory.length > 1 ? (
            <ChartContainer config={chartConfig} className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.wpmHistory} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="var(--theme-stats)" 
                    opacity={0.3} 
                  />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(value) => `${Math.round(Number(value) || 0)}s`}
                    stroke="var(--theme-stats)"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="var(--theme-stats)"
                    fontSize={12}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={formatTooltipLabel}
                    formatter={formatTooltipValue}
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
            </ChartContainer>
          ) : (
            <div 
              className="h-80 rounded-lg border-2 border-dashed flex items-center justify-center w-full"
              style={{ borderColor: 'var(--theme-stats)', opacity: 0.3 }}
            >
              <div className="text-center" style={{ color: 'var(--theme-stats)' }}>
                <div className="text-lg font-medium mb-2">Performance Graph</div>
                <div className="text-sm opacity-75">Insufficient data</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section - Test info and detailed stats */}
      <div className="space-y-8">
        {/* Test type and detailed stats - Full width grid */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-left w-full">
            <div>
              <div className="text-sm opacity-75 mb-1" style={{ color: 'var(--theme-stats)' }}>
                test type
              </div>
              <div className="font-medium" style={{ color: 'var(--theme-stats)' }}>
                words {result.totalTime}s
              </div>
              <div className="text-sm opacity-75" style={{ color: 'var(--theme-stats)' }}>
                english
              </div>
            </div>

            <div>
              <div className="text-sm opacity-75 mb-1" style={{ color: 'var(--theme-stats)' }}>
                raw
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--theme-stats)' }}>
                {Math.round((result.charCount / 5) / (result.totalTime / 60))}
              </div>
            </div>

            <div>
              <div className="text-sm opacity-75 mb-1" style={{ color: 'var(--theme-stats)' }}>
                characters
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--theme-stats)' }}>
                {result.correct}/{result.incorrect}/{result.missed}/{result.charCount}
              </div>
            </div>

            <div>
              <div className="text-sm opacity-75 mb-1" style={{ color: 'var(--theme-stats)' }}>
                consistency
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--theme-stats)' }}>
                {Math.round(result.accuracy * 0.9)}%
              </div>
            </div>

            <div>
              <div className="text-sm opacity-75 mb-1" style={{ color: 'var(--theme-stats)' }}>
                time
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--theme-stats)' }}>
                {(result.totalTime)}s
              </div>
            </div>
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button onClick={onRestart} size="lg" className="px-8">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
