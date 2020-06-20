
const express = require('express');

const fs = require('fs');

const path = require('path');

const { verificaTokenImg } = require('../middlewares/authorization');

const app = express();


app.get('/imagen/:tipo/:img', [ verificaTokenImg ], function (req, res) {
    
    const tipo = req.params.tipo;
    const img = req.params.img;
    
    let pathImagen =  path.resolve( __dirname, `../../uploads/${ tipo }/${ img }`);
    
    if( !fs.existsSync(pathImagen) ){
        pathImagen =  path.resolve( __dirname, `../assets/original.jpg`);
    }   
    res.sendFile(pathImagen);

})


module.exports = app;