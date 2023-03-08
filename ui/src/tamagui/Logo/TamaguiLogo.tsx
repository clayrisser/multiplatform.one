import React from 'react';
import { forwardRef, memo, useEffect, useState } from 'react';
import type { XStackProps } from 'tamagui';
import { Circle, XStack, YStack } from 'tamagui';
import { Apple } from '@tamagui/lucide-icons';
import { useTint } from 'app/hooks/useTint';

type LogoProps = {
  showWords?: boolean;
  downscale?: number;
  animated?: boolean;
} & XStackProps;

export const TamaguiLogo = forwardRef<any, LogoProps>(
  ({ showWords, downscale, animated, ...props }: LogoProps, ref) => {
    return (
      <XStack tag="span" ref={ref} alignItems="center" justifyContent="center" space="$5" {...props}>
        <LogoIcon downscale={(downscale ?? 1) * (showWords ? 2 : 1.5)} icon={Apple} />
        {showWords && (
          <YStack tag="span" marginBottom={-4}>
            <LogoWords animated={animated} downscale={downscale ?? 2} />
          </YStack>
        )}
      </XStack>
    );
  },
);

export const LogoWords = memo(({ downscale = 1, animated }: { downscale?: number; animated?: boolean }) => {
  const Tint = useTint();
  const { tintIndex: index } = Tint;
  const tints = Tint.tints.map((t) => `var(--${t}9)`);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState<'start' | 'animate' | 'done'>('start');

  useEffect(() => {
    setTimeout(() => {
      setMounted('animate');
    });

    setTimeout(() => {
      setMounted('done');
    }, 1500);
  }, []);

  const getColor = (i: number) => {
    const isActive = mounted !== 'start' && i === index;
    if (mounted !== 'done' || hovered) {
      return isActive ? 'var(--color)' : tints[index];
    }
    if (hovered && isActive) {
      return 'var(--color)';
    }
    return tints[i];
  };

  const x = Math.round(index * 18.5 + (18 / 2) * (index / tints.length) + 3 + (index === 6 ? -3 : 0));

  return (
    <XStack
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      paddingVertical="$2"
      marginVertical="$-2"
      position="relative"
    >
      {animated && (
        <Circle
          animation="quick"
          position="absolute"
          top={0}
          left={0}
          y={mounted === 'start' ? -30 : -3}
          // the last i is less wide
          x={x}
          size={4}
          backgroundColor="$color9"
        />
      )}
      <svg width={373 * (1 / downscale) * 0.333333334} height={41 * (1 / downscale) * 0.333333334} viewBox="0 0 373 41">
        <polygon
          shapeRendering="crispEdges"
          fill={getColor(0)}
          points="24.3870968 40.1612903 24.3870968 8.67741935 32.2580645 8.67741935 32.2580645 0.806451613 0.774193548 0.806451613 0.774193548 8.67741935 8.64516129 8.67741935 8.64516129 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(0)}
        />
        <path
          shapeRendering="crispEdges"
          fill={getColor(1)}
          d="M87.3548387,0.806451613 L87.3548387,8.67741935 L95.2258065,8.67741935 L95.2258065,40.1612903 L79.483871,40.1612903 L79.483871,24.4193548 L71.6129032,24.4193548 L71.6129032,40.1612903 L55.8709677,40.1612903 L55.8709677,8.67741935 L63.7419355,8.67741935 L63.7419355,0.806451613 L87.3548387,0.806451613 Z M79.483871,8.67741935 L71.6129032,8.67741935 L71.6129032,16.5483871 L79.483871,16.5483871 L79.483871,8.67741935 Z"
          fillRule="nonzero"
          onMouseEnter={() => Tint.setTintIndex(1)}
        />
        <polygon
          shapeRendering="crispEdges"
          fill={getColor(2)}
          points="130.645161 40.1612903 130.645161 22.4516129 138.516129 22.4516129 138.516129 40.1612903 154.258065 40.1612903 154.258065 0.806451613 142.451613 0.806451613 142.451613 8.67741935 126.709677 8.67741935 126.709677 0.806451613 114.903226 0.806451613 114.903226 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(2)}
        />
        <path
          fill={getColor(3)}
          d="M205.419355,0.806451613 L205.419355,8.67741935 L213.290323,8.67741935 L213.290323,40.1612903 L197.548387,40.1612903 L197.548387,24.4193548 L189.677419,24.4193548 L189.677419,40.1612903 L173.935484,40.1612903 L173.935484,8.67741935 L181.806452,8.67741935 L181.806452,0.806451613 L205.419355,0.806451613 Z M197.548387,8.67741935 L189.677419,8.67741935 L189.677419,16.5483871 L197.548387,16.5483871 L197.548387,8.67741935 Z"
          fillRule="nonzero"
          onMouseEnter={() => Tint.setTintIndex(3)}
        />
        <polygon
          shapeRendering="crispEdges"
          fill={getColor(4)}
          points="264.451613 40.1612903 264.451613 32.2903226 272.322581 32.2903226 272.322581 16.5483871 256.580645 16.5483871 256.580645 32.2903226 248.709677 32.2903226 248.709677 8.67741935 272.322581 8.67741935 272.322581 0.806451613 240.83871 0.806451613 240.83871 8.67741935 232.967742 8.67741935 232.967742 32.2903226 240.83871 32.2903226 240.83871 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(4)}
        />
        <polygon
          shapeRendering="crispEdges"
          fill={getColor(5)}
          points="323.483871 40.1612903 323.483871 32.2903226 331.354839 32.2903226 331.354839 0.806451613 315.612903 0.806451613 315.612903 32.2903226 307.741935 32.2903226 307.741935 0.806451613 292 0.806451613 292 32.2903226 299.870968 32.2903226 299.870968 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(5)}
        />
        <polygon
          shapeRendering="crispEdges"
          fill={getColor(6)}
          points="372.677419 40.1612903 372.677419 0.806451613 356.935484 0.806451613 356.935484 40.1612903"
          onMouseEnter={() => Tint.setTintIndex(6)}
        />
      </svg>
    </XStack>
  );
});

export const LogoIcon = ({ downscale = 2 }: any) => {
  return (
    <YStack
      tag="span"
      className="unselectable"
      alignSelf="center"
      marginVertical={-10}
      pressStyle={{
        opacity: 0.7,
        scaleX: -1,
      }}
    >
      <img className="tamagui-icon" width={450 / 8 / downscale} height={420 / 8 / downscale} src="/tamagui-icon.svg" />
    </YStack>
  );
};
