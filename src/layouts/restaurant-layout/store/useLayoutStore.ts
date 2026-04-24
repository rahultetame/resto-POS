import { create } from 'zustand';

export type Area = {
  type: string;
  length: number;
  width: number;
};

export type TableItem = {
  id: string;
  x: number;
  y: number;
  seats: number;
  status: string;
  area: string;
};

type LayoutState = {
  step: number;
  areas: Area[];
  seatingConfig: any;
  layout: Record<string, TableItem[]>;

  setStep: (step: number) => void;
  setAreas: (areas: Area[]) => void;
  setSeating: (data: any) => void;
  addTable: (area: string, table: TableItem) => void;
  updateTable: (area: string, table: TableItem) => void;
};

export const useLayoutStore = create<LayoutState>((set: any) => ({
  step: 0,
  areas: [],
  seatingConfig: {},
  layout: {},

  isLayoutValid: () => {
    // Assuming you have a tables array in your state
    const tables = get().layout || {};
    return Object.values(tables).some((arr: any) => arr.length > 0);
  },

  setStep: (step: number) => set({ step }),
  setAreas: (areas: Area[]) => set({ areas }),
  setSeating: (data: any) => set({ seatingConfig: data }),

  addTable: (area: string, table: TableItem) =>
    set((state: LayoutState) => ({
      layout: {
        ...state.layout,
        [area]: [...(state.layout[area] || []), table],
      },
    })),

  updateTable: (area: string, updated: TableItem) =>
    set((state: LayoutState) => ({
      layout: {
        ...state.layout,
        [area]: state.layout[area].map((t) =>
          t.id === updated.id ? updated : t,
        ),
      },
    })),
}));
function get() {
  // Access the current state from the zustand store
  return useLayoutStore.getState();
}
