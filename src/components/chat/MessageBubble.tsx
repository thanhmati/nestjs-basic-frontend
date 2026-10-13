import React from 'react';
import dayjs from 'dayjs';
import type { ChatMessage } from '../../types';
import Avatar from '../common/Avatar';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
  showAvatar?: boolean;
  isRoom?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  showAvatar = true,
  isRoom = false,
}) => {
  const formattedTime = dayjs(message.createdAt).format('HH:mm');
  const senderAvatar =
    message.sender?.avatarUrl ||
    message.sender?.profile?.avatarUrl;
  const senderName = message.sender?.name || `Người dùng #${message.senderId}`;

  if (isMe) {
    return (
      <div className="flex justify-end mb-2.5">
        <div className="max-w-[82%] sm:max-w-[70%]">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-br-xs px-4 py-2.5 shadow-xs break-words">
            <p className="text-sm leading-relaxed whitespace-pre-wrap selection:bg-indigo-300 selection:text-indigo-900">
              {message.content}
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 text-right mr-1 font-medium">
            {formattedTime}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-2.5">
      {showAvatar ? (
        <Avatar
          src={senderAvatar}
          alt={senderName}
          size="sm"
          className="flex-shrink-0 mb-4"
        />
      ) : (
        <div className="w-8 flex-shrink-0" />
      )}

      <div className="max-w-[82%] sm:max-w-[70%]">
        {isRoom && (
          <p className="text-[11px] font-bold text-indigo-600 ml-1 mb-0.5 truncate max-w-xs">
            {senderName}
          </p>
        )}
        <div className="bg-slate-100/90 text-slate-800 rounded-2xl rounded-bl-xs px-4 py-2.5 shadow-xs border border-slate-200/60 break-words">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
