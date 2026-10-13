import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Send, X, Globe, Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { postsApi } from '../../api/posts.api';
import { toast } from '../../stores/toast.store';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import type { Post } from '../../types';

interface CreatePostBoxProps {
  onPostCreated: (newPost: Post) => void;
}

interface ImagePreview {
  file: File;
  previewUrl: string;
}

export const CreatePostBox: React.FC<CreatePostBoxProps> = ({ onPostCreated }) => {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);
  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (selectedImages.length + files.length > 5) {
      setError('Chỉ được chọn tối đa 5 hình ảnh cho mỗi bài viết.');
      return;
    }

    const validNewImages: ImagePreview[] = [];
    for (const file of files) {
      // Validate file size (<= 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} vượt quá dung lượng cho phép (tối đa 5MB).`);
        return;
      }
      validNewImages.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    setSelectedImages((prev) => [...prev, ...validNewImages]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => {
      const removed = prev[index];
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề bài viết.');
      return;
    }
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung bài viết.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let uploadedUrls: string[] = [];

      // 1. Upload ảnh nếu có
      if (selectedImages.length > 0) {
        const filesToUpload = selectedImages.map((img) => img.file);
        const uploadRes = await postsApi.uploadImages(filesToUpload);
        if (uploadRes && Array.isArray(uploadRes.items)) {
          uploadedUrls = uploadRes.items.map((item) => item.url);
        }
      }

      // 2. Format nội dung bài viết kèm ảnh markdown nếu có
      let finalContent = content.trim();
      if (uploadedUrls.length > 0) {
        const imageMarkdown = uploadedUrls.map((url) => `![image](${url})`).join('\n');
        finalContent = `${finalContent}\n\n${imageMarkdown}`;
      }

      // 3. Tạo bài viết (chỉ gửi title, content, published theo Backend DTO)
      const newPost = await postsApi.createPost({
        title: title.trim(),
        content: finalContent,
        published,
      });

      // 4. Reset form
      setTitle('');
      setContent('');
      setSelectedImages((prev) => {
        prev.forEach((img) => URL.revokeObjectURL(img.previewUrl));
        return [];
      });

      // Gắn đầy đủ thông tin author/profile của user hiện tại cho bài viết mới
      const postWithAuthor: Post = {
        ...newPost,
        author: {
          id: user?.id || newPost.author?.id || 0,
          name: user?.name || newPost.author?.name || 'Tài khoản',
          email: user?.email || newPost.author?.email || '',
          role: user?.role,
          profile: user?.profile,
        },
      };

      toast.success('Bài viết của bạn đã được đăng thành công!', 'Thành công');
      onPostCreated(postWithAuthor);
    } catch (err: unknown) {
      console.error('Failed to create post:', err);
      const apiErr = err as { response?: { data?: { message?: string | string[] } } };
      const msg = apiErr.response?.data?.message;
      if (Array.isArray(msg)) {
        setError(msg.join(', '));
      } else if (typeof msg === 'string') {
        setError(msg);
      } else {
        setError('Không thể đăng bài viết. Vui lòng thử lại sau.');
      }
      toast.error('Đăng bài thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all">
      <div className="flex items-start gap-3.5 mb-4">
        <Avatar
          src={user?.profile?.avatarUrl}
          alt={user?.name || 'User'}
          size="md"
          isOnline
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {user?.name || 'Tài khoản'}
            </h3>
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              {published ? (
                <>
                  <Globe className="w-3 h-3 text-emerald-600" /> Công khai
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-600" /> Riêng tư
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Chia sẻ câu chuyện hoặc khoảnh khắc của bạn với mọi người
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-rose-700 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Title Input */}
        <input
          type="text"
          placeholder="Tiêu đề bài viết..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="w-full text-base font-semibold text-slate-900 placeholder:text-slate-400 border-none outline-none focus:ring-0 p-0 bg-transparent"
        />

        {/* Content Textarea */}
        <textarea
          rows={3}
          placeholder="Bạn đang nghĩ gì hôm nay?..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          className="w-full text-sm text-slate-800 placeholder:text-slate-400 border-none outline-none focus:ring-0 resize-none p-0 bg-transparent"
        />

        {/* Selected Images Thumbnail Previews */}
        {selectedImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-2">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={img.previewUrl}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                  title="Xóa ảnh"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Bottom Toolbar & Submit Button */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={isLoading || selectedImages.length >= 5}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ImageIcon className="w-4 h-4 text-indigo-500" />
              <span>Thêm ảnh ({selectedImages.length}/5)</span>
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Đăng bài
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostBox;
