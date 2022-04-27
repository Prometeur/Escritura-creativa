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
import StudentService from '../../../services/student/student-service.js';

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

import Chat from "./Chat"




import socket from "../../../utils/Socket";

class EditWritingTeam extends Component {

    constructor(props) {
        super(props);
        this.onFileChange = this.onFileChange.bind(this);
        this.state = {
            imgCollection: [],//array de ficheros multimedia
            contentState: null,//editor
            editorState: EditorState.createEmpty(),
            challenge: '',//contiene el desafio 
            dataMediaChallenge: [],//array de multimedia del desafio
            dataMediaWriting: [],//array de multimedia del escrito
            modalDeleteFile: false,
            deleteFileMedia: '',//fichero multimedia del escrito que desea ser borrado
            nameDeleteFileMedia: '',//nomnbre del fichero multimedia del escrito que desea ser borrado
            writing: '',
            log: '',
            form: {
                idWriter: '',
                title: '',
                escrito: '',
            }
        }
    }

    componentDidMount() {
        /*Obtiene el desafio seleccionado*/
        StudentService.getChallenge(this.props.match.params.idChallenge)
            .then(response => {
                this.setState({ challenge: response[0] });
                //Si es colaborativo
                if (response[0].colaborativo === 2) {
                    /*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
                    StudentService.getTeamStudentGroup(AuthUser.getCurrentUser().id, this.props.match.params.idGroup)
                        .then(response => {
                            this.setState({
                                form: {
                                    ...this.state.form,
                                    idWriter: response[0].idEquipo
                                }
                            });
                            /*Obtiene multimedia del escrito del equipo */
                            StudentService.getMultimediaWriting(this.props.match.params.idChallenge, response[0].idEquipo)
                                .then(response => {
                                    this.setState({ dataMediaWriting: response.data });
                                }).catch(error => {
                                    console.log(error.message);
                                });
                        }).catch(error => {
                            console.log(error.message);
                        })
                }
            }).catch(error => {
                console.log(error.message);
            });
        /*Obtiene multimedia del desafio*/
        StudentService.getMultimediaChallenge(this.props.match.params.idChallenge)
            .then(response => {
                this.setState({ dataMediaChallenge: response.data, });
            }).catch(error => {
                console.log(error.message);
            });

        /*Obtiene el escrito del estudiante */
        StudentService.getWriting(this.props.match.params.idWriting)
            .then(response => {

                var contentState = stateFromHTML(response.data[0].texto);
                let editorState = EditorState.createWithContent(contentState);
                // this.setState({ editorState: editorState });
                this.setState({
                    writing: response.data[0],
                    editorState: editorState,
                    log: response.data[0].registro,
                    form: {
                        ...this.state.form,
                        title: response.data[0].nombre,
                        escrito: response.data[0].texto

                    }
                });
            }).catch(error => {
                console.log(error.message);
            });
    }

    //Envia el escrito editado 
    editWriting = () => {

        /*Edita escrito del estudiante*/
        StudentService.editWritingTeam(this.props.match.params.idWriting, this.props.match.params.idGroup, this.props.match.params.idChallenge, this.state.form.idWriter, this.state.form.title, this.state.form.escrito, this.state.log, this.state.challenge.colaborativo)
            .then(response => {
                if (this.state.imgCollection.length > 0) {
                    StudentService.sendMultimedia(this.state.imgCollection, this.state.form.idWriter, this.props.match.params.idChallenge, this.state.challenge.colaborativo)
                        .then(response => {
                            // window.location.href = '/student/groups';
                            window.location.href = '/student';
                        }).catch(error => {
                            console.log(error.message);
                        });
                }
                else {
                    window.location.href = '/student';
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    //Elimina el fichero multimedia del escrito
    deleteFile = (writing) => {
        this.closeModalDeleteFile();
        var contador = 0;
        var arreglo = this.state.dataMediaWriting;
        arreglo.map((registro) => {
            if (writing.id === registro.id) {
                arreglo.splice(contador, 1);
            }
            contador++;
        });
        this.setState({ dataMediaWriting: arreglo });
        StudentService.deleteMultimedia(writing.id, writing.ruta)
            .then(response => {
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    //Carga los ficheros multimedia del escrito 
    onFileChange(e) {
        this.setState({ imgCollection: e.target.files });
    }



    //Editor -->convierte la descripción del escrito a html y lo guarda en el form
    editorChange = () => {
        this.setState({
            form: {
                ...this.state.form,
                escrito: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            }
        });
    };

    /**Editor -->almacena el estado del editor(cada vez que se edita el editor)*/
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState
        });
    };

    /**Editor-->almacena todo el contenido que hay en el editor */
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
        this.setState({ modalDeleteFile: false });
    };

    //actualiza el titulo del escrito
    onChangeWritingName = e => {
        this.setState({
            form: {
                ...this.state.form,
                title: e.target.value
            }
        });
    }

    //Devuelve una cadena de tipo de desafio
    showCollaborative = () => {
        if (this.state.challenge.colaborativo === 1) {
            return "Individual"
        }
        else {
            return "Colaborativo"
        }
    }

    /* */
    pruebaChange = (nombre, mensaje, mensajes) => {
        // mensajes.push([nombre,mensaje])
        // let dataMessage = { nombre: nombre, mensaje: mensaje };
        // mensajes.push(dataMessage)

        // mensajes.map((e, i) => (
        //     this.setState({
        //         // log: mensajes
        //         log: this.state.log + "<p>" + "<strong>" + e.nombre + "</strong>" + "<br/>" + e.mensaje + "<br/>" + "</p>"
        //     })
        // ))

        //   this.setState({
        //     log: this.state.log + "<p>"+ "<strong>"+ nombre + "</strong>"+"<br/>" + mensaje + "<br/>" + "</p>"
        // }) 
        
        for (var i=0; i<mensajes.length; i++){
                 this.setState({
                // log: mensajes
                log: this.state.log + "<p>" + "<strong>" + mensajes[i].nombre + "</strong>" + "<br/>" + mensajes[i].mensaje + "<br/>" + "</p>"
            })
        }
    };

    /*Dibuja la pagina */
    render() {
        const { dataMediaChallenge, dataMediaWriting } = this.state;
        // const { formErrors } = this.state;
        return (
            <>
                <div className="container">
                    <label className='form-label'>Editar Escrito {this.showCollaborative()}</label>
                    <Card className="card-edit">
                        <Card.Body>
                            <div className="row-edit">
                                <h2 > {this.state.challenge.titulo} </h2>
                            </div>
                            <div className="row-edit">
                                <label className='form-label'>Categoria</label>
                                <p>{this.state.challenge.nombre}</p>
                            </div>

                            <div className="row-edit">
                                <label className='form-label'>Leer la descripción del Desafío</label>
                                <div className="challenge-inputs" dangerouslySetInnerHTML={{ __html: this.state.challenge.descripcion }}></div>
                            </div>

                            <div className="row-edit">
                                <label className='form-label'>Ficheros Multimedia: </label>
                                <table>
                                    <tbody>
                                        <div style={{ width: "500px", height: "250px", overflow: "scroll", behavior: "smooth" }}>
                                            {dataMediaChallenge.map((challenge) => (
                                                <tr key={challenge.id}>
                                                    <td>{this.showTitle(challenge)}</td>
                                                    <td><Button onClick={() => window.open(challenge.ruta)}>Ver</Button></td>
                                                </tr>
                                            ))}
                                        </div>
                                    </tbody>
                                </table>
                            </div>

                            <div className="form-inputs">
                                <label className='form-label'>Titulo</label>
                                <div>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Escribe el título"
                                        value={this.state.form.title}
                                        // onChange={this.handleChange}
                                        onChange={this.onChangeWritingName}
                                    />
                                </div>
                            </div>

                            <div className="row-edit">
                                <label className='form-label'>Descripción </label>
                                <Editor
                                    editorState={this.state.editorState}
                                    toolbarClassName="toolbarClassName1"
                                    wrapperClassName="wrapperClassName1"
                                    editorClassName="editorClassName1"
                                    onEditorStateChange={this.onEditorStateChange}
                                    onContentStateChange={this.onContentStateChange}
                                    onChange={this.editorChange}
                                />
                                {/* <EditorText onEditorStateChange={this.onEditorStateChange} onContentStateChange={this.onContentStateChange}  onChange={this.editorChange} param={this.state.editorState}/> */}
                            </div>

                            <div class="row-edit">
                                <label className='form-label'>Puedes agregar un fichero multimedia si lo deseas (imagen,video o audio): </label>
                                <div className="form">
                                    <input type="file" name="imgCollection" onChange={this.onFileChange} multiple />
                                </div>
                            </div>

                            <div class="row-edit">
                                <label className='form-label' >Ficheros Multimedia: </label>
                                <table>
                                    <tbody  >
                                        <div style={{ width: "500px", height: "250px", overflow: "scroll", behavior: "smooth" }}>
                                            {dataMediaWriting.map((writing) => (
                                                <tr key={writing.id}>
                                                    <td>{this.showTitle(writing)}</td>
                                                    <td><Button onClick={() => window.open(writing.ruta)}>Ver</Button></td>
                                                    <td><Button variant="danger" onClick={() => this.askDeleteFile(writing)}>Eliminar</Button></td>
                                                </tr>
                                            ))}
                                        </div>
                                    </tbody>
                                </table>
                            </div>

                            <div class="row-edit">
                                <Chat pruebaChange={this.pruebaChange} nombre={AuthUser.getCurrentUser().username} />
                                {/* <Chat  nombre={this.state.manual} /> */}
                            </div>


                            <div className="form-select">
                                <Button text='enviar' onClick={() => this.editWriting()}> Guardar  </Button>
                            </div>
                            <div className="form-select">
                                <Button onClick={() => window.location.href = '/student'}>Cancelar</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                <Modal show={this.state.modalDeleteFile}>
                    <Modal.Header>
                        <div><h5>¿Estás seguro de eliminar {this.state.nameDeleteFileMedia}?</h5> </div>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <FormGroup>
                        </FormGroup> */}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => this.deleteFile(this.state.deleteFileMedia)}>Aceptar</Button>
                        <Button variant="danger" onClick={() => this.closeModalDeleteFile()}>Cancelar</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
export default EditWritingTeam;