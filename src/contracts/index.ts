// src/contracts/index.ts - CORRIGIDO

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
    // ... todo o resto do seu ABI aqui no meio ...
    // ...
    // ...
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
] as const; // ✅ CORREÇÃO APLICADA: O "as const" vem para o final do array do ABI.

// O endereço fica como estava, sem o "as const".
export const BlockchainBetBrasilAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";