import React from 'react';
import { Paragraph, Theme, Tooltip, TooltipProps } from 'tamagui';

type SimpleToolTipProps = TooltipProps & { element: React.ReactNode };

export function SimpleTooltip({ Icon, children, element, ...props }: SimpleToolTipProps & { Icon?: any }) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Theme inverse>
        <Tooltip.Content
          enterStyle={{ x: 0, y: -5, o: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: -5, o: 0, scale: 0.9 }}
          scale={1}
          x={0}
          y={0}
          o={1}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <Tooltip.Arrow />
          <Paragraph size="$2" lineHeight="$1">
            {element}
          </Paragraph>
        </Tooltip.Content>
      </Theme>
    </Tooltip>
  );
}
