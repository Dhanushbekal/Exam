import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import StopWatch from '../pages/Stopwatch';

// Unit test helpers (simulate logic)
function getLapSplits(laps: { total: number }[]): { split: number; total: number }[] {
  return laps.map((lap, i, arr) => ({
    split: lap.total - (arr[i + 1]?.total || 0),
    total: lap.total,
  }));
}

describe('Stopwatch logic', () => {
  it('calculates lap splits correctly', () => {
    const laps = [
      { total: 1180 }, // Lap 1
      { total: 1580 }, // Lap 2
    ];
    const splits = getLapSplits(laps);
    expect(splits[0].split).toBe(400);
    expect(splits[1].split).toBe(1180);
  });
});

describe('Stopwatch component', () => {
  it('renders and starts/stops/reset/flags correctly', async () => {
    vi.useFakeTimers();
    render(<StopWatch />);
    // Start
    const playBtn = screen.getByTitle(/start stopwatch/i);
    fireEvent.click(playBtn);
    expect(screen.getByText('00:00.00')).toBeInTheDocument();
    vi.advanceTimersByTime(1230);
    // Pause
    const pauseBtn = screen.getByTitle(/pause stopwatch/i);
    fireEvent.click(pauseBtn);
    expect(screen.getByText(/00:01.23/)).toBeInTheDocument();
    // Flag
    const flagBtn = screen.getByTitle(/lap/i);
    fireEvent.click(flagBtn); // Should not add lap if not running
    fireEvent.click(playBtn); // Resume
    vi.advanceTimersByTime(1000);
    fireEvent.click(flagBtn); // Add lap
    expect(screen.getByText(/Lap/)).toBeInTheDocument();
    expect(screen.getByText(/00:01.00/)).toBeInTheDocument();
    // Reset
    const resetBtn = screen.getByTitle(/reset stopwatch/i);
    fireEvent.click(resetBtn);
    expect(screen.getByText('00:00.00')).toBeInTheDocument();
    vi.useRealTimers();
  });
}); 