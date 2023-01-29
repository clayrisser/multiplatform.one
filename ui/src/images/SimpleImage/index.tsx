import { ImageProps, YStack, YStackProps, Image } from 'tamagui';
import { ImageURISource, ImageResizeMode } from 'react-native';
import { MultiPlatform } from 'multiplatform.one';
import { SvgUri, SvgUriProps } from '../SvgUri';
import { useAssets } from '../../hooks/useAssets';
import { useMemo } from 'react';

export type SimpleImageProps = Omit<ImageProps, 'src' | 'width' | 'height'> & {
  src?: ImageURISource | string;
  width?: string | number;
  height?: string | number;
  svg?: boolean;
};

export function SimpleImage({ src, svg, width, height, resizeMode, ...imageProps }: SimpleImageProps) {
  let source = src;
  if (typeof src === 'object' && typeof (src as ImageURISource).uri === 'undefined') {
    [source] = useAssets(src);
  }
  if (!source) return <YStack {...(imageProps as YStackProps)} />;
  const uri = (typeof source === 'string' ? source : source.uri)?.replace(/\?.+/g, '') || null;

  if (
    !MultiPlatform.isWeb &&
    (svg || (((src as any).type === 'svg' || uri?.substring(uri.length - 4) === '.svg') && typeof svg === 'undefined'))
  ) {
    return (
      <SvgUri
        {...(imageProps as SvgUriProps)}
        height={height || '100%'}
        preserveAspectRatio={useMemo(() => getPreserveAspectRatio(resizeMode), [resizeMode])}
        uri={uri}
        width={width || '100%'}
      />
    );
  }
  return (
    <Image {...imageProps} width={width || '100%'} height={height || '100%'} resizeMode={resizeMode} src={source} />
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
