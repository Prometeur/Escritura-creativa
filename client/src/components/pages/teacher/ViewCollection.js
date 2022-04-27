/*
*  Name_file :View Collection.js
*  Description: Contiene los datos de una colección segun un ID dado.
*    
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import TeacherService from '../../../services/teacher/teacherService.js';

/**Estilos bibliotecas externas*/
import  Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";

/**Estilos css*/
import 'react-tabs/style/react-tabs.css';
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';


class ViewCollection extends Component {

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
            onModalDelete: false,
            idBorrado: -1,
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

                // Obtenemos los desafíos que no están en la colección
                TeacherService.getChallengesNotInCollection(response[0].idGrupo, this.props.match.params.idCollection)
                    .then(response => {
                        this.setState({ challengesNotInCollection: response});
                    })
            }
        })

        // Obtenemos los desafíos de la colección
        TeacherService.getChallengesFromCollection(this.props.match.params.idCollection)
        .then(response => {
            if (response.length > 0)
            {
                this.setState({ dataChallenges: response, hayDesafios: true });
            }
        })

    }

    addChallengeToCollection = (idChallenge) =>
    {
        TeacherService.addChallengeToCollection(this.props.match.params.idCollection, idChallenge)
        .then(response => {
            window.location.replace(`/teacher/collections/${this.props.match.params.idCollection}`); 

        }).catch(error => {
            console.log(error.message);
        })
    }

    deleteChallenge = () =>
    {
        this.onModalDeleteChallenge(false, -1);
        TeacherService.deleteChallengeFromCollection(this.props.match.params.idCollection, this.state.idBorrado)
        .then(response => {
            window.location.href = `/teacher/collections/${this.props.match.params.idCollection}`;

        }).catch(error => {
            console.log(error.message);
        })
    }

    onModalDeleteChallenge(modal, idChallenge) {
        this.setState({
          onModalDelete: modal,
          idBorrado: idChallenge
        });
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
                        Puede usar este espacio para ver los desafíos asociados a la colección, y añadir nuevos desafíos si así lo desea.
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
                                                    <Link key={challenge.id} to={`/teacher/collections/${this.props.match.params.idCollection}/${challenge.id}`}>
                                                        <Button size={"sm"} variant={"primary"}>
                                                            Ver escritos
                                                        </Button>
                                                    </Link>
                                                </li>
                                                <li className={"flex-item-list"}>
                                                    <Button size={"sm"} variant="danger" onClick={() => this.onModalDeleteChallenge(true, challenge.id)}>
                                                        Eliminar
                                                    </Button>
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
                            <div className={"row-edit"}>
                                <ul className={"container-column-list wrap"}>
                                    <li className={"flex-item-profile"}>
                                        <label className={"form-label"} htmlFor="idChallengeSelect">Añadir un desafío</label>
                                    </li>
                                    <li className={"flex-item-profile"}>
                                        <select name="idChallengeSelect" id="idChallengeSelect" onChange={this.handleChangeChallengeSelect}>
                                            <option selected value= "-1" >Elija un desafío</option>
                                            {this.state.challengesNotInCollection.map(challenge => {
                                                return (
                                                    <option value={challenge.id}>{challenge.titulo}</option>
                                                )
                                            })}
                                        </select>
                                    </li>
                                    <li className={"flex-item-profile"}>
                                        {this.state.selectedChallenge == false ? (
                                            <Button size={"sm"} text='Anyadir desafio' disabled>
                                                Añadir
                                            </Button>
                                        ) : (
                                            <Button size={"sm"} text='Anyadir desafio' onClick={() => this.addChallengeToCollection(this.state.idChallengeSelect)}>
                                                Añadir
                                            </Button>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </ul>
                    </Card.Body>
                    </Card>
                </div>

            </Card.Body>
            </Card>

            <Modal
                show={this.state.onModalDelete}
            >
            <Modal.Header>
                <Modal.Title>¿Seguro que deseas eliminar el desafío?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="primary" onClick={() => this.deleteChallenge()}>Aceptar</Button>
                <Button variant="danger" onClick={() => this.onModalDeleteChallenge(false, -1)}>Cancelar</Button>
            </Modal.Footer>
            </Modal>

        </div>
        );
    }


}

export default ViewCollection;