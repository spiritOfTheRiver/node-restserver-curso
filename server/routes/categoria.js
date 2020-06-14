

const express = require('express');

const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/authorization');

const Categoria = require('../models/categoria');

const app = express();


app.get('/categoria', verificaToken, (req, res)=>{
    const query = {};
    
    Categoria.find(query,'descripcion usuario')
        .sort('descripcion')
        .populate('usuario','nombre email')
        .exec( (err, categorias) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
              }
              res.json({
                ok: true,
                categorias
              });
    } );
});


app.get('/categoria/:id', verificaToken, (req, res)=>{
    const id = req.params.id;

    Categoria.findById(id)
        .populate('usuario','nombre email')
        .exec((err, categoria) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria
        })
        }); 
    
});

app.post('/categoria', verificaToken, (req, res)=>{
    const body = req.body;
    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: res.usuario._id
          
    });
    categoria.save( (err, categoriaBD) => {
        if (err){
          return res.status(400).json({
              ok: false,
              err
          });
        }
        res.json({
            categoriaBD
        });
    });
    
});

app.put('/categoria/:id', verificaToken, (req, res)=>{
    const id = req.params.id;
    const body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new:true, runValidators:true }, (err, categoriaBD) => {
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      res.json({
          ok: true,
          categoria: categoriaBD
      })
    }); 
    
});

app.delete('/categoria/:id', [ verificaToken, verificaAdminRole ], (req, res)=>{
    const id = req.params.id;
    Categoria.findByIdAndRemove(id,(err, categoriaBD)=>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if ( !categoriaBD ){
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }                    
            });
        }
        res.json({
            ok: true,
            usuario: categoriaBD
        });
    });       
});


module.exports = app;