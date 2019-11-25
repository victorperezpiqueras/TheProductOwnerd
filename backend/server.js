const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
var app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/holamundo', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({
    holamundo: 'hola mundo'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log('Servidor iniciado en el puerto', port);
});
