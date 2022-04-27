/*
*  Name_file :GroupTeacher.js
*  Description: Pagina del grupo seleccionado por profesor, contiene la vista de los desafios  
*  que tiene el grupo seleccionado por el profesor  
*/
import React, { Component, useState } from 'react';
import TeacherService from '../../../services/teacher/teacherService.js';
import AuthUser from '../../../services/authenticity/auth-service.js';

//Componentes de Estilos
import SplitButtom from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import DropdownItem from 'react-bootstrap/DropdownItem';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import FormControl from 'react-bootstrap/FormControl';
import Challenges from './Challenges.js';
import Writings from './Writings.js';
import Teams from './GroupTeams';
import Students from '../user/GroupStudents';
import { Link } from "react-router-dom";
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


const required = value => {
  if (!value) {
    return (
      <Alert variant="danger" bsPrefix="alert-login">
        ¡Todos los campos son obligatorios!
      </Alert>

    );
  }
};

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


class GroupTeacher extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataGroup: [],//contiene todos los grupos del estudiante
      currentUser: { id: "" },
      groupSelect: "",
      nameGroupSelect: "",
      itemSelect: "",
      showChallenges: false,
      showWritings: false,
      showTeams: false,
      showStudents: false,
      newName: "",
      onRenameGroupModal: '',
      onAlert: false,
      showListGroups: false,//muestra grupos
    };
  }

  componentDidMount() {

    const dataUser = AuthUser.getCurrentUser();
    this.setState({ currentUser: dataUser });

    /**Obtiene todos los grupos del profesor */
    TeacherService.getGroups(dataUser.id).then(response => {
      this.setState({ dataGroup: response });
      if (this.state.dataGroup.length > 0) {
        this.setState({ groupSelect: this.state.dataGroup[0].id, nameGroupSelect: this.state.dataGroup[0].nombre, showListGroups: true });
      }
    })
  }

  itemSelection = event => {
    if (event.target.value === "1") {
      this.setState({
        showChallenges: true,
        showWritings: false,
        showTeams: false,
        showStudents: false

      });
    }
    else if (event.target.value === "2") {
      this.setState({
        showChallenges: false,
        showWritings: true,
        showTeams: false,
        showStudents: false
      });
    }
    else if (event.target.value === "3") {
      this.setState({
        showChallenges: false,
        showWritings: false,
        showTeams: true,
        showStudents: false
      });
    }
    else if (event.target.value === "4") {
      this.setState({
        showChallenges: false,
        showWritings: false,
        showTeams: false,
        showStudents: true
      });
    }

  };

  // handleSelect(groupId) {
  //   this.setState({ groupSelect: groupId });
  // }

  handleSelect(group) {
    this.setState({ groupSelect: group.id, nameGroupSelect: group.nombre });
  }

  /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
  handleChangeRename = async e => {
    await this.setState({
      [e.target.name]: e.target.value
    });
  }

  /*Cambia el estado del modal*/
  onModal(modal) {

    this.setState({
      onRenameGroupModal: modal
    });
  }

  onAlert(modal) {
    this.setState({
      onAlert: modal
    });
  }

  /*Se hacen peticiones al servidor renombrar grupo*/
  rename = () => {
    if (this.state.newName != '') {
      AdminService.renameGroup(this.state.groupSelect, this.state.newName).then(response => {
        const dataUser = AuthUser.getCurrentUser();
        this.setState({ nameGroupSelect: this.state.newName });
        this.onModal(false);

      }).catch(error => {
        console.log(error.message);
      })
    }
    else {

      this.onAlert(true)
    }
  }

  /*Dibuja la pagina  */
  render() {

    const { dataGroup, groupSelect, showChallenges, showWritings, showTeams, showStudents } = this.state;

    // SISTEMA DE TABS

    let tabs =
      <div className={"row-edit"}>
        <Tabs>
          <TabList className={"react-tabs__tab-list"}>
            <Tab>DESAFIOS</Tab>
            <Tab>ESCRITOS</Tab>
            <Tab>EQUIPOS</Tab>
            <Tab>ESTUDIANTES</Tab>
          </TabList>
          <TabPanel>
            <Challenges key={groupSelect} groupSelect={groupSelect} />
          </TabPanel>
          <TabPanel>
            <Writings key={groupSelect} groupSelect={groupSelect} />
          </TabPanel>
          <TabPanel>
            <Teams key={groupSelect} groupSelect={groupSelect} />
          </TabPanel>
          <TabPanel>
            <Students key={groupSelect} idGroup={groupSelect} />
          </TabPanel>
        </Tabs>
      </div>;
    const { showListGroups } = this.state;
    return (
      <div className="container">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <Card className="card-long">
          <Card.Body>
            <div className={"row-edit"}>
              <div className={"section-title"}>
                <h2>Gestionar grupos</h2>
              </div>
            </div>

            {showListGroups ? (
              <>
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
                      <Button variant="primary" onClick={() => this.onModal(true)}>Renombar grupo</Button>
                    </li>
                  </ul>
                </div>


                {showChallenges ? (
                  <Challenges key={groupSelect} groupSelect={groupSelect} />
                ) : (
                  <></>
                )}

                {showWritings ? (
                  <Writings key={groupSelect} groupSelect={groupSelect} />
                ) : (
                  <></>
                )}
                {showTeams ? (
                  <Teams key={groupSelect} groupSelect={groupSelect} />
                ) : (
                  <></>
                )}
                {showStudents ? (
                  <Students key={groupSelect} idGroup={groupSelect} />
                ) : (
                  <></>
                )}
                {tabs}
              </>
            ) : (
              <div className="table-margin">
                <p>No hay grupos para mostrar</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <Modal
          show={this.state.onRenameGroupModal}
          onHide={this.state.onRenameGroupModal}
        >
          <Modal.Header>
            <Modal.Title>Renombrar grupo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Cambiar nombre: </label>
            <br />
            <input type="text" className="form-control" name="newName" onChange={this.handleChangeRename} />
            <Alert show={this.state.onAlert}>Hola</Alert>
            <br />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => this.rename()}>Acepto</Button>
            <Button variant="danger" onClick={() => this.onModal(false)}>Cancelar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default GroupTeacher;