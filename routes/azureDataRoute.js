const express = require('express');
const router = express.Router();
const azure = require('../model/AzureData');

router.get('/', async (req, res)=>{
    try{
        const azureDat = await azure.find();
        res.json(azureDat);
    } catch (err){
        res.json({message:err});
    }
});

module.exports = router;