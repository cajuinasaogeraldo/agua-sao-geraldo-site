import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useState, useEffect } from 'react';
import ImageOptimized from '@/components/react/common/ImageOptimized';
import type { BannerData, BannerSwiperProps } from '../types';

const positionClasses: Record<BannerData['textPosition'], string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
};

const alignClasses: Record<BannerData['textAlign'], string> = {
  top: 'justify-start pt-20',
  middle: 'justify-center',
  bottom: 'justify-end pb-20',
};

export default function BannerSwiper({ banners }: BannerSwiperProps) {
  if (!banners || banners.length === 0) return null;

  return (
    <div id="bannerSwiper" className="relative h-[341px] w-full overflow-hidden md:h-[700px]">
      <Swiper
        className="size-full"
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={700}
        loop={banners.length > 1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          nextEl: '#bannerSwiper .swiper-button-next',
          prevEl: '#bannerSwiper .swiper-button-prev',
        }}
        pagination={
          banners.length > 1
            ? {
                clickable: true,
              }
            : false
        }
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <BannerSlideContent banner={banner.data} index={index} />
          </SwiperSlide>
        ))}

        {/* NAV BUTTONS */}
        <div className="swiper-button-prev py-3 text-agua-primary-blue! absolute right-5 top-1/2 z-10 flex size-[46px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-[0_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 ease-out hover:scale-110 hover:bg-white/90 active:scale-95 md:right-5 max-md:size-[34px] max-md:right-2.5"></div>
        <div className="swiper-button-next py-3 text-agua-primary-blue! absolute right-5 top-1/2 z-10 flex size-[46px] cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-[0_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 ease-out hover:scale-110 hover:bg-white/90 active:scale-95 md:right-5 max-md:size-[34px] max-md:right-2.5"></div>
      </Swiper>
    </div>
  );
}

// Componente separado para cada slide com detecção inteligente
function BannerSlideContent({ banner, index }: { banner: BannerData; index: number }) {
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');
  const [imageRatio, setImageRatio] = useState<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      setImageRatio(aspectRatio);
      // Se aspect ratio >= 2.5 (panorâmica tipo 3:1 ou mais), usa contain
      // Senão (quadrado/vertical), usa cover para não cortar
      setObjectFit(aspectRatio >= 2.5 ? 'contain' : 'cover');
    };
    img.src = banner.image;
  }, [banner.image]);

  const {
    title,
    subtitle,
    description,
    image,
    imageMobile,
    cta,
    textPosition,
    textAlign,
    overlay,
  } = banner;

  const hasCTA = !!cta;

  const content = (
    <div className="relative size-full bg-agua-secondary-blue">
      <picture>
        {imageMobile && <source media="(max-width: 768px)" srcSet={imageMobile} />}
        <ImageOptimized
          src={image}
          alt={title}
          width={1920}
          height={700}
          layout="cover"
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          className={`absolute inset-0 size-full object-center ${
            objectFit === 'cover' ? 'object-cover' : 'object-contain'
          }`}
          objectFit={objectFit}
          objectPosition="center"
          aspectRatio={imageRatio || undefined}
        />
      </picture>

      {/* Overlay */}
      {overlay && <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black/60" />}

      {/* Content */}
      <div
        className={`relative z-10 flex size-full flex-col px-6 md:px-12 ${alignClasses[textAlign]}`}
      >
        <div className={`mx-auto flex w-full max-w-7xl flex-col ${positionClasses[textPosition]}`}>
          {subtitle && <p className="mb-4 text-xl text-white/90 md:text-3xl">{subtitle}</p>}
          {description && (
            <p className="mb-8 max-w-2xl text-base text-white/80 md:text-lg">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return hasCTA ? (
    <a href={cta} className="block size-full cursor-pointer" aria-label={title}>
      {content}
    </a>
  ) : (
    content
  );
}
