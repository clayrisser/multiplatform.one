import React from 'react';
import { NextLink } from '../NextLink';
import { SizableText, Spacer, XStack, YStack } from 'tamagui';
import type { NavItemProps } from '../DocsPage';
import { ExternalIcon } from '../ExternalIcon';

export const DocsRouteNavItem = React.memo(({ children, active, href, pending, ...props }: NavItemProps) => {
  const isExternal = href.startsWith('http');
  return (
    <NextLink href={href}>
      <XStack
        className="docs-nav-item all ease-in ms150"
        {...props}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        alignItems="center"
        justifyContent="flex-end"
        paddingVertical="$0.25"
        paddingHorizontal="$4"
        opacity={pending ? 0.25 : 1}
        pressStyle={{
          backgroundColor: '$background',
        }}
        pointerEvents={pending ? 'none' : 'auto'}
        position="relative"
        $sm={{
          paddingVertical: '$1',
        }}
      >
        <YStack
          className="sidebar-indicator"
          opacity={active ? 1 : 0}
          position="absolute"
          top={0}
          bottom={0}
          right={0}
          width={1}
          backgroundColor={active ? '$color' : '$backgroundHover'}
        />
        <SizableText
          className="name"
          size="$4"
          userSelect="none"
          opacity={0.65}
          theme={active ? null : 'alt1'}
          {...(active && {
            fow: '900',
            opacity: 1,
          })}
        >
          {children}
        </SizableText>
        {isExternal && (
          <XStack opacity={0.5}>
            <Spacer size="$2" />
            <ExternalIcon />
          </XStack>
        )}
        {pending ? (
          <>
            <XStack flex={1} />
            <SizableText
              theme="alt2"
              size="$1"
              paddingHorizontal="$2"
              paddingVertical="$1"
              backgroundColor="$background"
              borderRadius="$3"
            >
              WIP
            </SizableText>
          </>
        ) : null}
      </XStack>
    </NextLink>
  );
});
