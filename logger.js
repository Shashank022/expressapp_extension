var winston = require("winston");
var azureBlobTransport = require("winston3-azureblob-transport");
const { format } = require('winston');
const { combine, timestamp, label, printf } = format;


const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });

  const  azureLogger = (storageKey, storageAccount,containerName)=>{
    try{
      return winston.createLogger({
        format: combine(
            label({ label: 'LOGGER' }),
            timestamp(),
            myFormat
          ),
      transports: [
        new winston.transports.Console(),
        new (azureBlobTransport)({
        account: {
            name: storageAccount,
            key: storageKey
            },
          containerName: containerName,
          blobName: "app_log",
          bufferLogSize : 1,
          syncTimeout : 0,
          rotatePeriod : "YYYY-MM-DD",
          eol : "\n"
        })
      ]
    });
    }catch(error){
      console.log(error);
  }
}

module.exports = azureLogger;