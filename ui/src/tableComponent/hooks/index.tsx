import { create } from 'zustand';

export const useTableStore = create((set) => ({
  columnsLength: 0,
  cellHeight: null,

  setCellHeight: (value) => set({ cellHeight: value }),
  setColumnsLength: (value) => set({ columnsLength: value }),
}));
