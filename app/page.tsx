"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(""));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await (window.ethereum as any).request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setConnected(true);
            setWalletAddress(accounts[0]);
          }
        } catch (err) {
          console.error("Erro ao verificar conexão existente:", err);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    console.log(">>> connectWallet chamada!");
    console.log("isClient:", isClient, "typeof window.ethereum:", typeof window.ethereum);

    if (!isClient || typeof window.ethereum === "undefined") {
      alert("Metamask não encontrado! Por favor, instale para continuar ou certifique-se de que está no navegador.");
      console.error("!!! Metamask não detectada ou isClient é false.");
      return;
    }

    try {
      console.log(">>> Tentando criar provider...");
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      console.log(">>> Provider criado, solicitando contas...");
      
      // const accounts = await provider.send("eth_requestAccounts", []);
      const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
      
      console.log(">>> Contas recebidas:", accounts);

      if (accounts && accounts.length > 0) {
        console.log(">>> Conectado com sucesso:", accounts[0]);
        setConnected(true);
        setWalletAddress(accounts[0]);
      } else {
        alert("Nenhuma conta selecionada ou encontrada.");
        console.warn("!!! Nenhuma conta selecionada ou encontrada após request.");
      }
    } catch (error: any) {
      console.error("!!! Erro DENTRO do try/catch ao conectar carteira:", error);
      if (error.code === 4001) {
        alert("Conexão da carteira rejeitada pelo usuário.");
      } else {
        alert(`Falha ao conectar a carteira: ${error.message || 'Erro desconhecido'}`);
      }
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (/^[\d\/]*$/.test(value) && (value.match(/\//g) || []).length <= 1) {
      const novosPrognosticos = [...prognosticos];
      novosPrognosticos[index] = value;
      setPrognosticos(novosPrognosticos);
    }
  };

  const apostar = async () => {
    if (!isClient || !connected || typeof window.ethereum === "undefined") {
      alert("Por favor, conecte sua carteira primeiro.");
      return;
    }
    const numerosParaEnviar: number[] = [];
    let formatoInvalido = false;
    for (const p of prognosticos) {
      if (!/^\d+\/\d+$/.test(p)) {
        formatoInvalido = true; break;
      }
      const numeroAntesDaBarra = Number(p.split('/')[0]);
      if (isNaN(numeroAntesDaBarra)) {
        formatoInvalido = true; break;
      }
      numerosParaEnviar.push(numeroAntesDaBarra);
    }
    if (formatoInvalido || numerosParaEnviar.length !== 5) {
      alert("Por favor, preencha todos os 5 prognósticos no formato número/número (ex: 10/25).");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const taxa = ethers.parseEther("0.01");
      const tx = await contract.apostar(numerosParaEnviar, { value: taxa });
      alert("Processando sua aposta... Aguarde a confirmação da transação.");
      await tx.wait();
      alert("Aposta realizada com sucesso!");
      setPrognosticos(Array(5).fill(""));
    } catch (error: any) {
      console.error("Erro ao apostar:", error);
      let message = "Erro desconhecido ao apostar.";
      if (error.reason) {
        message = `Erro no contrato: ${error.reason}`;
      } else if (error.data?.message) {
        message = `Erro no contrato: ${error.data.message}`;
      } else if (error.message) {
        message = error.message;
      }
      if (error.code === 4001) {
        message = "Transação rejeitada pelo usuário.";
      } else if (error.code === -32603 && error.data?.message?.includes("insufficient funds")) {
        message = "Fundos insuficientes para a transação.";
      }
      alert(message);
    }
  };

  if (!isClient) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', textAlign: 'center' }}>
      <h1 style={{ color: '#333' }}>Blockchain Bet Brasil - O BBB da Web3 - Esse Jogo é Animal!</h1>
      
      {!connected ? (
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => {
              console.log(">>> BOTÃO CLICADO! <<<");
              connectWallet();
            }} 
            style={{ padding: '12px 25px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: 'none', fontSize: '16px' }}
          >
            Conectar Wallet Metamask
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ color: '#555', marginTop: '20px' }}>Ganha com 5, 4, 3, 2 e até com 1 ponto apenas!</h3>
          <p style={{ textAlign: 'center' }}>Carteira conectada: <strong>{walletAddress}</strong></p>
          
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
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <button onClick={apostar} style={{ padding: '12px 25px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
              Apostar (0.01 ETH)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}