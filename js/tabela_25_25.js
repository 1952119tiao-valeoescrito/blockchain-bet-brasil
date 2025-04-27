// Adicione isso ao seu código
<Grid templateColumns="repeat(5, 1fr)" gap={2} mt={8}>
  {Array.from({ length: 25 }).map((_, i) => (
    <Button key={i}>{i+1}</Button>
  ))}
</Grid>