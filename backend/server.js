const express = require('express');
/* const cors = require('cors'); */
const app = express();

/* var corsOptions = {
    origin: 'http://localhost:5000/api/holamundo/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}; */


//app.use(cors(corsOptions));

app.listen(5000, () => {
    console.log('Servidor iniciado!')
});

app.route('/api/holamundo').get((req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.send({
        holamundo: 'aaaa'
    })
});




