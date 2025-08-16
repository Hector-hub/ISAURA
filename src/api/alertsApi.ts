import { generateMockAlerts, generateHeatmapData, generateHistoricalData } from './mockData';
import { Alert } from '../store/slices/alertsSlice';

// Simulated API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const alertsApi = {
  async getAlerts(): Promise<Alert[]> {
    await delay(800);
    return generateMockAlerts(20);
  },

  async getHeatmapData() {
    await delay(500);
    return generateHeatmapData();
  },

  async getHistoricalData() {
    await delay(600);
    return generateHistoricalData();
  },

  async getAlertById(id: string): Promise<Alert | null> {
    await delay(300);
    const alerts = generateMockAlerts(20);
    return alerts.find(alert => alert.id === id) || null;
  },
};