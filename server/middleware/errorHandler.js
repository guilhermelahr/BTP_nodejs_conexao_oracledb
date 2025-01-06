module.exports = (err, req, res, next) => {
    console.error(`Erro não tratado: ${err.message}`);
    res.status(500).send({ success: false, message: 'Internal server error' });
  };
  