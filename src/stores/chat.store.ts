import { useAuthStore } from "./auth.store";
import { create } from 'zustand';
import type { Conversation, ChatMessage } from '../types';
import { chatApi } from '../api/chat.api';
import { getChatSocket, isSocketConnected } from '../services/socket';

export interface ChatPartner {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface ChatState {
  conversations: Conversation[];
  activePartner: ChatPartner | null;
  activeRoomId: string | null;
  messages: ChatMessage[];
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isWsConnected: boolean;
  unreadTotal: number;

  // Actions
  fetchConversations: () => Promise<void>;
  setActivePartner: (partner: ChatPartner | null) => Promise<void>;
  setActiveRoom: (roomId: string | null) => void;
  fetchMessages: (partnerId: number) => Promise<void>;
  sendMessage: (content: string) => Promise<boolean>;
  addMessage: (msg: ChatMessage, currentUserId?: number) => void;
  markConversationRead: (partnerId: number) => Promise<void>;
  setWsConnected: (connected: boolean) => void;
  setupSocketListeners: (currentUserId: number) => () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activePartner: null,
  activeRoomId: null,
  messages: [],
  isLoadingConversations: false,
  isLoadingMessages: false,
  isWsConnected: isSocketConnected(),
  unreadTotal: 0,

  fetchConversations: async () => {
    try {
      set({ isLoadingConversations: true });
      const convs = await chatApi.getConversations();
      const list = Array.isArray(convs) ? convs : [];
      const totalUnread = list.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      set({
        conversations: list,
        unreadTotal: totalUnread,
      });
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  setActivePartner: async (partner: ChatPartner | null) => {
    const socket = getChatSocket();
    const prevRoom = get().activeRoomId;
    if (prevRoom && socket) {
      socket.emit('leave_room', { roomId: prevRoom });
    }

    set({
      activePartner: partner,
      activeRoomId: null,
      messages: [],
    });

    if (partner) {
      await get().fetchMessages(partner.id);
      await get().markConversationRead(partner.id);
    }
  },

  setActiveRoom: (roomId: string | null) => {
    const socket = getChatSocket();
    const prevRoom = get().activeRoomId;

    if (socket) {
      if (prevRoom && prevRoom !== roomId) {
        socket.emit('leave_room', { roomId: prevRoom });
      }
      if (roomId) {
        socket.emit('join_room', { roomId });
      }
    }

    set({
      activeRoomId: roomId,
      activePartner: null,
      messages: [],
    });
  },

  fetchMessages: async (partnerId: number) => {
    try {
      set({ isLoadingMessages: true });
      const msgs = await chatApi.getMessages(partnerId, 50);
      set({ messages: Array.isArray(msgs) ? msgs : [] });
    } catch (err) {
      console.error(`Failed to fetch messages with partner ${partnerId}:`, err);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (content: string): Promise<boolean> => {
    const trimmed = content.trim();
    if (!trimmed) return false;

    const socket = getChatSocket();
    if (!socket || !socket.connected) {
      console.warn('Socket not connected, cannot send message.');
      return false;
    }

    const { activePartner, activeRoomId } = get();

    if (activePartner) {
      // 1-1 Chat: gửi receiverId và content
      socket.emit('send_room_message', {
        receiverId: activePartner.id,
        content: trimmed,
      });
      return true;
    }

    if (activeRoomId) {
      // Room Chat: gửi roomId và content
      socket.emit('send_room_message', {
        roomId: activeRoomId,
        content: trimmed,
      });
      return true;
    }

    return false;
  },

  addMessage: (msg: ChatMessage, currentUserId?: number) => {
    const { activePartner, activeRoomId, messages, conversations } = get();

    // Chuẩn hóa id và sender nếu backend gửi messageId hoặc tự sinh timestamp
    const rawMsg = msg as unknown as Record<string, unknown>;
    const normalizedId =
      msg.id ||
      (typeof rawMsg.messageId === 'number' ? rawMsg.messageId : null) ||
      Date.now();
    const normalizedMsg: ChatMessage = {
      ...msg,
      id: normalizedId,
      sender: msg.sender || {
        id: msg.senderId,
        name: typeof rawMsg.senderName === 'string' ? rawMsg.senderName : `Người dùng #${msg.senderId}`,
        email: typeof rawMsg.senderEmail === 'string' ? rawMsg.senderEmail : '',
        avatarUrl: null,
      },
    };

    // Xác định xem đây có phải là tin nhắn 1-1 (Direct Message) không
    const isDirectMessage = Boolean(
      normalizedMsg.receiverId ||
      (!normalizedMsg.roomId || normalizedMsg.roomId.startsWith("conversation:"))
    );

    const isDirectChatWithActivePartner =
      Boolean(activePartner) &&
      isDirectMessage &&
      ((normalizedMsg.senderId === activePartner?.id && (!normalizedMsg.receiverId || normalizedMsg.receiverId === currentUserId)) ||
        (normalizedMsg.senderId === currentUserId && normalizedMsg.receiverId === activePartner?.id) ||
        (normalizedMsg.roomId && activePartner && normalizedMsg.roomId === `conversation:${Math.min(currentUserId || 0, activePartner.id)}_${Math.max(currentUserId || 0, activePartner.id)}`));

    const isRoomChatWithActiveRoom =
      Boolean(activeRoomId) &&
      Boolean(normalizedMsg.roomId) &&
      normalizedMsg.roomId === activeRoomId;

    // 1. Thêm tin nhắn vào khung chat nếu đang mở đúng cuộc trò chuyện
    if (isDirectChatWithActivePartner || isRoomChatWithActiveRoom) {
      const isDuplicate = messages.some((m) => {
        if (m.id && normalizedMsg.id) return m.id === normalizedMsg.id;
        return (
          m.senderId === normalizedMsg.senderId &&
          m.content === normalizedMsg.content &&
          Math.abs(new Date(m.createdAt).getTime() - new Date(normalizedMsg.createdAt).getTime()) < 1000
        );
      });

      if (!isDuplicate) {
        set({ messages: [...messages, normalizedMsg] });
      }

      // Nếu người gửi là activePartner, tự động đánh dấu đã đọc
      if (activePartner && normalizedMsg.senderId === activePartner.id) {
        get().markConversationRead(activePartner.id);
      }
    }

    // 2. Cập nhật Sidebar Conversations nếu là tin nhắn 1-1
    if (isDirectMessage) {
      const partnerId =
        normalizedMsg.senderId === currentUserId
          ? (normalizedMsg.receiverId || 0)
          : normalizedMsg.senderId;

      if (partnerId > 0) {
        const existingIndex = conversations.findIndex((c) => c.partner.id === partnerId);
        const isActiveConversation = activePartner?.id === partnerId;

        let updatedConvs: Conversation[];
        if (existingIndex >= 0) {
          const existing = conversations[existingIndex];
          const newUnread = isActiveConversation
            ? 0
            : (existing.unreadCount || 0) + (normalizedMsg.senderId === currentUserId ? 0 : 1);

          const updatedConv: Conversation = {
            ...existing,
            lastMessage: {
              id: normalizedMsg.id,
              content: normalizedMsg.content,
              createdAt: normalizedMsg.createdAt,
              senderId: normalizedMsg.senderId,
            },
            unreadCount: newUnread,
          };

          updatedConvs = [
            updatedConv,
            ...conversations.filter((_, idx) => idx !== existingIndex),
          ];
        } else {
          // Thêm mới conversation
          const newConv: Conversation = {
            partner: {
              id: partnerId,
              name: normalizedMsg.sender?.name || `Người dùng #${partnerId}`,
              email: normalizedMsg.sender?.email || "",
              profile: {
                avatarUrl: normalizedMsg.sender?.avatarUrl || normalizedMsg.sender?.profile?.avatarUrl,
              },
            },
            lastMessage: {
              id: normalizedMsg.id,
              content: normalizedMsg.content,
              createdAt: normalizedMsg.createdAt,
              senderId: normalizedMsg.senderId,
            },
            unreadCount: isActiveConversation ? 0 : 1,
          };
          updatedConvs = [newConv, ...conversations];
        }

        const totalUnread = updatedConvs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        set({
          conversations: updatedConvs,
          unreadTotal: totalUnread,
        });
      }
    }
  },

  markConversationRead: async (partnerId: number) => {
    try {
      await chatApi.markAsRead(partnerId);

      const { conversations } = get();
      const updated = conversations.map((c) =>
        c.partner.id === partnerId ? { ...c, unreadCount: 0 } : c
      );
      const totalUnread = updated.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

      set({
        conversations: updated,
        unreadTotal: totalUnread,
      });
    } catch (err) {
      console.warn(`Failed to mark messages as read for partner ${partnerId}:`, err);
    }
  },

  setWsConnected: (connected: boolean) => {
    set({ isWsConnected: connected });
  },

  setupSocketListeners: (currentUserId?: number) => {
    const socket = getChatSocket();
    if (!socket) return () => {};

    // Gỡ các listener cũ trước để tránh duplicate khi re-mount
    socket.off('new_room_message');

    const handleConnect = () => {
      set({ isWsConnected: true });
      socket.emit('subscribe_notifications');
    };

    const handleDisconnect = () => {
      set({ isWsConnected: false });
    };

    const handleNewMessage = (msg: ChatMessage) => {
      const activeUserId = currentUserId || useAuthStore.getState().user?.id || 0;
      get().addMessage(msg, activeUserId);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_room_message', handleNewMessage);

    set({ isWsConnected: socket.connected });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_room_message', handleNewMessage);
    };
  },
}));

export default useChatStore;
