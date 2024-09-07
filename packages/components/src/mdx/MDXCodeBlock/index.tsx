/**
 * File: /src/mdx/MDXCodeBlock/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 23-04-2024 05:52:22
 * Author: Clay Risser
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

import { LinearGradient } from "@tamagui/linear-gradient";
import { CheckCircle, Clipboard } from "@tamagui/lucide-icons";
import React, { useEffect, useRef, useState, useContext } from "react";
import { ScrollView } from "react-native";
import {
  Button,
  Spacer,
  TooltipSimple,
  XStack,
  YStack,
  getTokens,
} from "tamagui";
import { ErrorBoundary } from "../../ErrorBoundary";
import { Code } from "../../code/Code";
import { Pre } from "../../code/Pre";
import { useClipboard } from "../../hooks/useClipboard";
import type { MDXCodeBlockContextValue } from "./MDXCodeBlockContext";
import { MDXCodeBlockContext } from "./MDXCodeBlockContext";

export interface MDXCodeBlockProps extends MDXCodeBlockContextValue {
  className?: string;
  id?: string;
}

export function MDXCodeBlock(props: MDXCodeBlockProps) {
  const {
    children,
    className,
    disableCopy,
    id,
    isCollapsible,
    isHighlightingLines,
    showLineNumbers: propShowLineNumbers,
    size,
    ...codeProps
  } = { ...useContext(MDXCodeBlockContext), ...props };
  const lines = Array.isArray(children) ? children.length : 0;
  const showLineNumbers = propShowLineNumbers ?? lines > 10;
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible);
  const isLong = lines > 22;
  const [isCutoff, setIsCutoff] = useState(isLong && !isCollapsible);
  const [code, setCode] = useState(undefined);
  const preRef = useRef<any>(null);
  const { hasCopied, onCopy } = useClipboard(code);
  const tokens = getTokens();

  useEffect(() => {
    try {
      if (preRef.current) {
        const codeElement = preRef.current.querySelector("code");
        if (codeElement) {
          const code = codeElement.innerText.replace(/\n{3,}/g, "\n");
          setCode(code);
        }
      }
    } catch {}
  }, [preRef]);

  return (
    <YStack position="relative" marginBottom="$4">
      <ErrorBoundary>
        <YStack
          position="relative"
          {...(isCutoff && {
            maxHeight: 400,
            ov: "hidden",
            br: "$4",
          })}
        >
          {(!isCollapsed || !isCollapsible) && isCutoff && (
            <LinearGradient
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height={200}
              colors={["$backgroundTransparent", "$background"]}
              zIndex={1000}
            >
              <Spacer flex={1} />
              <Button onPress={() => setIsCutoff(!isCutoff)} alignSelf="center">
                Show more
              </Button>
              <Spacer size="$4" />
            </LinearGradient>
          )}
          {(!isCollapsed || !isCollapsible) && (
            <Pre
              ref={preRef}
              data-invert-line-highlight={isHighlightingLines}
              data-line-numbers={showLineNumbers}
              className={className}
              padding={0}
              marginBottom={0}
              id={id}
            >
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{ minWidth: "100%" }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                <Code
                  backgroundColor="transparent"
                  className={className}
                  flex={1}
                  lineHeight={tokens.space[size || "$5"] as any}
                  padding="$4"
                  size={size ?? "$5"}
                  {...codeProps}
                >
                  {children}
                </Code>
              </ScrollView>
            </Pre>
          )}
          <XStack position="absolute" top="$3" right="$3" gap="$3">
            {(!isCollapsed || !isCollapsible) && !disableCopy && (
              <TooltipSimple label={hasCopied ? "Copied" : "Copy to clipboard"}>
                <Button
                  aria-label="Copy code to clipboard"
                  size="$2"
                  icon={hasCopied ? CheckCircle : Clipboard}
                  onPress={onCopy}
                  $xs={{
                    display: "none",
                  }}
                />
              </TooltipSimple>
            )}
            {isCollapsible && (
              <Button
                accessibilityLabel="Show or hide code"
                size="$2"
                onPress={() => setIsCollapsed((x) => !x)}
              >
                {isCollapsed ? "Show code" : "Hide code"}
              </Button>
            )}
          </XStack>
        </YStack>
      </ErrorBoundary>
    </YStack>
  );
}
