import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import ImageOptimized from '@/components/react/common/ImageOptimized';
import { useState } from 'react';
import type { News } from '@/types';

interface NewsSwiperProps {
  news: Partial<News>[];
  arrowNext: string;
  arrowPrev: string;
}

export default function NewsSwiper({ news }: NewsSwiperProps) {
  if (!news || news.length === 0) return null;
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const isMobile = window.innerWidth <= 768;

  const handlePause = () => {
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.pause();
    }
  };

  const handleResume = () => {
    if (swiperInstance?.autoplay) {
      swiperInstance.autoplay.resume();
    }
  };

  return (
    <div
      className="relative w-full px-10 md:px-12"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocusCapture={handlePause}
      onBlurCapture={handleResume}
    >
      <Swiper
        onSwiper={setSwiperInstance}
        modules={[Navigation, Autoplay]}
        slidesPerView={2}
        spaceBetween={14}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.news-next-btn',
          prevEl: '.news-prev-btn',
        }}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 14,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 18,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 18,
          },
        }}
        className="mx-auto h-fit w-full max-w-[350px] pb-4 md:max-h-[520px] md:max-w-[700px] lg:max-w-[1350px]"
      >
        {news.map((post) => (
          <SwiperSlide
            onMouseOut={isMobile ? handleResume : () => {}}
            onClick={isMobile ? handlePause : () => {}}
            key={post.id}
            className="bg-white p-3 md:p-5 rounded-xl"
          >
            {post.image && (
              <a className="cursor-pointer" href={post.permalink} tabIndex={-1} aria-hidden="true">
                <ImageOptimized
                  src={post.image}
                  alt={post.title!}
                  width={350}
                  height={280}
                  layout="responsive"
                  aspectRatio="16/9"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                  className="mb-3 h-[116px] w-full rounded-lg object-cover md:h-[280px]"
                />
              </a>
            )}
            <div className="flex h-full flex-col justify-evenly text-left">
              <p className="text-agua-primary-blue font-semibold! text-lg wrap-break-word mb-2 line-clamp-2 px-1 md:text-lg h-14">
                {post.title}
              </p>

              <p className="font-inter line-clamp-3 h-[4.5rem] md:h-[5.25rem] mb-3 px-1 text-sm">
                {post.excerpt || post.content}
              </p>

              <a
                href={post.permalink}
                aria-label={post.title ? `Leia mais sobre ${post.title}` : 'Leia mais'}
                className="btn-primary mx-1 inline-block h-fit w-fit rounded text-sm text-white transition-all duration-300"
              >
                Leia Mais
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons */}
      <button
        type="button"
        className="news-prev-btn swiper-button-prev py-3 text-agua-primary-blue! absolute top-1/2! -left-2! z-10 flex size-[42px] -translate-y-1/2! cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-[0_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 ease-out hover:scale-110 hover:bg-white/90 active:scale-95 max-md:size-[34px] md:-left-2!"
        aria-label="Notícia anterior"
      ></button>
      <button
        type="button"
        className="news-next-btn swiper-button-next py-3 text-agua-primary-blue! absolute top-1/2! -right-2! z-10 flex size-[42px] -translate-y-1/2! cursor-pointer items-center justify-center rounded-full bg-white/70 shadow-[0_4px_12px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 ease-out hover:scale-110 hover:bg-white/90 active:scale-95 max-md:size-[34px] md:-right-2!"
        aria-label="Próxima notícia"
      ></button>
    </div>
  );
}
