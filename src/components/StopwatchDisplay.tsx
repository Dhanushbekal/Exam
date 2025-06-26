import React from 'react';

interface StopwatchDisplayProps {
  elapsed: number; // in ms
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

export const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({ elapsed }) => (
  <div className="text-4xl font-mono font-bold text-gray-800 mb-6">
    {formatElapsed(elapsed)}
  </div>
); 