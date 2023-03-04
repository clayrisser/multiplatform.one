import React from 'react';
import { Paragraph, Theme, XStack, styled } from 'tamagui';

import { unwrapText } from '../unwrapText';

export const Notice = ({ children, theme = 'yellow', disableUnwrap, ...props }: any) => {
  return (
    <NoticeFrame theme={theme} {...props}>
      <Paragraph py="$2" theme="alt1" mt={-3} mb={-3} className="paragraph-parent">
        {disableUnwrap ? children : unwrapText(children)}
      </Paragraph>
    </NoticeFrame>
  );
};

export const NoticeFrame = styled(XStack, {
  className: 'no-opacity-fade',
  borderWidth: 1,
  borderColor: '$borderColor',
  p: '$4',
  py: '$3',
  bc: '$background',
  br: '$4',
  space: '$3',
  my: '$4',
  pos: 'relative',
});
