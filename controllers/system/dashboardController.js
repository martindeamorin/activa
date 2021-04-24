const db = require("../../database/models/index")
const fs = require('fs');
const path = require("path");

const dashboardController = {
    viewIndex : (req,res) => {
        db.Course.findAll()
        .then( coursesData => {
            res.render("system/courseCreate", {coursesData})
        })
    },
    courseRegister : (req, res) => {
        db.Course.create({
            nombre_curso : req.body.nombreCurso,
            costo_curso : req.body.precioCurso,
            fecha_inicio : req.body.fechaInicioCurso,
            fecha_final : req.body.fechaFinalCurso,
            descripcion_curso : req.body.descripcionCurso,
            descripcion_corta : req.body.descripcionCorta,
            dia_curso : req.body.diaCurso,
            imagen_curso : req.files[0].filename,
            hora_curso : req.body.horaCurso,
            estado_curso : 0
        })
        .then( () => {
            res.redirect("/dashboard/course-create")
        }
        )
    },
    viewCourseEdit : (req, res) => {
        db.Course.findByPk(req.params.id,{
            include : "modules"
        })
        .then(courseData => {
            res.render("system/courseEdit", {courseData})
        })
    },
    courseDelete : (req, res) => {
        db.Course.findByPk(req.params.id, {
            include : [{association : "modules", include : [{association : "classes", include : [{ association : "files"}]}]}]
        })
        .then( courseData => {
            if(courseData.modules[0]){
            for(let i = 0; i < courseData.modules.length; i++){
                if(courseData.modules[i].classes[0]){
                    for(let classData of courseData.modules[i].classes){
                        if(classData.files[0]){
                            for(let file of classData.files){
                                if(file.tipo_archivo == "archivo"){
                                fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                                }
                            }
                        }
                    }
                    
                }
            }
            }
            db.Course.destroy({where : {id : req.params.id}})
            .then(() => {
                res.redirect("/dashboard/course-create")
            })
        })
    },
    courseEdit : (req, res) => {
        if(req.files[0]){
            db.Course.update({
                imagen_curso : req.files[0].filename
            },
            {
                where : 
                {
                    id : req.params.id
                }
            })
        }
        db.Course.update({
            nombre_curso : req.body.nombreCurso,
            costo_curso : req.body.precioCurso,
            fecha_inicio : req.body.fechaInicioCurso,
            fecha_final : req.body.fechaFinalCurso,
            descripcion_curso : req.body.descripcionCurso,
            descripcion_corta : req.body.descripcionCorta,
            dia_curso : req.body.diaCurso,
            hora_curso : req.body.horaCurso,
            estado_curso : 1
        },
        {
            where : 
            {
                id : req.params.id
            }
        })
        .then( (data) => {

            res.redirect("/dashboard/course-edit/" + req.params.id)
        })
    },
    moduleCreate : (req,res) => {
        db.Module.create({
            nombre_modulo : req.body.nombreModulo,
            fecha_inicio : req.body.fechaInicioModulo,
            fecha_final : req.body.fechaFinalModulo,
            curso_id : req.params.id,
            estado_modulo: 1
        })
        .then( () =>{
            res.redirect("/dashboard/course-edit/" + req.params.id)
        })
    },
    viewModuleEdit : (req, res) => {
        db.Module.findByPk(req.params.id, {include : "classes"})
        .then((moduleData) => {
            res.render("system/moduleEdit", {moduleData})
        })
    },
    moduleEdit : (req, res) => {
        db.Module.update({
            nombre_modulo : req.body.nombreModulo,
            fecha_inicio : req.body.fechaInicioModulo,
            fecha_final : req.body.fechaFinalModulo,
        }, {
            where : { id : req.params.id}
        })
        .then(() => {
            res.redirect("/dashboard/module-edit/" + req.params.id)
        }) 
    },
    moduleDelete : (req, res) => {
        db.Module.findByPk(req.params.id, {
            include : [{association : "classes", include : [{ association : "files"}]}]
        })
        .then( moduleData => {
            if(moduleData.classes[0]){
            for(let i = 0; i < moduleData.classes.length; i++){
                if(moduleData.classes[i].files[0]){
                    for(let file of moduleData.classes[i].files){
                        if(file.tipo_archivo == "archivo"){
                        fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                        }
                    }
                }
            }
            }
            db.Module.destroy({where : {id : req.params.id}})
            .then(() => {
                res.redirect("/dashboard/course-edit/" + moduleData.curso_id)
            })
        })
    },
    classCreate : (req, res) => {
        db.Class.create({
            nombre_clase : req.body.nombreClase,
            modulo_id : req.params.id,
            fecha : req.body.fechaClase,
            link_clase : req.body.linkClase,
            contrasena_clase : req.body.contrasenaClase,
            descripcion_clase : req.body.descripcionClase,
            estado_clase : 1
        })
        .then(() => {
            res.redirect("/dashboard/module-edit/" + req.params.id)
        })
    },
    viewClassEdit : (req, res) => {
        db.Class.findByPk(req.params.id, {include : {association : "files" }})
        .then((classData) => {
            res.render("system/classEdit", {classData})
        })
    },
    classEdit : (req, res) => {
        db.Class.update({
            nombre_clase : req.body.nombreClase,
            fecha : req.body.fechaClase,
            link_clase : req.body.linkClase,
            contrasena_clase : req.body.contrasenaClase,
            descripcion_clase : req.body.descripcionClase,
        }, {
            where : { id : req.params.id}
        })
        .then(() => {
            res.redirect("/dashboard/class-edit/" + req.params.id)
        }) 
    },
    classDelete : (req, res) => {
        db.Class.findByPk(req.params.id, {
            include : [{ association : "files"}]
        })
        .then( classData => {
            if(classData.files[0]){
                for(let file of classData.files){
                    if(file.tipo_archivo == "archivo"){
                    fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                    }
                }
            }
            db.Class.destroy({where : {id : req.params.id}})
            .then(() => {
                res.redirect("/dashboard/module-edit/" + classData.modulo_id)
            })
        })
    },
    fileUpload : (req, res) => {

        if((req.files[0]) && (req.body.urlVideo !== "")){
            for(let file of req.files){
                db.File.create({
                    clase_id : req.params.id,
                    ruta_archivo : file.filename,
                    tipo_archivo : "archivo"
                })
            }
            db.File.create({
                clase_id : req.params.id,
                ruta_archivo : req.body.urlVideo,
                tipo_archivo : "video"
            })
            .then( () => {
                res.redirect("/dashboard/class-edit/" + req.params.id)
            })
        } else if(req.files[0]){
            let filesLoad = req.files.map( (element) => {
               return db.File.create({
                    clase_id : req.params.id,
                    ruta_archivo : element.filename,
                    tipo_archivo : "archivo"
                })
            })
            Promise.all([filesLoad]).then(() => {
                res.redirect("/dashboard/class-edit/" + req.params.id)
            })

        } else {
            db.File.create({
                clase_id : req.params.id,
                ruta_archivo : req.body.urlVideo,
                tipo_archivo : "video"
            })
            .then( () => {
                res.redirect("/dashboard/class-edit/" + req.params.id)
            })
        }
    },
    fileDelete : (req, res) => {
        db.File.findByPk(req.params.id)
        .then( file => {
                if(file.tipo_archivo == "archivo"){
                fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                }
            db.File.destroy({where : {id : req.params.id}})
            .then(() => {
                res.redirect("/dashboard/class-edit/" + file.clase_id)
            })
        })
    },
    classEnable : (req, res) => {
        db.Course.update({
            estado_curso : req.body.habilitar
        },
            {where : {nombre_curso : req.body.nombre}
        })
        .then((data) => {
            if(data[0] == 1){
                return res.json(200)
            }
        })
    },
    moduleEnable : (req, res) => {
        db.Module.update({
            estado_modulo : req.body.habilitar
        },
            {where : {nombre_modulo : req.body.nombre, curso_id : req.body.courseID}
        })
        .then((data) => {
            if(data[0] == 1){
                return res.json(200)
            }
        })
    }

}

module.exports = dashboardController;