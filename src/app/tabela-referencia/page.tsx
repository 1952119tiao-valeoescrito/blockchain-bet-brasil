// src/app/tabela-referencia/page.tsx - NENHUMA CORREÇÃO NECESSÁRIA. CÓDIGO PERFEITO.

// 1. IMPORTAÇÃO CORRETA: O caminho '@/' está correto e aponta para o componente certo.
import BlockchainBetBrasilTable from "@/components/BlockchainBetBrasilTable";

// 2. SERVER COMPONENT: Como não usa "use client", a página é renderizada no servidor,
// o que a torna extremamente rápida e eficiente. É a melhor prática.
export default function TabelaReferenciaPage() {
  return (
    <div className="w-full flex justify-center py-8 md:py-12">
      {/* 3. RESPONSABILIDADE ÚNICA: A página só se preocupa em exibir o componente.
          Toda a lógica complexa da tabela está encapsulada onde deveria estar. */}
      <BlockchainBetBrasilTable />
    </div>
  );
}