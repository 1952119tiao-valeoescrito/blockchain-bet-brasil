"use client";

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

export default function HomePage() {
  const { address, isConnected, connector, isConnecting } = useAccount();
  const { connect, connectors, error: connectError, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(""));
  const [numerosParaEnviar, setNumerosParaEnviar] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [uiMessageType, setUiMessageType] = useState<'success' | 'error' | null>(null);

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else {
      alert("Conector Metamask (injected) não encontrado. Verifique se o Metamask está instalado e ativo.");
      // Você poderia iterar por `connectors` para mostrar outras opções de carteira se configuradas
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (/^[\d\/]*$/.test(value) && (value.match(/\//g) || []).length <= 1) {
      const novosPrognosticos = [...prognosticos];
      novosPrognosticos[index] = value;
      setPrognosticos(novosPrognosticos);
    }
  };

  const prepararNumerosParaAposta = () => {
    const numeros: number[] = [];
    let formatoInvalido = false;
    for (const p of prognosticos) {
      if (!/^\d+\/\d+$/.test(p)) {
        formatoInvalido = true; break;
      }
      const numeroAntesDaBarra = Number(p.split('/')[0]);
      if (isNaN(numeroAntesDaBarra)) {
        formatoInvalido = true; break;
      }
      numeros.push(numeroAntesDaBarra);
    }
    if (formatoInvalido || numeros.length !== 5 || numeros.some(n => n === 0)) { // Adicionado verificação de 0
      setUiMessageType('error');
      setUiMessage("Por favor, preencha todos os 5 prognósticos no formato número/número (ex: 10/25) e com números válidos (não zero).");
      return false;
    }
    setNumerosParaEnviar(numeros);
    return true;
  };

  const { data: simulateData, error: simulateError, refetch: refetchSimulate } = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'apostar',
    args: [numerosParaEnviar],
    value: parseEther('0.01'),
    query: {
      enabled: false, // Só simular quando formos chamar a aposta
    }
  });

  const { writeContract, data: writeTxHash, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash: writeTxHash,
  });

  useEffect(() => {
    if (isConnectPending) {
      setUiMessageType(null);
      setUiMessage("Conectando carteira...");
    } else if (connectError) {
      setUiMessageType('error');
      setUiMessage(`Erro ao conectar: ${connectError.message}`);
    } else if (isConnected) {
      setUiMessageType('success');
      setUiMessage(`Carteira conectada: ${address}`);
    } else {
      setUiMessageType(null);
      setUiMessage(null);
    }
  }, [isConnected, address, connectError, isConnectPending]);


  useEffect(() => {
    if (isWritePending) {
      setUiMessageType(null);
      setUiMessage("Enviando transação... Por favor, aprove no Metamask.");
      setIsSubmitting(true);
    }
  }, [isWritePending]);

  useEffect(() => {
    if (isConfirming) {
      setUiMessageType(null);
      setUiMessage("Processando sua aposta... Aguarde a confirmação da transação.");
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isConfirmed && writeTxHash) {
      setUiMessageType('success');
      setUiMessage(`Aposta realizada com sucesso! Hash: ${writeTxHash}`);
      setPrognosticos(Array(5).fill(""));
      setIsSubmitting(false);
    }
  }, [isConfirmed, writeTxHash]);

  useEffect(() => {
    if (simulateError) {
      setUiMessageType('error');
      setUiMessage(`Erro ao preparar aposta (simulação): ${simulateError.message}`);
      setIsSubmitting(false);
    }
    if (writeError) {
      setUiMessageType('error');
      setUiMessage(`Erro ao enviar aposta: ${writeError.message}`);
      setIsSubmitting(false);
    }
    if (receiptError) {
      setUiMessageType('error');
      setUiMessage(`Erro no recibo da transação: ${receiptError.message}`);
      setIsSubmitting(false);
    }
  }, [simulateError, writeError, receiptError]);


  const handleApostar = async () => {
    if (!prepararNumerosParaAposta()) {
      return;
    }
    setIsSubmitting(true);
    setUiMessageType(null);
    setUiMessage("Preparando aposta...");

    try {
      const simulationResult = await refetchSimulate();
      if (simulationResult.error || !simulationResult.data?.request) {
        console.error("Erro na simulação via refetch:", simulationResult.error);
        setUiMessageType('error');
        setUiMessage(`Erro ao preparar aposta: ${simulationResult.error?.message || 'Falha na simulação.'}`);
        setIsSubmitting(false);
        return;
      }
      writeContract(simulationResult.data.request);
    } catch (e: any) {
      console.error("Erro inesperado ao apostar:", e);
      setUiMessageType('error');
      setUiMessage(`Erro inesperado: ${e.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
      <h1 style={{ color: '#333' }}>Blockchain Bet Brasil - O BBB da Web3 - Esse Jogo é animal!</h1>
      
      {uiMessage && (
        <p style={{
          padding: '10px',
          margin: '15px 0',
          borderRadius: '4px',
          backgroundColor: uiMessageType === 'error' ? '#ffebee' : uiMessageType === 'success' ? '#e8f5e9' : '#e3f2fd',
          color: uiMessageType === 'error' ? '#c62828' : uiMessageType === 'success' ? '#2e7d32' : '#0d47a1',
          border: `1px solid ${uiMessageType === 'error' ? '#c62828' : uiMessageType === 'success' ? '#2e7d32' : '#0d47a1'}`
        }}>
          {uiMessage}
        </p>
      )}

      {!isConnected ? (
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={handleConnect}
            disabled={isConnectPending}
            style={{ padding: '12px 25px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: 'none', fontSize: '16px' }}
          >
            {isConnectPending ? 'Conectando...' : 'Conectar Wallet Metamask'}
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ color: '#555', marginTop: '20px' }}>Ganha com 5, 4, 3, 2 e até com 1 ponto apenas!</h3>
          
          <p style={{ marginTop: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9em' }}>
            <a href="https://www.valeoescrito.com.br/tabela_de_prognosticos.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
              Como apostar:
            </a>
          </p>

          <div style={{ margin: '25px 0', padding: '15px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '15px', paddingLeft: '10px', paddingRight: '10px' }}>
              <span style={{ width: '120px', minWidth: '120px', fontWeight: 'bold', color: '#333', paddingRight: '10px', textAlign: 'left' }}>
                Colocação:
              </span>
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-around' }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} style={{ width: '80px', textAlign: 'center', fontSize: '0.9em', color: '#444', fontWeight: 'bold' }}>
                    {`${index + 1}º Prêmio`}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px', paddingRight: '10px' }}>
              <span style={{ width: '120px', minWidth: '120px', fontWeight: 'bold', color: '#333', paddingRight: '10px', textAlign: 'left' }}>
                Prognósticos:
              </span>
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-around' }}>
                {prognosticos.map((numero, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder="ex: 10/25"
                    value={numero}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{ width: '80px', textAlign: 'center', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                    disabled={isSubmitting || isWritePending || isConfirming}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <button 
              onClick={handleApostar} 
              disabled={!isConnected || isSubmitting || isWritePending || isConfirming || !numerosParaEnviar.length}
              style={{ padding: '12px 25px', fontSize: '16px', cursor: 'pointer', backgroundColor: (isSubmitting || isWritePending || isConfirming) ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              {isWritePending ? 'Aguarde Metamask...' : isConfirming ? 'Confirmando Aposta...' : isSubmitting ? 'Processando...' : 'Apostar (0.01 ETH)'}
            </button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => disconnect()} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', borderRadius: '5px', border: 'none', fontSize: '14px' }}>
              Desconectar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}