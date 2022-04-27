/*
*  Name_file :ViewChallengeFromCollection.js
*  Description: Contiene los escritos de un desafío perteneciente a una colección.
*    
*/

import React, { Component } from 'react';
import TeacherService from '../../../services/teacher/teacherService.js';

/**Estilos bibliotecas externas*/
import  Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

/**Estilos css*/
import 'react-tabs/style/react-tabs.css';
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';


class ViewChallengeFromCollection extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            nameCollection: "",
            nameGroup: "",
            idGroup: -1,
            nameChallenge: '',
            dataWritings: [],
            hayEscritos: false,
            colaborativo: -1,
        };
    }

    componentDidMount()
    {
        // Obtenemos una colección
        TeacherService.getCollection(this.props.match.params.idCollection)
        .then(response => {
            if (response.length > 0)
            {
                this.setState({ nameCollection: response[0].nombreColeccion, nameGroup: response[0].nombreGrupo, idGroup: response[0].idGrupo });
            }

            // Comprobamos si el desafío es individual o colaborativo
            TeacherService.getChallenge(this.props.match.params.idChallenge)
            .then(response => {
                this.setState({ colaborativo : response[0].colaborativo, nameChallenge: response[0].titulo });

                // Si el desafío es individual
                if (response[0].colaborativo == 1)
                {
                    // Obtenemos todos los escritos del desafío
                    TeacherService.getWritingsStudent(this.state.idGroup, this.props.match.params.idChallenge)
                    .then(response => {
                        if (response.data.length > 0)
                        {
                            this.setState({ dataWritings: response.data, hayEscritos: true });
                        }
                    })
                }
                else // el desafío es colaborativo
                {
                    // Obtenemos todos los escritos del desafío
                    TeacherService.getWritingsTeam(this.state.idGroup, this.props.match.params.idChallenge)
                    .then(response => {
                        if (response.length > 0)
                        {
                            this.setState({ dataWritings: response, hayEscritos: true });
                        }
                    })
                }
            })

        })

    }


    /*Dibuja la pagina  */
    render() {
        return (
        <div className="container">
            <Card className="card-long">
            <Card.Body>
                <div className={"row-edit"}>
                    <div className={"section-title"}>
                        <h2>Desafío "{this.state.nameChallenge}"</h2>
                    </div>
                    <br/>
                    <Alert variant={"info"}>
                        <img src="/info.png" alt=""/>
                        En este espacio puede ver los escritos de los alumnos que pertenecen al desafío seleccionado.
                    </Alert>
                </div>

                <div className={"row-edit"}>
                    <Card className={"card-long"}>
                    <Card.Body >
                        <ul className={"flex-items-row-start wrap"}>

                            <li className={"flex-item-data"}>
                                <h5>Colección: <u>{this.state.nameCollection}</u> </h5>
                            </li>
                            <li className={"flex-item-data"}>
                                <h5>Grupo: <u>{this.state.nameGroup}</u> </h5>
                            </li>
                            <br/>
                            <li className={"flex-item-data"}>
                                <h5>Escritos:</h5>
                            </li>
                            
                            <li className={"items-row"}>
                                {this.state.hayEscritos == true ? (
                                    <>
                                    <ul className={"flex-items-row-evenly"}>
                                        <li className={"flex-item-list"}>
                                            <u><b>Título:</b></u>
                                        </li>
                                        <li className={"flex-item-list"}>
                                            <u><b>
                                            {this.state.colaborativo == 1 ?
                                                ("Estudiante:") :
                                                ("Equipo:")
                                            }
                                            </b></u>
                                        </li>
                                    </ul>
                                    <br/>

                                    {this.state.dataWritings.map((writing) => (
                                        <>
                                        <ul className={"flex-items-row-evenly"}>
                                            <li className={"flex-item-list"}>
                                                {writing.nombreEscrito}
                                            </li>
                                            <li className={"flex-item-list"}>
                                                {writing.colaborativo == 1  ? (
                                                    // Individual
                                                    <> {writing.nombreEstudiante} {writing.apellidosEstudiante} </>
                                                ) : (
                                                    // Colaborativo
                                                    <> {writing.nombreEquipo} </>
                                                )}
                                            </li>
                                        </ul>
                                        <hr />
                                        </>
                                    ))}
                                    </>
                                ) : (
                                    <>
                                    <br/>
                                    <Alert variant={"danger"}>
                                        No hay ningún escrito para este desafío
                                    </Alert>
                                    </>
                                )}

                                <br/>
                            </li>

                        </ul>
                    </Card.Body>
                    </Card>
                </div>

            </Card.Body>
            </Card>

        </div>
        );
    }


}

export default ViewChallengeFromCollection;