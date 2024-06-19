/**
 * File: /src/forms/FormSubmitButton/index.tsx
 * Project: @multiplatform.one/components
 * File Created: 18-06-2024 18:02:12
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

// import React from 'react';
// import type { ButtonProps } from 'tamagui';
// import type { FieldValues, UseFormReturn } from 'react-hook-form';
// import type { GestureResponderEvent } from 'react-native';
// import { Button } from 'tamagui';
// import { useFormContext } from 'react-hook-form';

// export type FormSubmitButtonProps<T extends FieldValues> = ButtonProps & {
//   onSubmit?: (data: T, context: UseFormReturn<T, any>) => void | Promise<void>;
// };

// export function FormSubmitButton<T extends FieldValues = FieldValues>({
//   onSubmit,
//   onPress,
//   ...buttonProps
// }: FormSubmitButtonProps<T>) {
//   const formContext = useFormContext<T>();
//   const { handleSubmit } = formContext;
//   return (
//     <Button
//       onPress={(e: GestureResponderEvent) => {
//         if (onPress) onPress(e);
//         handleSubmit((data) => {
//           if (onSubmit) onSubmit(data, formContext);
//         })(e);
//       }}
//       {...buttonProps}
//     />
//   );
// }

export {};
