/*
*  Name_file:
*  Description:
*/

import React,{ useState } from "react";

/** Componentes de estilos*/
import Tabs from "./Tabs";
import ChallengesStudent from "./ChallengesStudent";
import ChallengesTeam from "./ChallengesTeam";
import Card from "react-bootstrap/Card";
import Alert from 'react-bootstrap/Alert';

function ChallengeTabs(props) {

    const [count, setCount] = useState(0);
    const data = [
            { id: 1, name: "Desafios", content: () => <ChallengesStudent key={props.groupSelect} groupSelect={props.groupSelect}/>, state: "active" },
            { id: 2, name: "Desafios en Equipo", content: () => <ChallengesTeam key={props.groupSelect} groupSelect={props.groupSelect} />, state: "inactive" },
    ];
    return (
        <div className={"container"}>
            <Card className={"card-long"}>
                <Card.Body>
                    <Tabs data={data} />
                </Card.Body>
            </Card>
        </div>
    );
}

export default ChallengeTabs;