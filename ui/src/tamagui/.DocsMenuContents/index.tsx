import { docsRoutes } from '@lib/docsRoutes';
import React from 'react';
import { Paragraph, Separator, XStack, YStack } from 'tamagui';

import { DocsRouteNavItem } from 'ui/src/tamagui/DocsRouteNavItem';
import { NavHeading } from 'ui/src/tamagui/NavHeading';
import { useDocsMenu } from 'ui/src/hooks/useDocsMenu';

export const DocsMenuContents = React.memo(() => {
  const { currentPath } = useDocsMenu();

  return React.useMemo(() => {
    return (
      <>
        {docsRoutes.map((section, i) => {
          if ('type' in section) {
            if (section.type === 'hr') {
              return (
                <YStack key={`sep${i}`} mx="$4">
                  {section.title ? (
                    <XStack ai="center" space="$6" spaceDirection="horizontal" mb="$2" mt="$3">
                      <Separator />
                      <Paragraph size="$4">{section.title}</Paragraph>
                    </XStack>
                  ) : (
                    <Separator my="$4" />
                  )}
                </YStack>
              );
            }
            return null;
          }
          return (
            <YStack key={`${section.label}${i}`} mb="$4">
              {!!section.label && <NavHeading>{section.label}</NavHeading>}
              {section.pages.map((page, index) => {
                return (
                  <DocsRouteNavItem
                    key={`${page.route}${index}`}
                    href={page.route}
                    active={currentPath === page.route}
                    pending={page['pending']}
                  >
                    {page.title}
                  </DocsRouteNavItem>
                );
              })}
            </YStack>
          );
        })}
      </>
    );
  }, [currentPath, docsRoutes]);
});