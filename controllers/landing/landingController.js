const db = require("../../database/models/index")

const landingController = {
    viewIndex : (req, res) => {
        db.Course.findAll({where : {estado_curso : 1}})
        .then( courseData => res.render("landing/index", {courseData}))
    },
    viewCourse : (req, res) => {
        db.Course.findOne({where : {nombre_curso : req.params.courseName, estado_curso : 1}, include : [{association : "classes"}]})
        .then( courseData => {
            if(courseData){
                let classData = []
                    for(let classInfo of courseData.classes){
                        classData.push({nombre_clase : classInfo.nombre_clase, descripcion_clase : classInfo.descripcion_clase })
                    }
                res.render("landing/curso-amarse", {courseData, classData})
            } else {
                res.redirect("/")
            }

        })
    }
}

module.exports = landingController;