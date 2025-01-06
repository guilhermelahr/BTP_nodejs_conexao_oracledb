const oracledb = require('oracledb');

function generateOracleConnectionString(simpleUri) {

  console.info(`Generating Oracle connection string for URI: ${simpleUri}`);

  const [hostPort, serviceName] = simpleUri.split('/');
  const [host, port] = hostPort.split(':');
  return `(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=${port})(host=${host}))(connect_data=(service_name=${serviceName}))(security=(ssl_server_dn_match=yes)))`;

}

async function executeOracleProcedure(dbcon, procedureName, params) {

  const connectString = generateOracleConnectionString(dbcon.uri);

  console.info(`Connecting to Oracle database: ${connectString}`);

  const connection = await oracledb.getConnection({
    connectString: connectString,
    user: dbcon.username,
    password: dbcon.pass,
  });

  const bindParams = {};

  for (let key in params) {
    bindParams[key] = { dir: oracledb.BIND_IN, val: params[key] };
  }

  console.info(`Executing procedure ${procedureName}`);

  const result = await connection.execute(
    `BEGIN ${procedureName}(${Object.keys(params).map(param => ':' + param).join(', ')}); END;`,
    bindParams,
  );

  await connection.close();
  console.info('Oracle connection closed successfully');
  return result;
  
}

async function testOracleConnection(dbcon) {

  const connectString = generateOracleConnectionString(dbcon.uri);

  console.info(`Connecting to Oracle database: ${connectString}`);

  const connection = await oracledb.getConnection({
    connectString: connectString,
    user: dbcon.username,
    password: dbcon.pass,
  });

  await connection.close();

  console.info('Oracle connection closed successfully');
  return result;
  
}

module.exports = { generateOracleConnectionString, executeOracleProcedure, testOracleConnection };
