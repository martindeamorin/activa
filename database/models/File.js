module.exports = function(sequelize, dataTypes){
    let alias =  "File";
    let cols = {
        id: {
            type: dataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            "allowNull" : false
        },
        ruta_archivo : {
            type : dataTypes.STRING(800),
            "allowNull" : false
        },
        tipo_archivo : {
            type : dataTypes.STRING(100),
            "allowNull" : false
        },
        clase_id : {
            type : dataTypes.BIGINT.UNSIGNED,
            "allowNull" : false
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
        "tableName": "archivo",
        "underscored" : true,
        "createdAt" : "created_at",
        "updatedAt" : "updated_at"
    }

    let File = sequelize.define(alias, cols, config)
    File.associate = function(models){

        File.belongsTo(models.Class,{
            as : "class",
            foreignKey: "clase_id"
        })
    }

    return File
}