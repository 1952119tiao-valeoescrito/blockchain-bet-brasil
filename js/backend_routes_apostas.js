const express = require('express');
const router = express.Router();

router.post('/apostar', (req, res) => {
  const { numeros } = req.body;
  // (Aqui você salva no banco de dados ou smart contract)
  res.json({ message: 'Aposta recebida!', numeros });
});

module.exports = router;