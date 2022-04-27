/*
*  Name_file :Challenges.js
*  Description: Pagina del grupo seleccionado por profesor, contiene la vista de los desafios  
*  que tiene el grupo seleccionado por el profesor  
*/
import React, { Component } from 'react';

import TeacherService from '../../../services/teacher/teacherService';
import moment from 'moment';
import { Link } from "react-router-dom";

// Componentes de estilos
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

// Estilos
import '../../../styles/styleGeneral.css';
import '../../../styles/styleButton.css';

class Challenges extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteChallenge: '',//desafio que va ser eliminado(desactivado)
            modalDeleteChallenge: false,//modal para eliminar desafio
            categories: [],
            data: [],// Contiene todos los desafios del profesor para el grupo seleccionado
        };
    }

    componentDidMount() {
        //Obtiene los desafios del grupo seleccionado por el profesor
        TeacherService.getChallenges(this.props.groupSelect)
            .then(response => {
                this.setState({ data: response });
            }).catch(error => {
                console.log(error.message);
            })

        //Obtiene las categorias del desafio al iniciar
        TeacherService.getCategories()
            .then(response => {
                this.setState({ categories: response });
            }).catch(error => {
                console.log(error.message);
            })
    }

    deleteChallenge = (challenge) => {
        this.closeModalDeleteChallenge();
        var contador = 0;
        var arreglo = this.state.data;
        arreglo.map((registro) => {
            if (challenge.id === registro.id) {
                arreglo.splice(contador, 1);
            }
            contador++;
        });
        this.setState({ data: arreglo });
        TeacherService.deleteChallenge(challenge.id).then(response => {
        }).catch(error => {
            console.log(error.message);
        })
    }

    //Obtiene el nombre del desafio/escrito
    showCollaborative = (challenge) => {
        if (challenge.colaborativo === 1) {
            return "Individual"
        }
        else {
            return "Colaborativo"
        }
    }

    //Muestra modal de confirmación para eliminar fichero multimedia
    askDeleteChallenge = (challenge) => {
        this.setState({
            modalDeleteChallenge: true,
            deleteChallenge: challenge
        });
    }

    //Cierra el modal de eliminar fichero
    closeModalDeleteChallenge = () => {
        this.setState({ modalDeleteChallenge: false });
    };

    /*Dibuja la pagina  */
    render() {
        let formatedDate;
        const { categories, data } = this.state;
        let tabla = <div className="row-edit">
            <label className={"form-label"}> Listado de desafíos</label>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Categoria</th>
                        <th>Tipo</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data.filter(challenge => challenge.activo === 1).map((challenge, index) =>
                        <tr key={challenge.id}>
                            <td className="challenge-td">{challenge.titulo}</td>
                            {categories.filter(category => category.id === challenge.idCategoria).map((item, index) =>
                                <td className="challenge-td">{item.nombre}</td>
                            )}
                            <td className="challenge-td">{this.showCollaborative(challenge)}</td>
                            <td className="challenge-td">{formatedDate = moment(challenge.fechaFin).format('DD/MM/YYYY')}</td>
                            <td className="challenge-td">{formatedDate = moment(challenge.fechaFin).format('LT')}</td>
                            <td ><Link to={`/teacher/editChallenge/${this.props.groupSelect}/${challenge.id}`}><img src={"../edit.png"} alt={"editar"}></img> Editar</Link></td>
                            {/* <td><img className={"img-icon"} src="../delete.png" alt="delete"></img><Link onClick={() => this.askDeleteChallenge(challenge)}>Borrar</Link></td> */}
                            <td><Button size={"sm"} variant="danger" onClick={() => this.askDeleteChallenge(challenge)}>
                                    Borrar
                                </Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>;

    if (data.length === 0)
    {
        tabla = <div className="row-edit">
                        <Alert variant={"danger"}>
                            No hay desafíos en estos momentos.
                        </Alert>
                </div>;
    }


        return (
            <Card className={"card-long"}>
                <Card.Body>
                    <div className="button-direction-left">

                        <Link to={`/teacher/createChallenge/${this.props.groupSelect}`}>
                            <Button variant="success">
                                <img src="/add-white.png" alt=""/>
                                Crear desafio
                            </Button>
                        </Link>
                    </div>
                    {tabla}
                    <Modal show={this.state.modalDeleteChallenge}>
                        <Modal.Header>
                            <Modal.Title>Aviso</Modal.Title>
                            <img src="../triangle.png"></img>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Seguro que desea eliminar {this.state.deleteChallenge.titulo}?
                    </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={() => this.deleteChallenge(this.state.deleteChallenge)}>Aceptar</Button>
                            <Button variant="danger" onClick={() => this.closeModalDeleteChallenge()}>Cancelar</Button>
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
            </Card>
        );
    }
}

export default Challenges;