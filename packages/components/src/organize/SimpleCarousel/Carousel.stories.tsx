/**
 * File: /src/organize/SimpleCarousel/Carousel.stories.tsx
 * Project: @multiplatform.one/components
 * File Created: 17-10-2023 14:47:51
 * Author: Lalit rajak
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
import { SimpleCarousel, CarouselProps } from './index';
import React from 'react';
import { SimpleImage } from '../../images/SimpleImage';

export default {
  title: 'organize/SimpleCarousel',
  component: SimpleCarousel,
  parameters: {
    status: {
      type: 'beta',
    },
  },
};

const mail = require('../../../assets/mail.png');
const pentagon = require('../../../assets/pentagon.svg');

export const Main = (args: CarouselProps) => (
  <SimpleCarousel speed={args.speed} {...args} defaultSlide={4}>
    <SimpleImage src={mail} height={300} resizeMode="cover" />
    <SimpleImage src={pentagon} height={300} resizeMode="cover" />
    <SimpleImage src={mail} height={300} resizeMode="cover" />
    <SimpleImage src={pentagon} height={300} resizeMode="cover" />
  </SimpleCarousel>
);

Main.args = {
  speed: 3000,
  showCenterIndicator: true,
  showSideArrows: true,
};
