import React, { useState } from 'react';
import { getMediaUrl } from '../../utils/media';
import Modal from '../common/Modal';

export interface ImageGalleryProps {
  images: Array<{ url: string; id?: number }>;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  const count = images.length;

  const renderGrid = () => {
    if (count === 1) {
      const url = getMediaUrl(images[0].url);
      return (
        <div
          className="rounded-2xl overflow-hidden cursor-pointer max-h-96 w-full border border-slate-100 group"
          onClick={() => setSelectedImage(url)}
        >
          <img
            src={url}
            alt="post-img"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
          {images.map((img, i) => {
            const url = getMediaUrl(img.url);
            return (
              <div
                key={i}
                className="aspect-square cursor-pointer overflow-hidden border border-slate-100 group"
                onClick={() => setSelectedImage(url)}
              >
                <img
                  src={url}
                  alt={`post-img-${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
          <div
            className="col-span-2 aspect-4/3 cursor-pointer overflow-hidden border border-slate-100 group"
            onClick={() => setSelectedImage(getMediaUrl(images[0].url))}
          >
            <img
              src={getMediaUrl(images[0].url)}
              alt="post-img-0"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {images.slice(1, 3).map((img, i) => {
              const url = getMediaUrl(img.url);
              return (
                <div
                  key={i}
                  className="cursor-pointer overflow-hidden border border-slate-100 group"
                  onClick={() => setSelectedImage(url)}
                >
                  <img
                    src={url}
                    alt={`post-img-${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 4 or 5 images
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-2xl overflow-hidden">
        {images.map((img, i) => {
          const url = getMediaUrl(img.url);
          return (
            <div
              key={i}
              className="aspect-square cursor-pointer overflow-hidden border border-slate-100 group"
              onClick={() => setSelectedImage(url)}
            >
              <img
                src={url}
                alt={`post-img-${i}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="my-3.5">{renderGrid()}</div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
      >
        {selectedImage && (
          <div className="flex items-center justify-center p-2">
            <img
              src={selectedImage}
              alt="fullscreen"
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default ImageGallery;
