/*
*  Name_file :Writing.js
*  Description: Pagina del Escrito
*/
import React, { Component, forwardRef } from 'react';

/*Importaciones del editor */
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

/**Datos del usuario */
import AuthUser from '../../../services/authenticity/auth-service.js';

/**Servicios del estudiante */
import StudentService from '../../../services/student/student-service.js';

/*Importacion del css*/
import '../../../styles/Writing.css';
import '../../../styles/Challenge.css';
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

/*Componentes de estilos Bootstrap*/
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from 'react-bootstrap/Button';

class CreateWriting extends Component {

    constructor(props) {
        super(props);

        this.onFileChange = this.onFileChange.bind(this);

        this.state = {
            imgCollection: [],//ficheros multimedia del escrito
            dataTeamStudent: [],//Contiene los datos del equipo del estudiante
            editorState: EditorState.createEmpty(),
            challenge: '',//contiene el desafio
            dataMediaChallenge: [],//array de multimedia del desafio
            modalCreateWriting:false,
            formErrors: {
                title: '',
                description: '',
            },
            form: {
                idWriter: '',//idUser/idTeam según el tipo de desafío
                title: '',//nombre del escrito 
                escrito: '',//descripcion del escrito
            },
            maxIdWriting: -1
        }
    }

    onModalCreateWriting(modal) {
        this.setState({
            modalCreateWriting: modal
        });
    }

