// CÓDIGO CORRIGIDO para: src/components/AdminRoundControls.tsx

"use client";
import { useState } from 'react';
import { useReadContract } from 'wagmi';
import AdminWriteButton from './AdminWriteButton';
import contractAbi from '@/abi/BlockChainBet.json';

const contractAddress = '0x00376502EA15B19E5aD363B47126cBF4903cCbD0';

export default function AdminRoundControls() {
    const [roundIdToClose, setRoundIdToClose] = useState('');

    const { data: currentRoundId, isLoading: isLoadingRoundId, refetch } = useReadContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: 'getCurrentRoundId',
        watch: true,
    });

    const handleSuccess = () => {
        refetch(); // Força a re-leitura do round atual
        setRoundIdToClose(''); // Limpa o input
    };

    return (
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Controle de Rodadas</h2>
            <div className="space-y-4">
                <p className="text-lg">
                    Rodada Atual em Aberto: 
                    <strong className="text-2xl ml-2 text-green-400">
                        {isLoadingRoundId ? '...' : currentRoundId?.toString()}
                    </strong>
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <AdminWriteButton
                        functionName="startNewRound"
                        message="Iniciar Nova Rodada"
                        args={[]}
                        onSuccess={handleSuccess}
                        className="bg-green-600 hover:bg-green-700"
                    />
                </div>
            </div>
        </div>
    );
}