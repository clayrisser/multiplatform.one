import { create } from 'zustand';

export const useTableStore = create((set) => ({
  columnsLength: 0,
  setColumnsLength: (value) => set({ columnsLength: value }),
}));
