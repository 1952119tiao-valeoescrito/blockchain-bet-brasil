'use client' // Necessário para interatividade

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import contractABI from './BetBrasilABI.json' // Você precisa criar este arquivo com a ABI do contrato

const CONTRACT_ADDRESS = "0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8" // Substitua pelo endereço do seu contrato

export default function BetBrasilGame() {
  const [currentAccount, setCurrentAccount] = useState("")
  const [ticketPrice, setTicketPrice] = useState("0.01")
  const [players, setPlayers] = useState<string[]>([])
  const [randomResult, setRandomResult] = useState<number | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  // Inicializa o contrato
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      provider.getSigner().then(signer => {
        const betContract = new ethers.Contract(
          [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_vrfCoordinator",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_linkToken",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "_keyHash",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "jogador",
				"type": "address"
			}
		],
		"name": "NovaAposta",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "dono",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "valor",
				"type": "uint256"
			}
		],
		"name": "SaqueRealizado",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "numeroSorteado",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "ganhador",
				"type": "address"
			}
		],
		"name": "SorteioRealizado",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "apostar",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_jogador",
				"type": "address"
			}
		],
		"name": "jaApostou",
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
		"name": "lastWinner",
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
		"name": "lastWinnerNumber",
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
		"name": "owner",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
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
		"name": "prizePool",
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
				"internalType": "bytes32",
				"name": "requestId",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "randomness",
				"type": "uint256"
			}
		],
		"name": "rawFulfillRandomness",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sacarTaxa",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"inputs": [],
		"name": "ticketPrice",
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
		"stateMutability": "payable",
		"type": "receive"
	}
],
          signer
        )
        setContract(betContract)
        
        // Carrega dados iniciais
        loadContractData(betContract)
      })
    }
  }, [])

  async function loadContractData(betContract: ethers.Contract) {
    const price = await betContract.ticketPrice()
    setTicketPrice(ethers.formatEther(price))
    
    const playersList = await betContract.getPlayers()
    setPlayers(playersList)
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setCurrentAccount(accounts[0])
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function placeBet() {
    if (!contract) return
    
    try {
      const tx = await contract.apostar({
        value: ethers.parseEther(ticketPrice)
      })
      await tx.wait()
      alert("Aposta realizada com sucesso!")
      loadContractData(contract)
    } catch (error) {
      console.error("Erro ao apostar:", error)
    }
  }

  async function drawWinner() {
    if (!contract || currentAccount !== await contract.owner()) return
    
    try {
      const tx = await contract.sortear()
      await tx.wait()
      alert("Sorteio iniciado! Aguarde o resultado.")
    } catch (error) {
      console.error("Erro no sorteio:", error)
    }
  }

  // Listen for events
  useEffect(() => {
    if (!contract) return

    contract.on("NovaAposta", (jogador) => {
      setPlayers(prev => [...prev, jogador])
    })

    contract.on("SorteioRealizado", (numeroSorteado) => {
      setRandomResult(Number(numeroSorteado))
    })

    return () => {
      contract.removeAllListeners()
    }
  }, [contract])

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center mb-6">BetBrasil</h1>
        
        {!currentAccount ? (
          <button 
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Conectar Carteira
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">Conectado como: {currentAccount.slice(0,6)}...{currentAccount.slice(-4)}</p>
            
            <div className="border p-4 rounded">
              <h2 className="font-semibold mb-2">Faça sua aposta</h2>
              <p>Valor: {ticketPrice} ETH</p>
              <button 
                onClick={placeBet}
                className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Apostar
              </button>
            </div>

            <div className="border p-4 rounded">
              <h2 className="font-semibold mb-2">Jogadores ({players.length})</h2>
              <ul className="max-h-40 overflow-y-auto">
                {players.map((player, i) => (
                  <li key={i} className="text-sm py-1">
                    {player === currentAccount ? (
                      <strong>Você ({player.slice(0,6)}...{player.slice(-4)})</strong>
                    ) : (
                      `${player.slice(0,6)}...${player.slice(-4)}`
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {randomResult && (
              <div className="border p-4 rounded bg-yellow-50">
                <h2 className="font-semibold">Último sorteio</h2>
                <p>Número sorteado: {randomResult}</p>
              </div>
            )}

            {contract && currentAccount === (await contract.owner()) && (
              <button 
                onClick={drawWinner}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Realizar Sorteio
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}