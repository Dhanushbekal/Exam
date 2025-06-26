import React, { useRef, useState } from 'react';
import { Trash2, RotateCcw, Pencil, Check } from 'lucide-react';
import { Timer } from '../types/timer';
import { formatTime } from '../utils/time';
import { useTimerStore } from '../store/useTimerStore';
import { toast } from 'sonner';
import { EditTimerModal } from './EditTimerModal';
import { TimerAudio } from '../utils/audio';
import { TimerControls } from './TimerControls';
import { TimerProgress } from './TimerProgress';

interface TimerItemProps {
  timer: Timer;
}

export const TimerItem: React.FC<TimerItemProps> = ({ timer }) => {
  const { toggleTimer, deleteTimer, restartTimer } = useTimerStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const timerAudio = TimerAudio.getInstance();
  const hasEndedRef = useRef(false);

  // Check for timer completion
  React.useEffect(() => {
    if (timer.remainingTime <= 1 && !hasEndedRef.current && timer.isRunning) {
      hasEndedRef.current = true;
      timerAudio.play().catch(console.error);
      
      toast(
        <div className="flex items-center gap-4 w-full max-w-full">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </span>
          <span className="font-medium text-base text-gray-900 flex-grow truncate">
            Timer <span className="font-bold">"{timer.title}"</span> has ended!
          </span>
          <span className="flex-shrink-0">
            <button
              onClick={() => {
                timerAudio.stop();
                toast.dismiss();
              }}
              className="px-4 py-1.5 bg-black text-white rounded-lg font-medium shadow hover:bg-gray-800 transition w-full sm:w-auto"
              style={{ minWidth: 80 }}
            >
              Dismiss
            </button>
          </span>
        </div>,
        {
          duration: Infinity,
          className: "bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 w-auto max-w-full",
          style: { minWidth: 0, maxWidth: '100vw', boxShadow: "0 2px 12px 0 rgba(0,0,0,0.08)" },
          icon: null,
          action: null,
        }
      );
    }
  }, [timer.remainingTime, timer.isRunning, timer.title, timerAudio]);

  const handleRestart = () => {
    hasEndedRef.current = false;
    timerAudio.stop();
    restartTimer(timer.id);
  };

  const handleDelete = () => {
    timerAudio.stop();
    deleteTimer(timer.id);
  };

  const handleToggle = () => {
    if (timer.remainingTime <= 0) {
      hasEndedRef.current = false;
      timerAudio.stop();
    }
    toggleTimer(timer.id);
  };

  return (
    <>
      <div className="relative bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-102 overflow-hidden">
        <div className="absolute inset-0 w-full h-full -z-10 opacity-5">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
            <path
              d="M50 20V50L70 70"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <div className="relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{timer.title}</h3>
              <p className="text-gray-600 mt-1">{timer.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-full hover:bg-green-50 text-green-500 transition-colors"
                title="Edit Timer"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={handleRestart}
                className="p-2 rounded-full hover:bg-green-50 text-green-500 transition-colors"
                title="Restart Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                title="Delete Timer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center mt-6">
            <div className="text-4xl font-mono font-bold text-gray-800 mb-4">
              {formatTime(timer.remainingTime)}
            </div>
            
            <TimerProgress
              progress={(timer.remainingTime / timer.duration) * 100}
            />
            
            <TimerControls
              isRunning={timer.isRunning}
              remainingTime={timer.remainingTime}
              onToggle={handleToggle}
              onRestart={handleRestart}
            />
          </div>
        </div>
      </div>

      <EditTimerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        timer={timer}
      />
    </>
  );
};