import { createContext, useContext, useState, type ReactNode } from 'react';
import type { GalleryLightboxProps } from '../types';
import GalleryLightbox from '../common/GalleryLightBox';

type GalleryContextType = {
  openGallery: (images: GalleryLightboxProps['images'], initialIndex?: number) => void;
  closeGallery: () => void;
};

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [galleryState, setGalleryState] = useState<{
    isOpen: boolean;
    images: GalleryLightboxProps['images'];
    initialIndex: number;
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0,
  });

  const openGallery = (images: GalleryLightboxProps['images'], initialIndex = 0) => {
    setGalleryState({
      isOpen: true,
      images,
      initialIndex,
    });
  };

  const closeGallery = () => {
    setGalleryState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <GalleryContext.Provider value={{ openGallery, closeGallery }}>
      {children}
      <GalleryLightbox
        images={galleryState.images}
        initialIndex={galleryState.initialIndex}
        isOpen={galleryState.isOpen}
        onClose={closeGallery}
      />
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within GalleryProvider');
  }
  return context;
}
