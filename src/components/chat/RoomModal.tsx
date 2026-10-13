import React, { useState } from 'react';
import { Hash, Users, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomId: string) => void;
  currentRoomId?: string | null;
}

const PRESET_ROOMS = [
  { id: 'general', name: 'Phòng Chung', desc: 'Trò chuyện tự do cùng mọi người' },
  { id: 'dev-lounge', name: 'Góc Lập Trình', desc: 'Trao đổi kỹ thuật, NestJS & React' },
  { id: 'random', name: 'Chém Gió', desc: 'Chia sẻ ảnh, meme và chuyện thường ngày' },
  { id: 'announcements', name: 'Thông Báo', desc: 'Cập nhật tin tức mới từ ban quản trị' },
];

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onJoinRoom,
  currentRoomId,
}) => {
  const [customRoomId, setCustomRoomId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleJoin = (roomIdToJoin: string) => {
    const cleanId = roomIdToJoin.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!cleanId) {
      setError('Vui lòng nhập mã phòng hợp lệ (chữ cái, số hoặc dấu gạch nối).');
      return;
    }
    setError(null);
    onJoinRoom(cleanId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tham gia Phòng Trò Chuyện Nhóm"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Custom Room Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nhập mã phòng bạn muốn tham gia
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                #
              </span>
              <input
                type="text"
                placeholder="ví dụ: dev-room, chill-club..."
                value={customRoomId}
                onChange={(e) => {
                  setCustomRoomId(e.target.value);
                  setError(null);
                }}
                className="w-full text-xs sm:text-sm pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleJoin(customRoomId)}
              disabled={!customRoomId.trim()}
            >
              Vào phòng
            </Button>
          </div>
          {error && <p className="text-[11px] text-rose-600 mt-1">{error}</p>}
        </div>

        {/* Preset Rooms List */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Phòng gợi ý sẵn
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_ROOMS.map((room) => {
              const isCurrent = currentRoomId === room.id;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleJoin(room.id)}
                  className={`p-3 rounded-2xl border text-left transition-all group ${
                    isCurrent
                      ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                      : 'border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-indigo-500" />
                      {room.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">
                        Đang ở đây
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {room.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 flex items-start gap-2">
          <Users className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p>
            Mọi người dùng cùng tham gia chung một mã phòng sẽ nhận được tin nhắn của nhau theo thời gian thực (WebSockets).
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default RoomModal;
