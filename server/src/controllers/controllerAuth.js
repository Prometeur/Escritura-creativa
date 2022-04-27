/*
* Name_file : ControllerAuth.justify
* Descripcion: Autenticación y autorizacion de datos para el acceso y registro de cuentas.
* parameters:
    @express
    @path
    @bodyParser
    @app
    @config
    @config_auth
    @model
    @model_user
    @jwt
    @bcrypt
*/
/*--------------------------------------------------*/
// Dependencies
"use strict"
const config = require("../db/config");
const config_auth = require("../db/auth.conf")
const model = require("../models/modelUser");
const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const pool = mysql.createPool(config.database);
const model_user = new model(pool);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*--------------------------------------------------*/
// Functionality systems

// Save user in the database after this has been verified.
function signUp(request, response) {

  model_user.create(request.body.username, request.body.surname,
    request.body.email, bcrypt.hashSync(request.body.password, 8),request.body.role , function (err, rel) {

      if (err) {
        response.status(500).send({ error: err.message });
      }
      else {
        response.status(200).send({ message: "¡Bienvenido/a, " + request.body.username +"!\n Por favor, recuerda que necesitas que un responsable de la aplicación acepte tu cuenta antes de que puedas iniciar sesión.\n ¡Nos vemos pronto!" });
      }
    });
}

// log in
function signIn(request, response) {

  let username = request.body.username;

  model_user.findOneEmail(username, function (err, rel) {
    if (err) {
      response.status(500).send({ message: "Internal server error" });
    }
    else {
      if (!rel) {
        response.status(404).send({ message: "User Not found." });
      }
      else {
        var passwordIsValid = bcrypt.compareSync(
          request.body.password,
          rel.password
        );

        if (!passwordIsValid) {
          return response.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }

        var token = jwt.sign({ id: rel.id }, config_auth.secret, {
          expiresIn: 60
        });

        response.status(200).send({
          id: rel.id,
          username: rel.nombre,
          surname: rel.apellidos,
          ruta: rel.ruta,
          email: rel.correo,
          activo: rel.activo,
          rol: rel.rol,
          foto: rel.foto,
          accessToken: token
        });
      }
    }
  });

}

function editProfile(request, response) {

  let id = request.body.id;
  let nombre = request.body.username;
  let apellidos = request.body.surname;
  let password = request.body.password;
  let correo = request.body.email;
  let foto = request.body.foto;

  if (request.body.password != '') {
    password = bcrypt.hashSync(request.body.password, 8);
  }

  model_user.editProfile(id, nombre, apellidos, correo, password, foto, function (err, rel) {

    if (err) {
      response.status(500).send({ message: "Internal server error" });
    }
    else {

      if (!rel) {
        response.status(404).send({ message: "User Not update." });
      }
      else {
        response.status(200).send({ message: "usuario actualizado!" });
      }

    }
  });
}

//Actualiza la foto de perfil del estudiante
function updatePhoto(req, res) {
  const idUser = req.body.idUser;
  var type;
  if (req.query.type == 3)
    type = "users";
  const dir = idUser + "/";
  //ruta de la foto de perfil
  let path = "http://" + req.headers.host + "/multimedia/" + type + "/" + dir + req.file.filename;//filename o originalname
  model_user.updatePhoto(idUser, path, function (err, result) {
    if (err) {
      console.log(err.message);
    }
    res.send(result);
  });
}

function disableProfile(request, response) {

  let idUser = request.body.idUser;

  model_user.disableProfile(idUser, function (err, rel) {
    if (err) {
      response.status(500).send({ message: "Internal server error" });
    }
    else {
      if (!rel) {
        response.status(404).send({ message: "User Not disable." });
      }
      else {
        response.status(200).send({ message: "user disable." });
      }

    }
  });
}

module.exports = {
  signUp: signUp,
  signIn: signIn,
  editProfile: editProfile,
  updatePhoto: updatePhoto,
  disableProfile: disableProfile,
}