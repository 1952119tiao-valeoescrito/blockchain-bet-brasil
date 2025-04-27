const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Libera acesso do frontend (Next.js)
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Importa as rotas
const apostasRouter = require('./routes/apostas');
app.use('/api', apostasRouter);

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});