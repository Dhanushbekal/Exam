import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TimerList } from '../components/TimerList';
import { AddTimerModal } from '../components/AddTimerModal';

function Timer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Timer
        </button>
      </div>

      <TimerList />

      <AddTimerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Timer;


