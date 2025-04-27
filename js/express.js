// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database'); // Conexão MySQL

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.post('/registrar', registrarUsuario);
app.post('/login', loginUsuario);
app.post('/apostar', verificarToken, fazerAposta);
app.get('/rodadas', listarRodadas);
app.get('/minhas-apostas', verificarToken, listarApostasUsuario);

app.listen(3001, () => console.log('Backend rodando na porta 3001!'));