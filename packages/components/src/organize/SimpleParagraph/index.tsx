import type React from "react";
import { Paragraph, ScrollView, Text, XStack, YStack } from "tamagui";
import type { ParagraphProps, YStackProps } from "tamagui";
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
      content?: React.ReactNode;
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
          const content: React.ReactNode[] = [];
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
