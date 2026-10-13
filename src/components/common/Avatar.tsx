import React from 'react';
import { getMediaUrl } from '../../utils/media';

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User',
  size = 'md',
  isOnline,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const dotSizeMap = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0 ring-1',
    md: 'w-2.5 h-2.5 bottom-0 right-0 ring-2',
    lg: 'w-3 h-3 bottom-0.5 right-0.5 ring-2',
    xl: 'w-4 h-4 bottom-1 right-1 ring-2',
  };

  const resolvedUrl = getMediaUrl(src, alt);

  return (
    <div
      className={`relative inline-block flex-shrink-0 select-none ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <img
        src={resolvedUrl}
        alt={alt}
        className={`${sizeMap[size]} rounded-full object-cover border border-slate-200/80 bg-slate-100 shadow-2xs`}
        loading="lazy"
        onError={(e) => {
          // Fallback if image load fails
          const target = e.target as HTMLImageElement;
          target.src = getMediaUrl(null, alt);
        }}
      />

      {isOnline !== undefined && (
        <span
          className={`absolute rounded-full ring-white ${dotSizeMap[size]} ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
          title={isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}
        />
      )}
    </div>
  );
};

export default Avatar;
