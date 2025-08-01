// src/types/index.ts
export const STATUS_RODADA_MAP: { [key: number]: string } = {
  0: "INATIVA",
  1: "ABERTA",
  2: "FECHADA",
  3: "RESULTADO DISPONÍVEL",
  4: "PAGA"
};

export interface RodadaInfo {
  id: bigint;
  status: number;
  ticketPrice: bigint;
  totalArrecadado: bigint;
  premioTotal: bigint;
  numApostas: bigint;
  numeroDeVencedores: bigint;
}