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
      "0x123...", // Endereço do seu contrato
      BetBrasilABI, // ABI do contrato
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