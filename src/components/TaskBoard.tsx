import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { Task, Status } from '../store/useStore';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import clsx from 'clsx';

const Column = ({ title, status, tasks }: { title: string, status: Status, tasks: Task[] }) => {
  const { updateTask } = useStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData('taskId');
    updateTask(taskId, { status });
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 min-w-[300px] flex flex-col gap-4 p-4 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm"
    >
      <h3 className="text-sm font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
        <span className={clsx("w-2 h-2 rounded-full", {
          'bg-accent-blue': status === 'Queue',
          'bg-accent-amber': status === 'In Progress',
          'bg-accent-green': status === 'Completed'
        })} />
        {title} <span className="opacity-50">({tasks.length})</span>
      </h3>
      
      <div className="flex flex-col gap-3 h-full overflow-y-auto min-h-[200px]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

const TaskCard = ({ task }: { task: Task }) => {
  const handleDragStart = (e: any) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <motion.div
      layoutId={task.id}
      draggable
      onDragStart={handleDragStart}
      className="glass-card p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={clsx("text-xs font-bold px-2 py-0.5 rounded-full", {
          'bg-red-100 text-red-700': task.priority === 'P1',
          'bg-amber-100 text-amber-700': task.priority === 'P2',
          'bg-blue-100 text-blue-700': task.priority === 'P3',
          'bg-gray-100 text-gray-700': task.priority === 'P4',
        })}>{task.priority}</span>
        {task.progress > 0 && task.status !== 'Completed' && (
          <span className="text-xs font-mono text-secondary">{task.progress}%</span>
        )}
      </div>
      
      <h4 className="font-medium text-primary mb-1">{task.title}</h4>
      {task.description && <p className="text-xs text-secondary line-clamp-2">{task.description}</p>}
      
      <div className="mt-3 flex items-center justify-between text-xs text-secondary opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="flex items-center gap-1">
          <Clock size={12} /> {new Date(task.createdAt).toLocaleDateString()}
        </span>
        {task.status === 'Completed' ? <CheckCircle2 size={16} className="text-accent-green" /> : <Circle size={16} />}
      </div>
      
      {/* Progress Bar for In Progress */}
      {task.status === 'In Progress' && (
        <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-accent-amber transition-all duration-500" style={{ width: `${task.progress}%` }} />
        </div>
      )}
    </motion.div>
  );
};

export const TaskBoard = () => {
  const { tasks } = useStore();
  
  const queue = tasks.filter(t => t.status === 'Queue' && t.source === 'Internal');
  const inProgress = tasks.filter(t => t.status === 'In Progress' && t.source === 'Internal');
  const completed = tasks.filter(t => t.status === 'Completed' && t.source === 'Internal');

  return (
    <div className="h-full flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-light text-primary">OpenClaw Work Queue</h2>
        <div className="text-sm text-secondary">
          {inProgress.length} active tasks
        </div>
      </header>
      
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        <Column title="Queue" status="Queue" tasks={queue} />
        <Column title="In Progress" status="In Progress" tasks={inProgress} />
        <Column title="Done" status="Completed" tasks={completed} />
      </div>
    </div>
  );
};
