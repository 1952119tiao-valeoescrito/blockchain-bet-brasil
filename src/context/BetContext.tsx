// src/context/BetContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface UiMessage {
    text: string;
    type: 'success' | 'error' | 'info';
}

interface BetContextType {
    isSubmitting: boolean;
    setIsSubmitting: (isSubmitting: boolean) => void;
    uiMessage: UiMessage | null;
    setUiMessage: (message: UiMessage | null) => void;
    refetchAllData: () => void; // Função para ser chamada para atualizar os dados
}

const BetContext = createContext<BetContextType | undefined>(undefined);

export function BetProvider({ children }: { children: ReactNode }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uiMessage, setUiMessage] = useState<UiMessage | null>(null);

    // Função placeholder. No futuro, ela pode re-validar queries do wagmi.
    const refetchAllData = () => {
        console.log("Refetching all data...");
        // Exemplo: queryClient.invalidateQueries(...)
    };

    const value = { isSubmitting, setIsSubmitting, uiMessage, setUiMessage, refetchAllData };

    return (
        <BetContext.Provider value={value}>
            {children}
            {/* Componente para exibir a mensagem na tela */}
            {uiMessage && (
                <div 
                    className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white ${
                        uiMessage.type === 'success' ? 'bg-green-600' :
                        uiMessage.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
                    }`}
                    onClick={() => setUiMessage(null)} // Clicar para dispensar
                >
                    {uiMessage.text}
                </div>
            )}
        </BetContext.Provider>
    );
}

export function useBetContext() {
    const context = useContext(BetContext);
    if (context === undefined) {
        throw new Error('useBetContext must be used within a BetProvider');
    }
    return context;
}