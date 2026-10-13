/**
 * Helper chuẩn hóa URL hình ảnh từ Backend Static Host
 * Fallback về UI Avatars nếu path rỗng hoặc null
 */
export function getMediaUrl(path?: string | null, fallbackName: string = 'User'): string {
  if (!path) {
    return `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(fallbackName)}`;
  }

  // Nếu là URL tuyệt đối từ internet (Cloudinary, Unsplash, external...)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Gắn Static Asset Host của Backend (http://localhost:3000)
  const assetHost = (import.meta.env.VITE_ASSET_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${assetHost}${cleanPath}`;
}

/**
 * Phân tích nội dung bài viết để tách nội dung chữ và các URL hình ảnh được nhúng dạng markdown
 */
export function parsePostContentAndImages(
  content: string,
  existingImages?: Array<{ url: string; id?: number }>
): {
  cleanContent: string;
  images: Array<{ url: string; id?: number }>;
} {
  const extractedUrls: string[] = [];
  const imageRegex = /!\[.*?\]\((.*?)\)/g;

  let match: RegExpExecArray | null;
  while ((match = imageRegex.exec(content)) !== null) {
    if (match[1]) {
      extractedUrls.push(match[1]);
    }
  }

  // Loại bỏ các tag markdown ảnh để lấy text sạch sẽ cho bài viết
  const cleanContent = content.replace(imageRegex, '').trim();

  // Kết hợp với danh sách existingImages nếu có và loại trừ trùng lặp
  const existingUrls = new Set((existingImages || []).map((img) => img.url));
  const combinedImages: Array<{ url: string; id?: number }> = [...(existingImages || [])];

  for (const url of extractedUrls) {
    if (!existingUrls.has(url)) {
      combinedImages.push({ url });
      existingUrls.add(url);
    }
  }

  return {
    cleanContent,
    images: combinedImages,
  };
}

