/**
 *
 *  Name_file: EditProfile.js
 *  Description: Ventana  de modificación de datos para los usuarios de la aplicación.
 *
 * */

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../../services/authenticity/auth-service";
import StudentService from "../../../services/student/student-service.js";
import { isEmail } from "validator";


/** Estilos CSS*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

/**Estilos Bostrap*/
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Alert from "react-bootstrap/Alert";



const required = value => {
    if (!value) {
        return (
            <Alert variant="danger" bsPrefix="alert-login">
                Los campos deben contener algún dato
            </Alert>
        );
    }
};

const email = value => {
    if (!isEmail(value)) {
        return (
            <Alert variant="danger" bsPrefix="alert-login">
                Este correo no es valido.
            </Alert>
        );
    }
};

const vusername = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <Alert variant="danger" bsPrefix="alert-login">
                El nombre del usuario debe tener entre 3 a 20 caracteres.
            </Alert>
        );
    }
};

const vsurname = value => {
    if (value.length < 3 || value.length > 20) {
        return (
            <Alert variant="danger" bsPrefix="alert-login">
                El Apellido del usuario debe tener entre 3 a 20 caracteres.
            </Alert>
        );
    }
};

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <Alert variant="danger" bsPrefix="alert-login">
                La contraseña debe tener entre 6 y 40 caracteres.
            </Alert>
        );
    }
};

const vconfirmpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <Alert variant="danger" bsPrefix="alert-login">
                La contraseña debe tener entre 6 y 40 caracteres.
            </Alert>
        );
    }
};

export default class Profile extends Component {

    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
        // this.onFileChange = this.onFileChange.bind(this);
        this.onModal = this.onModal.bind(this);
        this.onTeamModal = this.onTeamModal.bind(this);
        this.onDeleteModal = this.onDeleteModal.bind(this);
        this.onUpdateModal = this.onUpdateModal.bind(this);

