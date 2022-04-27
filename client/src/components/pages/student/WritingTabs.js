import React,{ useState } from "react";
import TabsWriting from "./Tabs";
import WritingsStudent from "./WritingsStudent";
import WritingsTeam from "./WritingsTeam";


/**Estilos Bootstrap*/
import Card from 'react-bootstrap/Card';

/** Estilo CSS*/
import '../../../styles/styleGeneral.css';
import '../../../styles/styleCard.css';

function WritingTabs(props) {
    const [count, setCount] = useState(0);
    const data = [
            { id: 1, name: "Escritos", content: () => <WritingsStudent key={props.groupSelect} groupSelect={props.groupSelect}/>, state: "active" },
            { id: 2, name: "Escritos en equipo", content: () => <WritingsTeam key={props.groupSelect} groupSelect={props.groupSelect} />, state: "inactive" },
    ];

    return (
        <div className="container">
            <Card className={"card-long"}>
                <Card.Body>
                    <TabsWriting data={data} />
                </Card.Body>
            </Card>
        </div>
    );
}

export default WritingTabs;