import React, { useState, useEffect } from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { useChatStore, type ChatPartner } from '../stores/chat.store';
import type { User } from '../types';
import ConversationList from '../components/chat/ConversationList';
import UserDirectoryTab from '../components/chat/UserDirectoryTab';
import ChatWindow from '../components/chat/ChatWindow';
import RoomModal from '../components/chat/RoomModal';

export const ChatPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    conversations,
    activePartner,
    activeRoomId,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isWsConnected,
    unreadTotal,
    fetchConversations,
    setActivePartner,
    setActiveRoom,
    sendMessage,
    setupSocketListeners,
  } = useChatStore();

  const [activeTab, setActiveTab] = useState<'conversations' | 'directory'>('conversations');
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  // Khởi tạo conversations và Socket Listeners khi vào trang Chat
  useEffect(() => {
    fetchConversations();
    if (user?.id) {
      const cleanup = setupSocketListeners(user.id);
      return cleanup;
    }
  }, [user?.id, isWsConnected, fetchConversations, setupSocketListeners]);

  const handleSelectPartner = (partner: ChatPartner) => {
    setActivePartner(partner);
  };

  const handleSelectUserFromDirectory = (selectedUser: User) => {
    setActivePartner({
      id: selectedUser.id,
      name: selectedUser.name,
      email: selectedUser.email,
      avatarUrl: selectedUser.profile?.avatarUrl,
    });
    setActiveTab('conversations');
  };

  const handleJoinRoom = (roomId: string) => {
    setActiveRoom(roomId);
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
  };

  const hasSelectedChat = Boolean(activePartner || activeRoomId);

  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[500px] bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex">
      {/* Cột trái: Sidebar Hội Thoại / Danh Bạ */}
      <div
        className={`w-full sm:w-80 md:w-96 flex flex-col border-r border-slate-200/90 bg-white ${
          hasSelectedChat ? 'hidden sm:flex' : 'flex'
        }`}
      >
        {/* Switch Tabs (Hội Thoại vs Danh Bạ) */}
        <div className="p-2.5 bg-slate-50/80 border-b border-slate-200/80 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('conversations')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'conversations'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Hội thoại</span>
            {unreadTotal > 0 && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadTotal > 99 ? '99+' : unreadTotal}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'directory'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Danh bạ</span>
          </button>
        </div>

        {/* Nội dung Tab */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'conversations' ? (
            <ConversationList
              conversations={conversations}
              activePartnerId={activePartner?.id}
              activeRoomId={activeRoomId}
              isLoading={isLoadingConversations}
              onSelectPartner={handleSelectPartner}
              onOpenRoomModal={() => setIsRoomModalOpen(true)}
            />
          ) : (
            <UserDirectoryTab onSelectUser={handleSelectUserFromDirectory} />
          )}
        </div>
      </div>

      {/* Cột phải: Khung Chat Chính (ChatWindow) */}
      <div
        className={`flex-1 flex flex-col bg-white ${
          !hasSelectedChat ? 'hidden sm:flex' : 'flex'
        }`}
      >
        <ChatWindow
          partner={activePartner}
          roomId={activeRoomId}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          isWsConnected={isWsConnected}
          currentUserId={user?.id || 0}
          onSendMessage={sendMessage}
          onBack={() => {
            setActivePartner(null);
            setActiveRoom(null);
          }}
          onLeaveRoom={handleLeaveRoom}
        />
      </div>

      {/* Modal Chat Nhóm (Room Modal) */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        onJoinRoom={handleJoinRoom}
        currentRoomId={activeRoomId}
      />
    </div>
  );
};

export default ChatPage;
