/**
 * File: /src/organize/SimpleCarousel/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 11-09-2024 14:21:33
 * File: /src/organize/SimpleCarousel/index.tsx
 * -----
 * BitSpur (c) Copyright 2021 - 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IconProps } from "@tamagui/helpers-icon";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";
import { Children, type ReactNode, useEffect, useRef, useState } from "react";
import type { YStackProps } from "tamagui";
import { Stack, Text, XStack, YStack } from "tamagui";

export type CarouselProps = YStackProps & {
  children: ReactNode;
  speed?: number;
  showCenterIndicator?: boolean;
  showSideArrows?: boolean;
  defaultSlide?: number;
  sideArrowStyle?: IconProps;
};

export function SimpleCarousel({
  children,
  speed = 3000,
  showCenterIndicator = true,
  showSideArrows = true,
  defaultSlide,
  sideArrowStyle,
  ...props
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const childrenCount = Children.count(children);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % childrenCount);
    }, speed);

    return () => {
      clearInterval(slideInterval);
    };
  }, [children, speed]);

  useEffect(() => {
    if (defaultSlide !== undefined && defaultSlide <= childrenCount) {
      setCurrentSlide((defaultSlide - 1 + childrenCount) % childrenCount);
    }
  }, [defaultSlide]);

  function handlePressNext() {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % childrenCount);
  }

  function handlePressPrev() {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + childrenCount) % childrenCount,
    );
  }

  function renderSideArrows() {
    return (
      <>
        <YStack
          height={carouselRef.current?.clientHeight}
          backgroundColor="$backgroundTransparent"
          position="absolute"
          justifyContent="center"
          alignItems="center"
        >
          <Text onPress={handlePressPrev} cursor="pointer">
            <ChevronLeft color="gray" size="$4" {...sideArrowStyle} />
          </Text>
        </YStack>
        <YStack
          height={carouselRef.current?.clientHeight}
          backgroundColor="$backgroundTransparent"
          position="absolute"
          justifyContent="center"
          alignItems="center"
          right={0}
        >
          <Text onPress={handlePressNext} cursor="pointer">
            <ChevronRight color="gray" size="$4" {...sideArrowStyle} />
          </Text>
        </YStack>
      </>
    );
  }

  function renderCenterIndicator() {
    return (
      <YStack
        height={carouselRef.current?.clientHeight}
        backgroundColor="$backgroundTransparent"
        position="absolute"
        justifyContent="flex-end"
        alignItems="center"
        left={0}
        right={0}
      >
        <XStack gap="$2" alignItems="center" marginBottom={20}>
          {Array.from({ length: childrenCount }).map((_, index) => (
            <Stack
              height={index === currentSlide ? 4 : 1}
              backgroundColor="$backgroundHover"
              width={30}
              key={index}
              cursor="pointer"
              marginVertical="$2"
              onPress={() => setCurrentSlide(index)}
            />
          ))}
        </XStack>
      </YStack>
    );
  }

  return (
    <YStack overflow="hidden">
      <XStack
        transform={[
          {
            translateX: -currentSlide * (carouselRef.current?.clientWidth || 1),
          },
        ]}
        width="100%"
        animation="lazy"
        {...props}
        ref={carouselRef}
      >
        {Children.map(children, (child, index) => (
          <YStack key={index} flex-flexGrow={0} flexShrink={0} flexBasis="100%">
            {child}
          </YStack>
        ))}
      </XStack>
      {showCenterIndicator && childrenCount > 1 && renderCenterIndicator()}
      {showSideArrows && childrenCount > 1 && renderSideArrows()}
    </YStack>
  );
}
