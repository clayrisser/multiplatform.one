import { Search as SearchIcon } from '@tamagui/lucide-icons';
import React from 'react';
import { memo, useContext, useEffect, useRef } from 'react';
import type { ButtonProps } from 'tamagui';
import { Button, TooltipSimple, useIsTouchDevice } from 'tamagui';
import { SearchContext } from '../SearchContext';

export const SearchButton = memo((props: ButtonProps) => {
  const { onOpen, onInput } = useContext(SearchContext);
  const isTouch = useIsTouchDevice();
  const ref = useRef();

  useEffect(() => {
    const onKeyDown = (event: any) => {
      if (!ref || ref.current !== document.activeElement || !onInput) {
        return;
      }
      if (!/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
        return;
      }
      onInput(event);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onInput, ref]);

  return (
    <TooltipSimple groupId="header-actions-search" label="Search docs..">
      <Button
        accessibilityLabel="Search docs"
        ref={ref as any}
        onPress={onOpen}
        icon={SearchIcon}
        // dont hide this on touchables to avoid layout shifts...
        iconAfter={
          <Button
            size="$2"
            $sm={{ display: 'none', size: '$4' }}
            chromeless
            borderWidth={0}
            pointerEvents="none"
            opacity={0.35}
          >
            /
          </Button>
        }
        {...props}
      />
    </TooltipSimple>
  );
});
