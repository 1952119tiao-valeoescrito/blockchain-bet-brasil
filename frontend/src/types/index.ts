// src/types/index.ts

// Esta interface corresponde à estrutura de retorno da função 'rodadas' no seu contrato.
// Wagmi/Viem retorna um array, então ajustamos para pegar os índices.
export type RodadaInfo = readonly [
  id: bigint,
  status: number,
  ticketPrice: bigint,
  totalArrecadado: bigint,
  premioTotal: bigint,
  milharesForamInseridos: boolean,
  numeroDeVencedores: bigint,
  timestampAbertura: bigint,
  timestampFechamentoApostas: bigint,
  timestampResultadosProcessados: bigint
] & {
    // Adicionamos os nomes para facilitar o acesso
    id: bigint;
    status: number;
    ticketPrice: bigint;
    totalArrecadado: bigint;
    premioTotal: bigint;
    milharesForamInseridos: boolean;
    numeroDeVencedores: bigint;
    timestampAbertura: bigint;
    timestampFechamentoApostas: bigint;
    timestampResultadosProcessados: bigint;
};