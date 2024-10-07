import { ChevronRight } from "@tamagui/lucide-icons";
import { Accordion, H5, Text, XStack, YStack } from "tamagui";
import { AccordionItem, SimpleAccordion } from "./index";

export default {
  title: "organize/SimpleAccordion",
  component: SimpleAccordion,
  parameters: {
    status: { type: "beta" },
  },
};

export const main = (args) => {
  return (
    <SimpleAccordion {...args}>
      <AccordionItem trigger={() => <Text>Trigger Apple </Text>} value="apple">
        <YStack padding="$4">
          <Text> Apple Content</Text>
        </YStack>
      </AccordionItem>
      <AccordionItem
        trigger={() => <Text>Trigger Banana </Text>}
        value="banana"
      >
        <YStack padding="$4">
          <Text>Banana Content</Text>
        </YStack>
      </AccordionItem>
      <AccordionItem
        trigger={(open) => (
          <XStack>
            <YStack animation="quick" rotate={open ? "90deg" : "0deg"}>
              <ChevronRight />
            </YStack>
            <H5 color="$color10">Folders</H5>
          </XStack>
        )}
        value="orange"
      >
        <YStack padding="$4">
          <Text>Orange Content</Text>
        </YStack>
      </AccordionItem>
      <Accordion.Item value="pipe">
        <Accordion.Trigger flexDirection="row" justifyContent="space-between">
          {({ open }) => (
            <XStack>
              <YStack animation="quick" rotate={open ? "90deg" : "0deg"}>
                <ChevronRight />
              </YStack>
              <H5 color="$color10">Folders</H5>
            </XStack>
          )}
        </Accordion.Trigger>
        <Accordion.Content>
          <YStack padding="$4">
            <Text>Orange Content</Text>
          </YStack>
        </Accordion.Content>
      </Accordion.Item>
    </SimpleAccordion>
  );
};
