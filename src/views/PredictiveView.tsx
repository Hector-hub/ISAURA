import { useEffect } from "react";
import { useAppDispatch } from "../hooks";
import { setHeatmapData } from "../store/slices/mapSlice";
import { alertsApi } from "../api/alertsApi";
import TrendChart from "../components/Charts/TrendChart";
import RiskDistribution from "../components/Charts/RiskDistribution";
import { Brain, TrendingUp, AlertTriangle, MapPin, Clock, BarChart3 } from "lucide-react";

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
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Análisis Predictivo de IA
            </h2>
          </div>
          <p className="text-gray-600">
            Resumen inteligente de riesgos urbanos y acontecimientos importantes basado en análisis de datos históricos y factores de riesgo en tiempo real.
          </p>
        </div>

        {/* IA Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main IA Analysis */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Resumen de Inteligencia Artificial</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-2">🎯 Análisis Prioritario</h4>
                <p className="text-sm">
                  Basado en los datos analizados, se identifica un <strong>riesgo crítico del 85%</strong> de colapso estructural 
                  en el Puente Francisco del Rosario Sánchez (Puente de la 17). El deterioro visible reportado por 
                  @HazimNoelia coincide con patrones históricos de fallas de infraestructura en la región.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Patrones Detectados</h4>
                <p className="text-sm">
                  Los eventos de inundación de noviembre 2023 muestran un patrón recurrente en zonas específicas: 
                  <strong> Avenida Monumental</strong> y <strong>Los Girasoles</strong> presentan vulnerabilidad alta 
                  durante precipitaciones intensas (&gt;50mm/h).
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-800 mb-2">🚧 Infraestructura Crítica</h4>
                <p className="text-sm">
                  El paso elevado Winston Churchill - JFK presenta grietas severas que requieren 
                  <strong> atención inmediata</strong>. El análisis correlaciona este deterioro con la edad 
                  de la infraestructura (&gt;40 años) y exposición a factores climáticos.
                </p>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Insights Clave</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Zonas de Alto Riesgo</h4>
                  <p className="text-sm text-gray-600">
                    Distrito Nacional: 3 puntos críticos identificados
                  </p>
                  <p className="text-sm text-gray-600">
                    Santo Domingo Norte: 2 áreas de inundación recurrente
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Temporalidad</h4>
                  <p className="text-sm text-gray-600">
                    Época lluviosa (mayo-noviembre): +340% incidentes
                  </p>
                  <p className="text-sm text-gray-600">
                    Horario pico (7-9am, 5-7pm): +120% eventos viales
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BarChart3 className="w-5 h-5 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">Correlaciones</h4>
                  <p className="text-sm text-gray-600">
                    Precipitación &gt; 30mm = 75% prob. inundaciones
                  </p>
                  <p className="text-sm text-gray-600">
                    Infraestructura &gt; 30 años = 65% riesgo estructural
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline of Important Events */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900">Acontecimientos Importantes</h3>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-red-800">Riesgo Crítico Identificado</h4>
                <span className="text-sm text-gray-500">Abril 2024</span>
              </div>
              <p className="text-gray-700 text-sm">
                Detección de deterioro crítico en Puente de la 17. Análisis de IA indica probabilidad de colapso del 85% 
                basado en reportes ciudadanos y datos históricos de fallas estructurales en la región.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-blue-800">Patrón de Inundaciones Identificado</h4>
                <span className="text-sm text-gray-500">Noviembre 2023</span>
              </div>
              <p className="text-gray-700 text-sm">
                Múltiples eventos de inundación documentados en redes sociales confirman vulnerabilidad recurrente 
                en Avenida Monumental y zonas aledañas durante precipitaciones intensas.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-orange-800">Nueva Alerta Estructural</h4>
                <span className="text-sm text-gray-500">Febrero 2025</span>
              </div>
              <p className="text-gray-700 text-sm">
                Identificación de grietas severas en paso elevado Winston Churchill - JFK. 
                Correlación con patrones de deterioro y necesidad de intervención urgente.
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Risk Factors */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Factores de Riesgo IA
            </h3>
            <div className="space-y-4">
              {[
                { factor: "Precipitaciones", risk: 85, color: "bg-blue-500", trend: "↗️" },
                { factor: "Infraestructura", risk: 78, color: "bg-red-500", trend: "⚠️" },
                { factor: "Densidad poblacional", risk: 65, color: "bg-yellow-500", trend: "📈" },
                { factor: "Actividad sísmica", risk: 25, color: "bg-purple-500", trend: "📊" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 flex items-center space-x-2">
                      <span>{item.trend}</span>
                      <span>{item.factor}</span>
                    </span>
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

          <RiskDistribution />

          {/* AI Predictions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Predicciones IA - Próximas 48h
            </h3>
            <div className="space-y-3">
              {[
                {
                  time: "Hoy 18:00",
                  event: "Riesgo de inundación en Zona Colonial",
                  probability: 75,
                  severity: "Alta",
                  icon: "🌊"
                },
                {
                  time: "Mañana 14:00",
                  event: "Monitoreo puente crítico",
                  probability: 90,
                  severity: "Crítica",
                  icon: "🏗️"
                },
                {
                  time: "Mañana 20:00",
                  event: "Congestión vial severa",
                  probability: 85,
                  severity: "Media",
                  icon: "🚗"
                },
              ].map((pred, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{pred.icon}</span>
                      <div>
                        <div className="text-xs text-gray-500">{pred.time}</div>
                        <div className="font-medium text-gray-900 text-sm">
                          {pred.event}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {pred.probability}%
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          pred.severity === "Crítica"
                            ? "bg-red-100 text-red-800"
                            : pred.severity === "Alta"
                            ? "bg-orange-100 text-orange-800"
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

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
          <TrendChart />
        </div>
      </div>
    </div>
  );
}
