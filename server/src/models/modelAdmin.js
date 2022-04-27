// Functionality systems
class modelAdmin {
    constructor(pool) {
        this.pool = pool;
    }

    //Expulsa a un estudiante de un grupo.
    deactivateUser( id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            } else {
                const sql = 'UPDATE  usuario SET activo = 0 WHERE id = ?;'; 
                const valores = [id];
                connection.query(sql, valores, function(err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al desactivar al usuario."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    //Expulsa a un estudiante de un grupo.
    deleteUser( id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            } else {
                const sql = 'DELETE FROM usuario WHERE id = ?;'; 
                const valores = [id];
                connection.query(sql, valores, function(err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al eliminar al usuario."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    //Renombra un grupo.
    renameGroup( id, name, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            } else {
                const sql = 'UPDATE  grupo SET nombre = ? WHERE id = ?;'; 
                const valores = [name, id];
                connection.query(sql, valores, function(err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al cambiar el nombre del grupo."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

    //Desactiva un grupo.
    deactivateGroup( id, callback) {
        this.pool.getConnection(function(err, connection) {
            if (err) {
                callback(new Error("No se puede conectar a la base de datos."))
            } else {
                const sql = 'UPDATE  grupo SET activo = 0 WHERE id = ?;'; 
                const valores = [id];
                connection.query(sql, valores, function(err, res) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error al desactivar el grupo."));
                    } else {
                        callback(null, res);
                    }
                })
            }
        });
    }

}

//Data export
module.exports = modelAdmin;  