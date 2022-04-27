import React, { Component } from 'react';
import { Link } from "react-router-dom";

import TeacherService from '../../../services/teacher/teacherService.js';

/**Datos del usuario */
import AuthUser from '../../../services/authenticity/auth-service.js';

//Fecha y Hora
import moment from 'moment';

// Componentes estilos
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';
//Estilos
import '../../../styles/styleGeneral.css';

class WritingsStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            changeState: false,
            dataWritings: [],//contiene todos los escritos individuales de un grupo y desafio dado
            idChallenge: '',
            showTableStudent: false,
            showTableTeam: false,
        }
    }

    componentDidMount() {
      
        TeacherService.getChallenge(this.props.idChallenge)
            .then(response => {
                //Si el desafio es individual muestra los escritos individuales
                if (response[0].colaborativo === 1) {
                    TeacherService.getWritingsStudent(this.props.groupSelect, this.props.idChallenge)
                        .then(response => {

                            this.setState({ showTableStudent: true, dataWritings: response.data, idChallenge: this.props.idChallenge });

                        }).catch(error => {
                            console.log(error.message);
                        })

                }
                else { //Si el desafio es colaborativo muestra los escritos colaborativos
                    TeacherService.getWritingsTeam(this.props.groupSelect, this.props.idChallenge)
                        .then(response => {

                            this.setState({ showTableStudent: false, dataWritings: response });

                        }).catch(error => {
                            console.log(error.message);
                        })
                }

            }).catch(error => {
                console.log(error.message);
            })
    }


    componentDidUpdate(pP, pS, sS) {

        if ( this.props.idChallenge !== pP.idChallenge) {
            TeacherService.getChallenge(this.props.idChallenge)
                .then(response => {
                    //Si el desafio es individual muestra los escritos individuales
                    if (response[0].colaborativo === 1) {
                        TeacherService.getWritingsStudent(this.props.groupSelect, this.props.idChallenge)
                            .then(response => {
                           
                                this.setState({ showTableStudent: true, dataWritings: response.data });

                            }).catch(error => {
                                console.log(error.message);
                            })
                    }
                    else if(response[0].colaborativo === 2) { //Si el desafio es colaborativo muestra los escritos colaborativos
                        TeacherService.getWritingsTeam(this.props.groupSelect, this.props.idChallenge)
                            .then(response => {
                                this.setState({ showTableStudent: false, dataWritings: response });

                            }).catch(error => {
                                console.log(error.message);
                            })
                    }

                }).catch(error => {
                    console.log(error.message);
                })
        }

    }

    //Obtiene el nombre del desafio/escrito
    showCollaborative = (writing) => {
        if (writing.colaborativo === 1) {
            return "individual"
        }
        else if (writing.colaborativo === 2) {
            return "colaborativo"
        }
        else
            return "N/A"
    }


    /*Dibuja la pagina  */
    render() {
        console.log(this.state);
        let formatedDate;
        let { dataWritings, showTableStudent } = this.state;

        let tabla = <div className="table-margin">
        <Table bordered hover responsive>
            <thead>
                <tr>
                    <th >Desafío</th>
                    <th >Tipo</th>
                    <th >Escrito</th>
                    <th >Estudiante</th>
                    <th >Puntuación</th>
                    <th >Fecha</th>
                    <th >Hora</th>
                    <th >Acciones</th>
                </tr>
            </thead>
            <tbody>
                {dataWritings.map((writing) => (
                    <tr>
                        <td>{writing.nombreDesafio}</td>
                        <td>{this.showCollaborative(writing)}</td>
                        <td>{writing.nombreEscrito}</td>
                        <td>{writing.nombreEstudiante} {writing.apellidosEstudiante}</td>
                        <td>{writing.puntuacion}</td>
                        <td >{formatedDate = moment(writing.fecha).format('DD/MM/YYYY')}</td>
                        <td >{formatedDate = moment(writing.fecha).format('LT')}</td>
                        <td className="challenge-td"><Link to={`/teacher/editWriting/${this.props.groupSelect}/${writing.idDesafio}/${writing.idEscrito}/${writing.idEstudiante}`}><img src={"../edit.png"} />Editar</Link></td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>;

        if (dataWritings.length === 0)
        {
            tabla = <div className="row-edit">
                            <Alert variant={"danger"}>
                                No hay escritos para este desafío en estos momentos.
                            </Alert>
                    </div>;
        }


        return (
            <>
                {showTableStudent ? (
                    
                    <div>
                        {tabla}
                    </div>

                ) : (
                    <div className="table-margin">
                        <div className="row-edit">
                            <label className='form-label'>Lista de Desafios</label>
                        </div>
                        <Table  bordered hover responsive>
                            <thead>
                                <tr>
                                    <th >Desafío</th>
                                    <th >Tipo</th>
                                    <th >Escrito</th>
                                    <th >Equipo</th>
                                    <th >Puntuación</th>
                                    <th >Fecha</th>
                                    <th >Hora</th>
                                    <th >Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataWritings.map((writing) => (
                                    <tr>
                                        <td>{writing.nombreDesafio}</td>
                                        <td>{this.showCollaborative(writing)}</td>
                                        <td>{writing.nombreEscrito}</td>
                                        <td>{writing.nombreEquipo}</td>
                                        <td>{writing.puntuacion}</td>
                                        <td >{formatedDate = moment(writing.fecha).format('DD/MM/YYYY')}</td>
                                        <td >{formatedDate = moment(writing.fecha).format('LT')}</td>
                                        <td className="challenge-td"><Link to={`/teacher/editWriting/${this.props.groupSelect}/${writing.idDesafio}/${writing.idEscrito}/${writing.idEscritor}`}><Button variant="outline-primary" >Editar Escrito</Button></Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </>
        );
    }
}

export default WritingsStudent;