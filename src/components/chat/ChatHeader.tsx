import React from 'react';
import { ArrowLeft, Hash, LogOut, Radio } from 'lucide-react';
import type { ChatPartner } from '../../stores/chat.store';
import Avatar from '../common/Avatar';

interface ChatHeaderProps {
  partner?: ChatPartner | null;
  roomId?: string | null;
  isWsConnected: boolean;
  onBack?: () => void;
  onLeaveRoom?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  partner,
  roomId,
  isWsConnected,
  onBack,
  onLeaveRoom,
}) => {
  return (
    <div className="h-16 px-4 border-b border-slate-200/90 bg-white flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Back button for mobile */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="sm:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        {partner ? (
          <>
            <Avatar
              src={partner.avatarUrl}
              alt={partner.name}
              size="md"
              isOnline={isWsConnected}
            />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {partner.name}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isWsConnected ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
                <span className="truncate">
                  {isWsConnected ? 'Trực tuyến' : 'Đang kết nối lại...'}
                </span>
              </div>
            </div>
          </>
        ) : roomId ? (
          <>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              <Hash className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  Phòng #{roomId}
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-600" /> Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Phòng trò chuyện trực tuyến công khai
              </p>
            </div>
          </>
        ) : null}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {roomId && onLeaveRoom && (
          <button
            type="button"
            onClick={onLeaveRoom}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
            title="Rời phòng"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rời phòng</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
