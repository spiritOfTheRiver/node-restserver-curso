
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'No files were uploaded.'
                    }                    
                });
    }

    //Validar tipo
    const tipoValid = [ 'productos', 'usuarios'];
    if ( tipoValid.indexOf( tipo ) < 0 ){
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tipoValid.join(', ')
            }                    
        });
    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const archivo = req.files.archivo;
    const nc = archivo.name.split('.');
    const ext = nc[ nc.length - 1 ];

    const extValid = [ 'png', 'jpg', 'gif', 'jpeg'];

    if ( extValid.indexOf( ext ) < 0 ){
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'Extenciones permitidas son' + extValid.join(', ')
            }                    
        });
    }
    
    // Cambiar nombre de archivo
    const nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${ext}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err                  
            });
        }
        //Imagen cargada
        imagenModel(id, res, nombreArchivo, tipo, tipo === tipoValid[0]? Producto: Usuario);
    });
});

function imagenModel(id, res, nombreArchivo, tipo, Model){
    Model.findById(id, (err, modelDB) => {
        if (err){
            borraArchivo(nombreArchivo,tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!modelDB) {
            borraArchivo(nombreArchivo,tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe' 
                } 
            });
        }

        borraArchivo(modelDB.img,tipo);

        modelDB.img=nombreArchivo;
        console.log(modelDB);

        modelDB.save((err,modelSv) => {
            if (err){
                borraArchivo(nombreArchivo,tipo);
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                model: modelSv,
                img: nombreArchivo
            })
        });
      });
}

function borraArchivo( nombreArchivo, tipo ){
    const pathImagen =  path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);
    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;