const mongoose = require ('mongoose');
const express = require ('express');
const Joi = require('joi');
const route = express.Router();
const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold :{
        type : Boolean,
        required :true,
        default : false
    },
    name : {
        type:String,
        required :true,
        minlength :2,
        maxlength :255,
        set : function (v){
           return v.trim();
        }
    },
    phone : {
        type : String,
        required : true,
        minlength : 5 ,
        maxlength : 20
    }

}))

const CustomerJoiScheema = {
    isGold : Joi.boolean(),
    name : Joi.string().min(2).max(255).required(),
    phone : Joi.string().min(5).max(20).required()
}

route.get('/',async (req,res)=>{
     try {
        let customers = await Customer.find();
        if(!customers){
            res.status(404).send("Customers Not Found")
            return;
        }
        else{
             res.status(200).send(customers)
        }
     }
     catch(err) {
        res.status(404).send({"message":err.message})
     }
      

})

route.get('/:id', async (req,res) => {
    try{
        let customer = await Customer.findById(req.params.id);
        if(!customer){
            res.status(404).send("Customer Not Found")
            return;
        }
        else{
            res.status(200).send(customer)
        }
    }
    catch (err){
        res.status(404).send({"message":err.message})
    }
     
})

route.post('/', async (req, res) => {
      const {error} = Joi.validate(req.body,CustomerJoiScheema)
        if(error){
            let errorMessage = {
              name :error.name,
              message : error.details[0] &&  error.details[0].message
            }
            res.status(400).send(errorMessage);
        }
        else{
            
            let customer = new Customer(req.body);
            try {
                 customer = await customer.save();
                 res.status(200).send(customer)
            }
            catch(err){
                res.status(404).send({message : err.message})
            }
        
        }
})
route.put('/:id', async (req, res) => {
    const {error} = Joi.validate(req.body,CustomerJoiScheema)
      if(error){
          let errorMessage = {
            name :error.name,
            message : error.details[0] &&  error.details[0].message
          }
          res.status(400).send(errorMessage);
      }
      else{
          
          try {
               let customer = await Customer.findByIdAndUpdate(req.params.id,req.body,{new : true})
               res.status(201).send(customer)
          }
          catch(err){
              res.status(404).send({message : err.message})
          }
      
      }
})

route.delete('/:id', async(req,res) =>{
    try{
        let customer = await  Customer.findByIdAndRemove(req.params.id)
        if(customer){
            res.status(200).send('Deleted')
        }
    }
    catch(err){
        res.status(404).send({message : err.message})
    }

})

module.exports = route;