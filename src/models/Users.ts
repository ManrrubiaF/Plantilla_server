import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db';

class User extends Model {
  public id!: number;
  public email!: string;
  public pass!: string;
  public name!: string;
  public lastName!: string;
  public phone!: number;
  public access!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly destroyTime!: Date | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
    },
    createdAt: {
      type: DataTypes.DATE, // Tipo de datos para createdAt
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE, // Tipo de datos para updatedAt
      allowNull: false,
    },
    destroyTime: {
      type: DataTypes.DATE, // Tipo de datos para destroyTime (paranoid)
    },
  },
  {
    sequelize, 
    modelName: 'User', 
    paranoid: true, 
    timestamps: true, 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt', 
    deletedAt: 'destroyTime',
  }
);

export default User;
