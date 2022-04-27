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
import Table from "react-bootstrap/Table";
import Modal from 'react-bootstrap/Modal';



class EditVersionfromWriting extends Component {

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
            nameDeleteFileMedia: '',//nombre del fichero multimedia del escrito que desea ser borrado
            modalEditWriting: false,
            writing: '',
            formErrors: {
                title: '',
                description: '',
            },
            form: {
                idWriter: '',
                title: '',
                escrito: ''
            },
            modalInsertVersion: false,
            maxIdVersion: -1
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
                            this.setState({ form: { ...this.state.form, idWriter: response[0].idEquipo } });
                            /*Obtiene multimedia del escrito del equipo */
                            StudentService.getMultimediaWriting(this.props.match.params.idChallenge, response[0].idEquipo/*, this.props.match.params.idVersion*/)
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
                        form: {
                            ...this.state.form,
                            idWriter: AuthUser.getCurrentUser().id
                        }
                    });

                    /*Obtiene multimedia del escrito del estudiante */
                    StudentService.getMultimediaWriting(this.props.match.params.idChallenge, AuthUser.getCurrentUser().id/*, this.props.match.params.idVersion*/)
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
        StudentService.getMultimediaChallenge(this.props.match.params.idChallenge)
            .then(response => {
                this.setState({ dataMediaChallenge: response.data, });
            }).catch(error => {
                console.log(error.message);
            });


        // Obtiene el escrito
        StudentService.getChallenge(this.props.match.params.idChallenge)
        .then(response => {
            this.setState({ challenge: response[0] });
            //Si es individual
            if (response[0].colaborativo === 1)
            {
                /*Obtiene el escrito de un estudiante con su correspondiente versión */
                StudentService.getVersionsfromWriting(this.props.match.params.idWriting)
                .then(response => {
                    var contentState = stateFromHTML(response.data[this.props.match.params.idVersion - 1].texto);
                    let editorState = EditorState.createWithContent(contentState);
                    // this.setState({ editorState: editorState });
                    this.setState({
                        writing: response.data[this.props.match.params.idVersion - 1],
                        editorState: editorState,
                        form: {
                            ...this.state.form,
                            title: response.data[this.props.match.params.idVersion - 1].nombreEscrito,
                            escrito: response.data[this.props.match.params.idVersion - 1].texto
                        }
                    });
                }).catch(error => {
                    console.log(error.message);
                });
            }
            // Es colaborativo
            else
            {
                 /*Obtiene el escrito de un equipo con su correspondiente versión */
                 StudentService.getVersionsfromWritingTeam(this.props.match.params.idWriting)
                 .then(response => {
                     var contentState = stateFromHTML(response[this.props.match.params.idVersion - 1].texto);
                     let editorState = EditorState.createWithContent(contentState);
                     // this.setState({ editorState: editorState });
                     this.setState({
                         writing: response[this.props.match.params.idVersion - 1],
                         editorState: editorState,
                         form: {
                             ...this.state.form,
                             title: response[this.props.match.params.idVersion - 1].nombreEscrito,
                             escrito: response[this.props.match.params.idVersion - 1].texto
                         }
                     });
                 }).catch(error => {
                     console.log(error.message);
                 });
            }
            
        }).catch(error => {
            console.log(error.message);
        });


        /* Devuelve la última versión de un escrito, es decir, el mayor id */
        StudentService.getHighestidVersionfromWriting(this.props.match.params.idWriting)
        .then(response => {
            this.setState({ maxIdVersion: response[0].maxId });
        }).catch(error => {
            console.log(error.message);
        });
    }

    
    // Envía la nueva versión del escrito
    insertVersion = () => {
        this.onModalInsertVersion(false)
        /*Añade una nueva versión de un escrito */
        StudentService.insertVersionfromWriting(this.props.match.params.idWriting, this.state.maxIdVersion + 1, this.props.match.params.idChallenge, this.state.form.idWriter, this.state.form.title, this.state.form.escrito, this.state.challenge.colaborativo)
        .then(response => {
            // Edito el escrito en la tabla escrito con los datos de la última versión
            StudentService.editWriting(this.props.match.params.idWriting, this.props.match.params.idGroup, this.props.match.params.idChallenge, this.state.form.idWriter, this.state.form.title, this.state.form.escrito, this.state.challenge.colaborativo)
            .then(response => {
                if (this.state.imgCollection.length > 0) {
                    StudentService.sendMultimedia(this.state.imgCollection, this.state.form.idWriter, this.props.match.params.idChallenge, this.state.challenge.colaborativo/*, this.state.maxIdVersion + 1*/)
                        .then(response => {
                            window.location.href = `/student/versionsWriting/${this.props.match.params.idGroup}/${this.props.match.params.idChallenge}/${this.props.match.params.idWriting}`;
                        }).catch(error => {
                            console.log(error.message);
                        });
                }
                else {
                    window.location.href = `/student/versionsWriting/${this.props.match.params.idGroup}/${this.props.match.params.idChallenge}/${this.props.match.params.idWriting}`;
                }
            })
            .catch(error => {
                console.log(error.message);
            });
        })
        .catch(error => {
            console.log(error.message);
        });
    }

    onModalInsertVersion = (modal) => {
        this.setState({
            modalInsertVersion: modal,
        });
    };

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
        this.setState({ modalDeleteFile: false });
    };

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

    //Devuelve el tipo de desafio
    showCollaborative = () => {
        if (this.state.challenge.colaborativo === 1) {
            return "Individual"
        }
        else {
            return "Colaborativo"
        }
    }

    // //Desactiva boton
    // disabledButton = () => {
    //     if (this.state.form.title.length === 0  || this.state.form.escrito.length === 0 || this.state.form.escrito === "<p></p>\n") {
    //         return true;//desactivar
    //     }
    //     else
    //         return false;
    // };

    onModalEditWriting = (modal) => {
        this.setState({
            modalEditWriting: modal,
        });
    };

    infoWriting = (data) => {
        this.state.data.map(function(writing){
            return `${writing.idGrupo}/${writing.idDesafio}/${writing.id}`;
       })
    }

    /*Dibuja la pagina */
    render() {
        const { editorState, dataMediaChallenge, dataMediaWriting, formErrors } = this.state;
        return (
            <div className="container">
                <Card className="card-edit">
                    <Card.Body>
                        <div className={"row-edit"}>
                            <div className={"section-title"}>
                                <h2>Editar Escrito {this.showCollaborative()}</h2>
                            </div>
                        </div>
                        <div className={"row-edit"}>
                            <label className={"form-label"}>Detalles del desafío</label>
                        </div>
                        <hr />
                        <ul className={"flex-row"}>
                            <li className={"flex-item-form"}>
                                <label className='form-label'>Nombre</label>
                                <h5> {this.state.challenge.titulo} </h5>
                            </li>
                            <li className={"flex-item-form"}>
                                <label className='form-label'>Categoria</label>
                                <h5>{this.state.challenge.nombre}</h5>
                            </li>
                        </ul>
                        <div className="row-edit">
                            <label className='form-label'>Leer la descripción del Desafío</label>
                            <div className="challenge-inputs"
                                dangerouslySetInnerHTML={{ __html: this.state.challenge.descripcion }}>

                            </div>
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
                            ) : (
                                <div className="row-edit">
                                    <p>No hay ficheros para mostrar</p>
                                </div>
                            )}
                        </div>
                        <br />
                        <div className={"row-edit"}>
                            <label className={"form-label"}>Espacio de escritura</label>
                        </div>
                        <hr />
                        <div className={"row-edit"}>
                            <div className="form-inputs">
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
                            <label className='form-label' >Escribe aquí</label>
                            <Editor
                                editorState={editorState}
                                // toolbarClassName="toolbarClassName"
                                // // wrapperClassName="demo-wrapper"
                                // // editorClassName="border-edit"
                                wrapperClassName="wrapperClassName1"
                                editorClassName="editorClassName1"
                                toolbarClassName="toolbarClassName1"
                                onEditorStateChange={this.onEditorStateChange}
                                onContentStateChange={this.onContentStateChange}
                                // onChange={this.editorChange}

                                onChange={
                                    (event, editor) => {
                                        let formErrors = { ...this.state.formErrors };
                                        if (!editorState.getCurrentContent().hasText()) {
                                            formErrors.description = "Campo texto vacío";
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

                        <div class="row-edit">
                            <label className='form-label'>Ficheros Multimedia</label>
                            {dataMediaWriting.length > 0 ? (
                                <table>
                                    <tbody>
                                        <div className={"table-multi"}>
                                            {dataMediaWriting.map((writing) => (
                                                <tr key={writing.id}>
                                                    <td>{this.showTitle(writing)}</td>
                                                    <td>
                                                        <div className="form-button">
                                                            <Button onClick={() => window.open(writing.ruta)}>Ver</Button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="form-button">
                                                            <Button variant="danger" onClick={() => this.askDeleteFile(writing)}>Eliminar</Button>
                                                        </div>
                                                    </td>
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
                            <div className="form-button">
                                <Button text='enviar' onClick={() => this.onModalInsertVersion(true)} > Guardar como escrito actual </Button>
                            </div>
                            <div className="form-button">
                                <Button onClick={() => window.location.href = `/student/versionsWriting/${this.props.match.params.idGroup}/${this.props.match.params.idChallenge}/${this.props.match.params.idWriting}`}>Cancelar</Button>
                            </div>
                        </div>

                    </Card.Body>
                </Card>

                <Modal show={this.state.modalDeleteFile}>
                    <Modal.Header>
                        <div><h5>¿Seguro que desea eliminar {this.state.nameDeleteFileMedia}?</h5> </div>
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

                <Modal show={this.state.modalInsertVersion}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                    <p> ¿Deseas guardar los cambios?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => this.insertVersion()}>Aceptar</Button>
                        <Button variant="danger" onClick={() => this.onModalInsertVersion(false)}>Cancelar</Button>
                    </Modal.Footer>
                </Modal>  

            </div>
        );
    }
}
export default EditVersionfromWriting;