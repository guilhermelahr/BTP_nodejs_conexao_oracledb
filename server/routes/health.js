const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica o estado do serviço
 *     responses:
 *       200:
 *         description: Serviço está rodando
 */
router.get('/', (req, res) => {
  console.info('Healthcheck solicitado');
  res.status(200).send({ status: 'OK', message: 'Service is running' });
});

module.exports = router;
