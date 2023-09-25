import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";


class Booking extends Model{
    public id!:number;
    public userId!:Number;
    public productId!: Number;
    public stock!:JSON;

}

Booking.init(
    {
        id: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
               model: 'User',
               key: 'id'
            }
        },
        productId: {
            type: DataTypes.NUMBER,
            allowNull: false,
            references: {
                model: 'Product',
                key: 'id'
            }
            
        },
        stock: {
            type: DataTypes.JSONB,
            allowNull: false
        },
    },{
        sequelize,
        modelName: 'Booking',
        paranoid:true,
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'destroyTime',
    }
);

export default Booking;
