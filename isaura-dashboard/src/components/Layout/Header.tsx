import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { setSearchQuery } from "../../store/slices/uiSlice";
import { Search, Bell, Filter, Calendar, MapPin } from "lucide-react";

export default function Header() {
  const { searchQuery, activeView } = useAppSelector((state) => state.ui);
  const { alerts } = useAppSelector((state) => state.alerts);
  const dispatch = useAppDispatch();

  const [showDatePicker, setShowDatePicker] = useState(false);

  const unreadAlerts = alerts.filter(
    (alert) => alert.severity === "critical" || alert.severity === "high"
  ).length;

  const getViewTitle = () => {
    switch (activeView) {
      case "realtime":
        return "Monitoreo en Tiempo Real";
      case "predictive":
        return "Análisis Predictivo";
      case "historical":
        return "Datos Históricos";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>Santo Domingo, RD</span>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por ubicación, tipo de alerta..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Date Range Picker */}
          {activeView === "historical" && (
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Rango de fecha</span>
            </button>
          )}

          {/* Filters */}
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filtros</span>
          </button>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 bg-alert-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadAlerts > 9 ? "9+" : unreadAlerts}
              </span>
            )}
          </button>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">
              Sistema Activo
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
