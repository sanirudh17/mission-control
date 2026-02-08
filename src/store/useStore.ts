import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
export type Status = 'Queue' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  progress: number;
  source: 'Todoist' | 'Internal';
  createdAt: number;
  dueDate?: string;
}

export interface Activity {
  id: string;
  text: string;
  type: 'Task' | 'Email' | 'System' | 'Deliverable';
  timestamp: number;
}

export interface Deliverable {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file' | 'link';
  createdAt: number;
  taskId?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'User' | 'OpenClaw';
  timestamp: number;
}

interface MissionState {
  tasks: Task[];
  activities: Activity[];
  deliverables: Deliverable[];
  messages: Message[];
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addActivity: (text: string, type: Activity['type']) => void;
  addDeliverable: (deliverable: Omit<Deliverable, 'id' | 'createdAt'>) => void;
  addMessage: (text: string, sender: Message['sender']) => void;
}

export const useStore = create<MissionState>()(
  persist(
    (set) => ({
      tasks: [],
      activities: [],
      deliverables: [],
      messages: [],

      addTask: (task) => set((state) => ({
        tasks: [{ ...task, id: crypto.randomUUID(), createdAt: Date.now() }, ...state.tasks],
        activities: [{ id: crypto.randomUUID(), text: `New task: ${task.title}`, type: 'Task', timestamp: Date.now() }, ...state.activities]
      })),

      updateTask: (id, updates) => set((state) => {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return state;
        
        // Auto-log progress changes
        let newActivity = state.activities;
        if (updates.status && updates.status !== task.status) {
          newActivity = [{ id: crypto.randomUUID(), text: `Task "${task.title}" moved to ${updates.status}`, type: 'Task', timestamp: Date.now() }, ...state.activities];
        }

        return {
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
          activities: newActivity
        };
      }),

      addActivity: (text, type) => set((state) => ({
        activities: [{ id: crypto.randomUUID(), text, type, timestamp: Date.now() }, ...state.activities]
      })),

      addDeliverable: (d) => set((state) => ({
        deliverables: [{ ...d, id: crypto.randomUUID(), createdAt: Date.now() }, ...state.deliverables],
        activities: [{ id: crypto.randomUUID(), text: `Deliverable ready: ${d.name}`, type: 'Deliverable', timestamp: Date.now() }, ...state.activities]
      })),

      addMessage: (text, sender) => set((state) => ({
        messages: [...state.messages, { id: crypto.randomUUID(), text, sender, timestamp: Date.now() }]
      })),
    }),
    {
      name: 'mission-control-storage',
    }
  )
);
