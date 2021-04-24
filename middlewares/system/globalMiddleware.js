const db = require("../../database/models/index")
const Cryptr = require('cryptr');
const cryptr = new Cryptr('ZkiU32');

const globalMiddleware = {

    setHeader : (req, res, next) => {
        if(req.session.user){
            res.locals.apellido = req.session.user.apellido
            res.locals.nombre = req.session.user.nombre
            res.locals.email = req.session.user.email
            res.locals.id = req.session.user.id
            next()
        } else {
            next()

        }
    },

    sessionRecovery : (req,res,next) => {
        if((typeof req.session.user == "undefined") && (typeof req.cookies.email != "undefined")){
            db.Student.findOne({where : {email_alumno : cryptr.decrypt(req.cookies.email)}})
            .then((data) => {
                if(data){
                req.session.user = {
                    email : data.email_alumno,
                    id : data.id,
                    nombre : data.nombre_alumno,
                    apellido : data.apellido_alumno,
                    dni : data.dni
                }
                if(data.tipo_usuario == "admin"){
                    req.session.user.admin = true;
                } else{
                    req.session.user.admin = false;
                }
                }
                next()
            })
        } else{
            next()
        }

    }
}

module.exports = globalMiddleware;