const modelo = require("../models/modelLogin");

const express = require('express');//voy a usar el modulo express
const router =express.Router();

//importar la conexion
const pool = require('../db/database');

const modelLogin = new modelo(pool);

function getUser(req,res){
    const usuario = req.query.nombre;
    const password = req.query.password;
   modelLogin.getUser(usuario,password,function(err,result){
    if (err) {
        res.status(500).send({ error: err.message });
    }
    else{
        res.send(result);
    }
    
   });
}

module.exports = {
    getUser:getUser,
  
};