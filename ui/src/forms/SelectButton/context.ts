import { createContext, Dispatch, SetStateAction } from 'react';
import { ButtonProps } from 'tamagui';

export const SelectButtonContext = createContext<SelectButtonContextValue>({ values: {} });

interface SelectButtonContextValue {
  selectedIndex?: number;
  selectedStyle?: ButtonProps;
  setSelectedIndex?: Dispatch<SetStateAction<number | undefined>>;
  setValues?: Dispatch<SetStateAction<Record<string, string>>>;
  values: Record<string, string>;
}
