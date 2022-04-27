import React, { Component } from 'react';
import Card from "react-bootstrap/Card";

const NoMatch = () =>{
    return(
        <div className="container">
            <img className={"error"} src="/24.png" alt=""/>
             <h2>404 <h4>Vaya...¿Te has perdido?</h4></h2>
       </div>
    )
}

export default NoMatch;