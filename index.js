const express=require('express');
const bodyParser =require('body-parser')
const genres = require('./routes/genres')
const home = require('./routes/home')
const customerRoutes = require('./routes/customers')
const app =express();
app.use(bodyParser.json())
app.use('/',home);
app.use('/api/genres',genres);
app.use('/api/customers',customerRoutes)
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("Server Started")
})