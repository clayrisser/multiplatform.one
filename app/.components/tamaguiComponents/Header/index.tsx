import { ThemeToggle } from '../ThemeToggle';
import { LogoWords, TamaguiLogo } from '../Logo';
import { ThemeTint, useTint } from '@multiplatform/ui/src/.hooks/useTint';
import { Menu } from '@tamagui/lucide-icons';
import { useRouter } from 'next/router';
import * as React from 'react';
import type { ParagraphProps } from 'tamagui';
import {
  Adapt,
  Button,
  Paragraph,
  Popover,
  Separator,
  Text,
  TooltipGroup,
  VisuallyHidden,
  XGroup,
  XStack,
  YStack,
  isClient,
  useMedia,
} from 'tamagui';

export interface HeaderProps {
  floating?: boolean;
  disableNew?: boolean;
  showExtra?: boolean;
  forceShowAllLinks?: boolean;
  minimal?: boolean;
}

import { AlphaButton } from '../AlphaButton';
import { ColorToggleButton } from '../ColorToggleButton';
import { ContainerLarge } from '../Container';
import { DocsMenuContents } from '../DocsMenuContents';
import { GithubIcon } from '../GitHubIcon';
import { NextLink } from '../NextLink';
// import { SearchButton } from '../SearchButton';
import { SeasonToggleButton } from '../SeasonToggleButton';
import { SponsorButton } from '../SponsorButton';
import { useDocsMenu } from '../../../hooks/useDocsMenu';

export function Header(props: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  if (isClient) {
    React.useEffect(() => {
      const onScroll = () => {
        setIsScrolled(window.scrollY > 30);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
      };
    }, []);
  }

  return (
    <>
      <XStack
        className={`ease-out all ms200 ${isScrolled ? 'blur-light hover-highlights ' : ''}`}
        bbc="$borderColor"
        zi={50000}
        // @ts-ignore
        pos="fixed"
        top={0}
        my={isScrolled ? -2 : 0}
        left={0}
        right={0}
        elevation={isScrolled ? '$1' : 0}
        py={isScrolled ? '$0' : '$2'}
      >
        <YStack o={isScrolled ? 0.9 : 0} fullscreen bc="$background" />
        <ContainerLarge>
          <ThemeTint>
            <HeaderContents floating {...props} />
          </ThemeTint>
        </ContainerLarge>
      </XStack>
      <YStack height={54} w="100%" />
    </>
  );
}

export function HeaderContents(props: HeaderProps) {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const isInSubApp = router.pathname.startsWith('/takeout') || router.pathname.startsWith('/studio');
  const { setNextTint } = useTint();

  return (
    <XStack
      ai="center"
      position="relative"
      tag="header"
      jc="space-between"
      pos="relative"
      py={props.floating ? 0 : '$2'}
      zi={50000}
    >
      <XStack ai="center" space="$4">
        {isHome ? (
          <YStack my={-20} onPress={setNextTint} px="$3">
            <TamaguiLogo downscale={props.floating ? 2 : 1.5} />
          </YStack>
        ) : (
          <NextLink href="/">
            <YStack px="$3" cur="pointer" my={-20}>
              <TamaguiLogo downscale={props.floating ? 2 : 1.5} />
            </YStack>
          </NextLink>
        )}

        <TooltipGroup delay={{ open: 3000, close: 100 }}>
          <XGroup ov="hidden" boc="$color2" bw={1} mah={32} bc="transparent" ai="center" size="$3">
            <XGroup>
              <ThemeToggle borderWidth={0} chromeless />
            </XGroup>
            <XGroup>
              <ColorToggleButton borderWidth={0} chromeless />
            </XGroup>
            <XGroup>
              <SeasonToggleButton borderWidth={0} chromeless />
            </XGroup>
          </XGroup>
        </TooltipGroup>

        <YStack
          paddingStart={200}
          // $xxs={{ dsp: 'none' }}
        >
          <SponsorButton tiny />
        </YStack>

        {!props.disableNew && <AlphaButton />}

        {isInSubApp && (
          <NextLink href="/">
            <Button size="$2">Back to Tamagui</Button>
          </NextLink>
        )}
      </XStack>

      <XStack
        position="absolute"
        className="all ease-in ms150"
        $sm={{
          opacity: 0,
          pointerEvents: 'none',
        }}
        zIndex={-1}
        jc="center"
        fullscreen
        pointerEvents="none"
        ai="center"
      >
        <NextLink href="/">
          <XStack cursor={isHome ? 'default' : 'pointer'} pointerEvents="auto" als="center">
            <LogoWords animated />
          </XStack>
        </NextLink>
      </XStack>

      {/*  prevent layout shift */}
      <XStack h={40} jc="flex-end" miw={160} $xs={{ miw: 130 }} pointerEvents="auto" tag="nav">
        {isInSubApp ? (
          <XStack ai="center" space="$2">
            <NextLink href="/signin">
              <Paragraph
                fontFamily="$silkscreen"
                px="$3"
                py="$2"
                cursor="pointer"
                size="$3"
                o={0.7}
                hoverStyle={{ opacity: 1 }}
                // $xxs={{
                //   display: 'none',
                // }}
              >
                Login
              </Paragraph>
            </NextLink>

            <NextLink href="/takeout/purchase">
              <Button fontFamily="$silkscreen" size="$3">
                Purchase
              </Button>
            </NextLink>
          </XStack>
        ) : (
          <XStack ai="center" space="$3">
            <HeaderLinks {...props} />

            {/* <SearchButton size="$2" br="$10" elevation="$4" /> */}

            <NextLink target="_blank" href="https://github.com/tamagui/tamagui">
              <YStack
                $xs={{ maw: 0, mah: 0, ov: 'hidden', mr: '$-6' }}
                p="$2"
                opacity={0.7}
                hoverStyle={{ opacity: 1 }}
              >
                <VisuallyHidden>
                  <Text>Github</Text>
                </VisuallyHidden>
                <GithubIcon width={23} />
              </YStack>
            </NextLink>

            <SmallMenu />
          </XStack>
        )}
      </XStack>
    </XStack>
  );
}

