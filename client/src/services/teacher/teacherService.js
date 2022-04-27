import axios from '../../axios';
import authHeader from '../authenticity/auth-header';

class TeacherService {

    //-------------------------------------------------GROUP------------------------------------------------------------------//

    /*Obtiene los  grupos del profesor */
    getGroups(idTeacher) {
        return axios.post("/teacher/groups", { idTeacher: idTeacher }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    getProfile(idStudent) {

        return axios.get("/teacher/getProfile", { params: { idUser: idStudent } }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    getGroupsStudent(idStudent) {

        return axios.get("/teacher/getStudentGroups", { params: { idEstudiante: idStudent } }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })

    }

    showGroupRequest() {

        return axios.get("/teacher/showGroupRequest", { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })

    }
    acceptGroupRequest(idGroup, idStudent) {

        return axios.post("/teacher/acceptGroupRequest", {id: idGroup, idEstudiante: idStudent } , { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })

    }

    getScriptsByStudent(idStudent) {

        return axios.get("/teacher/getScriptsByStudent", { params: { id: idStudent } }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }


    searchStudent(searchStudent, searchType) {

        return axios.post("/teacher/searchStudent", { searchStudent: searchStudent, type: searchType }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })

    }

    searchApplicant(searchStudent, searchType) {

        return axios.post("/teacher/searchApplicant", { clave: searchStudent, tipo :searchType},{ headers: {"Authorization" : `Bearer ${authHeader()}`}
        })
        .then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })

    }

    acceptApplicantStudent(idApplicant) {

      
        return axios.get("/user/acceptApplicant", { params: { idUser: idApplicant } }, { headers: {"Authorization" : `Bearer ${authHeader()}`}})
          .then(response => {
             return response.data;
       }).catch(error => {
           console.log(error.message);
           window.location.href = '/500';
       })

    }

    inviteToGroup(idGroup, idStudent) {

        return axios.post("/teacher/inviteStudentToGroup", { grupo: idGroup, idEstudiante: idStudent }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })

    }

