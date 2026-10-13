export * from './api.generated';

// Standard Backend Envelope
export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

// User & Profile
export type UserRole = 'USER' | 'ADMIN';

export interface UserProfile {
  id?: number;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileDto {
  name?: string;
  bio?: string;
  location?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  profile?: UserProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

// Authentication
export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

// Posts & Feed
export interface PostImage {
  id?: number;
  url: string;
  filename?: string;
  postId?: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    role?: UserRole;
    profile?: {
      avatarUrl?: string | null;
      bio?: string | null;
    } | null;
  };
  images?: PostImage[];
  _count?: {
    comments: number;
  };
}

export interface FeedResponse {
  items: Post[];
  nextCursor?: number | null;
  hasMore?: boolean;
  meta?: {
    take?: number;
    nextCursor?: number | null;
    hasNextPage?: boolean;
  };
}

export interface CreatePostDto {
  title: string;
  content: string;
  published?: boolean;
  imageUrls?: string[];
}

// Comments
export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email: string;
    profile?: {
      avatarUrl?: string | null;
    } | null;
  };
}

// Chat & Conversations
export interface Conversation {
  partner: {
    id: number;
    name: string;
    email: string;
    profile?: {
      avatarUrl?: string | null;
    } | null;
  };
  lastMessage: {
    id: number;
    content: string;
    createdAt: string;
    senderId: number;
  };
  unreadCount: number;
}

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  receiverId?: number | null;
  roomId?: string | null;
  createdAt: string;
  sender?: {
    id: number;
    name: string;
    email?: string;
    avatarUrl?: string | null;
    profile?: {
      avatarUrl?: string | null;
    } | null;
  };
}

export interface SendMessagePayload {
  content: string;
  receiverId?: number;
  roomId?: string;
}

// Notifications
export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  isRead: boolean;
  userId?: number;
  createdAt: string;
  type?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationsResponse {
  items: NotificationItem[];
  meta: {
    limit: number;
    nextCursor?: number | null;
    hasNextPage: boolean;
    unreadCount: number;
  };
}