const HeaderLinks = ({ showExtra, forceShowAllLinks }: HeaderProps) => {
  return (
    <>
      <NextLink prefetch={false} href="/docs/intro/installation">
        <HeadAnchor
          $sm={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Docs
        </HeadAnchor>
      </NextLink>

      <NextLink prefetch={false} href="/blog">
        <HeadAnchor
          $md={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          Blog
        </HeadAnchor>
      </NextLink>

      <NextLink prefetch={false} href="/community">
        <HeadAnchor
          $md={{
            display: forceShowAllLinks ? 'flex' : 'none',
          }}
        >
          More
        </HeadAnchor>
      </NextLink>

      {showExtra && (
        <NextLink prefetch={false} href="/studio">
          <HeadAnchor>Studio</HeadAnchor>
        </NextLink>
      )}

      {showExtra && (
        <NextLink prefetch={false} href="/takeout">
          <HeadAnchor>Takeout</HeadAnchor>
        </NextLink>
      )}
    </>
  );
};

const SmallMenu = React.memo(() => {
  const { router, open, setOpen } = useDocsMenu();
  // const isDocs = router.pathname.startsWith('/docs')
  const media = useMedia();

  if (media.gtMd) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen} size="$5" stayInFrame={{ padding: 20 }}>
      <Popover.Trigger asChild>
        <YStack
          $gtMd={{
            display: 'none',
          }}
        >
          <Button size="$3" chromeless noTextWrap onPress={() => setOpen(!open)} theme={open ? 'alt1' : undefined}>
            <Menu size={16} color="var(--color)" />
          </Button>
        </YStack>
      </Popover.Trigger>

      <Adapt platform="touch" when="sm">
        <Popover.Sheet zIndex={100000000} modal dismissOnSnapToBottom>
          <Popover.Sheet.Frame>
            <Popover.Sheet.ScrollView>
              <Adapt.Contents />
            </Popover.Sheet.ScrollView>
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay zIndex={100} />
        </Popover.Sheet>
      </Adapt>

      <Popover.Content
        bw={1}
        boc="$borderColor"
        enterStyle={{ x: 0, y: -10, o: 0 }}
        exitStyle={{ x: 0, y: -10, o: 0 }}
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
        p={0}
        maxHeight="80vh"
        elevate
        zIndex={100000000}
      >
        <Popover.Arrow bw={1} boc="$borderColor" />

        <Popover.ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <YStack
            miw={230}
            p="$3"
            ai="flex-end"
            // display={open ? 'flex' : 'none'}
          >
            <HeaderLinks forceShowAllLinks />
            <Separator my="$4" w="100%" />
            <DocsMenuContents />
          </YStack>
        </Popover.ScrollView>
      </Popover.Content>
    </Popover>
  );
});

const HeadAnchor = React.forwardRef((props: ParagraphProps, ref) => (
  <Paragraph
    ref={ref as any}
    fontFamily="$silkscreen"
    px="$3"
    py="$2"
    cursor="pointer"
    size="$3"
    color="$color10"
    hoverStyle={{ opacity: 1, color: '$color' }}
    pressStyle={{ opacity: 0.25 }}
    // @ts-ignore
    tabIndex={-1}
    w="100%"
    // jc="flex-end"
    {...props}
  />
));
