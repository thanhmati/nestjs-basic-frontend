import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Shield,
  MapPin,
  Calendar,
  MessageSquarePlus,
  ArrowLeft,
  User as UserIcon,
  Edit3,
} from 'lucide-react';
import dayjs from 'dayjs';
import type { User } from '../types';
import { usersApi } from '../api/users.api';
import { useAuthStore } from '../stores/auth.store';
import { useChatStore } from '../stores/chat.store';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const { setActivePartner } = useChatStore();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const userId = Number(id);

    async function loadUser() {
      if (!userId || isNaN(userId)) {
        if (!ignore) {
          setError('Mã người dùng không hợp lệ.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await usersApi.getUserById(userId);
        if (!ignore) {
          setProfileUser(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load user profile:', err);
          setError('Không tìm thấy thông tin thành viên hoặc người dùng không tồn tại.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleStartChat = () => {
    if (!profileUser) return;
    setActivePartner({
      id: profileUser.id,
      name: profileUser.name,
      email: profileUser.email,
      avatarUrl: profileUser.profile?.avatarUrl,
    });
    navigate('/chat');
  };

  const isMe = Boolean(currentUser && profileUser && currentUser.id === profileUser.id);
  const memberSince = profileUser?.createdAt
    ? dayjs(profileUser.createdAt).format('DD/MM/YYYY')
    : 'Gần đây';

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-16 flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" />
        <p className="text-xs text-slate-400">Đang tải hồ sơ thành viên...</p>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <UserIcon className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold text-slate-800">
          Không tìm thấy thành viên
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {error || 'Người dùng này không tồn tại hoặc đã bị xóa khỏi hệ thống.'}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden pb-6">
      {/* Cover Banner */}
      <div className="h-32 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-3.5 left-3.5 p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white transition-colors backdrop-blur-xs flex items-center gap-1.5 text-xs font-semibold"
          title="Quay lại"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
      </div>

      {/* Profile Info Area */}
      <div className="px-6 relative">
        <div className="-mt-14 mb-4 flex items-end justify-between">
          <Avatar
            src={profileUser.profile?.avatarUrl}
            alt={profileUser.name}
            size="xl"
            className="ring-4 ring-white shadow-md"
            isOnline
          />

          {/* Action Button: Chat or Edit */}
          {isMe ? (
            <Link to="/profile">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                className="rounded-2xl"
              >
                Hồ sơ của bạn
              </Button>
            </Link>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleStartChat}
              leftIcon={<MessageSquarePlus className="w-3.5 h-3.5" />}
              className="rounded-2xl"
            >
              Nhắn tin
            </Button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900">{profileUser.name}</h1>
            {profileUser.role === 'ADMIN' ? (
              <Badge variant="danger" size="sm">
                <Shield className="w-3.5 h-3.5 mr-1 inline" /> Admin
              </Badge>
            ) : (
              <Badge variant="primary" size="sm">
                User
              </Badge>
            )}
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
            <Mail className="w-3.5 h-3.5 text-slate-400" /> {profileUser.email}
          </p>

          {/* Bio */}
          <div className="mb-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Tiểu sử
            </h3>
            {profileUser.profile?.bio ? (
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap">
                {profileUser.profile.bio}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                Thành viên chưa cập nhật tiểu sử cá nhân.
              </p>
            )}
          </div>

          {/* Location & Join Date */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
              <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span className="truncate">
                {profileUser.profile?.location || 'Chưa cập nhật vị trí'}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
              <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>Tham gia từ: {memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
