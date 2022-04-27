/*
*  Name_file :Profile.js
*  Description: Contiene los datos de un usuario segun un ID dado.
*    
*/

import React, { Component } from 'react';
import TeacherService from '../../../services/teacher/teacherService.js';
import Datos from "./ProfileInfo";
import Escritos from "./ProfileScripts";
import Grupos from "./TeacherGroups";

/**Estilos bibliotecas externas*/
import  Card from 'react-bootstrap/Card';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Alert from 'react-bootstrap/Alert';

/**Estilos css*/
import 'react-tabs/style/react-tabs.css';
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';


class Profile extends Component {

    constructor(props){
        super(props);

        this.handler = this.handler.bind(this);
        this.state = {
            ventana: 1,
            data: [],
        };
    }

    //Permite refrescar la página desde abajo
    handler() {
       this.peticionGet();
      }

    cambiaVentana = (opcion) =>{
        this.setState({ventana : opcion});
    }

    /*Se hacen peticiones al servidor para que me devuelva los datos del estudiante*/
    peticionGet() {
       
        TeacherService.getProfile(this.props.match.params.idStudent).then(response => {
              this.setState({data:response});
        }).catch(error => {
            console.log(error.message);
        })
    }

    componentDidMount() {
         this.peticionGet();
       }

    /*Dibuja la pagina  */
    render() {
        
       let idStudent = this.props.match.params.idStudent;

       let tabs =   <TabList>
                        <Tab>DATOS</Tab>
                        <Tab>ESCRITOS</Tab>
                    </TabList>;

        if(this.state.data.rol == "T"){
            tabs =   <TabList>
                        <Tab>DATOS</Tab>
                        <Tab>GRUPOS</Tab>
                    </TabList>;
        }

        if(this.state.data.rol == "A"){
            tabs =   <TabList>
                        <Tab>DATOS</Tab>
                    </TabList>;
        }

        if(this.state.data.activo === 0){
            tabs =   <TabList>
                        <Tab>DATOS</Tab>
                    </TabList>;
        }

        let secondTab = <Escritos key={idStudent} idStudent={idStudent}/>;

        if(this.state.data.rol == "T"){ //COMPLETAR LUEGO CON LA VISTA DE GRUPOS 
            secondTab = <Grupos key={idStudent} idStudent={idStudent}/> ;
        }

        return (
           <div className="container">
               <Card className="card-long">
                   <Card.Body>
                       <div className={"row-edit"}>
                           <div className={"section-title"}>
                               <h2>Perfil del estudiante</h2>
                           </div>
                           <br/>
                           <Alert variant={"info"}>
                               <img src="/info.png" alt=""/>
                                Puede usar este espacio para ver los escritos del estudiantes o aplicar otras opciones.
                           </Alert>
                       </div>
                       <div className={"row-edit"}>
                           <Tabs>
                               {tabs}
                               <TabPanel>
                                   <Datos key={idStudent} idStudent={idStudent} handler ={this.handler}/>
                               </TabPanel>
                               <TabPanel>
                                   {secondTab}
                               </TabPanel>
                           </Tabs>
                       </div>
                   </Card.Body>
               </Card>
           </div>
        );
    }


}

export default Profile;