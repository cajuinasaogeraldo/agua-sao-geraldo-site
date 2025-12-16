import type { HTMLAttributes } from 'react';
import type { ImageLayout } from '@/types';

interface GalleryLightboxProps {
  images: Array<ImageBannerType | string>;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

interface ImageOptimizedProps extends Omit<HTMLAttributes<HTMLImageElement>, 'src' | 'style'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  className?: string;
  decoding?: 'sync' | 'async' | 'auto';
  layout?: ImageLayout;
  objectFit?: string;
  objectPosition?: string;
  aspectRatio?: string | number;
  showGallery?: boolean;
}

interface ImageBannerType {
  data: {
    image: string;
  };
}

interface BannerData {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  imageMobile?: string;
  cta?: string;
  textPosition: 'left' | 'center' | 'right';
  textAlign: 'top' | 'middle' | 'bottom';
  overlay: boolean;
}

interface BannerSwiperProps {
  banners: Array<{
    data: BannerData;
    id: string;
  }>;
}

export type {
  GalleryLightboxProps,
  ImageBannerType,
  BannerData,
  BannerSwiperProps,
  ImageOptimizedProps,
};
