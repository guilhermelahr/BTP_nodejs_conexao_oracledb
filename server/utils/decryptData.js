const crypto = require('crypto');
const { DateTime } = require('luxon');

function decryptData(encryptedData, timestamp, ivBase64) {

  console.info('Starting decryption process');

  const sharedPassword = process.env.PASS;

  if (!sharedPassword) {
    console.error("The environment variable 'PASS' is not defined.");
    throw new Error("The environment variable 'PASS' is not defined.");
  }

  const salt1 = Buffer.from([142, 67, 58, 199, 73, 24, 123, 187, 214, 52, 134, 28, 84, 63, 198, 110, 167]);
  const timestampDecryption = DateTime.fromFormat(timestamp, 'yyyy/MM/dd HH:mm:ss', { zone: 'America/Mexico_City' })
    .toFormat('yyyyMMddHHmmss');

  const salt2 = Buffer.from(timestampDecryption, "utf8");
  const salt = Buffer.concat([salt1, salt2]);

  const passwordBuffer = Buffer.concat([Buffer.from(sharedPassword, "utf8"), salt]);
  const key = crypto.createHash("sha256").update(passwordBuffer).digest();
  const iv = Buffer.from(ivBase64, "base64");
  const encryptedBuffer = Buffer.from(encryptedData, "base64");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decryptedData = decipher.update(encryptedBuffer, "binary", "utf8");
  decryptedData += decipher.final("utf8");

  console.info('Decryption process completed successfully');

  return decryptedData;

}

module.exports = { decryptData };
