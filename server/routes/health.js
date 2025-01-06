const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Checks the service status
 *     responses:
 *       200:
 *         description: Service is running
 */
router.get('/', (req, res) => {
  console.info('Healthcheck requested');
  res.status(200).send({ status: 'OK', message: 'Service is running' });
});

module.exports = router;
