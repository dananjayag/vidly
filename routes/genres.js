const express = require('express');
const Joi=require('joi')
const route = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly',()=>{
    console.log("mongoDb Connected")
})
const genreMongoSchema = new mongoose.Schema({
     name:{
         type:String,
         required:true,
         minlength:2,
         maxlength :255
     }
})
const Genre = mongoose.model ('Genre', genreMongoSchema)

const genreSchema={
    id:Joi.number().min(1),
    name:Joi.string().min(3).max(20).required(),
}

function reqValidator(requestBody,schema){
    return   Joi.validate(requestBody,schema)
}

route.get('/',async (req,res)=>{
    const genreList = await Genre.find()
    res.status(200).send(genreList)
})
route.post('/',async (req,res)=>{
    const {error} =reqValidator(req.body,genreSchema)
   
     if(error) {
         let errorObj={
           name:error.name,
           message :error.details[0] &&  error.details[0].message
         }
        return res.status(400).send(errorObj)
     }
    let genre = new Genre({
        name:req.body.name
    })
    try{
        const savedGenre = await genre.save()
        res.status(200).send(savedGenre)
       
    }
    catch(err){
        let errorObj={
            name:error.name,
            message :error.details[0] &&  error.details[0].message
          }
         return res.status(400).send(err.message)
    }
  
})
route.put('/:id',async (req,res)=>{
    const {error} = reqValidator(req.body,genreSchema)
                        if(error) {
                            let errorObj={
                            name:error.name,
                            message :error.details[0] &&  error.details[0].message
                            }
                            return res.status(400).send(errorObj)
                        }
                        else{
                            try {
                                let genre = await Genre.findByIdAndUpdate(req.params.id,req.body,{new:true})
                                if(!genre) {
                                    let errorObj={
                                        name:`Not Exist Error`,
                                        message :`Requested Genre doesn't Exist`
                                    }
                                    res.status(404).send(errorObj)
                                }
                                 else {
                                      res.status(200).send(genre)
                                    }
                                }
                            catch (err) {
                                let errorObj={
                                    name:`Not Exist Error`,
                                    message :err.message
                                }
                                res.status(404).send(errorObj)
                            }
                           
                        }
          
        })

route.delete('/:id',async (req,res)=>{
    try{
        let genre= await Genre.findByIdAndRemove(req.params.id); 
        if(!genre){
            let errorObj={
                name:`Not Exist Error`,
                message :`Requested Genre doesn't Exist`
              }
              res.status(404).send(errorObj)
              return;
        }
        else{
             
            res.status(200).send(genre)
        }
    }
    catch (err) {
        let errorObj={
            name:`Not Exist Error`,
            message :err
          }
          res.status(404).send(errorObj)
          return;
    }
    
})

route.get('/:id',async (req,res)=>{
    try{
        debugger
        let genre =await  Genre.findById(req.params.id)
        if(!genre){
            let errorObj={
                name:`Not Exist Error`,
                message :err
              }
              res.status(404).send(errorObj)
              return;
        }
        else{
            res.status(200).send(genre)
        }
    }
    catch(err){
        let errorObj={
            name:`Not Exist Error`,
            message :err
          }
          res.status(404).send(errorObj)
          return;
    }

})

module.exports=route;