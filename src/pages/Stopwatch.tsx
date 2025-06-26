import  { useEffect, useRef, useState } from 'react';
import { StopwatchDisplay } from '../components/StopwatchDisplay';
import { StopwatchControls } from '../components/StopwatchControls';

interface Lap {
  split: number;
  total: number;
}

function StopWatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<number | null>(null);
  const actionLock = useRef(false); // Prevents double actions

  const handleToggle = () => {
    if (actionLock.current) return;
    actionLock.current = true;
    setTimeout(() => { actionLock.current = false; }, 150); // Debounce
    if (isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    } else {
      if (intervalRef.current !== null) return; // Prevent multiple intervals
      intervalRef.current = window.setInterval(() => {
        setElapsed((prev) => prev + 10);
      }, 10);
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    if (actionLock.current) return;
    actionLock.current = true;
    setTimeout(() => { actionLock.current = false; }, 150); // Debounce
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setElapsed(0);
    setLaps([]);
    setIsRunning(false);
  };

  const handleFlag = () => {
    if (!isRunning || actionLock.current) return;
    actionLock.current = true;
    setTimeout(() => { actionLock.current = false; }, 150); // Debounce
    const lastTotal = laps.length > 0 ? laps[0].total : 0;
    setLaps([{ split: elapsed - lastTotal, total: elapsed }, ...laps]);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
      <StopwatchDisplay elapsed={elapsed} />
      <StopwatchControls
        isRunning={isRunning}
        onToggle={handleToggle}
        onReset={handleReset}
        onFlag={handleFlag}
        canReset={elapsed > 0}
      />
      {laps.length > 0 && (
        <div className="w-full mt-6">
          <table className="w-full text-center rounded-lg overflow-hidden border border-gray-100 border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="py-1">Lap</th>
                <th className="py-1">Split Time</th>
                <th className="py-1">Total Time</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap, idx) => (
                <tr key={laps.length - idx} className="border-t text-gray-700 text-sm">
                  <td className="py-1 font-semibold">{laps.length - idx}</td>
                  <td className="py-1 font-mono">{formatElapsed(lap.split)}</td>
                  <td className="py-1 font-mono">{formatElapsed(lap.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
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

export default StopWatch;


