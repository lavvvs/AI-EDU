import { create } from 'zustand';
import api from './api';

interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  created_at?: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isSidebarOpen: boolean;
  activeModule: 'dashboard' | 'pdf' | 'youtube' | 'website' | 'voice' | 'history' | 'settings';
  
  // AI Chat State
  isRobotOpen: boolean;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (status: boolean) => void;
  toggleSidebar: () => void;
  setActiveModule: (module: AppState['activeModule']) => void;
  toggleRobot: () => void;
  addMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;
  
  // Auth Thunks
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isSidebarOpen: true,
  activeModule: 'dashboard',
  isRobotOpen: false,
  messages: [
    { role: 'assistant', content: 'Hi there! I\'m your AI Assistant. Log in to get started with your studies!' }
  ],

  setUser: (user) => set({ user }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveModule: (module) => set({ activeModule: module }),
  toggleRobot: () => set((state) => ({ isRobotOpen: !state.isRobotOpen })),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, activeModule: 'dashboard' });
  },

  checkAuth: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      set({ 
        user: { id: data.id, name: data.full_name, email: data.email, created_at: data.created_at }, 
        isAuthenticated: true 
      });
      
      // Update welcome
      if (data.full_name) {
        set((state) => ({
          messages: [
            { role: 'assistant', content: `Hi ${data.full_name}! I'm your AI Assistant. How can I help you today?` }
          ]
        }));
      }
    } catch (error) {
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null });
    }
  },
}));
