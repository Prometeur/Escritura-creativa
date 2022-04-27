/*
*  Name_file :SearchStudentRes.js
*  Description: Contiene una lista de resultado de la búsqueda de los estudiantes.
*    
*/

import React, { Component } from 'react';
import { Link } from "react-router-dom";
import AuthUser from '../../../services/authenticity/auth-service.js';
import TeacherService from '../../../services/teacher/teacherService.js';

/** Estilos CSS*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

/**Estilos*/
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from "react-bootstrap/Alert";

class SearchStudentRes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filteredData: [],
            searchName: '',
            currentUserId: '',
            currentUserRole: '',
            searchType: 'nombre',
            searchRole: "none",
            showListApplicants: false,//muestra solicitantes
            dataGroups: [],
            showApplicantsGroups: false,
        };
    }


    //Filtra los datos de los estudiantes buscados para solo buscar en la base de datos una vez
    filterData = () => {
        let auxArray = [];
        this.state.filteredData = [];
        for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.searchType == "email") {
                if (new RegExp(this.state.searchName, 'i').test(this.state.data[i].correo)) {
                    auxArray.push(this.state.data[i]);
                }
            }
            else {
                if ((new RegExp(this.state.searchName, 'i').test(this.state.data[i].nombre)) || (new RegExp(this.state.searchName, 'i').test(this.state.data[i].apellidos))) {
                    auxArray.push(this.state.data[i]);
                }
            }
        }
        let finalArray = [];
        if (this.state.searchRole != "none") {
            for (let i = 0; i < auxArray.length; i++) {
                if (auxArray[i].rol === this.state.searchRole) {
                    finalArray.push(auxArray[i]);
                }
            }
        }
        else {
            finalArray = auxArray;
        }

        this.setState({ filteredData: finalArray });
    }

    //Aceptar solicitud de grupo
    acceptGroupRequest = (idGrupo, idEstudiante) => {
        /*Edita escrito del estudiante*/
        TeacherService.acceptGroupRequest(idGrupo, idEstudiante)
            .then(response => {
                    window.location.href = '/teacher/applicants';
            })
            .catch(error => {
                console.log(error.message);
            });
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

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleChangeSearchRole = async e => {
        await this.setState({
            [e.target.name]: e.target.value
        });
        this.filterData();
    }

    changeViewStudentProfile = (idStudent) => {
        window.location.href = '/teacher/students/viewProfile/' + idStudent;
    }


    componentDidMount() {

        const dataUser = AuthUser.getCurrentUser();
        this.setState({
            currentUserRole: dataUser.rol
        });

        if (dataUser.rol == "T") {
            this.setState({ searchRole: "S" });
        }

        TeacherService.searchApplicant(this.state.searchName, this.state.searchType)
            .then(response => {
                if (response.length > 0) {//Si existen solicitantes
                    this.setState({ data: response });
                    this.setState({ filteredData: response });
                    this.setState({
                        currentUserRole: dataUser.rol
                    });
                    this.setState({ showListApplicants: true });//muestra lista de solicitantes
                    this.filterData();
                }
            })

        TeacherService.showGroupRequest()
        .then(response => {
            if (response.length > 0) {//Si existen solicitantes
                this.setState({ dataGroups: response, showApplicantsGroups: true });
                this.filterData();
            }
        })
        
    }


    /*Dibuja la pagina  */
    render() {
        let cartel = <> </>;
        let header = <> </>;
        let tabla = <> </>;
        if (this.state.currentUserRole === "T") {
            header = <div><label className={"form-label"}>Listado de estudiantes que quieren unirse a Creativa: </label></div>;
            tabla = <ul className={"flex-items-row-start wrap"}  >

                {this.state.filteredData.map((student) =>
                (
                     <li className={"items-row"}>
                         <ul className={"container-column-list wrap"}>
                             <li className={"flex-item-list"}>
                                 <img src={(student.ruta!= "") ? (student.ruta) : "../chicaliteratura.png"}
                                      alt=""
                                      style={{ width: '40%', borderRadius: '80%' }} >

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
                                     <Button size={"sm"} text='Ver Perfil'> Ver perfil </Button>
                                 </Link>
                             </li>
                         </ul>
                         <hr/>
                    </li>

                )
                )}

            </ul>;
        }

        let headerGroups = <> </>;
        let tablaGroups = <> </>;
        if (this.state.currentUserRole === "T") {
            headerGroups = <div><label className={"form-label"}>Listado de estudiantes que quieren unirse a un grupo: </label></div>;
            tablaGroups = <ul className={"flex-items-row-start wrap"}  >

                {this.state.dataGroups.map((student) =>
                (
                     <li className={"items-row"}>
                         <ul className={"container-column-list wrap"}>
                             <li className={"flex-item-list"}>
                                 <img src={(student.ruta!= "") ? (student.ruta) : "../chicaliteratura.png"}
                                      alt=""
                                      style={{ width: '40%', borderRadius: '80%' }} >

                                 </img>
                             </li>
                              <li className={"flex-item-list"}>
                                 {student.nombre}
                             </li>
                             <li className={"flex-item-list"}>
                                 {student.apellidos}
                             </li>
                             <li className={"flex-item-list"}>
                                 {student.nombregrupo}
                             </li> 
                             <li className={"flex-item-list"}>
                             <div className="form-button">
                                <Button variant="success" onClick={() => this.acceptGroupRequest(student.idGrupo, student.idEstudiante)}>Aceptar</Button>
                            </div>
                             </li>
                         </ul>
                         <hr/>
                    </li>

                )
                )}

            </ul>;
        }


        if (this.state.currentUserRole === "A") {
            header = <div><label className={"form-label"}>Listado de estudiantes que quieren unirse a Creativa: </label></div>;
            tabla = <ul className={"flex-items-row-start wrap"}>
                {this.state.filteredData.map((student) =>
                (
                    <li className={"items-row"}>
                        <ul className={"container-column-list wrap"}>
                            <li className={"flex-item-list"}>
                                <img src={(student.ruta != "") ? (student.ruta) : "/chicaliteratura_sizebig.png"}
                                     alt=""
                                     style={{ width: '40%', borderRadius: '80%' ,marginLeft:'2rem'}} >

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
                                <Link key={student.id} to={`/admin/users/viewProfile/${student.id}`}>
                                    <Button  size={"sm"} text='Ver Perfil'> Ver perfil </Button>
                                </Link>
                            </li>
                        </ul>
                        <hr/>
                    </li>
                  )
                )}
            </ul>;
        }


        if (this.state.filteredData.length === 0) {
            cartel = <div className={"row-edit"}>
                        <Alert variant={"danger"}>
                            No hay resultados para la búsqueda realizada
                        </Alert>
                    </div>

            tabla = <></>;
        }

        let searchtools =
            <ul className={"container-column-list"}>
                <li className={"items-row"}>
                    <label className={"form-label"}>Buscar estudiante</label>
                </li>
                <li className={"items-row"}>
                    <input type="text" name="searchName" onChange={this.handleChangeSearch} />
                </li>
                <li className={"items-row"}>
                    <img src="../../search.png" alt="" />
                </li>
                <li className={"items-row"}>
                    <label className={"form-label"}>Escoja cómo buscar</label>
                </li>
                <li className={"items-row"}>
                    <select name="searchType" id="searchType" onChange={this.handleChangeSearchType}>
                        <option value="nombre">Nombre</option>
                        <option value="email">Email</option>
                    </select>
                </li>
            </ul>;

        if (this.state.currentUserRole == "A") {
            searchtools =
                <ul className={"flex-row"}>
                    <li className={"flex-item-form"}>
                        <div className={"form-select"}>
                            <label className={"form-label"}>Buscar estudiante<img src="../../search.png" alt="" /></label>
                            <input type="text" name="searchName" onChange={this.handleChangeSearch} />
                        </div>
                    </li>
                    <li className={"flex-item-form"}>
                        <div className={"form-select"}>
                            <label className={"form-label"}>Escoja cómo buscar</label>
                            <select name="searchType" id="searchType" onChange={this.handleChangeSearchType}>
                                <option value="nombre">Nombre</option>
                                <option value="email">Email</option>
                            </select>
                        </div>
                    </li>
                    <li className={"flex-item-form"}>
                        <div className={"form-select"}>
                            <label className={"form-label"}>Buscar por rol</label>
                            <select name="searchRole" id="searchRole" onChange={this.handleChangeSearchRole}>
                                <option value="none">Todos</option>
                                <option value="S">Estudiantes</option>
                                <option value="T">Profesores</option>
                                <option value="A">Administradores</option>
                            </select>
                        </div>
                    </li>
                </ul>
        }
        const { showListApplicants, showApplicantsGroups } = this.state;
        return (
            <div className="container">
                <Card className="card-long">
                    <Card.Body>
                        <div className={"row-edit"}>
                            <div className={"section-title"}>
                                <h2>Lista de solicitantes</h2>
                            </div>
                            <br />
                            <Alert variant={"info"}>
                                <img src="/info.png" alt="" />
                                Desde este espacio puede ver las solicitudes.
                            </Alert>
                            <br />
                        </div>

                        {header}
                        {showListApplicants ? (

                                <div className={"row-edit"}>
                                    {searchtools}
                                    <Card className={"card-long"}>
                                    <Card.Body>
                                        {cartel}
                                        {tabla}
                                    </Card.Body>
                                    </Card>
                                </div>
                        ) : (
                            <div className="row-edit">
                                <Alert variant={"danger"}>
                                    No hay solicitantes para mostrar
                                </Alert>
                            </div>
                        )}
                        <br/>

                        {headerGroups}
                        {showApplicantsGroups ? (

                                <div className={"row-edit"}>
                                    <Card className={"card-long"}>
                                    <Card.Body>
                                        {tablaGroups}
                                    </Card.Body>
                                    </Card>
                                </div>
                        ) : (
                            <div className="row-edit">
                                <Alert variant={"danger"}>
                                    No hay solicitantes para mostrar
                                </Alert>
                            </div>
                        )}
                        <br/>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default SearchStudentRes;