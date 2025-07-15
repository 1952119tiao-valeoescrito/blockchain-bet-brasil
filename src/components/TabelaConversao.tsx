// src/components/TabelaConversao.tsx - VERSÃO COM NÚMEROS CENTRALIZADOS

const TabelaConversao = () => {
  const grupos = [
    { grupo: '01', animal: 'Avestruz', dezenas: '01, 02, 03, 04' },
    { grupo: '02', animal: 'Águia', dezenas: '05, 06, 07, 08' },
    { grupo: '03', animal: 'Burro', dezenas: '09, 10, 11, 12' },
    { grupo: '04', animal: 'Borboleta', dezenas: '13, 14, 15, 16' },
    { grupo: '05', animal: 'Cachorro', dezenas: '17, 18, 19, 20' },
    { grupo: '06', animal: 'Cabra', dezenas: '21, 22, 23, 24' },
    { grupo: '07', animal: 'Carneiro', dezenas: '25, 26, 27, 28' },
    { grupo: '08', animal: 'Camelo', dezenas: '29, 30, 31, 32' },
    { grupo: '09', animal: 'Cobra', dezenas: '33, 34, 35, 36' },
    { grupo: '10', animal: 'Coelho', dezenas: '37, 38, 39, 40' },
    { grupo: '11', animal: 'Cavalo', dezenas: '41, 42, 43, 44' },
    { grupo: '12', animal: 'Elefante', dezenas: '45, 46, 47, 48' },
    { grupo: '13', animal: 'Galo', dezenas: '49, 50, 51, 52' },
    { grupo: '14', animal: 'Gato', dezenas: '53, 54, 55, 56' },
    { grupo: '15', animal: 'Jacaré', dezenas: '57, 58, 59, 60' },
    { grupo: '16', animal: 'Leão', dezenas: '61, 62, 63, 64' },
    { grupo: '17', animal: 'Macaco', dezenas: '65, 66, 67, 68' },
    { grupo: '18', animal: 'Porco', dezenas: '69, 70, 71, 72' },
    { grupo: '19', animal: 'Pavão', dezenas: '73, 74, 75, 76' },
    { grupo: '20', animal: 'Peru', dezenas: '77, 78, 79, 80' },
    { grupo: '21', animal: 'Touro', dezenas: '81, 82, 83, 84' },
    { grupo: '22', animal: 'Tigre', dezenas: '85, 86, 87, 88' },
    { grupo: '23', animal: 'Urso', dezenas: '89, 90, 91, 92' },
    { grupo: '24', animal: 'Veado', dezenas: '93, 94, 95, 96' },
    { grupo: '25', animal: 'Vaca', dezenas: '97, 98, 99, 00' },
  ];

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Tabela de Conversão: Dezena para Grupo</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-4 text-cyan-400 text-center">Grupo</th> {/* Centralizado */}
              <th className="p-4 text-cyan-400">Animal</th>
              <th className="p-4 text-cyan-400 text-center">Dezenas Correspondentes</th> {/* Centralizado */}
            </tr>
          </thead>
          <tbody>
            {grupos.map(({ grupo, animal, dezenas }) => (
              <tr key={grupo} className="border-b border-gray-700 last:border-b-0">
                {/* ===== CÉLULAS CORRIGIDAS ABAIXO ===== */}
                <td className="p-4 text-center">{grupo}</td> {/* Centralizado */}
                <td className="p-4">{animal}</td>
                <td className="p-4 font-mono text-center">{dezenas}</td> {/* Centralizado */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaConversao;