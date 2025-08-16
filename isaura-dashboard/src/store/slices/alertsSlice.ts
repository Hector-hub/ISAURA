import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Alert {
  id: string; // será el post_id
  type: "flood" | "collapse" | "incident" | "fire" | "earthquake";
  severity: "critical" | "high" | "medium" | "low";
  title: string; // será el content resumido
  description: string; // será el description completo
  location: {
    lat: number;
    lng: number;
    address?: string; // opcional para datos de redes sociales
    district?: string; // opcional para datos de redes sociales
  };
  timestamp: string; // será date convertido a ISO
  status: "active" | "resolved" | "investigating";
  // Campos adicionales de redes sociales
  author?: string;
  link?: string;
  tag?: string; // "[suceso actual]" o "[alerta predictiva]"
  content?: string; // contenido original del post
  // Campos opcionales originales
  affectedPopulation?: number;
  estimatedDamage?: string;
}

interface AlertsState {
  alerts: Alert[];
  filteredAlerts: Alert[];
  selectedAlert: Alert | null;
  filters: {
    type: string[];
    severity: string[];
    status: string[];
  };
  loading: boolean;
}

const initialState: AlertsState = {
  alerts: [],
  filteredAlerts: [],
  selectedAlert: null,
  filters: {
    type: [],
    severity: [],
    status: [],
  },
  loading: false,
};

const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
      state.filteredAlerts = action.payload;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
      applyFilters(state);
    },
    selectAlert: (state, action: PayloadAction<Alert | null>) => {
      state.selectedAlert = action.payload;
    },
    updateFilters: (
      state,
      action: PayloadAction<Partial<AlertsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredAlerts = state.alerts;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

function applyFilters(state: AlertsState) {
  let filtered = state.alerts;

  if (state.filters.type.length > 0) {
    filtered = filtered.filter((alert) =>
      state.filters.type.includes(alert.type)
    );
  }

  if (state.filters.severity.length > 0) {
    filtered = filtered.filter((alert) =>
      state.filters.severity.includes(alert.severity)
    );
  }

  if (state.filters.status.length > 0) {
    filtered = filtered.filter((alert) =>
      state.filters.status.includes(alert.status)
    );
  }

  state.filteredAlerts = filtered;
}

export const {
  setAlerts,
  addAlert,
  selectAlert,
  updateFilters,
  clearFilters,
  setLoading,
} = alertsSlice.actions;

export default alertsSlice.reducer;
