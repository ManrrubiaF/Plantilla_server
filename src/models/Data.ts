import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";


class Data extends Model {
    public id!:number;
    public aboutText!: string;
    public videos!: JSON;
    public photos!:JSON;
    public phone!:number;
    public whatsapp!:number;
    public socialLinks!:JSON;
    public email!:string;

}

Data.init({
        id:{
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        aboutText:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        videos: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        photos: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        phone: {
            type: DataTypes.NUMBER,
            allowNull: true
        },
        whatsapp: {
            type: DataTypes.NUMBER,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        socialLinks: {
            type: DataTypes.JSONB,
            allowNull: true
        }
    },{
        sequelize,
        modelName: 'Data'
    }
    
)

export default Data;
   
