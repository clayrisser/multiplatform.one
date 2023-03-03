import React from 'react';
import { H3, Paragraph, XStack, YStack, useComposedRefs } from 'tamagui';
import { FancyCard, OuterSubtleBorder } from 'ui/src/tamagui/FancyCard';
// import { useHoverGlow } from '../HoverGlow';
import { NotoIcon } from '../NotoIcon';

export const TamaCard = ({ title, icon, subtitlePre, subtitlePost, description, footer, children }: any) => {
  // const shadow = useHoverGlow({
  //   resist: 92,
  //   borderRadius: 0,
  //   strategy: 'blur',
  //   blurPct: 4,
  //   initialOffset: {
  //     y: -100,
  //   },
  //   full: true,
  //   scale: 1,
  //   background: 'transparent',
  //   opacity: 1,
  //   inverse: true,
  // })
  // const glow = useHoverGlow({
  //   resist: 0,
  //   size: 300,
  //   color: 'var(--color)',
  //   opacity: 0.18,
  //   style: {
  //     zIndex: -1,
  //   },
  // })
  // const containerRef = useComposedRefs<any>(glow.parentRef, shadow.parentRef)
  return (
    <YStack
      className="transition all ease-in ms100"
      position="relative"
      width="calc(33.33%)"
      $md={{
        width: 'calc(50%)',
      }}
      $sm={{ width: 'auto', minWidth: '100%' }}
      padding="$3"
      hoverStyle={{
        zIndex: 1000,
      }}
    >
      {/* shadow */}
      {/* {shadow.element} */}
      <FancyCard
        // ref={containerRef}
        ov="hidden"
        y={0}
      >
        {/* glow */}
        {/* {glow.element} */}
        <XStack backgroundColor="$backgroundStrong" flex={1} padding="$5" margin={1} borderRadius="$6" space>
          <YStack flex={1} space="$2" alignItems="center">
            <H3
              alignSelf="flex-start"
              fontFamily="$silkscreen"
              size="$7"
              fontWeight="200"
              color="$color"
              cursor="default"
              letterSpacing={1}
            >
              {title}
            </H3>

            {!!(subtitlePre || subtitlePost) && (
              <XStack>
                {!!subtitlePre && (
                  <Paragraph cursor="default" tag="time" size="$7" theme="alt2">
                    {subtitlePre}
                  </Paragraph>
                )}
                {!!subtitlePost && (
                  <Paragraph cursor="default" fontWeight="800" theme="alt2" size="$7">
                    {subtitlePost}
                  </Paragraph>
                )}
              </XStack>
            )}

            <Paragraph o={0.65} cursor="default" theme="alt2" size="$4" fontWeight="500">
              {children || description}
            </Paragraph>

            {footer}
          </YStack>

          {!!icon && <NotoIcon size="$11">{icon}</NotoIcon>}
        </XStack>
      </FancyCard>
    </YStack>
  );
};
