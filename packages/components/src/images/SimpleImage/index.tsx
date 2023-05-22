import React, { useEffect, useState } from 'react';
import type { ImageProps, YStackProps } from 'tamagui';
import type { ImageURISource, ImageResizeMode } from 'react-native';
import type { SvgUriProps } from '../SvgUri';
import { MultiPlatform } from 'multiplatform.one';
import { Platform, Image as RNImage } from 'react-native';
import { SvgUri } from '../SvgUri';
import { XMLParser } from 'fast-xml-parser';
import { YStack, Image } from 'tamagui';
import { useAssets } from '../../hooks/useAssets';
import { useMemo } from 'react';

export type SimpleImageProps = Omit<ImageProps, 'src' | 'width' | 'height' | 'source'> & {
  src?: ImageURISource | string;
  width?: string | number;
  height?: string | number;
  svg?: boolean;
};

export function SimpleImage({ src, svg, width, height, resizeMode, aspectRatio, ...imageProps }: SimpleImageProps) {
  const preserveAspectRatio = useMemo(() => getPreserveAspectRatio(resizeMode), [resizeMode]);
  let source: string | number | ImageURISource | undefined = src;
  if ((typeof src === 'object' && typeof (src as ImageURISource).uri === 'undefined') || typeof src === 'number') {
    [source] = useAssets(src);
  }
  const [imageAspectRatio, setImageAspectRatio] = useState(
    typeof source === 'object' && source.width && source.height ? source.width / source.height : undefined,
  );
  if (!Number.isFinite(aspectRatio)) aspectRatio = imageAspectRatio;
  const uri = typeof source === 'object' ? source.uri : source;
  const origin = uri?.replace(/\?.+/g, '');
  // fixes bug on web where width is calculated differently than on native
  if (
    Platform.OS === 'web' &&
    typeof aspectRatio === 'number' &&
    typeof height === 'number' &&
    Number.isFinite(height) &&
    (!Number.isFinite(width) || width === 'auto')
  ) {
    width = height * aspectRatio;
  }
  if (Number.isFinite(height) && Number.isFinite(width)) aspectRatio = undefined;
  const isSvg =
    svg ||
    (((src as any)?.type === 'svg' || origin?.substring(origin.length - 4) === '.svg') && typeof svg === 'undefined');

  useEffect(() => {
    if (Platform.OS !== 'web' && isSvg) {
      (async () => {
        const meta = await getSvgMeta(uri);
        const height = Number.isFinite(meta.height) ? meta.height : meta.viewBox?.[3];
        const width = Number.isFinite(meta.width) ? meta.width : meta.viewBox?.[2];
        if (
          typeof height === 'number' &&
          Number.isFinite(height) &&
          typeof width === 'number' &&
          Number.isFinite(width)
        ) {
          setImageAspectRatio(width / height);
        }
      })();
    } else if (typeof uri !== 'number' && uri /* && calculateHeight */) {
      RNImage.getSize(uri, (width: number, height: number) => {
        const ratio = width / height;
        if (Number.isFinite(ratio)) setImageAspectRatio(ratio);
      });
    }
  }, [uri]);

  if (!uri) {
    return <YStack {...(imageProps as YStackProps)} width={width} height={height} aspectRatio={aspectRatio} />;
  }
  if (!MultiPlatform.isWeb && isSvg) {
    return (
      <SvgUri
        {...(imageProps as Partial<SvgUriProps>)}
        width={Number.isFinite(width) ? width : Number.isFinite(height) ? undefined : '100%'}
        height={height}
        preserveAspectRatio={preserveAspectRatio}
        aspectRatio={aspectRatio}
        uri={uri}
      />
    );
  }
  return (
    <Image
      {...imageProps}
      // @ts-ignore
      width={width}
      // @ts-ignore
      height={height}
      aspectRatio={aspectRatio}
      resizeMode={resizeMode}
      source={{ uri }}
    />
  );
}

SimpleImage.defaultProps = {
  resizeMode: 'cover',
};

function getPreserveAspectRatio(resizeMode?: ImageResizeMode): string {
  switch (resizeMode) {
    case 'stretch': {
      return 'none';
    }
    case 'contain': {
      return 'xMidYMid meet';
    }
  }
  return 'xMidYMid slice';
}

const logger = console;
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
});

async function getSvgMeta(uri?: string | number) {
  const meta: SvgMeta = {};
  if (Platform.OS === 'web' || typeof uri === 'number' || !uri) return meta;
  const res = await fetch(uri);
  try {
    const xml = parser.parse(await res.text());
    const width = parseInt(xml?.svg?.['@_width'], 10);
    const height = parseInt(xml?.svg?.['@_height'], 10);
    const viewBox = xml?.svg?.['@_viewBox']
      ?.toString()
      .split(' ')
      .reduce(
        (viewBox: SvgViewBox | undefined, itemStr: string, i: number) => {
          if (!viewBox) return {};
          const itemNum = parseInt(itemStr, 10);
          if (!Number.isFinite(itemNum)) return {};
          viewBox[i] = itemNum;
          return viewBox;
        },
        [0, 0, 0, 0],
      ) as SvgViewBox;
    if (typeof width === 'number' && Number.isFinite(width)) meta.width = width;
    if (typeof height === 'number' && Number.isFinite(height)) meta.height = height;
    if (viewBox) meta.viewBox = viewBox;
    return meta;
  } catch (err) {
    logger.error(err);
  }
  return meta;
}

type Width = number;
type Height = number;
export type SvgViewBox = [number, number, Width, Height];

export interface SvgMeta {
  height?: number;
  viewBox?: SvgViewBox;
  width?: number;
}
