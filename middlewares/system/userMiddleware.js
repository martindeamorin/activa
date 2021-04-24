const db = require("../../database/models/index")
const {body} = require("express-validator")

userMiddleware = {
    registerValidation : [
        body("nombreUsuario").notEmpty().isAlpha().withMessage("Debe ingresar un nombre"),
        body("dni").notEmpty().withMessage("Debe ingresar un DNI"),
        body("emailUsuario").notEmpty().normalizeEmail().isEmail().withMessage("Debe ingresar un email válido"),
        body("emailUsuario").custom(function(value){
            return db.Student.findOne({where : {email_alumno : value}}).then(function(resultado){
                if(resultado){
                    return Promise.reject("El email ya está en uso")
                }
            })
        }),
        body("rptEmail", "El correo electronico debe coincidir").custom(function(value, {req}){
            if(value == req.body.emailUsuario){
                return true
            } else{
                return false
            }
        }),
        body("contrasena").notEmpty().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})").withMessage("Debe ingresar una contraseña con un minimo de 8 caracteres, una minuscula, una mayuscula"),
        body("rptContrasena", "Las contraseñas deben coincidir").custom(function(value, {req}){
            if(value == req.body.rptContrasena){
                return true
            } else{
                return false
            }
        }),
    ],
    loginValidation : [
        body("emailUsuario").notEmpty().normalizeEmail().withMessage("Debe ingresar un email"),
        body("contrasena").notEmpty().withMessage("Debe ingresar una contraseña"),
    ],
    isLogged: function (req, res, next){
        if ((typeof req.session.user !== "undefined") || (typeof req.cookies.recordar !== "undefined")){
            return next();
        }else{
            if (req.is("application/json")){
                res.json({status : 401})
            } else {
            return res.render("system/login");                                    
            }
        };

    },

    isAdmin: function (req, res, next){


        if (req.session.user.admin == true){

            return next();

        }else{

            return res.render("system/login");                                    

        };

    }

};

module.exports = userMiddleware;