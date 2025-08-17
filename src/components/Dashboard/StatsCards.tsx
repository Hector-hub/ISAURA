import { useAppSelector } from "../../hooks";
import { AlertTriangle, Clock, MapPin } from "lucide-react";

export default function StatsCards() {
  const { alerts } = useAppSelector((state) => state.alerts);

  const activeAlerts = alerts.filter((a) => a.status === "active").length;
  const criticalAlerts = 7; // Fijo en 7 como solicitado
  const avgResponseTime = "8.5"; // Mock data
  const riskZones = "12"; // Mock data

  const stats = [
    {
      title: "Alertas Activas",
      value: activeAlerts,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "+12%",
      changeType: "increase" as const,
    },
    {
      title: "Alertas Críticas",
      value: criticalAlerts,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5%",
      changeType: "increase" as const,
    },
    {
      title: "Tiempo de Respuesta",
      value: `${avgResponseTime} min`,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "-2%",
      changeType: "decrease" as const,
    },
    {
      title: "Zonas en Riesgo",
      value: riskZones,
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "0%",
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === "increase"
                    ? "text-red-600"
                    : stat.changeType === "decrease"
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                vs. semana anterior
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
