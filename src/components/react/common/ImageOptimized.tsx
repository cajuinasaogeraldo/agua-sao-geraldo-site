import { useMemo, useEffect, useState } from 'react';
import {
  getSizes,
  getBreakpoints,
  getImageStyles,
  isUnpicCompatible,
  unpicOptimizer,
} from '@/utils/images-optimization-react';
import type { ImageOptimizedProps } from '../types';
import GalleryLightbox from './GalleryLightBox';

const encodeSrcSetUrl = (url: string): string => {
  return url.replace(/ /g, '%20');
};

export default function ImageOptimized({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  decoding = 'async',
  sizes: customSizes,
  className = '',
  layout = 'responsive',
  objectFit = 'cover',
  objectPosition = 'center',
  aspectRatio,
  showGallery = false,
  ...rest
}: ImageOptimizedProps) {
  const [srcSet, setSrcSet] = useState<string | undefined>(undefined);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); // ✅ Estado local

  const baseConfig = useMemo(() => {
    if (!src) return null;

    const autoSizes = customSizes || getSizes(width, layout);
    const breakpoints = getBreakpoints({ width, layout });

    const styles = getImageStyles({
      width,
      height,
      aspectRatio,
      layout,
      objectFit,
      objectPosition,
    });

    return {
      src,
      sizes: autoSizes,
      width,
      height,
      style: styles,
      breakpoints,
    };
  }, [src, width, height, layout, aspectRatio, objectFit, objectPosition, customSizes]);

  useEffect(() => {
    if (!baseConfig || !src) return;

    const optimize = async () => {
      if (isUnpicCompatible(src)) {
        try {
          const optimized = await unpicOptimizer(src, baseConfig.breakpoints, width, height);

          if (optimized.length > 0) {
            const generatedSrcSet = optimized
              .map(({ src, width }) => `${encodeSrcSetUrl(src)} ${width}w`)
              .join(', ');
            setSrcSet(generatedSrcSet);
            return;
          }
        } catch (error) {
          console.warn('Failed to optimize image with unpic:', error);
        }
      }

      if (baseConfig.breakpoints.length > 0) {
        const fallbackSrcSet = baseConfig.breakpoints
          .map((w: number) => `${encodeSrcSetUrl(src)} ${w}w`)
          .join(', ');
        setSrcSet(fallbackSrcSet);
      }
    };

    optimize();
  }, [src, width, height, baseConfig]);

  if (!baseConfig) return null;

  return (
    <>
      <img
        src={encodeSrcSetUrl(baseConfig.src)}
        alt={alt}
        width={baseConfig.width}
        height={baseConfig.height}
        srcSet={srcSet}
        sizes={baseConfig.sizes}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={`${className} ${showGallery ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        style={baseConfig.style}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onClick={() => showGallery && setIsGalleryOpen(true)}
        role={showGallery ? 'button' : undefined}
        tabIndex={showGallery ? 0 : undefined}
        onKeyDown={
          showGallery
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsGalleryOpen(true);
                }
              }
            : undefined
        }
        {...rest}
      />

      {showGallery && (
        <GalleryLightbox
          images={[src]}
          initialIndex={0}
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </>
  );
}
