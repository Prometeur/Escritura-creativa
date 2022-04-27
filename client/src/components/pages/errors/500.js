import React, { Component } from 'react';
import Card from "react-bootstrap/Card";

const InternalError = () =>{
    return(
        <div className="container">
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <img className={"error"} src="/12.png" alt=""/>
            <h2>500 <h4>Ups!...algo ha ocurrido mal.</h4></h2>
      </div>
    )
}

export default InternalError;