    kickFromGroup(idGroup, idStudent) {

        return axios.post("/teacher/kickStudentFromGroup", { grupo: idGroup, idEstudiante: idStudent }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    createGroup(id, newName){
        return axios.post("/teacher/createGroup", { idTeacher: id, nombre: newName  },{ headers: {"Authorization" : `Bearer ${authHeader()}`}}).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    getTeamsOfGroup(grupo){
        return axios.post("/teacher/getTeamsOfGroup", { grupo: grupo },{ headers: {"Authorization" : `Bearer ${authHeader()}`}}).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }


    //-------------------------------------------------CHALLENGE------------------------------------------------------------------//

    /*Obtiene todas las categorias de los desafios */
    getCategories() {
        return axios.get("/teacher/getCategories", {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    /*Crea desafio del profesor */
    createChallenge(idGroup, title, description, type, category, qualification, endDate) {
        return axios.post("/teacher/createChallenge", { idGroup: idGroup, title: title, description: description, type: type, category: category, qualification: qualification, endDate: endDate }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    /*Edita el desafio del profesor*/
    editChallenge(idChallenge, idGroup, title, description, type, category, qualification, endDate) {
        return axios.post("/teacher/editChallenge", { idChallenge: idChallenge, idGroup: idGroup, title: title, description: description, type: type, category: category, qualification: qualification, endDate: endDate }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    /*Elimina desafio*/
    deleteChallenge(idChallenge) {
        return axios.post("/teacher/deleteChallenge", { idChallenge: idChallenge }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    /*Obtiene el desafio del profesor segun su grupo*/
    getChallenge(idChallenge) {

        return axios.get("/teacher/getChallenge", { params: { idChallenge: idChallenge } }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    /*Obtiene los desafios del profesor segun su grupo*/
    getChallenges(idGroup) {
        return axios.get("/teacher/Challenges", { params: { idGroup: idGroup } }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    //-------------------------------------------------MULTIMEDIA CHALLENGE------------------------------------------------------------------//
    /*Obtiene multimedia del desafio del profesor */
    getMultimediaChallenge(idChallenge) {
        return axios.get("/teacher/getMultimediaChallenge", { params: { idChallenge: idChallenge } },
            {
                headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    /*Envia los archivos multimedia del profesor*/
    sendMultimediaChallenge(imgCollection, idTeacher, idChallenge, type) {
        const form = new FormData();
        for (const key of Object.keys(imgCollection)) {
            form.append('imgCollection', imgCollection[key])
        }

        form.append("idTeacher", idTeacher);
        form.append("idChallenge", idChallenge);

        return axios.post("/teacher/sendMultimediaChallenge", form, { params: { id: idTeacher, idFolder: idChallenge, type: 1 } }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    /*Elimina los archivos multimedia del profesor*/
    deleteMultimedia(idMultimedia, path) {
        return axios.post("/teacher/deleteFile", { idMultimedia: idMultimedia, path: path }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    //-------------------------------------------------WRITING------------------------------------------------------------------//
    /*Obtiene escritos de estudiantes */
    getWritingsStudent(idGroup, idChallenge) {
        return axios.get("/teacher/getWritingsStudent", { params: { idGroup: idGroup, idChallenge: idChallenge } },
            {
                headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response;
            }).catch(error => {
                console.log(error.message);
            })
    }

    /*Obtiene el escrito del estudiante */
    getWriting(idWriting) {
        return axios.get("/teacher/getWriting", { params: { idWriting: idWriting } },
            {
                headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    /*Obtiene escritos colaborativos */
    getWritingsTeam(idGroup, idChallenge) {
        return axios.get("teacher/getWritingsTeam", { params: { idGroup: idGroup,idChallenge:idChallenge } }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    /*Edito el escrito del estudiante */
    editWriting(idWriting, idGroup, idChallenge, idWriter, title, escrito, score, commentary, type, finish) {
        return axios.post("/teacher/editWriting", { idWriting: idWriting, idGroup: idGroup, idChallenge: idChallenge, idWriter: idWriter, title: title, escrito: escrito, score: score, commentary: commentary, type: type, finish: finish }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    //-------------------------------------------------MULTIMEDIA WRITING------------------------------------------------------------------//
    /*Obtiene multimedia del escrito del estudiante */
    getMultimediaWriting(idChallenge, idWriter) {
        return axios.get("/teacher/getMultimediaWriting", { params: { idChallenge: idChallenge, idWriter: idWriter } },
            {
                headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    //-------------------------------------------------TEAM------------------------------------------------------------------//

    /*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
    getTeamStudentGroup(idStudent, idGroup) {
        return axios.get("/teacher/getTeamStudentGroup", { params: { idStudent: idStudent, idGroup: idGroup } }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    getTeam(idTeam) {
        return axios.get("/teacher/getTeam", { params: { idTeam: idTeam } }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    // Obtiene los integrantes de un equipo
    getMembersTeam(idTeam) {
        return axios.get("/teacher/getMembersTeam", { params: { idTeam: idTeam } }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    getScriptsByTeam(idStudent) {

        return axios.get("/teacher/getScriptsByTeam", { params: { id: idStudent } }, { headers: { "Authorization": `Bearer ${authHeader()}` } })
            .then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    //-----------------------------------------COLLECTIONS-----------------------------------------//

    // Crea una colección
    createCollection(nombreColeccion, idProfesor, idGrupo)
    {
        return axios.post("/teacher/createCollection", { nombreColeccion: nombreColeccion, idProfesor: idProfesor, idGrupo: idGrupo }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    // Añadir un desafío a una colección
    addChallengeToCollection(idColeccion, idDesafio)
    {
        return axios.post("/teacher/addChallengeToCollection", { idColeccion: idColeccion, idDesafio: idDesafio }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    // Obtiene las colecciones de un profesor, pudiendo filtrar por nombre de grupo o nombre de colección
    getCollections(idProfesor, filtroBusqueda)
    {
        return axios.get("/teacher/getCollections", { params: { idProfesor: idProfesor, filtroBusqueda: filtroBusqueda } },
            {
                headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    // Obtiene una colección
    getCollection(idCollection)
    {
        return axios.get("/teacher/getCollection", { params: { idCollection: idCollection } },
            {
                headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    // Obtiene los desafíos de una colección
    getChallengesFromCollection(idCollection)
    {
        return axios.get("/teacher/getChallengesFromCollection", { params: { idCollection: idCollection } },
            {
                headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    // Obtiene los desafíos que no están en una determinada colección
    getChallengesNotInCollection(idGroup, idCollection)
    {
        return axios.get("/teacher/getChallengesNotInCollection", { params: { idGroup: idGroup, idCollection: idCollection } },
        {
            headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    // Elimina un desafío de una colección
    deleteChallengeFromCollection(idColeccion, idDesafio)
    {
        return axios.post("/teacher/deleteChallengeFromCollection", { idCollection: idColeccion, idChallenge: idDesafio }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }

    // Elimina una colección
    deleteCollection(idColeccion)
    {
        return axios.post("/teacher/deleteCollection", { idCollection: idColeccion }, {
            headers: { "Authorization": `Bearer ${authHeader()}` }
            }).then(response => {
                return response.data;
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            })
    }


}



export default new TeacherService;
