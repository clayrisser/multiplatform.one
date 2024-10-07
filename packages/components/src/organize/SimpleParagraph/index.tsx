/**
 * File: /src/organize/SimpleParagraph/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 11-09-2024 14:21:33
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

import type { ReactNode } from "react";
import type { ParagraphProps, YStackProps } from "tamagui";
import { Paragraph, ScrollView, Text, XStack, YStack } from "tamagui";
import { CodeBlock } from "../../code";

export interface SimpleParagraphProps
  extends YStackProps,
    Pick<ParagraphProps, "color" | "fontSize"> {
  children: string;
}

export const SimpleParagraph = ({
  children,
  ...props
}: SimpleParagraphProps) => {
  if (typeof children !== "string") return null;

  function parseContent(data) {
    const regex = /```(.*?)\n([\s\S]*?)```|[\s\S]+?(?=```|$)/g;
    const boldTextRegex = /\*\*(.*?)\*\*/g;
    const segments = data?.match(regex);
    const parsedSegments: {
      type: string;
      content?: ReactNode;
      language?: string;
      code?: string;
      isBold?: boolean;
    }[] = [];

    segments?.forEach((segment) => {
      const codeMatch = segment.match(/```(.*?)\n([\s\S]*?)```/);
      if (codeMatch) {
        parsedSegments.push({
          type: "code",
          language: codeMatch[1],
          code: codeMatch[2].trim(),
        });
      } else {
        // Splitting the text segment by new lines and treating each new line as a separate text segment
        segment.split("\n").forEach((line) => {
          const content: ReactNode[] = [];
          let lastIndex = 0;
          line.replace(boldTextRegex, (match, p1, offset) => {
            if (offset > lastIndex) {
              content.push(line.substring(lastIndex, offset));
            }
            content.push(<Text fontWeight="bold">{p1}</Text>);
            lastIndex = offset + match.length;
            return match; // This return is not used but necessary for replace function
          });
          if (lastIndex < line.length) {
            content.push(line.substring(lastIndex));
          }
          parsedSegments.push({
            type: "text",
            content: content.length === 1 ? content[0] : content,
            isBold: false,
          });
        });
      }
    });
    return parsedSegments;
  }

  const parsedSegments = parseContent(children);

  return (
    <YStack {...props}>
      {parsedSegments.map((segment, index) => {
        if (segment.type === "text") {
          return (
            <XStack key={index}>
              <Paragraph
                overflow="hidden"
                fontSize={props.fontSize}
                color={props.color}
              >
                {segment.content}
              </Paragraph>
            </XStack>
          );
        }
        if (segment.type === "code") {
          return (
            <ScrollView key={index} flexShrink={1} scrollEnabled>
              <CodeBlock>{segment.code}</CodeBlock>
            </ScrollView>
          );
        }
        return null;
      })}
    </YStack>
  );
};
