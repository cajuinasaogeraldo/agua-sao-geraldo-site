import { useState } from 'react';
import ImageOptimized from '@/components/react/common/ImageOptimized';
import GalleryLightBox from '@/components/react/common/GalleryLightBox';
import type { ImageMetadata } from 'astro';

export default function PhotoGalleryTrigger({
  images,
}: Readonly<{ images: Array<ImageMetadata> }>) {
  const [isOpen, setIsOpen] = useState(false);

  const firstImage = images[0];
  const remaining = images.length - 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative block w-full cursor-pointer border-0 bg-transparent p-0 group overflow-hidden rounded-[28px]"
        aria-label={`Abrir galeria com ${images.length} fotos`}
      >
        <ImageOptimized
          src={firstImage.src}
          alt="Galeria de fotos"
          width={300}
          height={300}
          layout="responsive"
          sizes="(max-width: 768px) 135px, (max-width: 1536px) 210px, 300px"
          loading="lazy"
          className="size-[135px] rounded-[28px] object-cover lg:size-[210px] 2xl:size-[300px]"
        />

        <div className="absolute inset-0 rounded-[28px] bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {remaining > 0 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            +{remaining} foto{remaining > 1 ? 's' : ''}
          </span>
        )}
      </button>

      <GalleryLightBox
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialIndex={0}
        images={images.map((img) => img.src)}
      />
    </>
  );
}
