const db = require("../../database/models/index")
const fs = require('fs');
const path = require("path");
const { Op } = require("sequelize")

const dashboardController = {
    viewIndex: (req, res) => {
        db.Course.findAll()
            .then(coursesData => {
                res.render("system/courseCreate", { coursesData })
            })
    },
    courseRegister: (req, res) => {

        db.Course.create({
            nombre_curso: req.body.nombreCurso,
            costo_curso: req.body.precioCurso,
            fecha_inicio: req.body.fechaInicioCurso,
            fecha_final: req.body.fechaFinalCurso,
            descripcion_curso: req.body.descripcionCurso,
            descripcion_corta: req.body.descripcionCorta,
            dia_curso: req.body.diaCurso,
            hora_curso: req.body.horaCurso,
            imagen_landing: "",
            imagen_curso: "",
            instructora: req.body.instructora,
            costo_pesos: req.body.precioCursoPesos,
            tipo_curso: req.body.tipoCurso,
            informacion_extra: req.body.informacionExtra,
            habilitar_pago: 0,
            estado_curso: 0
        })
            .then(async (course) => {
                if (req.files[0]) {
                    console.log("a")
                    for (file of req.files) {
                        if (file.fieldname === "rutaImagenLanding") {
                            await db.Course.update({
                                imagen_landing: file.filename,
                            }, {
                                where: {
                                    id: course.id
                                }
                            })
                        } else {
                            await db.Course.update({
                                imagen_curso: file.filename,
                            }, {
                                where: {
                                    id: course.id
                                }
                            })
                        }
                    }
                }
                return res.redirect("/dashboard/course-create")
            }
            )
    },
    courseDelete: (req, res) => {
        db.Course.findByPk(req.params.id, {
            include: [{ association: "classes", include: [{ association: "files" }] }]
        })
            .then(async courseData => {
                if (courseData.classes[0]) {
                    for (let classData of courseData.classes) {
                        await db.StudentClass.destroy({ where: { clase_id: classData.id } })
                        if (classData.files[0]) {
                            for (let file of classData.files) {
                                if (file.tipo_archivo == "archivo") {
                                    try{
                                        fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                                    } catch(err){
                                        console.log(err)
                                    }
                                }
                            }
                        }
                    }
                }
                await db.CourseStudent.destroy({ where: { curso_id: req.params.id } })
                await db.Course.destroy({ where: { id: req.params.id } })
                return res.redirect("/dashboard/course-create")
            })
    },
    viewCourseEdit: (req, res) => {
        db.Course.findByPk(req.params.id, {
            include: "classes"
        })
            .then(courseData => {
                res.render("system/courseEdit", { courseData })
            })
    },
    courseEdit: (req, res) => {
        if (req.files[0]) {
            for (let i = 0; i < req.files.length; i++) {
                if (req.files[i].fieldname == "rutaImagenLanding") {
                    db.Course.update({
                        imagen_landing: req.files[i].filename
                    },
                        {
                            where:
                            {
                                id: req.params.id
                            }
                        })
                } else {
                    db.Course.update({
                        imagen_curso: req.files[i].filename
                    },
                        {
                            where:
                            {
                                id: req.params.id
                            }
                        })
                }
            }

        }
        db.Course.update({
            nombre_curso: req.body.nombreCurso,
            costo_curso: req.body.precioCurso,
            fecha_inicio: req.body.fechaInicioCurso,
            fecha_final: req.body.fechaFinalCurso,
            descripcion_curso: req.body.descripcionCurso,
            descripcion_corta: req.body.descripcionCorta,
            dia_curso: req.body.diaCurso,
            hora_curso: req.body.horaCurso,
            instructora: req.body.instructora,
            costo_pesos: req.body.precioCursoPesos,
            tipo_curso: req.body.tipoCurso,
            informacion_extra: req.body.informacionExtra
        },
            {
                where:
                {
                    id: req.params.id
                }
            })
            .then((data) => {

                res.redirect("/dashboard/course-edit/" + req.params.id)
            })
    },
    classCreate: (req, res) => {
        db.Class.create({
            nombre_clase: req.body.nombreClase,
            curso_id: req.params.id,
            fecha: req.body.fechaClase,
            link_clase: req.body.linkClase,
            contrasena_clase: req.body.contrasenaClase,
            descripcion_clase: req.body.descripcionClase,
            hora_clase: req.body.horaClase,
            estado_clase: 0
        })
            .then(() => {
                res.redirect("/dashboard/course-edit/" + req.params.id)
            })
    },
    viewClassEdit: (req, res) => {
        db.Class.findByPk(req.params.id, { include: [{ association: "files" }, { association: "course", attributes: ["id", "nombre_curso"] }] })
            .then((classData) => {
                res.render("system/classEdit", { classData })
            })
    },
    classEdit: (req, res) => {
        db.Class.update({
            nombre_clase: req.body.nombreClase,
            fecha: req.body.fechaClase,
            link_clase: req.body.linkClase,
            contrasena_clase: req.body.contrasenaClase,
            descripcion_clase: req.body.descripcionClase,
            hora_clase: req.body.horaClase,

        }, {
            where: { id: req.params.id }
        })
            .then(() => {
                res.redirect("/dashboard/class-edit/" + req.params.id)
            })
    },
    classDelete: (req, res) => {
        db.Class.findByPk(req.params.id, {
            include: [{ association: "files" }]
        })
            .then(async classData => {
                if (classData.files[0]) {
                    for (let file of classData.files) {
                        if (file.tipo_archivo == "archivo") {
                            try{
                                fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                            }catch(err){
                                console.log(err)
                            }
                        }
                    }
                }
                await db.StudentClass.destroy({ where: { clase_id: req.params.id } })
                await db.Class.destroy({ where: { id: req.params.id } })

                res.redirect("/dashboard/course-edit/" + classData.curso_id)

            })
    },
    fileUpload: async (req, res) => {

        if ((req.files[0]) && (req.body.urlVideo !== "")) {
            for (let file of req.files) {
                await db.File.create({
                    clase_id: req.params.id,
                    ruta_archivo: file.filename,
                    tipo_archivo: "archivo"
                })
            }
            db.File.create({
                clase_id: req.params.id,
                ruta_archivo: req.body.urlVideo,
                tipo_archivo: "video"
            })
                .then(() => {
                    return res.redirect("/dashboard/class-edit/" + req.params.id)
                })
        } else if (req.files[0]) {
            for (let file of req.files) {
                await db.File.create({
                    clase_id: req.params.id,
                    ruta_archivo: file.filename,
                    tipo_archivo: "archivo"
                })
            }
            return res.redirect("/dashboard/class-edit/" + req.params.id)
        } else {
            db.File.create({
                clase_id: req.params.id,
                ruta_archivo: req.body.urlVideo,
                tipo_archivo: "video"
            })
                .then(() => {
                    return res.redirect("/dashboard/class-edit/" + req.params.id)
                })
        }
    },
    fileDelete: (req, res) => {
        db.File.findByPk(req.params.id)
            .then(file => {
                if (file.tipo_archivo == "archivo") {
                    try{
                        fs.unlinkSync(path.normalize(path.resolve(__dirname, `../../public/files/${file.ruta_archivo}`)))
                    }
                    catch(err){
                        console.log(err)
                    }
                }
                db.File.destroy({ where: { id: req.params.id } })
                    .then(() => {
                        res.redirect("/dashboard/class-edit/" + file.clase_id)
                    })
            })
    },
    courseEnable: (req, res) => {
        db.Course.update({
            estado_curso: req.body.habilitar
        },
            {
                where: { nombre_curso: req.body.nombre }
            })
            .then((data) => {
                if (data[0] == 1) {
                    return res.json(200)
                }
            })
    },
    classEnable: (req, res) => {
        db.Class.update({
            estado_clase: req.body.habilitar
        },
            {
                where: { nombre_clase: req.body.nombre, curso_id: req.body.courseID }
            })
            .then((data) => {
                if (data[0] == 1) {
                    return res.json(200)
                }
            })
    },
    paymentEnable: (req, res) => {
        db.Course.update({
            habilitar_pago: req.body.checkPago
        },
            {
                where: { nombre_curso: req.body.nombre }
            })
            .then((data) => {
                if (data[0] == 1) {
                    return res.json(200)
                }
            })
    },
    viewTransactions: (req, res) => {
        db.Course.findAll({ attributes: ["nombre_curso", "id"] })
            .then(data => {
                return res.render("system/viewTransactions", { courses: data })
            })
    },

    sortTransactions: (req, res) => {
        if (req.body.limite == "") {
            req.body.limite = 10000;
        }
        if (req.body.curso == "todos") {
            db.CourseStudent.findAll({ include: [{ association: "student", where: { email_alumno: { [Op.like]: `%${req.body.email}%` } }, attributes: ["email_alumno"] }, { association: "course", attributes: ["nombre_curso"] }], attributes: ["estado_pago", "id"], limit: Number(req.body.limite), order: [["created_at", req.body.orden]] })
                .then((result) => {
                    return res.json({ transactionData: result })
                })
        } else {
            db.CourseStudent.findAll({ include: [{ association: "student", where: { email_alumno: { [Op.like]: `%${req.body.email}%` } }, attributes: ["email_alumno"] }, { association: "course", where: { nombre_curso: req.body.curso }, attributes: ["nombre_curso"] }], attributes: ["estado_pago", "id"], limit: Number(req.body.limite), order: [["created_at", req.body.orden]] })
                .then((result) => {
                    return res.json({ transactionData: result })
                })
        }
    },
    viewTransactionDetail: (req, res) => {
        db.CourseStudent.findOne({ where: { id: req.params.id }, include: [{ association: "student" }, { association: "course" }] })
            .then((result) => {
                res.render("system/transactionDetail", { transactionData: result })
            })
    },
    giveAccess: (req, res) => {
        db.Student.findOne({ where: { email_alumno: req.body.emailAcceso } })
            .then(data => {
                if (data) {
                    db.CourseStudent.create({ curso_id: req.body.cursoAcceso, alumno_id: data.id, estado_pago: "paid", plataforma_pago: "manual" })
                        .then(() => {
                            return res.redirect("/dashboard/transactions")
                        })
                } else {
                    db.Course.findAll({ attributes: ["nombre_curso", "id"] })
                        .then((data) => {
                            res.render("system/viewTransactions", { errorMessage: "No se ha encontrado un usuario registrado con ese mail", courses: data })
                        })
                }
            })
    },
    viewUsers: (req, res) => {
        return res.render("system/viewUsers");
    },
    sortUsers: (req, res) => {
        if (req.body.limite == "") {
            req.body.limite = 10000;
        }
        db.Student.findAll({ where: { email_alumno: { [Op.like]: `%${req.body.email}%` } }, limit: Number(req.body.limite), order: [["created_at", req.body.orden]], attributes: ["email_alumno", "nombre_alumno", "apellido_alumno", "newsletter"] })
            .then((result) => {
                return res.json({ transactionData: result })
            })
    }

}

module.exports = dashboardController;