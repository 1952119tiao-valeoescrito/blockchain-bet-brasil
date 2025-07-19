// src/context/Web3Context.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

// ------ AS CHAVES DO NOSSO IMPÉRIO VIRÃO AQUI ------
import { BlockchainBetBrasilABI, BlockchainBetBrasilAddress } from '../utils/constants'; 

// --- DEFINIÇÃO DAS ESTRUTURAS (TypeScript) ---
interface UiMessage {
    text: string;
    type: 'success' | 'error' | 'info';
}

interface Web3ContextType {
    // --- Lógica do BetContext (UI) ---
    isSubmitting: boolean;
    uiMessage: UiMessage | null;
    
    // --- Lógica do BlockchainContext (CORE) ---
    currentAccount: string;
    connectWallet: () => Promise<void>;
    placeBet: (_prognosticosX: number[], _prognosticosY: number[]) => Promise<void>;

    // --- Funções de Controle ---
    setUiMessage: (message: UiMessage | null) => void;
    refetchAllData: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// --- LÓGICA DE CONEXÃO (do nosso BlockchainContext) ---
const getLotteryContract = () => {
    // Verificação se estamos no browser e se a MetaMask está instalada
    if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask não instalada.");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const lotteryContract = new ethers.Contract(BlockchainBetBrasilAddress, BlockchainBetBrasilABI, signer);
    return lotteryContract;
}


// --- NOSSO PROVEDOR UNIFICADO ---
export function Web3Provider({ children }: { children: ReactNode }) {
    // --- Estados do BetContext (UI) ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uiMessage, setUiMessage] = useState<UiMessage | null>(null);

    // --- Estados do BlockchainContext (CORE) ---
    const [currentAccount, setCurrentAccount] = useState('');

    // --- Funções do BlockchainContext (CORE) ---
    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) return setUiMessage({ text: "Por favor, instale a MetaMask.", type: 'info' });
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length) setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return setUiMessage({ text: "Por favor, instale a MetaMask.", type: 'info' });
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
            setUiMessage({ text: "Falha ao conectar a carteira.", type: 'error' });
        }
    };

    // --- A GRANDE MÁGICA: A FUSÃO EM AÇÃO! ---
    const placeBet = async (_prognosticosX: number[], _prognosticosY: number[]) => {
        setIsSubmitting(true); // <--- Lógica do BetContext
        setUiMessage({ text: "Processando sua aposta...", type: 'info' }); // <--- Lógica do BetContext
        try {
            // const lotteryContract = getLotteryContract(); // <--- Lógica do BlockchainContext
            
            // !! AQUI VAI A LÓGICA DE APROVAR + APOSTAR !!
            // 1. Chamar o 'approve' do contrato do token
            // 2. Chamar a função 'apostar' do nosso contrato
            
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulando a transação
            
            setUiMessage({ text: "Aposta realizada com sucesso!", type: 'success' }); // <--- Lógica do BetContext
            refetchAllData(); // <--- Lógica do BetContext
            
        } catch (error) {
            console.error(error);
            setUiMessage({ text: "Erro ao realizar a aposta.", type: 'error' }); // <--- Lógica do BetContext
        } finally {
            setIsSubmitting(false); // <--- Lógica do BetContext
        }
    };

    const refetchAllData = () => {
        console.log("Atualizando todos os dados da aplicação...");
        // Futuramente, chamará funções para recarregar o saldo, o estado da rodada, etc.
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const value = { 
        isSubmitting, 
        uiMessage, 
        setUiMessage, 
        currentAccount, 
        connectWallet, 
        placeBet,
        refetchAllData 
    };

    // JSX para renderizar o provedor e as mensagens de UI
    return (
        <Web3Context.Provider value={value}>
            {children}
            {uiMessage && (
                <div 
                    className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white cursor-pointer ${
                        uiMessage.type === 'success' ? 'bg-green-600' :
                        uiMessage.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                    }`}
                    onClick={() => setUiMessage(null)}
                >
                    {uiMessage.text}
                </div>
            )}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    const context = useContext(Web3Context);
    if (context === undefined) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
}