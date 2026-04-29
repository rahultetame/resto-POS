import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────
export type AreaType = 'Indoor' | 'Outdoor' | 'Bar';

export type TableShape = 'Rectangle' | 'Round' | 'Curved' | 'Label';

export type Area = {
  type: AreaType;
  length: number;
  width: number;
};

export type TableItem = {
  id: string;
  label: string;
  x: number;
  y: number;
  seats: number;
  shape: TableShape;
  status: string;
  area: AreaType;
  /** Rotation in degrees: 0 | 90 | 180 | 270 */
  rotation: number;
  /** Display scale: 0.5 – 2.0, step 0.25 */
  scale: number;
};

// ─── Store shape ──────────────────────────────────────────────────────────────
type LayoutState = {
  step: number;
  areas: Area[];
  seatingConfig: any;
  layout: Record<string, TableItem[]>;
  /** true once the user clicks "Complete Setup" */
  isSetupComplete: boolean;

  setStep:       (step: number) => void;
  setAreas:      (areas: Area[]) => void;
  setSeating:    (data: any) => void;
  setLayout:     (layout: Record<string, TableItem[]>) => void;
  markComplete:  () => void;
  resetSetup:    () => void;
  addTable:      (area: string, table: TableItem) => void;
  updateTable:   (area: string, table: TableItem) => void;
  removeTable:   (area: string, id: string) => void;
  /** Update just the status of one table (used from Dashboard) */
  setTableStatus:(area: string, id: string, status: string) => void;
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      step:            0,
      areas:           [],
      seatingConfig:   {},
      layout:          {},
      isSetupComplete: false,

      setStep:    (step)   => set({ step }),
      setAreas:   (areas)  => set({ areas }),
      setSeating: (data)   => set({ seatingConfig: data }),
      setLayout:  (layout) => set({ layout }),

      markComplete: () => set({ isSetupComplete: true }),

      resetSetup: () =>
        set({ step: 0, areas: [], seatingConfig: {}, layout: {}, isSetupComplete: false }),

      addTable: (area, table) =>
        set((state) => ({
          layout: {
            ...state.layout,
            [area]: [...(state.layout[area] || []), table],
          },
        })),

      updateTable: (area, updated) =>
        set((state) => ({
          layout: {
            ...state.layout,
            [area]: (state.layout[area] || []).map((t) =>
              t.id === updated.id ? updated : t,
            ),
          },
        })),

      removeTable: (area, id) =>
        set((state) => ({
          layout: {
            ...state.layout,
            [area]: (state.layout[area] || []).filter((t) => t.id !== id),
          },
        })),

      setTableStatus: (area, id, status) =>
        set((state) => ({
          layout: {
            ...state.layout,
            [area]: (state.layout[area] || []).map((t) =>
              t.id === id ? { ...t, status } : t,
            ),
          },
        })),
    }),
    { name: 'restaurant-layout-v1' },
  ),
);
