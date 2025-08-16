import { useAppSelector, useAppDispatch } from "../../hooks";
import { setActiveView, toggleSidebar } from "../../store/slices/uiSlice";
import {
  AlertTriangle,
  Settings,
  Menu,
  X,
  Activity,
  BarChart3,
  Calendar,
} from "lucide-react";

const menuItems = [
  {
    id: "realtime",
    icon: Activity,
    label: "Tiempo Real",
    view: "realtime" as const,
  },
  {
    id: "predictive",
    icon: BarChart3,
    label: "Predictivo",
    view: "predictive" as const,
  },
  {
    id: "historical",
    icon: Calendar,
    label: "Histórico",
    view: "historical" as const,
  },
];

export default function Sidebar() {
  const { sidebarCollapsed, activeView } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  const handleMenuClick = (view: typeof activeView) => {
    dispatch(setActiveView(view));
  };

  return (
    <div
      className={`bg-navy-900 text-white transition-all duration-300 ${
        sidebarCollapsed ? "w-16" : "w-64"
      } flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-navy-700">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">ISAURA</span>
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 hover:bg-navy-800 rounded-lg transition-colors"
        >
          {sidebarCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.view)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-sky-600 text-white shadow-lg"
                  : "hover:bg-navy-800 text-gray-300"
              }`}
              title={sidebarCollapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
              {!sidebarCollapsed && isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-navy-700">
        <button
          className={`w-full flex items-center space-x-3 p-3 hover:bg-navy-800 rounded-lg transition-colors text-gray-300`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Configuración</span>}
        </button>
      </div>
    </div>
  );
}
