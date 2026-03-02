"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const utilisateurRoutes_js_1 = __importDefault(require("./routes/utilisateurRoutes.js"));
const salleRoutes_js_1 = __importDefault(require("./routes/salleRoutes.js"));
const reservationRoutes_js_1 = __importDefault(require("./routes/reservationRoutes.js"));
const notationRoutes_js_1 = __importDefault(require("./routes/notationRoutes.js"));
const commentaireRoutes_js_1 = __importDefault(require("./routes/commentaireRoutes.js"));
const swagger_js_1 = require("./config/swagger.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/utilisateurs', utilisateurRoutes_js_1.default);
app.use('/api/salles', salleRoutes_js_1.default);
app.use('/api/reservations', reservationRoutes_js_1.default);
app.use('/api/notations', notationRoutes_js_1.default);
app.use('/api/commentaires', commentaireRoutes_js_1.default);
app.use('/api-docs', swagger_js_1.swaggerUi.serve, swagger_js_1.swaggerUi.setup(swagger_js_1.specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Party Hoster - Documentation'
}));
const __dirname = path_1.default.resolve();
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.removeHeader('Cross-Origin-Opener-Policy');
        res.removeHeader('Cross-Origin-Embedder-Policy');
        res.removeHeader('Cross-Origin-Resource-Policy');
        const ext = path_1.default.extname(filePath);
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase())) {
            res.setHeader('Content-Type', `image/${ext.slice(1)}`);
        }
    }
}));
app.get('/health', (_req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'API Réservations de Salles'
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Une erreur interne est survenue',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Documentation API: http://localhost:${PORT}/api-docs`);
});
//# sourceMappingURL=server.js.map