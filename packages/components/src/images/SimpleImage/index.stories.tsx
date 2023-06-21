import React from 'react';
import { Platform } from 'react-native';
import { useAssets } from '../../hooks';
import { SimpleImage } from './index';
import { YStack } from 'tamagui';

export default {
  title: 'images/SimpleImage',
  component: SimpleImage,
  parameters: {
    status: { type: 'beta' },
  },
};

export const main = (args: any[]) => <SimpleImage src={require('../../../assets/poker-game-1894.png')} {...args} />;
main.args = {
  aspectRatio: undefined,
  height: undefined,
  width: undefined,
  bg: 'black',
};

export const withSvg = (args: any[]) => <SimpleImage src={require('../../../assets/pentagon.svg')} {...args} />;
withSvg.args = {
  aspectRatio: undefined,
  height: undefined,
  bg: 'black',
  width: undefined,
  resizeMode: undefined,
};
withSvg.argTypes = {
  resizeMode: {
    control: {
      type: Platform.OS === 'web' ? 'select' : 'text',
      options: ['contain', 'cover', 'stretch'],
    },
  },
};

function WithUseAssets() {
  const [pokerGame1894Png] = useAssets([require('../../../assets/poker-game-1894.png')]);
  return <SimpleImage width={400} height={400} backgroundColor="black" src={pokerGame1894Png} />;
}
export const withUseAssets = () => <WithUseAssets />;

function WithRequire() {
  return (
    <SimpleImage
      width={400}
      height={400}
      backgroundColor="black"
      src={require('../../../assets/poker-game-1894.png')}
    />
  );
}
export const withRequire = () => <WithRequire />;

export const withYStack = () => (
  <YStack>
    <YStack width="50%" height={200} bg="red" />
    <YStack width="50%" height={200} bg="blue" />
    <SimpleImage
      bg="green"
      height={200}
      resizeMode="stretch"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Inukshuk_Park_05.jpg/500px-Inukshuk_Park_05.jpg"
      width="50%"
    />
  </YStack>
);

export const withTamagui = () => (
  <YStack>
    <SimpleImage
      bg="$green9"
      h="$19"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Inukshuk_Park_05.jpg/500px-Inukshuk_Park_05.jpg"
      w="100%"
    />
  </YStack>
);
