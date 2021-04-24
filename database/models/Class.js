module.exports = function(sequelize, dataTypes){
    let alias = "Class";
    let cols = {
        id: {
            type: dataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            "allowNull" : false
        },
        nombre_clase : {
            type : dataTypes.STRING(50),
            "allowNull" : false
        },
        fecha : {
            type : dataTypes.DATEONLY,
        },
        estado_clase : {
            type : dataTypes.BOOLEAN,
            "allowNull" : false
        },
        link_clase : {
            type : dataTypes.STRING(100)
        },
        contrasena_clase : {
            type : dataTypes.STRING(50)
        },
        curso_id : {
            type : dataTypes.BIGINT.UNSIGNED,
            "allowNull" : false
        },

        descripcion_clase : {
            type : dataTypes.STRING(150)
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
        "tableName": "clase",
        "underscored" : true,
        "createdAt" : "created_at",
        "updatedAt" : "updated_at"
    }

    let Class = sequelize.define(alias, cols, config)
    Class.associate = function(models){

        Class.belongsTo(models.Course,{
            as : "course",
            foreignKey: "curso_id"
        })

        Class.hasMany(models.File,{
            as : "files",
            foreignKey: "clase_id"
        })

        Class.belongsToMany(models.Student, {
            as:"students",
            through: "StudentClass",
            foreignKey: "clase_id",
            otherKey: "alumno_id"
        })
    }

    return Class
    }