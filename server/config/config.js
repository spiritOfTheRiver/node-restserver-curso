// ===========================
// Puerto
// ===========================
process.env.PORT = process.env.PORT || 3000;


// ===========================
// Entorno
// ===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===========================
// Base de datos
// ===========================

let urlDB;

if ( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB =  process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ===========================
// Vencimiento del token
// ===========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días

process.env.CADUCIDAD_TOKEN =  60 * 60 * 24 * 30;


// ===========================
// SEED autenticación 
// ===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


// ===========================
// Google client ID
// ===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '874568718530-65ls63ct1a76473880encupq8k3vlqot.apps.googleusercontent.com';