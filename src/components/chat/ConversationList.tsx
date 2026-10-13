import React, { useState } from 'react';
import { Search, MessageSquare, Hash } from 'lucide-react';
import type { Conversation } from '../../types';
import type { ChatPartner } from '../../stores/chat.store';
import { formatRelativeTime } from '../../utils/format';
import Avatar from '../common/Avatar';

interface ConversationListProps {
  conversations: Conversation[];
  activePartnerId?: number | null;
  activeRoomId?: string | null;
  isLoading: boolean;
  onSelectPartner: (partner: ChatPartner) => void;
  onOpenRoomModal: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activePartnerId,
  activeRoomId,
  isLoading,
  onSelectPartner,
  onOpenRoomModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.partner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search & Actions Header */}
      <div className="p-3.5 border-b border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Gần đây ({conversations.length})
          </span>
          <button
            type="button"
            onClick={onOpenRoomModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            title="Tham gia hoặc tạo phòng chat nhóm"
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Phòng nhóm</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 rounded-xl border border-slate-200/80 pl-8 pr-3 py-2 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all placeholder:text-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Room indicator if in room */}
      {activeRoomId && (
        <div className="px-3.5 py-2.5 bg-indigo-50/70 border-b border-indigo-100/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              #
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-900">
                Phòng: {activeRoomId}
              </p>
              <p className="text-[10px] text-indigo-600">Đang trò chuyện nhóm</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenRoomModal}
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Đổi phòng
          </button>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-3.5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-3 bg-slate-200 rounded" />
                  <div className="w-36 h-2 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">
              {searchTerm
                ? 'Không tìm thấy cuộc trò chuyện nào'
                : 'Chưa có cuộc trò chuyện nào'}
            </p>
            <p className="text-[11px] text-slate-400">
              Chuyển sang tab "Danh bạ" để tìm và bắt đầu nhắn tin với mọi người!
            </p>
          </div>
        ) : (
          filteredConversations.map((c) => {
            const isSelected = activePartnerId === c.partner.id;
            return (
              <button
                key={c.partner.id}
                type="button"
                onClick={() =>
                  onSelectPartner({
                    id: c.partner.id,
                    name: c.partner.name,
                    email: c.partner.email,
                    avatarUrl: c.partner.profile?.avatarUrl,
                  })
                }
                className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-indigo-50/80 border-r-2 border-indigo-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar
                    src={c.partner.profile?.avatarUrl}
                    alt={c.partner.name}
                    size="md"
                  />
                  {c.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs ring-2 ring-white">
                      {c.unreadCount > 99 ? '99+' : c.unreadCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-xs truncate ${
                        c.unreadCount > 0
                          ? 'font-bold text-slate-900'
                          : 'font-semibold text-slate-800'
                      }`}
                    >
                      {c.partner.name}
                    </span>
                    {c.lastMessage?.createdAt && (
                      <span className="text-[10px] text-slate-400 flex-shrink-0">
                        {formatRelativeTime(c.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] truncate ${
                      c.unreadCount > 0
                        ? 'font-semibold text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {c.lastMessage?.content || 'Chưa có tin nhắn'}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;
