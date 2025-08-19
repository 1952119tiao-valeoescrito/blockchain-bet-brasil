// Caminho: /src/components/PainelDeAposta.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useLotteryContract } from '@/hooks/useLotteryContract';
import { useErc20Approve, useErc20Allowance } from '@/hooks/useErc20Hooks';
import { formatUnits } from 'viem';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

// !! IMPORTANTE !! Substitua pelo endereço do token USDC na rede que você está usando.
const USDC_CONTRACT_ADDRESS = '0x...COLOQUE_O_ENDERECO_DO_USDC_DA_SUA_REDE_AQUI';

interface PainelDeApostaProps {
  rodadaId: number;
}

export default function PainelDeAposta({ rodadaId }: PainelDeApostaProps) {
  const t = useTranslations('PainelDeAposta');
  const { isConnected, address } = useAccount();

  // 1. OBTENDO OS DADOS E AÇÕES DOS HOOKS (VERSÃO SIMPLIFICADA)
  const { rodadaInfo, isRodadaInfoLoading } = useLotteryContract(rodadaId);
  const { allowance, refetchAllowance, isAllowanceSuccess } = useErc20Allowance(USDC_CONTRACT_ADDRESS, address);
  const { approve, isApproving } = useErc20Approve(USDC_CONTRACT_ADDRESS);
  const { apostar, isAposting } = useLotteryContract(rodadaId);
  
  const [prognosticosX, setPrognosticosX] = useState<number[]>(Array(5).fill(0));
  const [prognosticosY, setPrognosticosY] = useState<number[]>(Array(5).fill(0));

  const ticketPrice = rodadaInfo?.[2] || BigInt(0);
  const hasSufficientAllowance = allowance && ticketPrice > 0 && allowance >= ticketPrice;

  // 2. LÓGICA DE ATUALIZAÇÃO PÓS-APROVAÇÃO
  // Quando a aprovação é concluída com sucesso, o hook `useErc20Approve` retorna
  // um `isApproveSuccess` que podemos usar para recarregar a permissão.
  useEffect(() => {
    if (isAllowanceSuccess) {
      refetchAllowance();
    }
  }, [isAllowanceSuccess, refetchAllowance]);

  const handleApostar = () => {
    if (prognosticosX.some(p => p < 1 || p > 25) || prognosticosY.some(p => p < 1 || p > 25)) {
      toast.error(t('validation_error'));
      return;
    }
    apostar({ args: [prognosticosX, prognosticosY] });
  };

  const handleApprove = () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    if (ticketPrice > 0 && contractAddress) {
        approve({ args: [contractAddress, ticketPrice] });
    }
  };

  // 3. RENDERIZAÇÃO DO BOTÃO DE AÇÃO (MUITO MAIS LIMPA)
  const renderActionButton = () => {
    if (!isConnected) return <button disabled className="btn-disabled">{t('connect_wallet')}</button>;
    if (isRodadaInfoLoading) return <button disabled className="btn-disabled">{t('loading_info')}</button>;
    
    const isRodadaAberta = rodadaInfo && rodadaInfo[1] === 1;
    if (!isRodadaAberta) return <button disabled className="btn-disabled">{t('bets_closed')}</button>;
    
    // O botão agora só se preocupa com o estado de estar 'carregando' (isApproving/isAposting).
    // O texto específico de "confirmando na carteira" ou "processando" é handled pelo toast.
    if (!hasSufficientAllowance) {
        return (
            <button onClick={handleApprove} disabled={isApproving} className="btn-approve">
                {isApproving ? t('approve_confirming') : t('approve_button', {price: formatUnits(ticketPrice, 6)})}
            </button>
        );
    }
    
    return (
        <button onClick={handleApostar} disabled={isAposting} className="btn-submit">
            {isAposting ? t('bet_confirming') : t('bet_button')}
        </button>
    );
  };
  
  return (
    <div className="panel">
      <h2>{t('title', {id: rodadaId})}</h2>
      {rodadaInfo && <p>{t('ticketPrice')}: <strong>{formatUnits(ticketPrice, 6)} USDC</strong></p>}

      {/* Seus inputs para os prognósticos viriam aqui */}

      <div className="action-button-container">{renderActionButton()}</div>
    </div>
  );
}