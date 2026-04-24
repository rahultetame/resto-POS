// ─── Area Types ──────────────────────────────────────────────────────────────
export type AreaType =
  | 'Indoor'
  | 'Outdoor'
  | 'Bar'
  | 'Private Dining'
  | 'Terrace'
  | 'Lounge';

export interface Area {
  type: AreaType;
  length: number;
  width: number;
}

// ─── Seating Config ──────────────────────────────────────────────────────────
export type TableShape = 'Round' | 'Square' | 'Rectangle';
export type SpacingPreference = 'Compact' | 'Standard' | 'Spacious';

export interface SeatDistribution {
  twoSeater: number;
  fourSeater: number;
  sixSeater: number;
  eightSeater: number;
  bar: number;
}

export interface StatusColorMap {
  available: string;
  occupied: string;
  reserved: string;
  cleaning: string;
}

export interface SeatingConfig {
  totalTables: number;
  distribution: SeatDistribution;
  tableShape: TableShape;
  spacingPreference: SpacingPreference;
  labelPrefix: string;
  allowReservations: boolean;
  smokingAllowed: boolean;
  statusColors: StatusColorMap;
}

// ─── Layout Table ─────────────────────────────────────────────────────────────
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface LayoutTable {
  id: string;
  label: string;
  x: number;
  y: number;
  seats: number;
  status: TableStatus;
  area: AreaType;
  shape: TableShape;
  duration?: number; // minutes occupied
}

// ─── Full Layout State ────────────────────────────────────────────────────────
export interface RestaurantLayoutState {
  areas: Area[];
  seatingConfig: SeatingConfig | null;
  layout: LayoutTable[];
  setAreas: (areas: Area[]) => void;
  setSeatingConfig: (config: SeatingConfig) => void;
  setLayout: (tables: LayoutTable[]) => void;
  addTable: (table: LayoutTable) => void;
  updateTable: (id: string, updates: Partial<LayoutTable>) => void;
  removeTable: (id: string) => void;
  resetStore: () => void;
}

// ─── localStorage Saved Shape ─────────────────────────────────────────────────
export interface SavedRestaurantLayout {
  areas: Area[];
  seatingConfig: SeatingConfig;
  layout: LayoutTable[];
  savedAt: string;
}
