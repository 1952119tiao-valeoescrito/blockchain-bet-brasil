<Box mt={4}>
  <Text fontWeight="bold">Selecionados:</Text>
  {prognosticosSelecionados.map((p, i) => {
    const [x, y] = p.split('/').map(Number);
    return (
      <Text key={i}>
        {p} <span style={{ color: 'gray' }}>({animais[x-1]} + {animais[y-1]})</span>
      </Text>
    );
  })}
</Box>