import React from 'react';
import { BrowserRouter, Switch, Route, useRouteMatch } from 'react-router-dom';
import Groups from '../components/pages/user/GroupList';
import MyGroups from '../components/pages/user/MyGroups';
import Grupo from '../components/pages/user/Group';
import CrearGrupo from '../components/pages/teacher/CreateGroup';
import Sidebar from '../components/sidebar/Sidebar.js';
import CreateChallenge from '../components/pages/teacher/CreateChallenge.js';
import EditChallenge from '../components/pages/teacher/EditChallenge.js';

import Team from '../components/pages/teacher/ViewTeam';

import StudentList from '../components/pages/user/StudentLits.js';
import ApplicantList from '../components/pages/user/ApplicantList';
import LinksTeacher from '../links/links-Teacher.js';
import Profile from '../components/pages/user/Profile.js';

import EditWriting from '../components/pages/teacher/EditWriting.js';
import GroupTeacher from '../components/pages/teacher/GroupTeacher.js';


import Collections from '../components/pages/teacher/Collections';
import ViewCollection from '../components/pages/teacher/ViewCollection';
import ViewChallengeFromCollection from '../components/pages/teacher/ViewChallengeFromCollection';

/*defino las rutas de los componentes
Rutas o urls del Teacher asociado a la componente pages/teacher*/
function Routes() {
  let { url } = useRouteMatch();
  return (
    <>
      <BrowserRouter>
        <Sidebar links={LinksTeacher} url={url} />
        <Switch>
          <Route exact path="/teacher/groups" component={GroupTeacher} />
          <Route exact path="/teacher/createGroup" component={CrearGrupo} />
          <Route exact path="/teacher/viewGroup/:idGroup" component={Grupo} />
          <Route exact path="/teacher/viewTeam/:idTeam" component={Team} />
          <Route exact path="/teacher/createChallenge/:idGroup" component={CreateChallenge} />
          <Route exact path="/teacher/editChallenge/:idGroup/:idChallenge" component={EditChallenge} />
          <Route exact path="/teacher/students" component={StudentList} />
          <Route exact path="/teacher/applicants" component={ApplicantList} />
          <Route exact path="/teacher/students/viewProfile/:idStudent" component={Profile} />
          <Route exact path="/teacher/editWriting/:idGroup/:idChallenge/:idWriting/:idStudent" component={EditWriting} />


          <Route exact path="/teacher/collections" component={Collections} />
          <Route exact path="/teacher/collections/:idCollection" component={ViewCollection} />
          <Route exact path="/teacher/collections/:idCollection/:idChallenge" component={ViewChallengeFromCollection} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default Routes;