import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation } from 'swiper/modules';
import type { TimelineItem } from '@/types';
import { twMerge } from 'tailwind-merge';

interface Props {
  steps: TimelineItem[];
  className?: string;
}

export default function TimelineSwiper({ steps, className }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <Swiper
        modules={[Navigation, Autoplay, FreeMode]}
        slidesPerView={'auto'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        grabCursor
        rewind
        className={twMerge('h-full w-full overflow-auto', className)}
      >
        {steps.map((item, index) => (
          <SwiperSlide
            className="h-full! max-w-[255px] min-w-[161px]! lg:max-w-[550px]"
            key={item.title + index}
          >
            <div className="flex flex-col items-start">
              {/* bolinha e linha pontilhada */}
              <div className="relative mb-4 flex w-full items-center">
                <div
                  className={`size-4 rounded-full border-2 lg:size-6 ${
                    index % 2 === 0
                      ? 'bg-white lg:bg-agua-primary-blue border-agua-primary-green'
                      : 'border-agua-primary-blue bg-agua-primary-green'
                  }`}
                ></div>
                <div className="border-agua-primary-green flex-1 border-t-[3px] border-dotted lg:border-t-8 lg:border-black"></div>
              </div>

              {/* conteúdo */}
              <div className="mr-2">
                <h5 className="lg:text-agua-primary-blue text-agua-primary-green mb-2 max-w-[400px] text-sm font-extrabold! uppercase lg:text-4xl">
                  {item.title}
                </h5>
                <p className="font-poppins lg:text-font text-left text-[9px] text-white lg:text-[24px]">
                  {item.content}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
