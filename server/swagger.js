const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Node-Oracle Service API',
      version: '1.0.0',
      description: 'API para execução de procedures em um banco Oracle',
    }
  },
  apis: ['./server.js', './routes/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Função que retorna o middleware do Swagger
function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = setupSwagger;