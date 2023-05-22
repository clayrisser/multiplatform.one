import type { ButtonProps } from 'tamagui';
import type { Dispatch, SetStateAction } from 'react';
import { createContext } from 'react';

export const SelectButtonContext = createContext<SelectButtonContextValue>({ values: {} });

interface SelectButtonContextValue {
  selectedIndex?: number;
  selectedStyle?: ButtonProps;
  setSelectedIndex?: Dispatch<SetStateAction<number | undefined>>;
  setValues?: Dispatch<SetStateAction<Record<string, string>>>;
  values: Record<string, string>;
}
