import { create } from 'zustand';

export const useTableStore = create((set) => ({
  columnsLength: 0,
  setColumnsLength: (value) => set({ columnsLength: value }),
  headerColumnsWidth: null,
  setHeaderColumnsWidth: (value) => set({ headerColumnsWidth: value }),
  rowsWidths: null,
  setRowsWidths: (value) => set({ rowsWidths: value }),
}));
