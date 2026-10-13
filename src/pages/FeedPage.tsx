import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";
import type { Post, FeedResponse } from "../types";
import { postsApi } from "../api/posts.api";
import { toast } from "../stores/toast.store";
import CreatePostBox from "../components/posts/CreatePostBox";
import PostCard from "../components/posts/PostCard";
import Button from "../components/common/Button";

export const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Initial load and filter effect
  useEffect(() => {
    let ignore = false;

    async function loadInitialFeed() {
      try {
        const res = (await postsApi.getFeed(null, 10, searchQuery)) as FeedResponse;
        if (ignore) return;
        const cursor = res.meta?.nextCursor ?? res.nextCursor ?? null;
        const more = res.meta?.hasNextPage ?? res.hasMore ?? Boolean(cursor);
        setPosts(res.items || []);
        setNextCursor(cursor);
        setHasMore(more);
        setError(null);
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load feed:", err);
          setError(
            "Không thể kết nối đến máy chủ để tải bảng tin. Vui lòng kiểm tra lại kết nối backend.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInitialFeed();

    return () => {
      ignore = true;
    };
  }, [searchQuery]);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = (await postsApi.getFeed(null, 10, searchQuery)) as FeedResponse;
      const cursor = res.meta?.nextCursor ?? res.nextCursor ?? null;
      const more = res.meta?.hasNextPage ?? res.hasMore ?? Boolean(cursor);
      setPosts(res.items || []);
      setNextCursor(cursor);
      setHasMore(more);
    } catch (err) {
      console.error("Failed to refresh feed:", err);
      setError("Không thể tải bảng tin. Vui lòng kiểm tra lại kết nối backend.");
      toast.error("Lỗi khi tải bảng tin.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRefresh();
  };

  // Handle Load More
  const handleLoadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const res = (await postsApi.getFeed(nextCursor, 10, searchQuery)) as FeedResponse;
      const newItems = res.items || [];
      const cursor = res.meta?.nextCursor ?? res.nextCursor ?? null;
      const more = res.meta?.hasNextPage ?? res.hasMore ?? Boolean(cursor);
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filteredNew = newItems.filter((p) => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });
      setNextCursor(cursor);
      setHasMore(more);
    } catch (err) {
      console.error('Failed to load more posts:', err);
      toast.error('Không thể tải thêm bài viết.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Prepend newly created post
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Remove deleted post
  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Search Bar & Refresh Bar */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết theo tiêu đề hoặc nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-white rounded-2xl border border-slate-200/90 pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </form>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2.5 bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl text-slate-600 hover:text-indigo-600 shadow-2xs transition-colors flex-shrink-0 disabled:opacity-50"
          title="Làm mới bảng tin"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`}
          />
        </button>
      </div>

      {/* Create Post Box */}
      <CreatePostBox onPostCreated={handlePostCreated} />

      {/* Error State Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-xs text-rose-700 leading-relaxed font-medium max-w-md mx-auto">
            {error}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="bg-white"
          >
            Thử lại kết nối
          </Button>
        </div>
      )}

      {/* Feed List or Loading Skeletons */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 animate-pulse shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="space-y-2 flex-1">
                  <div className="w-28 h-3.5 bg-slate-200 rounded-md" />
                  <div className="w-16 h-2.5 bg-slate-100 rounded-md" />
                </div>
              </div>
              <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
              <div className="space-y-2">
                <div className="w-full h-3 bg-slate-100 rounded-md" />
                <div className="w-5/6 h-3 bg-slate-100 rounded-md" />
              </div>
              <div className="w-full h-44 bg-slate-100 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {searchQuery
              ? "Không tìm thấy bài viết nào phù hợp"
              : "Chưa có bài viết nào trên bảng tin"}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {searchQuery
              ? `Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm "${searchQuery}".`
              : "Hãy là người đầu tiên chia sẻ cảm nghĩ hoặc hình ảnh lên cộng đồng ngay bây giờ!"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="mt-4"
            >
              Xóa bộ lọc tìm kiếm
            </Button>
          )}
        </div>
      ) : (
        /* Post List */
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))}

          {/* Load More Button / Infinite Indicator */}
          {hasMore ? (
            <div className="text-center pt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={handleLoadMore}
                isLoading={isLoadingMore}
                className="w-full sm:w-auto px-8"
              >
                Tải thêm bài viết cũ hơn...
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>Bạn đã xem hết các bài viết mới nhất trên bảng tin!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
