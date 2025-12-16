import { useState, useEffect } from 'react';
import GalleryLightbox from './GalleryLightBox';

interface Props {
  images: string[];
  imageTriggerId: string;
}

export default function GalleryLightboxTrigger({ images, imageTriggerId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const triggerElement = document.getElementById(imageTriggerId);
    if (!triggerElement) return;

    const handleClick = () => setIsOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    triggerElement.addEventListener('click', handleClick);
    triggerElement.addEventListener('keydown', handleKeyDown as any);

    return () => {
      triggerElement.removeEventListener('click', handleClick);
      triggerElement.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [imageTriggerId]);

  return (
    <GalleryLightbox
      images={images}
      initialIndex={0}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
  );
}
