import React, { Component } from 'react';
import { Link } from "react-router-dom";
import StudentService from '../../../services/student/student-service.js';

/**Estilos bibliotecas externas*/
import  Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";

/**Estilos css*/
import 'react-tabs/style/react-tabs.css';
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';


class VisualizeSingleCollection extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            nameCollection: "",
            nameGroup: "",
            idGroup: -1,
            challengesNotInCollection: [],
            selectedChallenge: false,
            idChallengeSelect: -1,
            dataChallenges: [],
            hayDesafios: false,
        };
    }

    componentDidMount()
    {
        // Obtenemos una colección
        StudentService.getCollection(this.props.match.params.idCollection)
        .then(response => {
            if (response.length > 0)
            {
                this.setState({ nameCollection: response[0].nombreColeccion, nameGroup: response[0].nombreGrupo, idGroup: response[0].idGrupo });

            }
        })

        // Obtenemos los desafíos de la colección
        StudentService.getChallengesFromCollection(this.props.match.params.idCollection)
        .then(response => {
            if (response.length > 0)
            {
                this.setState({ dataChallenges: response, hayDesafios: true });
            }
        })

    }


    handleChangeChallengeSelect = async e => {
        await this.setState({
                [e.target.name]: e.target.value
        });
        if (e.target.value != -1)
            this.setState({ selectedChallenge: true });
        else
            this.setState({ selectedChallenge: false });
    }

    /*Dibuja la pagina  */
    render() {
        return (
        <div className="container">
            <Card className="card-long">
            <Card.Body>
                <div className={"row-edit"}>
                    <div className={"section-title"}>
                        <h2>Colección "{this.state.nameCollection}"</h2>
                    </div>
                    <br/>
                    <Alert variant={"info"}>
                        <img src="/info.png" alt=""/>
                        Puede usar este espacio para ver los desafíos asociados a la colección.
                    </Alert>
                </div>

                <div className={"row-edit"}>
                    <Card className={"card-long"}>
                    <Card.Body >
                        <ul className={"flex-items-row-start wrap"}>

                            <li className={"flex-item-data"}>
                                <h5>Grupo: <u>{this.state.nameGroup}</u> </h5>
                            </li>
                            <li className={"flex-item-data"}>
                                <h5>Desafíos:</h5>
                            </li>
                            <li className={"items-row"}>
                                
                                {this.state.hayDesafios == true ? (
                                    this.state.dataChallenges.map((challenge) => (
                                        <>
                                            <ul className={"flex-items-row-evenly"}>
                                                <li className={"flex-item-list"}>
                                                    {challenge.titulo}
                                                </li>
                                                <li className={"flex-item-list"}>
                                                    {challenge.colaborativo == 1  ? (
                                                        "Individual"
                                                    ) : (
                                                        "Colaborativo"
                                                    )}
                                                </li>
                                                <li className={"flex-item-list"}>
                                                    <Link key={challenge.id} to={`/student/visualizecollections/${this.props.match.params.idCollection}/${challenge.id}`}>
                                                        <Button size={"sm"} variant={"primary"}>
                                                            Ver escritos
                                                        </Button>
                                                    </Link>
                                                </li>
                                            </ul>
                                            <hr />
                                        </>
                                    ))
                                ) : (
                                    <Alert variant={"danger"}>
                                        No hay ningún desafío en esta colección
                                    </Alert>
                                )}

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

export default VisualizeSingleCollection;