/* eslint-disable max-nested-callbacks */
import { docsRoutes } from '../../lib/docsRoutes';
import React from 'react';
import { Paragraph, Separator, XStack, YStack } from 'tamagui';
import { NavHeading } from '../NavHeading';
import { DocsRouteNavItem } from '../DocsRouteNavItem';
import { useDocsMenu } from 'app/hooks/useDocsMenu';

export const DocsMenuContents = React.memo(() => {
  const { currentPath } = useDocsMenu();
  return React.useMemo(() => {
    return (
      <>
        {docsRoutes.map((section, i) => {
          if ('type' in section) {
            if (section.type === 'hr') {
              return (
                <YStack key={`sep${i}`} marginHorizontal="$4">
                  {section.title ? (
                    <XStack alignItems="center" space="$6" spaceDirection="horizontal" marginBottom="$2" marginTop="$3">
                      <Separator />
                      <Paragraph size="$4">{section.title}</Paragraph>
                    </XStack>
                  ) : (
                    <Separator marginVertical="$4" />
                  )}
                </YStack>
              );
            }
            return null;
          }
          return (
            <YStack key={`${section.label}${i}`} marginBottom="$4">
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
