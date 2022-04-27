/*
*  Name_file :CreateGroup.js
*  Description: Pagina que sirve para crear grupos nuevos
*/

import React, { Component } from 'react';
import teacherService from '../../../services/teacher/teacherService';
import AuthUser from '../../../services/authenticity/auth-service.js';

/**Estilos CSS*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

/**Estilos*/
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import Alert from 'react-bootstrap/Alert';

class CreateGroup extends Component {

    constructor(props) {
        super(props);

        this.onModal = this.onModal.bind(this);

        this.state = {
            data: [],
            onModal: false,
            modalCreateGroup: false,
            filteredData: [],
            groupName: '',
            currentUserId: '',
            currentUserRole: '',

        };
    }

    /*Si vuelvo a la pagina de login, comprueba si el usuario ya inicio sesion anteriomente
   si es el caso lo redirige a la home segun su rol*/
    componentDidMount() {

        const dataUser = AuthUser.getCurrentUser();
        this.setState({
            currentUserId: dataUser.id
        });
        this.setState({
            currentUserRole: dataUser.rol
        });

    }

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleChangeName = async e => {
        await this.setState({
            [e.target.name]: e.target.value
        });
    }

    /*Crea un grupo*/
    createGroup = () => {
        this.onModalCreateGroup(false);
        this.onModalCreateGroup(false);
        teacherService.createGroup(this.state.currentUserId, this.state.groupName).then(response => {
            console.log(response);
            window.location.href = '/teacher/createGroup';
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Cambia estado del modal*/
    onModal(modal) {
        this.setState({
            onModal: modal
        });
    }

    //Comprueba si el nombre del grupo es bacio
    checkCreateGroup() {
        //Comprueba si el campo está vacío
        if (this.state.groupName == '')
            this.onModal(true);
        else
            this.onModalCreateGroup(true);
    }

    //modal de crearGrupo
    onModalCreateGroup = (modal) => {
        this.setState({
            modalCreateGroup: modal,
        });
    };

    /*Dibuja la pagina  */
    render() {
        return (
            <div className="container">
                <Card className="card-long">
                    <Card.Body>
                        <div className={"row-edit"}>
                            <div className={"section-title"}>
                                <h2>Crear un grupo</h2>
                            </div>
                            <br />
                            <Alert variant={"info"}>
                                <img src="/info.png" alt="" />
                                 Introduzca el nombre del nuevo grupo que desea crear.
                            </Alert>
                        </div>
                        <div className={"row-edit"}>
                            <label className="form-label">Nombre del grupo nuevo : </label>
                            <input placeholder="Ingrese un nombre"
                                className="form-control" type="text"
                                name="groupName"
                                onChange={this.handleChangeName}
                            />
                            <br />
                            <Button variant="primary" onClick={() => this.checkCreateGroup()}>Aceptar</Button>
                        </div>
                    </Card.Body>
                </Card>
                <Modal
                    centered
                    show={this.state.onModal}
                    onHide={this.state.onModal}
                >
                    <Modal.Header>
                        <Modal.Title>
                            Ups...
                                </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        No ha ingresado un nombre
                            </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.onModal(false)}>Atras</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.modalCreateGroup}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p> ¿Está seguro de crear el grupo?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => this.createGroup()}>Aceptar</Button>
                        <Button variant="danger" onClick={() => this.onModalCreateGroup(false)}>Cancelar</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default CreateGroup;
