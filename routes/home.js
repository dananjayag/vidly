const express = require('express');
const Joi=require('joi')
const route = express.Router();

route.get('/',(req,res)=>{
    res.status(200).send("Welcome")
})

module.exports=route;