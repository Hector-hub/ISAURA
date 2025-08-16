import { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { setHeatmapData } from "../store/slices/mapSlice";
import { alertsApi } from "../api/alertsApi";
import GoogleMap from "../components/Map/GoogleMap";
import TrendChart from "../components/Charts/TrendChart";
import RiskDistribution from "../components/Charts/RiskDistribution";

export default function PredictiveView() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadPredictiveData = async () => {
      try {
        const heatmapData = await alertsApi.getHeatmapData();
        dispatch(setHeatmapData(heatmapData));
      } catch (error) {
        console.error("Error loading predictive data:", error);
      }
    };

    loadPredictiveData();
  }, [dispatch]);

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Análisis Predictivo de Riesgos
        </h2>
        <p className="text-gray-600">
          Visualización de zonas con mayor probabilidad de incidentes basada en
          datos históricos y factores de riesgo.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Mapa de Calor Predictivo
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-red-600 rounded"></div>
                  <span className="text-gray-600">Riesgo: Bajo → Alto</span>
                </div>
              </div>
            </div>
            <GoogleMap className="h-96" />
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-1 space-y-6">
          <RiskDistribution />

          {/* Risk Factors */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Factores de Riesgo
            </h3>
            <div className="space-y-4">
              {[
                { factor: "Precipitaciones", risk: 85, color: "bg-blue-500" },
                { factor: "Infraestructura", risk: 65, color: "bg-orange-500" },
                {
                  factor: "Densidad poblacional",
                  risk: 75,
                  color: "bg-yellow-500",
                },
                {
                  factor: "Actividad sísmica",
                  risk: 25,
                  color: "bg-purple-500",
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.factor}</span>
                    <span className="text-gray-900 font-medium">
                      {item.risk}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.risk}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TrendChart />

        {/* Predictions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Predicciones Próximas 48h
          </h3>
          <div className="space-y-3">
            {[
              {
                time: "Hoy 18:00",
                event: "Posible inundación en Zona Colonial",
                probability: 75,
                severity: "Alta",
              },
              {
                time: "Mañana 14:00",
                event: "Riesgo de colapso en Los Mina",
                probability: 45,
                severity: "Media",
              },
              {
                time: "Mañana 20:00",
                event: "Incidentes viales en autopistas",
                probability: 85,
                severity: "Media",
              },
            ].map((pred, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm text-gray-500">{pred.time}</div>
                    <div className="font-medium text-gray-900">
                      {pred.event}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {pred.probability}%
                    </div>
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        pred.severity === "Alta"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {pred.severity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
