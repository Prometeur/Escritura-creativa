import React, { Component } from 'react';
import { Link } from "react-router-dom";

import StudentService from '../../../services/student/student-service.js';

/**Datos del usuario */
import AuthUser from '../../../services/authenticity/auth-service.js';

//Fecha y Hora
import moment from 'moment';

// Componentes estilos
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from 'react-bootstrap/Alert';

//Estilos
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

class WritingsStudent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showWritings: false,
        }
    }

    componentDidMount() {
        //obtiene los escritos del estudiante
        if (this.props.groupSelect === undefined) {
            StudentService.getWritings(AuthUser.getCurrentUser().id)
                .then(response => {
                    if (response.data.length !== 0) {
                        this.setState({ data: response.data, showWritings: true });
                    }
                })
                .catch(error => {
                    console.log(error.message);
                })
        }
        else {
            StudentService.getWritingsStudent(AuthUser.getCurrentUser().id, this.props.groupSelect)
                .then(response => {
                    if (response.length !== 0) {
                        this.setState({ data: response, showWritings: true });
                    }
                })
                .catch(error => {
                    console.log(error.message);
                })
        }
    }



    //Devuelve string del escrito finalizado
    showWritingFinalized = (writing) => {
        if (writing.finalizado === 1)
            return "Si"
        else
            return "No"
    }

    //Devuelve string del desafio finalizado
    showChallengeFinalized = (writing) => {
        var dateActual = new Date();
        var dateFin = new Date(writing.fechaFin)//fecha fin del desafio
        //si ya se paso la fecha del desafio, desactivar button
        if (dateActual.getTime() > dateFin.getTime())
            return "Si"
        else
            return "No"
    }

    challengeFinalized = (writing) => {
        var dateActual = new Date();
        var dateFin = new Date(writing.fechaFin)//fecha fin del desafio
        //si ya se paso la fecha del desafio, desactivar button
        if (dateActual.getTime() > dateFin.getTime())
            return true;
        else
            return false;
    }

    /*Dibuja la pagina  */
    render() {
        let formatedDate;
        let { data, showWritings } = this.state;
        return (

                <Card className="card-long">
                    <Card.Body>
                        {showWritings ? (
                            <>
                            <div className={"row-edit"}>
                                <label className={"form-label"} htmlFor="">Lista de escritos</label>
                            </div>
                            <div className="row-edit">
                                <Table bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th >Escrito</th>
                                            <th >Grupo</th>
                                            <th >Desafío</th>
                                            <th>Desafio Finalizado</th>
                                            <th >Estudiante</th>
                                            <th >Fecha</th>
                                            <th >Hora</th>
                                            <th >Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((writing) => (
                                            < tr key={writing.id} >
                                                <td>{writing.nombreEscrito}</td>
                                                <td>{writing.nombreGrupo}</td>
                                                <td>{writing.nombreDesafio}</td>
                                                <td>{this.showChallengeFinalized(writing)}</td>
                                                <td>{writing.nombre} {writing.apellidos}</td>
                                                <td >{formatedDate = moment(writing.fechaFin).format('DD/MM/YYYY')}</td>
                                                <td >{formatedDate = moment(writing.fechaFin).format('LT')}</td>
                                                {this.challengeFinalized(writing) ? (
                                                    <td>
                                                        <img src="/view.png" alt=""/>
                                                        <Button
                                                            href ={`/student/viewWriting/${this.props.groupSelect}/${writing.idDesafio}/${writing.id}`}
                                                            variant="link"

                                                        >
                                                            Ver
                                                        </Button>
                                                    </td>
                                                ) : (
                                                    <td >
                                                        <Link to={`/student/editWriting/${writing.idGrupo}/${writing.idDesafio}/${writing.id}`}>
                                                            <img src="/edit.png" alt=""/>
                                                            <Button variant="link" disabled={this.challengeFinalized(writing)}>
                                                                 Editar
                                                            </Button>
                                                       </Link>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            </>
                        ) : (

                            <div className="row-edit">
                                <Alert variant={"danger"}>
                                     No dispones de escritos para mostrar
                                </Alert>
                            </div>
                        )}
                    </Card.Body>
                </Card>
        );
    }
}

export default WritingsStudent;