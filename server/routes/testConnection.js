const express = require('express');
const { generateOracleConnectionString, testOracleConnection } = require('../utils/oracleConnection');

const router = express.Router();

/**
 * @swagger
 * /testConnection:
 *   post:
 *     summary: Tests the connection to an Oracle database
 *     parameters:
 *       - in: header
 *         name: uri
 *         required: true
 *         schema:
 *           type: string
 *           description: Connection string in the format `host:port/servicename` (e.g., `localhost:1521/XE`).
 *           example: "localhost:1521/XE"
 *       - in: header
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *           description: The username for the Oracle database.
 *           example: "admin"
 *       - in: header
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *           format: password
 *           description: The password for the Oracle database. This is sensitive information.
 *     responses:
 *       200:
 *         description: Connection test executed successfully
 *       400:
 *         description: Invalid request. The 'uri', 'username', and 'password' headers are required.
 *       500:
 *         description: Internal server error. Failed to connect to Oracle database.
 */
router.post('/', async (req, res) => {
    
  const uri = req.headers['uri'];
  const username = req.headers['username'];
  const password = req.headers['password'];

  if (!uri) {
    console.error('Invalid request: uri header not found.');
    return res.status(400).send({
      success: false,
      message: 'Invalid request: URI header not found.',
    });
  }

  if (!username) {
    console.error('Invalid request: username header not found.');
    return res.status(400).send({
      success: false,
      message: 'Invalid request: username header not found.',
    });
  }

  if (!password) {
    console.error('Invalid request: password header not found.');
    return res.status(400).send({
      success: false,
      message: 'Invalid request: password header not found.',
    });
  }

  try {
    console.info(`Starting connection test.`);

    const result = await testOracleConnection({
      uri,
      username,
      pass: password
    });

    console.info(`Connection test executed successfully`);
    res.status(200).send({ success: true, result });

  } catch (err) {
    console.error(`Error while connecting to Oracle: ${err.message}`);
    res.status(500).send({ success: false, message: err.message });
  }
});

module.exports = router;
