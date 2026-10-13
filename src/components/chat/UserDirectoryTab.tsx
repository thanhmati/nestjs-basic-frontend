import React, { useState, useEffect } from 'react';
import { Search, MessageSquarePlus, Users, MapPin } from 'lucide-react';
import type { User } from '../../types';
import { usersApi } from '../../api/users.api';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

interface UserDirectoryTabProps {
  onSelectUser: (user: User) => void;
}

export const UserDirectoryTab: React.FC<UserDirectoryTabProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fetchTimer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const data = await usersApi.getUsers(searchTerm, 50);
        if (!ignore) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to search users:', err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(fetchTimer);
    };
  }, [searchTerm]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Header */}
      <div className="p-3.5 border-b border-slate-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm thành viên theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 rounded-xl border border-slate-200/80 pl-8 pr-3 py-2 outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all placeholder:text-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {isLoading ? (
          <div className="p-3.5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-3 bg-slate-200 rounded" />
                  <div className="w-36 h-2 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs">
              {searchTerm
                ? 'Không tìm thấy người dùng nào phù hợp'
                : 'Danh sách thành viên trống'}
            </p>
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 p-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  src={u.profile?.avatarUrl}
                  alt={u.name}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {u.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {u.email}
                  </p>
                  {u.profile?.location && (
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                      {u.profile.location}
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectUser(u)}
                className="flex-shrink-0 text-xs py-1 px-2.5 rounded-xl border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200"
                leftIcon={<MessageSquarePlus className="w-3.5 h-3.5" />}
              >
                Nhắn tin
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDirectoryTab;
