import type { AccordionContentProps, AccordionItemProps, AccordionTriggerProps } from 'ui';
import { Accordion } from 'ui';
import React from 'react';

interface SimpleAccordionProps {
  children: React.ReactNode;
  overflow?: 'visible' | 'hidden' | 'scroll';
  type?: 'single' | 'multiple';
}

type SimpleAccordionItemProps = AccordionItemProps & {
  trigger: React.ReactNode;
  triggerStyle?: AccordionTriggerProps;
  contentStyle?: AccordionContentProps;
  children: React.ReactNode;
};

export function SimpleAccordion({ children, ...props }: SimpleAccordionProps) {
  return (
    <Accordion overflow="hidden" type="single" {...props}>
      {children}
    </Accordion>
  );
}

export function AccordionItem({ trigger, triggerStyle, children, contentStyle, ...props }: SimpleAccordionItemProps) {
  return (
    <Accordion.Item {...props}>
      <Accordion.Trigger flexDirection="row" justifyContent="space-between" {...triggerStyle}>
        {trigger}
      </Accordion.Trigger>
      <Accordion.Content {...contentStyle}>{children}</Accordion.Content>
    </Accordion.Item>
  );
}
