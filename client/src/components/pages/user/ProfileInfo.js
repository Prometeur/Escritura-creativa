/*
*  Name_file :ProfileInfo.js
*  Description: Contiene los datos de un usuario segun un ID dado.
*    
*/

import React, { Component } from 'react';
import AuthUser from '../../../services/authenticity/auth-service.js';
import TeacherService from '../../../services/teacher/teacherService.js';
import AdminService from '../../../services/admin/adminService.js';

/**Estilos */
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

/**Estilos CSS*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

class ProfileInfo extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            data: [],
            teacherGroupData: [],
            studentGroupData: [],
            finalGroupData:[],
            finalGroupKickData:[],
            currentUserId: '',
            currentUserRole: '',
            groupSelect: "-1",
            groupKickSelect: "-1"
    
        };
    }


    /*Se hacen peticiones al servidor para que me devuelva los datos del estudiante*/
    peticionGet() {
        TeacherService.getProfile(this.props.idStudent).then(response => {
              this.setState({data:response});
              this.props.handler();
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Se hacen peticiones al servidor para que me devuelva todos los grupos del profesor*/
    peticionGetGruposTeacher(id) {
      
        TeacherService.getGroups(id).then(response => {
            this.setState({ teacherGroupData: response });
            this.peticionGetGruposStudent();
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Se hacen peticiones al servidor para que me devuelva todos los grupos (FUNCION ADMIN)*/
    peticionGetAllGroups() {
      
        AdminService.getAllGroups().then(response => {
            this.setState({ teacherGroupData: response });
            this.peticionGetGruposStudent();
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Se hacen peticiones al servidor para que me devuelva todos los grupos del alumno*/
    peticionGetGruposStudent() {

        TeacherService.getGroupsStudent(this.props.idStudent).then(response =>{ 
            this.setState({ studentGroupData: response });
            this.filterGroupData();
        }).catch(error => {
            console.log(error.message);
        })

    }

    //Filtra los grupos para eliminar los mismos que ya tiene el estudiante
    filterGroupData = () =>{
        let finalGroups = [];

        for(let i = 0; i < this.state.teacherGroupData.length; i++){
            let unico = true;
            for(let j = 0; j < this.state.studentGroupData.length; j++){
                if(this.state.teacherGroupData[i].id == this.state.studentGroupData[j].id){
                    unico = false;
                }
            }
            if(unico){
                finalGroups.push(this.state.teacherGroupData[i]);
            }
        }
        this.setState({finalGroupData: finalGroups})
        this.filterGroupKickData();
    }

    //Filtra los grupos para dejar sólo los mismos que ya tiene el estudiante
    filterGroupKickData = () =>{
        let finalGroups = [];

        for(let i = 0; i < this.state.teacherGroupData.length; i++){
            let unico = true;
            for(let j = 0; j < this.state.studentGroupData.length; j++){
                if(this.state.teacherGroupData[i].id == this.state.studentGroupData[j].id){
                    unico = false;
                }
            }
            if(unico === false){
                finalGroups.push(this.state.teacherGroupData[i]);
            }
        }
        this.setState({finalGroupKickData: finalGroups})
        
    }

    /*Detecta un cambio en el valor del grupo a escoger */
    handleChangeGroupSelect = async e => {
        await this.setState({
                [e.target.name]: e.target.value
        });
    }

    /*Detecta un cambio en el valor del grupo a escoger */
    handleChangeGroupKickSelect = async e => {
        await this.setState({
                [e.target.name]: e.target.value
        });
    }

    /*Detecta un cambio en el valor del grupo a escoger */
    handleChangeCurrentUserId = (dataUser)=> {
        this.setState({
            currentUserId: dataUser.id
        });
        this.handleChangeCurrentUserRole(dataUser);
    }

    /*Detecta un cambio en el valor del grupo a escoger */
    handleChangeCurrentUserRole = (dataUser)=> {
        this.setState({
            currentUserRole: dataUser.rol
        });

        this.peticionGet();
        if(dataUser.rol == "A"){//ADMIN
            this.peticionGetAllGroups();
        }
        else{//PROFESOR
            this.peticionGetGruposTeacher(dataUser.id);
        }
        
    }

    /*Cargo todos los datos que necesito nada más cargar la página, como los datos del usuario o los grupos.*/
   componentDidMount() {
    const dataUser = AuthUser.getCurrentUser();
    this.handleChangeCurrentUserId(dataUser);
     
   }

    //Acepta al estudiante como usuario de la aplicación.
    acceptApplicant(idApplicant) {
        
        TeacherService.acceptApplicantStudent(idApplicant)
        .then(response=>{
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
     }

     /*Se hacen peticiones al servidor para invitar al estudiante al grupo*/
     inviteToGroup = (idGroup) => {
        TeacherService.inviteToGroup(idGroup,this.props.idStudent).then(response =>{
            if(this.state.currentUserRole =="A")
            {
                this.peticionGetAllGroups();
            }
            else{
                this.peticionGetGruposTeacher(this.state.currentUserId);
            }
            this.setState({groupSelect: "-1"});
            this.peticionGet();
        }).catch(error => {
              console.log(error.message);
        })
     }

    /*Se hacen peticiones al servidor para expulsar al estudiante del grupo*/
    kickFromGroup = (idGroup) => {
         
        TeacherService.kickFromGroup(idGroup,this.props.idStudent).then(response => {
            if(this.state.currentUserRole =="A")
            {
                this.peticionGetAllGroups();
            }
            else{
                this.peticionGetGruposTeacher(this.state.currentUserId);
            }
            this.setState({groupKickSelect: "-1"});
            this.peticionGet();
        }).catch(error => {
             console.log(error.message);
        })
    }

    /*Se hacen peticiones al servidor para desactivar al usuario*/
    deactivateUser = (id) => {
        AdminService.deactivateUser(id).then(response => {
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Se hacen peticiones al servidor para eliminar al usuario*/
    deleteUser = (id) => {
        AdminService.deleteUser(id).then(response => {
            window.location.href = '/homeadmin';
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Dibuja la pagina  */
    render() {

        let fotoSource = "/chicaliteratura.png";
        let imagenUser = <img src={fotoSource} alt="" className={"figure-profile"} ></img>

        if(this.state.data.ruta != undefined)
        {
            if(this.state.data.ruta != "")
            {
                fotoSource = this.state.data.ruta;
                imagenUser = <img src={fotoSource} alt="" className={"figure-profile"} ></img>
            }
        }

        let cartel =<></>;
        let contenido = <div className={"row-edit"}>
                            <br/>
                             <ul className={"flex-row"}>
                                <li className={"items-row"}>
                                    {imagenUser}
                                 </li>
                                 <li className={"items-row"}>
                                     <ul className={"container-column-list wrap"}>
                                        <li className={"flex-item-data"}>
                                            <h3>{this.state.data.nombre}</h3>  <h3>{this.state.data.apellidos}</h3>
                                        </li>
                                     </ul>
                                     <div className={"email-profile"}>
                                         <h5>{this.state.data.correo}</h5>
                                     </div>
                                 </li>
                             </ul>
                        </div>;

        let invitaGrupo = <div className={"row-edit"}>
            <ul className={"container-column-list wrap"}>
                <li className={"flex-item-profile"}>
                    <label className={"form-label"} htmlFor="groupSelect">Invitar a un grupo</label>
                </li>
                <li className={"flex-item-profile"}>
                    <select name="groupSelect" id="groupSelect" onChange={this.handleChangeGroupSelect}>
                        <option value= "-1" >Elija un grupo</option>
                        {this.state.finalGroupData.map(group => {
                            return (
                                <option value={group.id}>{group.nombre}</option>
                            )
                        })}
                    </select>
                </li>
                <li className={"flex-item-profile"}>
                    <Button size={"sm"}  text='Invitar a grupo' onClick={() => this.inviteToGroup(this.state.groupSelect)}>
                        Invitar
                    </Button>
                </li>
            </ul>
        </div>;


        if(this.state.groupSelect === "-1"){
            invitaGrupo =
            <div className={"row-edit"}>
                <ul className={"container-column-list wrap"}>
                    <li className={"flex-item-profile"}>
                        <label className={"form-label"} htmlFor="groupSelect">Invitar a un grupo</label>
                    </li>
                    <li className={"flex-item-profile"}>
                        <select name="groupSelect" id="groupSelect" onChange={this.handleChangeGroupSelect}>
                            <option selected value= "-1" >Elija un grupo</option>
                            {this.state.finalGroupData.map(group => {
                                return (
                                    <option value={group.id}>{group.nombre}</option>
                                )
                            })}
                        </select>
                    </li>
                    <li className={"flex-item-profile"}>
                        <Button  size={"sm"} disabled text='Invitar a grupo' onClick={() => this.inviteToGroup(this.state.groupSelect)}>
                            Invitar
                        </Button>
                    </li>
                </ul>
            </div>;
        }

        let echaGrupo = 
        <div className={"row-edit"}>
            <ul className={"container-column-list wrap"}>
                <li className={"flex-item-profile"}>
                    <label className={"form-label"} htmlFor="groupKickSelect">Expulsar de un grupo</label>
                </li>
                <li className={"flex-item-profile"}>
                    <select name="groupKickSelect" id="groupKickSelect" onChange={this.handleChangeGroupKickSelect}>
                        <option value= "-1" >Elija un grupo</option>
                        {this.state.finalGroupKickData.map(group => {
                            return (
                                <option value={group.id}>{group.nombre}</option>
                            )
                        })}
                    </select>
                </li>
                <li className={"flex-item-profile"}>
                    <Button size={"sm"} text='Expulsar del grupo' onClick={() => this.kickFromGroup(this.state.groupKickSelect)}>
                        Expulsar
                    </Button>
                </li>
            </ul>
        </div>;

        if(this.state.groupKickSelect === "-1"){
            echaGrupo = 
                <div className={"row-edit"}>
                    <ul className={"container-column-list wrap"}>
                        <li className={"flex-item-profile"}>
                            <label className={"form-label"} htmlFor="groupKickSelect">Expulsar del grupo</label>
                        </li>
                        <li className={"flex-item-profile"}>
                            <select name="groupKickSelect" id="groupKickSelect" onChange={this.handleChangeGroupKickSelect}>
                                <option selected value= "-1" >Elija un grupo</option>
                                {this.state.finalGroupKickData.map(group => {
                                    return (
                                        <option value={group.id}>{group.nombre}</option>
                                    )
                                })}
                            </select>
                        </li>
                        <li className={"flex-item-profile"}>
                            <Button  size={"sm"} disabled text='Expulsar del grupo' onClick={() => this.kickFromGroup(this.state.groupKickSelect)}>
                                Expulsar
                            </Button>
                        </li>
                    </ul>
                </div>;
        }

        let botonDesactivar = <></>;
        let botonEliminar = <></>;


        //      RESTRICCIONES POR USUARIO LOGUEADO

        if(this.state.currentUserRole == "A")
        {

            botonDesactivar =
                    <div className={"form-button"}>
                        <Button size={"sm"} text='Desactivar usuario' onClick={() => this.deactivateUser(this.state.data.id)}>
                            Desactivar usuario
                        </Button>
                    </div>


            botonEliminar =
                    <div className={"form-button"}>
                        <Button
                            variant={"danger"}
                            size={"sm"}
                            text='Eliminar usuario'
                            onClick={() =>
                        {if(window.confirm('El usuario '+ this.state.data.nombre + ' '+ this.state.data.apellidos
                            +' y todos sus grupos, escritos, equipos y desafíos se eliminarán de forma permanente de la base de datos. ESTA ACCIÓN ES IRREVERSIBLE. ¿Eliminar usuario?'))
                        {this.deleteUser(this.state.data.id)};}}>
                           Denegar solicitud
                        </Button>
                    </div>

        }
        if(this.state.currentUserRole == "S")
        {
            invitaGrupo = <></>;
            echaGrupo = <></>;
        }

        //      RESTRICCIONES POR EL USUARIO QUE VEO

        if(this.state.data.rol == "A")
            //SI EL USUARIO QUE VEO ES ADMIN NO LO PUEDO MODIFICAR
        {
            invitaGrupo = <></>;
            echaGrupo = <></>;
            botonDesactivar = <></>;
            botonEliminar =<></>;
        }

        if(this.state.data.rol == "T")
            //SI EL USUARIO QUE VEO ES PROFESOR NO PUEDO MODIFICAR A QUE GRUPOS PERTENECE
        {
            invitaGrupo = <></>;
            echaGrupo = <></>;
        }

        // RESTRICCIONES PARA SOLICITANTES
        if(this.state.data.activo === 0)
        {
            cartel = <div className={"row-edit"}>
                         <div className={"form-select"}>
                             <label className={"form-label"} htmlFor="">Estudiantes aún en espera de ser aceptados.</label>
                         </div>
                     </div>;
            contenido = <div className={"row-edit"}>
                            <ul className={"container-column-list wrap"} >
                                <li className={"flex-item-list"}>
                                    {this.state.data.nombre} {this.state.data.apellidos}
                                </li>
                                <li  className={"flex-item-list"} >
                                    {this.state.data.correo}
                                </li>
                                <li className={"flex-item-list"} >
                                    <div className={"form-button-column"}>
                                        <Button size={"sm"} text='Aceptar solicitud' onClick={() => this.acceptApplicant(this.state.data.id)}>
                                            Aceptar solicitud
                                        </Button>
                                    </div>
                                </li>
                            </ul>
                        </div>;

            invitaGrupo = <></>;
            echaGrupo = <></>;
            botonDesactivar = <></>;
        }

        return (
            <Card className={"card-long"}>
                <Card.Body>
                        {cartel}
                        {contenido}
                        {invitaGrupo}
                        {echaGrupo}
                        <div className={"row-edit"}>
                            <hr/>
                            {botonDesactivar}
                            {botonEliminar}
                        </div>
                </Card.Body>
            </Card>
        );
    }


}

export default ProfileInfo;