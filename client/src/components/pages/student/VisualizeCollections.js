import React, { Component, useState } from 'react';
import { Link } from "react-router-dom";
import StudentService from '../../../services/student/student-service.js';
import AuthUser from '../../../services/authenticity/auth-service.js';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import DropdownItem from 'react-bootstrap/DropdownItem';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import FormControl from 'react-bootstrap/FormControl';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from 'react-bootstrap/Card';
import Icon from '@material-ui/core/Icon';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import AdminService from '../../../services/admin/adminService.js';
import Alert from "react-bootstrap/Alert";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Accordion from 'react-bootstrap/Accordion';

//Estilos
 import '../../../styles/styleCard.css';
 import '../../../styles/styleGeneral.css';
 import '../../../styles/styleButton.css';

 const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      {<Icon><ExpandMoreRoundedIcon></ExpandMoreRoundedIcon></Icon>}
    </a>
  ));
  
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Buscar grupo..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value) || child.props.children.toUpperCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );


class VisualizeCollections extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataGroup: [],
            idGroupSelect: 0,
            nameGroupSelect: '',
            nombreColeccion: "",
            onAlert: false,
            dataCollection: [],
            filtroBusqueda: '',
            dataCollectionFiltered: [],
            showListCollections: false,
        }
    }

    componentDidMount() {
        
        StudentService.getCollections(AuthUser.getCurrentUser().id, this.state.filtroBusqueda)
          .then(response => {
              if (response.length > 0)
              {
                this.setState({ dataCollection: response, dataCollectionFiltered: response, showListCollections: true });
                this.filterData();
              }
          })
    }


    //Filtra los datos de las colecciones buscadas para solo buscar en la base de datos una vez
    filterData = () => {
      let auxArray = [];
      //this.state.filteredData = [];
      for (let i = 0; i < this.state.dataCollection.length; i++) 
      {
          if (new RegExp(this.state.filtroBusqueda, 'i').test(this.state.dataCollection[i].nombreColeccion) ||
                (new RegExp(this.state.filtroBusqueda, 'i').test(this.state.dataCollection[i].nombreGrupo)))
          {
              auxArray.push(this.state.dataCollection[i]);
          }
      }
      this.setState({ dataCollectionFiltered: auxArray });
    }

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleChangeSearch = async e => {
        await this.setState({
            [e.target.name]: e.target.value
        });
        this.filterData();
    }


    onAlert(modal) {
        this.setState({
          onAlert: modal
        });
      }


    /*Dibuja la pagina  */
    render() {

      let cartel = <div> </div>;
        let tabla = <ul className={"flex-items-row-start wrap"}>
            {this.state.dataCollectionFiltered.map((collection) => (
                <li className={"items-row"}>
                    <ul className={"flex-items-row-evenly"}>
                        <li className={"flex-item-list"}>
                            {collection.nombreColeccion}
                        </li>
                        <li className={"flex-item-list"}>
                            {collection.nombreGrupo}
                        </li>
                        <li className={"flex-item-list"}>
                            <Link key={collection.idColeccion} to={`/student/visualizecollections/${collection.idColeccion}`}>
                                <Button size={"sm"} variant={"primary"}> Ver colección </Button>
                            </Link>
                        </li>
                    </ul>
                    <hr />
                </li>
            ))}
        </ul>;

        if (this.state.dataCollectionFiltered.length === 0) {
            cartel = <div className={"row-edit"}>
                <br />
                <h4>No hay resultados para la búsqueda realizada.</h4>
            </div>;
            tabla = <></>;
        }


        const { dataGroup,  showListCollections } = this.state;
        return (
            <div className="container">
               <Card className="card-long">
                   <Card.Body>
                       <div className={"row-edit"}>
                           <div className={"section-title"}>
                               <h2>Colecciones</h2>
                           </div>
                       </div>

                        {showListCollections ? (
                            <div>
                                <div className={"row-edit"}>
                                    <ul className={"container-column-list"}>
                                        <li className={"items-row"}>
                                            <label className={"form-label"}>Buscar colección por su nombre o por grupo: </label>
                                        </li>
                                        <li className={"items-row"}>
                                            <input type="text" name="filtroBusqueda" onChange={this.handleChangeSearch} />
                                        </li>
                                        <li className={"items-row"}>
                                            <img src="../../search.png" alt="" />
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
                                <p>No hay colecciones para mostrar</p>
                            </div>
                        )}

                   </Card.Body>
               </Card>

            </div>
        );
    }
}

export default VisualizeCollections;