const modelo = require("../models/modelStudent");
const fs = require('fs');

//importar la conexion
const mysql = require("mysql");
const config = require('../db/config');
const pool = mysql.createPool(config.database);
const modelStudent = new modelo(pool);

//-----------------------------------------------------GROUPS---------------------------------------------------------------//
/*Obtiene los grupos del estudiante*/
function getGroups(req, res) {
    const student = req.body.idStudent;

    modelStudent.getGroups(student, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(JSON.stringify(result));
        }

    });
}

//Pide al profesor ser invitado a un grupo
function getRemainingGroups(req, res) {
    const idStudent = req.query.idStudent;
    // console.log("Id student:" + req.query.idStudent);

    modelStudent.getRemainingGroups(idStudent, function (err, result)  {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/* Mandar a un profesor una petición de unión a un grupo */
function sendGroupRequest(req, res)
{
    const idGroup = req.body.idGroup;
    const idStudent = req.body.idStudent;

    modelStudent.sendGroupRequest(idGroup, idStudent, function (err, result)  {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

//-----------------------------------------------------CHALLENGES---------------------------------------------------------------//

/*Obtiene el desafio del estudiante segun su grupo*/
function getChallenge(req, res) {
    const idChallenge = req.query.idChallenge;
    modelStudent.getChallenge(idChallenge, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene los desafios del estudiante segun su grupo*/
function getChallenges(req, res) {
    const idGroup = req.query.idGroup;
    const type = req.query.type;
    modelStudent.getChallenges(idGroup, type, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene los desafios del estudiante (sin tener en cuenta el grupo del estudiante)*/
function getChallengesIndividual(req, res) {
    const idStudent = req.query.idStudent;
    const type = req.query.type;
    modelStudent.getChallengesIndividual(idStudent, type, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

//-----------------------------------------------------MULTIMEDIA CHALLENGES---------------------------------------------------------------//

/*Obtiene los ficheros multimedia del desafio*/
function getMultimediaChallenge(req, res) {
    const idChallenge = req.query.idChallenge;
    modelStudent.getMultimediaChallenge(idChallenge, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

//-----------------------------------------------------WRITINGS---------------------------------------------------------------//

/*Envio el escrito del estudiante */
function createWriting(req, res) {
    const idGroup = req.body.idGroup;
    const desafio = req.body.idChallenge;
    const idWriter = req.body.idWriter;
    const title = req.body.title;
    const texto = req.body.escrito;
    const type = req.body.type;
    modelStudent.createWriting(idGroup, desafio, idWriter, title, texto, type, function (err, result) {
        if (err) {
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}


/*Obtiene el escrito del estudiante segun su grupo*/
function getWriting(req, res) {
    const idWriting = req.query.idWriting;

    modelStudent.getWriting(idWriting, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene todas las versiones de un mismo escrito del estudiante segun su grupo*/
function getVersionsfromWriting(req, res)
{
    const idWriting = req.query.idWriting;

    modelStudent.getVersionsfromWriting(idWriting, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/* Devuelve la última versión de un escrito, es decir, el mayor id */
function getHighestidVersionfromWriting(req, res)
{
    const idWriting = req.query.idWriting;

    modelStudent.getHighestidVersionfromWriting(idWriting, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });

}

/*Obtiene todos los escritos individuales activos del estudiante*/
function getWritings(req, res) {
    const idStudent = req.query.idStudent;

    modelStudent.getWritings(idStudent, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene todos los escritos colaborativos activos del equipo del estudiante*/
function getWritingsCollaborative(req, res) {
    const idStudent = req.query.idStudent;
    console.log("",idStudent);
    modelStudent.getWritingsCollaborative(idStudent, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene el escrito del estudiante */
function getWritingWriter(req, res) {
    const idGroup = req.query.idGroup;
    const idChallenge = req.query.idChallenge;
    const idWriter = req.query.idWriter;

    modelStudent.getWritingWriter(idGroup, idChallenge, idWriter, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene los escritos del equipo*/
function getWritingsTeam(req, res) {
    const idTeam = req.query.idTeam;
    const idGroup = req.query.idGroup;
    modelStudent.getWritingsTeam(idTeam, idGroup, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/* Obtiene todas las versiones de un escrito colaborativo */
function getVersionsfromWritingTeam(req, res)
{
    const idWriting = req.query.idWriting;
    //console.log("ID ESCRITO: " + idWriting);

    modelStudent.getVersionsfromWritingTeam(idWriting, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene los escritos del estudiante de un grupo*/
function getWritingsStudent(req, res) {
    const idStudent = req.query.idStudent;
    const idGroup = req.query.idGroup;
    modelStudent.getWritingsStudent(idStudent, idGroup, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene escritos de estudiantes */
function getWritingsStudentCollection(req, res) {
    const idGroup = req.query.idGroup;
    const idChallenge = req.query.idChallenge;

    modelStudent.getWritingsStudentCollection(idGroup, idChallenge, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        res.send(result);
    });
}

/*Obtiene escritos colaborativos  de equipos*/
function getWritingsTeamCollection(req, res) {
    const idGroup = req.query.idGroup;
    const idChallenge = req.query.idChallenge;

    modelStudent.getWritingsTeamCollection(idGroup, idChallenge, function (err, result) {
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
    const type = req.body.type;
    modelStudent.editWriting(idWriting, idGroup, idChallenge, idWriter, title, text, type, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Añado una nueva versión de un escrito */
function insertVersionfromWriting(req, res) {
    const idWriting = req.body.idWriting;
    const idVersion = req.body.idVersion;
    const idChallenge = req.body.idChallenge;
    const idWriter = req.body.idWriter;
    const title = req.body.title;
    const texto = req.body.text;
    const type = req.body.type;

    modelStudent.insertVersionfromWriting(idWriting, idVersion, idChallenge, idWriter, title, texto, type, function (err, result) {
        if (err) {
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/* Obtiene el último escrito, es decir, el máximo id de escrito */
function getHighestidWriting(req, res) {
    
    modelStudent.getHighestidWriting(function (err, result) {
        if (err) {
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}


/*Edita el escrito del estudiante */
function editWritingTeam(req, res) {
    const idWriting = req.body.idWriting;
    const idGroup = req.body.idGroup;
    const idChallenge = req.body.idChallenge;
    const idWriter = req.body.idWriter;
    const title = req.body.title;
    const text = req.body.escrito;
    const log = req.body.log;
    const type = req.body.type;
    modelStudent.editWritingTeam(idWriting, idGroup, idChallenge, idWriter, title, text, log, type, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}


//-----------------------------------------------------MULTIMEDIA WRITINGS---------------------------------------------------------------//

/*Obtiene los ficheros multimedia del escrito del estudiante*/
function getMultimediaWriting(req, res) {
    const idChallenge = req.query.idChallenge;
    const idWriter = req.query.idWriter;
    // const idVersion = req.query.idVersion;

    modelStudent.getMultimedia(idChallenge, idWriter/*, idVersion*/, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}


/*Envia los ficheros multimedia del escrito del estudiante*/
function sendMultimedia(req, res) {
    const idWriter = req.body.idWriter;
    const idChallenge = req.body.idChallenge;
    // const idVersion = req.body.idVersion;
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
        //dir->idWriter/idChallenge/tipo/
        const dir = idWriter + "/" + idChallenge +/* "/"+ idVersion + */"/" + type[0] + "/";
        // let path = "http://localhost:3001/multimedia/" + typeChallenge +"/"+ dir + req.files[i].filename;
        let path = "http://" + req.headers.host + "/multimedia/" + typeChallenge + "/" + dir + req.files[i].filename;
        reqFiles.push([idWriter, idChallenge/*, idVersion*/, path])
    }
    modelStudent.sendMultimedia(reqFiles, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
}


/*Elimina  fichero multimedia del escrito*/
function deleteFile(req, res) {
    const idMultimedia = req.body.idMultimedia;
    const path = req.body.path;
    // console.log("Eliminando file--------->", idMultimedia);

    //'http://localhost:3001/' es remplazado por vacio ''

    // var filePath = "public/" + path.replace('http://localhost:3001/', '');
    var filePath = "public/" + path.replace('http://' + req.headers.host + "/", '');
    fs.unlink(filePath, (err) => {
        if (err) {
            res.status(500).send({ error: err.message });
            console.error(err)
            return
        }
    });
    modelStudent.deleteFile(idMultimedia, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

//-----------------------------------------------------TEAMS---------------------------------------------------------------//

/*Envio el mensaje*/
function createTeam(req, res) {
    const idCreator = req.body.idCreator;
    const idGroup = req.body.idGroup;
    const teamName = req.body.teamName;
    modelStudent.createTeam(idCreator, idGroup, teamName, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        // res.send(result);
        // res.status(200).send("todo perfecto");
        else {
            res.status(200).send((result.insertId).toString());
        }

    });
}

/*Obtiene el equipo del remitente/emisor*/
function getTeam(req, res) {
    const idTeam = req.query.idTeam;
    modelStudent.getTeam(idTeam, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}
/*Obtiene los equipos del estudiante*/
function getTeams(req, res) {
    const idStudent = req.query.idStudent;

    modelStudent.getTeams(idStudent, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene los equipos del grupo*/
function getTeamsGroup(req, res) {
    const idGroup = req.query.idGroup;
    modelStudent.getTeamsGroup(idGroup, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
function getTeamStudentGroup(req, res) {
    const idStudent = req.query.idStudent;
    const idGroup = req.query.idGroup;
    modelStudent.getTeamStudentGroup(idStudent, idGroup, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene la tabla entera de equipoestudiante*/
function getTeamStudent(req, res) {
    modelStudent.getTeamStudent(function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene los estudiantes sin equipo de un grupo */
function getStudentWithoutTeam(req, res) {
    const idGroup = req.query.idGroup;
    modelStudent.getStudentWithoutTeam(idGroup, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
        // console.log("------>", result[0].id);
        // res.status(200).send({

        //     id: result[0].idEstudiante,
        //     nombre: result[0].nombre,
        //     apellidos: result[0].apellidos,
        //     idGrupo: result[0].idGrupo
        //   });
    });
}

/*Obtiene los integrantes de un equipo */
function getMembersTeam(req, res) {
    const idTeam = req.query.idTeam;
    modelStudent.getMembersTeam(idTeam, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Edita Equipo*/
function editTeam(req, res) {
    const idTeam = req.body.idTeam;
    const name = req.body.name;
    const idCreator = req.body.idCreator;
    const idGroup = req.body.idGroup;

    modelStudent.editTeam(idTeam, name, idCreator, idGroup, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        // res.send(result);
        // res.status(200).send("todo perfecto");
        else {
            res.status(200).send("Successful");
        }
    });
}


/*Edita Equipo*/
function deleteTeam(req, res) {
    const idTeam = req.body.idTeam;
    modelStudent.deleteTeam(idTeam, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        // res.send(result);
        // res.status(200).send("todo perfecto");
        else {
            res.status(200).send("Successful");
        }
    });
}

/*Agrega estudiante a un equipo*/
function addStudentTeam(req, res) {
    const idTeam = req.body.idTeam;
    const idStudent = req.body.idStudent;

    modelStudent.addStudentTeam(idTeam, idStudent, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.status(200).send("Success");
        }
    });
}

/*estudiante se une a un equipo*/
function joinTeam(req, res) {
    const idTeam = req.query.idTeam;
    const idStudent = req.query.idStudent;
    modelStudent.joinTeam(idTeam, idStudent, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send("todo correcto");
        }
    });
}

/*Elimina estudiante de un equipo*/
function leaveStudentTeam(req, res) {
    const idTeam = req.body.idTeam;
    const idStudent = req.body.idStudent;
    modelStudent.leaveStudentTeam(idTeam, idStudent, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.status(200).send("Success");
        }
    });
}

//-----------------------------------------------------MESSAGES---------------------------------------------------------------//
/*Obtiene el mensaje del estudiante*/
function getMessage(req, res) {
    const idMessage = req.query.idMessage;
    modelStudent.getMessage(idMessage, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}


/*Obtiene mensajes del estudiante*/
function getMessages(req, res) {
    const idStudent = req.query.idStudent;
    modelStudent.getMessages(idStudent, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*Obtiene el mensaje del estudiante*/
function searchMessageByIssuer(req, res) {
    const idGroup = req.query.idGroup;
    const idIssuer = req.query.idIssuer;
    const idCreatorTeam = req.query.idCreatorTeam;
    modelStudent.searchMessageByIssuer(idGroup, idIssuer, idCreatorTeam, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}

/*busca mensaje del estudiante por receptor*/
function searchMessageByReceiver(req, res) {
    const idGroup = req.query.idGroup;
    const idReceiver = req.query.idReceiver;
    const idCreatorTeam = req.query.idCreatorTeam;
    modelStudent.searchMessageByReceiver(idGroup, idReceiver, idCreatorTeam, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}



/*Edita el tipo de mensaje*/
function editMessage(req, res) {
    const idMessage = req.body.idMessage;
    modelStudent.editMessage(idMessage, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.status(200).send("todo perfecto");
        }
    });
}

/*elimina/desactiva el mensaje*/
function deleteMessage(req, res) {
    const idMessage = req.body.idMessage;
    modelStudent.deleteMessage(idMessage, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.send(result);
        }
    });
}


/*Envio el mensaje*/
function sendMessage(req, res) {
    const idGroup = req.body.idGroup;
    const idSender = req.body.idSender;
    const idReceiver = req.body.idReceiver;
    const idCreator = req.body.idCreator;
    const message = req.body.message;
    const type = req.body.type;
    modelStudent.sendMessage(idGroup, idSender, idReceiver, idCreator, message, type, function (err, result) {
        if (err) {
            res.status(500).send({ error: err.message });
            console.log(err.message);
        }
        else {
            res.status(200).send("Success");
        }
    });
}

//-----------------------------------------COLLECTIONS-----------------------------------------//

// Obtiene las colecciones de un profesor, pudiendo filtrar por nombre de grupo o nombre de colección
function getCollections(req, res)
{
    const idEstudiante = req.query.idEstudiante;
    const filtroBusqueda = req.query.filtroBusqueda;
    console.log(idEstudiante);
    modelStudent.getCollections(idEstudiante, filtroBusqueda, function (err, result) {
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

    modelStudent.getCollection(idCollection, function (err, result) {
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

    modelStudent.getChallengesFromCollection(idCollection, function (err, result) {
        if (err) {
            console.log(err.message);
            res.status(500).send({ error: err.message });
        }
        res.send(result);
    });
}




module.exports = {
    //Groups
    getGroups: getGroups,
    getRemainingGroups: getRemainingGroups,
    sendGroupRequest: sendGroupRequest,
    //Challenges
    getChallenge: getChallenge,
    getChallenges: getChallenges,
    getChallengesIndividual: getChallengesIndividual,
    //MultimediaChallenge
    getMultimediaChallenge: getMultimediaChallenge,
    //Writings
    createWriting: createWriting,
    getWriting: getWriting,
    getVersionsfromWriting: getVersionsfromWriting,
    getHighestidVersionfromWriting: getHighestidVersionfromWriting,
    getWritings: getWritings,
    editWriting: editWriting,
    insertVersionfromWriting: insertVersionfromWriting,
    getHighestidWriting: getHighestidWriting,
    editWritingTeam: editWritingTeam,
    getWritingsCollaborative: getWritingsCollaborative,
    getWritingWriter: getWritingWriter,
    getWritingsTeam: getWritingsTeam,
    getVersionsfromWritingTeam: getVersionsfromWritingTeam,
    getWritingsStudent: getWritingsStudent,
    getWritingsStudentCollection: getWritingsStudentCollection,
    getWritingsTeamCollection: getWritingsTeamCollection,
    //MultimediaWritings
    sendMultimedia: sendMultimedia,
    getMultimediaWriting: getMultimediaWriting,
    deleteFile: deleteFile,
    //Team
    createTeam: createTeam,
    getTeams: getTeams,
    getTeam: getTeam,
    getTeamsGroup: getTeamsGroup,
    getTeamStudentGroup: getTeamStudentGroup,
    getTeamStudent: getTeamStudent,
    getStudentWithoutTeam: getStudentWithoutTeam,
    getMembersTeam: getMembersTeam,
    editTeam: editTeam,
    deleteTeam: deleteTeam,
    joinTeam: joinTeam,
    addStudentTeam: addStudentTeam,
    leaveStudentTeam: leaveStudentTeam,
    //Messages
    sendMessage: sendMessage,
    getMessages: getMessages,
    getMessage: getMessage,
    editMessage: editMessage,
    deleteMessage: deleteMessage,
    searchMessageByIssuer: searchMessageByIssuer,
    searchMessageByReceiver: searchMessageByReceiver,
    //Collections
    getCollections: getCollections,
    getCollection: getCollection,
    getChallengesFromCollection: getChallengesFromCollection,
};