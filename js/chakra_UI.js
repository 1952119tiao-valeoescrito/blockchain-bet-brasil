// pages/index.js
import { useState } from 'react';
import { ChakraProvider, Button, Heading, Box, Grid, Input } from '@chakra-ui/react';
import { login, registrar, apostar } from '../services/api';

export default function Home() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async () => {
    const token = await login(email, senha);
    if (token) setLoggedIn(true);
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading>BetBrasil 🎲</Heading>
        
        {!loggedIn ? (
          <Box>
            <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
            <Button onClick={handleLogin}>Entrar</Button>
          </Box>
        ) : (
          <ApostasScreen />
        )}
      </Box>
    </ChakraProvider>
  );
}