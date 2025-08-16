import { useState, useEffect, useMemo, useRef } from "react";
import { alertsApi } from "../api/alertsApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Calendar, Download, Play, Pause } from "lucide-react";

interface HistoricalRow {
  date: string;
  flood: number;
  collapse: number;
  incident: number;
  fire: number;
  earthquake: number;
  total: number;
}

export default function HistoricalView() {
  const [historicalData, setHistoricalData] = useState<HistoricalRow[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        const data = await alertsApi.getHistoricalData();
        setHistoricalData(data as HistoricalRow[]);
      } catch (error) {
        console.error("Error loading historical data:", error);
      }
    };

    loadHistoricalData();
  }, []);

  // Helpers to sanitize numeric values
  const toNumber = (v: unknown) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  // Compute sanitized chart data and a safe stacked domain
  const chartData = useMemo(() => historicalData.slice(-30), [historicalData]);
  const sanitizedChartData = useMemo(
    () =>
      chartData.map((d) => ({
        date: d.date,
        flood: toNumber(d.flood),
        collapse: toNumber(d.collapse),
        incident: toNumber(d.incident),
        fire: toNumber(d.fire),
        earthquake: toNumber(d.earthquake),
        total: toNumber(d.total),
      })),
    [chartData]
  );

  const stackedMax = useMemo(
    () =>
      sanitizedChartData.length
        ? Math.max(
            ...sanitizedChartData.flatMap((d) => [
              d.flood,
              d.collapse,
              d.incident,
              d.fire,
              d.earthquake,
            ])
          )
        : 0,
    [sanitizedChartData]
  );

  // Ensure container has non-zero size before rendering chart
  const chartWrapperRef = useRef<HTMLDivElement | null>(null);
  const [containerReady, setContainerReady] = useState(false);
  useEffect(() => {
    const el = chartWrapperRef.current;
    if (!el) return;
    const check = () =>
      setContainerReady(el.clientWidth > 0 && el.clientHeight > 0);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleExportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Fecha,Inundaciones,Colapsos,Incidentes,Incendios,Sismos,Total\n" +
      historicalData
        .map(
          (row) =>
            `${row.date},${row.flood},${row.collapse},${row.incident},${row.fire},${row.earthquake},${row.total}`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "isaura_historical_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Análisis Histórico
            </h2>
            <p className="text-gray-600">
              Revisión de patrones y tendencias en los datos de incidentes del
              último año.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Control de Tiempo
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlayback}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPlaying
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isPlaying ? "Pausar" : "Reproducir"}</span>
            </button>
          </div>
        </div>

        {/* Date Range Slider */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Rango de fechas:</span>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <span className="text-sm text-gray-600">a</span>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Timeline Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max={Math.max(historicalData.length - 1, 0)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Enero 2023</span>
              <span>Diciembre 2023</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Historical Trend Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md xl:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evolución Histórica de Incidentes
          </h3>
          <div ref={chartWrapperRef} className="w-full" style={{ height: 400 }}>
            {containerReady && sanitizedChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sanitizedChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis
                    yAxisId="y"
                    type="number"
                    domain={[
                      0,
                      Number.isFinite(stackedMax) ? stackedMax + 5 : 10,
                    ]}
                    allowDecimals={false}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    yAxisId="y"
                    dataKey="flood"
                    fill="#3b82f6"
                    name="Inundaciones"
                    isAnimationActive={false}
                  />
                  <Bar
                    yAxisId="y"
                    dataKey="collapse"
                    fill="#ef4444"
                    name="Colapsos"
                    isAnimationActive={false}
                  />
                  <Bar
                    yAxisId="y"
                    dataKey="incident"
                    fill="#f59e0b"
                    name="Incidentes"
                    isAnimationActive={false}
                  />
                  <Bar
                    yAxisId="y"
                    dataKey="fire"
                    fill="#f97316"
                    name="Incendios"
                    isAnimationActive={false}
                  />
                  <Bar
                    yAxisId="y"
                    dataKey="earthquake"
                    fill="#8b5cf6"
                    name="Sismos"
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Cargando datos...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen Anual
          </h3>
          <div className="space-y-3">
            {[
              { label: "Total de incidentes", value: "2,847" },
              { label: "Promedio mensual", value: "237" },
              { label: "Mes más activo", value: "Septiembre" },
              { label: "Reducción vs año anterior", value: "-12%" },
            ].map((stat, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600">{stat.label}:</span>
                <span className="font-semibold text-gray-900">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Distritos Afectados
          </h3>
          <div className="space-y-3">
            {[
              { district: "Santo Domingo Norte", incidents: 847 },
              { district: "Santo Domingo Este", incidents: 623 },
              { district: "Distrito Nacional", incidents: 591 },
              { district: "Santo Domingo Oeste", incidents: 432 },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{item.district}</span>
                <span className="font-semibold text-gray-900">
                  {item.incidents}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Patrones Identificados
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="text-sm font-medium text-blue-900">
                Estacional
              </div>
              <div className="text-xs text-blue-700">
                Pico de inundaciones en Sep-Nov
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="text-sm font-medium text-yellow-900">Horario</div>
              <div className="text-xs text-yellow-700">
                Más incidentes entre 7-9 AM
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="text-sm font-medium text-green-900">Mejora</div>
              <div className="text-xs text-green-700">
                Tiempo respuesta -15%
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
