import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format relative time ("vừa xong", "15 phút trước", "2 giờ trước", "3 ngày trước")
 */
export function formatRelativeTime(dateString?: string | Date | number | null): string {
  if (!dateString) return '';
  const date = dayjs(dateString);
  const now = dayjs();
  const diffInMinutes = now.diff(date, 'minute');

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }
  const diffInHours = now.diff(date, 'hour');
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }
  const diffInDays = now.diff(date, 'day');
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }
  return date.format('DD/MM/YYYY');
}

/**
 * Format message time in chat ("14:20")
 */
export function formatMessageTime(dateString?: string | Date | number | null): string {
  if (!dateString) return '';
  return dayjs(dateString).format('HH:mm');
}

/**
 * Format standard date and time ("14:20 - 12/05/2026")
 */
export function formatDateTime(dateString?: string | Date | number | null): string {
  if (!dateString) return '';
  return dayjs(dateString).format('HH:mm - DD/MM/YYYY');
}
