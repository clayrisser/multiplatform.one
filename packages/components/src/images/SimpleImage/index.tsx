import React, { useMemo, forwardRef } from 'react';
import type { ComponentProps, Ref } from 'react';
import type { Image } from 'expo-image';
import type { SolitoImageProps } from 'solito/build/image/image.types';
import type { StackProps } from 'tamagui';
import type { StaticImageData } from 'next/dist/client/image';
import { SolitoImage } from 'solito/image';
import { Stack, styled } from 'tamagui';
import { useAssets } from '../../hooks/useAssets';

type Props = Omit<SolitoImageProps, 'height' | 'width' | 'src' | 'fill' | 'style' | 'alt'> &
  Omit<StackProps, 'height' | 'width'> & {
    alt?: string;
    height?: number | string;
    src?: StaticImport | string | number;
    width?: number | string;
  };

export const SimpleImage = styled(
  forwardRef<Image, Props>(
    (
      {
        alt,
        blurDataURL,
        contentFit,
        contentPosition,
        crossOrigin,
        height,
        loader,
        loading,
        onLayout,
        onLoadingComplete,
        placeholder,
        priority,
        quality,
        aspectRatio,
        referrerPolicy,
        resizeMode,
        sizes,
        src,
        unoptimized,
        width,
        ...props
      }: Props,
      ref: Ref<Image>,
    ) => {
      console.log('R', props);
      let asset: StaticImageData | undefined;
      if (typeof src === 'number') [asset] = useAssets([src]);
      const staticImageData = useMemo(() => {
        if (typeof src === 'string') return;
        if (typeof src === 'number') return asset;
        return (src as { default?: StaticImageData })?.default || (src as StaticImageData);
      }, [asset, src]);

      const mAspectRatio = useMemo(() => {
        if (typeof aspectRatio === 'string') {
          const [width, height] = aspectRatio.split(':');
          return parseInt(width, 10) / parseInt(height, 10);
        }
        return aspectRatio;
      }, [aspectRatio]);

      const solitoHeight = useMemo(() => {
        if (typeof height === 'string') return;
        if (typeof height === 'number') return height;
        const w = typeof width === 'number' ? width : staticImageData?.width;
        if (typeof w === 'number' && typeof mAspectRatio === 'number') return w / mAspectRatio;
        return staticImageData?.height;
      }, [mAspectRatio, staticImageData?.width, staticImageData?.height, width, height]);

      console.log('solitoHeight', solitoHeight, height, props.h);

      const solitoWidth = useMemo(() => {
        if (typeof width === 'string') return;
        if (typeof width === 'number') return width;
        const h = typeof height === 'number' ? height : staticImageData?.height;
        if (typeof h === 'number' && typeof mAspectRatio === 'number') return h * mAspectRatio;
        return staticImageData?.width;
      }, [mAspectRatio, staticImageData?.width, staticImageData?.height, width, height]);

      const fill = useMemo(() => {
        if (typeof solitoWidth === 'undefined' || typeof solitoHeight === 'undefined') {
          return true;
        }
        return false;
      }, [solitoWidth, solitoHeight]);

      return (
        <Stack {...props} aspectRatio={aspectRatio} width={width} height={height}>
          {src && (
            <SolitoImage
              alt={alt || ''}
              blurDataURL={blurDataURL}
              contentFit={contentFit}
              contentPosition={contentPosition}
              crossOrigin={crossOrigin}
              fill={fill}
              height={fill ? undefined : solitoHeight}
              loader={loader}
              loading={loading}
              onLayout={onLayout}
              onLoadingComplete={onLoadingComplete}
              placeholder={placeholder}
              priority={priority}
              quality={quality}
              ref={ref}
              referrerPolicy={referrerPolicy}
              resizeMode={resizeMode}
              sizes={sizes}
              src={src as any}
              unoptimized={unoptimized}
              width={fill ? undefined : solitoWidth}
            />
          )}
        </Stack>
      );
    },
  ),
  undefined,
  {
    acceptsClassName: true,
    neverFlatten: true,
  },
);

export interface StaticRequire {
  default: StaticImageData;
}

export type StaticImport = StaticRequire | StaticImageData;

export type SimpleImageProps = ComponentProps<typeof SimpleImage>;
