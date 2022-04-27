const modelo = require("../models/modelUser");
const express = require('express');//voy a usar el modulo express
const router = express.Router();

//constantes para la conexion
const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config.database);


const modelUser = new modelo(pool);

 /*Obtiene todos los grupos del profesor*/
 function getGroups(req, res) {
    
    let grupo = req.query.idEstudiante;
    if (grupo != null) {
        
        
        modelUser.getGroups(grupo, function(err, result) {
            if(err) 
            {
                if (err.message == "No se puede conectar a la base de datos.") 
                {
                    //next(err);
                    console.log("No se puede conectar a la base de datos");
                }
                res.status(500).send({ error: err.message });
                console.log(err.message);
            } 
            else if (result == null) 
            {
                res.status(500).send({ error: "El grupo es nulo" });
                console.log("El grupo es nulo");
            } 
            else
            {
                res.status(200);
               res.send(JSON.stringify(result));
            }
        });
    }
    else 
    {
        res.status(500);
        console.log("El id es nulo");
    }
}

/*Obtiene todos los grupos del profesor*/
function getStudentGroups(req, res) {
    
    let grupo = req.query.idEstudiante;
    
    if (grupo != null) {
        modelUser.getStudentGroups(grupo, function(err, result) {
            if(err) 
            {
                if (err.message == "No se puede conectar a la base de datos.") 
                {
                    //next(err);
                    console.log("No se puede conectar a la base de datos");
                }
                res.status(500).send({ error: err.message });
                console.log(err.message);
            } 
            else if (result == null) 
            {
                res.status(500).send({ error: "El conjunto de grupos es nulo" });
                console.log("El consjunto de grupos es nulo");
            } 
            else
            {
                res.status(200);
               res.send(JSON.stringify(result));
            }
        });
    }
    else 
    {
        res.status(500);
        console.log("El id es nulo");
    }
}

 /*Obtiene todos los grupos que hay*/
 function getAllGroups(req, res) {
    
    modelUser.getAllGroups(function(err, result) {
        if(err) 
        {
            if (err.message == "No se puede conectar a la base de datos.") 
            {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            res.status(500).send({ error: err.message });
            console.log(err.message);
        } 
        else
        {
            res.status(200);
           res.send(JSON.stringify(result));
        }
    });

}


//Busca estudiantes según una clave dada.
function searchStudent(request, response, next){
    let clave ="";
    let tipo = "nombre";

    if(request.body.tipo == "email"){
        tipo = "email";
    }
    
    modelUser.searchStudent(clave, tipo, function(err, studentList) {
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
        else if (studentList == null) 
        {
            response.status(500).send({ error: "No hay estudiantes con esos parámetros" });
            console.log("No hay estudiantes con los parámetros escogidos.");
        } 
        else 
        {
            response.status(200);
            response.send(JSON.stringify(studentList));
        }
    });

}

//Busca usuarios según una clave dada.
function searchUsers(request, response, next){
    let clave = request.body.clave;
    let tipo = "nombre";
    if(request.body.tipo == "email"){
        tipo = "email";
    }
    
    modelUser.searchUsers(clave, tipo, function(err, studentList) {
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
        else if (studentList == null) 
        {
            response.status(500).send({ error: "No hay usuarios con los parámetros escogidos" });
            console.log("No hay usuarios con los parámetros escogidos.");
        } 
        else 
        {
            response.status(200);
            response.send(JSON.stringify(studentList));
        }
    });

}

//Busca estudiantes solicitantes según una clave dada.
function searchApplicant(request, response, next){
    
    let clave = request.body.clave;
    let tipo = "nombre";
   
    if(request.body.tipo == "email"){
        tipo = "email";
    }
    
    modelUser.searchApplicant(clave, tipo, function(err, studentList) {
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
        else if (studentList == null) 
        {
            response.status(500).send({ error: "No hay estudiantes solicitantes con los parámetros escogidos." });
            console.log("No hay estudiantes solicitantes con los parámetros escogidos.");
        } 
        else 
        {
            response.status(200);
           response.send(JSON.stringify(studentList));
        }
    });

}

//Acepta al estudiante solicitante dado cambiando su campo activo.
function acceptApplicant(request, response, next){
   
    let id = request.query.idUser;

    modelUser.acceptApplicant(id, function(err, res) {
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

//Busca estudiantes según el grupo dado.
function searchStudentOfGroup(request, response, next){
    
    let grupo = request.body.grupo;

    modelUser.getStudentOfGroup(grupo, function(err, studentList) {
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
        else if (studentList == null) 
        {
            response.status(500).send({ error: "No hay estudiantes con los parámetros escogidos." });
            console.log("No hay estudiantes con los parámetros escogidos.");
        } 
        else 
        {
            response.status(200);
           response.send(JSON.stringify(studentList));
        }
    });

}

//Busca equipos según el grupo dado.
function getTeamsOfGroup(request, response, next){
    
    let grupo = request.body.grupo;

    modelUser.getTeamsOfGroup(grupo, function(err, studentList) {
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
        else if (studentList == null) 
        {
            response.status(500).send({ error: "No hay equipos con los parámetros escogidos." });
            console.log("No hay equipos con los parámetros escogidos.");
        } 
        else 
        {
            response.status(200);
           response.send(JSON.stringify(studentList));
        }
    });

}

 /*Obtiene el perfil del usuario en cuestión*/
 function getProfile(req, res) {
    
    let idUser = req.query.idUser;
    
    if (idUser != null) {
        modelUser.getProfile(idUser, function(err, result) {
            if(err) 
            {
                if (err.message == "No se puede conectar a la base de datos.") 
                {
                    //next(err);
                    console.log("No se puede conectar a la base de datos");
                }
                res.status(500).send({ error: err.message });
                console.log(err.message);
            } 
            else if (result == null) 
            {
                res.status(500).send({ error: "El usuairo no existe" });
                console.log("El usuario no existe");
            } 
            else
            {
                res.status(200);
               res.send(JSON.stringify(result[0]));
            }
        });
    }
    else 
    {
        res.status(500);
        console.log("El id es nulo");
    }
}

/*Obtiene los datos del grupo escogido*/
function getGroupData(req, res) {
    
    let id = req.query.idGroup;
    if (id != null) {
        modelUser.getGroupData(id, function(err, result) {
            if(err) 
            {
                if (err.message == "No se puede conectar a la base de datos.") 
                {
                    //next(err);
                    console.log("No se puede conectar a la base de datos");
                }
                res.status(500).send({ error: err.message });
                console.log(err.message);
            } 
            else if (result == null) 
            {
                res.status(500).send({ error: "El grupo no existe" });
                console.log("El grupo no existe");
            } 
            else
            {
                res.status(200);
               res.send(JSON.stringify(result[0]));
            }
        });
    }
    else 
    {
        res.status(500);
        console.log("El id es nulo");
    }
}

//Desactiva el desafío cambiando su campo activo.
function deleteChallenge(request, response, next){
    let id = request.query.id;

    
    modelUser.deleteChallenge(id, function(err, res) {
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

//Busca escritos no colaborativos según el id estudiante dado.
function getScriptsByStudent(request, response, next){
    
    let id = request.query.id;

    modelUser.getScriptsByStudent(id, function(err, scriptList) {
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
        else if (scriptList == null) 
        {
            response.status(500).send({ error: "No hay escritos disponibles" });
            console.log("No escritos disponibles.");
        } 
        else 
        {
            response.status(200);
           response.send(JSON.stringify(scriptList));
        }
    });

}

//Busca escritos no colaborativos según el id estudiante dado.
function getScriptsByTeam(request, response, next){
    
    let id = request.query.id;

    modelUser.getScriptsByTeam(id, function(err, scriptList) {
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
        else if (scriptList == null) 
        {
            response.status(500).send({ error: "No hay escritos disponibles" });
            console.log("No escritos disponibles.");
        } 
        else 
        {
            response.status(200);
           response.send(JSON.stringify(scriptList));
        }
    });

}

 /*Obtiene el perfil del equipo en cuestión*/
 function getTeam(req, res) {
    
    let idTeam = req.query.idTeam;
    
    if (idTeam != null) {
        modelUser.getTeam(idTeam, function(err, result) {
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
            else if (result == null) 
            {
                response.status(500).send({ error: "El usuario no existe" });
                console.log("El usuario no existe");
            } 
            else
            {
                res.status(200);
               res.send(JSON.stringify(result[0]));
            }
        });
    }
    else 
    {
        res.status(500);
        console.log("El id es nulo");
    }
}



module.exports = {
    getGroups:getGroups,
    getStudentGroups:getStudentGroups,
    getAllGroups:getAllGroups,
    searchStudent:searchStudent,
    searchUsers:searchUsers,
    searchApplicant:searchApplicant,
    searchStudentOfGroup:searchStudentOfGroup,
    getTeamsOfGroup:getTeamsOfGroup,
    getProfile:getProfile,
    getGroupData:getGroupData,
    acceptApplicant:acceptApplicant,
    deleteChallenge:deleteChallenge,
    getScriptsByStudent:getScriptsByStudent,
    getScriptsByTeam:getScriptsByTeam,
    getTeam:getTeam
 
};