interface GalleryLightboxProps {
  images: Array<ImageBannerType | string>;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
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

export type { GalleryLightboxProps, ImageBannerType, BannerData, BannerSwiperProps };
