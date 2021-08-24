const express = require('express');
const azureLogger = require('./logger');
const yargs = require('yargs');
require('dotenv/config');
const mongoose = require('mongoose');
const postsRoute = require('./routes/persons');
const app = express(); 
const bodyParser = require('body-parser'); 
const statusCode = require('./statusCode');
const LOG_STORAGE_KEY = process.env.LOG_STORAGE_KEY;
const LOG_STORAGE_ACCOUNT_NAME = process.env.LOG_STORAGE_ACCOUNT_NAME;
const LOG_STORAGE_CONTAINER_NAME = process.env.LOG_STORAGE_CONTAINER_NAME;
const jwttoken = require('jsonwebtoken');
const dataFileLoad = require('./common/utility');
const config = require('./config.json');
var _ = require('lodash');
const watch = require('node-watch');
const azureDataRoute = require('./routes/azureDataRoute');

app.use(bodyParser.json());
app.use('/persons', postsRoute);
app.use('/azuredata', azureDataRoute);

app.all(verifyToken, (req, res, next)=>{
  next();
});

config.logger = azureLogger(LOG_STORAGE_KEY, LOG_STORAGE_ACCOUNT_NAME, LOG_STORAGE_CONTAINER_NAME);
app.locals.config = config.logger;

mongoose.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, { useNewUrlParser: true }, (error)=>{
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("The Connection has been sucessfully Established....!!!");
});
});

dataFileLoad(process.env.FILE_APP_PATH, config.logger);
contactFileLoad(process.env.FILE_CONTACT_PATH, config.logger);

watch(process.env.FILE_APP_PATH, { recursive: true }, function(evt, name) {
  console.log('%s file changes and triggered the data insertion to db.', name);
  dataFileLoad(process.env.FILE_APP_PATH, config.logger);
});

app.post('/api/login', (req,res)=>{
   if(!(_.isEmpty(req.body))){
    const user = req.body
    const token = jwttoken.sign({user}, 'my_secret_key', { }, "Stack", { expiresIn : 60});
    res.json({
      token
    });
    config.logger.info('Sucessfully called the method for Login Page');
  } else{
    res.send("Please add body for the POST call");
  }
})

function verifyToken(req,res,next){
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else{
      res.sendStatus(statusCode.FORBIDDEN.status);
  }
}

const argv = yargs.option({
    port: {
      alias: 'p',
      describe: 'Port to run on'
    },
    env: {
      alias: 'e',
      describe: 'Environment',
      choices: ['dev']
    }
  }).argv
  
  const port = argv.port ? argv.port : 3000;
  let env = argv.env || 'dev';

app.listen(port, ()=>{
  config.logger.info(`Environment is ${env} Listening on the Port ${port} `);
  console.log(`Environment is ${env} Listening on the Port ${port} `);
})

 