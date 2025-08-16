import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { selectAlert, type Alert } from "../../store/slices/alertsSlice";
import { focusOnLocation } from "../../store/slices/mapSlice";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  Flame,
  Waves,
  Building2,
  MapPin,
  Clock,
  Users,
  Share2,
} from "lucide-react";

export default function AlertList() {
  const { filteredAlerts, selectedAlert } = useAppSelector(
    (state) => state.alerts
  );
  const dispatch = useAppDispatch();

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "flood":
        return Waves;
      case "fire":
        return Flame;
      case "collapse":
        return Building2;
      case "earthquake":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800";
      case "high":
        return "bg-orange-50 border-orange-200 text-orange-800";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "low":
        return "bg-green-50 border-green-200 text-green-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getSeverityDot = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAlertClick = (alert: Alert) => {
    dispatch(selectAlert(alert));
    dispatch(
      focusOnLocation({
        lat: alert.location.lat,
        lng: alert.location.lng,
        zoom: 15,
      })
    );
  };

  const handleShare = (alert: Alert, e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `🚨 ALERTA ISAURA: ${alert.title}\n📍 ${
      alert.location.address
    }\n⚠️ Severidad: ${alert.severity.toUpperCase()}\n⏰ ${formatDistanceToNow(
      new Date(alert.timestamp),
      {
        addSuffix: true,
        locale: es,
      }
    )}`;

    if (navigator.share) {
      navigator.share({
        title: "Alerta ISAURA",
        text: message,
      });
    } else {
      navigator.clipboard.writeText(message);
      // You could add a toast notification here
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Alertas Activas ({filteredAlerts.length})
          </h2>
          <div className="flex space-x-1">
            {["critical", "high", "medium", "low"].map((severity) => {
              const count = filteredAlerts.filter(
                (a) => a.severity === severity
              ).length;
              return count > 0 ? (
                <span
                  key={severity}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                    severity
                  )}`}
                >
                  {count}
                </span>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-260px)] lg:max-h-none">
        {filteredAlerts.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay alertas activas</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              const isSelected = selectedAlert?.id === alert.id;
              const timeAgo = formatDistanceToNow(new Date(alert.timestamp), {
                addSuffix: true,
                locale: es,
              });

              return (
                <div
                  key={alert.id}
                  onClick={() => handleAlertClick(alert)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? "border-sky-500 bg-sky-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  } ${
                    alert.severity === "critical" ? "animate-pulse-red" : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-lg ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {alert.title}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center space-x-1">
                            <div
                              className={`w-2 h-2 rounded-full ${getSeverityDot(
                                alert.severity
                              )}`}
                            />
                            <span className="text-xs text-gray-500 capitalize">
                              {alert.severity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleShare(alert, e)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Compartir alerta"
                    >
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-1 text-xs text-gray-600 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{alert.location.address}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {alert.description}
                  </p>

                  {/* Additional Info */}
                  {alert.author && (
                    <div className="flex items-center space-x-1 text-xs text-blue-600 mb-1">
                      <span>👤 {alert.author}</span>
                      {alert.tag && (
                        <span
                          className={`px-1 py-0.5 rounded text-xs font-medium ${
                            alert.tag === "[alerta predictiva]"
                              ? "bg-yellow-100 text-yellow-800"
                              : alert.tag === "[evento histórico]"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {alert.tag}
                        </span>
                      )}
                    </div>
                  )}

                  {alert.affectedPopulation && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                      <Users className="w-3 h-3" />
                      <span>
                        {alert.affectedPopulation.toLocaleString()} personas
                        afectadas
                      </span>
                    </div>
                  )}

                  {alert.link && (
                    <div className="mb-2">
                      <a
                        href={alert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗 Ver publicación original
                      </a>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === "active"
                          ? "bg-red-100 text-red-800"
                          : alert.status === "investigating"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {alert.status === "active"
                        ? "Activo"
                        : alert.status === "investigating"
                        ? "Investigando"
                        : "Resuelto"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {alert.location.district}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
