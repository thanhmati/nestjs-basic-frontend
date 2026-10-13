import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { authApi } from '../api/auth.api';
import { toast } from '../stores/toast.store';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import QuickFillBar from '../components/auth/QuickFillBar';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleLogin = async (loginEmail = email, loginPass = password) => {
    if (!loginEmail.trim() || !loginPass.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await authApi.login({
        email: loginEmail.trim(),
        password: loginPass,
      });

      setAuth(res.access_token, res.user);
      toast.success(`Chào mừng ${res.user?.name || 'bạn'} đã trở lại!`, 'Đăng nhập thành công');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('Login error:', err);
      const apiErr = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const msg = apiErr.response?.data?.message;
      let displayMsg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin hoặc kết nối máy chủ.';
      if (Array.isArray(msg)) {
        displayMsg = msg.join(', ');
      } else if (typeof msg === 'string') {
        displayMsg = msg;
      } else if (apiErr.message) {
        displayMsg = apiErr.message;
      }
      setErrorMessage(displayMsg);
      toast.error(displayMsg, 'Đăng nhập không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  const handleQuickFill = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    handleLogin(quickEmail, quickPass);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-100 mb-4">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Đăng Nhập Social Chat
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Kết nối và trò chuyện thời gian thực với cộng đồng của bạn
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200/90 rounded-3xl">
          {/* Quick Fill Component */}
          <QuickFillBar onSelectAccount={handleQuickFill} disabled={isLoading} />

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-700 leading-relaxed font-medium">
                {errorMessage}
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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

            <div>
              <Input
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Nhập mật khẩu của bạn"
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
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Đăng Nhập
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Chưa có tài khoản?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Đăng ký tài khoản mới
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
