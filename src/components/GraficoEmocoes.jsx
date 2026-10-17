import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function GraficoEmocoes({ dados }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80 w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribuição de Emoções Detectadas</h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="emocao" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="frequencia" fill="#6366F1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}