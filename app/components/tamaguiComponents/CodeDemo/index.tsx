import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { YStack } from 'tamagui';
import type { CodeBlockProps } from '../CodeBlock';

export function CodeDemo({ css, line, maxHeight, height, minWidth, ...props }: CodeBlockProps) {
  const [Comp, setComp] = useState<any>(null);

  useEffect(() => {
    const CodeBlock = dynamic(() => import('../CodeBlock'));
    setComp(CodeBlock);
  }, []);

  return (
    <YStack
      borderRadius="$8"
      className="scroll-vertical"
      maxHeight={maxHeight}
      height={height}
      minWidth={minWidth}
      backgroundColor="$backgroundHover"
      borderColor="$borderColor"
      borderWidth={1}
      // for hero code
      flex={1}
    >
      {!!Comp && <Comp backgroundColor="transparent" borderWidth={0} {...props} line="0" marginBottom={0} />}
    </YStack>
  );
}
