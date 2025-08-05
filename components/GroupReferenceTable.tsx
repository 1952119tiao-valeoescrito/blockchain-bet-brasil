// src/components/GroupReferenceTable.tsx

'use client';

// Dados dos grupos e suas dezenas
const groupsData = [
  { group: 1, animal: 'Avestruz', dezenas: ['01', '02', '03', '04'] },
  { group: 2, animal: 'Águia', dezenas: ['05', '06', '07', '08'] },
  { group: 3, animal: 'Burro', dezenas: ['09', '10', '11', '12'] },
  { group: 4, animal: 'Borboleta', dezenas: ['13', '14', '15', '16'] },
  { group: 5, animal: 'Cachorro', dezenas: ['17', '18', '19', '20'] },
  { group: 6, animal: 'Cabra', dezenas: ['21', '22', '23', '24'] },
  { group: 7, animal: 'Carneiro', dezenas: ['25', '26', '27', '28'] },
  { group: 8, animal: 'Camelo', dezenas: ['29', '30', '31', '32'] },
  { group: 9, animal: 'Cobra', dezenas: ['33', '34', '35', '36'] },
  { group: 10, animal: 'Coelho', dezenas: ['37', '38', '39', '40'] },
  { group: 11, animal: 'Cavalo', dezenas: ['41', '42', '43', '44'] },
  { group: 12, animal: 'Elefante', dezenas: ['45', '46', '47', '48'] },
  { group: 13, animal: 'Galo', dezenas: ['49', '50', '51', '52'] },
  { group: 14, animal: 'Gato', dezenas: ['53', '54', '55', '56'] },
  { group: 15, animal: 'Jacaré', dezenas: ['57', '58', '59', '60'] },
  { group: 16, animal: 'Leão', dezenas: ['61', '62', '63', '64'] },
  { group: 17, animal: 'Macaco', dezenas: ['65', '66', '67', '68'] },
  { group: 18, animal: 'Porco', dezenas: ['69', '70', '71', '72'] },
  { group: 19, animal: 'Pavão', dezenas: ['73', '74', '75', '76'] },
  { group: 20, animal: 'Peru', dezenas: ['77', '78', '79', '80'] },
  { group: 21, animal: 'Touro', dezenas: ['81', '82', '83', '84'] },
  { group: 22, animal: 'Tigre', dezenas: ['85', '86', '87', '88'] },
  { group: 23, animal: 'Urso', dezenas: ['89', '90', '91', '92'] },
  { group: 24, animal: 'Veado', dezenas: ['93', '94', '95', '96'] },
  { group: 25, animal: 'Vaca', dezenas: ['97', '98', '99', '00'] },
];

const GroupReferenceTable = () => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-semibold text-center text-white mb-4">Tabela de Conversão: Dezena para Grupo</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-700 text-xs text-white uppercase">
            <tr>
              <th className="px-4 py-3 text-center">Grupo</th>
              <th className="px-4 py-3">Animal</th>
              <th className="px-4 py-3 text-center">Dezenas Correspondentes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {groupsData.map(({ group, animal, dezenas }) => (
              <tr key={group} className="hover:bg-slate-700/50">
                <td className="px-4 py-3 text-center font-bold text-cyan-400">{group.toString().padStart(2, '0')}</td>
                <td className="px-4 py-3 text-gray-300">{animal}</td>
                <td className="px-4 py-3 text-center font-mono text-yellow-400">{dezenas.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupReferenceTable;