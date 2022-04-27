/*
*  Name_file: Messenger.js
*  Description: Pagina de equipos del estudiante, contiene la vista de todos los equipos 
*  que tiene el estudiante
*    
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";

/**Datos del usuario */
import AuthUser from '../../../services/authenticity/auth-service.js';

/*Importacion del css*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';


import Modal from 'react-bootstrap/Modal';

//Componentes css
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from 'react-bootstrap/Button';

import moment from 'moment';

/**Servicios del estudiante */
import StudentService from '../../../services/student/student-service.js';

class Message extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            team: '',//equipo 
            showButtons: false,
            modalAcceptJoinTeam: false,
            modalRefuseJoinTeam: false,
            modalAnswerJoinTeam: false,
            senderHasTeam:false,
            modalSenderHasTeam:false,
            senderHasTeamAsABoss: false,
            idEmisor: -1,
            idBossTeam: -1,
        }
    }

    componentDidMount() {
        //Obtiene el mensaje 
        StudentService.getMessage(this.props.match.params.idMessage)
            .then(response => {
                var showButtons = false;
                //si el mensaje es de tipo 0(ya respondio a la solicitud) o 2(no respondio a la solicitud) muestra los botones de "aceptar" o "rechazar"
                if (response[0].tipo === 0 || response[0].tipo === 2) {
                    showButtons = true;
                }
                this.setState({ message: response[0], showButtons: showButtons, idEmisor: response[0].idEmisor });
                //Obtiene el equipo del mensaje
                StudentService.getTeam(this.state.message.idCreador)
                    .then(response => {
                        if(response.length > 0){//si el mensaje tiene equipo
                            this.setState({ team: response[0], idBossTeam: response[0].idCreador });

                        // si el líder del equipo es quien envía el mensaje
                        if (response[0].idCreador == this.state.idEmisor)
                        {
                            this.setState({ senderHasTeamAsABoss: true });
                        }
                    }
                    }).catch(error => {
                        console.log(error.message);
                    })

                //Compruebo si el estudiante emisor del mensaje dispone de equipo
                StudentService.getTeamStudentGroup(response[0].idEmisor,response[0].idGrupo)
                .then(response => {
                    if(response.length !=0){//si el remitente tiene equipo
                        this.setState({ senderHasTeam: true });
                    }
                }).catch(error => {
                    console.log(error.message);
                })

            }).catch(error => {
                console.log(error.message);
            })
    }

    askAcceptRequest = () => {
        //Si el mensaje es una solicitud para unirse a un equipo(tipo 2) y (si el estudiante remitente no tiene equipo o si el líder del equipo es quien envía el mensaje)
        if (this.state.message.tipo === 2 && (!this.state.senderHasTeam || this.state.senderHasTeamAsABoss)) {
            this.acceptRequest();
        }
        //Si el mensaje ya fue respondido(tipo 0)
        else if (this.state.message.tipo === 0) {
            this.showModalAnswerJoinTeam();
        }
        else{//en otro caso el estudiante remitente tiene equipo
            this.showModalSenderhasTeam();
            StudentService.editMessage(this.state.message.id)//actualizamos el tipo de mensaje
            .then(response => {
            }).catch(error => {
                console.log(error.message);
            })
        }
    }

    acceptRequest = () => {
        //si el mensaje es una solicitud de unirse a un equipo
        if (this.state.message.tipo === 2) {
            var idMessage = this.state.message.id;
            var idGroup = this.state.message.idGrupo;
            var idIssuer = this.state.message.idEmisor;
            var idReceiver = this.state.message.idReceptor;
            var idCreatorTeam = this.state.message.idCreador;
            var mensaje = this.state.message.mensaje;
            var date = this.state.message.fecha;
            var active = this.state.message.activo;
            let dataMessage = [{ id: idMessage, idGrupo: idGroup, idEmisor: idIssuer, idReceptor: idReceiver, idCreador: idCreatorTeam, mensaje: mensaje, tipo: 0, fecha: date, activo: active }];
            this.setState({ message: dataMessage[0] });
            var idMember;
            //Obtengo el id del futuro miembro del equipo, identifica si el idEmisor/idReceptor
            //es el futuro miembro
            if (this.state.idBossTeam === dataMessage[0].idEmisor)
                idMember = dataMessage[0].idReceptor;
            else 
                idMember = dataMessage[0].idEmisor;
            //estudiante se une al equipo
            StudentService.joinTeam(this.state.team.id, idMember)
                .then(response => {
                    this.showModalAcceptJoinTeam();
                    //modifico el tipo de mensaje 
                    StudentService.editMessage(dataMessage[0].id)
                        .then(response => {

                        }).catch(error => {
                            console.log(error.message);
                        })
                }).catch(error => {
                    console.log(error.message);
                })
        }
        else {
            this.showModalAnswerJoinTeam();
        }
    }

    refuseRequest = () => {
        if (this.state.message.tipo === 2) {
            this.showModalRefuseJoinTeam();
            StudentService.editMessage(this.state.message.id)
                .then(response => {
                }).catch(error => {
                    console.log(error.message);
                })
        }
        else {
            this.showModalAnswerJoinTeam();
        }
    }

    showModalAcceptJoinTeam = () => {
        this.setState({
            //   form: dato,
            modalAcceptJoinTeam: true,
        });
        setTimeout(
            () => this.setState({ modalAcceptJoinTeam: false }),
            2000
        );
    };

    showModalAnswerJoinTeam = () => {
        this.setState({
            //   form: dato,
            modalAnswerJoinTeam: true,
        });
        setTimeout(
            () => this.setState({ modalAnswerJoinTeam: false }),
            2000
        );
    };

    showModalSenderhasTeam = () => {
        this.setState({
            //   form: dato,
            modalSenderHasTeam : true,
        });
        setTimeout(
            () => this.setState({ modalSenderHasTeam: false }),
            2000
        );
    };


    showModalRefuseJoinTeam = () => {
        this.setState({
            modalRefuseJoinTeam: true,
        });
        setTimeout(
            () => this.setState({ modalRefuseJoinTeam: false }),
            2000
        );
    };

    /*Dibuja la pagina  */
    render() {
        const { message, showButtons } = this.state;
        // let formatedDate;
        return (
            <>
                <div className="editPerfil-left">
                    <img  className={"img-editprofile"} src="/plumaliteratura.png" alt=""/>
                </div>
                <div className="container">
                    <Card className="card-edit">
                        <Card.Body >
                            <div className={"row-edit"}>
                                <div className={"section-title"}>
                                    <h2>Mensaje</h2>
                                </div>
                            </div>
                            <div className="row-edit">
                                {showButtons ? (
                                    <div class="message-inputs">
                                        <div className={"row-edit"}>
                                            <h6>{this.state.message.mensaje}</h6>
                                        </div>
                                        <div className="form-select">
                                            <Button variant="outline-primary"  onClick={() => this.askAcceptRequest()} > Aceptar</Button>
                                        </div>
                                        <div className="form-select">
                                            <div className={"form-button"}>
                                                <Button  variant="outline-danger" onClick={() => this.refuseRequest()}> Rechazar</Button>
                                            </div>
                                        </div>
                                    </div>

                                ) : (
                                    <div class="message-inputs">
                                        <label className='message-label' > Mensaje </label>
                                        <td><textarea name="mensaje" rows="10" cols="70" value={this.state.message.mensaje} readOnly={true} style={{ resize: "none" }} ></textarea></td>
                                    </div>
                                )}
                                <div className="form-select">
                                    <div className={"form-button-column"}>
                                        <Button variant="secondary" onClick={() => window.location.href = "/student/messenger"}>Volver</Button>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                <Modal show={this.state.modalAcceptJoinTeam}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p> Has aceptado la solicitud</p>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalRefuseJoinTeam}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p> Has rechazado la solicitud</p>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalAnswerJoinTeam}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p> Ya has respondido a la solicitud</p>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalSenderHasTeam}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p> El estudiante ya tiene equipo</p>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default Message;