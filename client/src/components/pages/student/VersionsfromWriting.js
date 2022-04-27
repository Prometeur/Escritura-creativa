import React, { Component } from "react";
import { Link } from "react-router-dom";
import StudentService from '../../../services/student/student-service.js';

//Fecha y Hora
import moment from 'moment';

import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table";
import Card from 'react-bootstrap/Card';

//Estilos
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';


class VersionsfromWriting extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            data: [],
            challenge: '',
            dataTeam: [],
            challenge2: '',
            colaborativo: false,
        }
    
    }

    componentDidMount() {
        // obtiene las versiones del escrito de un estudiante
        StudentService.getVersionsfromWriting(this.props.match.params.idWriting)
            .then(response => {
                if (response.length !== 0) {
                    this.setState({ data: response.data, challenge: response.data[0].nombreDesafio });
                }
            })
            .catch(error => {
                console.log(error.message);
            })

        // obtiene las versiones del escrito de un equipo
        StudentService.getVersionsfromWritingTeam(this.props.match.params.idWriting)
            .then(response => {
                this.setState({ dataTeam: response, challenge2: response[0].nombreDesafio, colaborativo: true });
            })
            .catch(error => {
                console.log(error.message);
            })
        
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

    /*Dibuja la pagina  */
    render() {
        let formatedDate;
        let { data, challenge, dataTeam, colaborativo } = this.state;
        return (
            <div class="container">
                <Card className="card-long">
                    <Card.Body>
                        {
                            <>
                            <div className={"row-edit"}>
                                <label className={"form-label"} htmlFor="">Lista de versiones</label>
                            </div>
                            <hr />
                            <ul className={"flex-row"}>
                                <li className={"flex-item-form"}>
                                    <label className='form-label'>Desafío</label>
                                    {colaborativo === false ? <h5> {challenge} </h5> : <h5>{this.state.challenge2}</h5>}
                                </li>
                            </ul>
                            <div className="row-edit">
                                <Table bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th> Versión</th>
                                            <th> Título</th>
                                            {colaborativo === false ? <th>Estudiante</th> : <th>Equipo</th>}
                                            <th>Fecha de modificación</th>
                                            <th>Hora</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        colaborativo === false ?
                                        (
                                            data.map((writing) => (
                                                < tr key={writing.idEscrito}>
                                                    <td>{writing.idVersion}</td>
                                                    <td>{writing.nombreEscrito}</td>
                                                    <td>{writing.nombre} {writing.apellidos}</td>
                                                    <td >{formatedDate = moment(writing.fecha).format('DD/MM/YYYY')}</td>
                                                    <td >{formatedDate = moment(writing.fecha).format('LT')}</td>
                                                    <td >
                                                        <Link to={`/student/editVersionfromWriting/${writing.idGrupo}/${writing.idDesafio}/${writing.idEscrito}/${writing.idVersion}`}>
                                                            <img src="/edit.png" alt=""/>
                                                            <Button variant="link">
                                                                Editar
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : 
                                        (
                                            dataTeam.map((writingTeam) => (
                                                < tr key={writingTeam.idEscrito}>
                                                    <td>{writingTeam.idVersion}</td>
                                                    <td>{writingTeam.nombreEscrito}</td>
                                                    <td>{writingTeam.nombreEquipo }</td>
                                                    <td >{formatedDate = moment(writingTeam.fecha).format('DD/MM/YYYY')}</td>
                                                    <td >{formatedDate = moment(writingTeam.fecha).format('LT')}</td>
                                                    <td >
                                                        <Link to={`/student/editVersionfromWriting/${writingTeam.idGrupo}/${writingTeam.idDesafio}/${writingTeam.idEscrito}/${writingTeam.idVersion}`}>
                                                            <img src="/edit.png" alt=""/>
                                                            <Button variant="link">
                                                                Editar
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                        }
                                    </tbody>
                                </Table>
                            </div>
                            </>
                        }

                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default VersionsfromWriting;
