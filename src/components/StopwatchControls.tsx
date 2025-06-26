import React from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface StopwatchControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onFlag: () => void;
  canReset: boolean;
}

export const StopwatchControls: React.FC<StopwatchControlsProps> = ({
  isRunning,
  onToggle,
  onReset,
  onFlag,
  canReset,
}) => (
  <div className="flex gap-6">
    <button
      onClick={onToggle}
      className={`p-3 rounded-full transition-colors ${
        isRunning
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-green-100 text-green-600 hover:bg-green-200'
      }`}
      title={isRunning ? 'Pause Stopwatch' : 'Start Stopwatch'}
    >
      {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
    </button>
    <button
      onClick={onFlag}
      disabled={!isRunning}
      className={`p-3 rounded-full transition-colors ${
        isRunning
          ? 'bg-green-100 text-green-600 hover:bg-green-200'
          : 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed'
      }`}
      title="Lap"
    >
      <Flag className="w-6 h-6" />
    </button>
    <button
      onClick={onReset}
      disabled={!canReset}
      className={`p-3 rounded-full bg-gray-100 text-gray-400 transition-colors ${
        canReset ? 'hover:bg-gray-200 text-gray-600' : 'opacity-50 cursor-not-allowed'
      }`}
      title="Reset Stopwatch"
    >
      <RotateCcw className="w-6 h-6" />
    </button>

  </div>
); 