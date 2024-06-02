var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
const uri= process.env.DB_URI ? process.env.DB_URI : 'mongodb+srv://admin:root1234@cluster-iw.miy9lgu.mongodb.net/Swapster' 

mongoose.connect(uri)
.then(()=>{
    console.log("Conectado a mongodb con mongoose");
})
.catch((error)=>{
    console.log("Error al conectar a mongodb");
});


module.exports=router;