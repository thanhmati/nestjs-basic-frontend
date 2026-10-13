import React, { useEffect, useRef } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../../types';
import type { ChatPartner } from '../../stores/chat.store';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import Spinner from '../common/Spinner';

interface ChatWindowProps {
  partner?: ChatPartner | null;
  roomId?: string | null;
  messages: ChatMessage[];
  isLoadingMessages: boolean;
  isWsConnected: boolean;
  currentUserId: number;
  onSendMessage: (content: string) => Promise<boolean>;
  onBack?: () => void;
  onLeaveRoom?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  partner,
  roomId,
  messages,
  isLoadingMessages,
  isWsConnected,
  currentUserId,
  onSendMessage,
  onBack,
  onLeaveRoom,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống đáy khi có tin nhắn mới hoặc đổi phòng
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingMessages]);

  const hasTarget = Boolean(partner || roomId);

  if (!hasTarget) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Chưa chọn cuộc trò chuyện
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
          Hãy chọn một cuộc hội thoại từ danh sách bên trái hoặc mở Danh bạ để bắt đầu trò chuyện với bạn bè!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <ChatHeader
        partner={partner}
        roomId={roomId}
        isWsConnected={isWsConnected}
        onBack={onBack}
        onLeaveRoom={onLeaveRoom}
      />

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/30">
        {isLoadingMessages ? (
          <div className="h-full flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-600">
              {partner
                ? `Bắt đầu cuộc trò chuyện với ${partner.name}`
                : `Chào mừng bạn đến với phòng #${roomId}!`}
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs">
              Hãy gửi tin nhắn đầu tiên để kết nối ngay bây giờ.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((msg, index) => {
              const isMe = msg.senderId === currentUserId;
              const nextMsg = messages[index + 1];
              // Ẩn avatar nếu tin nhắn kế tiếp cũng cùng người gửi
              const showAvatar = !nextMsg || nextMsg.senderId !== msg.senderId;

              return (
                <MessageBubble
                  key={msg.id || `${msg.senderId}-${msg.createdAt}-${index}`}
                  message={msg}
                  isMe={isMe}
                  showAvatar={showAvatar}
                  isRoom={Boolean(roomId)}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Box */}
      <ChatInput
        onSendMessage={onSendMessage}
        disabled={isLoadingMessages}
        placeholder={
          partner
            ? `Nhắn tin cho ${partner.name}...`
            : `Gửi tin nhắn vào phòng #${roomId}...`
        }
      />
    </div>
  );
};

export default ChatWindow;
