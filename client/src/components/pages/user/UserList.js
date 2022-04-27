/*
*  Name_file :UserList.js
*  Description: Contiene una lista de los usuarios activos en la plataforma.
*    
*/

import React, { Component } from 'react';
import { Link} from "react-router-dom";

/**Estilos CSS*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';
import '../../../styles/Challenge.css';


/**Estilos Bootsrap */
import Card from 'react-bootstrap/Card';
import Button  from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import adminService from '../../../services/admin/adminService';
import Alert from 'react-bootstrap/Alert';


class SearchStudentRes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            filteredData:[],
            searchName: '',
            searchType: 'nombre',
            searchRole:"none"
    
        };
    }


  /*Se hacen peticiones al servidor para que me devuelva todos los usuarios buscados*/
    peticionPost = () => {
        adminService.getUsers(this.state.searchName, this.state.searchType).then(response =>{
            this.setState({data:response});
            this.setState({filteredData:response});
            this.filterData();
        })
    }

    //Filtra los datos de los estudiantes buscados para solo buscar en la base de datos una vez
    filterData = () =>{
        let auxArray = [];
        this.state.filteredData = [];
        for(let i = 0; i < this.state.data.length; i++){
            if(this.state.searchType == "email")
            {
                if(new RegExp( this.state.searchName, 'i'  ).test(this.state.data[i].correo))
                {
                    auxArray.push(this.state.data[i]);
                }
            }
            else
            {
                if((new RegExp(this.state.searchName, 'i' ).test(this.state.data[i].nombre)) || (new RegExp( this.state.searchName, 'i' ).test(this.state.data[i].apellidos)) )
                {
                    auxArray.push(this.state.data[i]);
                }
            }
        }
        let finalArray = [];
        if(this.state.searchRole != "none")
        {
            for(let i = 0; i < auxArray.length; i++){
                if(auxArray[i].rol === this.state.searchRole){
                    finalArray.push(auxArray[i]);
                }
            }
        }
        else{
            finalArray = auxArray;
        }

        this.setState({ filteredData: finalArray });

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

    changeViewUserProfile = (idUser) => 
    {
        window.location.href = '/admin/users/viewProfile/'+ idUser;
    }
    

    componentDidMount() {
        this.peticionPost();
    }


    /*Dibuja la pagina  */
    render() {
        let cartel =<> </>;
        let tabla = <ul className={"flex-items-row-start wrap"}>
            {this.state.filteredData.map((user) => 
                (
                    <li className={"items-row"}>
                        <br/>
                        <ul className={"container-column-list wrap"}>
                            <li className={"flex-item-list"}>
                                <img
                                    src={(user.ruta!= "") ? (user.ruta) : "/chicaliteratura.png" }
                                    alt="" style={{width: '40%',  borderRadius: '80%'}} >

                                </img>
                            </li>
                            <li className={"flex-item-list"}>
                                {user.nombre}
                            </li>
                            <li className={"flex-item-list"}>
                                {user.apellidos}
                            </li>
                            <li className={"flex-item-list"}>
                                {user.correo}
                            </li>
                            <li className={"flex-item-list"}>
                                <Link key={user.id} to={`/admin/users/viewProfile/${user.id}`}>
                                    <Button size={"sm"} text='Ver Perfil'> Ver perfil </Button>
                                </Link>
                            </li>
                        </ul>
                        <hr/>
                    </li>
                )
            )}
    </ul>;
        if(this.state.filteredData.length === 0)
        {
            cartel = <div className={"row-edit"}>
                        <Alert variant={"danger"}>
                            <h6>No hay resultados para la búsqueda realizada.</h6>
                        </Alert>
                    </div>;
            tabla = <div></div>;
        }


        return (
            <div className="container">
                <Card className="card-edit">
                    <Card.Body>
                        <div className={"row-edit"}>
                            <div className={"section-title"}>
                                <h2>Usuarios activos </h2>
                            </div>
                        </div>
                        <div className={"row-edit"}>
                            <Alert variant={"info"}>
                                <img src="/info.png" alt=""/>
                                 Listado de los usuarios activos en la plataforma.
                            </Alert>
                        </div>
                        <div className={"row-edit"}>
                            <ul className={"flex-row"}>
                                <li className={"flex-item-form"}>
                                    <div className={"form-select"}>
                                        <label className={"form-label"}>Buscar usuario  <img src="/search.png" alt=""/></label>
                                        <input type="text" name="searchName" onChange={this.handleChangeSearch} />
                                    </div>
    
                                </li>
                                <li className={"flex-item-form"}>
                                    <div className={"form-select"}>
                                        <label className={"form-label"} htmlFor="searchType">Escoja cómo buscar</label>
                                        <select name="searchType" id="searchType" onChange={this.handleChangeSearchType}>
                                            <option value="nombre">Nombre</option>
                                            <option value="email">Email</option>
                                        </select>
                                    </div>
                                </li>
                                <li className={"flex-item-form"}>
                                    <div className={"form-select"}>
                                        <label className={"form-label"} htmlFor="searchRole">Buscar por rol</label>
                                        <select name="searchRole" id="searchRole" onChange={this.handleChangeSearchRole}>
                                            <option value="none">Todos</option>
                                            <option value="S">Estudiantes</option>
                                            <option value="T">Profesores</option>
                                            <option value="A">Administradores</option>
                                        </select>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={"row-edit"}>
                            <Card className={"card-long"}>
                                <Card.Body>
                                    {cartel}
                                    {tabla}
                                </Card.Body>
                            </Card>
                        </div>
                    </Card.Body>
                </Card>
            </div>

        );
    }


}

export default SearchStudentRes;