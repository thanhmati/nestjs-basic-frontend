import React, { useState, useRef } from 'react';
import {
  Mail,
  Shield,
  MapPin,
  Calendar,
  Camera,
  Edit3,
  Check,
  X,
  User as UserIcon,
  FileText,
} from 'lucide-react';
import dayjs from 'dayjs';
import { useAuthStore } from '../stores/auth.store';
import { usersApi } from '../api/users.api';
import { toast } from '../stores/toast.store';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [location, setLocation] = useState(user?.profile?.location || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size <= 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Dung lượng ảnh đại diện tối đa là 2MB.');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const res = await usersApi.uploadAvatar(file);
      if (res && res.url) {
        updateUser({
          profile: {
            avatarUrl: res.url,
          },
        });
        toast.success('Đã cập nhật ảnh đại diện thành công!', 'Thành công');
      }
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      toast.error('Không thể tải lên ảnh đại diện. Vui lòng thử lại.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Họ và tên không được để trống.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const updated = await usersApi.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
      });

      updateUser({
        name: updated.name,
        profile: updated.profile,
      });

      setIsEditing(false);
      toast.success('Hồ sơ của bạn đã được cập nhật thành công!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Không thể cập nhật hồ sơ. Vui lòng thử lại sau.');
      toast.error('Cập nhật hồ sơ thất bại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setBio(user?.profile?.bio || '');
    setLocation(user?.profile?.location || '');
    setError(null);
    setIsEditing(false);
  };

  const memberSince = user?.createdAt
    ? dayjs(user.createdAt).format('DD/MM/YYYY')
    : 'Gần đây';

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden pb-6">
      {/* Cover Banner */}
      <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Profile Header Area */}
      <div className="px-6 relative">
        <div className="-mt-14 mb-4 flex items-end justify-between">
          {/* Avatar with Upload Overlay */}
          <div className="relative group">
            <Avatar
              src={user?.profile?.avatarUrl}
              alt={user?.name || 'User'}
              size="xl"
              className="ring-4 ring-white shadow-md"
              isOnline
            />

            {/* Upload Button Overlay */}
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
              title="Thay đổi ảnh đại diện"
            >
              {isUploadingAvatar ? (
                <Spinner size="sm" className="text-white" />
              ) : (
                <Camera className="w-5 h-5 drop-shadow" />
              )}
            </button>

            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Action Button: Edit Profile */}
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              className="rounded-2xl"
            >
              Chỉnh sửa hồ sơ
            </Button>
          ) : (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hủy</span>
            </button>
          )}
        </div>

        {/* View Mode or Edit Mode */}
        {!isEditing ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
              {user?.role === 'ADMIN' ? (
                <Badge variant="danger" size="sm">
                  <Shield className="w-3 h-3 mr-1 inline" /> Admin
                </Badge>
              ) : (
                <Badge variant="primary" size="sm">
                  User
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}
            </p>

            {/* Bio */}
            <div className="mb-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Tiểu sử
              </h3>
              {user?.profile?.bio ? (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap">
                  {user.profile.bio}
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  Chưa cập nhật tiểu sử cá nhân.
                </p>
              )}
            </div>

            {/* Metadata Info Grid */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="truncate">
                  {user?.profile?.location || 'Chưa cập nhật vị trí'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>Tham gia từ: {memberSince}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Profile Form */
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Chỉnh sửa thông tin cá nhân
            </h2>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập họ và tên..."
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                  required
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Location Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nơi sinh sống / Làm việc
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ví dụ: Hà Nội, Việt Nam..."
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Bio Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tiểu sử cá nhân (Bio)
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Chia sẻ đôi điều về bạn..."
                  className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all resize-none"
                />
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSaving}
                leftIcon={<Check className="w-3.5 h-3.5" />}
              >
                Lưu thay đổi
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
