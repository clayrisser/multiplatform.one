import React from 'react';
import { Paragraph, Theme, Tooltip, TooltipProps, ThemeProps, ParagraphProps } from 'tamagui';

type SimpleToolTipProps = TooltipProps & { element: React.ReactNode } & { themeStyle?: ThemeProps } & {
  paragraphStyle?: ParagraphProps;
};

export function SimpleTooltip({
  Icon,
  children,
  element,
  themeStyle,
  paragraphStyle,
  ...props
}: SimpleToolTipProps & { Icon?: any }) {
  return (
    <Tooltip {...props}>
      <Tooltip.Trigger>{children}</Tooltip.Trigger>
      <Theme inverse {...themeStyle}>
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
          <Paragraph size="$2" lineHeight="$1" {...paragraphStyle}>
            {element}
          </Paragraph>
        </Tooltip.Content>
      </Theme>
    </Tooltip>
  );
}
