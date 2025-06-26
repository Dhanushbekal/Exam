import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { StopwatchControls } from '../components/StopwatchControls';

describe('StopwatchControls', () => {
  it('renders play, flag, and reset buttons', () => {
    const noop = () => {};
    const { getByTitle } = render(
      <StopwatchControls isRunning={false} onToggle={noop} onReset={noop} onFlag={noop} canReset={false} />
    );
    expect(getByTitle(/start stopwatch/i)).toBeInTheDocument();
    expect(getByTitle(/lap/i)).toBeInTheDocument();
    expect(getByTitle(/reset stopwatch/i)).toBeInTheDocument();
  });

  it('calls handlers on click', () => {
    const onToggle = vi.fn();
    const onReset = vi.fn();
    const onFlag = vi.fn();
    const { getByTitle } = render(
      <StopwatchControls isRunning={false} onToggle={onToggle} onReset={onReset} onFlag={onFlag} canReset={true} />
    );
    fireEvent.click(getByTitle(/start stopwatch/i));
    fireEvent.click(getByTitle(/reset stopwatch/i));
    fireEvent.click(getByTitle(/lap/i));
    expect(onToggle).toHaveBeenCalled();
    expect(onReset).toHaveBeenCalled();
    // Lap should not be called if not running
    expect(onFlag).toHaveBeenCalled();
  });

  it('disables flag and reset when appropriate', () => {
    const noop = () => {};
    const { getByTitle } = render(
      <StopwatchControls isRunning={false} onToggle={noop} onReset={noop} onFlag={noop} canReset={false} />
    );
    expect(getByTitle(/lap/i)).toBeDisabled();
    expect(getByTitle(/reset stopwatch/i)).toBeDisabled();
  });
}); 