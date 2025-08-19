// Caminho: /src/hooks/useErc20Hooks.ts
'use client';
import { useReadContract, useWriteContract } from 'wagmi';
import { Address } from 'viem';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
const erc20Abi = [
{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}
] as const;
/**
Hook para verificar a permissão (allowance) de um token.
*/
export function useErc20Allowance(tokenAddress: Address, owner?: Address) {
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;
const { data, isLoading, refetch, isSuccess } = useReadContract({
address: tokenAddress,
abi: erc20Abi,
functionName: 'allowance',
args: [owner!, contractAddress],
query: {
enabled: !!owner && !!contractAddress,
}
});
return {
allowance: data,
isLoading,
refetchAllowance: refetch,
isAllowanceSuccess: isSuccess // Informa quando a busca foi bem-sucedida
};
}
/**
Hook para executar a função de aprovação (approve) de um token.
Fornece feedback via toast e retorna o estado da transação.
*/
export function useErc20Approve(tokenAddress: Address) {
const t = useTranslations('Notifications');
const { writeContractAsync } = useWriteContract();
const [isApproving, setIsApproving] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const approve = async (options: { args: [Address, bigint] }) => {
setIsApproving(true);
setIsSuccess(false);
code
Code
await toast.promise(
  writeContractAsync({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: options.args
  }),
  {
    loading: t('approve_loading'),
    success: () => {
      setIsSuccess(true); // Marcamos o sucesso para o useEffect no componente
      return t('approve_success');
    },
    error: (err: any) => {
      if (err.shortMessage.includes('rejected')) return t('error_rejected');
      return t('error_generic', { message: err.shortMessage });
    },
  }
);
setIsApproving(false);
};
// Efeito para resetar o estado de sucesso. Isso permite que, se o usuário
// fizer uma nova aprovação, o useEffect no componente dispare novamente.
useEffect(() => {
if (isSuccess) {
const timer = setTimeout(() => setIsSuccess(false), 50); // Reseta após um breve delay
return () => clearTimeout(timer);
}
}, [isSuccess]);
return {
approve,
isApproving, // Booleano para desabilitar o botão
isApproveSuccess: isSuccess // Booleano para o useEffect de recarga
};
}
