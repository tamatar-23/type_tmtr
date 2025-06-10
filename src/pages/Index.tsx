
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypingArea } from '@/components/TypingArea';
import { ModeSelector } from '@/components/ModeSelector';
import { StatsDisplay } from '@/components/StatsDisplay';
import { Keyboard } from '@/components/Keyboard';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { useTypingTest } from '@/hooks/useTypingTest';
import { useAuth } from '@/hooks/useAuth';
import { TestSettings } from '@/types/typing';
import { ThemeSelector } from '@/components/ThemeSelector';

// Get saved settings or default
const getSavedSettings = (): TestSettings => {
  const saved = localStorage.getItem('typeflow-settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Fall back to default if parsing fails
    }
  }
  return {
    mode: 'time',
    duration: 30,
    difficulty: 'easy'
  };
};

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [settings, setSettings] = useState<TestSettings>(getSavedSettings());
  const [showResults, setShowResults] = useState(false);

  const {
    text,
    userInput,
    characters,
    currentIndex,
    isActive,
    isFinished,
    timeLeft,
    stats,
    handleInput,
    handleSpaceSkip,
    resetTest,
    getResult
  } = useTypingTest(settings);

  // Handle test completion
  useEffect(() => {
    if (isFinished) {
      console.log('Test finished, showing results');
      setShowResults(true);
    }
  }, [isFinished]);

  const handleRestart = () => {
    setShowResults(false);
    resetTest();
  };

  const handleUserIconClick = () => {
    if (loading) return;
    
    if (user) {
      navigate('/user');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen text-foreground" style={{ backgroundColor: 'var(--theme-background)' }}>
      {/* Header with improved visibility */}
      <header className="flex justify-between items-center p-6">
        <Link to="/" className="text-2xl font-bold" style={{ color: 'var(--theme-title)' }}>
          Type.TMTR
        </Link>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-white/10"
          style={{ color: 'var(--theme-title)' }}
          onClick={handleUserIconClick}
        >
          <User className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {showResults ? (
            <ResultsDisplay result={getResult()} onRestart={handleRestart} />
          ) : (
            <>
              {/* Top Stats and Controls */}
              <div className="flex justify-center items-center gap-8">
                {/* Mode Selector - only show when not active and not finished */}
                {!isActive && !isFinished && (
                  <ModeSelector
                    settings={settings}
                    onSettingsChange={setSettings}
                    disabled={isActive}
                  />
                )}

                {/* Stats Display - show when active or finished */}
                {(isActive || isFinished) && (
                  <StatsDisplay
                    stats={stats}
                    timeLeft={timeLeft}
                    mode={settings.mode}
                  />
                )}
              </div>

              {/* Typing Area - better centered with more padding */}
              <div className="flex justify-center px-6">
                <div className="w-full max-w-4xl">
                  <TypingArea
                    text={text}
                    characters={characters}
                    currentIndex={currentIndex}
                    userInput={userInput}
                    onInput={handleInput}
                    onSpaceSkip={handleSpaceSkip}
                    isFinished={isFinished}
                  />
                </div>
              </div>

              {/* Keyboard */}
              <div className="flex justify-center px-6">
                <Keyboard />
              </div>

              {/* Action Buttons - only show restart during active typing */}
              {isActive && !isFinished && (
                <div className="flex justify-center">
                  <Button onClick={handleRestart} variant="outline" className="bg-transparent border-gray-600 text-gray-400 hover:text-white hover:border-white">
                    Restart (Tab)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer with improved visibility */}
      <footer className="fixed bottom-0 left-0 right-0 flex justify-between items-center p-6">
        <a
          href="https://github.com/tamatar-23/type_tmtr"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:opacity-80"
          style={{ color: 'var(--theme-stats)' }}
        >
          <Github className="h-5 w-5" />
        </a>
        <div className="flex items-center gap-4">
          <ThemeSelector />
        </div>
      </footer>
    </div>
  );
};

export default Index;
