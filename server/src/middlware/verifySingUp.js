/*
* Name_file : ControllerAuth.justify
* Descripcion: Autenticación y autorizacion de datos para el acceso y registro de cuentas.
* parameters:

*/
/*--------------------------------------------------*/
// Dependencies
"use strict"
const config = require("../db/config");
const model = require("../models/modelUser");
const mysql = require("mysql");
const pool = mysql.createPool(config.database);
const model_user = new model(pool);
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

/*--------------------------------------------------*/
// Functionality system

//Check that an email is not duplicated in the database
function checkDuplicateUsernameOrEmail(request, response, next) {

  model_user.findOneEmail(request.body.email,function(err, rel) {
      if(err)
      {
        response.status(500);
      }
      else
      {
        if(rel)
          response.status(400).send({ message: "Failed! Email is already in use!" });
      }
      next();
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;
