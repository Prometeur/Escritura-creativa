/*
*  Name_file :Group.js
*  Description: Contiene los datos de un grupo segun un ID dado.
*    
*/
import React, { Component } from 'react';
import AdminService from '../../../services/admin/adminService.js';
import Datos from "./GroupInfo";
import Estudiantes from "./GroupStudents";

/** Estilos CSS*/
import '../../../styles/styleGeneral.css';

/**Estilos importados*/
import Card from 'react-bootstrap/Card';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class Group extends Component {
    
        constructor(props){
            super(props);
    
            this.state = {
                ventana: 1,
                data: [],
            }
            this.handler = this.handler.bind(this)
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
       
        AdminService.getGroupData(this.props.match.params.idGroup).then(response => {
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
        
       let idGroup = this.props.match.params.idGroup;

       let tabs =   <TabList>
                        <Tab>DATOS</Tab>
                        <Tab>ESTUDIANTES</Tab>
                    </TabList>;

        let secondTab = <Estudiantes key={idGroup} idGroup={idGroup}/>;


        return (
           <div className="container">
               <Card className={"card-long"}>
                   <Card.Body>
                       <div className={"row-edit"}>
                            <div className={"section-title"}>
                                <h2> Información del grupo </h2>
                            </div>
                       </div>
                       <Tabs>
                           {tabs}
                           <TabPanel>
                               <Datos key={idGroup} idGroup={idGroup} handler ={this.handler}/>
                           </TabPanel>
                           <TabPanel>
                               {secondTab}
                           </TabPanel>
                       </Tabs>
                   </Card.Body>
               </Card>
           </div>
        );


    }


}

export default Group;