    componentDidMount() {
        /*Obtiene el desafio seleccionado por el estudiante*/
        StudentService.getChallenge(this.props.match.params.idChallenge).then(response => {
            this.setState({
                challenge: response[0]
            });
            //Si es colaborativo
            if (response[0].colaborativo === 2) {
                /*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
                StudentService.getTeamStudentGroup(AuthUser.getCurrentUser().id, this.props.match.params.idGroup)
                    .then(response => {

                        this.setState({
                            dataTeamStudent: response,
                            form: {
                                ...this.state.form,
                                idWriter: response[0].idEquipo
                            }
                        });
                    }).catch(error => {
                        console.log(error.message);
                    })
            }
            else {//es individual
                this.setState({
                    dataTeamStudent: response,
                    form: {
                        ...this.state.form,
                        idWriter: AuthUser.getCurrentUser().id
                    }
                });
            }
        }).catch(error => {
            console.log(error.message);
        });

        /*Obtiene multimedia del desafio*/
        StudentService.getMultimediaChallenge(this.props.match.params.idChallenge)
            .then(response => {
                var respuesta = response.data[0];//hay que cambiar

                this.setState({
                    dataMediaChallenge: response.data
                });
            }).catch(error => {
                console.log(error.message);
            });

        /* Obtiene el último escrito, es decir, el máximo id de escrito */
        StudentService.getHighestidWriting()
            .then(response => {
                this.setState({
                    maxIdWriting: response[0].maxIdWriting
            });
        }).catch(error => {
            console.log(error.message);
        });
        
    }

    /*Envia el escrito y multimedia del estudiante y también añade una entrada en la tabla versionescrito */
    createWriting = () => {
        this.onModalCreateWriting(false);
        //Compruebo si no se ha creado un escrito anteriormente 
        StudentService.getWritingWriter(this.props.match.params.idGroup, this.props.match.params.idChallenge, this.state.form.idWriter)
            .then(response => {
                //si no se hay escritos creados anteriormente
                if (response.data.length == 0) {
                    /**Si el estudiante/equipo ha escrito algo se envia */
                    if (this.state.form.escrito !== '') {
                        /*Envia el escrito del estudiante*/
                        StudentService.createWriting(this.props.match.params.idGroup, this.props.match.params.idChallenge, this.state.form.idWriter, this.state.form.title, this.state.form.escrito, this.state.challenge.colaborativo)
                            .then(response => {
                                if (this.state.imgCollection.length > 0) {
                                    /*Envia los archivos multimedia del estudiante*/
                                    StudentService.sendMultimedia(this.state.imgCollection, this.state.form.idWriter, this.props.match.params.idChallenge, this.state.challenge.colaborativo)
                                        .then(response => {
                                             window.location.href = '/student/groups';
                                        }).catch(error => {
                                            console.log(error.message);
                                        });
                                }
                                else {
                                    window.location.href = '/student/groups';
                                }
                            })
                            .catch(error => {
                                console.log(error.message);
                            });

                        StudentService.insertVersionfromWriting(this.state.maxIdWriting + 1, 1, this.props.match.params.idChallenge, this.state.form.idWriter, this.state.form.title, this.state.form.escrito, this.state.challenge.colaborativo)
                    
                    }
                }
                else {
                    var opcion = window.confirm("Ha ocurrido un error ya existe un escrito creado");
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    //Carga los ficheros multimedia del escrito 
    onFileChange(e) {
        this.setState({ imgCollection: e.target.files });
    }

    //Convierte la descripción del escrito a html y lo guarda en el form
    editorChange = () => {
        this.setState({
            form: {
                ...this.state.form,
                escrito: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            }
        });
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    //Obtiene el nombre de los ficheros multimedia desafio/escrito
    showTitle = (challenge) => {
        var str = challenge.ruta;
        var res = str.split("/");
        return res[8];
    }

    onChangeWritingName = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = { ...this.state.formErrors };
        switch (name) {
            case "title":
                formErrors.title =
                    value.length < 1 ? "Campo obligatorio requerido" : "";
                break;
            default:
                break;
        }
        this.setState({
            formErrors,
            form: {
                ...this.state.form,
                title: e.target.value
            }
        });
    }

    //Muestra el tipo de desafio
    showTypeChallenge = () => {

        if (this.state.challenge.colaborativo === 1) {
            return "Escrito individual"
        }
        else {
            return "Escrito Colaborativo"
        }
    }

    //Desactiva boton
    disabledButton = () => {
        if (this.state.form.title.length === 0  || this.state.form.escrito.length === 0 || this.state.form.escrito === "<p></p>\n") {
            return true;//desactivar
        }
        else
            return false;
    };

    /*Dibuja la pagina */
    render() {
        const { editorState, dataMediaChallenge, formErrors } = this.state;
        return (
            <div className="container">
                <Card className="card-long">
                    <Card.Body >
                        <div className={"row-edit"}>
                            <div className={"section-title"}>
                                <h2>{this.showTypeChallenge()}</h2>
                            </div>
                        </div>
                        <br />
                        <div className={"row-edit"}>
                            <label className={"form-label"}>Detalles del desafío</label>
                        </div>
                        <hr />
                        <div className="row-edit">
                            <ul className={"flex-row"}>
                                <li className={"flex-item-form"}>
                                    <label className='form-label'>Nombre del desafío</label>
                                    <h5> {this.state.challenge.titulo} </h5>
                                </li>
                                <li className={"flex-item-form"}>
                                    <label className='form-label'>Categoria</label>
                                    <h5>{this.state.challenge.nombre}</h5>
                                </li>
                            </ul>
                        </div>
                        <div className={"row-edit"}>
                            <label className='form-label'>Leer la descripción del Desafío</label>
                            <div className="challenge-inputs" dangerouslySetInnerHTML={{ __html: this.state.challenge.descripcion }}></div>
                        </div>
                        <div className="row-edit">
                            <label className='form-label'>Ficheros Multimedia: </label>
                            {dataMediaChallenge.length > 0 ? (
                                <table>
                                    <tbody>
                                        <div className={"table-multi"}>
                                            {dataMediaChallenge.map((challenge) => (
                                                <tr key={challenge.id}>
                                                    <td>{this.showTitle(challenge)}</td>
                                                    <div className={"form-button"}>
                                                        <td><Button onClick={() => window.open(challenge.ruta)}>Ver</Button></td>
                                                    </div>
                                                </tr>
                                            ))}
                                        </div>
                                    </tbody>
                                </table>
                            ) : (
                                <div className="row-edit">
                                    <p>No hay ficheros para mostrar</p>
                                </div>
                            )}
                        </div>
                        <br />
                        <div className={"row-edit"}>
                            <label className={"form-label"}>Espacio de Escritura</label>
                        </div>
                        <hr />
                        <div className="row-edit">
                            <div className={"form-inputs"}>
                                <label className='form-label'>Titulo</label>
                                <div>
                                    <input
                                        className={formErrors.title.length > 0 ? "error" : "form-input"}
                                        type="text"
                                        name="title"
                                        placeholder="Escribe el título"
                                        value={this.state.form.title}
                                        // onChange={this.handleChange}
                                        onChange={this.onChangeWritingName}
                                    />
                                    {formErrors.title.length > 0 && (
                                        <span className="alert-login">{formErrors.title}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row-edit">
                            <label className='form-label'> Descripción </label>
                            <Editor
                                editorState={editorState}
                                // toolbarClassName="toolbarClassName"
                                // wrapperClassName="wrapperClassName"
                                // editorClassName="editorClassName"
                                wrapperClassName="wrapperClassName1"
                                editorClassName="editorClassName1"
                                toolbarClassName="toolbarClassName1"
                                onEditorStateChange={this.onEditorStateChange}
                                //onChange={this.editorChange}
                                onChange={
                                    (event, editor) => {
                                        let formErrors = { ...this.state.formErrors };
                                        if (!editorState.getCurrentContent().hasText()) {
                                            formErrors.description = "Campo texto Vacío";
                                        }
                                        else {
                                            formErrors.description = "";
                                        }
                                        this.setState({
                                            formErrors,
                                            form: {
                                                ...this.state.form,
                                                escrito: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
                                            }
                                        });
                                    }
                                }
                                className={formErrors.description.length > 0 ? "error" : "form-control"}
                            />
                            {formErrors.description.length > 0 && (
                                <span className="alert-login">{formErrors.description}</span>
                            )}
                        </div>
                        <br />
                        <div class="row-edit">
                            <label className='form-label'>Puedes agregar un fichero multimedia si lo deseas (imagen,video o audio): </label>
                            <div className="form">
                                <input type="file" name="imgCollection" onChange={this.onFileChange} multiple />
                            </div>
                        </div>
                        <br />
                        <div className={"row-edit"}>
                            <div className="form-button">
                                <Button text='enviar' onClick={() => this.onModalCreateWriting(true)} disabled={this.disabledButton()}> Enviar  </Button>
                            </div>
                            <div className="form-button">
                                <Button onClick={() => window.location.href = '/student/challengesTabs'}>Cancelar</Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Modal show={this.state.modalCreateWriting}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                    <p> ¿Estás seguro de enviar el escrito?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => this.createWriting()}>Aceptar</Button>
                        <Button variant="danger" onClick={() => this.onModalCreateWriting(false)}>Cancelar</Button>
                    </Modal.Footer>
                </Modal>           
            </div>

        );
    }
}

export default CreateWriting;