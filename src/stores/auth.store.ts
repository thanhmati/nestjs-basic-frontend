import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { connectChatSocket, disconnectChatSocket } from '../services/socket';
import { apiClient } from '../services/api';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, user: User) => void;
  updateUser: (partialUser: Partial<User>) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

// Khởi tạo trạng thái đồng bộ từ localStorage ngay lập tức để tránh redirect nhầm khi F5
const getInitialAuth = () => {
  try {
    const token = localStorage.getItem('access_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (token && token !== 'undefined' && token !== 'null') {
      let user: User | null = null;
      if (userInfoStr && userInfoStr !== 'undefined' && userInfoStr !== 'null') {
        try {
          user = JSON.parse(userInfoStr);
        } catch {
          // parse error
        }
      }
      return {
        token,
        user,
        isAuthenticated: true,
      };
    }
  } catch {
    // localStorage not accessible
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

const initialAuth = getInitialAuth();

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: initialAuth.token,
      user: initialAuth.user,
      isAuthenticated: initialAuth.isAuthenticated,
      isLoading: false,

      setAuth: (token: string, user: User) => {
        if (!token || token === 'undefined' || token === 'null') {
          console.error('Invalid token provided to setAuth:', token);
          return;
        }

        localStorage.setItem('access_token', token);
        if (user) {
          localStorage.setItem('user_info', JSON.stringify(user));
        }

        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        // Tự động kết nối WebSocket chat khi đăng nhập
        connectChatSocket(token);
      },

      updateUser: (partialUser: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = {
          ...currentUser,
          ...partialUser,
          profile: partialUser.profile !== undefined
            ? { ...(currentUser.profile || {}), ...partialUser.profile }
            : currentUser.profile,
        };

        localStorage.setItem('user_info', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      },

      logout: () => {
        // 1. Ngắt kết nối socket
        disconnectChatSocket();

        // 2. Xóa dữ liệu storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');

        // 3. Reset state
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initAuth: async () => {
        const token = localStorage.getItem('access_token');
        const userInfoStr = localStorage.getItem('user_info');

        if (token && token !== 'undefined' && token !== 'null') {
          let user = get().user;
          if (!user && userInfoStr && userInfoStr !== 'undefined' && userInfoStr !== 'null') {
            try {
              user = JSON.parse(userInfoStr);
            } catch (e) {
              console.error('Failed to parse stored user info', e);
            }
          }

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Tự động kết nối WebSocket
          connectChatSocket(token);

          // Đồng bộ lại profile mới nhất từ server ở background
          try {
            const freshUser = (await apiClient.get('/users/profile')) as User;
            if (freshUser && freshUser.id) {
              localStorage.setItem('user_info', JSON.stringify(freshUser));
              set({ user: freshUser });
            }
          } catch (profileErr) {
            console.warn('Lỗi đồng bộ thông tin tài khoản khi khởi động:', profileErr);
          }
          return;
        }

        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
