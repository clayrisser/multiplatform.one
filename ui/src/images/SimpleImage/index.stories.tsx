import React from 'react';
import { Platform } from 'react-native';
import { useAssets } from '../../.hooks';
import { SimpleImage } from './index';

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
