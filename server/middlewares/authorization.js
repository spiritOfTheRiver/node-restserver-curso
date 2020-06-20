const jwt = require('jsonwebtoken');

//========================
// Verificar Token
//========================

let verificaToken = ( req, res, next ) => {
    let token = req.get('Authorization');
    jwt.verify( token, process.env.SEED , (err, decoded) => {
        if (err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        res.usuario = decoded.usuario;
        next();
    });    
};

//========================
// Verificar AminRol
//========================

let verificaAdminRole = ( req, res, next ) => {
    if (res.usuario.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Rol no valido'
            }
        });
    }
    next();    
};

//========================
// Verifica token Img
//========================
let verificaTokenImg = ( req, res, next ) => {
     
    let token = req.query.token;
    jwt.verify( token, process.env.SEED , (err, decoded) => {
        if (err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        res.usuario = decoded.usuario;
        next();
    });   

};


module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}