import dynamic from 'next/dynamic';
import React, { Suspense, useEffect, useState } from 'react';
import { YStack } from 'tamagui';

// import type { CodeBlockProps } from './CodeBlock'

export function CodeDemo({ css, line, maxHeight, height, minWidth, ...props }: any) {
  const [Comp, setComp] = useState<any>(null);

  // //   useEffect(() => {
  // //     // const CodeBlock = dynamic(() => import('./CodeBlock'))
  // //     setComp(CodeBlock)
  // //   }, [])

  return (
    <YStack
      br="$8"
      className="scroll-vertical"
      maxHeight={maxHeight}
      height={height}
      minWidth={minWidth}
      bc="$backgroundHover"
      boc="$borderColor"
      bw={1}
      f={1}
    >
      {!!Comp && <Comp backgroundColor="transparent" borderWidth={0} {...props} line="0" marginBottom={0} />}
    </YStack>
  );
}
