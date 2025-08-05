// src/components/BlockchainBetBrasilTable.tsx - VERSÃO COM TEXTO CORRIGIDO

'use client';

// Este componente gera e exibe a tabela de referência com todos os 625 prognósticos.
const BlockchainBetBrasilTable = () => {
  // Gera os dados da tabela dinamicamente
  const tableRows = Array.from({ length: 25 }, (_, i) => {
    const rowNumber = i + 1;
    const cells = Array.from({ length: 25 }, (_, j) => {
      const cellNumber = j + 1;
      return `${rowNumber}/${cellNumber}`;
    });
    return cells;
  });

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 text-gray-200 bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 md:p-8">
      
      {/* 1. Cabeçalho */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-cyan-400 sm:text-4xl">
          Tabela de Referência de Prognósticos
        </h1>
        {/* TEXTO CORRIGIDO ABAIXO */}
        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
          Esta tabela serve como uma referência completa de todos os 625 prognósticos possíveis em nosso sistema, no formato <span className="font-mono text-yellow-400">"x/y"</span>. Use-a para consultar e planejar suas apostas.
        </p>
      </div>

      {/* 2. Tabela de Prognósticos */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700">
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {tableRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="p-2 whitespace-nowrap text-center font-mono text-sm text-gray-300 hover:bg-slate-700 transition-colors"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BlockchainBetBrasilTable;