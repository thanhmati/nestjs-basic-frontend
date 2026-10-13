import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Comment } from '../../types';
import { useAuthStore } from '../../stores/auth.store';
import { formatRelativeTime } from '../../utils/format';
import Avatar from '../common/Avatar';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface CommentItemProps {
  comment: Comment;
  postAuthorId: number;
  onDelete: (commentId: number) => Promise<void>;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postAuthorId,
  onDelete,
}) => {
  const { user } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quyền xóa: chính tác giả bình luận, chủ bài viết, hoặc ADMIN
  const canDelete =
    Boolean(user) &&
    (user?.id === comment.authorId ||
      user?.id === postAuthorId ||
      user?.role === 'ADMIN');

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await onDelete(comment.id);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-start gap-2.5 group">
      <Avatar
        src={comment.author.profile?.avatarUrl}
        alt={comment.author.name}
        size="sm"
      />

      <div className="flex-1 min-w-0">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 inline-block max-w-full">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-900 truncate">
              {comment.author.name}
            </span>
            <span className="text-[10px] text-slate-400">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>

        {canDelete && (
          <div className="mt-1 ml-1 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Xóa</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xóa bình luận"
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
              onClick={handleDeleteConfirm}
            >
              Xác nhận xóa
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  );
};

export default CommentItem;
