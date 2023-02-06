import { ImageProps, YStack, YStackProps, Image } from 'tamagui';
import { ImageURISource, ImageResizeMode, Platform, Image as RNImage } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MultiPlatform } from 'multiplatform.one';
import { SvgUri, SvgUriProps } from '../SvgUri';
import { XMLParser } from 'fast-xml-parser';
import { useAssets } from '../../hooks/useAssets';
import { useMemo } from 'react';

export type SimpleImageProps = Omit<ImageProps, 'src' | 'width' | 'height'> & {
  src?: ImageURISource | string;
  width?: string | number;
  height?: string | number;
  svg?: boolean;
};

export function SimpleImage({ src, svg, width, height, resizeMode, aspectRatio, ...imageProps }: SimpleImageProps) {
  let source: string | number | ImageURISource | undefined = src;
  if ((typeof src === 'object' && typeof (src as ImageURISource).uri === 'undefined') || typeof src === 'number') {
    [source] = useAssets(src);
  }
  if (!aspectRatio) {
    if (typeof source === 'object') {
      const w = typeof width === 'number' && Number.isFinite(width) ? width : source.width;
      const h = typeof height === 'number' && Number.isFinite(height) ? height : source.height;
      if (w && h) aspectRatio = w / h;
    }
  }
  const [calculatedAspectRatio, setCalculatedAspectRatio] = useState(aspectRatio);
  const uri = typeof source === 'object' ? source.uri : source;
  const origin = uri?.replace(/\?.+/g, '');
  const calculateHeight = height === 'auto' || typeof height === 'undefined';
  // fixes bug on web where width is calculated differently than on native
  if (
    Platform.OS === 'web' &&
    typeof calculatedAspectRatio === 'number' &&
    typeof height === 'number' &&
    Number.isFinite(height) &&
    (typeof width === 'undefined' || width === 'auto')
  ) {
    width = height * calculatedAspectRatio;
  }
  useEffect(() => {
    if (Platform.OS !== 'web' && svg) {
      (async () => {
        if (!calculatedAspectRatio) {
          const { height, width } = await getSvgMeta(uri);
          if (
            typeof height === 'number' &&
            Number.isFinite(height) &&
            typeof width === 'number' &&
            Number.isFinite(width)
          ) {
            setCalculatedAspectRatio(width / height);
          }
        }
      })();
    } else if (!calculatedAspectRatio && typeof uri !== 'number' && uri /* && calculateHeight */) {
      RNImage.getSize(uri, (width: number, height: number) => {
        const ratio = width / height;
        if (Number.isFinite(ratio)) setCalculatedAspectRatio(ratio);
      });
    }
  }, [uri, calculatedAspectRatio, calculateHeight]);

  if (!uri) {
    return (
      <YStack {...(imageProps as YStackProps)} width={width} height={height} aspectRatio={calculatedAspectRatio} />
    );
  }
  if (
    !MultiPlatform.isWeb &&
    (svg ||
      (((src as any).type === 'svg' || origin?.substring(origin.length - 4) === '.svg') && typeof svg === 'undefined'))
  ) {
    return (
      <SvgUri
        {...(imageProps as SvgUriProps)}
        width={width}
        height={height}
        preserveAspectRatio={useMemo(() => getPreserveAspectRatio(resizeMode), [resizeMode])}
        aspectRatio={calculatedAspectRatio}
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
      aspectRatio={calculatedAspectRatio}
      resizeMode={resizeMode}
      src={uri}
    />
  );
}

function getPreserveAspectRatio(resizeMode?: ImageResizeMode): string {
  switch (resizeMode) {
    case 'stretch': {
      return 'none';
    }
    case 'cover': {
      return 'xMidYMid slice';
    }
  }
  return 'xMidYMid meet';
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
  width?: number;
  viewBox?: SvgViewBox;
}
