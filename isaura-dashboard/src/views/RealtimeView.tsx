import React, { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { setAlerts, setLoading } from "../store/slices/alertsSlice";
import { setHeatmapData } from "../store/slices/mapSlice";
import { alertsApi } from "../api/alertsApi";
import GoogleMap from "../components/Map/GoogleMap";
import AlertList from "../components/Alerts/AlertList";
import StatsCards from "../components/Dashboard/StatsCards";

export default function RealtimeView() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.alerts);
  const initialLoaded = useRef(false);

  useEffect(() => {
    const loadData = async (isInitial: boolean) => {
      if (isInitial) dispatch(setLoading(true));
      try {
        const [alerts, heatmapData] = await Promise.all([
          alertsApi.getAlerts(),
          alertsApi.getHeatmapData(),
        ]);
        dispatch(setAlerts(alerts));
        dispatch(setHeatmapData(heatmapData));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        if (isInitial) {
          dispatch(setLoading(false));
          initialLoaded.current = true;
        }
      }
    };

    // Initial load shows the loader once
    loadData(true);

    // Background refresh without toggling the page loader
    const interval = setInterval(() => loadData(false), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  if (loading && !initialLoaded.current) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <div className="text-gray-600">Cargando datos en tiempo real...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 p-6">
      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Map - 2/3 width */}
        <div className="lg:col-span-2 min-h-0">
          <GoogleMap className="h-full min-h-[500px]" />
        </div>

        {/* Alert List - 1/3 width */}
        <div className="lg:col-span-1 min-h-0">
          <AlertList />
        </div>
      </div>
    </div>
  );
}
