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
            imagen_curso : req.files[1].filename,
            hora_curso : req.body.horaCurso,
            instructora : req.body.instructora,
            costo_pesos : req.body.precioCursoPesos,
            imagen_landing :req.files[0].filename,
            estado_curso : 0
        })
        .then( () => {
            res.redirect("/dashboard/course-create")
        }
        )
    },
    courseDelete : (req, res) => {
        db.Course.findByPk(req.params.id, {
            include : [{association : "classes", include : [{ association : "files"}]}]
        })
        .then( async courseData => {
            if(courseData.classes[0]){
                for(let classData of courseData.classes){
                    await db.StudentClass.destroy({where : {clase_id : classData.id}})
                    if(classData.files[0]){
                        for(let file of classData.files){
                            if(file.tipo_archivo == "archivo"){
                                fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                            }
                        }
                    }
            }
            }
            await db.CourseStudent.destroy({where : {curso_id : req.params.id}})
            await db.Course.destroy({where : {id : req.params.id}})
            return res.redirect("/dashboard/course-create")
        })
    },
    viewCourseEdit : (req, res) => {
        db.Course.findByPk(req.params.id,{
            include : "classes"
        })
        .then(courseData => {
            res.render("system/courseEdit", {courseData})
        })
    },
    courseEdit : (req, res) => {
        if(req.files[0]){
            for(let i = 0;  i < req.files.length; i++){
                if(req.files[i].fieldname == "rutaImagenLanding"){
                    db.Course.update({
                        imagen_landing: req.files[i].filename
                    },
                    {
                        where : 
                        {
                            id : req.params.id
                        }
                    })
                } else {
                    db.Course.update({
                        imagen_curso: req.files[i].filename
                    },
                    {
                        where : 
                        {
                            id : req.params.id
                        }
                    })
                }
            }

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
            instructora : req.body.instructora,
            costo_pesos : req.body.precioCursoPesos,
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
    classCreate : (req, res) => {
        db.Class.create({
            nombre_clase : req.body.nombreClase,
            curso_id : req.params.id,
            fecha : req.body.fechaClase,
            link_clase : req.body.linkClase,
            contrasena_clase : req.body.contrasenaClase,
            descripcion_clase : req.body.descripcionClase,
            hora_clase : req.body.horaClase,
            estado_clase : 0
        })
        .then(() => {
            res.redirect("/dashboard/course-edit/" + req.params.id)
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
            hora_clase : req.body.horaClase,

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
        .then( async classData => {
            if(classData.files[0]){
                for(let file of classData.files){
                    if(file.tipo_archivo == "archivo"){
                    fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                    }
                }
            }
            await db.StudentClass.destroy({where : {clase_id : req.params.id}})
            await db.Class.destroy({where : {id : req.params.id}})
            
            res.redirect("/dashboard/course-edit/" + classData.curso_id)
            
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
               return res.redirect("/dashboard/class-edit/" + req.params.id)
            })
        } else if(req.files[0]){
            let filesLoad = req.files.map( (element) => {
               return db.File.create({
                    clase_id : req.params.id,
                    ruta_archivo : element.filename,
                    tipo_archivo : "archivo"
                })
            })
            Promise.all([filesLoad])
            .then(() => {
               return res.redirect("/dashboard/class-edit/" + req.params.id)
            })

        } else {
            db.File.create({
                clase_id : req.params.id,
                ruta_archivo : req.body.urlVideo,
                tipo_archivo : "video"
            })
            .then( () => {
               return res.redirect("/dashboard/class-edit/" + req.params.id)
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
    courseEnable : (req, res) => {
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
    classEnable : (req, res) => {
        db.Class.update({
            estado_clase : req.body.habilitar
        },
            {where : {nombre_clase : req.body.nombre, curso_id : req.body.courseID}
        })
        .then((data) => {
            if(data[0] == 1){
                return res.json(200)
            }
        })
    }

}

module.exports = dashboardController;