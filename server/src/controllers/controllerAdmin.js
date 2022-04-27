const modelo = require("../models/modelAdmin");
const express = require('express');//voy a usar el modulo express
const router = express.Router();



//importar la conexion
//const pool = require('../db/database');

//constantes para la conexion
const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config.database);
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());


const modelAdmin = new modelo(pool);

//Pone el campo activo de un usuario a falso.
function deactivateUser(request, response, next){
    let id = request.body.idUser;
    modelAdmin.deactivateUser(id, function(err, res) {
        if(err) 
        {
            if (err.message == "No se puede conectar a la base de datos.") 
            {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else 
        {
            response.status(200);
           response.send(JSON.stringify(res));
        }
    });

}

//Pone el campo activo de un usuario a falso.
function deleteUser(request, response, next){
    let id = request.body.idUser;
    modelAdmin.deleteUser(id, function(err, res) {
        if(err) 
        {
            if (err.message == "No se puede conectar a la base de datos.") 
            {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else 
        {
            response.status(200);
           response.send(JSON.stringify(res));
        }
    });

}

//Cambia el nobre de un grupo.
function renameGroup(request, response, next){
    let id = request.body.id;
    let name = request.body.name;
    modelAdmin.renameGroup(id, name, function(err, res) {
        if(err) 
        {
            if (err.message == "No se puede conectar a la base de datos.") 
            {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else 
        {
            response.status(200);
           response.send(JSON.stringify(res));
        }
    });

}

//Desactiva un grupo.
function deactivateGroup(request, response, next){
    let id = request.body.id;
    modelAdmin.deactivateGroup(id, function(err, res) {
        if(err) 
        {
            if (err.message == "No se puede conectar a la base de datos.") 
            {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else 
        {
            response.status(200);
           response.send(JSON.stringify(res));
        }
    });

}



module.exports = {
    deactivateUser:deactivateUser,
    deleteUser:deleteUser,
    renameGroup:renameGroup,
    deactivateGroup:deactivateGroup
 
};