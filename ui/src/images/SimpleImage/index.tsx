import { ImageProps, YStack, YStackProps, Image } from 'tamagui';
import { ImageURISource } from 'react-native';
import { useAssets } from '../../hooks/useAssets';

export type SimpleImageProps = Omit<ImageProps, 'src'> & {
  src?: ImageURISource | string;
};

export function SimpleImage({ src, ...imageProps }: SimpleImageProps) {
  let source = src;
  if (typeof src === 'object' && typeof (src as ImageURISource).uri === 'undefined') {
    [source] = useAssets(src);
  }
  if (!source) return <YStack {...(imageProps as YStackProps)} />;
  return <Image {...imageProps} src={source} />;
}
