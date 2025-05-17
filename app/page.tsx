"use client";

import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< IMPORTADO useBalance
} from 'wagmi';
import { parseEther } from 'viem'; // formatEther não é estritamente necessário aqui pois useBalance já formata
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

const gerarPrognosticosValidos = (): string[] => {
  const validos: string[] = [];
  for (let i = 1; i <= 25; i++) {
    for (let j = 1; j <= 25; j++) {
      validos.push(`${i}/${j}`);
    }
  }
  return validos;
};

const validPrognosticsSet = new Set(gerarPrognosticosValidos());

export default function HomePage() {
  const { address, isConnected, connector, isConnecting } = useAccount();
  const { connect, connectors, error: connectError, isPending: isConnectPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(""));
  const [numerosXParaEnviar, setNumerosXParaEnviar] = useState<number[]>([]);
  const [numerosYParaEnviar, setNumerosYParaEnviar] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [uiMessageType, setUiMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const [isPreparingBet, setIsPreparingBet] = useState(false);

  // HOOK useBalance PARA PEGAR O SALDO REAL
  const { data: balanceData, isLoading: isBalanceLoading, error: balanceError, refetch: refetchBalance } = useBalance({
    address: address,
    // watch: true, // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< LINHA REMOVIDA
  });

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.type === 'injected');
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else {
        if(connectors.length > 0) {
            connect({ connector: connectors[0] });
        } else {
             setUiMessageType('error');
             setUiMessage("Nenhuma opção de carteira encontrada. Verifique se o Metamask está instalado ou configure outras carteiras.");
        }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (/^\d*\/?\d*$/.test(value)) {
        const novosPrognosticos = [...prognosticos];
        novosPrognosticos[index] = value;
        setPrognosticos(novosPrognosticos);
        if (uiMessageType === 'error' && (uiMessage?.startsWith("Prognóstico inválido") || uiMessage?.startsWith("Por favor, preencha"))) {
            setUiMessage(null);
            setUiMessageType(null);
        }
    }
  };

  const prepararNumerosParaAposta = () => {
    const numerosX: number[] = [];
    const numerosY: number[] = [];
    let invalidoOuForaDoRange = false;
    let campoVazio = false;

    for (const p of prognosticos) {
        const trimmedP = p.trim();
        if (!trimmedP) {
            campoVazio = true; break;
        }
        if (!validPrognosticsSet.has(trimmedP)) { 
            invalidoOuForaDoRange = true; break;
        }
        const partes = trimmedP.split('/');
        const numeroAntesDaBarra = Number(partes[0]);
        const numeroDepoisDaBarra = Number(partes[1]);
        
        if (isNaN(numeroAntesDaBarra) || isNaN(numeroDepoisDaBarra) ||
            numeroAntesDaBarra < 1 || numeroAntesDaBarra > 25 ||
            numeroDepoisDaBarra < 1 || numeroDepoisDaBarra > 25) {
           invalidoOuForaDoRange = true; break;
        }
        numerosX.push(numeroAntesDaBarra);
        numerosY.push(numeroDepoisDaBarra);
    }

    if (campoVazio) {
        setUiMessageType('error');
        setUiMessage("Por favor, preencha todos os 5 campos de prognóstico.");
        return false;
    }
    if (invalidoOuForaDoRange || numerosX.length !== 5 || numerosY.length !== 5) {
      setUiMessageType('error');
      setUiMessage("Prognóstico inválido. Use o formato X/Y, onde X e Y devem ser números entre 1 e 25.");
      return false;
    }
    setNumerosXParaEnviar(numerosX);
    setNumerosYParaEnviar(numerosY);
    setUiMessage(null); 
    setUiMessageType(null);
    return true;
  };

  const { data: simulateData, error: simulateError, refetch: refetchSimulate, isLoading: isSimulating } = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'apostar',
    args: [numerosXParaEnviar, numerosYParaEnviar],
    value: parseEther('0.01'),
    query: {
      enabled: false,
    }
  });

  const { writeContract, data: writeTxHash, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({
    hash: writeTxHash,
    query: {
        enabled: !!writeTxHash,
    }
  });

  useEffect(() => {
    if (isConnecting || isConnectPending) {
      setUiMessageType('info');
      setUiMessage("Conectando carteira...");
    } else if (connectError) {
      setUiMessageType('error');
      const message = (connectError as any)?.shortMessage || connectError.message;
      setUiMessage(`Erro ao conectar: ${message}`);
    } else if (isConnected && address) {
      let connectedMessage = `Carteira: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      if (isBalanceLoading) {
        connectedMessage += " (Carregando saldo...)";
      } else if (balanceError) {
        const shortBalanceError = (balanceError as any)?.shortMessage || balanceError.message;
        connectedMessage += ` (Erro saldo: ${shortBalanceError})`;
      } else if (balanceData) {
        connectedMessage += ` | Saldo: ${balanceData.formatted} ${balanceData.symbol}`;
      }
      setUiMessageType('success');
      setUiMessage(connectedMessage);
    } else {
       setUiMessageType(null);
       setUiMessage("Conecte sua carteira para apostar.");
    }
  }, [isConnected, address, connectError, isConnecting, isConnectPending, connector, balanceData, isBalanceLoading, balanceError]);

  useEffect(() => {
    if (isSimulating) {
        setUiMessageType('info');
        setUiMessage("Verificando a aposta (simulação)...");
        setIsSubmitting(true); 
    } else if (isWritePending) {
      setUiMessageType('info');
      setUiMessage("Aguardando confirmação na sua carteira (Metamask)...");
      setIsSubmitting(true);
    } else if (isConfirming) {
      setUiMessageType('info');
      setUiMessage("Processando sua aposta na blockchain... Aguarde.");
       setIsSubmitting(true);
    }
  }, [isSimulating, isWritePending, isConfirming]);

  useEffect(() => {
    if (isConfirmed && writeTxHash) {
      setUiMessageType('success');
      setUiMessage(`Aposta realizada com sucesso! Hash: ${writeTxHash.substring(0,10)}...`);
      setPrognosticos(Array(5).fill(""));
      setNumerosXParaEnviar([]);
      setNumerosYParaEnviar([]);
      setIsSubmitting(false);
      setIsPreparingBet(false);
      refetchBalance(); 
    }
  }, [isConfirmed, writeTxHash, refetchBalance]); 

  useEffect(() => {
    let errorToSet: string | null = null;
    let shouldResetSubmitting = false;

    if (simulateError) {
      errorToSet = (simulateError as any)?.cause?.shortMessage || (simulateError as any)?.shortMessage || simulateError.message || "Erro na simulação.";
      shouldResetSubmitting = true;
    } else if (writeError) {
      errorToSet = (writeError as any)?.shortMessage || writeError.message || "Erro ao enviar transação.";
      shouldResetSubmitting = true;
    } else if (receiptError) {
      errorToSet = (receiptError as any)?.shortMessage || receiptError.message || "Erro na confirmação da transação.";
      shouldResetSubmitting = true;
    }

    if (errorToSet) {
        setUiMessageType('error');
        setUiMessage(`Erro: ${errorToSet}`);
    }
    if (shouldResetSubmitting) {
        setIsSubmitting(false);
        setIsPreparingBet(false);
    }
  }, [simulateError, writeError, receiptError]);

  const handleSubmitBetClick = () => {
    if (!isConnected || !address) {
        setUiMessageType('error');
        setUiMessage("Por favor, conecte sua carteira primeiro.");
        return;
    }
    if (prepararNumerosParaAposta()) { 
      setUiMessageType('info');
      setUiMessage("Preparando para enviar a aposta...");
      setIsPreparingBet(true); 
    } else {
      setIsSubmitting(false); 
      setIsPreparingBet(false);
    }
  };

  useEffect(() => {
    if (!isPreparingBet || numerosXParaEnviar.length !== 5 || numerosYParaEnviar.length !== 5) {
      if (isPreparingBet) { 
        setIsPreparingBet(false);
      }
      return;
    }

    const executeAposta = async () => {
      console.log("Tentando simulação com X:", numerosXParaEnviar, "Y:", numerosYParaEnviar);
      setIsSubmitting(true); 
      try {
        const simulationResult = await refetchSimulate();

        if (simulationResult.isError || !simulationResult.data?.request) {
          console.error("Erro na simulação (useEffect executeAposta):", simulationResult.error);
          const message = (simulationResult.error as any)?.cause?.shortMessage || 
                          (simulationResult.error as any)?.shortMessage || 
                          simulationResult.error?.message || 
                          'Falha desconhecida na simulação.';
          setUiMessageType('error');
          setUiMessage(`Erro ao preparar aposta: ${message}`);
          setIsSubmitting(false); 
          setIsPreparingBet(false);
          return;
        }
        
        setUiMessageType('info');
        setUiMessage("Simulação OK. Aguardando assinatura na carteira...");
        writeContract(simulationResult.data.request);
      } catch (e: any) {
        console.error("Erro inesperado no executeAposta (useEffect):", e);
        setUiMessageType('error');
        setUiMessage(`Erro inesperado ao executar aposta: ${e.message}`);
        setIsSubmitting(false); 
        setIsPreparingBet(false);
      }
    };

    executeAposta();

  }, [isPreparingBet, numerosXParaEnviar, numerosYParaEnviar, refetchSimulate, writeContract]);


  const EmojisJogoDoBicho = () => (
    <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem', wordSpacing: '0.5rem' }}>
       <span>🐦</span> 
       <span>🦅</span> <span>🐴</span> <span>🦋</span> <span>🐶</span> <span>🐐</span> <span>🐏</span> <span>🐫</span> <span>🐍</span> <span>🐇</span> <span>🐴</span> <span>🐘</span> <span>🐓</span> <span>🐈</span> <span>🐊</span> <span>🦁</span> <span>🐒</span> <span>🐖</span> <span>🦚</span> <span>🦃</span> <span>🐂</span> <span>🐅</span> <span>🐻</span> <span>🦌</span> <span>🐄</span>
    </div>
  );

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Blockchain Bet Brasil - O BBB da Web3 - Esse Jogo é Animal!</h1>
      <EmojisJogoDoBicho />
      {uiMessage && (
        <p style={{
          padding: '12px 15px', margin: '20px 0', borderRadius: '4px', textAlign: 'center',
          backgroundColor: uiMessageType === 'error' ? '#ffebee' : uiMessageType === 'success' ? '#e8f5e9' : '#e3f2fd',
          color: uiMessageType === 'error' ? '#c62828' : uiMessageType === 'success' ? '#2e7d32' : '#0d47a1',
          border: `1px solid ${uiMessageType === 'error' ? '#c62828' : uiMessageType === 'success' ? '#2e7d32' : '#0d47a1'}`,
          wordWrap: 'break-word'
        }}>
          {uiMessage}
        </p>
      )}
      {!isConnected ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={handleConnect}
            disabled={isConnecting || isConnectPending}
            style={{ padding: '12px 25px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: 'none', fontSize: '16px', opacity: (isConnecting || isConnectPending) ? 0.6 : 1 }}
          >
            {isConnecting || isConnectPending ? 'Conectando...' : 'Conectar Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ color: '#555', marginTop: '20px', textAlign: 'center' }}>Ganha com 5, 4, 3, 2 e até com 1 ponto apenas!</h3>
          <p style={{ marginTop: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9em' }}>
            <a href="https://www.valeoescrito.com.br/tabela_de_prognosticos.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
              Como apostar?
            </a> Escolha 5 prognósticos no formato <strong>X/Y</strong>, onde <strong>X e Y</strong> devem ser números entre <strong>1 e 25</strong> (Ex: 5/18, 21/3). Pode repetir.
          </p>
          <div style={{ margin: '25px 0', padding: '15px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '10px', padding: '0 10px' }}>
              <span style={{ width: '120px', minWidth: '120px', fontWeight: 'bold', color: '#333', paddingRight: '10px', textAlign: 'left' }}>Colocação:</span>
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-around' }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span key={index} style={{ width: '90px', textAlign: 'center', fontSize: '0.9em', color: '#444', fontWeight: 'bold' }}>{`${index + 1}º Prêmio`}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <span style={{ width: '120px', minWidth: '120px', fontWeight: 'bold', color: '#333', paddingRight: '10px', textAlign: 'left' }}>Prognósticos:</span>
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-around' }}>
                {prognosticos.map((numero, index) => (
                  <input
                    key={index} type="text" placeholder="ex: 10/25" value={numero}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    style={{ width: '90px', textAlign: 'center', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                    disabled={isSubmitting || isPreparingBet } 
                  />
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <button
              onClick={handleSubmitBetClick}
              disabled={!isConnected || isSubmitting || isPreparingBet}
              style={{
                  padding: '12px 25px', fontSize: '16px',
                  cursor: (!isConnected || isSubmitting || isPreparingBet) ? 'not-allowed' : 'pointer',
                  backgroundColor: (!isConnected || isSubmitting || isPreparingBet) ? '#ccc' : '#28a745',
                  color: 'white', border: 'none', borderRadius: '5px',
                  opacity: (!isConnected || isSubmitting || isPreparingBet) ? 0.6 : 1,
               }}
            >
              {isPreparingBet && !isSimulating && !isWritePending && !isConfirming ? 'Preparando...' : 
               isSimulating ? 'Verificando...' : 
               isWritePending ? 'Assine na Carteira...' : 
               isConfirming ? 'Confirmando...' : 
               'Apostar (0.01 ETH)'}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button onClick={() => disconnect()} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', borderRadius: '5px', border: 'none', fontSize: '14px' }}>
              Desconectar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}