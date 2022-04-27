// Functionality systems
class modelUser {

    constructor(pool) {
        this.pool = pool;
    }

    create(username, surname, email, password, role , callback) {

        this.pool.getConnection(function (err, connection) {

            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            } else {
                const sql = "INSERT INTO usuario (correo, password,nombre,apellidos,activo,rol) values (?,?,?,?,?,?)";
                const valores = [email, password, username, surname, 0, role];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al crear el desafío."));
                    } else {
                        return callback(null, res[0]);
                    }
                })
            }
        });

    }

    /*Obtiene todos los grupos del profesor*/
    getGroups(group, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT * FROM grupo where idprofesor= ?";
                const valores = [group];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar los grupos del profesor."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    /*Obtiene todos los grupos del alumno*/
    getStudentGroups(group, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT grupo.id, grupo.nombre FROM grupoestudiante  INNER JOIN grupo  ON grupoestudiante.idGrupo = grupo.id WHERE grupoestudiante.idEstudiante = ? AND grupo.activo = 1";
                const valores = [group];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar los grupos del alumno."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    /*Obtiene todos los grupos*/
    getAllGroups(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT * FROM grupo WHERE activo = 1";
                const valores = [];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar los grupos."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    //Busca todos los estudiantes que contengan "clave" bien en su nombre o en su correo. Esta elección está pensada para elegirse desde un combobox.
    searchStudent(clave, tipo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            } else {
                let consulta = 'SELECT id, nombre, apellidos, foto, ruta, correo FROM usuario WHERE (nombre LIKE ? OR apellidos LIKE ?)AND rol = "S" AND activo = 1;';

                if (tipo == "email") {
                    consulta = 'SELECT id, nombre, apellidos, foto, ruta,  correo FROM usuario WHERE correo LIKE ? AND rol = "S" AND activo = 1;';
                }
                const sql = consulta;
                const valores = ["%" + clave + "%", "%" + clave + "%"];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar esudiantes con " + tipo + " similar a " + clave + "."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    //Busca todos los usuarios activos con ciertos parámetros.
    searchUsers(clave, tipo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            } else {
                let consulta = 'SELECT id, nombre, apellidos, foto, ruta, rol, correo FROM usuario WHERE (nombre LIKE ? OR apellidos LIKE ?) AND activo = 1;';
                if (tipo == "email") {
                    consulta = 'SELECT id, nombre, apellidos, foto, ruta, rol, correo FROM usuario WHERE correo LIKE ? AND activo = 1;';
                }
                const sql = consulta;
                const valores = ["%" + clave + "%", "%" + clave + "%"];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar usuarios con " + tipo + " similar a " + clave + "."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    //Busca todos los estudiantes solicitantes (aún no aprobados) que contengan "clave" bien en su nombre o en su correo. 
    searchApplicant(clave, tipo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            } else {
                let consulta = 'SELECT id, nombre, apellidos, foto,ruta, rol, correo  FROM usuario WHERE (nombre LIKE ? OR apellidos LIKE ?) AND activo = 0;';
                if (tipo == "email") {
                    consulta = 'SELECT id, nombre, apellidos, foto,ruta, rol, correo FROM usuario WHERE correo LIKE ? AND activo = 0;';
                }
                const sql = consulta;
                const valores = ["%" + clave + "%", "%" + clave + "%"];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar solicitudes con " + tipo + " similar a " + clave + "."));
                    } else {

                        callback(null, res);
                    }
                })
            }
        });
    }

    /*Obtiene los datos de perfil del alumno*/
    acceptApplicant(idUser, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "UPDATE usuario SET activo = 1 WHERE id =  ?";
                const valores = [idUser];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al aceptar al solicitante."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    /*Obtiene los datos de perfil del alumno*/
    getProfile(idUser, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT id, nombre, apellidos, foto,ruta, correo, activo, rol FROM usuario where id =  ?";
                const valores = [idUser];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar al usuario."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    /*Obtiene los datos de grupo del elegido*/
    getGroupData(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT id, nombre, idprofesor FROM grupo WHERE id = ? AND activo = 1";
                const valores = [id];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar al grupo."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    getStudentOfGroup(idGrupo, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = 'SELECT usuario.id, nombre, apellidos, foto, correo, ruta FROM usuario INNER JOIN grupoestudiante ON usuario.id = grupoestudiante.idEstudiante WHERE usuario.rol = "S" AND usuario.activo = 1 AND grupoestudiante.idGrupo = ?;';
                const valores = [idGrupo];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar usuarios en el grupo " + idGrupo + "."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    getTeamsOfGroup(idGrupo, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = 'SELECT * FROM equipo WHERE idGrupo = ? AND activo = 1;';
                const valores = [idGrupo];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar equipos en el grupo " + idGrupo + "."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }


    /*Obtiene los datos de perfil del alumno*/
    deleteChallenge(id, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "UPDATE desafio SET activo = 0 WHERE id =  ?";
                const valores = [id];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al eliminar el desafío."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    /*Obtiene los escritos no colaborativos del alumno*/
    getScriptsByStudent(idUser, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT escrito.id, idEscritor, escrito.idGrupo, idDesafio, nombre, titulo FROM escrito INNER JOIN desafio ON escrito.idDesafio = desafio.id  WHERE idEscritor =  ? AND escrito.colaborativo = 1 AND escrito.activo = 1";
                const valores = [idUser];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar los escritos."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    /*Obtiene los escritos no colaborativos del alumno*/
    getScriptsByTeam(idTeam, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT escrito.id, idEscritor, escrito.idGrupo, idDesafio, nombre, titulo FROM escrito INNER JOIN desafio ON escrito.idDesafio = desafio.id  WHERE idEscritor =  ? AND escrito.colaborativo = 2 AND escrito.activo = 1";
                const valores = [idTeam];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar los escritos."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }


    findOneEmail(username, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT * FROM usuario where correo = ? and activo=?";
                const valores = [username, 1];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {

                        callback(new Error("Error al buscar usuarios en el grupo " + username + "."));
                    }
                    else {
                        return callback(null, res[0]);

                    }
                })
            }
        });
    }

    editProfile(id, nombre, apellidos, correo, password, foto, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {

                let query = '';
                let parametros = '';

                if (!password && foto == '') {

                    query = "UPDATE usuario  SET correo = ?,nombre = ?, apellidos=? WHERE id= ?";
                    parametros = [correo, nombre, apellidos, id];
                }
                else if (!password && foto) {
                    query = "UPDATE usuario  SET correo = ?,nombre = ?, apellidos =?, foto =? WHERE id= ?";
                    parametros = [correo, nombre, apellidos, foto, id];
                }
                else if (password && !foto) {
                    query = "UPDATE usuario  SET correo = ?,nombre = ?, apellidos =?, password=? WHERE id= ?";
                    parametros = [correo, nombre, apellidos, password, id];
                }
                else {

                    query = "UPDATE usuario  SET correo = ?,nombre = ?, apellidos =?, password =? ,foto = ? WHERE id= ?";
                    parametros = [correo, nombre, apellidos, password, foto, id];

                }

                const sql = query;
                const valores = parametros;

                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {

                        callback(new Error("Error al actualizar el usuario " + nombre + "."));
                        console.log(err);
                    }
                    else {

                        callback(null, res);
                    }
                })
            }
        });

    }

    /*Actualiza la foto de perfil del estudiante*/
    updatePhoto(idUser, path, callback) {
        const sqlUpdate = "UPDATE usuario SET ruta=? WHERE id =?";
        this.pool.query(sqlUpdate, [path, idUser], (err, result) => {
            if (err) {
                callback(new Error("----ERROR SQL----\n" + err.sql + "\n" + err.sqlMessage));
            }
            else {
                callback(null, result);
            }
        });
    }

    disableProfile(idUser, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "UPDATE usuario SET activo=? WHERE id =?";
                const valores = [0, idUser];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al dar de baja esta cuenta."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }


    /*Obtiene los datos del equipo*/
    getTeam(idTeam, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            }
            else {
                const sql = "SELECT * FROM equipo where id =  ?";
                const valores = [idTeam];
                connection.query(sql, valores, function (err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al buscar al usuario."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }
}

//Data export
module.exports = modelUser;