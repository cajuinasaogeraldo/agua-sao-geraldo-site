import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import ImageOptimized from '@/components/react/common/ImageOptimized';
import { useState } from 'react';
import GalleryLightBox from '../common/GalleryLightBox';
import type { ImageBannerType } from '../types';

export default function AboutPhotoGallery({ images }: { images: ImageBannerType[] }) {
  const [imageSelected, setImageSelected] = useState<number | undefined>(undefined);

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div className="-mx-[calc(100vw-100%)] w-screen">
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            slidesPerView={3}
            spaceBetween={12}
            autoplay={{
              delay: 1500,
              disableOnInteraction: true,
            }}
            breakpoints={{
              768: {
                slidesPerView: 6,
              },
            }}
            grabCursor
            rewind
          >
            {images.map((image, index) => (
              <SwiperSlide
                className="cursor-pointer rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agua-primary-blue"
                role="button"
                tabIndex={0}
                aria-label={`Ampliar foto ${index + 1}`}
                onClick={() => setImageSelected(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setImageSelected(index);
                  }
                }}
                key={image.data.image + index}
              >
                <ImageOptimized
                  src={image.data.image}
                  alt={`Galeria de fotos ${index + 1}`}
                  width={300}
                  height={300}
                  layout="responsive"
                  sizes="(max-width: 768px) 135px, (max-width: 1536px) 210px, 300px"
                  loading="lazy"
                  className="size-[135px] rounded-[28px] object-cover lg:size-[210px] 2xl:size-[300px]"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <GalleryLightBox
        isOpen={imageSelected !== undefined}
        onClose={() => setImageSelected(undefined)}
        initialIndex={imageSelected}
        images={images}
      />
    </>
  );
}
