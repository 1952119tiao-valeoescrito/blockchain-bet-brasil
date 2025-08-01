// src/app/tabela-apostas/page.tsx

// 1. Importamos o componente que você já criou
import BlockchainBetBrasilTable from '@/components/BlockchainBetBrasilTable';

export default function TabelaDeApostasPage() {
  return (
    <div className="w-full max-w-4xl text-center flex flex-col items-center gap-8">
      <h1 className="text-4xl md:text-5xl font-bold text-white">
        Prognósticos e Premiação
      </h1>
      <p className="text-lg text-gray-300">
        Entenda quais são os prognósticos válidos e como funciona a premiação.
      </p>

      {/* 2. Colocamos sua casa (o componente) na fundação (a página) */}
      <BlockchainBetBrasilTable />
    </div>
  );
}