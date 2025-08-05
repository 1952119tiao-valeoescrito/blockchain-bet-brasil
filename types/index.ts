// types/index.ts

export type RodadaInfo = {
  id: bigint;
  status: number; // 0: Inexistente, 1: Aberta, 2: Fechada
  precoBilhete: bigint;
  totalArrecadado: bigint;
  taxaAdministracao: bigint;
  apostasContagem: bigint;
  // Adicione outros campos se seu contrato tiver
};