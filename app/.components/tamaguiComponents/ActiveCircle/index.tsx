import React from 'react';
import type { CircleProps } from 'tamagui';
import { Circle, YStack } from 'tamagui';

export const ActiveCircle = (props: CircleProps & { isActive?: boolean }) => {
  const { isActive, backgroundColor, opacity, ...rest } = props;

  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      borderRadius="$10"
      borderColor="transparent"
      borderWidth={1}
      marginHorizontal="$1"
      {...(isActive && {
        borderColor: '$color',
      })}
      {...(!isActive && {
        hoverStyle: {
          borderColor: '$color5',
        },
      })}
      {...rest}
    >
      <YStack
        borderRadius="$10"
        backgroundColor="yellow"
        width={22}
        height={22}
        alignItems="center"
        justifyContent="center"
        borderColor="red"
        cursor="pointer"
      >
        <Circle size={16} opacity={opacity} backgroundColor={backgroundColor} />
      </YStack>
    </YStack>
  );
};
