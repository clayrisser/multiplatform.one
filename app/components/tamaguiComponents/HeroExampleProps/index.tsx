import React from 'react';
import { Card, Paragraph, SizableText, Text, XStack, YStack } from 'tamagui';

import { CheckCircle } from '../CheckCircle';
import { ContainerLarge } from '../Container';

const FeatureItem = ({ label, children }) => {
  return (
    <SizableText>
      <SizableText size="$5" fontWeight="800">
        {label}
      </SizableText>
      &nbsp;&nbsp;-&nbsp;&nbsp;
      <SizableText size="$5" tag="span" theme="alt2">
        {children}
      </SizableText>
    </SizableText>
  );
};

const Features = ({ items, ...props }: any) => {
  return (
    <YStack space {...props}>
      {items.map((feature, i) => (
        <Card key={`feature-${i}`} padding="$6" elevation="$1" $sm={{ padding: '$4' }}>
          <XStack tag="li">
            <Text color="$green9">
              <CheckCircle />
            </Text>
            <Paragraph color="$gray11">{feature}</Paragraph>
          </XStack>
        </Card>
      ))}
    </YStack>
  );
};

export const HeroExampleProps = () => {
  return (
    <ContainerLarge position="relative">
      <XStack paddingHorizontal="$6" paddingTop="$8" space="$4" $sm={{ flexDirection: 'column', paddingHorizontal: 0 }}>
        <YStack width="50%" $sm={{ width: '100%' }}>
          <Features
            space="$4"
            items={[
              <FeatureItem key="press&hover-events" label="Press & hover events">
                onHoverIn, onHoverOut, onPressIn, and onPressOut.
              </FeatureItem>,
              <FeatureItem key="Press&hover-events" label="Pseudo styles">
                Style hover, press, and focus, in combination with media queries.
              </FeatureItem>,
              <FeatureItem key="press&hover-events" label="Media queries">
                For every style/variant.
              </FeatureItem>,
            ]}
          />
        </YStack>
        <YStack width="50%" $sm={{ width: `100%` }}>
          <Features
            space="$4"
            items={[
              <FeatureItem key="Themes" label="Themes">
                Change theme on any component.
              </FeatureItem>,
              <FeatureItem key="Themes" label="Animations">
                Animate every component, enter and exit styling, works with pseudo states.
              </FeatureItem>,
              <FeatureItem key="Themes" label="DOM escape hatches">
                Support for className and other HTML attributes.
              </FeatureItem>,
            ]}
          />
        </YStack>
      </XStack>
    </ContainerLarge>
  );
};
