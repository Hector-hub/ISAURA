import { useEffect, useRef, useState, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useAppSelector, useAppDispatch } from "../../hooks";
// Removed setCenter/setZoom imports to avoid map recenter from Redux
import { selectAlert } from "../../store/slices/alertsSlice";
import { Alert } from "../../store/slices/alertsSlice";

// Prefer only env var for the API key (no inline fallback)
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID as string | undefined;

// Avoid duplicate console warnings under React StrictMode
let warnedMissingApiKey = false;

interface GoogleMapProps {
  className?: string;
}

export default function GoogleMap({ className = "" }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(
    null
  );
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  // Flag para ignorar eventos disparados programáticamente
  const programmaticChangeRef = useRef(false);

  // Estados para zoom automático cíclico
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  
  // Refs para el ciclo automático
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isZoomedInRef = useRef(false);

  const { center, zoom, heatmapData, showHeatmap } = useAppSelector(
    (state) => state.map
  );
  const { filteredAlerts } = useAppSelector((state) => state.alerts);
  const dispatch = useAppDispatch();

  // Capturar center/zoom iniciales para evitar depender del store luego
  const initialCenterRef = useRef(center);
  const initialZoomRef = useRef(zoom);

  // Initialize Google Maps una única vez
  useEffect(() => {
    if (mapInstanceRef.current) return; // guard against re-initialization
    if (!GOOGLE_MAPS_API_KEY) {
      if (!warnedMissingApiKey) {
        console.warn("VITE_GOOGLE_MAPS_API_KEY is not set");
        warnedMissingApiKey = true;
      }
      setError(
        "Falta la clave de Google Maps. Configure VITE_GOOGLE_MAPS_API_KEY en .env y reinicie el servidor."
      );
      return;
    }

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["marker", "visualization"],
    });

    let cancelled = false;

    loader
      .load()
      .then(() => {
        if (cancelled || !mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: initialCenterRef.current,
          zoom: initialZoomRef.current,
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] },
          ],
          ...(GOOGLE_MAP_ID ? { mapId: GOOGLE_MAP_ID } : {}),
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Agregar listeners para detectar interacción del usuario
        const dragListener = map.addListener("dragstart", () => {
          setIsUserInteracting(true);
          if (userInteractionTimeoutRef.current) {
            clearTimeout(userInteractionTimeoutRef.current);
          }
          userInteractionTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
          }, 5000); // 5 segundos sin interacción
        });

        const zoomListener = map.addListener("zoom_changed", () => {
          setIsUserInteracting(true);
          if (userInteractionTimeoutRef.current) {
            clearTimeout(userInteractionTimeoutRef.current);
          }
          userInteractionTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
          }, 5000);
        });

        const clickListener = map.addListener("click", () => {
          setIsUserInteracting(true);
          if (userInteractionTimeoutRef.current) {
            clearTimeout(userInteractionTimeoutRef.current);
          }
          userInteractionTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
          }, 5000);
        });

        // Agregar a la lista de listeners para cleanup
        listenersRef.current.push(dragListener, zoomListener, clickListener);

        // No sincronizar center/zoom al store para no interferir con el usuario
        listenersRef.current = [...listenersRef.current];

        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Error loading Google Maps:", err);
        setError("Error al cargar Google Maps");
      });

    return () => {
      cancelled = true;
      listenersRef.current.forEach((l) => l.remove());
      listenersRef.current = [];
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
      mapInstanceRef.current = null;
    };
  }, []);

  // Helpers
  const createInfoWindowContent = useCallback((alert: Alert) => {
    const timeAgo = getTimeAgo(new Date(alert.timestamp));
    const severityColor = {
      critical: "text-red-600",
      high: "text-orange-600",
      medium: "text-yellow-600",
      low: "text-green-600",
    }[alert.severity];

    return `
      <div class="p-3 max-w-xs">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-gray-900">${alert.title}</h3>
          <span class="px-2 py-1 text-xs font-medium ${severityColor} bg-opacity-10 rounded-full">
            ${alert.severity.toUpperCase()}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-2">${alert.description}</p>
        <div class="space-y-1 text-xs text-gray-500">
          <div>📍 ${alert.location.address}</div>
          <div>🏘️ ${alert.location.district}</div>
          <div>⏰ ${timeAgo}</div>
          ${
            alert.affectedPopulation
              ? `<div>👥 ${alert.affectedPopulation.toLocaleString()} afectados</div>`
              : ""
          }
        </div>
      </div>
    `;
  }, []);

  // Memoizar factory de marcadores para no recrearla innecesariamente
  const createMarker = useCallback(
    (alert: Alert, map: google.maps.Map) => {
      // Use AdvancedMarkerElement only when a valid Map ID is present
      if (GOOGLE_MAP_ID && google.maps.marker?.AdvancedMarkerElement) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: alert.location.lat, lng: alert.location.lng },
          map,
          content: getMarkerContent(alert.type, alert.severity),
          title: alert.title,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: createInfoWindowContent(alert),
        });

        marker.addListener("click", () => {
          dispatch(selectAlert(alert));
        });
        marker.addListener("mouseover", () => {
          infoWindow.open({ map, anchor: marker });
        });
        marker.addListener("mouseout", () => {
          infoWindow.close();
        });
        return marker;
      }

      // Fallback to classic Marker when mapId is not configured
      const icon = getMarkerIcon(alert.type, alert.severity);
      const legacy = new google.maps.Marker({
        position: { lat: alert.location.lat, lng: alert.location.lng },
        map,
        icon,
        title: alert.title,
      });
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(alert),
      });
      legacy.addListener("click", () => dispatch(selectAlert(alert)));
      legacy.addListener("mouseover", () => infoWindow.open(map, legacy));
      legacy.addListener("mouseout", () => infoWindow.close());
      return legacy as unknown as google.maps.marker.AdvancedMarkerElement;
    },
    [dispatch, createInfoWindowContent]
  );

  // Actualizar marcadores cuando cambian las alertas
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => (marker.map = null));
    markersRef.current = [];

    // Add new markers
    filteredAlerts.forEach((alert) => {
      const marker = createMarker(alert, mapInstanceRef.current!);
      markersRef.current.push(marker);
    });
  }, [filteredAlerts, isLoaded, createMarker]);

  // Update heatmap (load visualization from script libraries)
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Remove existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }

    if (showHeatmap && heatmapData.length > 0) {
      if (
        !google.maps.visualization ||
        !google.maps.visualization.HeatmapLayer
      ) {
        console.warn("Google Maps visualization library not available.");
        return;
      }

      const heatmapData_formatted: google.maps.visualization.WeightedLocation[] =
        heatmapData.map((point) => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          weight: point.intensity,
        }));

      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        data: heatmapData_formatted,
        map: mapInstanceRef.current!,
        radius: 50,
        opacity: 0.6,
      });
    }
  }, [heatmapData, showHeatmap, isLoaded]);

  // Ciclo automático de alertas
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || filteredAlerts.length === 0) {
      return;
    }

    const startAutoCycle = () => {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
      }

      cycleIntervalRef.current = setInterval(() => {
        if (!isUserInteracting && mapInstanceRef.current) {
          const alert = filteredAlerts[currentAlertIndex];
          if (alert) {
            const map = mapInstanceRef.current;
            
            if (!isZoomedInRef.current) {
              // Zoom in a la alerta
              map.panTo({ lat: alert.location.lat, lng: alert.location.lng });
              setTimeout(() => {
                map.setZoom(16);
                isZoomedInRef.current = true;
              }, 1000);
            } else {
              // Zoom out y pasar a la siguiente alerta
              map.setZoom(11);
              setTimeout(() => {
                setCurrentAlertIndex((prevIndex) => 
                  (prevIndex + 1) % filteredAlerts.length
                );
                isZoomedInRef.current = false;
              }, 1000);
            }
          }
        }
      }, 3000); // Cambio cada 3 segundos
    };

    if (!isUserInteracting) {
      startAutoCycle();
    } else {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
      }
    }

    return () => {
      if (cycleIntervalRef.current) {
        clearInterval(cycleIntervalRef.current);
      }
      if (userInteractionTimeoutRef.current) {
        clearTimeout(userInteractionTimeoutRef.current);
      }
    };
  }, [isLoaded, filteredAlerts, currentAlertIndex, isUserInteracting]);

  // Helpers
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Ahora mismo";
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440)
      return `Hace ${Math.floor(diffInMinutes / 60)} horas`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  // Advanced marker SVG content
  const getMarkerContent = (
    type: Alert["type"],
    severity: Alert["severity"]
  ) => {
    const colors = {
      critical: "#DC2626",
      high: "#EA580C",
      medium: "#D97706",
      low: "#16A34A",
    } as const;

    const symbols = {
      flood: "💧",
      collapse: "🏢",
      incident: "⚠️",
      fire: "🔥",
      earthquake: "🌍",
    } as const;

    const container = document.createElement("div");
    container.style.width = "32px";
    container.style.height = "32px";
    container.style.transform = "translate(-16px, -16px)";
    container.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="${colors[severity]}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${symbols[type]}</text>
      </svg>
    `;
    return container;
  };

  // Fallback icon builder for legacy google.maps.Marker
  const getMarkerIcon = (type: Alert["type"], severity: Alert["severity"]) => {
    const colors = {
      critical: "#DC2626",
      high: "#EA580C",
      medium: "#D97706",
      low: "#16A34A",
    } as const;

    const symbols = {
      flood: "💧",
      collapse: "🏢",
      incident: "⚠️",
      fire: "🔥",
      earthquake: "🌍",
    } as const;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="${colors[severity]}" stroke="white" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" font-size="12" fill="white">${symbols[type]}</text>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(32, 32),
      anchor: new google.maps.Point(16, 16),
    } as google.maps.Icon;
  };

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-8 text-center ${className}`}
      >
        <div className="text-red-600 text-lg font-semibold mb-2">
          Error al cargar el mapa
        </div>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
            <div className="text-gray-600">Cargando mapa...</div>
          </div>
        </div>
      )}

      {/* Map Controls */}
      {isLoaded && (
        <div className="absolute top-4 right-4 space-y-2">
          <button
            onClick={() => {
              if (navigator.geolocation && mapInstanceRef.current) {
                navigator.geolocation.getCurrentPosition((position) => {
                  programmaticChangeRef.current = true;
                  mapInstanceRef.current!.setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  });
                  mapInstanceRef.current!.setZoom(15);
                  setTimeout(() => {
                    programmaticChangeRef.current = false;
                  }, 0);
                });
              }
            }}
            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            title="Mi ubicación"
          >
            🎯
          </button>
        </div>
      )}
    </div>
  );
}
