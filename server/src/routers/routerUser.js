//ruta para almacenar los enlaces

const controller = require("../controllers/controllerUser");
const express = require('express');//voy a usar el modulo express
const router =express.Router();

router.use(function(request, response,next) {
    response.header(
        "Access-Control-Allow-Headers",
       "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

/*Obtiene los los grupos del profesor */
router.get("/getGroups",controller.getGroups);


/*Obtiene los los grupos del alumno */
router.get("/getStudentGroups",controller.getStudentGroups);

// /*Obtiene los desafios del grupo del profesor*/
//router.get("/getChallenges",controller.getChallenges);

//Muestra todos los estudiantes que contienen cierta clave ya sea en nombre o en su email.
router.post("/searchStudent", controller.searchStudent);

//Muestra todos los estudiantes aún no aceptados (solicitantes) que contienen cierta clave ya sea en nombre o en su email.
router.post("/searchApplicant", controller.searchApplicant);

/*Acepta al estudiante solicitante en la aplicación cambiando su campo activo a 1 */
router.get("/acceptApplicant",controller.acceptApplicant);

//Muestra todos los estudiantes que pertenezcan a un grupo dado.
router.post("/searchStudentOfGroup", controller.searchStudentOfGroup);

/*Obtiene los los grupos del profesor */
router.get("/getProfile",controller.getProfile);

/*Deactiva un desafío (pone su activo a 0) */
router.get("/deleteChallenge",controller.deleteChallenge);

/*BUsca todos los escritos no colaborativos del usuario */
router.get("/getScriptsByStudent",controller.getScriptsByStudent);

//router.post("/postChallenge",controller.postChallenge);

module.exports = router;