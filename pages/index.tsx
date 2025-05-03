import { useState } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [prognosticos, setPrognosticos] = useState<string[]>(Array(5).fill(''));

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Por favor, instale o Metamask!");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setConnected(true);
        setWalletAddress(accounts[0]);
      }
    } catch (error) {
      console.error("Erro ao conectar carteira:", error);
      alert("Falha ao conectar a carteira.");
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
    if (!connected || !window.ethereum) {
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
    const contractAddress = "0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8";
    const abi = [
      {"inputs": [{"internalType": "address","name": "_vrfCoordinator","type": "address"},{"internalType": "bytes32","name": "_keyHash","type": "bytes32"},{"internalType": "uint64","name": "_subscriptionId","type": "uint64"}],"stateMutability": "nonpayable", "type": "constructor"},
      {"inputs": [{"internalType": "address","name": "have","type": "address"},{"internalType": "address","name": "want","type": "address"}],"name": "OnlyCoordinatorCanFulfill", "type": "error"},
      {"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "apostador","type": "address"},{"indexed": false,"internalType": "uint256[5]","name": "prognosticos","type": "uint256[5]"}],"name": "ApostaRealizada","type": "event"},
      {"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "apostador","type": "address"},{"indexed": false,"internalType": "uint256","name": "valor","type": "uint256"}],"name": "PremioDistribuido","type": "event"},
      {"anonymous": false,"inputs": [{"indexed": false,"internalType": "uint256","name": "id","type": "uint256"},{"indexed": false,"internalType": "string","name": "descricao","type": "string"}],"name": "PrognosticoAdicionado","type": "event"},
      {"anonymous": false,"inputs": [{"indexed": false,"internalType": "uint256[]","name": "resultados","type": "uint256[]"}],"name": "SorteioRealizado","type": "event"},
      {"inputs": [{"internalType": "string","name": "_descricao","type": "string"}],"name": "adicionarPrognostico","outputs": [],"stateMutability": "nonpayable","type": "function"},
      {"inputs": [{"internalType": "uint256[5]","name": "_prognosticos","type": "uint256[5]"}],"name": "apostar","outputs": [],"stateMutability": "payable","type": "function"},
      {"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "apostas","outputs": [{"internalType": "address","name": "apostador","type": "address"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "callbackGasLimit","outputs": [{"internalType": "uint32","name": "","type": "uint32"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "distribuirPremios","outputs": [],"stateMutability": "nonpayable","type": "function"},
      {"inputs": [],"name": "dono","outputs": [{"internalType": "address","name": "","type": "address"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "encerramentoApostas","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "keyHash","outputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "numWords","outputs": [{"internalType": "uint32","name": "","type": "uint32"}],"stateMutability": "view","type": "function"},
      {"inputs": [{"internalType": "uint256","name": "_id","type": "uint256"}],"name": "obterPrognostico","outputs": [{"internalType": "string","name": "","type": "string"}],"stateMutability": "view","type": "function"},
      {"inputs": [{"internalType": "address","name": "","type": "address"}],"name": "premiacao","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},
      {"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "prognosticos","outputs": [{"internalType": "uint256","name": "id","type": "uint256"},{"internalType": "string","name": "descricao","type": "string"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "proximoIdPrognostico","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},
      {"inputs": [{"internalType": "uint256","name": "requestId","type": "uint256"},{"internalType": "uint256[]","name": "randomWords","type": "uint256[]"}],"name": "rawFulfillRandomWords","outputs": [],"stateMutability": "nonpayable","type": "function"},
      {"inputs": [],"name": "reaberturaApostas","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "reabrirApostas","outputs": [],"stateMutability": "nonpayable","type": "function"},
      {"inputs": [],"name": "requestConfirmations","outputs": [{"internalType": "uint16","name": "","type": "uint16"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "requestId","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},
      {"inputs": [{"internalType": "uint256","name": "","type": "uint256"}],"name": "resultados","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "solicitarSorteio","outputs": [],"stateMutability": "nonpayable","type": "function"},
      {"inputs": [],"name": "sorteioRealizado","outputs": [{"internalType": "bool","name": "","type": "bool"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "subscriptionId","outputs": [{"internalType": "uint64","name": "","type": "uint64"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "taxaAposta","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},
      {"inputs": [],"name": "vrfCoordinator","outputs": [{"internalType": "contract VRFCoordinatorV2Interface","name": "","type": "address"}],"stateMutability": "view","type": "function"}
    ];

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const taxa = ethers.utils.parseEther("0.01");
      const tx = await contract.apostar(numerosParaEnviar as [number, number, number, number, number], { value: taxa });
      console.log("Transação enviada:", tx.hash);
      alert("Processando sua aposta... Aguarde a confirmação da transação.");
      await tx.wait();
      console.log("Transação confirmada:", tx.hash);
      alert("Aposta realizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao apostar:", error);
      let message = "Erro desconhecido ao apostar.";
      if (error.reason) { message = `Erro no contrato: ${error.reason}`; }
      else if (error.message) { message = error.message; }
      else if (error.code === 4001) { message = "Transação rejeitada pelo usuário."; }
      alert(message);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>Blockchain Bet Brasil - O BBB da Web3 - Essa é Animal!</h1>
      {!connected ? (
        <div style={{ textAlign: 'center' }}>
          <button onClick={connectWallet} style={{ padding: '12px 25px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Conectar Wallet Metamask
          </button>
        </div>
      ) : (
        <div>
          <h3 style={{ color: '#555', fontWeight: 'normal', marginBottom: '20px', textAlign: 'center' }}>Ganha com 5, 4, 3, 2 e até com 1 ponto apenas.</h3>

          <p style={{ marginBottom: '5px', color: '#666', textAlign: 'center' }}>Carteira conectada: <span style={{ fontWeight: 'bold', color: '#333' }}>{walletAddress}</span></p>

          <p style={{ marginTop: '0px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9em' }}>
            <a href="https://www.valeoescrito.com.br/tabela_de_prognosticos.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
              PROGNÓSTICOS VÁLIDOS
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