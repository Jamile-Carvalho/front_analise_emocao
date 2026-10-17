import React, { useState, useEffect } from 'react';

export function FiltroEmocao({ filtroFonte, aoAplicarFiltro, fontesDisponiveis = [] }) {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(filtroFonte);

 
  useEffect(() => {
    setOpcaoSelecionada(filtroFonte);
  }, [filtroFonte]);

  const handleSubmit = (e) => {
    e.preventDefault();
    aoAplicarFiltro(opcaoSelecionada);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <label htmlFor="filtro-periodo" className="text-sm font-medium text-gray-700">
        Filtrar por Período:
      </label>
      
      <select
        id="filtro-periodo"
        value={opcaoSelecionada}
        onChange={(e) => setOpcaoSelecionada(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
      >
        <option value="Todas">Todos os Períodos</option>
        {fontesDisponiveis.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        Aplicar Filtro
      </button>
    </form>
  );
}