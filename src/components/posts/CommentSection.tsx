import React, { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import type { Comment } from '../../types';
import { useAuthStore } from '../../stores/auth.store';
import { commentsApi, type CommentListResponse } from '../../api/comments.api';
import { toast } from '../../stores/toast.store';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import CommentItem from './CommentItem';

interface CommentSectionProps {
  postId: number;
  postAuthorId: number;
  onCommentCountChange?: (delta: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  postAuthorId,
  onCommentCountChange,
}) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadInitial() {
      try {
        const res = await commentsApi.getComments(postId, null, 10);
        if (ignore) return;
        if (Array.isArray(res)) {
          setComments(res);
          setHasMore(false);
          setNextCursor(null);
        } else {
          const data = res as CommentListResponse;
          setComments(data.items || []);
          setNextCursor(data.nextCursor ?? null);
          setHasMore(Boolean(data.hasMore || data.nextCursor));
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to load comments:', err);
          toast.error('Không thể tải danh sách bình luận.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      ignore = true;
    };
  }, [postId]);

  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const res = await commentsApi.getComments(postId, nextCursor, 10);
      if (Array.isArray(res)) {
        setComments((prev) => [...prev, ...res]);
        setHasMore(false);
        setNextCursor(null);
      } else {
        const data = res as CommentListResponse;
        setComments((prev) => [...prev, ...(data.items || [])]);
        setNextCursor(data.nextCursor ?? null);
        setHasMore(Boolean(data.hasMore || data.nextCursor));
      }
    } catch (err) {
      console.error('Failed to load more comments:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      setIsSubmitting(true);
      const created = await commentsApi.createComment(postId, newContent.trim());
      setComments((prev) => [...prev, created]);
      setNewContent('');
      onCommentCountChange?.(1);
      toast.success('Đã gửi bình luận!');
    } catch (err) {
      console.error('Failed to post comment:', err);
      toast.error('Không thể gửi bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentsApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      onCommentCountChange?.(-1);
      toast.success('Đã xóa bình luận thành công.');
    } catch (err) {
      console.error('Failed to delete comment:', err);
      toast.error('Không thể xóa bình luận.');
      throw err;
    }
  };

  return (
    <div className="pt-4 mt-4 border-t border-slate-100 space-y-4 animate-fade-in">
      {/* Create Comment Form */}
      <form onSubmit={handleSubmit} className="flex items-start gap-2.5">
        <Avatar
          src={user?.profile?.avatarUrl}
          alt={user?.name || 'User'}
          size="sm"
        />
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            placeholder="Viết câu trả lời hoặc thảo luận..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            disabled={isSubmitting}
            className="w-full text-xs rounded-xl bg-slate-50 border border-slate-200/90 pl-3.5 pr-10 py-2.5 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newContent.trim()}
            className="absolute right-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-40 p-1 rounded-lg transition-colors"
            title="Gửi bình luận"
          >
            {isSubmitting ? (
              <Spinner size="sm" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </form>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-4 text-center">
          <Spinner size="sm" className="text-slate-400" />
        </div>
      ) : comments.length === 0 ? (
        <div className="py-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chưa có bình luận nào. Hãy là người đầu tiên tham gia thảo luận!</span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoadMore}
                isLoading={isLoadingMore}
                className="text-xs text-indigo-600 hover:text-indigo-700 py-1"
              >
                Xem thêm các bình luận cũ hơn...
              </Button>
            </div>
          )}

          {/* List of comments */}
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postAuthorId={postAuthorId}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
