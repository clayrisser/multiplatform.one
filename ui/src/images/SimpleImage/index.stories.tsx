import React from 'react';
import { useAssets } from '../../hooks';
import { SimpleImage } from './index';

export default {
  title: 'images/SimpleImage',
  component: SimpleImage,
  parameters: {
    status: { type: 'beta' },
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
