'use strict'

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const prueba = path.join(__dirname, '../../public/multimedia/');
        var str = file.mimetype;//
        var res = str.split("/");//
        var dir;
        if (req.query.type == 1) {
            //obtengo la ruta -> multimedia/idUser/idfolder/tipo
            dir = prueba + "users" + "/" + req.query.id + "/" + req.query.idFolder + "/" + res[0];
        }
        else if (req.query.type == 2) {
            dir = prueba + "teams" + "/" + req.query.id + "/" + req.query.idFolder + "/" + res[0];
        }
        else if (req.query.type == 3) {
            dir = prueba + "users" + "/" + req.query.id;
        }
        //console.log("----->Carpeta------>", dir);
        //crea la carpeta en la ruta
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        //  cb(null, file.originalname);//nombre original de la imagen
        if (req.query.type == 1 || req.query.type == 2) {
            cb(null, file.originalname);//nombre original de la imagen
        }
        else if (req.query.type == 3) {
            //hago esto para evitar que se almacenen varias fotos de perfil, 
            //solo me interesa almacenar 1 foto de perfil 
            var strAux = file.originalname;
            var typeAux = strAux.split(".");
            //nombre de la foto de perfil del usuario 
            var nameAux = "user" + req.query.id + "." + typeAux[1];
            cb(null, nameAux);//nombre del usuario
        }
    }
})

module.exports = storage


