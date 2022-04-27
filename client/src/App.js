/*
*  Name_file :App.js
*  Description: redirije a routes.js
*/

import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import AuthService from './services/authenticity/auth-service.js';
import Login from './components/pages/login/Login.js';
import Register from './components/pages/login/register.js';
import Profile from './components/pages/login/profile.js';
import EditProfile from './components/pages/login/EditProfile.js';
import Messenger from './components/pages/student/Messenger.js';
import Message from './components/pages/student/Message.js';

/**Dashboard de los usuarios*/
import TeacherBoard from '../src/components/pages/teacher/TeacherBoard.js';
import StudentBoard from '../src/components/pages/student/StudentBoard.js';
import AdminBoard from '../src/components/pages/admin/AdminBoard';

/**Estilos exportados*/
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

/**Estilos CSS*/
import './styles/styleGeneral.css';
import './styles/styleNavBar.css';

/** Componentes de erores server*/
import NoMatch from "./components/pages/errors/404";
import InternalEror from "./components/pages/errors/500";

class App extends Component {

  constructor(props) {
    super(props);

    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
      showStudent: false,
      showTeacher: false,
      showAdmin: false,
      url: ""
    };
  }


  componentDidMount() {
    //Take info about server
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showStudent: user["rol"].includes("S"),
        showTeacher: user["rol"].includes("T"),
        showAdmin: user["rol"].includes("A"),
      });
    }

    if (this.state.showStudents) {
      this.setState({
        url: '/student/groups'
      });
    }
    else if (this.state.showAdmin) {
      this.setState({
        url: "/teacher/groups"
      });
    }
    else if (this.state.showTeacher) {
      this.setState({
        url: "/admin"
      });
    }
    else {
      this.setState({
        url: window.location.pathname
      });
    }
  }


  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showStudent, showTeacher, showAdmin } = this.state;
    return (
      <Router>
        {currentUser ? (
          <div className="full-wrapper">
            <header>
              <link rel="preconnect" href="https://fonts.gstatic.com"></link>
              <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Pontano+Sans&family=Dawning+of+a+New+Day&display=swap" rel="stylesheet"></link>
              <Navbar collapseOnSelect expand="lg" >
                <Navbar.Brand href={"/profile"}>
                  <img
                      src="/puntapluma.png"
                      width="45"
                      height="45"
                      alt="React Bootstrap logo"
                  />
                  Creativa
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                    {showAdmin && (
                      <Nav.Link bsPrefix="nav-link" href="/admin/groups">Tablero</Nav.Link>
                    )}
                    {showStudent && (
                      <Nav.Link bsPrefix="nav-link" href="/student/groups">Tablero</Nav.Link>
                    )}
                    {showTeacher && (
                      <Nav.Link bsPrefix="nav-link" href="/teacher/groups">Tablero</Nav.Link>
                    )}
                    <Nav.Link bsPrefix="nav-link" href="/profile"> {currentUser.username}</Nav.Link>

                    {showStudent && (
                      <Nav.Link bsPrefix="nav-link" href="/student/messenger"> Mensajeria</Nav.Link>
                    )}
                    <Nav.Link bsPrefix="nav-link" href="/login" onClick={this.logOut}>Cerrar sesión</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </header>
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/profile' component={Profile} />
              <Route path='/admin' component={AdminBoard} />
              <Route exact path='/editProfile' component={EditProfile} />
              <Route path='/teacher' component={TeacherBoard} />
              <Route exact path="/student/messenger" component={Messenger} />
              <Route exact path="/student/message/:idMessage" component={Message} />
              <Route path='/student' component={StudentBoard} />
              <Route exact path='/500' component={InternalEror} /> {/*Esta dirección sirve para el error 500 (interno del servidor).*/}
              <Route exact path='*' component={NoMatch} /> {/*Esta dirección sirve para el error 404.*/}
            </Switch>
          </div>
        ) : (
          <div className="main-wrapper">
            <header>
              <link rel="preconnect" href="https://fonts.gstatic.com"></link>
              <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Pontano+Sans&display=swap" rel="stylesheet"></link>
              <Navbar collapseOnSelect expand="lg" >
                <Navbar.Brand href={"/login"}>
                  <img
                      src="/puntapluma.png"
                      width="45"
                      height="45"
                      alt="React Bootstrap logo"
                  />
                  Creativa
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link href="/login">Iniciar</Nav.Link>
                    <Nav.Link href="/register">Registar</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </header>
            <Switch>
              <Route exact path={["/", "/login"]} component={Login} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/500' component={InternalEror} /> {/*Esta dirección sirve para el error 500 (interno del servidor).*/}
              <Route path='*' component={NoMatch} /> {/*Esta dirección sirve para el error 404.*/}
            </Switch>
          </div>
        )}
      </Router>
    );
  }
}

export default App;
