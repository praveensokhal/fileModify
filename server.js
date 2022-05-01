const express = require('express')
const bodyParser = require('body-parser')
const Routers = require('./routers')

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limits: "100mb" }));
app.use(bodyParser.json({limits:true}))
app.use('/api',Routers)
const port = 3000;
 app.listen(port,(
     ()=>{
         console.log(`your server running at port ${port} `)
     }
 ))
