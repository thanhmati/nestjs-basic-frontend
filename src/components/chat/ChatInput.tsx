import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<boolean>;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Nhập tin nhắn của bạn...',
}) => {
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isComposingRef = useRef(false);
  const isSendingRef = useRef(false);

  useEffect(() => {
    // Tự động focus ô nhập tin nhắn khi đổi hội thoại
    inputRef.current?.focus();
  }, [disabled]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isComposingRef.current || isSendingRef.current || isSending || disabled) return;

    const trimmed = content.trim();
    if (!trimmed) return;

    try {
      isSendingRef.current = true;
      setIsSending(true);
      const success = await onSendMessage(trimmed);
      if (success) {
        setContent('');
        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.style.height = 'auto';
        }
      }
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // Ngăn chặn Enter gửi tin nhắn khi đang gõ tiếng Việt (IME composition: Unikey, EVKey, macOS Telex)
      if (isComposingRef.current || e.nativeEvent.isComposing || e.keyCode === 229) {
        return;
      }
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Tự động điều chỉnh chiều cao theo nội dung (tối đa 120px)
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-3.5 border-t border-slate-200/80 bg-white flex items-end gap-2.5"
    >
      <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200/90 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all px-3.5 py-2">
        <textarea
          ref={inputRef}
          rows={1}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            // Đặt độ trễ ngắn để tránh trình duyệt (đặc biệt là Safari/WebKit trên macOS)
            // kích hoạt sự kiện keydown Enter ngay sau khi compositionend
            setTimeout(() => {
              isComposingRef.current = false;
            }, 30);
          }}
          disabled={disabled || isSending}
          placeholder={placeholder}
          className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none resize-none p-0 max-h-28"
        />
      </div>

      <button
        type="submit"
        disabled={!content.trim() || isSending || disabled}
        className="h-10 w-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex-shrink-0 shadow-xs"
        title="Gửi tin nhắn (Enter)"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};

export default ChatInput;
