/*
*  Name_file:
*  Description:
*/


import React, { Component, useState } from "react";
import StudentService from '../../../services/student/student-service.js';
import AuthUser from '../../../services/authenticity/auth-service.js';

//Paginas
import WritingTabs from './WritingTabs.js';
import TeamTabs from './TeamTabs.js';
import ChallengeTabs from './ChallengeTabs.js';

//Estilos
import '../../../styles/styleGeneral.css';

//Componentes de estilos
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import DropdownItem from 'react-bootstrap/DropdownItem';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Icon from '@material-ui/core/Icon';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import Button from 'react-bootstrap/Button';
import IconButton from '@material-ui/core/IconButton';
import Modal from 'react-bootstrap/Modal';


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
    { <Icon><ExpandMoreRoundedIcon></ExpandMoreRoundedIcon></Icon>}
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
          placeholder="Type to filter..."
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


class GroupStudent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataGroup: [],//contiene todos los grupos del estudiante
      currentUser: { id: "" }, // 0,
      groupSelect: "",
      nameGroupSelect: "",
      itemSelect: "",
      showChallenges: false,
      showWritings: false,
      showTeams: false,
      dataRemainingGroup: [],
      groupSelect2: -1,
      nameGroupSelect2: "",
      modalApply: false,
    };
  }

  componentDidMount() {

    const dataUser = AuthUser.getCurrentUser();
    this.setState({ currentUser: dataUser.id });

      /**Obtiene todos los grupos del estudiante */
      StudentService.getGroups(dataUser.id)
      .then(response => {
        if (response.length > 0) {
          this.setState({ dataGroup: response, groupSelect: response[0].idGrupo, nameGroupSelect: response[0].nombre, showChallenges: true });
        }
      })

      /* Se muestran los grupos donde no se encuentra el estudiante */
      StudentService.getRemainingGroups(dataUser.id)
      .then(response => {
        if (response.length > 0) {
          this.setState({dataRemainingGroup: response, groupSelect2: response[0].id, nameGroupSelect2: response[0].nombre });
        }
      })
      .catch(error => {
        console.log(error.message);
      })

  }


  // Envía la solicitud de unirse al grupo
   applyGroup = () => {
    this.onModalApply(false)
    StudentService.sendGroupRequest(this.state.groupSelect2, AuthUser.getCurrentUser().id)
    .then(response => {
        // Falta gestionar los archivos multimedia
            window.location.href = `/student/groups`;
    })
    .catch(error => {
        console.log(error.message);
    });
  }

  onModalApply = (modal) => {
    this.setState({
        modalApply: modal,
    });
  };


  itemSelection = event => {
    if (event.target.value === "1") {
      this.setState({
        showChallenges: true,
        showWritings: false,
        showTeams: false
      });
    }
    else if (event.target.value === "2") {
      this.setState({
        showChallenges: false,
        showWritings: true,
        showTeams: false
      });
    }
    else if (event.target.value === "3") {
      this.setState({
        showChallenges: false,
        showWritings: false,
        showTeams: true
      });
    }
  };

  handleSelect(group) {
    this.setState({ groupSelect: group.idGrupo, nameGroupSelect: group.nombre});
  }

  handleSelect2(group) {
    this.setState({ groupSelect2: group.id, nameGroupSelect2: group.nombre});
  }

  disabledButton = () => {
    if (this.state.dataGroup.length > 0) {
      return false;
    }
    return true;
  }

  render() {
    const { dataGroup, groupSelect, showChallenges, showWritings, showTeams, dataRemainingGroup, nameGroupSelectNR } = this.state;
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


            <div className={"border-group"}>
              <div className={"section-title"}>
                <h2>Entrar a nuevos grupos</h2>
              </div>
              <ul className={"flex-items-row-evenly"}>
                <li className={"flex-item-form"}>
                  <Dropdown className="drop-down" >
                    <DropdownToggle as={CustomToggle} id="dropdown-custom-components"> Selecciona grupo</DropdownToggle>
                    <DropdownMenu as={CustomMenu}>
                      {dataRemainingGroup.map((row) => (
                          <DropdownItem eventKey={row.id} onClick={() => this.handleSelect2(row)}>{row.nombre}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </li>
                <li className={"flex-item-form"}>
                    { <h4 style={{color: "#717172"}}>{this.state.nameGroupSelect2}</h4> }
                </li>
                <li className={"flex-item-form"}>
                  <div className="form-button">
                    <Button text='enviar' onClick={() => this.onModalApply(true)}> Solicitar entrar </Button>
                  </div>
                </li>
              </ul>
            </div>


            <div className={"border-group"}>
              <div className={"section-title"}>
                <h2>Mis grupos</h2>
              </div>
              <ul className={"flex-items-row-evenly"}>
                <li className={"flex-item-form"}>
                  <Dropdown className="drop-down" >
                    <DropdownToggle as={CustomToggle} id="dropdown-custom-components">Selecciona grupo</DropdownToggle>
                    <DropdownMenu as={CustomMenu}>
                      {dataGroup.map((row) => (
                          <DropdownItem eventKey={row.idGrupo} onClick={() => this.handleSelect(row)}>{row.nombre}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </li>
                <li className={"flex-item-form"}>
                    <h4 style={{color: "#717172"}}>{this.state.nameGroupSelect}</h4>
                </li>
                <li className={"flex-item-form"}>
                  <div className={"form-select"}>
                    <label className={"form-label"} htmlFor="">Seleccione un opción</label>
                    <select onChange={this.itemSelection} disabled={!this.state.groupSelect ? true : null} >
                      <option value="1" > Crear Escrito </option>
                      <option value="2" > Escritos </option>
                      <option value="3" > Equipos </option>
                    </select>
                  </div>
                </li>
              </ul>
            </div>
         
            
            {showChallenges ? (
              <>
                <ChallengeTabs key={groupSelect} groupSelect={groupSelect} />
              </>
            ) : (
              <></>
            )}

            {showWritings ? (
              <>
                <WritingTabs key={groupSelect} groupSelect={groupSelect} />
              </>
            ) : (
              <></>
            )}

            {showTeams ? (
              <>
                <TeamTabs key={groupSelect} groupSelect={groupSelect} />
              </>
            ) : (
              <></>
            )}

          </Card.Body>
        </Card>


        <Modal show={this.state.modalApply}>
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                    <p> ¿Deseas enviar petición?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => this.applyGroup()}>Aceptar</Button>
                        <Button variant="danger" onClick={() => this.onModalApply(false)}>Cancelar</Button>
                    </Modal.Footer>
          </Modal> 


      </div>
    );
  }
}

export default GroupStudent;