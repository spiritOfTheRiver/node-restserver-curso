

const express = require('express');

const _ = require('underscore');

const { verificaToken } = require('../middlewares/authorization');

const Producto = require('../models/producto');

const app = express();


app.get('/producto', verificaToken, (req, res)=>{
    
    const desde = Number(req.query.desde || 0)  ;
    const limite = Number(req.query.limite || 5)  ;
    const query = { disponible :true };
    
    Producto.find(query)
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('categoria','descripcion')
        .populate('usuario','nombre email')
        .exec( (err, producto) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
              }
              res.json({
                ok: true,
                producto
              });
    } );
});


app.get('/producto/:id', verificaToken, (req, res)=>{
    const id = req.params.id;

    Producto.findById(id)
        .populate('categoria','descripcion')
        .populate('usuario','nombre email')
        .exec((err, producto) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto
        })
        }); 
    
});

app.get('/producto/termino/:termino', verificaToken, (req, res)=>{
    const termino = req.params.termino;
    let regex=new RegExp(termino, 'i');
    const query = { nombre: regex };

    Producto.find(query)
        .populate('categoria','descripcion')
        .populate('usuario','nombre email')
        .exec((err, producto) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto
        })
        }); 
    
});


app.post('/producto', verificaToken, (req, res)=>{
    const body = req.body;
    const categoria = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible, 
        categoria: body.categoria,
        usuario: res.usuario._id          
    });
    categoria.save( (err, productoBD) => {
        if (err){
          return res.status(400).json({
              ok: false,
              err
          });
        }
        res.json({
            productoBD
        });
    });
    
});

app.put('/producto/:id', verificaToken, (req, res)=>{
    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new:true, runValidators:true }, (err, productoBD) => {
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      res.json({
          ok: true,
          categoria: productoBD
      })
    }); 
    
});

app.delete('/producto/:id', verificaToken, (req, res)=>{
    const id = req.params.id;
    Producto.findByIdAndRemove(id,(err, productoBD)=>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if ( !productoBD ){
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }                    
            });
        }
        res.json({
            ok: true,
            usuario: productoBD
        });
    });       
});


module.exports = app;