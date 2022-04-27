import axios from "../../axios";
import authHeader from '../authenticity/auth-header';

class AuthService {
 
    login(username, password) {

        return axios.post("/auth/signin", { username: username, password: password }, { 
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
            } 
        })
        .then(response =>{

            if (response.data.accessToken) 
            {
                // Obtenemos los datos desde el servidor y almacenamos los datos del usuario
                localStorage.setItem("user", JSON.stringify(response.data));
            }
        
            return response.data;
      
         })
        //  .catch(error => {
        //     console.log(error.message);
        //    // window.location.href = '/500';
        // });
    }

    logout() {

        localStorage.removeItem("user");
    }

    register(username, surname, email, password, role) {
       
        return axios.post("/auth/signup", {
            username: username,
            surname: surname,
            email: email,
            password: password,
            role: role
        },{ headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
        } ).catch(error => {
            console.log(error.message);
            window.location.href = '/500';
        });
    }

    editProfile(id,username,surname,email,password,foto) {

        return axios.post("auth/editProfile",
            {
                id:id,
                username:username,
                surname:surname,
                email:email,
                password:password,
                foto:foto
            },
            { headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            });
    }

     //Actualiza la foto
     updatePhoto(idUser,file,type) {

        const form = new FormData();
        form.append("profilePhoto", file);
        form.append("idUser", idUser);
        return axios.post("auth/updatePhoto", form, { params:{ id:idUser, file:file,type:type}},
            // { headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
            {headers: { "Authorization": `Bearer ${authHeader()}` }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.log(error.message);
        })
    }

    disableProfile(idUser) {

        return axios.post("auth/disableProfile",
            {idUser:idUser},
            { headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
             }).catch(error => {
                console.log(error.message);
                window.location.href = '/500';
            });
    }

    getCurrentUser() {

        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();