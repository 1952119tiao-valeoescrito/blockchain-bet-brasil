// src/contracts/index.ts - A NOSSA ÚNICA E DEFINITIVA FONTE DA VERDADE

// 1. O ENDEREÇO DO SEU CONTRATO NA REDE DE TESTE SEPOLIA
//    Confirme se este é o endereço mais recente do seu deploy!
export const BlockchainBetBrasilAddress = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B';

// 2. A ABI MAIS COMPLETA E ATUALIZADA DO SEU CONTRATO
export const BlockchainBetBrasilABI = [
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
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
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
				"indexed": false,
				"internalType": "uint256[5]",
				"name": "milhares",
				"type": "uint256[5]"
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
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "MilharesRegistradosEProcessados",
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
				"name": "valorDoPoteNaoReivindicado",
				"type": "uint256"
			}
		],
		"name": "NenhumVencedorNaRodada",
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
				"name": "apostaIndex",
				"type": "uint256"
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
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
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
				"name": "numeroDeVencedores",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "premioPorVencedor",
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
		"name": "checarSePremioFoiReivindicado",
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
			},
			{
				"internalType": "uint256",
				"name": "_startIndex",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_pageSize",
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
					},
					{
						"internalType": "uint256",
						"name": "valorPago",
						"type": "uint256"
					}
				],
				"internalType": "struct BlockChainBetBrasil.Aposta[]",
				"name": "apostasPaginadas",
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
		"name": "getRodadaInfoBasica",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "enum BlockChainBetBrasil.StatusRodada",
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
				"name": "numApostas",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "numeroDeVencedores",
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
		"name": "getRodadaResultados",
		"outputs": [
			{
				"internalType": "uint256[5]",
				"name": "milharesSorteados",
				"type": "uint256[5]"
			},
			{
				"internalType": "bool",
				"name": "milharesForamInseridos",
				"type": "bool"
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
		"name": "getRodadaTimestamps",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestampAbertura",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestampFechamentoApostas",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestampResultadosProcessados",
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
				"name": "_ticketPrice",
				"type": "uint256"
			}
		],
		"name": "iniciarNovaRodada",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isRoundOpen",
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
				"name": "_rodadaId",
				"type": "uint256"
			},
			{
				"internalType": "uint256[5]",
				"name": "_milhares",
				"type": "uint256[5]"
			}
		],
		"name": "registrarResultadosDaFederalEProcessar",
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
				"internalType": "enum BlockChainBetBrasil.StatusRodada",
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
				"internalType": "bool",
				"name": "milharesForamInseridos",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "numeroDeVencedores",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestampAbertura",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestampFechamentoApostas",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestampResultadosProcessados",
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
				"name": "_novaTaxaPercentual",
				"type": "uint256"
			}
		],
		"name": "setTaxaPlataforma",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_novoPreco",
				"type": "uint256"
			}
		],
		"name": "setTicketPriceBase",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rodadaIdParaContexto",
				"type": "uint256"
			},
			{
				"internalType": "uint256[5]",
				"name": "_milhares",
				"type": "uint256[5]"
			}
		],
		"name": "simularConversaoMilhares",
		"outputs": [
			{
				"internalType": "uint256[5]",
				"name": "resultadosX",
				"type": "uint256[5]"
			},
			{
				"internalType": "uint256[5]",
				"name": "resultadosY",
				"type": "uint256[5]"
			}
		],
		"stateMutability": "pure",
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