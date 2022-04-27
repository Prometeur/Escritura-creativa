/*
*  Name_file :ViewTeamInfo.js
*  Description: Contiene los datos de un equipo segun un ID dado.
*    
*/

import React, { Component } from 'react';
import TeacherService from '../../../services/teacher/teacherService.js';
import { Link} from "react-router-dom";

/** Estilo CSS*/
import Button from "react-bootstrap/Button";



class ViewTeamInfo extends Component {
    
    constructor(props){
        super(props);

        this.state = {
            data: [],
            memberData: [],
        };
    }


    /*Se hacen peticiones al servidor para que me devuelva los datos del estudiante*/
    peticionGet() {
        TeacherService.getTeam(this.props.idTeam).then(response => {
              this.setState({data:response});
              this.peticionGetMembers();
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Se hacen peticiones al servidor para que me devuelva los datos del estudiante*/
    peticionGetMembers() {
        TeacherService.getMembersTeam(this.props.idTeam).then(response => {
              this.setState({memberData:response});
        }).catch(error => {
            console.log(error.message);
        })
    }

    /*Cargo todos los datos que necesito nada más cargar la página, como los datos del usuario o los grupos.*/
   componentDidMount() {
        this.peticionGet();
     
   }

    /*Dibuja la pagina  */
    render() {
        
        let cartel =<> </>;
        let contenido = <>
                            <ul className={"flex-items-row-start wrap"}>
                                {this.state.memberData.map((user) =>
                                    (
                                        <li className={"items-row"}>
                                            <br/>
                                            <ul className={"container-column-list wrap"}>
                                                <li className={"flex-item-list"}>
                                                    <img src={(user.ruta != "" ) ? (user.ruta) : "/chicaliteratura.png" }
                                                         alt=""
                                                         style={{width: '60px',  borderRadius: '80%',margin:"0 1rem 0 1rem"}}
                                                    >
                                                    </img>
                                                </li>
                                                <li className={"flex-item-list"}>
                                                    {user.nombreEstudiante}
                                                </li>
                                                <li className={"flex-item-list"}>
                                                    {user.apellidoEstudiante}
                                                </li>
                                                <li className={"flex-item-list"}>
                                                    <Link key={user.id} to={`/teacher/students/viewProfile/${user.idEstudiante}`}>
                                                        <Button text='Ver Perfil'> Ver perfil </Button>
                                                    </Link>
                                                </li>
                                            </ul>
                                            <hr/>
                                        </li>

                                    )
                                )}
                            </ul>
                    </>;


        return (

                <div>
                    {cartel}
                    {contenido}
                </div>
        );
    }


}

export default ViewTeamInfo;