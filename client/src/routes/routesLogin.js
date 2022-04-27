/*
*  Name_file :routesLogin.js
*  Description: contiene rutas asociadas a componentes del login
*/
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from '../components/pages/login/Login';

/*defino las rutas de los componentes
Ruta o url del login asociado a la componente pages/login*/
function Routes() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    );
  }

export default Routes;