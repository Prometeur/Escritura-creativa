/*
*  Name_file :GroupInfo.js
*  Description: Contiene los datos de un grupo segun un ID dado.
*    
*/

import React, { Component } from 'react';
import { Link} from "react-router-dom";
import AuthUser from '../../../services/authenticity/auth-service.js';
import AdminService from '../../../services/admin/adminService.js';

/**Estilos Boostrap*/
import Card from 'react-bootstrap/Card';
import Button  from 'react-bootstrap/Button';


/**Estilos CSS*/
import '../../../styles/styleGeneral.css';

class GroupInfo extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            
            data: [],
            currentUserId: '',
            currentUserRole: '',
            teacher: [],
            newName:""
    
        };
    }

    /*Se hacen peticiones al servidor para que me devuelva los datos del estudiante*/
    peticionGet() {
        AdminService.getGroupData(this.props.idGroup).then(response => {
                this.setState({data:response});
                this.peticionGetTeacher();
                this.props.handler();
                
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Se hacen peticiones al servidor para que me devuelva lso datos del prodesor del grupo*/
    peticionGetTeacher = () => {
        AdminService.getProfile(this.state.data.idprofesor ).then(response => {
            this.setState({ teacher: response });
        }).catch(error => {
            console.log(error.message);
        })
    }

    componentDidMount() {
        const dataUser = AuthUser.getCurrentUser();
        this.setState({
            currentUserId: dataUser.id
        });
        this.setState({
            currentUserRole: dataUser.rol
        });
        this.peticionGet();
    }

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleChangeRename = async e => {
        await this.setState({
                [e.target.name]: e.target.value
        });
    }

    /*Se hacen peticiones al servidor renombrar grupo*/
    rename = () => {
        AdminService.renameGroup(this.state.data.id, this.state.newName ).then(response => {
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Se hacen peticiones al servidor para desactivar al grupo*/
    deactivateGroup = () => {
        AdminService.deactivateGroup(this.state.data.id ).then(response => {
            window.location.href = '/homeadmin';
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Dibuja la pagina  */
    render() {

        let campoCambiarNombre = <div className={"form-select"}>
                                        <label className={"form-label"}>Cambiar nombre</label>
                                        <input type="text" name="newName" onChange={this.handleChangeRename} />
                                    </div>;
        
        let botonCambiarNombre = <Button size={"sm"} text='Cambiar' onClick={() => this.rename()}>Cambiar</Button>;

        if(this.state.newName === "")
        {
            botonCambiarNombre= <Button size={"sm"} disabled text='Cambiar' onClick={() => this.rename()}>Cambiar</Button>;
        }

        let botonDesactivar =  <Button size={"sm"} text='Desactivar grupo' onClick={() => this.deactivateGroup()}>Desactivar grupo</Button>;

        let fotoSource = "";
        let imagenProfe = <></>
        let textoProfe = <></>
        let name = <></>

        if(this.state.teacher != undefined)
        {
            textoProfe =
                <Button size ={"sm"} href={`/admin/users/viewProfile/${this.state.teacher.id}`} text='Ver Perfil'>
                    Ver perfil
                </Button>;

            name = <label className={"form-label"}>{this.state.teacher.nombre} {this.state.teacher.apellidos}</label>;

            if(this.state.currentUserRole === "T"){
                textoProfe = <h4>{this.state.teacher.nombre} {this.state.teacher.apellidos}</h4>;

            }
            if(this.state.teacher.foto != undefined)
            {
                fotoSource = this.state.teacher.ruta;
                imagenProfe = <img src={fotoSource} alt="" style={{ width: '4rem', borderRadius: '80%' }}></img>
            }
        }

        if(this.state.currentUserRole != "A")
        {
            campoCambiarNombre = <div></div>;
            botonCambiarNombre = <div></div>;
            botonDesactivar = <div></div>;
        }
        if(this.state.currentUserRole === "T" && this.state.currentUserId === this.state.data.idprofesor)
        {
            campoCambiarNombre = <div className={"form-select"}>
                                    <label className={"form-label"}>Cambiar nombre</label>
                                    <input type="text" name="newName" onChange={this.handleChangeRename} />
                                </div>;
        
            botonCambiarNombre =  <Button text='Cambiar' onClick={() => this.rename()}>Cambiar</Button>;
        }


     
        return (

                <Card className="card-long">
                    <Card.Body>
                        <div className={"row-edit"}>
                            <h3> Grupo {this.state.data.nombre}</h3>
                                {campoCambiarNombre}
                                <div className={"form-button-team"}>
                                    {botonCambiarNombre}
                                </div>
                                <div className={"form-button-team"}>
                                    {botonDesactivar}
                                </div>
                        </div>
                        <hr/>
                        <div className={"row-edit"}>
                            <div className={"form-button-team"}>
                                <label className={"form-label"} htmlFor="">
                                    <h5> Creado por</h5>
                                </label>
                            </div>

                            {imagenProfe}
                            <div className={"form-button-team"}>
                                {name}
                            </div>
                            <div className={"form-button-team"}>
                                {textoProfe}
                            </div>
                        </div>
                    </Card.Body>
                </Card>

        );

    }


}

export default GroupInfo;