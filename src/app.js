const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use('*', (req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

module.exports = app;