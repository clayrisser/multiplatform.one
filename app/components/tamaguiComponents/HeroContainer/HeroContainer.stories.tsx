import React from 'react';
import { HeroContainer } from './index';
import { Text, Paragraph } from 'tamagui';

export default {
  title: 'app/tamaguiComponents/HeroContainer',
  component: HeroContainer,
  parameters: { status: { type: 'beta' } },
};

export const Default = () => (
  <HeroContainer>
    <Text>Hero Content</Text>
    <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Paragraph>
  </HeroContainer>
);

export const Tinted = () => (
  <HeroContainer tinted>
    <Text>Tinted Hero Content</Text>
    <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Paragraph>
  </HeroContainer>
);
