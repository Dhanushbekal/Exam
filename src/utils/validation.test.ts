import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateTimerForm } from './validation';
import { toast } from 'sonner';

// Mock the toast object from sonner
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe('validateTimerForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should return true for valid form data', () => {
    const data = {
      title: 'Valid Timer',
      description: 'Some description',
      hours: 1,
      minutes: 30,
      seconds: 0,
    };
    expect(validateTimerForm(data)).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should return false and show error for empty title', () => {
    const data = {
      title: ' ',
      description: 'Some description',
      hours: 1,
      minutes: 30,
      seconds: 0,
    };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title is required');
  });

  it('should return false and show error for title exceeding 50 characters', () => {
    const data = {
      title: 'a'.repeat(51),
      description: 'Some description',
      hours: 1,
      minutes: 30,
      seconds: 0,
    };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Title must be less than 50 characters');
  });

  it('should return false and show error for negative time values', () => {
    const data = {
      title: 'Valid Title',
      description: 'Some description',
      hours: -1,
      minutes: 0,
      seconds: 0,
    };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Time values cannot be negative');
  });

  it('should return false and show error for minutes exceeding 59', () => {
    const data = {
      title: 'Valid Title',
      description: 'Some description',
      hours: 0,
      minutes: 60,
      seconds: 0,
    };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Minutes and seconds must be between 0 and 59');
  });

  it('should return false and show error for seconds exceeding 59', () => {
    const data = {
      title: 'Valid Title',
      description: 'Some description',
      hours: 0,
      minutes: 0,
      seconds: 60,
    };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Minutes and seconds must be between 0 and 59');
  });

  it('should return false and show error for total seconds being 0', () => {
    const data = {
      title: 'Valid Title',
      description: 'Some description',
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Please set a time greater than 0');
  });

  it('should return false and show error for total seconds exceeding 24 hours', () => {
    const data = {
      title: 'Valid Title',
      description: 'Some description',
      hours: 24,
      minutes: 0,
      seconds: 1,
    };
    expect(validateTimerForm(data)).toBe(false);
    expect(toast.error).toHaveBeenCalledWith('Timer cannot exceed 24 hours');
  });

  it('should handle combination of valid hours, minutes, and seconds', () => {
    const data = {
      title: 'Combined Time',
      description: '',
      hours: 0,
      minutes: 1,
      seconds: 5,
    };
    expect(validateTimerForm(data)).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });
}); 