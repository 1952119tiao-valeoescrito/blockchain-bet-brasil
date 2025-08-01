// src/components/AdminWriteButton.tsx

"use client";
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useEffect } from 'react';
import contractAbi from '@/abi/BlockChainBet.json';

const contractAddress = '0x00376502EA15B19E5aD363B47126cBF4903cCbD0';

interface AdminWriteButtonProps {
    functionName: string;
    message: string;
    args: unknown[];
    onSuccess?: () => void;
    className?: string;
}

export default function AdminWriteButton({ functionName, message, args, onSuccess, className }: AdminWriteButtonProps) {
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isConfirmed && onSuccess) {
            onSuccess();
        }
    }, [isConfirmed, onSuccess]);

    const handleWrite = () => {
        writeContract({
            address: contractAddress,
            abi: contractAbi,
            functionName: functionName,
            args: args,
        });
    };

    return (
        <div>
            <button
                onClick={handleWrite}
                disabled={isPending || isConfirming}
                className={`w-full px-6 py-3 text-lg font-bold text-white rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed ${className}`}
            >
                {isPending && 'Aguardando Aprovação...'}
                {isConfirming && 'Confirmando Transação...'}
                {!isPending && !isConfirming && message}
            </button>
            {error && (
                <div className="mt-2 text-red-400 text-sm bg-red-900/50 p-2 rounded">
                    {/* <-- A ÚNICA MUDANÇA É AQUI! Usamos apenas .message --> */}
                    Erro: {error.message}
                </div>
            )}
        </div>
    );
}