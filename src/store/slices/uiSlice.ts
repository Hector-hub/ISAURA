import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  sidebarCollapsed: boolean;
  activeView: "realtime" | "predictive" | "historical";
  isMobile: boolean;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    timestamp: string;
  }>;
  searchQuery: string;
  dateRange: {
    from: string | null;
    to: string | null;
  };
}

const initialState: UIState = {
  sidebarCollapsed: false,
  activeView: "realtime",
  isMobile: false,
  notifications: [],
  searchQuery: "",
  dateRange: {
    from: null,
    to: null,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setActiveView: (state, action: PayloadAction<UIState["activeView"]>) => {
      state.activeView = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<
        Omit<UIState["notifications"][0], "id" | "timestamp">
      >
    ) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setDateRange: (state, action: PayloadAction<UIState["dateRange"]>) => {
      state.dateRange = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setActiveView,
  setIsMobile,
  addNotification,
  removeNotification,
  setSearchQuery,
  setDateRange,
} = uiSlice.actions;

export default uiSlice.reducer;
