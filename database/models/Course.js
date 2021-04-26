module.exports = function(sequelize, dataTypes){
    let alias = "Course";
    let cols = {
        id: {
            type: dataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            "allowNull" : false
        },
        nombre_curso : {
            type : dataTypes.STRING(50),
            "allowNull" : false
        },
        instructora : {
            type : dataTypes.STRING(100)
        },
        fecha_inicio : {
            type : dataTypes.DATEONLY,
        },
        fecha_final : {
            type : dataTypes.DATEONLY,
        },
        costo_curso : {
            type : dataTypes.INTEGER
        },
        costo_pesos : {
            type : dataTypes.INTEGER
        },
        descripcion_curso : {
            type : dataTypes.TEXT
        },
        destacar : {
            type : dataTypes.BOOLEAN
        },
        estado_curso : {
            type : dataTypes.BOOLEAN,
            "allowNull" : false
        },
        dia_curso : {
            type : dataTypes.STRING(30)
        },
        hora_curso :{
            type : dataTypes.TIME
        },
        descripcion_corta : {
            type : dataTypes.STRING(150)
        },
        imagen_curso : {
            type : dataTypes.STRING(100)
        },
        imagen_landing : {
            type : dataTypes.STRING(100)
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
        "tableName": "curso",
        "underscored" : true,
        "createdAt" : "created_at",
        "updatedAt" : "updated_at"
    }

    let Course = sequelize.define(alias, cols, config)
    Course.associate = function(models){
        Course.hasMany(models.Class,{
            as : "classes",
            foreignKey: "curso_id"
        })
        Course.belongsToMany(models.Student, {
            as:"students",
            through: "CourseStudent",
            foreignKey: "curso_id",
            otherKey: "alumno_id"
        })
    }

    return Course
    }
