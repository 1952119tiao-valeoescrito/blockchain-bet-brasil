
// src/constants/contractConfig.ts

// 1. COLE SEU NOVO ENDEREÇO DE CONTRATO AQUI
export const BlockchainBetBrasilAddress = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B';

// 2. COLE SUA NOVA ABI AQUI
// Apague a ABI antiga e cole a nova que você acabou de copiar.
export const BlockchainBetBrasilABI = [
	{
		"inputs": [
			{
				"internalType": "uint256[5]",
				"name": "_prognosticosX",
				"type": "uint256[5]"
			},
			{
				"internalType": "uint256[5]",
				"name": "_prognosticosY",
				"type": "uint256[5]"
			}
		],
		"name": "apostar",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "despausar",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fecharApostasDaRodadaAtual",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "iniciarNovaRodada",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "rodadaId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "jogador",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "hashAposta",
				"type": "bytes32"
			}
		],
		"name": "NovaApostaFeita",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "rodadaId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ticketPrice",
				"type": "uint256"
			}
		],
		"name": "NovaRodadaIniciada",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "pausar",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Paused",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "rodadaId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "jogador",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "acertos",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "valor",
				"type": "uint256"
			}
		],
		"name": "PremioReivindicado",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rodadaId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[5]",
				"name": "_resultadosX",
				"type": "uint256[5]"
			},
			{
				"internalType": "uint256[5]",
				"name": "_resultadosY",
				"type": "uint256[5]"
			}
		],
		"name": "registrarResultados",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rodadaId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[5]",
				"name": "_prognosticosX",
				"type": "uint256[5]"
			},
			{
				"internalType": "uint256[5]",
				"name": "_prognosticosY",
				"type": "uint256[5]"
			}
		],
		"name": "reivindicarPremio",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "rodadaId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256[5]",
				"name": "resultadosX",
				"type": "uint256[5]"
			},
			{
				"indexed": false,
				"internalType": "uint256[5]",
				"name": "resultadosY",
				"type": "uint256[5]"
			}
		],
		"name": "ResultadosRegistrados",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_para",
				"type": "address"
			}
		],
		"name": "retirarTaxas",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "rodadaId",
				"type": "uint256"
			}
		],
		"name": "RodadaFechada",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "para",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "valor",
				"type": "uint256"
			}
		],
		"name": "TaxasRetiradas",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "Unpaused",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "contagemVencedoresPorFaixa",
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
		"inputs": [],
		"name": "paused",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "percentuaisPremioPorFaixa",
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
		"name": "rodadaAtualId",
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
		"name": "rodadas",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "enum BlockchainBetBrasil.StatusRodada",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "ticketPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalArrecadado",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "premioTotal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestampAbertura",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestampFechamento",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestampResultado",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "taxaPlataformaPercentual",
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
		"name": "taxasAcumuladas",
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
		"name": "ticketPriceBase",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];