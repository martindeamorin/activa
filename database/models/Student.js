module.exports = function(sequelize, dataTypes){
    let alias = "Student";
    let cols = {
        id: {
            type: dataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            "allowNull" : false
        },
        nombre_alumno: {
            type: dataTypes.STRING(50),
            "allowNull" : false
        },
        apellido_alumno: {
            type: dataTypes.STRING(50),
            "allowNull" : false
        },
        email_alumno: {
            type: dataTypes.STRING(50),
            "allowNull" : false
        },
        contrasena: {
            type: dataTypes.CHAR(60),
            "allowNull" : false
        },
        dni: {
            type: dataTypes.INTEGER(10),
            "allowNull" : false
        },
        estado_alumno : {
            type : dataTypes.BOOLEAN,
            "allowNull" : false,
        },
        tipo_usuario: {
            type: dataTypes.STRING(50),
            "allowNull" : false
        },
        recuperar_contraseña : {
            type : dataTypes.CHAR(6)
        },
        newsletter : {
            type : dataTypes.BOOLEAN
        },
        created_at: {
            type: dataTypes.DATE(),
            "allowNull" : false
        },
        updated_at: {
            type: dataTypes.DATE(),
            "allowNull" : false
        }
    }

    let config = {
        "tableName": "alumno",
        "underscored" : true,
        "createdAt" : "created_at",
        "updatedAt" : "updated_at"
    }

    let Student = sequelize.define(alias, cols, config)
    Student.associate = function(models){

        Student.belongsToMany(models.Course, {
            as:"courses",
            through: "CourseStudent",
            foreignKey: "alumno_id",
            otherKey: "curso_id"
        })

        Student.belongsToMany(models.Class, {
            as:"classes",
            through: "StudentClass",
            foreignKey: "alumno_id",
            otherKey: "clase_id"
        })
    }

    return Student
    }
