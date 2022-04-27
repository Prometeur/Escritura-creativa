/*
*  Name_file: Teams.js
*  Description: Pagina de equipos del estudiante, contiene la vista de todos los equipos 
*  que tiene el estudiante
*    
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";

/**Servicios del estudiante */
import StudentService from '../../../services/student/student-service.js';

/**Datos del usuario */
import AuthUser from '../../../services/authenticity/auth-service.js';

/*Componentes de estilo Bootstrap*/
import Table from "react-bootstrap/Table";
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

/*Importaciones del css*/
import '../../../styles/styleGeneral.css';
import '../../../styles/Challenge.css';
import '../../../styles/styleCard.css';

class TeamStudent extends Component {

    constructor(props) {
        super(props);
        // const dataUser = AuthUser.getCurrentUser();
        this.state = {
            //dataTeams: [],//contiene los equipos del estudiante 
            dataTeamStudentGroup: [],//equipo del estudiante
            dataMembersTeam: [],//integrantes del equipo
            dataStudentWithoutTeam: [],//estudiantes sin equipo

            // idTeamCreated: '',//id del equipo creado
            teamName: '',//nombre del equipo a crear
            idGuest: '',//invitado
            idKicked: '',//estudiante a kicker
            idLider: '',//idLider
            nameLider: '',//idLider
            groupSelect: '',

            cdm: false,//component did mount se ejecuto
            /*modales*/

            onModal: false,
            //modalCreateTeam: false,

            modalLeaveLider: false,
            modalSuccesfulInvitation: false,
            modalSuccessCreateTeam: false,
            modalCreateTeam: false,
            modalDeleteTeam: false,
            modalLeaveTeam: false,
            modalKickStudent: false,
            modalErrorInvitation: false,
            modalErrorReceiveInvitation: false,
            showCreateTeam: false,
            showTeamStudent: false,

            showLiderStudent: false,//muestra funciones que solo puede ver el lider como eliminar integrante/ invitar miembro
            formErrors: {
                teamName: '',
            }
        }
    }

    componentDidMount() {
        var groupSelect;
        //si en el sidebar entro en "Equipos"
        if (this.props.groupSelect === undefined) {
            groupSelect = this.props.match.params.idGroup;
            this.setState({ groupSelect: groupSelect });
        }
        else if (this.props.match === undefined) {//si por grupos entro en "Equipos"
            groupSelect = this.props.groupSelect;
            this.setState({ groupSelect: groupSelect, showCreateTeam: true });
        }

        /*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
        StudentService.getTeamStudentGroup(AuthUser.getCurrentUser().id, groupSelect)
            .then(response => {
                //Si tiene equipo
                if (response.length != 0) {
                    if (response[0].idCreador === AuthUser.getCurrentUser().id)//si estudiante es lider del equipo
                        this.setState({ dataTeamStudentGroup: response, idLider: response[0].idCreador, showLiderStudent: true, showCreateTeam: false });
                    else {
                        this.setState({ dataTeamStudentGroup: response, idLider: response[0].idCreador, showCreateTeam: false });
                    }
                }
                //si el estudiante tiene equipo
                if (response.length != 0) {
                    //me traigo los integrantes de un mismo equipo
                    StudentService.getMembersTeam(response[0].idEquipo)
                        .then(responseGetMembersTeam => {
                            var nombre;
                            //si un miembro del equipo es el lider, guardo el nombre y apellido del lider 
                            responseGetMembersTeam.filter(member1 => member1.idEstudiante === this.state.idLider).map((member) => (
                                nombre = member.nombreEstudiante + " " + member.apellidoEstudiante
                            ));
                            this.setState({ dataMembersTeam: responseGetMembersTeam, nameLider: nombre, showTeamStudent: true, cdm: true });

                        }).catch(error => {
                            console.log(error.message);
                        })
                }
            }).catch(error => {
                console.log(error.message);
            })

        /*Me traigo estudiantes sin equipos de un grupo*/
        StudentService.getStudentWithoutTeam(groupSelect)
            .then(responseGetStudentWithoutTeam => {
                // dataStudentWithoutTeam
                this.setState({ dataStudentWithoutTeam: responseGetStudentWithoutTeam });
            }).catch(error => {
                console.log(error.message);
            })
    }

