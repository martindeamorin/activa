module.exports = function(sequelize, dataTypes){
    let alias = "CourseStudent";
    let cols = {
        id: {
            type: dataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            "allowNull" : false
        },

        curso_id: {
            type: dataTypes.BIGINT.UNSIGNED,
            references: {
                model: 'Course',
                key: 'id'
            }
        },
        alumno_id: {
            type: dataTypes.BIGINT.UNSIGNED,
            references: {
                model: 'Student',
                key: 'id'
            }
        },
        pago_identificador : {
            type : dataTypes.STRING(50)
        },
        estado_pago :{
            type : dataTypes.STRING(50)
        },
        fecha_pago : {
            type : dataTypes.DATE
        },
        plataforma_pago : {
            type : dataTypes.STRING(50)
        },
        total_pago: {
            type: dataTypes.STRING(50),
        },
        neto_pago: {
            type: dataTypes.STRING(50),
        },
        id_comprador : {
            type: dataTypes.STRING(50),
        },
        id_preferencia : {
            type : dataTypes.STRING(300)
        },
        cancelado : {
            type : dataTypes.STRING(10)
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
        "tableName": "curso_alumno",
        "underscored" : true,
        "createdAt" : "created_at",
        "updatedAt" : "updated_at"
    }
    let CourseStudent = sequelize.define(alias, cols, config)

    CourseStudent.associate = function(models){
        CourseStudent.belongsTo(models.Course,{
            foreignKey: "curso_id",
            as : "course"
        })
        
        CourseStudent.belongsTo(models.Student,{
            foreignKey: "alumno_id",
            as :"student"
        })
    }   


    return CourseStudent
    }