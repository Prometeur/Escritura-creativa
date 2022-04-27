//ruta para almacenar los enlaces

const controllerUser = require("../controllers/controllerUser");
const controllerTeacher = require("../controllers/controllerTeacher");
const controllerAdmin = require("../controllers/controllerAdmin");
const express = require('express');//voy a usar el modulo express
const router =express.Router();

//importar la conexion
const pool = require('../db/database');

router.use(function(request, response,next) {
    response.header(
        "Access-Control-Allow-Headers",
       "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

//Muestra todos los estudiantes que contienen cierta clave ya sea en nombre o en su email.
router.post("/getUsers", controllerUser.searchUsers);

//Muestra todos los grupos.
router.get("/getAllGroups", controllerUser.getAllGroups);

//Invita a un estudiante a un grupo dado.
router.post("/inviteStudentToGroup", controllerTeacher.inviteStudentToGroup);

//Expulsa a un estudiante de un grupo dado.
router.post("/kickStudentFromGroup", controllerTeacher.kickStudentFromGroup);

//Expulsa a un estudiante de un grupo dado.
router.post("/deactivateUser", controllerAdmin.deactivateUser);

//Expulsa a un estudiante de un grupo dado.
router.post("/deleteUser", controllerAdmin.deleteUser);

//Renombra al grupo dado.
router.post("/renameGroup", controllerAdmin.renameGroup);

//Desactiva a un grupo.
router.post("/deactivateGroup", controllerAdmin.deactivateGroup);

//Muestra los estudiantes de un grupo.
router.post("/getStudentsOfGroup", controllerUser.searchStudentOfGroup);

//Busca escritos del usuario.
router.get("/getScriptsByStudent", controllerUser.getScriptsByStudent);

//Busca grupos del profesor.
router.get("/getGroupsOfTeacher", controllerUser.getGroups);

//Muestra los datos del grupo.
router.get("/getGroupData", controllerUser.getGroupData);

//Accede a los datos de un usuario.
router.get("/getProfile", controllerUser.getProfile);

//Muestra los estudiantes de un grupo.
//router.get("/getChallenges", controllerTeacher.getChallenges);

router.get("/getaUsers",(req,res)=>{

    const sqlSelect = "SELECT * FROM usuario";
    pool.query(sqlSelect,(err,result) => {
        res.send(result);
    });
});


module.exports = router;