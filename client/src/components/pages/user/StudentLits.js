/*
*  Name_file :SearchStudentRes.js
*  Description: Contiene una lista de resultado de la búsqueda de los estudiantes.
*    
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import TeacherService from '../../../services/teacher/teacherService.js';

/** Estilos CSS*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

/** Estilos*/
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Alert from "react-bootstrap/Alert";

class SearchStudentRes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            filteredData: [],
            searchStudent: '',
            searchType: 'nombre',
            showListStudents: false,//muestra lista estudiantes
        };
    }


    //Filtra los datos de los estudiantes buscados para solo buscar en la base de datos una vez
    filterData = () => {
        let auxArray = [];
        //this.state.filteredData = [];
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.searchType == "email") {
                if (new RegExp(this.state.searchStudent, 'i').test(this.state.data[i].correo)) {
                    auxArray.push(this.state.data[i]);
                }
            }
            else {
                if ((new RegExp(this.state.searchStudent, 'i').test(this.state.data[i].nombre)) || (new RegExp(this.state.searchStudent, 'i').test(this.state.data[i].apellidos))) {
                    auxArray.push(this.state.data[i]);
                }
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

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleChangeSearchType = async e => {
        await this.setState({
            [e.target.name]: e.target.value
        });
        this.filterData();
    }

    changeViewStudentProfile = (idStudent) => {
        window.location.href = '/teacher/students/viewProfile/' + idStudent;
    }


    componentDidMount() {

        TeacherService.searchStudent(this.state.searchStudent, this.state.searchType).then(response => {
            if (response.length > 0) {//si existen estudiantes
                this.setState({ data: response });
                this.setState({ filteredData: response });
                this.setState({ showListStudents: true });
                this.filterData();
            }

        })

    }


    /*Dibuja la pagina  */
    render() {


        let cartel = <div> </div>;
        let tabla = <ul className={"flex-items-row-start wrap"}>
            {this.state.filteredData.map((student) => (
                <li className={"items-row"}>
                    <ul className={"container-column-list wrap"}>
                        <li className={"flex-item-list"}>
                            <img src={(student.ruta !="") ? (student.ruta) : "/chicaliteratura.png"}
                                alt="" style={{ width: '2rem', borderRadius: '80%' }} >
                            </img>
                        </li>
                        <li className={"flex-item-list"}>
                            {student.nombre}
                        </li>
                        <li className={"flex-item-list"}>
                            {student.apellidos}
                        </li>
                        <li className={"flex-item-list"}>
                            {student.correo}
                        </li>
                        <li className={"flex-item-list"}>
                            <Link key={student.id} to={`/teacher/students/viewProfile/${student.id}`}>
                                <Button size={"sm"} variant={"primary"} text='Ver Perfil'> Ver perfil </Button>
                            </Link>
                        </li>
                    </ul>
                    <hr />
                </li>
            ))}
        </ul>;

        if (this.state.filteredData.length === 0) {
            cartel = <div className={"row-edit"}>
                <br />
                <h4>No hay resultados para la búsqueda realizada.</h4>
            </div>;
            tabla = <></>;
        }

        const { showListStudents } = this.state;
        return (
            <div className="container">
                <Card className="card-long">
                    <Card.Body>
                        <div className={"row-edit"}>
                            <div className={"section-title"}>
                                <h2>Lista de estudiantes</h2>
                            </div>
                            <br />
                            <Alert variant={"info"}>
                                <img src="/info.png" alt="" />
                               Desde este espacio puede ver la lista de sus estudiantes participantes.
                           </Alert>
                        </div>
                        {showListStudents ? (
                            <div>
                                <div className={"row-edit"}>
                                    <ul className={"container-column-list"}>
                                        <li className={"items-row"}>
                                            <label className={"form-label"}>Buscar estudiante: </label>
                                        </li>
                                        <li className={"items-row"}>
                                            <input type="text" name="searchStudent" onChange={this.handleChangeSearch} />
                                        </li>
                                        <li className={"items-row"}>
                                            <img src="../../search.png" alt="" />
                                        </li>
                                        <li className={"items-row"}>
                                            <label className={"form-label"} htmlFor="searchType">Escoja cómo buscar:</label>
                                        </li>
                                        <li className={"items-row"}>
                                            <select name="searchType" id="searchType" onChange={this.handleChangeSearchType}>
                                                <option value="nombre">Nombre</option>
                                                <option value="email">Email</option>
                                            </select>
                                        </li>
                                    </ul>
                                </div>
                                <div className={"row-edit"}>
                                    <Card className={"card-long"}>
                                        <Card.Body >
                                            {cartel}
                                            {tabla}
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <div className="table-margin">
                                <p>No hay estudiantes para mostrar</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        );
    }


}

export default SearchStudentRes;