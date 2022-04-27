/*
*  Name_file :ViewTeam.js
*  Description: Contiene los datos de un equipo segun un ID dado.
*    
*/
import React, { Component } from 'react';
import TeacherService from '../../../services/teacher/teacherService.js';
import Datos from "./ViewTeamInfo";
import Escritos from "./ViewTeamScripts";

/** Estilos*/
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

/**Estilos CSS*/
import 'react-tabs/style/react-tabs.css';
import '../../../styles/styleGeneral.css';

class ViewTeam extends Component {
t
    constructor(props){
        super(props);
        this.handler = this.handler.bind(this)
        this.state = {
            ventana: 1,
            data: [],
        }

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

        TeacherService.getTeam(this.props.match.params.idTeam).then(response => {
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
        
       let idTeam = this.props.match.params.idTeam;
       let tabs =
               <TabList>
                    <Tab>MIEMBROS</Tab>
                    <Tab>ESCRITOS</Tab>
                </TabList>;
        
        let secondTab = <Escritos key={idTeam} idTeam={idTeam}/>;

        return (
           <div className="container">
              <Card className={"card-long"}>
                <Card.Body>
                    <div className={"row-edit"}>
                        <div className={"section-title"}>
                            <h2>Infomación del equipo</h2>
                        </div>
                        <br/>
                        <Alert variant={"info"}>
                            <img src="/info.png" alt=""/>
                            Desde este espacio puede ver a los miembros y escritos de un equipo.
                        </Alert>
                    </div>
                    <div className={"row-edit"}>
                        <Tabs>
                            {tabs}
                            <TabPanel>
                                <Datos key={idTeam} idTeam={idTeam} handler ={this.handler}/>
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

export default ViewTeam;