/*
*  Name_file :TeacherGroups.js
*  Description: Pagina que lista los grupos creados por un profesor
*  que tiene el grupo seleccionado por el profesor  
*/

import React, { Component } from 'react';
import { Link} from "react-router-dom";
import adminService from '../../../services/admin/adminService';

/** Estilos CSS*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

/**Estilos bootstrap*/
import Card from 'react-bootstrap/Card';
import Button  from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';


class GroupList extends Component {

    state = {
        data: [],
        filteredData: [],
        searchKey: '',
        searchType: 'nombre'

    }

    /*Se hacen peticiones al servidor para que me devuelva todos los grupos del profesor*/
    peticionGet = () => {
        adminService.getGroupsOfTeacher(this.props.idStudent).then(response => {
            this.setState({ data: response });
            this.filterData();
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Se llama a esta función nada más cargar la página*/
    componentDidMount() {
        this.peticionGet();
    }

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleChangeSearch = async e => {
        await this.setState({
                [e.target.name]: e.target.value
        });
        this.filterData();
    }

    //Filtra los datos de los escritos buscados para solo buscar en la base de datos una vez
    filterData = () =>{
        let auxArray = [];
        this.state.filteredData = [];
        for(let i = 0; i < this.state.data.length; i++){
                if((new RegExp(this.state.searchKey, 'i' ).test(this.state.data[i].nombre)) )
                {
                    auxArray.push(this.state.data[i]);
                }
        }
        this.setState({ filteredData: auxArray });
    }

    
    /*Dibuja la pagina  */
    render() {

        let cartel =<> </>;
        let tabla = <ul className={"flex-items-row-start wrap"}>

            {this.state.filteredData.map((group) => 
                (

                    <li className={"items-row"}>
                        <ul className={"container-column-list wrap"}>
                            <li className={"flex-item-list"}>
                                <img src="/team_black.png" alt=""/>
                            </li>
                            <li className={"flex-item-list"}>
                                {group.nombre}
                            </li>
                            <li className={"flex-item-list"}>
                                <Link key={group.id} to={`/admin/viewGroup/${group.id}`}>
                                    <Button  size={"sm"} text='Ver Grupo'> Ver grupo </Button>
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

             <Card className="card-long">
                 <Card.Body>
                    <div  className={"row-edit"}>
                        <label className={"form-label"}>Buscar grupo</label>
                        <br />
                        <input type="text" name="searchKey" onChange={this.handleChangeSearch} />
                        <img src="/search.png" alt=""/>
                    </div>
                     <br/>
                        <div className={"row-edit"}>
                            {cartel}
                            {tabla}
                        </div>
                     <img src="./group.png" alt=""/>
                    </Card.Body>
                </Card>

        );
    }

}

export default GroupList;