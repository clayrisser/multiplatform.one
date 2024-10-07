/**
 * File: /src/organize/SimpleInput/index.tsx
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

import { Eye, EyeOff } from "@tamagui/lucide-icons";
import { useEffect, useState } from "react";
import type { ButtonProps, InputProps, XStackProps } from "tamagui";
import { Button, Input, XStack } from "tamagui";

export type SimpleInputProps = InputProps & {
  inputType?: "EMAIL" | "TEXT" | "PASSWORD";
  xStackProps?: XStackProps;
  buttonProps?: ButtonProps;
};

export function SimpleInput({
  inputType = "TEXT",
  xStackProps,
  buttonProps,
  ...props
}: SimpleInputProps) {
  const [hideText, setHideText] = useState<boolean>(
    !!(props?.secureTextEntry || inputType === "PASSWORD"),
  );
  const [isValidText, setIsValidText] = useState<boolean>(true);

  useEffect(() => {
    props.secureTextEntry ? setHideText(true) : setHideText(false);
  }, [props.secureTextEntry]);

  const handleInputChange = (text: string) => {
    if (inputType === "EMAIL") {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      // const emailPattern = /^[\w+\.]+@\w+(\.\w+)+$/;
      if (!emailPattern.test(text)) {
        setIsValidText(false);
        return;
      }
      setIsValidText(true);
    } else {
      setIsValidText(true);
    }
  };

  return (
    <XStack theme={isValidText ? "system" : "red"} space="$1" {...xStackProps}>
      <Input
        {...props}
        secureTextEntry={hideText}
        onChangeText={handleInputChange}
      />
      {inputType === "PASSWORD" && (
        <Button onPress={() => setHideText(!hideText)}>
          <Button.Icon>{hideText ? <EyeOff /> : <Eye />}</Button.Icon>
        </Button>
      )}
    </XStack>
  );
}
