
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Github, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google sign-in failed:', error);
      setError(error.message || 'Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGithub();
    } catch (error: any) {
      console.error('GitHub sign-in failed:', error);
      setError(error.message || 'Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{ backgroundColor: 'var(--theme-background)' }}
    >
      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 hover:opacity-80 transition-opacity"
        style={{ color: 'var(--theme-stats)' }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Type.TMTR
      </Link>

      {/* Main login container */}
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 
            className="text-4xl font-bold mb-2" 
            style={{ color: 'var(--theme-title)' }}
          >
            Type.TMTR
          </h1>
          <p 
            className="text-lg" 
            style={{ color: 'var(--theme-stats)' }}
          >
            Sign in to track your progress
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div 
            className="p-4 rounded-lg border flex items-start gap-3"
            style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: 'var(--theme-title)'
            }}
          >
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Authentication Error</p>
              <p style={{ color: 'var(--theme-stats)' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Social login buttons */}
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-medium" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{ 
              borderColor: 'var(--theme-stats)',
              color: 'var(--theme-typebox)',
              backgroundColor: 'transparent'
            }}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 text-base font-medium" 
            onClick={handleGithubSignIn}
            disabled={isLoading}
            style={{ 
              borderColor: 'var(--theme-stats)',
              color: 'var(--theme-typebox)',
              backgroundColor: 'transparent'
            }}
          >
            <Github className="w-5 h-5 mr-3" />
            {isLoading ? 'Signing in...' : 'Continue with GitHub'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p 
            className="text-sm" 
            style={{ color: 'var(--theme-stats)' }}
          >
            By signing in, you agree to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
