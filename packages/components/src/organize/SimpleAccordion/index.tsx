/**
 * File: /src/organize/SimpleAccordion/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-10-2023 15:23:17
 * Author: Lalit rajak
 * -----
 * BitSpur (c) Copyright 2021 - 2023
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

import React from 'react';
import type { AccordionContentProps, AccordionItemProps, AccordionTriggerProps } from 'tamagui';
import { Accordion } from 'tamagui';

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
