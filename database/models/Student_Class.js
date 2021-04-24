module.exports = function(sequelize, dataTypes){
    let alias = "StudentClass";
    let cols = {
        id: {
            type: dataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            "allowNull" : false
        },

        alumno_id: {
            type: dataTypes.BIGINT.UNSIGNED,
            references: {
                model: 'Student',
                key: 'id'
            }
        },
        clase_id: {
            type: dataTypes.BIGINT.UNSIGNED,
            references: {
                model: 'Class',
                key: 'id'
            }
        },
        // visto : {
        //     type : dataTypes.BOOLEAN
        // },
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
        "tableName": "alumno_clase",
        "underscored" : true,
        "createdAt" : "created_at",
        "updatedAt" : "updated_at"
    }
    let StudentClass = sequelize.define(alias, cols, config)

    StudentClass.associate = function(models){
        StudentClass.belongsTo(models.Student,{
            as : "student",
            foreignKey: "alumno_id"
        })
        
        StudentClass.belongsTo(models.Class,{
            as : "class",
            foreignKey: "clase_id"
        })
    }   


    return StudentClass
    }