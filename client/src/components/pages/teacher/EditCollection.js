import React, { Component, useState } from 'react';
import TeacherService from '../../../services/teacher/teacherService.js';

//Componentes de Estilos
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import DropdownItem from 'react-bootstrap/DropdownItem';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import FormControl from 'react-bootstrap/FormControl';
import Challenges from './Challenges.js';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from 'react-bootstrap/Card';
import Icon from '@material-ui/core/Icon';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import Alert from "react-bootstrap/Alert";
import 'react-tabs/style/react-tabs.css';


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


class EditCollection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dataCollectionChallenge: [],
      dataChallenge: [],
      challengeSelect: "",
      nameChallengeSelect: "",
      itemSelect: "",
      onAddModal: '',
      onAlert: false,
    };
  }

  componentDidMount() {

    TeacherService.getChallenges( this.state.dataCollectionChallenge[0].idGroup).then(response => {
      this.setState({ dataCollectionChallenge: response });
      if (this.state.dataCollectionChallenge.length > 0) {
        this.setState({ challengeSelect: this.state.dataCollectionChallenge[0].idCollection, nameChallengeSelect: this.state.dataChallenge[0].titulo });
      }
    })
  }

  handleSelect(challenge) {
    this.setState({ challengeSelect: challenge.id, nameChallengeSelect: challenge.titulo });
  }

  /*Lo que escribamos en el input lo guarda en el state async para que lo veamos en tiempo real */
  handleAdd = async e => {
    await this.setState({
      [e.target.name]: e.target.value
    });
  }

  /*Cambia el estado del modal*/
  onModal(modal) {

    this.setState({
      onAddModal: modal
    });
  }

  onAlert(modal) {
    this.setState({
      onAlert: modal
    });
  }

  /*Se hacen peticiones al servidor renombrar grupo*/
  add = () => {
    if (this.state.newName != '') {
      TeacherService.addChallengeToCollection(this.state.idCollection, this.state.challengeSelect).then(response => {
       ///////////////...../////////
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

    const { dataChallenge, dataCollectionChallenge, challengeSelect } = this.state;

    return (
      <div className="container">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <Card className="card-long">
          <Card.Body>
            <div className={"row-edit"}>
              <div className={"section-title"}>
                <h2>Insertar desafío</h2>
              </div>
            </div>

            {<>
              
                <div className={"border-group"}>
                  <br />
                  <ul className={"flex-items-row-evenly"}>
                    <li className={"flex-item-form"}>
                      <Dropdown className="drop-down">
                        <DropdownToggle as={CustomToggle} id="dropdown-custom-components">Selecciona desafío</DropdownToggle>
                        <DropdownMenu as={CustomMenu}>
                          {dataCollectionChallenge.map((row) => (
                            <DropdownItem eventKey={row.idChallenge} onClick={() => this.handleSelect(row)}>{row.titulo}</DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </li>
                    <li className={"flex-item-form"}>
                      <h4  style={{color: "#717172"}}>{this.state.nameChallangeSelect}</h4>
                    </li>
                    <li className={"flex-item-form"}>
                      <Button variant="primary" onClick={() => this.onModal(true)}>Insertar</Button>
                    </li>
                  </ul>
                </div>

              </>
           }
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default EditCollection;