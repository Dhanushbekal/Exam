import { configureStore, createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { Timer } from '../types/timer';
import React from 'react';

const initialState = {
  timers: [] as Timer[],
};

const LOCAL_STORAGE_KEY = 'timers';

const loadTimers = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return { timers: JSON.parse(data) };
    }
  } catch (e) {
    // ignore
  }
  return initialState;
};

const timerSlice = createSlice({
  name: 'timer',
  initialState: loadTimers(),
  reducers: {
    addTimer: (state, action) => {
      state.timers.push({
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
    },
    deleteTimer: (state, action) => {
      state.timers = state.timers.filter((timer: Timer) => timer.id !== action.payload);
    },
    toggleTimer: (state, action) => {
      const timer = state.timers.find((timer: Timer) => timer.id === action.payload);
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
    },
    updateTimers: (state) => {
      state.timers.forEach((timer: Timer) => {
        if (timer.isRunning) {
          timer.remainingTime -= 1;
          timer.isRunning = timer.remainingTime > 0;
        }
      });
    },
    restartTimer: (state, action) => {
      const timer = state.timers.find((timer: Timer) => timer.id === action.payload);
      if (timer) {
        timer.remainingTime = timer.duration;
        timer.isRunning = false;
      }
    },
    editTimer: (state, action) => {
      const timer = state.timers.find((timer: Timer) => timer.id === action.payload.id);
      if (timer) {
        Object.assign(timer, action.payload.updates);
        timer.remainingTime = action.payload.updates.duration || timer.duration;
        timer.isRunning = false;
      }
    },
  },
});

const timerStore = configureStore({
  reducer: timerSlice.reducer,
});

// Persist timers to localStorage on change
if (typeof window !== 'undefined') {
  timerStore.subscribe(() => {
    const state = timerStore.getState();
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.timers));
    } catch (e) {
      // ignore
    }
  });
}

export { timerStore };

export const {
  addTimer,
  deleteTimer,
  toggleTimer,
  updateTimers,
  restartTimer,
  editTimer,
} = timerSlice.actions;

// Global interval management
let globalInterval: number | null = null;

const startGlobalInterval = (dispatch: any) => {
  if (globalInterval === null) {
    globalInterval = window.setInterval(() => {
      dispatch(updateTimers());
    }, 1000);
  }
};

const stopGlobalInterval = () => {
  if (globalInterval !== null) {
    clearInterval(globalInterval);
    globalInterval = null;
  }
};

export const useTimerStore = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state: { timers: Timer[] }) => state.timers);

  // Start/stop global interval based on running timers
  React.useEffect(() => {
    const hasRunningTimers = timers.some(timer => timer.isRunning);
    if (hasRunningTimers) {
      startGlobalInterval(dispatch);
    } else {
      stopGlobalInterval();
    }
  }, [timers, dispatch]);

  return {
    timers,
    addTimer: (timer: Omit<Timer, 'id' | 'createdAt'>) => dispatch(addTimer(timer)),
    deleteTimer: (id: string) => dispatch(deleteTimer(id)),
    toggleTimer: (id: string) => dispatch(toggleTimer(id)),
    restartTimer: (id: string) => dispatch(restartTimer(id)),
    editTimer: (id: string, updates: Partial<Timer>) => dispatch(editTimer({ id, updates })),
  };
};