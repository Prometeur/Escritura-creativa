const modelo = require("../models/modelTeacher");

const express = require('express');
//constantes para la conexion
const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config.database);
const fs = require('fs')
const modelTeacher = new modelo(pool);


//-------------------------------------------------GROUP------------------------------------------------------------------//

/*Obtiene todos los grupos del profesor*/
function getGroups(req, res) {
    const idTeacher = req.body.idTeacher;
    modelTeacher.getGroups(idTeacher, function (err, result) {
        if (err) {
            if (err.message == "No se puede conectar a la base de datos.") {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            res.status(500).send({ error: err.message });
            console.log(err);
        }
        else if (result == null) {
            res.status(500).send({ error: "El grupo es nulo." });
            console.log("El grupo es nulo");
        }
        else {
            res.status(200);
            res.send(JSON.stringify(result));
        }
    });
}

 /*Mostrar todos los estudiantes que quieren acceder a un grupo*/
 function showGroupRequest(request, response, next) {

    modelTeacher.showGroupRequest(function (err, res) {
        if (err) {
            if (err.message == "No se puede conectar a la base de datos.") {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else if (res == null) {
            response.status(500).send({ error: "No se ha podido invitar el estudiante al grupo." });
            console.log("No se ha podido invitar el estudiante al grupo.");
        }
        else {
            response.status(200);
            response.send(JSON.stringify(res));
        }
    });
}

/*Aceptar una petición de unión a un grupo de un alumno*/
function acceptGroupRequest(request, response, next) {
    let grupo = request.body.id;
    let id = request.body.idEstudiante;
    console.log(grupo,id);
    modelTeacher.acceptGroupRequest(grupo, id, function (err, res) {
        if (err) {
            if (err.message == "No se puede conectar a la base de datos.") {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else if (res == null) {
            response.status(500).send({ error: "No se ha podido invitar el estudiante al grupo." });
            console.log("No se ha podido invitar el estudiante al grupo.");
        }
        else {
            response.status(200);
            response.send(JSON.stringify(res));
        }
    });
}

//Invita a un estudiante a un grupo.
function inviteStudentToGroup(request, response, next) {
    let grupo = request.body.grupo;
    let id = request.body.idEstudiante;

    modelTeacher.inviteStudentToGroup(grupo, id, function (err, res) {
        if (err) {
            if (err.message == "No se puede conectar a la base de datos.") {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else if (res == null) {
            response.status(500).send({ error: "No se ha podido invitar el estudiante al grupo." });
            console.log("No se ha podido invitar el estudiante al grupo.");
        }
        else {
            response.status(200);
            response.send(JSON.stringify(res));
        }
    });
}

//Busca estudiantes según el grupo dado.
function inviteStudentToGroup(request, response, next) {
    const grupo = request.body.grupo;
    const id = request.body.idEstudiante;
    modelTeacher.inviteStudentToGroup(grupo, id, function (err, res) {
        if (err) {
            if (err.message == "No se puede conectar a la base de datos.") {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else if (res == null) {
            response.status(500).send({ error: 'No se ha podido expulsar el estudiante del grupo.' });
            console.log("No se ha podido expulsar el estudiante del grupo.");
        }
        else {
            response.status(200);
            response.send(JSON.stringify(res));
        }

    });
}

//Echa a un estudiante de un grupo.
function kickStudentFromGroup(request, response, next) {
    let grupo = request.body.grupo;
    let id = request.body.idEstudiante;

    modelTeacher.kickStudentFromGroup(grupo, id, function (err, res) {
        if (err) {
            if (err.message == "No se puede conectar a la base de datos.") {
                //next(err);
                console.log("No se puede conectar a la base de datos");
            }
            response.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else if (res == null) {
            response.status(500).send({ error: 'No se ha podido expulsar el estudiante del grupo.' });
            console.log("No se ha podido expulsar el estudiante del grupo.");
        }
        else {
            response.status(200);
            response.send(JSON.stringify(res));
        }

    });
}

//Crea un grupo nuevo.
function createGroup(request, response, next){
    let nombre = request.body.nombre;
    let idTeacher = request.body.idTeacher;

    modelTeacher.createGroup(nombre, idTeacher, function(err, res) {
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
        else if (res == null) 
        {
            response.status(500).send({ error: "No se ha podido crear el grupo." });
            console.log("No se ha podido crear el grupo.");
        } 
        else 
        {
            response.status(200);
           response.send(JSON.stringify(res));
        }
    });

}

//-------------------------------------------------CHALLENGE------------------------------------------------------------------//

/*Obtiene todas las categorias de los desafios*/
function getCategories(req, res) {
    modelTeacher.getCategories(function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

/*Crea desafio del profesor */
function createChallenge(req, res) {
    const idGroup = req.body.idGroup;
    const title = req.body.title;
    const description = req.body.description;
    const type = req.body.type;
    const category = req.body.category;
    const qualification = req.body.qualification;
    const fechaFin = req.body.endDate;
    const date = new Date(fechaFin);
    modelTeacher.createChallenge(idGroup, title, description, qualification, category, type, date, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        // console.log(result.insertId);
        res.status(200).send((result.insertId).toString());
    });
}

/*Edita el desafio del profesor*/
function editChallenge(req, res) {
    const idChallenge = req.body.idChallenge;
    const idGroup = req.body.idGroup;
    const title = req.body.title;
    const description = req.body.description;
    const type = req.body.type;
    const category = req.body.category;
    const qualification = req.body.qualification;
    const fechaFin = req.body.endDate;
    const date = new Date(fechaFin);

    modelTeacher.editChallenge(idChallenge, idGroup, title, description, qualification, category, type, date, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*elimina/desactiva el desafio*/
function deleteChallenge(req, res) {
    const idChallenge = req.body.idChallenge;

    modelTeacher.deleteChallenge(idChallenge, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*Obtiene el desafio del profesor*/
function getChallenge(req, res) {
    const idChallenge = req.query.idChallenge;
    modelTeacher.getChallenge(idChallenge, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*Obtiene los desafios del profesor segun su grupo*/
function getChallenges(req, res) {
    const group = req.query.idGroup;
    modelTeacher.getChallenges(group, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}
//-------------------------------------------------MULTIMEDIA CHALLENGE------------------------------------------------------------------//

/*Envia los ficheros multimedia del desafio del profesor*/
function sendMultimediaChallenge(req, res) {
    const idTeacher = req.body.idTeacher;
    const idChallenge = req.body.idChallenge;
    const reqFiles = [];
    var typeChallenge;
    if (req.query.type == 1) {
        typeChallenge = "users";
    }
    else if (req.query.type == 2) {
        typeChallenge = "teams";
    }
    for (var i = 0; i < req.files.length; i++) {
        var str = req.files[i].mimetype;
        var type = str.split("/");
        const dir = idTeacher + "/" + idChallenge + "/" + type[0] + "/";
        let path = "http://localhost:3001/multimedia/" + typeChallenge + "/" + dir + req.files[i].filename;
        reqFiles.push([idChallenge, path])
    }

    modelTeacher.sendMultimediaChallenge(reqFiles, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*Elimina el fichero multimedia del desafio*/
function deleteFile(req, res) {
    const idMultimedia = req.body.idMultimedia;
    const path = req.body.path;
    // console.log("Eliminando file--------->", idMultimedia);
    var filePath = "public/" + path.replace('http://localhost:3001/', '');
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err)
            return
        }
    });
    modelTeacher.deleteFile(idMultimedia, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*Obtiene los ficheros multimedia del desafio del profesor*/
function getMultimediaChallenge(req, res) {
    const idChallenge = req.query.idChallenge;
    modelTeacher.getMultimediaChallenge(idChallenge, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

//-------------------------------------------------WRITING------------------------------------------------------------------//

/*Obtiene escritos de estudiantes */
function getWritingsStudent(req, res) {
    const idGroup = req.query.idGroup;
    const idChallenge = req.query.idChallenge;

    modelTeacher.getWritingsStudent(idGroup, idChallenge, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*Obtiene escritos colaborativos  de equipos*/
function getWritingsTeam(req, res) {
    const idGroup = req.query.idGroup;
    const idChallenge = req.query.idChallenge;

    modelTeacher.getWritingsTeam(idGroup, idChallenge, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*Obtiene el escrito del estudiante segun su grupo*/
function getWriting(req, res) {
    const idWriting= req.query.idWriting;
  
    modelTeacher.getWriting(idWriting, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*Edita el escrito del estudiante */
function editWriting(req, res) {
    const idWriting = req.body.idWriting;
    const idGroup = req.body.idGroup;
    const idChallenge = req.body.idChallenge;
    const idWriter = req.body.idWriter;
    const title = req.body.title;
    const text = req.body.escrito;
    const score = req.body.score;
    const commentary = req.body.commentary;
    const type = req.body.type;
    const finish = req.body.finish;
    modelTeacher.editWriting(idWriting, idGroup, idChallenge, idWriter, title,text, score,commentary,type,finish, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

//----------------------------------------------MULTIMEDIA WRITING------------------------------------------------------------------//

/*Obtiene los ficheros multimedia del escrito del estudiante*/
function getMultimediaWriting(req, res) {
    const idChallenge = req.query.idChallenge;
    const idWriter = req.query.idWriter;
    modelTeacher.getMultimediaWriting(idChallenge, idWriter, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}
//---------------------------------------------------TEAM---------------------------------------------------------------------//

/*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
function getTeamStudentGroup(req, res) {
    const idStudent = req.query.idStudent;
    const idGroup = req.query.idGroup;
    modelTeacher.getTeamStudentGroup(idStudent, idGroup, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

//Busca estudiantes solicitantes según una clave dada.
function searchApplicant(request, response, next){
    let clave = request.body.clave;
    let tipo = "nombre";
    if(request.body.tipo == "email"){
        tipo = "email";
    }
    
    modelTeacher.searchApplicant(clave, tipo, function(err, studentList) {
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


//-----------------------------------------COLLECTIONS-----------------------------------------//

// Crea una colección
function createCollection(req, res)
{
    const nombreColeccion = req.body.nombreColeccion;
    const idProfesor = req.body.idProfesor;
    const idGrupo = req.body.idGrupo;

    modelTeacher.createCollection(nombreColeccion, idProfesor, idGrupo, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

// Añadir un desafío a una colección
function addChallengeToCollection(req, res)
{
    const idColeccion = req.body.idColeccion;
    const idDesafio = req.body.idDesafio;

    modelTeacher.addChallengeToCollection(idColeccion, idDesafio, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

// Obtiene las colecciones de un profesor, pudiendo filtrar por nombre de grupo o nombre de colección
function getCollections(req, res)
{
    const idProfesor = req.query.idProfesor;
    const filtroBusqueda = req.query.filtroBusqueda;

    modelTeacher.getCollections(idProfesor, filtroBusqueda, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

// Obtiene una colección
function getCollection(req, res)
{
    const idCollection = req.query.idCollection;

    modelTeacher.getCollection(idCollection, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

// Obtiene los desafíos de una colección
function getChallengesFromCollection(req, res)
{
    const idCollection = req.query.idCollection;

    modelTeacher.getChallengesFromCollection(idCollection, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

// Obtiene los desafíos que no están en una determinada colección
function getChallengesNotInCollection(req, res)
{
    const idGroup = req.query.idGroup;
    const idCollection = req.query.idCollection;

    modelTeacher.getChallengesNotInCollection(idGroup, idCollection, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

// Elimina un desafío de una colección
function deleteChallengeFromCollection(req, res)
{
    const idCollection = req.body.idCollection;
    const idChallenge = req.body.idChallenge;

    modelTeacher.deleteChallengeFromCollection(idCollection, idChallenge, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}

// Elimina una colección
function deleteCollection(req, res)
{
    const idCollection = req.body.idCollection;

    modelTeacher.deleteCollection(idCollection, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}



module.exports = {
    getGroups: getGroups,
    getChallenges: getChallenges,
    getChallenge: getChallenge,
    createChallenge: createChallenge,
    getCategories: getCategories,
    getTeamStudentGroup: getTeamStudentGroup,
    getWritingsStudent: getWritingsStudent,
    getWritingsTeam: getWritingsTeam,
    editWriting: editWriting,
    editChallenge: editChallenge,
    getMultimediaChallenge: getMultimediaChallenge,
    sendMultimediaChallenge: sendMultimediaChallenge,
    deleteFile: deleteFile,
    getWriting: getWriting,
    inviteStudentToGroup: inviteStudentToGroup,
    deleteChallenge: deleteChallenge,
    kickStudentFromGroup: kickStudentFromGroup,
    getMultimediaWriting: getMultimediaWriting,
    searchApplicant:searchApplicant,
    acceptApplicant:acceptApplicant,
    createGroup:createGroup,
    acceptGroupRequest: acceptGroupRequest,
    showGroupRequest: showGroupRequest,
    createCollection: createCollection,
    addChallengeToCollection: addChallengeToCollection,
    getCollections: getCollections,
    getCollection: getCollection,
    getChallengesFromCollection: getChallengesFromCollection,
    getChallengesNotInCollection: getChallengesNotInCollection,
    deleteChallengeFromCollection: deleteChallengeFromCollection,
    deleteCollection:deleteCollection,

};
