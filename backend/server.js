const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
//const http = require('http');
const { ErrorHandler, handleError } = require('./helpers/error');

/* var viewsRouter = require('./routes/views'); */
const apiRouter = require('./routes/api');

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' })); // app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true })); // app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb', extended: true })); // app.use(bodyParser.json({}));

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/holamundo', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({
    holamundo: 'hola mundo'
  });
});

app.use('/api', apiRouter);
/* app.use('*', viewsRouter); */

app.get('*', function(req, res, next) {
  //console.log("*")
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

/* app.use('*', (req, res) => {
  res.redirect('/');
}); */

/* ERROR HANDLER MIDDLEWARE */
app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port, () => {
  console.log('Servidor iniciado en el puerto', port);
});
