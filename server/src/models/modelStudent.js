// Functionality systems
class modelStudent {

    constructor(pool) {
        this.pool = pool;
    }

    //-----------------------------------------------------GROUPS----------------------------------------------------------------//
    
    /*Obtiene los grupos del estudiante*/
    getGroups(student, callback) {
        const sqlSelect = "SELECT grupoestudiante.idGrupo, grupoestudiante.idEstudiante, grupo.id as idGrupo, grupo.nombre, grupo.idProfesor FROM grupoestudiante INNER JOIN grupo ON grupoestudiante.idGrupo = grupo.id WHERE grupoestudiante.idEstudiante=? AND grupoestudiante.activo=?;";
        this.pool.query(sqlSelect, [student, 1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Te muestra los grupos donde no se encuentre el estudiante*/
    getRemainingGroups(idStudent, callback) {
        const sqlSelect = "SELECT grupo.nombre, grupo.id FROM grupo WHERE grupo.id NOT IN (SELECT grupoestudiante.idGrupo FROM grupoestudiante WHERE grupoestudiante.idEstudiante = ?);";
        this.pool.query(sqlSelect, idStudent, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /* Mandar a un profesor una petición de unión a un grupo */
    sendGroupRequest(idGroup, idStudent, callback) {
        const sqlInsert = "INSERT INTO grupoestudiante (idGrupo, idEstudiante, activo) VALUES (?, ?, ?);";
        this.pool.query(sqlInsert, [idGroup, idStudent, 0], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    //-----------------------------------------------------CHALLENGES----------------------------------------------------------------//

    /*Obtiene el desafio del estudiante segun su grupo*/
    getChallenge(idChallenge, callback) {
        // const sqlSelect = "SELECT * FROM desafio where id= ?";
        const sqlSelect = "SELECT categoria.nombre,desafio.id,desafio.idGrupo,desafio.titulo,desafio.descripcion,desafio.tipoCalificacion,desafio.idCategoria,desafio.colaborativo,desafio.fechaIni,desafio.fechaFin, desafio.activo FROM desafio INNER JOIN categoria ON desafio.idCategoria = categoria.id WHERE desafio.id= ? ";
        this.pool.query(sqlSelect, idChallenge, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene los desafios del estudiante segun su grupo*/
    getChallenges(idGroup, type, callback) {
        const sqlSelect = "SELECT g.nombre as nombreGrupo,c.nombre as nombreCategoria,d.id,d.idGrupo,d.titulo,d.descripcion,d.tipoCalificacion, d.idCategoria,d.colaborativo,d.fechaIni,d.fechaFin, d.activo FROM desafio as d INNER JOIN grupo as g ON d.idGrupo=g.id INNER JOIN categoria as c ON d.idCategoria = c.id WHERE d.idGrupo = ? AND d.colaborativo =? AND d.activo=?";
        this.pool.query(sqlSelect, [idGroup, type, 1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene los desafios del estudiante segun su grupo*/
    getChallengesIndividual(idStudent, type, callback) {
        // const sqlSelect = "SELECT desafio.id,desafio.idGrupo,desafio.titulo,desafio.descripcion,desafio.tipoCalificacion,categoria.nombre,desafio.colaborativo,desafio.fechaIni,desafio.fechaFin, desafio.activo FROM desafio INNER JOIN categoria ON desafio.idCategoria = categoria.id WHERE desafio.idGrupo = ? ";
        const sqlSelect = "SELECT c.nombre as nombreCategoria, g.nombre as nombreGrupo, d.id,d.idGrupo,d.titulo,d.descripcion,d.tipoCalificacion, d.idCategoria ,d.colaborativo,d.fechaIni,d.fechaFin, d.activo FROM desafio as d  INNER JOIN grupo as g ON g.id=d.idGrupo INNER JOIN grupoestudiante as gs ON gs.idGrupo = g.id INNER JOIN categoria as c ON d.idCategoria = c.id WHERE gs.idEstudiante = ? AND d.colaborativo=? AND d.activo = ? ";
        this.pool.query(sqlSelect, [idStudent, type, 1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    //---------------------------------------------MULTIMEDIA-CHALLENGES----------------------------------------------------------------//

    /*Obtiene los ficheros multimedia del desafio*/
    getMultimediaChallenge(idChallenge, callback) {
        const sqlSelect = "SELECT * FROM multimediadesafio where  idDesafio=?";
        this.pool.query(sqlSelect, idChallenge, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    //-----------------------------------------------WRITING----------------------------------------------------------------//

    /*Obtiene todos los escritos activos del estudiante*/
    getWritings(idStudent, callback) {
        const sqlSelect = "SELECT g.nombre as nombreGrupo,u.nombre ,u.apellidos, c.titulo as nombreDesafio, c.fechaFin ,w.id,w.idGrupo,w.idDesafio,w.idEscritor,w.nombre as nombreEscrito,w.puntuacion,w.comentario,w.colaborativo,w.finalizado,w.fecha,w.activo FROM escrito as w INNER JOIN usuario as u ON w.idEscritor= u.id INNER JOIN desafio as c ON w.idDesafio= c.id INNER JOIN grupo as g ON w.idGrupo=g.id where w.idEscritor= ? AND w.activo=? AND c.activo=?;";
        // const sqlSelect = "SELECT * FROM escrito where idEscritor= ? AND activo=?;";
        this.pool.query(sqlSelect, [idStudent, 1, 1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene todos los escritos colaborativos activos del equipo del estudiante*/
    getWritingsCollaborative(idStudent, callback) {
        //const sqlSelect = "SELECT u.nombre ,u.apellidos, c.titulo as nombreDesafio, w.id,w.idGrupo,w.idDesafio,w.idEscritor,w.puntuacion,w.comentario,w.colaborativo,w.finalizado,w.fecha,w.activo FROM escrito as w INNER JOIN usuario as u ON w.idEscritor= u.id INNER JOIN desafio as c ON w.idDesafio= c.id where w.idEscritor= ? AND w.activo=?;";
        //const sqlSelect = "SELECT t.nombre as nombreEquipo, c.titulo as nombreDesafio, w.id,w.idGrupo,w.idDesafio,w.idEscritor,w.puntuacion,w.comentario,w.colaborativo,w.finalizado,w.fecha,w.activo FROM escrito as w INNER JOIN equipo as t ON w.idEscritor= t.id INNER JOIN desafio as c ON w.idDesafio= c.id where w.idEscritor= ? AND w.activo=? AND w.colaborativo=?;";
        const sqlSelect = "SELECT g.nombre as nombreGrupo, t.nombre as nombreEquipo, c.titulo as nombreDesafio, c.fechaFin,w.id,w.idGrupo,w.idDesafio,w.idEscritor,w.nombre as nombreEscrito,w.puntuacion,w.comentario,w.colaborativo,w.finalizado,w.fecha,w.activo  FROM escrito as w INNER JOIN equipoestudiante as ts ON w.idEscritor= ts.idEquipo INNER JOIN equipo as t ON ts.idEquipo = t.id INNER JOIN desafio as c ON w.idDesafio= c.id  INNER JOIN grupo as g ON  w.idGrupo=g.id where ts.idEstudiante= ? AND w.activo=? AND w.colaborativo=?;";
        this.pool.query(sqlSelect, [idStudent, 1, 2], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene el escrito del estudiante */
    getWriting(idWriting, callback) {
        const sqlSelect = "SELECT * FROM escrito WHERE id=?;";
        
        this.pool.query(sqlSelect, [idWriting], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene todas las versiones de un mismo escrito de un estudiante */
    getVersionsfromWriting(idWriting, callback) {
        const sqlSelect = "SELECT vw.idVersion, vw.texto, u.nombre ,u.apellidos, c.titulo as nombreDesafio, c.fechaFin, vw.idEscrito, vw.idDesafio, vw.idEscritor, vw.nombre as nombreEscrito, vw.colaborativo, vw.fecha, vw.activo, w.idGrupo FROM versionescrito as vw INNER JOIN escrito as w ON w.id = vw.idEscrito INNER JOIN usuario as u ON vw.idEscritor= u.id INNER JOIN desafio as c ON vw.idDesafio= c.id where vw.idEscrito=? ORDER BY vw.idVersion;";

        this.pool.query(sqlSelect, idWriting, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /* Devuelve la última versión de un escrito, es decir, el mayor id */
    getHighestidVersionfromWriting(idWriting, callback) {
        const sqlSelect = "SELECT MAX(idVersion) as maxId from versionescrito where idEscrito=?;";
        
        this.pool.query(sqlSelect, idWriting, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }


    /*Obtiene el escrito del estudiante segun su grupo*/
    getWritingWriter(idGroup, idChallenge, idWriter, callback) {
        const sqlSelect = "SELECT * FROM escrito where idGrupo= ? AND idDesafio=? AND idEscritor=?;";
        this.pool.query(sqlSelect, [idGroup, idChallenge, idWriter], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

        

    /*Obtiene los escritos del estudiante*/
    getWritingsStudent(idStudent, idGroup, callback) {
        const sqlSelect = "SELECT g.nombre as nombreGrupo,u.nombre ,u.apellidos, c.titulo as nombreDesafio, c.fechaFin,w.id,w.idGrupo,w.idDesafio,w.idEscritor,w.nombre as nombreEscrito,w.puntuacion,w.comentario,w.colaborativo,w.finalizado,w.fecha,w.activo FROM escrito as w INNER JOIN usuario as u ON w.idEscritor= u.id INNER JOIN desafio as c ON w.idDesafio= c.id INNER JOIN grupo as g ON  w.idGrupo=g.id where w.idEscritor= ? AND w.idGrupo=?;";
        this.pool.query(sqlSelect, [idStudent, idGroup], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

      /*Obtiene todos los escritos individuales dado un grupo y un desafio segun su grupo*/
      getWritingsStudentCollection(idGroup, idChallenge, callback) {
        const sqlSelect = "SELECT c.id as idDesafio, c.titulo as nombreDesafio, u.id as idEstudiante, u.nombre as nombreEstudiante, u.apellidos as apellidosEstudiante, w.id as idEscrito, w.idGrupo, w.idEscritor, w.nombre as nombreEscrito,w.texto ,w.puntuacion,w.comentario,w.colaborativo,w.finalizado,w.fecha,w.activo FROM escrito as w INNER JOIN desafio as c ON w.idDesafio = c.id INNER JOIN usuario as u ON w.idEscritor=u.id where w.idGrupo= ? AND w.idDesafio=? ;";

        this.pool.query(sqlSelect, [idGroup, idChallenge], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene los escritos del equipo*/
    getWritingsTeam(idTeam, idGroup, callback) {
        const sqlSelect = "SELECT g.nombre as nombreGrupo,t.nombre as nombreEquipo, c.titulo as nombreDesafio,c.fechaFin, w.id,w.idGrupo,w.idDesafio,w.idEscritor,w.nombre as nombreEscrito,w.puntuacion,w.comentario,w.colaborativo,w.finalizado,w.fecha,w.activo FROM escrito as w INNER JOIN equipo as t ON w.idEscritor= t.id INNER JOIN desafio as c ON w.idDesafio= c.id INNER JOIN grupo as g ON  w.idGrupo=g.id where w.idEscritor= ? AND w.idGrupo=?;";
        this.pool.query(sqlSelect, [idTeam, idGroup], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene todos los escritos colaborativos dado un grupo y un desafio segun su grupo*/
    getWritingsTeamCollection(idGroup, idChallenge, callback) {
        const sqlSelect = "SELECT c.id as idDesafio, c.titulo as nombreDesafio, t.id as idEquipo, t.nombre as nombreEquipo, w.id as idEscrito, w.idGrupo, w.idEscritor, w.nombre as nombreEscrito,w.texto ,w.puntuacion,w.comentario,w.colaborativo,w.finalizado,w.fecha,w.activo FROM escrito as w INNER JOIN desafio as c ON w.idDesafio = c.id INNER JOIN equipo as t ON w.idEscritor=t.id where w.idGrupo= ? AND w.idDesafio=? ;";

        this.pool.query(sqlSelect, [idGroup, idChallenge], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /* Obtiene todas las versiones de un escrito colaborativo */
    getVersionsfromWritingTeam(idWriting, callback)
    {
        //console.log("AQUI");
        const sqlSelect = "SELECT t.nombre as nombreEquipo, c.titulo as nombreDesafio, w.idGrupo, w.idDesafio, w.colaborativo, vw.idEscrito, vw.nombre as nombreEscrito, vw.idVersion, vw.fecha, vw.texto FROM escrito as w INNER JOIN versionescrito as vw ON w.id = vw.idEscrito INNER JOIN equipo as t ON w.idEscritor= t.id INNER JOIN desafio as c ON w.idDesafio= c.id where vw.idEscrito = ? ORDER BY vw.idVersion;";
        this.pool.query(sqlSelect, [idWriting], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Envio el escrito del estudiante */
    createWriting(idGroup, desafio, idWriter, title, texto, type, callback) {
        const sqlInsert = "INSERT INTO escrito (idGrupo,idDesafio,idEscritor,nombre,texto,colaborativo,activo) VALUES (?,?,?,?,?,?,?)";
        this.pool.query(sqlInsert, [idGroup, desafio, idWriter, title, texto, type, 1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Edito el escrito del estudiante */
    editWriting(idWriting, idGroup, idChallenge, idWriter, title, text, type, callback) {
        const sqlInsert = "UPDATE escrito SET idGrupo = ?,idDesafio = ?, idEscritor = ?, nombre=?,texto = ?, colaborativo = ? WHERE id=?";
        this.pool.query(sqlInsert, [idGroup, idChallenge, idWriter, title, text, type, idWriting], (err, result) => {
            if (err) {
                console.log("Error");
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Añado una nueva versión de un escrito */
    insertVersionfromWriting(idWriting, idVersion, idChallenge, idWriter, title, text, type, callback)
    {
        const sqlInsert = "INSERT INTO versionescrito (idEscrito, idVersion, idDesafio, idEscritor, nombre, texto, colaborativo) VALUES (?,?,?,?,?,?,?)";
        this.pool.query(sqlInsert, [idWriting, idVersion, idChallenge, idWriter, title, text, type, callback], (err, result) => {
            if (err) {
                console.log("Error");
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /* Obtiene el último escrito, es decir, el máximo id de escrito */
    getHighestidWriting(callback) {
        const sqlSelect = "SELECT MAX(id) as maxIdWriting from escrito;";
        
        this.pool.query(sqlSelect, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Edito el escrito del equipo del estudiante */
    editWritingTeam(idWriting, idGroup, idChallenge, idWriter, title, text, log, type, callback) {
        const sqlInsert = "UPDATE escrito SET idGrupo = ?,idDesafio = ?, idEscritor = ?, nombre=?,texto = ?, registro=?,colaborativo = ? WHERE id=?";
        this.pool.query(sqlInsert, [idGroup, idChallenge, idWriter, title, text, log, type, idWriting], (err, result) => {
            if (err) {
                console.log("Error");
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }
    

    //---------------------------------------------MULTIMEDIA-WRITING----------------------------------------------------------------//

    /*Obtiene los ficheros multimedia del escrito del estudiante*/
    getMultimedia(idChallenge, idWriter/*, idVersion*/, callback) {
        const sqlSelect = "SELECT * FROM multimediaescrito where idEscritor= ? AND idDesafio=?";
        //  AND idVersionEscrito=?;";

        this.pool.query(sqlSelect, [idWriter, idChallenge/*, idVersion*/], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                console.log("RESULT: " + result);
                callback(null, result);
            }
        });
    }

    // getMultimediaVersion()
    // {
    //     for (let i = 0; i < 1; ++i)
    //     {

    //     }
    // }

    /*Envia los ficheros multimedia del escrito del estudiante*/
    sendMultimedia(reqFiles, callback) {
        const sqlInsert = "INSERT INTO multimediaescrito (idEscritor,idDesafio , ruta) VALUES ?";
        // , idVersionEscrito
        
        this.pool.query(sqlInsert, [reqFiles], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Elimina el fichero multimedia del escrito*/
    deleteFile(idMultimedia, callback) {
        const sqlDelete = "DELETE FROM multimediaescrito WHERE id=?";
        this.pool.query(sqlDelete, idMultimedia, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    //-------------------------------------------------TEAMS------------------------------------------------------------------//

    /*Crea un equipo*/
    createTeam(idCreator, idGroup, teamName, callback) {
        const sqlInsert = "INSERT INTO equipo (nombre,idCreador,idGrupo,activo) VALUES (?,?,?,?)";
        this.pool.query(sqlInsert, [teamName, idCreator, idGroup, 1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene todos los equipos del estudiante*/
    getTeams(idStudent, callback) {
        // const sqlSelect = "SELECT * FROM equipoestudiante INNER JOIN equipo ON equipoestudiante.idEquipo = equipo.id INNER JOIN grupo ON equipo.idGrupo = grupo.id where idEstudiante= ?";

        const sqlSelect = "SELECT ts.idEquipo as idEquipo,t.nombre as nombreEquipo ,t.idCreador, t.activo,g.nombre as nombreGrupo, g.id as idGrupo FROM equipoestudiante AS ts INNER JOIN equipo AS t ON ts.idEquipo = t.id INNER JOIN grupo AS g ON t.idGrupo = g.id where ts.idEstudiante= ? AND t.activo=?";
        this.pool.query(sqlSelect, [idStudent,1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene el equipo del remitente*/
    getTeam(idTeam, callback) {
        const sqlSelect = "SELECT * FROM equipo WHERE id = ? AND activo=?";
        this.pool.query(sqlSelect, [idTeam,1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene los equipos del grupo*/
    getTeamsGroup(idGroup, callback) {
        const sqlSelect = "SELECT t.id as idEquipo, t.nombre as nombreEquipo, t.idCreador as idCreador, t.idGrupo as idGrupo,t.activo,g.idprofesor as idProfesor ,g.nombre as nombreGrupo FROM equipo as t INNER JOIN grupo as g ON t.idGrupo=g.id  WHERE t.idGrupo = ? AND t.activo=?";
        this.pool.query(sqlSelect, [idGroup,1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene equipo del estudiante correspondiente a un grupo en concreto*/
    getTeamStudentGroup(idStudent, idGroup, callback) {
        // const sqlSelect = "SELECT t.id as idEquipo, t.nombre as nombreEquipo, t.idCreador as idCreador, t.idGrupo as idGrupo,g.idprofesor as idProfesor ,g.nombre as nombreGrupo FROM equipo as t INNER JOIN grupo as g ON t.idGrupo=g.id  WHERE t.idGrupo = ?";
        const sqlSelect = "SELECT t.id as idEquipo,t.nombre as nombreEquipo, t.idCreador as idCreador, t.activo,ts.idEstudiante as idEstudiante, g.id as idGrupo, g.nombre as nombreGrupo  FROM equipoestudiante as ts INNER JOIN equipo as t ON ts.idEquipo= t.id INNER JOIN grupo as g ON t.idGrupo=g.id WHERE ts.idEstudiante=? AND t.idGrupo=? AND t.activo=?";
        this.pool.query(sqlSelect, [idStudent, idGroup,1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtengo la tabla entera de equipoestudiante*/
    getTeamStudent(callback) {
        const sqlSelect = "SELECT ts.id as id, ts.idEquipo as idEquipo, ts.idEstudiante as idEstudiante, u.nombre as nombre,u.apellidos, u.correo as correo FROM equipoestudiante as ts INNER JOIN usuario as u ON ts.idEstudiante=u.id";
        this.pool.query(sqlSelect, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    //Obtiene estudiantes sin equipos del grupo
    getStudentWithoutTeam(idGroup, callback) {
        // var rol="S";
        // const sqlSelect = "SELECT desafio.id,desafio.idGrupo,desafio.titulo,desafio.descripcion,desafio.tipoCalificacion,categoria.nombre,desafio.colaborativo,desafio.fechaIni,desafio.fechaFin, desafio.activo FROM desafio INNER JOIN categoria ON desafio.idCategoria = categoria.id WHERE desafio.idGrupo = ? ";
        //  const sqlSelect = "SELECT * from equipoestudiante as ts INNER JOIN usuario as u ON ts.idEstudiante <> u.id AND u.rol = ?   ";
        const sqlSelect = "SELECT u.id, u.nombre,u.apellidos  from usuario as u INNER JOIN grupoestudiante as gs ON u.id=gs.idEstudiante WHERE gs.idGrupo = ?  AND NOT EXISTS (SELECT * FROM equipoestudiante as ts INNER JOIN equipo as t ON ts.idEquipo = t.id WHERE ts.idEStudiante = u.id AND t.idGrupo = ?)";
        // this.pool.query(sqlSelect, [rol,idGroup], (err, result) => {
        this.pool.query(sqlSelect, [idGroup, idGroup], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene los integrantes de un equipo */
    getMembersTeam(idTeam, callback) {
        // const sqlSelect = "SELECT desafio.id,desafio.idGrupo,desafio.titulo,desafio.descripcion,desafio.tipoCalificacion,categoria.nombre,desafio.colaborativo,desafio.fechaIni,desafio.fechaFin, desafio.activo FROM desafio INNER JOIN categoria ON desafio.idCategoria = categoria.id WHERE desafio.idGrupo = ? ";
        // const sqlSelect = "SELECT * from equipoestudiante as ts INNER JOIN usuario as u ON ts.idEstudiante <> u.id AND u.rol = ?  INNER JOIN grupoestudiante as gs ON gs.idEstudiante = u.id WHERE gs.idGrupo=? ";
        const sqlSelect = "SELECT ts.idEquipo, ts.idEstudiante ,u.nombre as nombreEstudiante, u.apellidos as apellidoEstudiante ,u.ruta  from equipoestudiante as ts INNER JOIN usuario as u ON ts.idEstudiante = u.id WHERE ts.idEquipo =?   ";
        // this.pool.query(sqlSelect, [rol,idGroup], (err, result) => {
        this.pool.query(sqlSelect, idTeam, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Edita un equipo*/
    editTeam(idTeam, name, idCreator, idGroup, callback) {
        const sqlUpdate = "UPDATE equipo SET nombre = ?,idCreador=?,idGrupo=?,activo=? WHERE id=? ";
        this.pool.query(sqlUpdate, [name, idCreator, idGroup,1,idTeam], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Elimina/Desactiva un equipo*/
    deleteTeam(idTeam, callback) {
        const sqlDelete = "DELETE FROM equipo WHERE id=?  ";
        //const sqlUpdate = "UPDATE equipo SET activo = 0 WHERE id=? ";
        this.pool.query(sqlDelete, idTeam, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Agrega un estudiante a un equipo en la tabla equipoestudiante*/
    addStudentTeam(idTeam, idStudent, callback) {
        const sqlInsert = "INSERT INTO equipoestudiante (idEquipo,idEstudiante) VALUES (?,?)";
        this.pool.query(sqlInsert, [idTeam, idStudent], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Se une a un equipo el estudiante*/
    joinTeam(idTeam, idStudent, callback) {
        //const sqlInsert = "INSERT INTO escrito (idGrupo,idDesafio,idEscritor,texto,colaborativo,activo) VALUES (?,?,?,?,?,?)";
        const sqlInsert = "INSERT INTO equipoestudiante (idEquipo,idEstudiante) VALUES (?,?) ";
        this.pool.query(sqlInsert, [idTeam, idStudent], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Elimina un estudiante de un equipo*/
    leaveStudentTeam(idTeam, idStudent, callback) {
        const sqlDelete = "DELETE FROM equipoestudiante WHERE idEquipo=? and idEstudiante=? ";
        this.pool.query(sqlDelete, [idTeam, idStudent], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    //----------------------------------------------MESSAGE----------------------------------------------------------------//

    /*Obtiene los mensajes del estudiante*/
    getMessages(idStudent, callback) {
        // const sqlSelect = "SELECT * FROM equipoestudiante INNER JOIN equipo ON equipoestudiante.idEquipo = equipo.id INNER JOIN grupo ON equipo.idGrupo = grupo.id where idEstudiante= ?";
        const sqlSelect = "SELECT g.nombre as nombreGrupo,m.id,u.nombre as nombreEmisor, u.correo ,m.mensaje, m.fecha FROM mensajeria AS m INNER JOIN usuario AS u ON  m.idEmisor = u.id INNER JOIN grupo as g ON g.id=m.idGrupo WHERE m.idReceptor = ? AND m.activo=1";
        this.pool.query(sqlSelect, idStudent, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Obtiene un mensaje del estudiante*/
    getMessage(idMessage, callback) {
        // const sqlSelect = "SELECT m.id as id, m.idEmisor as idEmisor, m.mensaje as mensaje, u.nombre as nombreEmisor FROM mensajeria AS m INNER JOIN usuario AS u ON m.idEmisor = u.id WHERE m.id = ? ";
        const sqlSelect = "SELECT * FROM mensajeria WHERE id = ? ";
        this.pool.query(sqlSelect, idMessage, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    
    /*busca mensaje del estudiante por emisor*/
    searchMessageByIssuer(idGroup,idIssuer,idCreatorTeam, callback) {
        // const sqlSelect = "SELECT m.id as id, m.idEmisor as idEmisor, m.mensaje as mensaje, u.nombre as nombreEmisor FROM mensajeria AS m INNER JOIN usuario AS u ON m.idEmisor = u.id WHERE m.id = ? ";
        const sqlSelect = "SELECT * FROM mensajeria WHERE idGrupo = ? AND idEmisor=? AND idCreador=? AND activo=1";
        this.pool.query(sqlSelect, [idGroup,idIssuer,idCreatorTeam], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*busca mensaje del estudiante por receptor*/
    searchMessageByReceiver(idGroup,idReceiver,idCreatorTeam, callback) {
        // const sqlSelect = "SELECT m.id as id, m.idEmisor as idEmisor, m.mensaje as mensaje, u.nombre as nombreEmisor FROM mensajeria AS m INNER JOIN usuario AS u ON m.idEmisor = u.id WHERE m.id = ? ";
        const sqlSelect = "SELECT * FROM mensajeria WHERE idGrupo = ? AND idReceptor=? AND idCreador=? AND activo=1";
        this.pool.query(sqlSelect, [idGroup,idReceiver,idCreatorTeam], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*cambia el tipo de mensaje*/
    editMessage(idMessage, callback) {
        //   const sqlInsert = "UPDATE escrito SET idGrupo = ?,idDesafio = ?, idEscritor = ?, texto = ?, colaborativo = ? WHERE id=?";

        const sqlUpdate = "UPDATE mensajeria SET tipo = 0 WHERE id=? ";
        this.pool.query(sqlUpdate, idMessage, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /* "Elimina" (pone activo = 0) el fichero multimedia del desafio*/
    deleteMessage(idMessage, callback) {
        const sqlDelete = "UPDATE mensajeria SET activo = 0 WHERE id=?";
        this.pool.query(sqlDelete, idMessage, (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    /*Envia mensaje de un usuario*/
    sendMessage(idGroup,idSender, idReceiver, idCreator, message, type, callback) {
        const sqlInsert = "INSERT INTO mensajeria (idGrupo,idEmisor,idReceptor, idCreador,mensaje,tipo,activo) VALUES (?,?,?,?,?,?,?)";
        this.pool.query(sqlInsert, [idGroup,idSender, idReceiver, idCreator, message, type, 1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }


     //-----------------------------------------COLLECTIONS-----------------------------------------//

    // Obtiene las colecciones de un profesor, pudiendo filtrar por nombre de grupo o nombre de colección
    getCollections(idEstudiante, filtroBusqueda, callback)
    {   const sqlSelect = "SELECT c.id as idColeccion, c.nombre as nombreColeccion, g.id as idGrupo, g.nombre as nombreGrupo FROM coleccion c INNER JOIN grupo g ON g.id=c.idGrupo INNER JOIN grupoestudiante ge ON ge.idGrupo=g.id WHERE ge.idEstudiante=? AND (c.nombre LIKE ? OR g.nombre LIKE ?) AND c.activo=? AND ge.activo=?";
        const valores = ["%" + filtroBusqueda + "%"];

        this.pool.query(sqlSelect, [idEstudiante, valores, valores, 1, 1], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
              }
        });
    }

    // Obtiene una colección
    getCollection(idCollection, callback)
    {
        const sqlSelect = "SELECT g.id as idGrupo, c.nombre as nombreColeccion, g.nombre as nombreGrupo FROM coleccion c JOIN grupo g ON g.id=c.idGrupo WHERE c.id=?;";

        this.pool.query(sqlSelect, [idCollection], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
              }
        });
    }

    // Obtiene los desafíos de una colección
    getChallengesFromCollection(idCollection, callback)
    {
        const sqlSelect = "SELECT d.id, d.titulo, d.colaborativo FROM colecciondesafio cd JOIN desafio d ON d.id=cd.idDesafio WHERE cd.idColeccion=?;";

        this.pool.query(sqlSelect, [idCollection], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
                }
        });
    }

}

//Data export
module.exports = modelStudent;