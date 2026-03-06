// index.js - Punto de entrada de la aplicación
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\nAPI BIBLIOTECA UTHH - Sistema de Préstamos');
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Base de datos: ${process.env.DB_NAME}\n`);
});