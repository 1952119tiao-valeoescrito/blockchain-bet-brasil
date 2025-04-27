// src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers5/react';

// Endereço do contrato (substitua pelo seu)
const CONTRACT_ADDRESS = "0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8";
const TICKET_PRICE = 0.01; // ETH

export default function BetBrasilPage() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const [contract, setContract] = useState<any>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [randomResult, setRandomResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // ABI do contrato (simplificada)
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_vrfCoordinator",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_keyHash",
				"type": "bytes32"
			},
			{
				"internalType": "uint64",
				"name": "_subscriptionId",
				"type": "uint64"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "have",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "want",
				"type": "address"
			}
		],
		"name": "OnlyCoordinatorCanFulfill",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "apostador",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256[5]",
				"name": "prognosticos",
				"type": "uint256[5]"
			}
		],
		"name": "ApostaRealizada",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "apostador",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "valor",
				"type": "uint256"
			}
		],
		"name": "PremioDistribuido",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "descricao",
				"type": "string"
			}
		],
		"name": "PrognosticoAdicionado",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "resultados",
				"type": "uint256[]"
			}
		],
		"name": "SorteioRealizado",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_descricao",
				"type": "string"
			}
		],
		"name": "adicionarPrognostico",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[5]",
				"name": "_prognosticos",
				"type": "uint256[5]"
			}
		],
		"name": "apostar",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "apostas",
		"outputs": [
			{
				"internalType": "address",
				"name": "apostador",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "callbackGasLimit",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "distribuirPremios",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dono",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "encerramentoApostas",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "keyHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "numWords",
		"outputs": [
			{
				"internalType": "uint32",
				"name": "",
				"type": "uint32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "obterPrognostico",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "premiacao",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "prognosticos",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "descricao",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "proximoIdPrognostico",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "requestId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "randomWords",
				"type": "uint256[]"
			}
		],
		"name": "rawFulfillRandomWords",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reaberturaApostas",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reabrirApostas",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "requestConfirmations",
		"outputs": [
			{
				"internalType": "uint16",
				"name": "",
				"type": "uint16"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "requestId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "resultados",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "solicitarSorteio",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sorteioRealizado",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "subscriptionId",
		"outputs": [
			{
				"internalType": "uint64",
				"name": "",
				"type": "uint64"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "taxaAposta",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "vrfCoordinator",
		"outputs": [
			{
				"internalType": "contract VRFCoordinatorV2Interface",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_vrfCoordinator",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "_keyHash",
                "type": "bytes32"
            },
            // ... cole TODO o resto da ABI aqui ...
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [ /*...*/ ],
        "name": "OnlyCoordinatorCanFulfill",
        "type": "error"
    },
    // ... cole todos os outros objetos da ABI aqui ...
    {
        "inputs": [],
        "name": "vrfCoordinator",
        "outputs": [ /*...*/ ],
        "stateMutability": "view",
        "type": "function"
    }
]; 

    {
      "inputs": [
        {"internalType": "address", "name": "_vrfCoordinator", "type": "address"},
        {"internalType": "address", "name": "_linkToken", "type": "address"},
        {"internalType": "bytes32", "name": "_keyHash", "type": "bytes32"},
        {"internalType": "uint256", "name": "_fee", "type": "uint256"}
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "apostar",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "players",
      "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "randomResult",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sortear",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [{"indexed": false, "internalType": "address", "name": "jogador", "type": "address"}],
      "name": "NovaAposta",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [{"indexed": false, "internalType": "uint256", "name": "numeroSorteado", "type": "uint256"}],
      "name": "SorteioRealizado",
      "type": "event"
    }
  ];

  useEffect(() => {
    if (isConnected && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const betContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      setContract(betContract);

      // Carrega dados iniciais
      loadContractData(betContract);
      
      // Escuta eventos
      betContract.on("NovaAposta", () => {
        loadContractData(betContract);
      });

      betContract.on("SorteioRealizado", (numeroSorteado: number) => {
        setRandomResult(numeroSorteado.toNumber());
      });
    }

    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, [isConnected]);

  const loadContractData = async (contract: any) => {
    try {
      const playersList = await contract.players();
      const lastResult = await contract.randomResult();
      
      setPlayers(playersList);
      setRandomResult(lastResult.toNumber());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleApostar = async () => {
    if (!isConnected) {
      await open();
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.apostar({
        value: ethers.utils.parseEther(TICKET_PRICE.toString())
      });
      await tx.wait();
      alert("Aposta realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao apostar:", error);
      alert("Erro ao apostar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSortear = async () => {
    if (!isConnected) {
      await open();
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.sortear();
      await tx.wait();
    } catch (error) {
      console.error("Erro ao sortear:", error);
      alert("Erro ao sortear: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">BetBrasil - Sorteio</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Status do Sorteio</h2>
          {randomResult !== null ? (
            <p className="text-lg">Último número sorteado: <span className="font-bold">{randomResult}</span></p>
          ) : (
            <p className="text-lg">Nenhum sorteio realizado ainda</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Jogadores ({players.length})</h2>
          <div className="bg-gray-50 p-4 rounded max-h-60 overflow-y-auto">
            {players.length > 0 ? (
              <ul className="space-y-2">
                {players.map((player, index) => (
                  <li key={index} className={`p-2 rounded ${player.toLowerCase() === address?.toLowerCase() ? 'bg-blue-100' : ''}`}>
                    {player}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum jogador ainda</p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleApostar}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? "Processando..." : `Apostar ${TICKET_PRICE} ETH`}
          </button>

          {address && (
            <button
              onClick={handleSortear}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? "Processando..." : "Realizar Sorteio"}
            </button>
          )}

          {!isConnected && (
            <button
              onClick={open}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Conectar Carteira
            </button>
          )}
        </div>
      </div>
    </div>
  );
}