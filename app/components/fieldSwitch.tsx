/**
 * File: /components/fieldSwitch.tsx
 * Project: app
 * File Created: 27-08-2024 18:00:17
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

import React, { useState } from 'react';
import { Text, YStack, FieldSwitch } from 'ui';

export interface Switch {
  currentlyWorking: boolean;
}
export const FieldSwitchs = () => {
  const [isWorking, setIsWorking] = useState<boolean>(false);

  const handleSwitchChange = (checked: boolean) => {
    setIsWorking(checked);
  };
  return (
    <YStack>
      <FieldSwitch
        name="currentlyWorking"
        label="Currently Working"
        onCheckedChange={handleSwitchChange}
        checked={isWorking}
      />
      {isWorking ? <Text>Working</Text> : <Text>Not Working</Text>}
    </YStack>
  );
};
