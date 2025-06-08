
import { useEffect, useState } from 'react';

export function Keyboard() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key.toLowerCase());
        return newSet;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const keyRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '⌫'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  const getKeyStyle = (key: string) => {
    const isPressed = pressedKeys.has(key) || pressedKeys.has(key.toLowerCase()) || (key === '⌫' && pressedKeys.has('backspace'));
    return {
      backgroundColor: isPressed ? 'var(--theme-key-pressed)' : 'var(--theme-key-bg)',
      color: 'var(--theme-key-text)',
      transform: isPressed ? 'scale(0.95)' : 'scale(1)',
      transition: 'all 0.1s ease'
    };
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* First row with backspace after p */}
      <div className="flex gap-2 mb-2 justify-center">
        {keyRows[0].map((key) => (
          <div
            key={key}
            className={`${key === '⌫' ? 'w-16' : 'w-10'} h-10 flex items-center justify-center rounded text-sm font-medium`}
            style={getKeyStyle(key)}
          >
            {key}
          </div>
        ))}
      </div>

      {/* Second row */}
      <div className="flex gap-2 mb-2 justify-center">
        {keyRows[1].map((key) => (
          <div
            key={key}
            className="w-10 h-10 flex items-center justify-center rounded text-sm font-medium"
            style={getKeyStyle(key)}
          >
            {key}
          </div>
        ))}
      </div>

      {/* Third row */}
      <div className="flex gap-2 mb-2 justify-center">
        {keyRows[2].map((key) => (
          <div
            key={key}
            className="w-10 h-10 flex items-center justify-center rounded text-sm font-medium"
            style={getKeyStyle(key)}
          >
            {key}
          </div>
        ))}
      </div>

      {/* Space bar */}
      <div className="flex gap-2 justify-center items-center">
        <div
          className="w-64 h-10 flex items-center justify-center rounded text-sm font-medium"
          style={getKeyStyle(' ')}
        >
        </div>
      </div>
    </div>
  );
}
