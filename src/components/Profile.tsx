// src/components/Profile.tsx

import { useAccount, useBalance, useContractRead } from 'wagmi';
import { bettingContractAbi } from '../abi/BettingContract.json'; // Importando o Abi
import styles from './Profile.module.css';

const BlockchainBetBrasilAddrees = '0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8'; // COLOQUE O ENDEREÇO DO SEU CONTRATO DEPLOYADO AQUI

export function Profile() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  // Exemplo de leitura de contrato: ler o valor total de apostas
  const { data: totalApostas, isLoading: isLoadingTotalApostas } = useContractRead({
    address: BlockchainBetBrasilAddrees,
    abi: bettingContractAbi,
    functionName: 'totalApostas', // Mude para o nome da função no seu contrato
    watch: true, // Fica "escutando" por mudanças
  });

  if (!isConnected) {
    return (
      <div className={styles.container}>
        <p>Sua carteira não está conectada.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Seu Perfil</h2>
      <p><strong>Endereço:</strong> {address}</p>
      <p><strong>Saldo:</strong> {balance?.formatted} {balance?.symbol}</p>
      <hr />
      <h3>Dados do Contrato</h3>
      {isLoadingTotalApostas ? (
        <p>Carregando dados do contrato...</p>
      ) : (
        <p><strong>Valor Total Apostado na Plataforma:</strong> {totalApostas?.toString()} Wei</p>
      )}

      {/* Aqui você colocaria os botões para apostar, que usariam o hook useContractWrite */}
    </div>
  );
}