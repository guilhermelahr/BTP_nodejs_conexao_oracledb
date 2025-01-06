const oracledb = require('oracledb');

function generateOracleConnectionString(simpleUri) {

  console.info(`Gerando string de conexão Oracle para URI: ${simpleUri}`);

  const [hostPort, serviceName] = simpleUri.split('/');
  const [host, port] = hostPort.split(':');
  return `(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=${port})(host=${host}))(connect_data=(service_name=${serviceName}))(security=(ssl_server_dn_match=yes)))`;

}

async function executeOracleProcedure(dbcon, procedureName, params) {

  const connectString = generateOracleConnectionString(dbcon.uri);

  console.info(`Conectando ao banco Oracle: ${connectString}`);

  const connection = await oracledb.getConnection({
    connectString: connectString,
    user: dbcon.username,
    password: dbcon.pass,
  });

  const bindParams = {};

  for (let key in params) {
    bindParams[key] = { dir: oracledb.BIND_IN, val: params[key] };
  }

  console.info(`Executando procedure ${procedureName}`);

  const result = await connection.execute(
    `BEGIN ${procedureName}(${Object.keys(params).map(param => ':' + param).join(', ')}); END;`,
    bindParams,
  );

  await connection.close();
  console.info('Conexão Oracle encerrada com sucesso');
  return result;
  
}

module.exports = { generateOracleConnectionString, executeOracleProcedure };
