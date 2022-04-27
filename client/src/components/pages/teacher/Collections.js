/*
*  Name_file: Collections.js
*  Description: Pagina de colecciones del estudiante, contiene la vista de todos los escritos 
*   que se han guardado en alguna colección.
*    
*/

/*Componentes de estilo Bootstrap*/
import React, { Component, useState } from 'react';
import { Link } from "react-router-dom";
import TeacherService from '../../../services/teacher/teacherService.js';
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


class Collections extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataGroup: [],
            idGroupSelect: 0,
            nameGroupSelect: '',
            nombreColeccion: "",
            onCreateCollectionModal: false,
            onAlert: false,
            dataCollection: [],
            filtroBusqueda: '',
            dataCollectionFiltered: [],
            showListCollections: false,
            onModalDelete: false,
            idColeccionBorrado: -1,
        }
    }

    componentDidMount() {

        /**Obtiene todos los grupos del profesor */
        TeacherService.getGroups(AuthUser.getCurrentUser().id).then(response => {
        this.setState({ dataGroup: response });
        if (this.state.dataGroup.length > 0) {
            this.setState({ idGroupSelect: this.state.dataGroup[0].id, nameGroupSelect: this.state.dataGroup[0].nombre, showListGroups: true });
        }
        })
        
        TeacherService.getCollections(AuthUser.getCurrentUser().id, this.state.filtroBusqueda)
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

    crearColeccion = () => {
        if (this.state.nombreColeccion != '') {
            TeacherService.createCollection(this.state.nombreColeccion, AuthUser.getCurrentUser().id, this.state.idGroupSelect)
            .then(response => {
                this.onModal(false);
                
            }).catch(error => {
            console.log(error.message);
            })

            let new_dataCollection = this.state.dataCollection;
            let last_pos = [];

            last_pos = [5, this.state.nombreColeccion, this.state.nameGroupSelect];
        // last_pos["idCollection"] = this.state.nombreColeccion;
        // last_pos["nombreColeccion"] = this.state.nombreColeccion;
        // last_pos["nombreGrupo"] = this.state.nombreColeccion;
        //new_dataCollection.splice(new_dataCollection.length, 0, last_pos);
        //new_dataCollection.push(this.state.nombreColeccion, 1, AuthUser.getCurrentUser().id, this.state.idGroupSelect);
        //    new_dataCollection.splice(this.state.dataCollection.length - 1, 0, last_pos);

        //   
        //     new_dataCollection.map((collection, i) => {
        //         if (new_dataCollection.length == 5)
        //         {
        //             new_dataCollection.splice(new_dataCollection.length, 0, last_pos);
        //         }
        //      });
        //    this.setState({ dataCollection: new_dataCollection });

            window.location.replace(`/teacher/collections`); 
        }
        else {
            this.onAlert(true)
        }
      }

    onModal(modal) {

        this.setState({
          onCreateCollectionModal: modal
        });
    }

    deleteCollection = () => 
    {
        this.onModalDeleteCollection(false, -1);
        TeacherService.deleteCollection(this.state.idColeccionBorrado)
        .then(response => {
            window.location.href = `/teacher/collections`;

        }).catch(error => {
            console.log(error.message);
        })
    }

    onModalDeleteCollection(modal, idCollection) {
        this.setState({
          onModalDelete: modal,
          idColeccionBorrado: idCollection
        });
    }

    handleSelect(group) {
        this.setState({ idGroupSelect: group.id, nameGroupSelect: group.nombre });
    }

    onAlert(modal) {
        this.setState({
          onAlert: modal
        });
      }

    /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
    handleCreateCollection = async e => {
        await this.setState({
        [e.target.name]: e.target.value
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
                            <Link key={collection.idColeccion} to={`/teacher/collections/${collection.idColeccion}`}>
                                <Button size={"sm"} variant={"primary"}> Ver colección </Button>
                            </Link>
                        </li>
                        <li className={"flex-item-list"}>
                            <Button size={"sm"} variant="danger" onClick={() => this.onModalDeleteCollection(true, collection.idColeccion)}>
                                Eliminar
                            </Button>
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

                        <div className={"border-group"}>
                            <br />
                            <ul className={"flex-items-row-evenly"}>
                                <li className={"flex-item-form"}>
                                <Dropdown className="drop-down">
                                    <DropdownToggle as={CustomToggle} id="dropdown-custom-components">Selecciona grupo</DropdownToggle>
                                    <DropdownMenu as={CustomMenu}>
                                    {dataGroup.map((row) => (
                                        <DropdownItem eventKey={row.idGrupo} onClick={() => this.handleSelect(row)}>{row.nombre}</DropdownItem>
                                    ))}
                                    </DropdownMenu>
                                </Dropdown>
                                </li>
                                <li className={"flex-item-form"}>
                                <h4  style={{color: "#717172"}}>{this.state.nameGroupSelect}</h4>
                                </li>
                                <li className={"flex-item-form"}>
                                <Button variant="primary" onClick={() => this.onModal(true)}>Crear colección</Button>
                                </li>
                            </ul>
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


               <Modal
                show={this.state.onCreateCollectionModal}
                onHide={this.state.onCreateCollectionModal}
                >
                <Modal.Header>
                    <Modal.Title>Crear colección</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>Nombre: </label>
                    <br />
                    <input type="text" className="form-control" name="nombreColeccion" onChange={this.handleCreateCollection} />
                    <Alert show={this.state.onAlert}>ERROR</Alert>
                    <br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.crearColeccion()}>Acepto</Button>
                    <Button variant="danger" onClick={() => this.onModal(false)}>Cancelar</Button>
                </Modal.Footer>
                </Modal>

                <Modal 
                    show={this.state.onModalDelete}
                    onHide={this.state.onModalDelete}
                >
                <Modal.Header>
                    <Modal.Title>¿Seguro que deseas eliminar la colección?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.deleteCollection()}>Aceptar</Button>
                    <Button variant="danger" onClick={() => this.onModalDeleteCollection(false, -1)}>Cancelar</Button>
                </Modal.Footer>
                </Modal>

            </div>
        );
    }
}

export default Collections;