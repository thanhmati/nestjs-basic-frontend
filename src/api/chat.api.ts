import { apiClient } from '../services/api';
import type { Conversation, ChatMessage } from '../types';

export const chatApi = {
  /**
   * Lấy danh sách các cuộc trò chuyện gần đây của người dùng
   */
  getConversations: async (): Promise<Conversation[]> => {
    return apiClient.get('/chat/conversations') as unknown as Promise<Conversation[]>;
  },

  /**
   * Tải lịch sử tin nhắn ban đầu giữa mình và người nhận (REST)
   */
  getMessages: async (receiverId: number, limit: number = 50): Promise<ChatMessage[]> => {
    return apiClient.get(`/chat/messages/${receiverId}?limit=${limit}`) as unknown as Promise<ChatMessage[]>;
  },

  /**
   * Đánh dấu đã đọc toàn bộ tin nhắn từ người gửi cụ thể
   */
  markAsRead: async (senderId: number): Promise<{ updatedCount: number }> => {
    return apiClient.patch(`/chat/messages/${senderId}/read`) as unknown as Promise<{ updatedCount: number }>;
  },
};

export default chatApi;
