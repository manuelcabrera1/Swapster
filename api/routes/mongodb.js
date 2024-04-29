var express =require("express");
var router =express.Router();


var mongodb=require("mongodb");
const uri = `mongodb+srv://admin:root1234@cluster-iw.miy9lgu.mongodb.net/Swapster`;

const client = new mongodb.MongoClient(uri);

client.connect((err)=>{
    if(err){
        console.log("No hemos podido conectar con Mongodb");
        return;
    }
    console.log("Conectados a mongodb");
});

const db= client.db();

const users =db.collection("Usuarios");
const products = db.collection("Productos")


router.get("/",async (req, res)=>{
    try{
        var result=await post.findOne({'_id':req.query.id});
        if(result){
            res.send(result);
        }else{
            res.status(400).send("Document not found");
        }
    }catch(error){
        console.log(error);
        res.status(400).json({error:error.message});
    }
});


module.exports= router;