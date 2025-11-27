import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import ImageOptimized from '@/components/react/common/ImageOptimized';

interface ImageBannerType {
  data: {
    image: string;
  };
}

export default function AboutPhotoGallery({
  images,
}: {
  images: ImageBannerType[];
}) {
  return (
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
          {images.map((item, index) => (
            <SwiperSlide key={item.data.image + index}>
              <ImageOptimized
                src={item.data.image}
                alt={`Galeria de fotos ${index + 1}`}
                width={300}
                height={300}
                layout="constrained"
                sizes="(max-width: 768px) 135px, (max-width: 1536px) 210px, 300px"
                loading="lazy"
                className="size-[135px] rounded-[28px] object-cover lg:size-[210px] 2xl:size-[300px]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
