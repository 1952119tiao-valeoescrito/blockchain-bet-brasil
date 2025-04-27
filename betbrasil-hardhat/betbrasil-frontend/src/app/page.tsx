import { useState } from 'react';
import { ethers } from 'ethers';
import { Grid, Button, Heading, VStack, Text, Box } from "@chakra-ui/react";

// Lista dos 25 animais do Jogo do Bicho
const animais = [
  "Avestruz", "Águia", "Burro", "Borboleta", "Cachorro",
  "Cabra", "Carneiro", "Camelo", "Cobra", "Coelho",
  "Cavalo", "Elefante", "Galo", "Gato", "Jacaré",
  "Leão", "Macaco", "Porco", "Pavão", "Peru",
  "Touro", "Tigre", "Urso", "Veado", "Vaca"
];

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [prognosticosSelecionados, setPrognosticosSelecionados] = useState([]);

  // Conectar MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setConnected(true);
    }
  };

  // Selecionar prognóstico (máx. 5)
  const selecionarPrognostico = (x, y) => {
    const prognostico = `${x}/${y}`;
    if (prognosticosSelecionados.includes(prognostico)) {
      setPrognosticosSelecionados(prognosticosSelecionados.filter(p => p !== prognostico));
    } else if (prognosticosSelecionados.length < 5) {
      setPrognosticosSelecionados([...prognosticosSelecionados, prognostico]);
    }
  };

  // Apostar via Smart Contract
  const apostar = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0x9D586CbA6c856B4979C1D2e5115ecdBAc85184E8", // Endereço do seu contrato
      BetBrasilABI, // Cole a ABI copiada do Remix DIRETAMENTE aqui:
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
]; // ABI do contrato
      signer
    );
    // Envia os prognósticos como array de strings ["1/1", "5/17", ...]
    await contract.apostar(prognosticosSelecionados, { 
      value: ethers.utils.parseEther("0.00033") 
    });
  };

  return (
    <VStack p={8} spacing={8} minH="100vh" bg="gray.50">
      <Heading color="red.500">BETBRASIL 25×25</Heading>
      
      {/* Tabela de Prognósticos */}
      <Text>Selecione 5 prognósticos (1/1 a 25/25):</Text>
      <Grid templateColumns="repeat(25, 1fr)" gap={1} w="full" maxW="1200px" overflow="auto">
        {Array.from({ length: 25 }).map((_, x) => (
          Array.from({ length: 25 }).map((_, y) => {
            const prognostico = `${x+1}/${y+1}`;
            const selecionado = prognosticosSelecionados.includes(prognostico);
            return (
              <Button
                key={prognostico}
                onClick={() => selecionarPrognostico(x+1, y+1)}
                size="sm"
                h="40px"
                colorScheme={selecionado ? "red" : "gray"}
                title={`${animais[x]} + ${animais[y]}`}
              >
                {x+1}/{y+1}
              </Button>
            );
          })
        ))}
      </Grid>

      {/* Prognósticos Selecionados */}
      <Box mt={4}>
        <Text fontWeight="bold">Selecionados:</Text>
        {prognosticosSelecionados.map((p, i) => (
          <Text key={i}>{p} ({animais[parseInt(p.split('/')[0])-1]} + {animais[parseInt(p.split('/')[1])-1]})</Text>
        ))}
      </Box>

      {/* Botões */}
      {!connected ? (
        <Button onClick={connectWallet} colorScheme="blue">
          Conectar MetaMask
        </Button>
      ) : (
        <Button 
          onClick={apostar} 
          colorScheme="red" 
          isDisabled={prognosticosSelecionados.length !== 5}
        >
          Apostar 0.00033 ETH
        </Button>
      )}
    </VStack>
  );
}