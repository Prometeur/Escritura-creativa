/*
*  Name_file :routesAdmin.js
*  Description: contiene rutas asociadas a componentes del Admin
*/
import React from 'react';
import { BrowserRouter, Switch, Route, useRouteMatch } from 'react-router-dom';

import UserList from '../components/pages/user/UserList.js';
import Profile from '../components/pages/user/Profile.js';
import ApplicantList from '../components/pages/user/ApplicantList';
import Grupos from '../components/pages/user/GroupList';
import Grupo from '../components/pages/user/Group';
import Sidebar from '../components/sidebar/Sidebar.js';

import LinksAdmin from '../links/links-Admin';

/*defino las rutas de los componentes
Rutas o urls del Admin asociado a la componente pages/admin*/
function Routes() {
  let {url} = useRouteMatch();
    return (
      <BrowserRouter>
      <Sidebar links={LinksAdmin} url={url} />
        <Switch>
        <Route exact path="/admin/users" component={UserList} />
        <Route exact path="/admin/users/viewProfile/:idStudent" component={Profile} />
        <Route exact path="/admin/applicants" component={ApplicantList}/>
        <Route exact path="/admin/groups" component={Grupos}/>
        <Route exact path="/admin/viewGroup/:idGroup" component={Grupo}/>
        </Switch>
      </BrowserRouter>
    );
  }

export default Routes;