import { apiClient } from '../services/api';
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types';

interface RawLoginResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  user?: User;
}

interface RawRegisterResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  user?: User;
}

export const authApi = {
  /**
   * Đăng nhập với email và mật khẩu
   * Backend trả về { accessToken: string }
   * Client tự động chuẩn hóa và lấy thông tin user profile
   */
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const raw = (await apiClient.post('/auth/login', data)) as RawLoginResponse;
    const token = raw?.accessToken || raw?.access_token || raw?.token;

    if (!token) {
      throw new Error('Máy chủ không trả về access token hợp lệ.');
    }

    // Lưu ngay token để các request tiếp theo có header Authorization
    localStorage.setItem('access_token', token);

    let user: User | null = raw?.user || null;

    // Nếu backend chỉ trả về accessToken, tự động gọi GET /users/profile để lấy thông tin người dùng
    if (!user) {
      try {
        user = (await apiClient.get('/users/profile')) as User;
      } catch (profileErr) {
        console.warn('Không thể tải profile từ API, giải mã từ JWT payload:', profileErr);
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join(''),
          );
          const payload = JSON.parse(jsonPayload);
          user = {
            id: payload.sub,
            email: payload.email,
            name: payload.email ? payload.email.split('@')[0] : 'User',
            role: payload.role || 'USER',
            profile: null,
          };
        } catch (jwtErr) {
          console.error('Lỗi giải mã JWT token:', jwtErr);
          user = {
            id: 0,
            email: data.email,
            name: data.email.split('@')[0],
            role: 'USER',
            profile: null,
          };
        }
      }
    }

    return {
      access_token: token,
      user,
    };
  },

  /**
   * Đăng ký tài khoản mới
   */
  register: async (data: RegisterDto): Promise<User> => {
    const raw = (await apiClient.post('/auth/register', data)) as RawRegisterResponse;

    const token = raw?.accessToken || raw?.access_token || raw?.token;
    if (token) {
      localStorage.setItem('access_token', token);
    }

    if (raw?.user) {
      return raw.user;
    }

    return raw as unknown as User;
  },
};

export default authApi;
