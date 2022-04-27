//ruta para almacenar los enlaces
const controller_teacher = require("../controllers/controllerTeacher");
const controller_user = require("../controllers/controllerUser");
const controller_student = require("../controllers/controllerStudent");
const express = require('express');//voy a usar el modulo express
const router =express.Router();
const multer = require('multer');
const storage = require('../utils/multer');
const controllerTeacher = require("../controllers/controllerTeacher");
const uploader = multer({storage});


router.use(function(request, response,next) {
    response.header(
        "Access-Control-Allow-Headers",
       "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});


//-------------------------------------------------GROUP------------------------------------------------------------------//
/*Obtiene los  grupos del profesor *
//Muestra todos los estudiantes que pertenezcan a un grupo dado.
//router.post("/inviteStudentToGroup", controller.inviteStudentToGroup);
router.post("/searchStudent", controller_user.searchStudent);

/*Obtiene los los grupos del alumno */
router.get("/getStudentGroups",controller_user.getStudentGroups);

//Muestra todos los estudiantes que pertenezcan a un grupo dado.
//router.post("/inviteStudentToGroup", controller.inviteStudentToGroup);

router.post("/searchStudent", controller_user.searchStudent);

router.post("/acceptGroupRequest", controller_teacher.acceptGroupRequest);

router.get("/showGroupRequest", controller_teacher.showGroupRequest);

/*Obtiene los datos del usuario */
router.get("/getProfile",controller_user.getProfile);

router.get("/acceptApplicant",controller_user.acceptApplicant);

router.post("/groups",controller_teacher.getGroups);

//Invita a un estudiante a un grupo dado.
router.post("/inviteStudentToGroup", controller_teacher.inviteStudentToGroup);

//Expulsa a un estudiante de un grupo dado.
router.post("/kickStudentFromGroup", controller_teacher.kickStudentFromGroup);

/*Busca todos los escritos no colaborativos del usuario */
router.get("/getScriptsByStudent",controller_user.getScriptsByStudent);

//Crea un grupo nuevo.
router.post("/createGroup", controllerTeacher.createGroup);

//Muestra los equipos de un grupo.
router.post("/getTeamsOfGroup", controller_user.getTeamsOfGroup);

//Muestra todos los estudiantes que pertenezcan a un grupo dado.
//router.post("/inviteStudentToGroup", controller.inviteStudentToGroup);

//-------------------------------------------------CHALLENGE------------------------------------------------------------------//

/*Crea desafio del profesor */
router.post("/createChallenge",controller_teacher.createChallenge);

/*Edita el desafio del profesor*/
router.post("/editChallenge",controller_teacher.editChallenge);

/*Elimina desafio*/
router.post("/deleteChallenge",controller_teacher.deleteChallenge);

/*Obtiene todas las categorias de los desafios */
router.get("/getCategories",controller_teacher.getCategories);

/*Obtiene el desafio del profesor segun su grupo*/
router.get("/getChallenge",controller_teacher.getChallenge);

/*Obtiene los desafios del profesor segun su grupo*/
router.get("/Challenges",controller_teacher.getChallenges);

//----------------------------------------------MULTIMEDIA CHALLENGE------------------------------------------------------------------//

/*Obtiene los ficheros multimedia del desafio del profesor*/
router.get("/getMultimediaChallenge",controller_teacher.getMultimediaChallenge);

/*Envia los ficheros multimedia del desafio del profesor*/
// router.post("/sendMultimedia",uploader.single('file'),controller.sendMultimedia);

router.post("/sendMultimediaChallenge",uploader.array('imgCollection', 20),controller_teacher.sendMultimediaChallenge);

/*Elimina el fichero multimedia del desafio*/
router.post("/deleteFile",controller_teacher.deleteFile);

//-------------------------------------------------WRITING------------------------------------------------------------------//


/*Edito el escrito del estudiante */
router.post("/editWriting",controller_teacher.editWriting); 

/*Obtiene escritos de estudiantes */
router.get("/getWritingsStudent",controller_teacher.getWritingsStudent);

/*Obtiene el escritos de equipos*/
router.get("/getWritingsTeam",controller_teacher.getWritingsTeam);

/*Obtiene el escrito del estudiante segun su grupo*/
router.get("/getWriting",controller_teacher.getWriting);



//----------------------------------------------MULTIMEDIA WRITING------------------------------------------------------------------//

/*Obtiene los ficheros multimedia del escrito del estudiante*/
router.get("/getMultimediaWriting",controller_teacher.getMultimediaWriting);

//-------------------------------------------------TEAM--------------------------------------------------------------------//

/*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
router.get("/getTeamStudentGroup",controller_teacher.getTeamStudentGroup);

/*Obtiene los datos del equipo */
router.get("/getTeam",controller_user.getTeam);

/*Obtiene los estudiantes sin equipo de un grupo */
router.get("/getMembersTeam",controller_student.getMembersTeam);

/*Busca todos los escritos colaborativos del equipo */
router.get("/getScriptsByTeam",controller_user.getScriptsByTeam);

//-------------------------------------------------SOLICITANTES--------------------------------------------------------------------//

//Muestra todos los estudiantes aún no aceptados (solicitantes) que contienen cierta clave ya sea en nombre o en su email.
router.post("/searchApplicant", controller_user.searchApplicant);

/*Acepta al estudiante solicitante en la aplicación cambiando su campo activo a 1 */
router.get("/acceptApplicant",controller_teacher.acceptApplicant);


//-----------------------------------------COLLECTIONS-----------------------------------------//

// Crea una colección
router.post("/createCollection", controller_teacher.createCollection);

// Añadir un desafío a una colección
router.post("/addChallengeToCollection", controllerTeacher.addChallengeToCollection);

// Obtiene las colecciones de un profesor, pudiendo filtrar por nombre de grupo o nombre de colección
router.get("/getCollections", controllerTeacher.getCollections);

// Obtiene una colección
router.get("/getCollection", controller_teacher.getCollection);

// Obtiene los desafíos de una colección
router.get("/getChallengesFromCollection", controller_teacher.getChallengesFromCollection);

// Obtiene los desafíos que no están en una determinada colección
router.get("/getChallengesNotInCollection", controller_teacher.getChallengesNotInCollection);

// Elimina un desafío de una colección
router.post("/deleteChallengeFromCollection", controller_teacher.deleteChallengeFromCollection);

// Elimina una colección
router.post("/deleteCollection", controller_teacher.deleteCollection);


module.exports = router;