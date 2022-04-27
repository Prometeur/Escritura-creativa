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
import '../../../styles/Writing.css';
import '../../../styles/Student.css';

import moment from 'moment';

/**Servicios del estudiante */
import StudentService from '../../../services/student/student-service.js';

// Componentes estilos
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Card from "react-bootstrap/Card";
import Alert from 'react-bootstrap/Alert';

//Estilos
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

class Messenger extends Component {

    constructor(props) {
        super(props);
        //const dataUser = AuthUser.getCurrentUser();
        this.state = {
            dataMessages: [],
            showMessages: false,
            modalDeleteMessage: false,
            // dataTeamStudent: []
        }
    }

    componentDidMount() {
        //Obtiene los mensajes del usuario 
        StudentService.getMessages(AuthUser.getCurrentUser().id)
            .then(response => {
                if (response.length > 0) {
                    this.setState({
                        dataMessages: response,
                        showMessages: true,
                        deleteMessage: "",
                    });

                }

            }).catch(error => {
                console.log(error.message);
            })

    }

    deleteMessage = (message) => {
        this.closeModalDeleteMessage();
        var contador = 0;
        var arreglo = this.state.dataMessages;
        arreglo.map((registro) => {
            if (message.id === registro.id) {
                arreglo.splice(contador, 1);
            }
            contador++;
        });
        this.setState({ dataMessages: arreglo });
        if(arreglo.length===0){
            this.setState({ showMessages: false });
        }
        StudentService.deleteMessage(message.id).then(response => {
        }).catch(error => {
            console.log(error.message);
        })
    }

    askDeleteMessage = (message) => {
        this.setState({
            modalDeleteMessage: true,
            deleteMessage: message
        });
    }
    //Cierra el modal de eliminar fichero
    closeModalDeleteMessage = () => {
        this.setState({ modalDeleteMessage: false });
    };

    /*Dibuja la pagina  */
    render() {
        const { showMessages } = this.state;
        let formatedDate;
        return (
            <>
                <div className="editPerfil-left">
                    <img  className={"img-editprofile"} src="/plumaliteratura.png" alt=""/>
                </div>
                <div className="container">
                    <Card className="card-long">
                        <Card.Body>
                            {showMessages ? (
                                <>
                                     <div className={"row-edit"}>
                                        <div className={"section-title"}>
                                            <h2>Lista de mensajes</h2>
                                        </div>
                                     </div>
                                    <div className="row-edit">
                                        <Alert variant={"info"}>
                                            <img src="/message.png" alt=""/>
                                             mensajeria de  invitaciones para unirte a un equipo.
                                        </Alert>
                                    </div>
                                    <div className="row-edit">
                                        <div className="table-margin">
                                            <Table striped bordered hover responsive>
                                                <thead>
                                                <tr>
                                                    <th>Emisor</th>
                                                    <th>Grupo</th>
                                                    <th>Mensaje</th>
                                                    <th>Fecha</th>
                                                    <th>Hora</th>
                                                    <th>Acciones</th>
                                                    <th></th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {this.state.dataMessages.map(message => {
                                                    return (
                                                        <tr key={message.id}>
                                                            <td>{message.correo}</td>
                                                            <td>{message.nombreGrupo}</td>
                                                            <td><div className="message-text">{message.mensaje}</div></td>
                                                            <td>{formatedDate = moment(message.fecha).format('DD/MM/YYYY')}</td>
                                                            <td>{formatedDate = moment(message.fecha).format('LT')}</td>
                                                            <td>
                                                                <Link to={`/student/message/${message.id}`} >
                                                                    <img  className={"img-icon"} src="/view.png" alt=""/>
                                                                    Ver
                                                                </Link>
                                                            </td>
                                                            <td >
                                                                <img
                                                                    className={"img-icon"}
                                                                    src="/delete.png"
                                                                    alt=""
                                                                />
                                                                {/* <Link onClick={() => this.askDeleteMessage(message)} >Eliminar</Link> */}
                                                                <Button size={"sm"} variant="danger" onClick={() => this.askDeleteMessage(message)}>
                                                                    Eliminar
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                                </tbody>
                                            </Table>
                                        </div>
                                     </div>
                                 </>
                            ) : (
                                <div className="row-edit">
                                    <Alert variant={"danger"}>
                                        <img src="/message.png" alt=""/>
                                        No hay mensajes que mostrar.
                                    </Alert>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </div>
                

                <Modal show={this.state.modalDeleteMessage}>
                    <Modal.Header>
                        <div><h5>¿Seguro que desea eliminar el mensaje?</h5> </div>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <FormGroup>
                        </FormGroup> */}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => this.deleteMessage(this.state.deleteMessage)}>Aceptar</Button>
                        <Button variant="danger" onClick={() => this.closeModalDeleteMessage()}>Cancelar</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default Messenger;