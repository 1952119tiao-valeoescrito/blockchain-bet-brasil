// src/components/PrognosticsTable.tsx

import React from 'react';

const PrognosticsTable = () => {
  // Uma forma simples de gerar os dados da sua tabela 25x25
  const tableData = Array.from({ length: 25 }, (_, i) => 
    Array.from({ length: 25 }, (_, j) => `${i + 1}/${j + 1}`)
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-8 mt-12">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Tabela de Referência de Prognósticos</h2>
      <p className="text-gray-400 mb-6 text-center">
        Esta tabela serve como uma referência completa de todos os 625 prognósticos possíveis em nosso sistema, no formato "x/y". Use-a para consultar e planejar suas apostas.
      </p>
      
      {/* Container para permitir rolagem horizontal em telas pequenas */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full bg-gray-800 text-white">
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-gray-800 odd:bg-gray-900/50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border-t border-gray-700 px-2 py-1 text-center text-xs md:text-sm whitespace-nowrap">
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

export default PrognosticsTable;