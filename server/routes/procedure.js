const express = require('express');
const { decryptData } = require('../utils/decryptData');
const { generateOracleConnectionString, executeOracleProcedure } = require('../utils/oracleConnection');

const router = express.Router();

/**
 * @swagger
 * /procedure:
 *   post:
 *     summary: Executes a procedure in the Oracle database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               encryptedData:
 *                 type: string
 *                 description: |
 *                   Encrypted data containing the connection details and procedure parameters.
 *                   The data should be encrypted and include the following payload:
 *                   ```json
 *                   {
 *                     "dbcon": {
 *                       "uri": "host:port/servicename", 
 *                       "username": "username",
 *                       "pass": "password"
 *                     },
 *                     "procedureName": "\"SCHEMA\".\"PROCEDURE\"",
 *                     "params": {
 *                       "p_param_1": "Param",
 *                       "p_param_2": "Param"
 *                     }
 *                   }
 *                   ```
 *     parameters:
 *       - in: header
 *         name: timestamp
 *         required: true
 *         schema:
 *           type: string
 *           description: Timestamp of the request in the format `yyyy/MM/dd HH:mm:ss` (e.g., 2025/01/05 11:36:08).
 *           example: 2025/01/05 11:36:08
 *       - in: header
 *         name: seed
 *         required: true
 *         schema:
 *           type: string
 *           description: A seed value used for encryption.
 *           example: "seed_value_here"
 *     responses:
 *       200:
 *         description: Procedure executed successfully
 *       400:
 *         description: Invalid request. The 'timestamp' and 'seed' headers are required, and 'encryptedData' must be provided in an encrypted format.
 *       500:
 *         description: Internal server error
 */
router.post('/', async (req, res) => {
    
  const { encryptedData } = req.body;
  const timestamp = req.headers['timestamp'];
  const seed = req.headers['seed'];

  if (!encryptedData) {

    console.error('Invalid request: Encrypted data missing.');

    return res.status(400).send({
      success: false,
      message: 'Invalid request: Content not found.',
    });

  }

  if (!timestamp) {

    console.error('Invalid request: Timestamp header not found.');

    return res.status(400).send({
      success: false,
      message: 'Invalid request: Timestamp header not found.',
    });

  }

  if (!seed) {

    console.error('Invalid request: Seed header not found.');

    return res.status(400).send({
      success: false,
      message: 'Invalid request: Seed header not found.',
    });

  }

  try {

    console.info('Decrypting received data');

    const decryptedBody = decryptData(encryptedData, timestamp, seed);
    const parsedBody = JSON.parse(decryptedBody);

    const { dbcon, procedureName, params } = parsedBody;

    console.info(`Starting execution of procedure ${procedureName}`);

    const result = await executeOracleProcedure(dbcon, procedureName, params);

    console.info(`Procedure ${procedureName} executed successfully`);

    res.status(200).send({ success: true, result });

  } catch (err) {
    console.error(`Error executing procedure: ${err.message}`);
    res.status(500).send({ success: false, message: err.message });
  }
});

module.exports = router;
