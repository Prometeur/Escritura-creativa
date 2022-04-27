// Functionality systems
class modelLogin {
    constructor(pool) {
        this.pool = pool;
    }

    //Devuelve a todos los usuarios de todos los tipos que hayan sido aceptados (activo a 1)
    getUser(usuario,password,callback) {
        const sqlSelect = "SELECT * FROM usuario where nombre = ? AND password = ? ";
        this.pool.query(sqlSelect, [usuario, password], (err, result) => {
           console.log(err);
           callback(null,result);
        });
     
    }
}
//Data export
module.exports = modelLogin;    