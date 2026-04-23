import { TestResult } from '@/types/typing';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ResultsDisplayProps {
  result: TestResult;
  onRestart: () => void;
}

const chartConfig = {
  wpm: {
    label: "Net WPM",
    color: "hsl(var(--text-primary))",
  },
  rawWpm: {
    label: "Raw WPM",
    color: "hsl(var(--text-muted))",
  },
  hasError: {
    label: "Errors",
    color: "hsl(var(--error))",
  }
}

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';

export function ResultsDisplay({ result, onRestart }: ResultsDisplayProps) {
  const chartData = useMemo(() => {
    if (!result.wpmHistory) return [];
    
    // Create a copy of wpmHistory
    const data = result.wpmHistory.map(item => ({ ...item, errorCount: 0, hasError: null as number | null }));
    
    // Add errors to the closest time bucket
    if (result.errorHistory) {
      result.errorHistory.forEach(error => {
        const closestPoint = data.reduce((prev, curr) => 
          Math.abs(curr.time - error.time) < Math.abs(prev.time - error.time) ? curr : prev
        );
        closestPoint.errorCount = (closestPoint.errorCount || 0) + 1;
        closestPoint.hasError = closestPoint.wpm;
      });
    }
    return data;
  }, [result.wpmHistory, result.errorHistory]);

  const formatTooltipLabel = (value: any, payload: any[]) => {
    const timeValue = payload && payload[0] ? payload[0].payload.time : Number(value);
    return isNaN(timeValue) ? 'Time: 0s' : `Time: ${Math.round(timeValue)}s`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-fade-in pt-8">
      {/* Main WPM and Accuracy on left, Graph on right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        {/* Left side - WPM and Accuracy */}
        <div className="flex flex-col justify-center h-full px-2 gap-8">
          <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-left">
              <div className="text-sm font-medium text-text-secondary uppercase tracking-widest mb-1">
                WPM
              </div>
              <div className="text-5xl font-bold tracking-tighter text-text-primary leading-none">
                {result.wpm}
              </div>
            </div>
          </div>

          <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-left">
              <div className="text-sm font-medium text-text-secondary uppercase tracking-widest mb-1">
                Accuracy
              </div>
              <div className="text-5xl font-bold tracking-tighter text-text-primary leading-none mt-1">
                {result.accuracy}%
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Graph */}
        <div className="lg:col-span-3 animate-fade-in px-2" style={{ animationDelay: '0.3s' }}>
          {chartData && chartData.length > 1 ? (
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    opacity={0.5} 
                  />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={(value) => `${Math.round(Number(value) || 0)}s`}
                    stroke="hsl(var(--text-muted))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--text-muted))"
                    fontSize={12}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={formatTooltipLabel}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rawWpm" 
                    stroke="hsl(var(--text-muted))" 
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="hsl(var(--text-primary))" 
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, fill: 'hsl(var(--text-primary))' }}
                  />
                  <Scatter dataKey="hasError" fill="var(--color-hasError)" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div 
              className="h-64 rounded-xl border border-dashed flex items-center justify-center w-full bg-secondary-bg border-border"
            >
              <div className="text-center text-text-muted">
                <div className="text-lg font-medium mb-2">Performance Graph</div>
                <div className="text-sm opacity-75">Insufficient data</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section - Test info and detailed stats */}
      <div className="space-y-8">
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-wrap justify-between items-end w-full pt-8 border-t border-border">
            <div className="flex flex-col">
              <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                test type
              </div>
              <div className="text-2xl font-semibold text-text-primary tracking-tight">
                {result.settings.mode} {result.settings.duration}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                raw wpm
              </div>
              <div className="text-2xl font-bold text-text-primary tracking-tight">
                {result.rawWpm || Math.round((result.charCount / 5) / (result.totalTime / 60)) || 0}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                characters
              </div>
              <div className="text-2xl font-bold text-text-primary tracking-tight">
                {result.correct}/{result.incorrect}/{result.extra}/{result.charCount}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                consistency
              </div>
              <div className="text-2xl font-bold text-text-primary tracking-tight">
                {Math.round(result.accuracy * 0.9)}%
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                time
              </div>
              <div className="text-2xl font-bold text-text-primary tracking-tight">
                {Math.round(result.totalTime)}s
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 animate-fade-in pt-12 pb-4" style={{ animationDelay: '0.6s' }}>
          <button 
            onClick={onRestart} 
            className="text-text-muted hover:text-text-primary transition-colors text-sm font-medium"
          >
            Restart (Tab)
          </button>
        </div>
      </div>
    </div>
  );
}
