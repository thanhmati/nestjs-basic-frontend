import React from 'react';
import { UserCheck, Shield, Sparkles } from 'lucide-react';
import Avatar from '../common/Avatar';

interface QuickFillBarProps {
  onSelectAccount: (email: string, pass: string) => void;
  disabled?: boolean;
}

export const QuickFillBar: React.FC<QuickFillBarProps> = ({ onSelectAccount, disabled }) => {
  const accounts = [
    {
      name: 'Alice',
      email: 'alice@example.com',
      role: 'USER',
      roleLabel: 'User A (Sender)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      name: 'Bob',
      email: 'bob@example.com',
      role: 'USER',
      roleLabel: 'User B (Receiver)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      name: 'Admin',
      email: 'admin@socialchat.com',
      role: 'ADMIN',
      roleLabel: 'Administrator',
      avatar: null,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 my-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Quick-Fill Tài Khoản Kiểm Thử
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
        Bấm 1 chạm để tự động điền và đăng nhập ngay với tài khoản mẫu (Mật khẩu: <code className="font-mono text-slate-700 bg-slate-200/70 px-1 py-0.5 rounded text-[11px]">Password@123</code>):
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {accounts.map((acc) => (
          <button
            key={acc.email}
            type="button"
            disabled={disabled}
            onClick={() => onSelectAccount(acc.email, 'Password@123')}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-xs active:scale-[0.98] transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Avatar src={acc.avatar} alt={acc.name} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                  {acc.name}
                </span>
                {acc.role === 'ADMIN' ? (
                  <Shield className="w-3 h-3 text-rose-500 flex-shrink-0" />
                ) : (
                  <UserCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 block truncate">
                {acc.roleLabel}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFillBar;
