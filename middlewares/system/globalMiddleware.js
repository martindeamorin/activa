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
            res.locals.permiso = req.session.user.admin
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

    },
    getHeaderCourse : (req, res, next) => {
        db.Course.findAll({where : {estado_curso : 1}, attributes : ["nombre_curso", "id", "tipo_curso", "imagen_landing", "descripcion_corta"]})
        .then((result) => {
            if(result){
                res.locals.taller = []
                res.locals.mentoria = []
                for(let courseData of result){
                    if(courseData.tipo_curso == "mentoria"){
                        res.locals.mentoria.push({nombre : courseData.nombre_curso, id : courseData.id, descripcion_corta : courseData.descripcion_corta, imagen_landing : courseData.imagen_landing})
                    } else{
                        res.locals.taller.push({nombre : courseData.nombre_curso, id : courseData.id, descripcion_corta : courseData.descripcion_corta, imagen_landing : courseData.imagen_landing})
                    }
                }
            }

            return next()
        })
    },
}

module.exports = globalMiddleware;