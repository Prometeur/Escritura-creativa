/*
*  Name_file :Home.js
*  Description: Pagina inicial sin login, contiene la vista de un usuario no registrado
*    
*/

import React, { Component } from 'react';
import UserService from '../../../services/user/UserService';
import '../../../styles/styleGeneral.css';

class Home extends Component {

    constructor(props){
        super(props);

        this.state = {
            content: ""
          };
    }

    componentDidMount() {
        UserService.getPublicContent().then(
          response => {
            this.setState({
              content: response.data
            });
          },
          error => {
            this.setState({
              content:
                (error.response && error.response.data) ||
                error.message ||
                error.toString()
            });
          }
        );
    }


    /*Dibuja la pagina */
    render() 
    {
        return (

        
            <div className="container-home">
            </div>



        );
    }
}

export default Home;