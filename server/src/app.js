/*
* Name_file : app.js
* Descripcion: Parte central del servidor. Responde a peticiones y emplea los middlewares necesarios para tratar la información.
*/

/*-------------------------------------------CONSTANTS------------------------------------------------------------------------- */
/*constantes usadas */
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');

const http = require("http");
const server = http.createServer(app);

/*-------------------------------------------SOCKET --------------------------------------------------------------------- */
const socketio = require("socket.io");
const io = socketio(server);



//Funcionalidad de socket.io en el servidor
io.on("connection", (socket) => {
  let nombre;
  
  //Se ejecuta en el Server cuando el Cliente emite "conectado"
  socket.on("conectado", (nomb) => {
    nombre = nomb;
    //Se ejecuta en el Cliente cuando el Server emite "mensajes"
    socket.broadcast.emit("mensajes", {
      // nombre: nombre,
      // mensaje: `${nombre} ha entrado en el desafio colaborativo`,
    });
  });

  //Se ejecuta en el Server cuando el Cliente emite "mensaje"
  socket.on("mensaje", (nombre, mensaje) => {
    //Se ejecuta en el Cliente cuando el Server emite "mensajes"
    io.emit("mensajes", { nombre, mensaje });
  });

  // socket.on("disconnect", () => {
  //   io.emit("mensajes", {
  //     server: "Servidor",
  //     mensaje: `${nombre} ha abandonado el desafio colaborativo`,
  //   });
  // });
});
// server.listen(3001, () => console.log("Servidor inicializado"));


/*-------------------------------------------SETTING SERVER--------------------------------------------------------------------- */
// //configuracion del servidor express
app.set('port', process.env.PORT || 3001);// defino el puerto

// //starting the server
// app.listen(app.get('port'),()=>{
//     console.log('Server on port', app.get('port'));
// });

server.listen(app.get('port'), () => console.log("Server on port", app.get('port')));

//Es necesario indicar las rutas de las imagenes
app.use(express.static(path.join(__dirname, '../public')));
/*-------------------------------------------MIDDLEWARE-------------------------------------------------------------------------- */

//middleware funciones app cliente envia peticion al servidor
//app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());




/*--------------------------------------------ROUTES----------------------------------------------------------------------------- */

//Routes  url del servidor
app.use('/admin', require('./routers/routerAdmin'));
app.use('/teacher', require('./routers/routerTeacher'));
app.use('/student', require('./routers/routerStudent'));
app.use('/auth', require('./routers/routerAuth'));
app.use('/user', require('./routers/routerUser'));
app.use(middlewareNotFoundError);
app.use(middlewareServerError);

/*--------------------------------------------------*/
// Functionality systems

/* Código 404: User error */
function middlewareNotFoundError(request, response) {

  response.status(404);
  /*
  response.render("404", {
          mensaje: "La pagina " + request.url + " no existe..."
  });
  */

}

/* Código 500: Internal server error */
function middlewareServerError(error, request, response, next) {

  response.status(500);
  console.log(error.message);
  console.log(error.stack);
  /*
  response.render("500", {
          mensaje: error.message,
          pila: error.stack
  });
  */
}






