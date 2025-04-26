// components/ApostasScreen.js
export default function ApostasScreen() {
  const [palpites, setPalpites] = useState([]);
  const [rodadaAtual, setRodadaAtual] = useState(null);

  const selecionarNumero = (num) => {
    if (palpites.includes(num)) {
      setPalpites(palpites.filter(n => n !== num));
    } else if (palpites.length < 5) {
      setPalpites([...palpites, num]);
    }
  };

  return (
    <Box>
      <Heading>Faça sua aposta (5 números)</Heading>
      <Grid templateColumns="repeat(5, 1fr)" gap={2}>
        {Array.from({ length: 25 }).map((_, i) => (
          <Button key={i} onClick={() => selecionarNumero(i)}>
            {i+1}
          </Button>
        ))}
      </Grid>
      <Button onClick={() => apostar(palpites)} disabled={palpites.length !== 5}>
        Apostar 0.00033 ETH
      </Button>
    </Box>
  );
}