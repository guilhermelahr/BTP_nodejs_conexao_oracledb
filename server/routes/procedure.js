const express = require('express');
const { decryptData } = require('../utils/decryptData');
const { generateOracleConnectionString, executeOracleProcedure } = require('../utils/oracleConnection');

const router = express.Router();

/**
 * @swagger
 * /procedure:
 *   post:
 *     summary: Executa uma procedure no banco Oracle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               encryptedData:
 *                 type: string
 *     responses:
 *       200:
 *         description: Procedure executada com sucesso
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', async (req, res) => {
    
  const { encryptedData } = req.body;
  const timestamp = req.headers['timestamp'];
  const seed = req.headers['seed'];

  if (!encryptedData) {

    console.error('Requisição inválida: Dados criptografados ausentes.');

    return res.status(400).send({
      success: false,
      message: 'Requisição inválida: Conteúdo não encontrado.',
    });

  }

  if (!timestamp) {

    console.error('Requisição inválida: Header timestamp não encontrado.');

    return res.status(400).send({
      success: false,
      message: 'Requisição inválida: Header timestamp não encontrado.',
    });

  }

  if (!seed) {

    console.error('Requisição inválida: Header seed não encontrado.');

    return res.status(400).send({
      success: false,
      message: 'Requisição inválida: Header seed não encontrado.',
    });

  }

  try {


    console.info('Descriptografando dados recebidos');

    const decryptedBody = decryptData(encryptedData, timestamp, seed);
    const parsedBody = JSON.parse(decryptedBody);

    const { dbcon, procedureName, params } = parsedBody;

    console.info(`Iniciando execução da procedure ${procedureName}`);

    const result = await executeOracleProcedure(dbcon, procedureName, params);

    console.info(`Procedure ${procedureName} executada com sucesso`);

    res.status(200).send({ success: true, result });

  } catch (err) {
    console.error(`Erro ao executar procedure: ${err.message}`);
    res.status(500).send({ success: false, message: err.message });
  }
});

module.exports = router;
