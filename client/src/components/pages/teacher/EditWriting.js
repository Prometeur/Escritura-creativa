/*
*  Name_file :EditWriting.js
*  Description: Pagina de editar Escrito
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";

/*Importaciones del editor */
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { stateFromHTML } from 'draft-js-import-html';// escribe el 'html' en el editor
// import EditorText from '../../TextEditor/TextEditor.js';

/**Datos del usuario */
import AuthUser from '../../../services/authenticity/auth-service.js';

/**Servicios del estudiante */
import TeacherService from '../../../services/teacher/teacherService.js';

/*Importacion del css*/
import '../../../styles/Writing.css';
import '../../../styles/Challenge.css';
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

/*Componentes de estilo Bootstrap*/
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class EditWriting extends Component {
    
    constructor(props) {
        super(props);
        this.onFileChange = this.onFileChange.bind(this);
        this.state = {
            imgCollection: [],//array de ficheros multimedia
            dataTeamStudent: [],//contiene el equipo del estudiante
            contentState: null,//editor
            editorState: EditorState.createEmpty(),
            challenge: '',//contiene el desafio 
            dataMediaChallenge: [],//array de multimedia del desafio
            dataMediaWriting: [],//array de multimedia del escrito
            modalDeleteFile: false,
            deleteFileMedia: '',//fichero multimedia del escrito que desea ser borrado
            nameDeleteFileMedia: '',//nomnbre del fichero multimedia del escrito que desea ser borrado
            writing: '',
            form: {
                idWriter: '',
                title: '',
                escrito: '',
                score: '',
                commentary: '',
                finishWriting: '',
            }
        }
    }

    componentDidMount() {

        /*Obtiene el desafio seleccionado*/
        TeacherService.getChallenge(this.props.match.params.idChallenge)
            .then(response => {
                this.setState({
                    challenge: response[0]
                });
                //Si es colaborativo
                if (response[0].colaborativo === 2) {
                    /*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
                    TeacherService.getTeamStudentGroup(this.props.match.params.idStudent, this.props.match.params.idGroup)
                        .then(response => {
                            this.setState({
                                dataTeamStudent: response,
                                form: {
                                    ...this.state.form,
                                    idWriter: response[0].idEquipo
                                }
                            });

                            /*Obtiene multimedia del escrito del equipo */
                            TeacherService.getMultimediaWriting(this.props.match.params.idChallenge, response[0].idEquipo)
                                .then(response => {
                                    this.setState({ dataMediaWriting: response.data });
                                }).catch(error => {
                                    console.log(error.message);
                                });

                        }).catch(error => {
                            console.log(error.message);
                        })
                }
                else {//si es individual
                    this.setState({
                        dataTeamStudent: response,
                        form: {
                            ...this.state.form,
                            idWriter: this.props.match.params.idStudent
                        }
                    });

                    /*Obtiene multimedia del escrito del estudiante */
                    TeacherService.getMultimediaWriting(this.props.match.params.idChallenge, this.props.match.params.idStudent)
                        .then(response => {
                            this.setState({ dataMediaWriting: response.data });
                        }).catch(error => {
                            console.log(error.message);
                        });
                }

            }).catch(error => {
                console.log(error.message);
            });

        /*Obtiene multimedia del desafio*/
        TeacherService.getMultimediaChallenge(this.props.match.params.idChallenge)
            .then(response => {
                this.setState({ dataMediaChallenge: response.data, });
            }).catch(error => {
                console.log(error.message);
            });

        /*Obtiene el escrito del estudiante */
        TeacherService.getWriting(this.props.match.params.idWriting)
            .then(response => {
                var contentState = stateFromHTML(response.data[0].texto);
                let editorState = EditorState.createWithContent(contentState);
                // this.setState({ editorState: editorState });
                this.setState({
                    writing: response.data[0],
                    editorState: editorState,
                    form: {
                        ...this.state.form,
                        title: response.data[0].nombre,
                        escrito: response.data[0].texto,
                        score: response.data[0].puntuacion,
                        commentary: response.data[0].comentario,
                        finishWriting:response.data[0].finalizado
                    }
                });
            }).catch(error => {
                console.log(error.message);
            });
    }

    //Envia el escrito editado 
    editWriting = () => {
        /*Edita escrito del estudiante*/
        TeacherService.editWriting(this.props.match.params.idWriting, this.props.match.params.idGroup, this.props.match.params.idChallenge, this.state.form.idWriter, this.state.form.title, this.state.form.escrito, this.state.form.score,this.state.form.commentary,this.state.challenge.colaborativo,this.state.form.finishWriting)
            .then(response => {
                window.location.href = '/teacher/groups';

            })
            .catch(error => {
                console.log(error.message);
            });
    }

    //Carga los ficheros multimedia del escrito 
    onFileChange(e) {
        this.setState({ imgCollection: e.target.files });
    }

    //convierte la descripción del escrito a html y lo guarda en el form
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
            editorState
        });
    };

    onContentStateChange = contentState => {
        this.setState({
            contentState
        });
    };

    //Obtiene el nombre de los ficheros multimedia desafio/escrito
    showTitle = (challenge) => {
        var str = challenge.ruta;
        var res = str.split("/");
        return res[8];
    }

    //Muestra modal de confirmación para eliminar fichero multimedia
    askDeleteFile = (writing) => {
        var str = writing.ruta;
        var res = str.split("/");
        this.setState({
            nameDeleteFileMedia: res[8],
            deleteFileMedia: writing
        });
        this.showModalDeleteFile();
    }

    //Muestra el modal de eliminar fichero
    showModalDeleteFile = () => {
        this.setState({
            modalDeleteFile: true,
        });
    };

    //Cierra el modal de eliminar fichero
    closeModalDeleteFile = () => {
        this.setState(
            { modalDeleteFile: false }
            );
    };

    onChangeWritingName = e => {
        this.setState({
            form: {
                ...this.state.form,
                title: e.target.value
            }
        });
    }
    onChangeScore = e => {
        this.setState({
            form: {
                ...this.state.form,
                score: e.target.value
            }
        });
    }

    onChangeCommentary = e => {
        this.setState({
            form: {
                ...this.state.form,
                commentary: e.target.value
            }
        });
    }

    onChangeFinishWriting = e => {
        this.setState({
            form: {
                ...this.state.form,
                finishWriting: e.target.value
            }
        });
    }

    //Desactiva los componentes cuando el profesor no creo el desafio( o no es propietario del desafio)
    disabledComponent= () => {
       if(  AuthUser.getCurrentUser().id !==this.state.challenge.idProfesor)
           return true
       else
       return false;
    };

    /*Dibuja la pagina */
    render() {
        const { dataMediaChallenge } = this.state;
        const { dataMediaWriting } = this.state;
        // const { formErrors } = this.state;
        return (
        <div className="container">
                <Card className="card-long">
                    <Card.Body>
                    <div className={"row-edit"}>
                        <div className={"section-title"}>
                            <h2>Editar Desafío</h2>
                        </div>
                    </div>
                    <div className={"row-edit"}>
                        <label className={"form-label"}>Detalles del desafío</label>
                    </div>
                    <hr/>
                    <ul className={"flex-row"}>
                        <li className={"flex-item-form"}>
                            <label className='form-label'>Nombre</label>
                            <h6> {this.state.challenge.titulo} </h6>
                        </li>
                        <li className={"flex-item-form"}>
                            <label className='form-label'>Categoria</label>
                            <h6>{this.state.challenge.nombre}</h6>
                        </li>
                    </ul>
                    <div className={"row-edit"}>
                        <label className='form-label'>Leer la descripción del Desafío</label>
                        <div className="challenge-inputs"
                             dangerouslySetInnerHTML={{ __html: this.state.challenge.descripcion }}>
                        </div>
                    </div>
                    <div className="row-edit">
                        <label className='form-label'>Ficheros Multimedia</label>
                        <table>
                            <tbody>
                                <div className={"table-multi"}>
                                    {dataMediaChallenge.map((challenge) => (
                                        <tr key={challenge.id}>
                                            <td>{this.showTitle(challenge)}</td>
                                            <td>
                                                <div className={"form-button"}>
                                                    <Button onClick={() => window.open(challenge.ruta)}>Ver</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </div>
                            </tbody>
                        </table>
                    </div>
                    <br/>
                    </Card.Body>
                </Card>
                <Card className="card-long">
                    <Card.Body>
                    <div className={"row-edit"}>
                        <label className={"form-label"}>Escrito del estudiante</label>
                    </div>
                    <hr/>
                    <div className="row-edit">
                        <div className="form-inputs">
                            <label className='form-label'>Título</label>
                            <input
                                className="form-input"
                                type="text"
                                name="title"
                                placeholder="Escribe el título"
                                value={this.state.form.title}
                                onChange={this.onChangeWritingName}
                                disabled={this.disabledComponent()}
                            />
                        </div>
                    </div>
                    <div className="row-edit">
                        <label className='form-label' >Escrito</label>
                        <Editor
                            editorState={this.state.editorState}
                            // toolbarClassName="toolbarClassName"
                            // // wrapperClassName="demo-wrapper"
                            // // editorClassName="border-edit"
                            wrapperClassName="wrapperClassName1"
                            editorClassName="editorClassName1"
                            toolbarClassName="toolbarClassName1"
                            onEditorStateChange={this.onEditorStateChange}
                            onContentStateChange={this.onContentStateChange}
                            onChange={this.editorChange}
                            readOnly={this.disabledComponent()}
                        />
                    </div>
                    <div class="row-edit">
                        <ul className={"flex-row"}>
                            <li className={"flex-item-form"}>
                                <label className='form-label'>Ficheros Multimedia</label>
                                <table>
                                    <tbody>
                                    <div className={"table-multi"}>
                                        {dataMediaWriting.map((writing) => (
                                            <tr key={writing.id}>
                                                <td>{this.showTitle(writing)}</td>
                                                <td>
                                                    <div className="form-button">
                                                        <Button size={"sm"} onClick={() => window.open(writing.ruta)}>Ver</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </div>
                                    </tbody>
                                </table>
                            </li>
                            <li className={"flex-item-form"}>
                                <label className='form-label'>Calificación</label>
                                <td>
                                    <textarea
                                        rows="2"
                                        cols="10"
                                        className={"text-area"}
                                        value={this.state.form.score}
                                        onChange={this.onChangeScore}
                                        style={{ resize: "none", textAlign: "center" }}
                                        disabled={this.disabledComponent()} >
                                    </textarea>
                                </td>
                            </li>
                            <li className={"flex-item-form"}>
                                <div className={"form-select"}>
                                    <label className='form-label'>Escrito Finalizado</label>
                                    <select
                                        value={this.state.form.finishWriting}
                                         onChange={this.onChangeFinishWriting}
                                         disabled={this.disabledComponent()}
                                    >
                                        <option value="" selected disabled hidden > Seleccionar </option>
                                        <option value="1" > Si </option>
                                        <option value="0" > No </option>
                                    </select>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="row-edit">
                        <div className={"form-select"}>
                            <label className='form-label'>Comentarios</label>
                            <td>
                            <textarea
                                className={"text-area-comment"}
                                rows="10" cols="70" value={this.state.form.commentary}
                                onChange={this.onChangeCommentary}
                                disabled={this.disabledComponent()}
                            >
                            </textarea>
                            </td>
                        </div>
                    </div>
                    <div className={"row-edit"}>
                        <div className="form-select">
                            <Button text='enviar' onClick={() => this.editWriting()}> Guardar  </Button>
                        </div>
                        <div className="form-select">
                            <Button onClick={() => window.location.href = '/teacher/groups'}>Cancelar</Button>
                        </div>
                    </div>
                    </Card.Body>
                </Card>

                <Modal show={this.state.modalDeleteFile}
                       onHide={this.state.modalDeleteFile}>
                    <Modal.Header>
                        <div><h5>¿Estás seguro de eliminar {this.state.nameDeleteFileMedia}?</h5> </div>
                    </Modal.Header>
                    <Modal.Body>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.deleteFile(this.state.deleteFileMedia)}>Aceptar</Button>
                        <Button variant="danger" onClick={() => this.closeModalDeleteFile()}>Cancelar</Button>
                    </Modal.Footer>
                </Modal>
        </div>
        );
    }
}
export default EditWriting;