/*
*  Name_file :EditChallenge.js
*  Description: Pagina de editar desafio
*/
import React, { Component } from 'react';

/*Importaciones del editor */
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { stateFromHTML } from 'draft-js-import-html';// escribe el 'html' en el editor

/**Importacion del calendario */
import Dates from "../../dates/dates.js";

/**Datos de Sesion del usuario */
import AuthUser from '../../../services/authenticity/auth-service.js';

/**Servicios del profesor */
import TeacherService from '../../../services/teacher/teacherService';

/*Importaciones del css*/
import '../../../styles/Challenge.css';
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';
import '../../../styles/Writing.css';
import Card from 'react-bootstrap/Card';

/*Componentes de estilo Bootstrap*/
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';

class EditChallenge extends Component {

    constructor(props) {
        super(props);
        this.onFileChange = this.onFileChange.bind(this);
        this.onModalSave = this.onModalSave.bind(this);

        this.state = {
            imgCollection: [],//array de ficheros multimedia
            editorState: EditorState.createEmpty(),
            contentState: null,
            dataMediaChallenge: [], //contiene todo el multimedia del desafio
            categories: [],//contiene todas las categorias
            challenge: '',//contiene el desafio
            modalDeleteFile: false,
            nameDeleteFileMedia: '',//nombre del fichero multimedia del escrito que desea ser borrado
            deleteFileMedia: '',//fichero multimedia del escrito que desea ser borrado
            formErrors: {
                title: '',
                description: '',
                date: '',
            },
            form: {
                title: '',
                description: '',
                type: '',//tipo de desafio (invididual o colaborativo)
                typeQualification: '1',//tipo de calificacion numerica o conceptual
                idCategory: '',
                date: '',
            }
        };
    }

    componentDidMount() {
        //Obtiene todas las categorias de los desafios
        TeacherService.getCategories().then(response => {
            this.setState({ categories: response });
        }).catch(error => {
            console.log(error.message);
        })
        //Obtiene los datos del desafio al iniciar
        TeacherService.getChallenge(this.props.match.params.idChallenge).then(response => {
            var contentState = stateFromHTML(response[0].descripcion);
            let editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState: editorState,
                challenge: response[0],
                form: {
                    ...this.state.form,
                    title: response[0].titulo,
                    description: response[0].descripcion,
                    type: response[0].colaborativo,
                    typeQualification: response[0].tipoCalificacion,
                    idCategory: response[0].idCategoria,
                    date: response[0].fechaFin
                }
            });
        }).catch(error => {
            console.log(error.message);
        })
        //Obtiene multimedia del desafio del profesor
        TeacherService.getMultimediaChallenge(this.props.match.params.idChallenge)
            .then(response => {
                this.setState({
                    dataMediaChallenge: response.data,
                });
            }).catch(error => {
                console.log(error.message);
            });
    }

    //Envio el desafio editado
    editChallenge = () => {
        TeacherService.editChallenge(this.state.challenge.id, this.props.match.params.idGroup, this.state.form.title, this.state.form.description, this.state.form.type, this.state.form.idCategory, this.state.form.typeQualification, this.state.form.date)
            .then(response => {
                if (this.state.imgCollection.length > 0) {
                    TeacherService.sendMultimediaChallenge(this.state.imgCollection, AuthUser.getCurrentUser().id, this.props.match.params.idChallenge, this.state.form.type)
                        .then(response => {
                            window.location.href = "/teacher/groups";
                        })
                        .catch(error => {
                            console.log(error.message);
                        });
                }
                else
                    window.location.href = "/teacher/groups";
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    //Elimina el fichero multimedia del desafio
    deleteFile = (mediaChallenge) => {
        this.onModalDeleteFile(false);
        var contador = 0;
        var arreglo = this.state.dataMediaChallenge;
        arreglo.map((registro) => {
            if (mediaChallenge.id === registro.id) {
                arreglo.splice(contador, 1);
            }
            contador++;
        });
        this.setState({ dataMediaChallenge: arreglo });
        TeacherService.deleteMultimedia(mediaChallenge.id, mediaChallenge.ruta)
            .then(response => {

            })
            .catch(error => {
                console.log(error.message);
            });
    }

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    /* manejador para validar formulario*/
    handleErrors = e => {
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
                [name]: value
            }
        });
    }

    onContentStateChange = contentState => {
        this.setState({
            contentState
        });
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    /**modal guardar cambios */
    onModalSave(modal) {
        this.setState({
            stateModal: modal
        });
    }

    /**modal eliminar Fichero */
    onModalDeleteFile(modal) {
        this.setState({
            modalDeleteFile: modal
        });
    }

    //redireccion a una pagina
    changeView = () => {
        window.location.href = "/teacher/groups";
    }

    qualificationSelection = event => {
        this.setState({
            form: {
                ...this.state.form,
                typeQualification: event.target.value
            }
        });
    };

    /* manejador de fechas*/
    handleDateChange = (date) => {
        var dateActual = new Date();
        let formErrors = { ...this.state.formErrors };
        //Si la fecha actual es mayor que la fecha seleccionada
        if (dateActual > date) {
            formErrors.date = "Campo Fecha no válida";
        }
        else {
            formErrors.date = "";
        }
        this.setState({
            formErrors,
            form: {
                ...this.state.form,
                date: date
            }
        });
    };

    /* manejador de tipo desafio */
    handleSelectionChange = event => {
        this.setState({
            form: {
                ...this.state.form,
                type: event.target.value
            }
        });
    };

    /* manejador de categoria */
    handleSelectionCategory = event => {
        this.setState({
            form: {
                ...this.state.form,
                idCategory: event.target.value
            }
        });
    };

    onFileChange(e) {
        this.setState({ imgCollection: e.target.files });
    }

    //Obtiene el nombre del desafio/escrito
    showTitle = (mediaChallenge) => {
        var str = mediaChallenge.ruta;
        var res = str.split("/");
        return res[8];
    }

    editorChange = (editorState) => {
        let formErrors = { ...this.state.formErrors };
        if (!editorState.getCurrentContent().hasText()) {
            formErrors.description = "Texto Vacío";
        }
        else {
            formErrors.description = "";
        }

        this.setState({
            form: {
                formErrors,
                ...this.state.form,
                description: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
            }
        });
    };

    //Muestra modal para eliminar fichero multimedia
    askDeleteFile = (mediaChallenge) => {
        var str = mediaChallenge.ruta;
        var res = str.split("/");
        this.setState({
            nameDeleteFileMedia: res[8],
            deleteFileMedia: mediaChallenge,
            modalDeleteFile: true,
        });
    }

    //Desactiva boton
    disabledButton = () => {
        var dateActual = new Date();//"<p></p>\n"
        if (this.state.form.title.length === 0 || dateActual > this.state.form.date || this.state.form.description.length === 0 || this.state.form.description === "<p></p>\n") {
            return true;//desactivar
        }
        else
            return false;
    };

    /*Dibuja la pagina */
    render() {
        const { editorState, formErrors, dataMediaChallenge } = this.state;
        return (
            <div className="container">
                <Card className="card-edit">
                    <Card.Body>
                        <div className={"row-edit"}>
                            <div className={"section-title"}>
                                <h2> Modificar desafío </h2>
                            </div>
                        </div>
                        <div className="row-edit">
                            <div className="form-inputs">
                                <label className='form-label'>Título </label>
                                <input
                                    className={formErrors.title.length > 0 ? "error" : "form-input"}
                                    type="text"
                                    name="title"
                                    placeholder="escribe el título"
                                    value={this.state.form.title}
                                    onChange={this.handleErrors}
                                />
                                {formErrors.title.length > 0 && (
                                    <span className="alert-login">{formErrors.title}</span>
                                )}
                            </div>

                        </div>
                        <div className="row-edit">
                            <label className='form-label'>Descripción</label>
                            <Editor
                                editorState={editorState}
                                // wrapperClassName="demo-wrapper"
                                // editorClassName="border-edit"
                                // toolbarClassName="rdw-emoji-wrapper"
                                wrapperClassName="wrapperClassName1"
                                editorClassName="editorClassName1"
                                toolbarClassName="toolbarClassName1"
                                onEditorStateChange={this.onEditorStateChange}
                                onContentStateChange={this.onContentStateChange}
                                // onChange={this.editorChange(editorState)}
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
                                                description: draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
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
                        <ul className={"flex-row"}>
                            <li className={"flex-item-form"}>
                                <div className="form-select">
                                    <label className='form-label'>Categoría</label>
                                    <select value={this.state.form.idCategory} onChange={this.handleSelectionCategory}>
                                        {this.state.categories.map(elemento => (
                                            <option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </li>
                            <li className={"flex-item-form"}>
                                <div className="form-select">
                                    <label className='form-label'>Tipo de desafio</label>
                                    <select value={this.state.form.type} onChange={this.handleSelectionChange}>
                                        <option value="1">Individual</option>
                                        <option value="2">Colaborativo</option>
                                    </select>
                                </div>
                            </li>
                            <li className={"flex-item-form"}>
                                <div className="form-select">
                                    <label className='form-label'> Tipo de Calificación </label>
                                    <select value={this.state.form.typeQualification} onChange={this.qualificationSelection} >
                                        <option value="1"> Numerica</option>
                                        <option value="2"> Conceptual</option>
                                    </select>
                                </div>
                            </li>
                        </ul>

                        <div className="row-edit">
                            <label className='form-label'> Fecha y hora de fin del desafío </label>
                        </div>
                        <div className="form-select">
                            <Dates
                                className={formErrors.date.length > 0 ? "error" : "form-control"}
                                handleDateChange={this.handleDateChange}
                                param={this.state.form.date} />
                            {formErrors.date.length > 0 && (
                                <span className="alert-login">{formErrors.date}</span>
                            )}
                        </div>
                        <div className="row-edit">
                            <label className='form-label'> Ficheros Multimedia </label>
                            {dataMediaChallenge.length > 0 ? (
                                <table>
                                    <tbody>
                                        <div className={"table-multi"}>
                                            {dataMediaChallenge.map((mediaChallenge) => (
                                                <tr key={mediaChallenge.id}>
                                                    <td>
                                                        {this.showTitle(mediaChallenge)}
                                                    </td>
                                                    <td>
                                                        <div className="form-button">
                                                            <Button onClick={() => window.open(mediaChallenge.ruta)}>Ver</Button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="form-button">
                                                            <Button onClick={() => this.askDeleteFile(mediaChallenge)}>Eliminar</Button>
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
                        <div className="row-edit">
                            <div className={"form-select"}>
                                <label className='form-label'>
                                    Puedes agregar un fichero multimedia si lo deseas (imagen,video o audio)
                                </label>
                                <input type="file" name="imgCollection" onChange={this.onFileChange} multiple />
                            </div>
                        </div>
                        <div className={"row-edit"}>
                            <div className="form-button">
                                <Button onClick={() => this.onModalSave(true)} disabled={this.disabledButton()}>Guardar</Button>
                            </div>
                            <div className="form-button">
                                <Button onClick={() => this.changeView()}>Cancelar</Button>
                            </div>
                        </div>
                        <Modal
                            centered
                            show={this.state.stateModal}
                            onHide={this.state.stateModal}
                        >
                            <Modal.Header >
                                <Modal.Title>Aviso</Modal.Title>
                                <img src={"../../../exclamation.png"} />
                            </Modal.Header>
                            <Modal.Body>
                                ¿Desea guardar los cambios?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={() => this.editChallenge()}>Aceptar</Button>
                                <Button variant={"danger"} onClick={() => this.onModalSave(false)}>Cancelar</Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal
                            centered
                            show={this.state.modalDeleteFile}
                            onHide={this.state.modalDeleteFile}
                        >
                            <Modal.Header >
                                <Modal.Title>
                                    Aviso
                                    <img src={"../../../triangle.png"} />
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                ¿Desea eliminar {this.state.nameDeleteFileMedia}?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={() => this.deleteFile(this.state.deleteFileMedia)}>Aceptar</Button>
                                <Button variant={"danger"} onClick={() => this.onModalDeleteFile(false)}>Cancelar</Button>
                            </Modal.Footer>
                        </Modal>

                    </Card.Body>
                </Card>
            </div>
        );
    }
}
export default EditChallenge;