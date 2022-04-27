  /*
*  Name_file :adminService.js
*  Description: contiene las llamadas al servidor de las funcionalidades del Admin
*/
import axios from '../../axios';
import authHeader from '../authenticity/auth-header';


class AdminService {

    

    getUsers(searchName, searchType) {
        return axios.post("/admin/getUsers", {  clave: searchName, tipo: searchType},{ headers: {"Authorization" : `Bearer ${authHeader()}`}
        })
        .then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })

    }

    getProfile(idUser) {
           
        return axios.get("/admin/getProfile", { params: { idUser: idUser} },{ headers: {"Authorization" : `Bearer ${authHeader()}`}})
        .then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    getScriptsByStudent(idStudent) {
      
        return axios.get("/admin/getScriptsByStudent", { params: { id:idStudent} },{ headers: {"Authorization" : `Bearer ${authHeader()}`}})
        .then(response => {
             return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    getAllGroups() {
        
        return axios.get("/admin/getAllGroups", { params: {} },{ headers: {"Authorization" : `Bearer ${authHeader()}`}})
        .then( response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })

    }

    deactivateUser(id){
        return axios.post("/admin/deactivateUser/", { idUser: id  },{ headers: {"Authorization" : `Bearer ${authHeader()}`}}).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    deleteUser(id){
        return axios.post("/admin/deleteUser/", { idUser: id  },{ headers: {"Authorization" : `Bearer ${authHeader()}`}}).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    getGroupData(idGroup) {
        return axios.get("/admin/getGroupData", { params: { idGroup: idGroup} },{ headers: {"Authorization" : `Bearer ${authHeader()}`}})
        .then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    renameGroup(id, newName){
        return axios.post("/admin/renameGroup", { id: id, name: newName  },{ headers: {"Authorization" : `Bearer ${authHeader()}`}}).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    deactivateGroup(id){
        return axios.post("/admin/deactivateGroup", { id: id },{ headers: {"Authorization" : `Bearer ${authHeader()}`}}).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    getStudentsOfGroup(grupo){
        return axios.post("/admin/getStudentsOfGroup", { grupo: grupo },{ headers: {"Authorization" : `Bearer ${authHeader()}`}}).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }

    getGroupsOfTeacher(id){
        return axios.get("/admin/getGroupsOfTeacher", { params:{ idEstudiante: id }},{ headers: {"Authorization" : `Bearer ${authHeader()}`}}).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        })
    }


}

export default new AdminService;   