/*
*  Name_file :ProfileScripts.js
*  Description: Componente que contiene la lista de escritos del estudiante
*/
import React, { Component } from 'react';
import TeacherService from "../../../services/teacher/teacherService.js";
import { Link } from "react-router-dom";

/**Estilos CSS*/
import '../../../styles/ScriptList.css';

/**Estilos bootstrap*/
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";

class GroupTeacher extends Component {

     constructor(props) {
        super(props);

        this.state = {
            data: [],
            filteredData:[],
            searchKey: '',
            searchType: 'nombre'
        };

     }
    

    /*Se hacen peticiones al servidor para que me devuelva la tabla desafios, me muestra todos los desafios del grupo seleccioando 
    por el profesor*/
    peticionGet = () => {
        TeacherService.getScriptsByStudent(this.props.idStudent).then(response => {
            console.log(response);//muestra consola navegador
            this.setState({ data: response });
            console.log(response);
            this.setState({ filteredData: response });
        }).catch(error => {
            console.log(error.message);
        })
    }

    //Filtra los datos de los escritos buscados para solo buscar en la base de datos una vez
    filterData = () =>{
        let auxArray = [];
        this.state.filteredData = [];
        for(let i = 0; i < this.state.data.length; i++){
            if(this.state.searchType == "titulo")
            {
                if(new RegExp( this.state.searchKey, 'i'  ).test(this.state.data[i].titulo))
                {
                    auxArray.push(this.state.data[i]);
                }
            }
            else
            {
                if((new RegExp(this.state.searchKey, 'i' ).test(this.state.data[i].nombre)) )
                {
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


    /*Si vuelvo a la pagina de login, comprueba si el usuario ya inicio sesion anteriomente
   si es el caso lo redirige a la home segun su rol*/
    componentDidMount() {
        this.peticionGet();
    }

    /*Dibuja la pagina  */
    render() {
        let cartel =<></>;
        let tabla =
        <div className = "scriptList">
        
            {this.state.filteredData.map(script => {
                return (
                <div className ="scriptCardContainer">
                    <Link to={`/teacher/editWriting/${script.idGrupo}/${script.idDesafio}/${script.id}/${script.idEscritor}`}>
                        <Card
                            key={script.idGrupo}
                            style={{ width: '18rem' }}
                            className="mb-2"
                            bg={'Light'}
                        >
                            <Card.Header>
                                <h5>{script.nombre}</h5>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    <h6>Desafío</h6>
                                </Card.Title>
                                <Card.Text>
                                    <h5>{script.titulo}</h5>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </div>
                )
            })}

    </div>
    ;
        if(this.state.filteredData.length === 0)
        {
            cartel = <div className={"row-edit"}>
                        <Alert variant={"danger"}>
                            No hay resultados para la búsqueda realizada.
                        </Alert>
                    </div>;
            tabla = <></>;
        }


        return (
            <>
                <ul className={"container-column-list"}>
                    <li className={"items-row"}>
                        <label className={"form-label"}>Buscar estudiante</label>
                    </li>
                    <li className={"items-row"}>
                        <input type="text" name="searchKey" onChange={this.handleChangeSearch} />
                    </li>
                    <li className={"items-row"}>
                        <img src="/search.png" alt="" />
                    </li>
                    <li className={"items-row"}>
                        <label  className={"form-label"} htmlFor="searchType">Escoja cómo buscar</label>
                    </li>
                    <li className={"items-row"}>
                        <select name="searchType" id="searchType" onChange={this.handleChangeSearchType}>
                            <option value="nombre">Nombre</option>
                            <option value="titulo">Título</option>
                        </select>
                    </li>
                </ul>
                <div className={"row-edit"}>
                    {cartel}
                    {tabla}
                </div>
            </>
        );
    }

}

export default GroupTeacher;