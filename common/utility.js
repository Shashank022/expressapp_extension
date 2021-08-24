const parse = require('csv-parser');
const fs = require('fs');
const AzureData = require('../model/AzureData');
const Person = require('../model/Person');
const Contact = require('../model/Contact');
const statusCode = require('../statusCode');

dataLoadFromFile = (filePath, logger)=>{
    let modelInstance=''; 
    try {
      fs.createReadStream(filePath)
      .pipe(parse({delimiter: ','}))
      .on('data',  async function(csvrow) {
        if(filePath === "data.csv"){
          modelInstance = setPerson(csvrow);
          try{
            await modelInstance.save();
            logger.info(" Record is being saved on MLAB");
          } catch(err){
            logger.info(" Record couldn't be saved on MLAB");
          }
        } else{
          modelInstance = setAzureData(csvrow);
          try{
            await modelInstance.save();
            logger.info(" Record is being saved on MLAB");
          } catch(err){
            logger.info(" Record couldn't be saved on MLAB");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

contactFileLoad = (filePath, logger)=>{
  let modelInstance='';
  try {
    fs.createReadStream(filePath)
        .pipe(parse({delimiter: ','}))
        .on('data',  async function(csvrow) {
          if(filePath === "contacts.csv"){
            try{
              modelInstance = setContact(csvrow);
              await modelInstance.save();
              logger.info(" Contact CSV Record is being saved on MLAB");
            } catch(err){
              logger.info(" Contact CSV Record couldn't be saved on MLAB");
            }
          }
        });
  } catch (error) {
    console.log(error);
  }
};
const setContact=(csvrow)=>{
  return  new Contact({
    name: csvrow.name,
    givenname: csvrow.givenname,
    familyname: csvrow.familyname,
    phone1type: csvrow.phone1type,
    phone1value: csvrow.phone1value
  });
}

  const setPerson=(csvrow)=>{
    return  new Person({
      firstname: csvrow.firstname,
      lastname: csvrow.lastname,
      email: csvrow.email,
      gender: csvrow.gender,
      address: csvrow.address
    });
  }

  const setAzureData=(csvrow)=>{
    return  new AzureData({
      SubscriptionName : csvrow.SubscriptionName,
      SubscriptionGuid: csvrow.SubscriptionGuid,
      Date: csvrow.Date,
      ResourceGuid: csvrow.ResourceGuid,
      ServiceName: csvrow.ServiceName,
      ServiceType: csvrow.ServiceType,
      ServiceRegion: csvrow.ServiceRegion,
      ServiceResource: csvrow.ServiceResource,
      Quantity:csvrow.Quantity,
      Cost: csvrow.Cost
    });
  }

  module.exports = dataLoadFromFile;