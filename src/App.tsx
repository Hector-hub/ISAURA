import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './store/store';
import { useAppSelector, useAppDispatch } from './hooks';
import { setIsMobile } from './store/slices/uiSlice';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import RealtimeView from './views/RealtimeView';
import PredictiveView from './views/PredictiveView';
import HistoricalView from './views/HistoricalView';

function AppContent() {
  const { activeView, sidebarCollapsed, isMobile } = useAppSelector(state => state.ui);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 1024));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'realtime':
        return <RealtimeView />;
      case 'predictive':
        return <PredictiveView />;
      case 'historical':
        return <HistoricalView />;
      default:
        return <RealtimeView />;
    }
  };

  return (
    <Router>
      <div className="h-screen flex bg-gray-50">
        {/* Sidebar - Oculto */}
        {/* {(!isMobile || !sidebarCollapsed) && <Sidebar />} */}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-hidden">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;