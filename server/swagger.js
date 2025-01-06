const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const express = require('express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Oracle Service API',
      version: '1.0.0',
      description: 'API for executing commands in an Oracle database',
    }
  },
  apis: ['./server.js', './routes/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Function that returns the Swagger middleware
function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

module.exports = setupSwagger;
