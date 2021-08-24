const express = require('express');
const router = express.Router();
const Person = require('../model/Person');
const statusCode = require('../statusCode');
const jwttoken = require('jsonwebtoken');

router.get('/', verifyToken , async (req, res)=>{
    try{
        const persons = await Person.find();
        res.json(persons);
    } catch (err){
        res.json({message:err});
    }
});
 
router.post('/', verifyToken, async (req,res)=>{
    console.log(req.body);
        if(req.body){
            try {
                const person = new Person({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    gender: req.body.gender,
                    address: req.body.address
                });
                try{
                    const savedPost = await person.save();
                        res.json(savedPost);
                    } catch(err){
                        res.json({ message:err });
                };    
            } catch (error) {
                console.log(`The request body is ${req.body}`);
          }
        }
    }); 

router.get('/:id', verifyToken ,async (req, res)=>{
    try {
        const person = await Person.findById(req.params.id);
        res.json(person);    
    } catch (err) {
        res.json({ message: err });    
    }
})

router.delete('/:id', verifyToken , async (req, res)=>{
    try {
        const deletePerson = await Person.findByIdAndRemove(req.params.id);
        console.log(req.params.id);
        res.send('Success');
    } catch (err) {
        res.json({ message: err });    
    }
})

router.patch('/:id', verifyToken , async (req, res)=>{
    try {
        const updatePerson = await Person.updateOne(
            { _id: req.params.id },
            { $set: {       
                firstname : req.body.firstname , 
                lastname : req.body.lastname, 
                email : req.body.email , 
                gender : req.body.gender,
                address: req.body.address 
            }
        }
        );
        res.json(updatePerson);    
    } catch (err) {
        res.json({ message: err });    
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

module.exports = router;