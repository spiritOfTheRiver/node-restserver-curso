
const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();


app.get('/usuario', function (req, res) {
    const desde = Number(req.query.desde || 0)  ;
    const limite = Number(req.query.limite || 5)  ;
    const query = { estado :true };
    
    Usuario.find(query,'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
              }
              Usuario.count(query, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                  });
              });
        } );

})
  
  app.post('/usuario', function (req, res) {

    const body = req.body;
      const usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
      });

      usuario.save( (err, usuarioDB) => {
          if (err){
            return res.status(400).json({
                ok: false,
                err
            });
          }
          res.json({
            usuarioDB
          });
      });
  })
  
  app.put('/usuario/:id', function (req, res) {
      const id = req.params.id;
      const body = _.pick(req.body, ['nombre','email','img','role','estado']);

      Usuario.findByIdAndUpdate(id, body, { new:true, runValidators:true }, (err, usuarioDB) => {
        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
      });      
  })
  
  app.delete('/usuario/permanente/:id', function (req, res) {
        const id = req.params.id;
        Usuario.findByIdAndRemove(id,(err, usuarioDB)=>{
            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if ( !usuarioDB ){
                res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }                    
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        });       
  })

  app.delete('/usuario/:id', function (req, res) {
    const id = req.params.id;
    const body = { 
        estado: false
    };

    Usuario.findByIdAndUpdate(id, body, { new:true, runValidators:true }, (err, usuarioDB) => {
      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }
      if ( !usuarioDB ){
        res.status(404).json({
            ok: false,
            err: {
                message: 'Usuario no encontrado'
            }                    
        });
    }
      res.json({
          ok: true,
          usuario: usuarioDB
      })
    });      
})

  module.exports = app;