    //Crea un equipo
    createTeam = () => {
        //crea un equipo
        if (this.state.teamName !== "") {
            this.setState({ modalCreateTeam: false, showCreateTeam: false })
            StudentService.createTeam(AuthUser.getCurrentUser().id, this.state.groupSelect, this.state.teamName)
                .then(response => {
                    this.showModalSuccessCreateTeam();
                    var idTeam = response;
                    //agrega a la tabla equipoestudiante el nuevo equipo con idTeam y idEstudiante
                    StudentService.addStudentTeam(idTeam, AuthUser.getCurrentUser().id)
                        .then(response => {
                            // var nombre = AuthUser.getCurrentUser().username + " " + AuthUser.getCurrentUser().surname;
                            // let data = [{ id: idTeam, nombreEquipo: this.state.teamName, idCreador: AuthUser.getCurrentUser().id }]
                            // let data2 = [{ idEstudiante: AuthUser.getCurrentUser().id, nombreEstudiante: AuthUser.getCurrentUser().username, apellidoEstudiante: AuthUser.getCurrentUser().surname }]
                            // this.setState({ dataTeamStudentGroup: data, dataMembersTeam: data2, idLider: AuthUser.getCurrentUser().id, nameLider: nombre, showTeamStudent: true, showLiderStudent: true });
                            /*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
                            StudentService.getTeamStudentGroup(AuthUser.getCurrentUser().id, this.state.groupSelect)
                                .then(response => {
                                    var nombre = AuthUser.getCurrentUser().username + " " + AuthUser.getCurrentUser().surname;
                                    let dataMembersTeam = [{ idEstudiante: AuthUser.getCurrentUser().id, nombreEstudiante: AuthUser.getCurrentUser().username, apellidoEstudiante: AuthUser.getCurrentUser().surname }]
                                    this.setState({ dataTeamStudentGroup: response, dataMembersTeam: dataMembersTeam, idLider: AuthUser.getCurrentUser().id, nameLider: nombre, showTeamStudent: true, showLiderStudent: true });
                                }).catch(error => {
                                    console.log(error.message);
                                })
                        })
                        .catch(error => {
                            console.log(error.message);
                        })
                })
                .catch(error => {
                    console.log(error.message);
                })
        }
    }

    //Edita un equipo (cambio de lider de un equipo o se edita el nombre del equipo)
    editTeam = () => {
        let arreglo = [];
        //this.setState({ dataTeamStudentGroup: arreglo, showTeamStudent: false, showLiderStudent: false, modalDeleteTeam: false, modalLeaveLider: false });
        StudentService.editTeam(this.state.dataTeamStudentGroup[0].idEquipo, this.state.dataTeamStudentGroup[0].nombreEquipo, this.state.idLider, this.state.dataTeamStudentGroup[0].idGrupo)
            .then(response => {
                StudentService.leaveStudentTeam(this.state.dataTeamStudentGroup[0].idEquipo, AuthUser.getCurrentUser().id)
                    .then(response => {
                        this.setState({ dataTeamStudentGroup: arreglo, showTeamStudent: false, showLiderStudent: false, modalDeleteTeam: false, modalLeaveLider: false });
                    })
                    .catch(error => {
                        console.log(error.message);
                    })

                this.setState({ modalLeaveLider: false })
            })
            .catch(error => {
                console.log(error.message);
            })
    };

    //Elimina equipo
    deleteTeam = () => {
        if (this.props.match === undefined) {//si por grupos entro en "Equipos"
            this.setState({ showCreateTeam: true });
        }
        let arreglo = [];
        let idEquipo=this.state.dataTeamStudentGroup[0].idEquipo;
        this.setState({ dataTeamStudentGroup: arreglo, showTeamStudent: false, showLiderStudent: false, modalDeleteTeam: false });
        
        StudentService.getWritingsCollaborative(idEquipo)
        .then(response => {
            debugger;
            console.log("tienes equipos")
           
        })
        .catch(error => {
            console.log(error.message);
        })

        StudentService.deleteTeam(idEquipo)
            .then(response => {
                // this.closeModalDeleteTeam();
               
            })
            .catch(error => {
                console.log(error.message);
            })
    }

    askInvitation = () => {
        var idTeam = this.state.dataTeamStudentGroup[0].idEquipo;
        var idGroup = this.state.groupSelect;
        var idReceiver = this.state.idGuest;

        //Comprueba si envio una solicitud antes al estudiante a invitar
        StudentService.searchMessageByReceiver(idGroup, idReceiver, idTeam)
            .then(response => {
                if (response.length === 0) {
                    //Comprueba si recibió una solicitud antes por el estudiante a invitar
                    StudentService.searchMessageByIssuer(idGroup, idReceiver, idTeam)
                        .then(response => {
                            if (response.length === 0) {
                                this.invite()
                            }
                            else {
                                this.showModalErrorReceiveInvitation();
                            }
                        })
                        .catch(error => {
                            console.log(error.message);
                        })
                }
                else {
                    this.showModalErrorInvitation();
                }
            })
            .catch(error => {
                console.log(error.message);
            })
    };

    //Envia una invitación a un estudiante para unirse a su equipo
    invite = () => {
        var idGroup = this.state.groupSelect;
        var nombre = AuthUser.getCurrentUser().username;
        var apellidos = AuthUser.getCurrentUser().surname;
        var messageBody = "te envía una invitación para unirte a su equipo";
        var equipo = this.state.dataTeamStudentGroup[0].nombreEquipo;
        var grupo = this.state.dataTeamStudentGroup[0].nombreGrupo;
        var message = nombre + " " + apellidos + " " + messageBody + " " + equipo + " del Grupo de " + grupo;
        StudentService.sendMessage(idGroup, AuthUser.getCurrentUser().id, this.state.idGuest, this.state.dataTeamStudentGroup[0].idEquipo, message, 2)
            .then(response => {
                this.showModalSuccesfulInvitation();
            }).catch(error => {
                console.log(error.message);
            })
    };

    //Abandona el estudiante un equipo
    leaveTeam = () => {
        if (this.props.match === undefined) {//si por grupos entro en "Equipos"
            this.setState({ showCreateTeam: true });
        }
        let arreglo = [];
        this.setState({ dataTeamStudentGroup: arreglo, showTeamStudent: false, showLiderStudent: false, modalLeaveTeam: false });
        StudentService.leaveStudentTeam(this.state.dataTeamStudentGroup[0].idEquipo, AuthUser.getCurrentUser().id)
            .then(response => {
                //this.closeModalLeaveTeam();
            })
            .catch(error => {
                console.log(error.message);
            })
    };

    //Elimina estudiante un equipo
    kickStudentTeam = () => {
        this.setState({ modalKickStudent: false })
        var contador = 0;
        var arreglo = this.state.dataMembersTeam;
        arreglo.map((registro) => {
            if (this.state.idKicked === registro.idEstudiante.toString()) {
                arreglo.splice(contador, 1);
            }
            contador++;
        });
        this.setState({ dataMembersTeam: arreglo });
        StudentService.leaveStudentTeam(this.state.dataTeamStudentGroup[0].idEquipo, this.state.idKicked)
            .then(response => {
                //this.closeModalKickStudent();
            })
            .catch(error => {
                console.log(error.message);
            })
    };

    //obtiene al estudiante que va heredar el lider del equipo
    selectLider = e => {
        this.setState({
            idLider: e.target.value
        });
    };

    //obtiene al estudiante a invitar
    selectGuest = e => {
        this.setState({
            idGuest: e.target.value
        });
    };

    //obtiene al estudiante a invitar
    selectKicked = e => {
        this.setState({
            idKicked: e.target.value
        });
    };

    //Obtiene el nombre del equipo
    onChangeTeamName = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "teamName":
                formErrors.teamName =
                    value.length < 1 ? "Campo obligatorio requerido" : "";
                break;
            default:
                break;
        }
        this.setState({
            formErrors,
            teamName: e.target.value
        });
    }

    //activa/desactiva el boton eliminar equipo
    disabledButtonInvite = () => {
        //si no tengo equipo, desactivar boton invitar 
        if (this.state.dataTeamStudentGroup.length === 0)
            return true;//desactivar boton
        else {
            //si no soy el creador del equipo o si no hay estudiantes sin equipos
            if (this.state.dataTeamStudentGroup[0].idCreador !== AuthUser.getCurrentUser().id || this.state.dataStudentWithoutTeam.length === 0)
                return true;//desactivar boton
            else {
                return null;
            }
        }
    }

    //activa/desactiva el boton eliminar equipo
    disabledButtonDeleteTeam = () => {
        //si no tengo equipo, desactivar boton eliminar o si no soy el creador del equipo desactivar boton eliminar
        if ((this.state.dataTeamStudentGroup.length === 0) || (this.state.dataTeamStudentGroup[0].idCreador !== AuthUser.getCurrentUser().id))
            return true;
        else
            return null;
    }

    //activa/desactiva el boton eliminar equipo
    disabledButtonKickMembersTeam = () => {
        //si no tengo equipo, desactivar boton eliminar
        if (this.state.dataTeamStudentGroup.length === 0)
            return true;//desactivar boton
        else {
            //si no soy el creador del equipo desactivar boton eliminar o si solo existe un miembro del equipo
            if (this.state.dataTeamStudentGroup[0].idCreador !== AuthUser.getCurrentUser().id || this.state.dataMembersTeam.length === 1)
                return true;//desactivar boton
            else
                return null;//no se desactiva
        }
    }

    //Abandona el estudiante un equipo
    askLeaveTeam = () => {
        //si soy el creador del equipo
        if (this.state.dataTeamStudentGroup[0].idCreador === AuthUser.getCurrentUser().id && this.state.dataMembersTeam.length > 1) {
            this.showModalLeaveLider();
        }
        else {//salir del equipo
            this.showModalLeaveTeam();
        }
    };

    //Modal de confirmacion para eliminar equipo
    askDeleteTeam = () => {
        //si soy el creador del equipo
        if (this.state.dataTeamStudentGroup[0].idCreador === AuthUser.getCurrentUser().id) {
            this.showModalDeleteTeam();
        }
    };

    showModalLeaveLider = () => {
        this.setState({
            modalLeaveLider: true,
        });
    };

    showModalCreateTeam = () => {
        this.setState({
            modalCreateTeam: true,
        });
    };

    showModalLeaveTeam = () => {
        this.setState({
            //   form: dato,
            modalLeaveTeam: true,
        });
    };

    showModalKickStudent = () => {
        this.setState({
            //   form: dato,
            modalKickStudent: true,
        });
    };

    showModalDeleteTeam = () => {
        this.setState({
            //   form: dato,
            modalDeleteTeam: true,
        });
    };


    showModalErrorInvitation = () => {
        this.setState({
            modalErrorInvitation: true,
        });
        //cierra el modal despues de 3 segundos
        setTimeout(
            () => this.setState({ modalErrorInvitation: false }),
            2000
        );
    };

    showModalErrorReceiveInvitation = () => {
        this.setState({
            modalErrorReceiveInvitation: true,
        });
        //cierra el modal despues de 3 segundos
        setTimeout(
            () => this.setState({ modalErrorReceiveInvitation: false }),
            3000
        );
    };

    //Muestra modal de invitación enviada satisfactoriamente
    showModalSuccesfulInvitation = () => {
        this.setState({
            modalSuccesfulInvitation: true,
        });
        setTimeout(
            () => this.setState({ modalSuccesfulInvitation: false }),
            2000
        );
    };

    //Muestra modal de equipo creado satisfactoriamente
    showModalSuccessCreateTeam = () => {
        this.setState({
            //   form: dato,
            modalSuccessCreateTeam: true,
        });
        setTimeout(
            () => this.setState({ modalSuccessCreateTeam: false }),
            2000
        );
    };

    componentDidUpdate(pP, pS, sS) {
        var u = 1
        u = u + 1
        console.log("hola------>", u++);
        if (this.state.cdm) {
            if (pS.dataTeamStudentGroup !== this.state.dataTeamStudentGroup) {
                console.log("hacer algo");
            }
        }
    }

     /*Cambia estado del modal*/
     onModal(modal) {
        this.setState({
            onModal: modal
        });
    }

    //Comprueba si el nombre del equipo es vacio
    checkCreateTeam() {
        //Comprueba si el campo está vacío
        if (this.state.teamName == '')
            this.onModal(true);
        else
            this.onModalCreateTeam(true);
    }


     //modal de crearGrupo
     onModalCreateTeam = (modal) => {
        this.setState({
            modalCreateTeam: modal,
        });
    };

    /*Dibuja la pagina  */
    render() {
        const { showCreateTeam, showTeamStudent, showLiderStudent, formErrors, dataTeamStudentGroup, dataMembersTeam } = this.state;
        return (
           <div className={"container"}>
            <Card className="card-long">
                <Card.Body>
                    {showLiderStudent ? (
                        <>
                            <div className="row-edit">
                                <Alert variant={"info"}>
                                    <img src="/info.png" alt="" />
                                    Puedes seleccionar a un estudiante del grupo e invitarle o eliminar a miembro de tu equipo.
                                </Alert>
                            </div>
                            <div className={"row-edit"}>
                                <ul className="flex-row">
                                    <li className="flex-row-items">
                                        <div className={"form-select"}>
                                            <label className="form-label">  Estudiante a invitar </label>
                                            <select onChange={this.selectGuest} disabled={this.disabledButtonInvite()} >
                                                <option value="" selected disabled hidden >Seleccionar</option>
                                                {this.state.dataStudentWithoutTeam.filter(member => member.id !== AuthUser.getCurrentUser().id)
                                                    .map(elemento => (
                                                        <option key={elemento.id} value={elemento.id} > { elemento.nombre} { elemento.apellidos} </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className={"form-button-column"}>
                                            <Button size={"sm"} disabled={this.disabledButtonInvite()} onClick={() => this.askInvitation()} >Invitar</Button>
                                        </div>
                                    </li>
                                    <li className="flex-row-items">
                                        <div className={"form-select"}>
                                            <label className="form-label"> Eliminar Integrante del equipo </label>
                                            <select onChange={this.selectKicked} disabled={this.disabledButtonKickMembersTeam()} >
                                                <option value="" selected disabled hidden >Seleccionar</option>
                                                {this.state.dataMembersTeam.filter(member => member.idEstudiante !== AuthUser.getCurrentUser().id)
                                                    .map((elemento, index) =>
                                                        <option key={elemento.idEstudiante} value={elemento.idEstudiante} > {elemento.nombreEstudiante + " "} {elemento.apellidoEstudiante} </option>
                                                    )}
                                            </select>
                                        </div>
                                        <div className={"form-button-column"}>
                                            <Button size={"sm"} disabled={this.disabledButtonKickMembersTeam()} onClick={() => this.showModalKickStudent()} >eliminar</Button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                    {showTeamStudent ? (
                        <>
                        <hr/>
                        <div className={"row-edit"}>
                            <label className={"form-label"}>Lista de equipos</label>
                        </div>
                        <div className="row-edit">
                            <Table bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Equipo</th>
                                        <th>Grupo</th>
                                        <th>Integrantes</th>
                                        <th>Lider</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataTeamStudentGroup.map(team => {
                                        return (
                                            <tr key={team.id}>
                                                <td>{team.nombreEquipo}</td>
                                                <td>{team.nombreGrupo}</td>
                                                <td>
                                                {dataMembersTeam.map(item =>
                                                        <div>
                                                            {item.nombreEstudiante} {item.apellidoEstudiante}
                                                        </div>
                                                )}
                                                </td>
                                                <td>{this.state.nameLider}</td>
                                                <td>
                                                    <div>
                                                        <img src="/delete.png" alt=""/>
                                                        <Button variant="link" disabled={this.disabledButtonDeleteTeam()} onClick={() => this.askDeleteTeam()} >
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        <img src="/exit.png" alt=""/>
                                                        <Button variant="link" disabled={this.state.dataMembersTeam.length < 2 ? true : null} onClick={() => this.askLeaveTeam()} >
                                                            Dejar Equipo
                                                        </Button>  
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </div>
                       </>
                    ) : (
                        <>
                        </>
                    )}

                    {showCreateTeam ? (<>
                        <div className={"row-edit"}>
                            <h5> Crear Equipo </h5>
                            <input
                                className={formErrors.teamName.length > 0 ? "error" : "form-input"}
                                type="text"
                                name="teamName"
                                placeholder="escribe el nombre"
                                value={this.state.teamName}
                                onChange={this.onChangeTeamName}
                                disabled={this.state.dataTeamStudentGroup.length > 0 ? true : null}
                            />
                            {formErrors.teamName.length > 0 && (
                                <span className="errorMessage">{formErrors.teamName}</span>
                            )}
                            <div className={"form-button-column"}>
                                <Button onClick={() => this.checkCreateTeam()} disabled={this.state.dataTeamStudentGroup.length > 0 ? true : null}>Crear Equipo</Button>
                            </div>
                        </div>
                    </>

                    ) : (
                        <></>
                    )}


                    <Modal show={this.state.modalCreateTeam}>
                        <Modal.Header>
                            <div><h5>¿Estás seguro de crear el equipo {this.state.teamName} ?</h5></div>
                        </Modal.Header>
                        <Modal.Body>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.createTeam()}>Aceptar</Button>
                            <Button color="danger" onClick={() => this.setState({ modalCreateTeam: false })}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalLeaveLider}>
                        <Modal.Header>
                            <div><h5>Como lider del equipo antes de abandonar el equipo es necesario asignar un lider</h5></div>
                        </Modal.Header>
                        <Modal.Body>
                            <label> Lider:</label>
                            {/* <input className="form-control" readOnly type="text" value={this.state.form.id} /> */}
                            <select onChange={this.selectLider}  >
                                <option value="" selected disabled hidden >Seleccionar</option>
                                {/* {this.state.dataMembersTeam.map(elemento => (
                                        <option key={elemento.idEstudiante} value={elemento.idEstudiante} > { elemento.nombreEstudiante} </option>
                                    ))} */}
                                {this.state.dataMembersTeam.filter(student => student.idEstudiante !== AuthUser.getCurrentUser().id).map((elemento, index) =>
                                    <option key={elemento.idEstudiante} value={elemento.idEstudiante} > {elemento.nombreEstudiante + " "} {elemento.apellidoEstudiante}</option>
                                )}
                            </select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.editTeam()}>Aceptar</Button>
                            <Button variant={"danger"} onClick={() => this.setState({ modalLeaveLider: false })}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalSuccesfulInvitation}>
                        <Modal.Header>
                        </Modal.Header>
                        <Modal.Body>
                            <p> Invitación enviada correctamente</p>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalSuccessCreateTeam}>
                        <Modal.Header>
                        </Modal.Header>
                        <Modal.Body>
                            <p> Equipo creado correctamente!</p>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>

                    <Modal
                        show={this.state.modalDeleteTeam}
                    >
                        <Modal.Header>
                            <Modal.Title>Aviso</Modal.Title>
                            <img src="/triangle.png" alt=""/>
                        </Modal.Header>
                        <Modal.Body>
                            <h5>¿Estás seguro de eliminar el equipo?</h5>
                        </Modal.Body>
                        <Modal.Footer>
                            {/* <Button color="primary" onClick={() => this.editar(this.state.form)}>Aceptarr</Button> */}
                            <Button onClick={() => this.deleteTeam()}>Aceptar</Button>
                            <Button variant="danger" onClick={() => this.setState({ modalDeleteTeam: false })}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalLeaveTeam}>
                        <Modal.Header>
                            <div><h5>¿Estás seguro de abandonar el equipo?</h5></div>
                        </Modal.Header>
                        <Modal.Body>
                        </Modal.Body>
                        <Modal.Footer>
                            {/* <Button color="primary" onClick={() => this.editar(this.state.form)}>Aceptarr</Button> */}
                            <Button onClick={() => this.leaveTeam()}>Aceptar</Button>
                            <Button color="danger" onClick={() => this.setState({ modalLeaveTeam: false })}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalKickStudent}>
                        <Modal.Header>
                            <div><h5>¿Estás seguro de querer expulsar del equipo?</h5></div>
                        </Modal.Header>
                        <Modal.Body>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.kickStudentTeam()}>Aceptar</Button>
                            <Button color="danger" onClick={() => this.setState({ modalKickStudent: false })}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalErrorInvitation}>
                        <Modal.Header>
                        </Modal.Header>
                        <Modal.Body>
                            <p> Ya has enviado una invitacion anteriormente</p>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.modalErrorReceiveInvitation}>
                        <Modal.Header>
                        </Modal.Header>
                        <Modal.Body>
                            <p> Ya has recibido una petición del estudiante para unirse a tu equipo</p>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>

                    <Modal
                    centered
                    show={this.state.onModal}
                    onHide={this.state.onModal}
                >
                    <Modal.Header>
                        <Modal.Title>
                            Ups...
                        </Modal.Title>
                        <img src="/exclamation.png" alt=""/>
                    </Modal.Header>
                    <Modal.Body>
                      <h5> No has ingresado un nombre </h5>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.onModal(false)}>Atras</Button>
                    </Modal.Footer>
                </Modal>
                </Card.Body>
            </Card>
           </div>
        );
    }
}

export default TeamStudent;