const db = require("../../database/models/index")
const bcryptjs = require("bcryptjs")
const { validationResult } = require("express-validator");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('ZkiU32');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");



const userController = {
    viewRegister : (req, res) => {
        res.render("system/register")
    },
    register : (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.render("system/register", {errors : errors.errors, datos : req.body})
        } else {
        let newsletter = 0;
        if(req.body.newsletter == "on"){
            newsletter = 1;
        }
        db.Student.create({
            apellido_alumno : req.body.apellidoUsuario,
            nombre_alumno : req.body.nombreUsuario,
            email_alumno : req.body.emailUsuario,
            contrasena : bcryptjs.hashSync(req.body.contrasena, 10),
            newsletter : newsletter,
            dni : req.body.dni,
            tipo_usuario : "cliente",
            estado_alumno : 1
        })
        .then(async () => {
            let findSession = await db.Student.findOne({where : {email_alumno : req.body.emailUsuario}})
                req.session.user = {
                    email : findSession.email_alumno,
                    id : findSession.id,
                    nombre : findSession.nombre_alumno,
                    apellido : findSession.apellido_alumno,
                    dni : findSession.dni
                }
            
            if(typeof req.body.returnURL !== "undefined"){
                res.redirect(req.body.returnURL)
            } else{
                res.redirect("/cursos")
            }
        })
        }
    },
    viewLogin : (req, res) => {
        res.render("system/login")
    },
    login : (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            console.log(errors.errors)
            res.render("system/login", {errors : errors.errors, datos : req.body})
        } else {
            db.Student.findOne({where : {email_alumno : req.body.emailUsuario}}).then(function(result){
                if(result){
                    // si existe comprobamos contraseña encriptada
                    
                    if(bcryptjs.compareSync(req.body.contrasena, result.contrasena)){
                        
                        //creamos la session y seteamos el email
                        req.session.user = {
                            email : req.body.emailUsuario,
                            id : result.id,
                            nombre : result.nombre_alumno,
                            apellido : result.apellido_alumno,
                            dni : result.dni
                        }
    
                        // si es admin creo el valor en session admin true
                        if (result.tipo_usuario=="admin"){
                            req.session.user.admin = true;
                        }else{
                            req.session.user.admin = false;
                        }
                        
                        // si eligió recuérdame seteamos la cookie
                        if (typeof req.body.rememberMe != 'undefined') {
                            res.cookie('recordar' , cryptr.encrypt("true"), { maxAge: 31536000000, httpOnly: true })
                            res.cookie('email' , cryptr.encrypt(req.body.emailUsuario), { maxAge: 31536000000, httpOnly: true })
                          }
                        if(result.tipo_usuario =="admin"){
                           return res.redirect("/dashboard/course-create");
                        }
                        if(typeof req.body.returnURL !== "undefined"){
                            res.redirect(req.body.returnURL)
                        } else{
                            return res.redirect("/cursos")
                        }
                   
                    }else{
                        return res.render("system/login", {errorMessage : "Email o contraseña incorrecta", datos: req.body});
                    };
                   
                }else{
                    return res.render("system/login", {errorMessage : "Email o contraseña incorrecta", datos: req.body});
                }
            })    
        }
    },
    viewCourses : (req, res) => {
        db.Student.findByPk(req.session.user.id, { include : [ {association : "courses", attributes : ["nombre_curso", "id", "imagen_curso"],  include : {
            association : "classes", attributes : ["id"]
        }}]})
        .then( async data => {
            if(data){
                let arrayData = [];
                let objectData = {courseImage : "", courseID : "", courseName : "", clasesVistas : 0, totalClases : 0, ultimaClase : "No has visto ninguna clase"};
                for(let course of data.courses){
                        if(course.CourseStudent.estado_pago == "paid" || course.CourseStudent.estado_pago == "Completed"){
                            objectData.courseImage = course.imagen_curso
                            objectData.courseID = course.id
                            objectData.courseName = course.nombre_curso
                            let classCount = await db.Class.count({where : {curso_id : data.id}})
                            objectData.totalClases += classCount;
                                for(let classData of course.classes){
                                    let seenClasses = await db.StudentClass.count({where : {clase_id : classData.id, alumno_id : req.session.user.id}})
                                    objectData.clasesVistas += seenClasses
                                        if((seenClasses != 0)){
                                            let lastClassName = await db.StudentClass.findOne({where : {alumno_id : req.session.user.id, clase_id : classData.id}, order : [["created_at", "DESC"]], include : {association : "class", attributes : ["nombre_clase"]}})
                                            objectData.ultimaClase = lastClassName.class.nombre_clase
                                        }
                                    }
                            arrayData.push(objectData)
                            objectData = {courseImage : "", courseID : "", courseName : "", clasesVistas : 0, totalClases : 0, ultimaClase : "No has visto ninguna clase"};
                    } 
                }
                    return res.render("system/courses", {arrayData})
                }else{
                    return res.render("system/courses")
                }
        })
    },
    viewClasses : (req, res) => {
        db.Class.findAll({where : {curso_id : req.params.courseId, estado_clase : 1}})
        .then( async (response) => {
            let seenArray = []
            let courseName = await db.Course.findByPk(req.params.courseId, {attributes : ["nombre_curso"]})
            for(let classData of response){
                    let seenClasses = await db.StudentClass.findOne({where : {clase_id : classData.id, alumno_id : req.session.user.id}})
                    if(seenClasses){
                        seenArray.push(classData.id);
                    }
            }
            return res.render("system/classes", {classData : response, seenArray, courseID : req.params.courseId, courseName})
        })
    },
    viewClass : (req, res) => {
        db.Class.findByPk(req.params.classId, {include : [{association : "files"}]})
        .then(async response => {
            let seenClasses = await db.StudentClass.findOne({where : {clase_id :req.params.classId, alumno_id : req.session.user.id}})
            if(!seenClasses){
                await db.StudentClass.create({
                    clase_id : req.params.classId,
                    alumno_id : req.session.user.id
                })
            }
            return res.render("system/class", {classData : response, courseId : req.params.courseId})
        })
    },
    viewPasswordRecovery : (req, res) => {
        res.render("system/viewRecovery")
    },
    sendRecoveryEmail : async (req, res) => {
        let {recoverEmail} = req.body;
        let randomPIN = randomstring.generate({
            length: 6,
            charset: 'numeric'
          });
        await db.Student.update({recuperar_contraseña : randomPIN},{where : {email_alumno : recoverEmail}})
        let contentHTML = `
        <h2>Recuperar contraseña</h2>
        <p>Ingrese el siguiente codigo de seguridad en la pagina: ${randomPIN}</p>
        `
        const transporter = nodemailer.createTransport({
          host: 'mail.activacoaching.com.ar',
          port: 465,
          secure: true,
          auth : {
            user: 'info@activacoaching.com.ar',
            pass: 'Fea5k6aY82'
          },
        tls: {rejectUnauthorized:true}})
  
          const info = await transporter.sendMail({
            from: "'Activa coaching' <info@activacoaching.com.ar>",
            to: `${recoverEmail}`,
            subject:'Recuperar contraseña - Activa coaching',
            html: contentHTML
          })
        if(info.response.includes("250" || "OK")){
            console.log(info)
            return res.redirect(`/recuperar-contrasena/pin`)            
        } else{
            return res.render("system/viewRecovery", {error : "Algo salio mal, intentelo de nuevo"})
        }
    },
    viewRecoveryPin : (req, res) =>{
        res.render("system/setPIN")
    },
    recoveryPin : async (req, res) =>{
       let usuarioRecuperar = await db.Student.findOne({where : {recuperar_contraseña : req.body.recoveryPIN}})
        if(usuarioRecuperar){
            req.session.emailRecover = cryptr.encrypt(usuarioRecuperar.email_alumno)
            res.redirect("/recuperar-contrasena/modificar")
        }
    },
    viewChangePassword : (req, res) => {
        res.render("system/changePassword")
    },
    changePassword : async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
        console.log(errors.errors)
        return res.render("system/changePassword", {errors : errors.errors})
        } else {
        let resultChange = await db.Student.update({recuperar_contraseña : "", contrasena : bcryptjs.hashSync(req.body.contrasena, 10)}, {where : {email_alumno : cryptr.decrypt(req.session.emailRecover)}})
        if(resultChange[0] === 1){
            req.session.destroy()
        }
        return res.redirect("/login")
        }
    },

    logout : (req, res) => {
        req.session.destroy();
        res.clearCookie('recordar')
        res.clearCookie('email')
        res.redirect("/")
    }
}

module.exports = userController;