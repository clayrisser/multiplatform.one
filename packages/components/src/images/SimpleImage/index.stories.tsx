/**
 * File: /src/images/SimpleImage/index.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 22-06-2023 05:33:09
 * Author: Clay Risser
 * -----
 * BitSpur (c) Copyright 2021 - 2023
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { useAssets } from '../../hooks';
import { Props, SimpleImage } from './index';
import { YStack } from 'tamagui';

export default {
  title: 'images/SimpleImage',
  component: SimpleImage,
  parameters: {
    status: { type: 'beta' },
  },
};

// export const main = (args: any[]) => <SimpleImage src={require('../../../assets/poker-game-1894.png')} {...args} />;
// main.args = {
//   aspectRatio: undefined,
//   height: undefined,
//   width: undefined,
//   bg: 'black',
// };

// export const withSvg = (args: any[]) => <SimpleImage src={require('../../../assets/pentagon.svg')} {...args} />;
// withSvg.args = {
//   aspectRatio: undefined,
//   height: undefined,
//   bg: 'black',
//   width: undefined,
//   resizeMode: undefined,
// };
// withSvg.argTypes = {
//   resizeMode: {
//     control: {
//       type: Platform.OS === 'web' ? 'select' : 'text',
//       options: ['contain', 'cover', 'stretch'],
//     },
//   },
// };

// function WithUseAssets() {
//   const [pokerGame1894Png] = useAssets([require('../../../assets/poker-game-1894.png')]);
//   return <SimpleImage width={400} height={400} backgroundColor="black" src={pokerGame1894Png} />;
// }
// export const withUseAssets = () => <WithUseAssets />;

// function WithRequire() {
//   return (
//     <SimpleImage
//       width={400}
//       height={400}
//       backgroundColor="black"
//       src={require('../../../assets/poker-game-1894.png')}
//     />
//   );
// }
// export const withRequire = () => <WithRequire />;

export const withYStack = (args: Props) => (
  <YStack>
    <YStack {...args} />
    <YStack {...args} backgroundColor="blue" />
    <SimpleImage
      backgroundColor="green"
      height={200}
      resizeMode="stretch"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Inukshuk_Park_05.jpg/500px-Inukshuk_Park_05.jpg"
      width="50%"
      {...args}
    />
  </YStack>
);

withYStack.args = {
  height: 200,
  width: '50%',
  backgroundColor: 'green',
  // loader: 'ImageLoader',
  loading: 'lazy',
};

export const withTamagui = (args: Props) => (
  <YStack>
    <SimpleImage
      backgroundColor="$green9"
      height="$19"
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Inukshuk_Park_05.jpg/500px-Inukshuk_Park_05.jpg"
      width="100%"
      {...args}
    />
  </YStack>
);

withTamagui.args = {
  height: '$20',
  width: '100%',
  backgroundColor: '$red8',
  // loader: 'ImageLoader',
  loading: 'lazy',
};
