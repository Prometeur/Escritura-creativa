//aqui va ir la conexion a mysql


const mysql = require('mysql');//defino el modulo que voy a usar

//requiero desde el archivo keys algunos parametros
//como no quiero traer todo el objeto keys, solo quiero
//traer el objeto database
const {database} = require('./keys');

// const http = require('http');
// function onRequest(request, response) {
//     console.log("Peticion Recibida.");
//     response.writeHead(200, {"Content-Type": "text/html"});
//     response.write("Hola Mundo");
//     response.end();
//   }
// var server = http.createServer(onRequest);
// server.listen(8080);

//para usar la conexion usamos createPool en vez createConnection, pq es mas cercano a un nivel de produccion
//createPool tiene varios hilos, cada uno va haciendo una tarea en secuencia
const pool=mysql.createPool(database);
// var conn = mysql.createConnection({host: "escrituracreativatfg.mariadb.database.azure.com", user: "sysadmin@escrituracreativatfg", password: {your_password}, database: {your_database}, port: 3306, ssl:{ca:fs.readFileSync({ca-cert filename})}});

//existe un modulo de nodejs, que permite convertir codigo callback a codigo de promesas
const {promisify}= require('util');



//utilizo la conexion creada
pool.getConnection((err,connection) =>{
    if(err){
        throw err;
    }
    else{
        console.log('conexion exitosa');
        connection.release();//empieza la conexion
    }
    
    // if(connection)
    //  connection.release();//empieza la conexion
    // console.log('DB is Connected');
return;

});


//al hacer la consulta de la bd, puedo usar 'promesas'
//la consulta lo puedo convertir a 'promesas'
pool.query = promisify(pool.query);

//quiero exportar la conexion,solo quiero exportar pool
module.exports = pool;