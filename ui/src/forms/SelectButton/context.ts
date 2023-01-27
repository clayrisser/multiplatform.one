import { createContext, Dispatch, SetStateAction } from 'react';
import { ButtonProps } from 'tamagui';

export const SelectButtonContext = createContext<SelectButtonContextValue>({ values: {} });

interface SelectButtonContextValue {
  selectedKey?: string;
  selectedStyle?: ButtonProps;
  setSelectedKey?: Dispatch<SetStateAction<string | undefined>>;
  setValues?: Dispatch<SetStateAction<Record<string, string | number>>>;
  values: Record<string, string | number>;
}