        this.state = {

            saveModal: false,
            deleteModal: false,
            teamModal: false,
            updateModal: false,
            currentUser: [],
            StudentTeams: [],
            updateUser: {
                username: '',
                surname: '',
                password: '',
                confirmPassword: '',
                email: '',
                photo: [],
                file: '',
                reader: '',
                name:"",//nombre fichero
            }
        };
    }


    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();
       
        if(currentUser.ruta !== null || currentUser.ruta !=""){
            var res = currentUser.ruta.split("/");
            this.setState({
                updateUser: {
                    ...this.state.updateUser,
                    name:res[6],
                }
            });
        }
        
        this.setState({ currentUser: currentUser });
        this.setState({
            updateUser: {
                ...this.state.updateUser,
                username: currentUser.username,
                surname: currentUser.surname,
                email: currentUser.email,
            }
        });

    }

    onChangeUsername(e) {

        if (e.target.value != this.state.currentUser.username) {
            this.setState({
                updateUser: {
                    ...this.state.updateUser,
                    username: e.target.value
                }
            });
        }
    }

    onChangeSurname(e) {

        if (e.target.value != this.state.currentUser.surname) {
            this.setState({
                updateUser: {
                    ...this.state.updateUser,
                    surname: e.target.value
                }
            });
        }
    }


    onChangeEmail(e) {

        if (e.target.value != this.state.currentUser.email) {
            this.setState({
                updateUser: {
                    ...this.state.updateUser,
                    email: e.target.value
                }
            });
        }
    }

    onChangePassword(e) {

        if (e.target.value != this.state.currentUser.password) {
            this.setState({
                updateUser: {
                    ...this.state.updateUser,
                    password: e.target.value
                }
            });
        }
    }

    onChangeConfirmPassword(e) {

        this.setState({
            updateUser: {
                ...this.state.updateUser,
                confirmPassword: e.target.value
            }
        });
    }

    onModal(modal) {

        this.setState({
            saveModal: modal
        });
    }

    onTeamModal(modal) {

        this.setState({
            teamModal: modal
        });
    }

    onDeleteModal(modal) {

        this.setState({
            deleteModal: modal
        });
    }

    onUpdateModal(modal) {

        this.setState({
            updateModal: modal
        });
    }


    onFileChange2 = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type.includes("image")) {
                const reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = () => {
                    this.setState({
                        updateUser: {
                            ...this.state.updateUser,
                            reader: reader.result
                        }
                    });
                }
                this.setState({
                    updateUser: {
                        ...this.state.updateUser,
                        file: file,
                        name: file.name,
                    }
                });
            }
            else 
                console.log("there was an error")
        }
    }


    logout() {
        AuthService.logout();
    }

    editProfile() {
        var aux="";
        if( this.state.currentUser.ruta !="" ){
            var res = this.state.currentUser.ruta.split("/");
            aux=res[6];
        }
        if (this.state.updateUser.surname == this.state.currentUser.surname
            && this.state.updateUser.username == this.state.currentUser.username
            && this.state.updateUser.password == '' && this.state.updateUser.email == this.state.currentUser.email
            && this.state.updateUser.confirmPassword == '' && this.state.updateUser.photo.length == 0 &&
            this.state.updateUser.name == aux) {
            this.onUpdateModal(true);
            this.onModal(false);
        } else {
            if (this.state.updateUser.password == this.state.updateUser.confirmPassword) {
                AuthService.editProfile(this.state.currentUser.id, this.state.updateUser.username, this.state.updateUser.surname,
                    this.state.updateUser.email, this.state.updateUser.password, this.state.updateUser.photo).then(response => {
                        this.logout();
                        window.location.href = '/login';
                    }).catch(error => {
                        console.log(error.message);
                    })

                //Si ha seleccionado una imagen, actualiza la foto
                if (this.state.updateUser.file !== "") {
                    AuthService.updatePhoto(this.state.currentUser.id, this.state.updateUser.file, 3)
                        .then(response => {
                            console.log("todo correcto");

                        }).catch(error => {
                            console.log(error.message);
                        })
                }
                else {
                    this.onUpdateModal(true);
                    this.onModal(false);
                }
            } else {
                alert("Ambas contraseñas no coinciden");
            }
        }
    }

    deleteUser() {

        if (this.state.currentUser.rol == 'S') {
            StudentService.getTeams(this.state.currentUser.id).then(response => {
                this.setState({ StudentTeams: response });
                console.log(this.state.StudentTeams);
                if (this.state.StudentTeams.length > 0) {
                    this.setState({ teamModal: true });
                    this.setState({ deleteModal: false });
                }

            }).catch(error => {
                console.log(error.message);
            })
        } else {
            AuthService.disableProfile(this.state.currentUser.id).then(response => {
                this.logout();
                window.location.href = '/login';
            }).catch(error => {
                console.log(error.message);
            });
        }

    }

    render() {
        let media1 = "";
        if (this.state.updateUser.file.type !== undefined) {//si hemos previsualizado un archivo
            if (this.state.updateUser.file.type.includes("image"))
                media1 = <img className="image" src={this.state.updateUser.reader} />;
        }
        return (
            <>
                <div className="editPerfil-left">
                    <div className={"form-button"}>
                        <Button size={"sm"} variant="danger" onClick={() => this.onDeleteModal(true)}>
                            Dar de baja esta cuenta
                        </Button>
                    </div>
                    <img  className={"img-editprofile-button"} src="/plumaliteratura.png" alt=""/>
                </div>
                <div className="container">
                    <Card className="card-profile">
                        <Card.Body>
                            <div className={"row-edit"}>
                                <div className={"section-title"}>
                                    <h2>Modificar Datos</h2>
                                </div>
                            </div>
                            <Form
                                onSubmit={this.handleRegister}
                                ref={c => {
                                    this.form = c;
                                }}
                            >
                                {!this.state.successful && (
                                    <ul className="flex-container wrap">
                                        <li className="flex-item">
                                            <label className="form-label">Nombre</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="username"
                                                placeholder={this.state.currentUser.username}
                                                value={this.state.updateUser.username}
                                                onChange={this.onChangeUsername}
                                                validations={[required, vusername]}
                                            />
                                        </li>
                                        <li className="flex-item">
                                            <label className="form-label">Apellidos</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="surname"
                                                placeholder={this.state.currentUser.surname}
                                                value={this.state.updateUser.surname}
                                                onChange={this.onChangeSurname}
                                                validations={[required, vsurname]}
                                            />
                                        </li>
                                        <li className="flex-item">
                                            <label className="form-label">Correo</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                name="email"
                                                placeholder={this.state.currentUser.email}
                                                value={this.state.updateUser.email}
                                                onChange={this.onChangeEmail}
                                                validations={[required, email]}
                                            />
                                        </li>
                                        <li className="flex-item-file">
                                            <label className="form-label">Foto de perfil</label>
                                            {media1}
                                            <input type="file" name="photo" onChange={this.onFileChange2} />
                                           
                                        </li>

                                        <li className="flex-item">
                                            <label className="form-label">Contraseña</label>
                                            <Input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                placeholder="Nueva contraseña"
                                                value={this.state.updateUser.password}
                                                onChange={this.onChangePassword}
                                                validations={[required, vpassword]}
                                            />
                                        </li>
                                        <li className="flex-item">
                                            <label className="form-label">Confirmar contraseña</label>
                                            <Input
                                                type="password"
                                                className="form-control"
                                                name="confirmpassword"
                                                placeholder="Confirmar nueva contraseña"
                                                value={this.state.updateUser.confirmPassword}
                                                onChange={this.onChangeConfirmPassword}
                                                validations={[required, vconfirmpassword]}
                                            />
                                        </li>
                                    </ul>

                                )}

                                {this.state.message && (
                                    <div className="form-group">
                                        <div
                                            className={
                                                this.state.successful
                                                    ? "alert alert-success"
                                                    : "alert alert-danger"
                                            }
                                            role="alert"
                                        >
                                            {this.state.message}
                                        </div>
                                    </div>
                                )}
                                <CheckButton
                                    style={{ display: "none" }}
                                    ref={c => {
                                        this.checkBtn = c;
                                    }}
                                />
                            </Form>
                            <br/>
                            <div className="section-card">
                                <div className="form-button">
                                    <Button onClick={() => this.onModal(true)}>Guardar</Button>
                                </div>
                                <div className="form-button">
                                    <Button href="/profile">Cancelar</Button>
                                </div>
                            </div>

                            <Modal
                                centered
                                show={this.state.saveModal}
                                onHide={this.state.saveModal}
                            >
                                <Modal.Header>
                                    <h4>Aviso</h4>
                                    <img src="exclamation.png"></img>
                                </Modal.Header>
                                <Modal.Body>
                                    <p>
                                        ¿Esta seguro de aplicar estos cambios?
                                        Deberá iniciar nuevamente sesión de su cuenta
                                    </p>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={() => this.editProfile()}>Aceptar</Button>
                                    <Button variant="secondary" onClick={() => this.onModal(false)}>Cancelar</Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal
                                centered
                                show={this.state.teamModal}
                                onHide={this.state.teamModal}
                            >
                                <Modal.Header>
                                    <Modal.Title>Aviso</Modal.Title>
                                    <img src="exclamation.png"></img>
                                </Modal.Header>
                                <Modal.Body>
                                    <h6>Para poder dar de baja su cuenta, debe darse de baja en los siguientes
                                        equipos</h6>
                                    <ul>
                                        {this.state.StudentTeams.map((team, index) =>
                                            <li>{team.nombreEquipo}</li>
                                        )}
                                    </ul>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.onTeamModal(false)}>atras</Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal
                                centered
                                show={this.state.deleteModal}
                                onHide={this.state.deleteModal}
                            >
                                <Modal.Header>
                                    <Modal.Title>
                                        ¿Esta seguro/a?
                                </Modal.Title>
                                    <img src="triangle.png"></img>
                                </Modal.Header>
                                <Modal.Body>
                                    Si en algún momento quieres volver, podrás hacerlo contactando con nuestro equipo de
                                    apoyo o a tu centro de estudio.
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={() => this.deleteUser()}>aceptar</Button>
                                    <Button variant="danger" onClick={() => this.onDeleteModal(false)}>Cancelar</Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal
                                centered
                                show={this.state.updateModal}
                                onHide={this.state.updateModal}
                            >
                                <Modal.Header>
                                    <Modal.Title>
                                        Ups...
                                    </Modal.Title>
                                    <img src="triangle.png"></img>
                                </Modal.Header>
                                <Modal.Body>
                                    No hay cambios que modificar
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.onUpdateModal(false)}>atras</Button>
                                </Modal.Footer>
                            </Modal>
                        </Card.Body>
                    </Card>
                </div>
            </>
        );
    }
}
