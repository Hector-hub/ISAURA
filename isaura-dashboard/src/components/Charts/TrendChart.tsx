import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockData = [
  { date: '01/01', flood: 4, collapse: 1, incident: 3, fire: 2, earthquake: 0 },
  { date: '02/01', flood: 6, collapse: 2, incident: 5, fire: 1, earthquake: 1 },
  { date: '03/01', flood: 8, collapse: 1, incident: 4, fire: 3, earthquake: 0 },
  { date: '04/01', flood: 3, collapse: 3, incident: 6, fire: 2, earthquake: 1 },
  { date: '05/01', flood: 5, collapse: 1, incident: 2, fire: 4, earthquake: 0 },
  { date: '06/01', flood: 7, collapse: 2, incident: 8, fire: 1, earthquake: 2 },
  { date: '07/01', flood: 9, collapse: 1, incident: 3, fire: 3, earthquake: 0 },
];

export default function TrendChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tendencia de Incidentes (Últimos 7 días)
      </h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="flood" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Inundaciones"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="collapse" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Colapsos"
              dot={{ fill: '#ef4444', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="incident" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Incidentes"
              dot={{ fill: '#f59e0b', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="fire" 
              stroke="#f97316" 
              strokeWidth={2}
              name="Incendios"
              dot={{ fill: '#f97316', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="earthquake" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Sismos"
              dot={{ fill: '#8b5cf6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}