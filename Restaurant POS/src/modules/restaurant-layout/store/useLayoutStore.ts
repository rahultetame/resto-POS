import { create } from 'zustand';
import type {
  RestaurantLayoutState,
  Area,
  SeatingConfig,
  LayoutTable,
} from './types';

const defaultSeatingConfig: SeatingConfig = {
  totalTables: 10,
  distribution: {
    twoSeater: 2,
    fourSeater: 4,
    sixSeater: 2,
    eightSeater: 1,
    bar: 1,
  },
  tableShape: 'Round',
  spacingPreference: 'Standard',
  labelPrefix: 'T',
  allowReservations: true,
  smokingAllowed: false,
  statusColors: {
    available: '#4caf50',
    occupied: '#f44336',
    reserved: '#ff9800',
    cleaning: '#9c27b0',
  },
};

const initialState = {
  areas: [] as Area[],
  seatingConfig: null as SeatingConfig | null,
  layout: [] as LayoutTable[],
};

export const useLayoutStore = create<RestaurantLayoutState>((set) => ({
  ...initialState,

  setAreas: (areas) => set({ areas }),

  setSeatingConfig: (config) => set({ seatingConfig: config }),

  setLayout: (tables) => set({ layout: tables }),

  addTable: (table) =>
    set((state) => ({ layout: [...state.layout, table] })),

  updateTable: (id, updates) =>
    set((state) => ({
      layout: state.layout.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  removeTable: (id) =>
    set((state) => ({ layout: state.layout.filter((t) => t.id !== id) })),

  resetStore: () => set(initialState),
}));

export { defaultSeatingConfig };
