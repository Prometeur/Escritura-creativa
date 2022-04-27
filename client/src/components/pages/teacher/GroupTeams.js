/*
*  Name_file :GroupTeams.js
*  Description: Contiene una lista de equipos de un grupo. Vive dentro de Group.js
*    
*/
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';
import '../../../styles/Challenge.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';
import teacherService from '../../../services/teacher/teacherService.js';

class GroupTeams extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            filteredData: [],
            searchKey: '',
            showListTeams: false,//muestra lista equipos
        };
    }

    //Filtra los datos de los estudiantes buscados para solo buscar en la base de datos una vez
    filterData = () => {
        let auxArray = [];
        //this.state.filteredData = [];
        for (let i = 0; i < this.state.data.length; i++) {

            if (new RegExp(this.state.searchKey, 'i').test(this.state.data[i].nombre)) {
                auxArray.push(this.state.data[i]);
            }

        }
        this.setState({ filteredData: auxArray });
    }

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleChangeSearch = async e => {
        await this.setState({
            [e.target.name]: e.target.value
        });
        this.filterData();
    }



    componentDidMount() {

        teacherService.getTeamsOfGroup(this.props.groupSelect).then(response => {
            if (response.length > 0) {//Si existen equipos
                this.setState({ data: response });
                this.setState({ filteredData: response });
                this.filterData();
                this.setState({ showListTeams: true });//muestra lista equipos

            }
        })
    }


    /*Dibuja la pagina  */
    render() {
        let cartel = <> </>;
        let tabla = <ul className={"flex-items-row-start wrap"}>
            {this.state.filteredData.map((team) =>
            (
                <li className={"items-row"}>
                    <br />
                    <ul className={"container-column-list wrap"}>
                        <li className={"flex-item-list"}>
                            <img src="../../team_black.png" alt="" />
                        </li>
                        <li className={"flex-item-list"}>
                            <h6>{team.nombre}</h6>
                        </li>
                        <li className={"flex-item-list"}>
                            <Link key={team.id} to={`/teacher/viewTeam/${team.id}`}>
                                <Button size={"sm"} variant={"primary"} text='Ver Equipo'>Ver equipo</Button>
                            </Link>
                        </li>
                    </ul>
                    <hr></hr>
                </li>

            )
            )}
        </ul>;
        if (this.state.filteredData.length === 0) {
            cartel = <Alert variant={"danger"}>
                        No hay equipos con esos parámetros.
                    </Alert>
            tabla = <></>;
        }

        const { showListTeams } = this.state;
        return (
            <Card className="card-long">
                <Card.Body>
                    {showListTeams ? (
                        <div>
                            <ul className={"container-column-list"}>
                                <li className={"items-row"}>
                                    <label className={"form-label"}>Buscar estudiante</label>
                                </li>
                                <li className={"items-row"}>
                                    <input type="text" name="searchKey" onChange={this.handleChangeSearch} />
                                </li>
                                <li className={"items-row"}>
                                    <img src="../../search.png" alt="" />
                                </li>
                            </ul>
                            {cartel}
                            {tabla}
                        </div>
                    ) : (
                        <div className="row-edit">
                            <Alert variant={"danger"}>
                                No hay equipos con esos parámetros.
                            </Alert>
                        </div>
                    )}
                </Card.Body>
            </Card>
        );
    }
}

export default GroupTeams;