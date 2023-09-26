import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

class Product extends Model {
    public id!: number;
    public price!: string;
    public name!: string;
    public description!: string;
    public photo!: JSON;
    public stock!: {
        [color: string]: number;
      };
    public active!: Boolean;
    public type!: string;

}

Product.init(
    {
        id: {
            type: DataTypes.NUMBER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        photo: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        stock: {
            type: DataTypes.JSONB,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Product',
        paranoid: true,
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'destroyTime',
    }
);

export default Product;