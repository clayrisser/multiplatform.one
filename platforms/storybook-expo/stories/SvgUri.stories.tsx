import React from 'react';
import { SvgUri } from '@multiplatform.one/components/src/images/SvgUri';
import { useAssets } from '@multiplatform.one/components/src/hooks';

export default {
  title: 'images/SvgUri',
  component: SvgUri,
  parameters: {
    status: { type: 'beta' },
  },
};

function Main() {
  const [pentagonSvg] = useAssets([require('app/assets/pentagon.svg')]);
  if (!pentagonSvg?.uri) return null;
  return <SvgUri width={304} height={290} uri={pentagonSvg?.uri} />;
}
export const main = () => <Main />;
