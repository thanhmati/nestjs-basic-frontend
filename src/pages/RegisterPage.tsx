import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { authApi } from '../api/auth.api';
import { toast } from '../stores/toast.store';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải có độ dài tối thiểu từ 6 ký tự trở lên.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp với mật khẩu đã nhập.');
      return;
    }

    try {
      setIsLoading(true);
      // 1. Gọi API đăng ký
      await authApi.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      toast.success('Đăng ký tài khoản thành công! Đang tự động đăng nhập...', 'Thành công');

      // 2. Tự động đăng nhập ngay sau khi đăng ký
      try {
        const loginRes = await authApi.login({
          email: email.trim(),
          password,
        });
        setAuth(loginRes.access_token, loginRes.user);
        navigate('/', { replace: true });
      } catch {
        // Fallback về trang login nếu auto-login không thành công
        navigate('/login', { replace: true });
      }
    } catch (err: unknown) {
      console.error('Register error:', err);
      const apiErr = err as { response?: { status?: number; data?: { message?: string | string[] } } };
      if (apiErr.response?.status === 409) {
        setErrorMessage('Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.');
      } else {
        const msg = apiErr.response?.data?.message;
        if (Array.isArray(msg)) {
          setErrorMessage(msg.join(', '));
        } else if (typeof msg === 'string') {
          setErrorMessage(msg);
        } else {
          setErrorMessage('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
        }
      }
      toast.error('Không thể hoàn tất đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-100 mb-4">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tạo Tài Khoản Mới
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Gia nhập nền tảng Social Chat để kết nối cùng bạn bè
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200/90 rounded-3xl">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700 leading-relaxed font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Họ và tên"
              type="text"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="Địa chỉ Email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Mật khẩu (tối thiểu 6 ký tự)"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              placeholder="Nhập mật khẩu bí mật"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <Input
              label="Xác nhận mật khẩu"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Đăng Ký Tài Khoản
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
