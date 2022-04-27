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
//Estilos
import '../../../styles/styleGeneral.css';
import teacherService from '../../../services/teacher/teacherService.js';

class WritingsTeam extends Component {

    constructor(props) {
        super(props);
        this.state = {

            dataWritings: [],//contiene todos los escritos colaborativos de un grupo y desafio dado
            type:2,//desafio en equipo
            challenge: '',
            idChallenge: '',
        }

    }

    componentDidMount() {
        
        TeacherService.getWritingsStudent(this.props.groupSelect, this.props.idChallenge)
            .then(response => {
                
                this.setState({ dataWritings: response.data });

            }).catch(error => {
                console.log(error.message);
            })

    }


    // handleSelect(challenge) {
    //     this.setState({ challenge: challenge });
    //   }

    /*Dibuja la pagina  */
    render() {
        let formatedDate;
        let { dataWritings } = this.state;
        const { showWritings } = this.state;
        return (
            <>
                <div className="table-margin">
                    <div className="row-edit">
                        <label className='form-label'>{this.state.idChallenge}</label>
                    </div>
                    <Table striped bordered hover responsive >
                        <thead>
                            <tr>
                                <th >Desafío</th>
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
                                    <td>{writing.nombreEscrito}</td>
                                    <td>{writing.nombreEstudiante} {writing.apellidosEstudiante}</td>
                                    <td>{writing.puntuacion}</td>
                                    <td >{formatedDate = moment(writing.fecha).format('DD/MM/YYYY')}</td>
                                    <td >{formatedDate = moment(writing.fecha).format('LT')}</td>
                                    <td className="challenge-td"><Link to={`/teacher/editWriting/${this.props.groupSelect}/${writing.idDesafio}/${writing.idEscrito}/${writing.idEstudiante}`}><Button variant="outline-primary" >Editar Escrito</Button></Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

            </>
        );
    }
}

export default WritingsTeam;