import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, MessageCircle, Sparkles } from 'lucide-react';
import { useNotificationStore } from '../../stores/notification.store';
import { formatRelativeTime } from '../../utils/format';
import Spinner from '../common/Spinner';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    items,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasNextPage,
    fetchNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    setupSocketListener,
  } = useNotificationStore();

  // Khởi tạo lấy danh sách thông báo và listener socket
  useEffect(() => {
    fetchNotifications();
    const cleanup = setupSocketListener();
    return cleanup;
  }, [fetchNotifications, setupSocketListener]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && items.length === 0) {
      fetchNotifications();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        title="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200/90 shadow-2xl py-2 z-50 animate-slide-up">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đã đọc tất cả</span>
              </button>
            )}
          </div>

          {/* List of Notifications */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {isLoading && items.length === 0 ? (
              <div className="py-8 text-center">
                <Spinner size="md" />
              </div>
            ) : items.length === 0 ? (
              <div className="py-8 px-4 text-center text-slate-400 space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  Bạn không có thông báo nào
                </p>
                <p className="text-[11px] text-slate-400">
                  Khi có người bình luận bài viết của bạn, thông báo sẽ hiển thị ở đây.
                </p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.isRead) markAsRead(item.id);
                    }}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      item.isRead ? 'hover:bg-slate-50 opacity-80' : 'bg-indigo-50/40 hover:bg-indigo-50/70'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        item.isRead
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-indigo-600 text-white shadow-xs'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p
                          className={`text-xs truncate ${
                            item.isRead ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'
                          }`}
                        >
                          {item.title}
                        </p>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}

                {hasNextPage && (
                  <div className="p-2.5 text-center bg-slate-50/80">
                    <button
                      type="button"
                      disabled={isLoadingMore}
                      onClick={loadMoreNotifications}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors disabled:opacity-50"
                    >
                      {isLoadingMore ? 'Đang tải...' : 'Xem thông báo cũ hơn'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
