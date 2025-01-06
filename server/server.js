const express = require('express');
const bodyParser = require('body-parser');
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');
const passport = require('passport');
const setupSwagger = require('./swagger');
const healthRoutes = require('./routes/health');
const procedureRoutes = require('./routes/procedure');
const errorHandler = require('./middleware/errorHandler');

xsenv.loadEnv();

const app = express();

app.use(express.json({ limit: '10mb' }));

// Security configuration
passport.use('JWT', new xssec.JWTStrategy(xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

// Rotas
app.use('/health', healthRoutes);
app.use('/procedure', procedureRoutes);

// Swagger
setupSwagger(app);

// Middleware para capturar rotas inválidas
app.use((req, res) => {
  console.error(`Rota inválida: ${req.originalUrl}`);
  res.status(404).send({
    success: false,
    message: `Invalid route: ${req.originalUrl}. Valid routes are /api-docs, /health and /procedure.`,
  });
});

// Middleware de erro centralizado
app.use(errorHandler);

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`App is running on port ${port}`);
});
