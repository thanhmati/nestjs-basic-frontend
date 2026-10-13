import { apiClient } from '../services/api';
import type { NotificationsResponse, NotificationItem } from '../types';

export const notificationsApi = {
  /**
   * Lấy danh sách thông báo của người dùng (Cursor pagination)
   */
  getNotifications: async (
    cursor?: number | null,
    limit: number = 10,
    isRead?: boolean
  ): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();
    if (cursor !== undefined && cursor !== null) params.append('cursor', cursor.toString());
    params.append('limit', limit.toString());
    if (isRead !== undefined) params.append('isRead', isRead.toString());

    return apiClient.get(`/notifications?${params.toString()}`) as unknown as Promise<NotificationsResponse>;
  },

  /**
   * Đánh dấu một thông báo cụ thể là đã đọc
   */
  markAsRead: async (id: number): Promise<NotificationItem> => {
    return apiClient.patch(`/notifications/${id}/read`) as unknown as Promise<NotificationItem>;
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  markAllAsRead: async (): Promise<{ updatedCount: number }> => {
    return apiClient.patch('/notifications/read-all') as unknown as Promise<{ updatedCount: number }>;
  },
};

export default notificationsApi;
