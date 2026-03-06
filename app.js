// app.js - Configuración principal de Express
const express = require('express');
const cors = require('cors');
const session = require('express-session');

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const librosRoutes = require('./src/routes/libros.routes');
const prestamosRoutes = require('./src/routes/prestamos.routes');

const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permitir peticiones desde el frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5500',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser - Parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'biblioteca-uthh-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Log de peticiones en desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// RUTAS DE LA API
// ============================================

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '📚 API de Biblioteca UTHH - Sistema de Préstamos',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            libros: '/api/libros',
            prestamos: '/api/prestamos'
        },
        documentation: 'https://github.com/tu-repo/biblioteca-uthh-api'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Rutas principales de la API
app.use('/api/auth', authRoutes);
app.use('/api/libros', librosRoutes);
app.use('/api/prestamos', prestamosRoutes);

// ============================================
// MANEJO DE ERRORES 404
// ============================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.path,
        method: req.method
    });
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

app.use((err, req, res, next) => {
    console.error('❌ Error capturado:', err);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            error: err 
        })
    });
});

module.exports = app;