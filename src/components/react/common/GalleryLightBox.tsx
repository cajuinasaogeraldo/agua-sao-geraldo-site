import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard, Thumbs, FreeMode, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import type { GalleryLightboxProps } from '../types';
import ImageOptimized from './ImageOptimized';

type SingleImage = GalleryLightboxProps['images'][number];

function GalleryBoxImage({ image, idx }: { image: SingleImage; idx: number }) {
  return (
    <ImageOptimized
      src={typeof image !== 'string' ? image.data.image : image}
      alt={`Galeria de fotos ${idx + 1}`}
      layout="constrained"
    />
  );
}

export default function GalleryLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
}: GalleryLightboxProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lightboxContent = (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/95 cursor-pointer" onClick={onClose} />

      {/* Close Button */}
      <button
        className="absolute top-4 right-4 z-10 bg-white/30 hover:bg-white/50 border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-caju-heading-orange transition-colors"
        onClick={onClose}
        aria-label="Fechar galeria"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Main Swiper */}
      <div className="relative z-2 w-full max-w-[90vw] h-[70vh] mb-4">
        <Swiper
          ref={mainSwiperRef}
          modules={[Navigation, Keyboard, Thumbs, EffectFade]}
          initialSlide={initialIndex}
          loop={false}
          speed={150}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          keyboard={{
            enabled: true,
          }}
          navigation={
            images.length > 1
              ? {
                  nextEl: '.gallery-button-next',
                  prevEl: '.gallery-button-prev',
                }
              : false
          }
          thumbs={
            images.length > 1
              ? { swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }
              : undefined
          }
          className="w-full h-full"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx}>
              <div className="w-full h-[70vh] flex items-center justify-center">
                <GalleryBoxImage image={src} idx={idx} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              className="gallery-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-caju-heading-yellow transition-colors"
              aria-label="Imagem anterior"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              className="gallery-button-next absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 disabled:opacity-30 disabled:cursor-not-allowed border-none rounded-full w-12 h-12 flex items-center justify-center cursor-pointer text-caju-heading-yellow transition-colors"
              aria-label="Próxima imagem"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="relative z-10 w-full max-w-[90vw] px-3 py-2 bg-black/50 rounded-xl">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Thumbs]}
            initialSlide={initialIndex}
            slidesPerView="auto"
            spaceBetween={8}
            freeMode={true}
            watchSlidesProgress={true}
            breakpoints={{
              320: { slidesPerView: 4 },
              640: { slidesPerView: 6 },
              1024: { slidesPerView: 8 },
            }}
          >
            {images.map((src, idx) => (
              <SwiperSlide key={idx} className="w-[60px]! md:w-[70px]!">
                <div className="w-[60px] h-[60px] md:w-[70px] md:h-[70px] cursor-pointer rounded-lg overflow-hidden border-2 border-transparent transition-colors hover:border-white/50">
                  <GalleryBoxImage image={src} idx={idx} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );

  return createPortal(lightboxContent, document.body);
}
