// src/constants/constants.ts

// O endereço REAL do seu contrato implantado na blockchain.
export const CONTRACT_ADDRESS = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";

// O ABI completo do seu contrato, que você já pegou do Remix.
export const CONTRACT_ABI = [
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
			}
		],
		"name": "ApostasFechadas",
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
				"internalType": "uint256[5]",
				"name": "prognosticosX",
				"type": "uint256[5]"
			},
			{
				"indexed": false,
				"internalType": "uint256[5]",
				"name": "prognosticosY",
				"type": "uint256[5]"
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
				"indexed": false,
				"internalType": "uint256",
				"name": "valor",
				"type": "uint256"
			}
		],
		"name": "PoteAcumuladoParaPlataforma",
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
				"internalType": "uint256",
				"name": "valor",
				"type": "uint256"
			}
		],
		"name": "PremioReivindicado",
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
				"name": "premioTotalDistribuido",
				"type": "uint256"
			}
		],
		"name": "PremiosCalculados",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rodadaId",
				"type": "uint256"
			}
		],
		"name": "fecharApostas",
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
			}
		],
		"name": "getApostasDaRodada",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "jogador",
						"type": "address"
					},
					{
						"internalType": "uint256[5]",
						"name": "prognosticosX",
						"type": "uint256[5]"
					},
					{
						"internalType": "uint256[5]",
						"name": "prognosticosY",
						"type": "uint256[5]"
					}
				],
				"internalType": "struct BlockchainBetBrasil.Aposta[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
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
				"internalType": "address",
				"name": "_jogador",
				"type": "address"
			}
		],
		"name": "getPremioParaReivindicar",
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
				"name": "_rodadaId",
				"type": "uint256"
			}
		],
		"name": "getRodadaInfo",
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
				"internalType": "uint256[5]",
				"name": "resultadosX",
				"type": "uint256[5]"
			},
			{
				"internalType": "uint256[5]",
				"name": "resultadosY",
				"type": "uint256[5]"
			},
			{
				"internalType": "uint256[5]",
				"name": "contagemVencedoresPorFaixa",
				"type": "uint256[5]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getStatusRodadaAtual",
		"outputs": [
			{
				"internalType": "enum BlockchainBetBrasil.StatusRodada",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
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
		"name": "pausar",
		"outputs": [],
		"stateMutability": "nonpayable",
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
	}
];