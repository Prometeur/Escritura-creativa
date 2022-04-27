/*
*  Name_file :routesStudent.js
*  Description: contiene rutas asociadas a componentes del Student
*/

import React from 'react';
import { BrowserRouter, Switch, Route, useRouteMatch } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar.js';
import GroupStudent from '../components/pages/student/GroupStudent.js';
import Teams from '../components/pages/student/Teams.js';
import TeamStudent from '../components/pages/student/TeamStudent.js';
import WritingTabs from '../components/pages/student/WritingTabs.js';
import ChallengeTabs from '../components/pages/student/ChallengeTabs.js';
import CreateWriting from '../components/pages/student/CreateWriting.js';
import EditWriting from '../components/pages/student/EditWriting.js';
// import ViewMultimedia from '../components/pages/student/ViewMultimedia.js';
import ViewWriting from '../components/pages/student/ViewWriting.js';
import LinksStudent from '../links/links-Student.js';
import EditWritingTeam from '../components/pages/student/EditWritingTeam.js';
import VersionsfromWriting from '../components/pages/student/VersionsfromWriting.js';
import EditVersionfromWriting from '../components/pages/student/EditVersionfromWriting.js';
import VisualizeCollections from '../components/pages/student/VisualizeCollections.js';
import VisualizeSingleCollection from '../components/pages/student/VisualizeSingleCollection.js';
import VisualizeChallengeFromCollection from '../components/pages/student/VisualizeChallengeFromCollection.js';

// import Teams from '../components/pages/student/Teams.js';
// import Messenger from '../components/pages/student/Messenger.js';
// import Message from '../components/pages/student/Message.js';


/*defino las rutas de los componentes
Rutas o urls del Student asociado a la componente pages/student*/
function Routes() {
    let {url} = useRouteMatch();
    return (
        <BrowserRouter>
            <Sidebar  links={LinksStudent} url={url}/>
            <Switch>        
                <Route exact path="/student/groups" component={GroupStudent} />
                <Route exact path="/student/teams" component={Teams}/>
                <Route exact path="/student/writingsTabs" component={WritingTabs}/>
                <Route exact path="/student/ChallengesTabs" component={ChallengeTabs}/>
                <Route exact path="/student/teamStudent/:idGroup" component={TeamStudent}/>
                <Route exact path="/student/writing/:idGroup/:idChallenge" component={CreateWriting} />
                <Route exact path="/student/editWriting/:idGroup/:idChallenge/:idWriting" component={EditWriting} />
                <Route exact path="/student/viewWriting/:idGroup/:idChallenge/:idWriting" component={ViewWriting} />
                <Route exact path="/student/editWritingTeam/:idGroup/:idChallenge/:idWriting" component={EditWritingTeam} />
                <Route exact path="/student/versionsWriting/:idGroup/:idChallenge/:idWriting" component={VersionsfromWriting} />
                <Route exact path="/student/editVersionfromWriting/:idGroup/:idChallenge/:idWriting/:idVersion" component={EditVersionfromWriting} />
                <Route exact path="/student/visualizecollections" component={VisualizeCollections} />
                <Route exact path="/student/visualizecollections/:idCollection" component={VisualizeSingleCollection} />
                <Route exact path="/student/visualizecollections/:idCollection/:idChallenge" component={VisualizeChallengeFromCollection} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;