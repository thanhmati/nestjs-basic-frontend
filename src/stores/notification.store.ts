import { create } from 'zustand';
import type { NotificationItem } from '../types';
import { notificationsApi } from '../api/notifications.api';
import { getChatSocket } from '../services/socket';
import { toast } from './toast.store';

interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  nextCursor: number | null;
  hasNextPage: boolean;

  fetchNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (item: NotificationItem) => void;
  setupSocketListener: () => () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  unreadCount: 0,
  isLoading: false,
  isLoadingMore: false,
  nextCursor: null,
  hasNextPage: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const res = await notificationsApi.getNotifications(null, 10);
      set({
        items: res.items || [],
        unreadCount: res.meta?.unreadCount ?? 0,
        nextCursor: res.meta?.nextCursor ?? null,
        hasNextPage: Boolean(res.meta?.hasNextPage),
      });
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  loadMoreNotifications: async () => {
    const { nextCursor, isLoadingMore, hasNextPage, items } = get();
    if (!nextCursor || !hasNextPage || isLoadingMore) return;

    try {
      set({ isLoadingMore: true });
      const res = await notificationsApi.getNotifications(nextCursor, 10);
      const newItems = res.items || [];
      const existingIds = new Set(items.map((i) => i.id));
      const filtered = newItems.filter((i) => !existingIds.has(i.id));

      set({
        items: [...items, ...filtered],
        nextCursor: res.meta?.nextCursor ?? null,
        hasNextPage: Boolean(res.meta?.hasNextPage),
      });
    } catch (err) {
      console.error('Failed to load more notifications:', err);
    } finally {
      set({ isLoadingMore: false });
    }
  },

  markAsRead: async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      const { items, unreadCount } = get();
      const updated = items.map((i) => (i.id === id ? { ...i, isRead: true } : i));
      set({
        items: updated,
        unreadCount: Math.max(0, unreadCount - 1),
      });
    } catch (err) {
      console.error(`Failed to mark notification #${id} as read:`, err);
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsApi.markAllAsRead();
      const { items } = get();
      const updated = items.map((i) => ({ ...i, isRead: true }));
      set({
        items: updated,
        unreadCount: 0,
      });
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  },

  addNotification: (item: NotificationItem) => {
    const { items, unreadCount } = get();
    const isDuplicate = items.some((i) => i.id === item.id);
    if (!isDuplicate) {
      set({
        items: [item, ...items],
        unreadCount: unreadCount + 1,
      });
      // Bắn Toast thông báo tức thời
      toast.info(item.content || item.title, item.title || 'Thông báo mới');
    }
  },

  setupSocketListener: () => {
    const socket = getChatSocket();
    if (!socket) return () => {};

    const handleNewNotification = (item: NotificationItem) => {
      get().addNotification(item);
    };

    // Đảm bảo không bị duplicate listener khi re-render
    socket.off('new_notification');
    socket.on('new_notification', handleNewNotification);

    // Nếu socket đã kết nối sẵn, gửi yêu cầu subscribe phòng thông báo ngay
    if (socket.connected) {
      socket.emit('subscribe_notifications');
    }

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  },
}));

export default useNotificationStore;
