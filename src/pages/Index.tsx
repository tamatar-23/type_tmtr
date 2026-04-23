import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Github, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypingArea } from '@/components/features/TypingArea';
import { ModeSelector } from '@/components/ModeSelector';
import { StatsDisplay } from '@/components/StatsDisplay';
import { Keyboard } from '@/components/Keyboard';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { useTypingTest } from '@/hooks/useTypingTest';
import { useAuth } from '@/hooks/useAuth';
import { TestSettings } from '@/types/typing';
import { Container } from '@/components/layout/Container';
import { SettingsModal } from '@/components/features/SettingsModal';

const SETTINGS_STORAGE_KEY = 'typeflow-settings';

const getSavedSettings = (): TestSettings => {
  const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.mode === 'string' && typeof parsed.duration === 'number') {
        return parsed;
      }
    } catch {}
  }
  return { mode: 'time', duration: 30, difficulty: 'easy', stopOnError: false };
};

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [settings, setSettings] = useState<TestSettings>(getSavedSettings());
  const [showSettings, setShowSettings] = useState(false);

  const {
    words,
    currentWordIndex,
    currentCharIndex,
    isActive,
    isFinished,
    timeLeft,
    stats,
    handleKeyDown,
    resetTest,
    getResult
  } = useTypingTest(settings);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleRestart = () => {
    resetTest();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary selection:bg-text-primary selection:text-background font-sans transition-colors duration-200">
      <Container className="flex-1 flex flex-col pt-8 pb-12">
        <header className="flex justify-between items-center mb-12">
          <Link to="/" className="text-2xl font-bold tracking-tight text-text-primary hover:opacity-80 transition-opacity">
            Type.TMTR
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => !loading && navigate(user ? '/user' : '/login')}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          {isFinished ? (
             <ResultsDisplay result={getResult()} onRestart={handleRestart} />
          ) : (
            <div className="w-full flex flex-col items-center gap-8">
              {!isActive && (
                <ModeSelector
                  settings={settings}
                  onSettingsChange={(s) => {
                    setSettings(s);
                    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(s));
                  }}
                  disabled={isActive}
                />
              )}
              
              {(isActive) && (
                <StatsDisplay stats={stats} timeLeft={timeLeft} mode={settings.mode} />
              )}
              
              <div className="w-full relative mt-4">
                <TypingArea 
                  words={words}
                  currentWordIndex={currentWordIndex}
                  currentCharIndex={currentCharIndex}
                  onKeyDown={handleKeyDown}
                  isFinished={isFinished}
                />
              </div>

              <div className="mt-8">
                <Keyboard />
              </div>

              {isActive && (
                <div className="flex justify-center mt-8 animate-fade-in">
                  <Button variant="ghost" onClick={handleRestart} className="text-text-muted hover:text-text-primary">
                    Restart (Tab)
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
        
        <footer className="mt-auto flex justify-center items-center py-6 text-text-muted">
          <a
            href="https://github.com/tamatar-23/type_tmtr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors flex items-center gap-2 text-sm"
          >
            <Github className="h-4 w-4" /> Source
          </a>
        </footer>
      </Container>
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        settings={settings}
        onSettingsChange={(s) => {
          setSettings(s);
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(s));
        }}
      />
    </div>
  );
};

export default Index;