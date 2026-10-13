import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Heart,
  Share2,
  Trash2,
  Globe,
  Lock,
  Shield,
} from 'lucide-react';
import type { Post } from '../../types';
import { useAuthStore } from '../../stores/auth.store';
import { postsApi } from '../../api/posts.api';
import { formatRelativeTime } from '../../utils/format';
import { parsePostContentAndImages } from '../../utils/media';
import { toast } from '../../stores/toast.store';
import Avatar from '../common/Avatar';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ImageGallery from './ImageGallery';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  onPostDeleted: (postId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostDeleted }) => {
  const { user } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post._count?.comments ?? 0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quyền xóa: Tác giả bài viết hoặc Quản trị viên (ADMIN)
  const canDelete =
    Boolean(user) &&
    (user?.id === post.authorId || user?.role === 'ADMIN');

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await postsApi.deletePost(post.id);
      toast.success('Đã xóa bài viết thành công.');
      setShowDeleteModal(false);
      onPostDeleted(post.id);
    } catch (err) {
      console.error('Failed to delete post:', err);
      toast.error('Không thể xóa bài viết. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin);
    toast.info('Đã sao chép liên kết vào bộ nhớ tạm!');
  };

  return (
    <article className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 transition-all hover:border-slate-300/80">
      {/* Header: Author & Options */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <Link to={`/users/${post.authorId}`}>
            <Avatar
              src={post.author.profile?.avatarUrl}
              alt={post.author.name}
              size="md"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/users/${post.authorId}`}
                className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate"
              >
                {post.author.name}
              </Link>
              {post.author.role === 'ADMIN' && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <Shield className="w-2.5 h-2.5" /> Admin
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
              <span>{formatRelativeTime(post.createdAt)}</span>
              <span>•</span>
              {post.published ? (
                <span className="flex items-center gap-1 text-slate-400" title="Công khai">
                  <Globe className="w-3 h-3" /> Công khai
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500" title="Riêng tư">
                  <Lock className="w-3 h-3" /> Riêng tư
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delete button (Chỉ hiện cho author hoặc admin) */}
        {canDelete && (
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            title="Xóa bài viết"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Post Title */}
      <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
        {post.title}
      </h3>

      {/* Post Text Body */}
      {(() => {
        const { cleanContent, images } = parsePostContentAndImages(post.content, post.images);
        return (
          <>
            {cleanContent && (
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {cleanContent}
              </p>
            )}

            {/* Image Gallery */}
            {images.length > 0 && (
              <ImageGallery images={images} />
            )}
          </>
        );
      })()}

      {/* Social Action Bar */}
      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-5">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              isLiked ? 'text-rose-600' : 'hover:text-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{likeCount > 0 ? likeCount : 'Thích'}</span>
          </button>

          {/* Comment Toggle Button */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              showComments ? 'text-indigo-600' : 'hover:text-slate-800'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentCount > 0 ? `${commentCount} Bình luận` : 'Bình luận'}</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 font-medium hover:text-slate-800 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Chia sẻ</span>
        </button>
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          postAuthorId={post.authorId}
          onCommentCountChange={(delta) =>
            setCommentCount((prev) => Math.max(0, prev + delta))
          }
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa bài viết"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Xác nhận xóa
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Bạn có chắc chắn muốn xóa bài viết này không? Toàn bộ hình ảnh và bình luận liên quan sẽ bị xóa vĩnh viễn và không thể khôi phục.
        </p>
      </Modal>
    </article>
  );
};

export default PostCard;
