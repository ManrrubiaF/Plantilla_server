import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import User from './models/Users';
import Product from './models/Products';
import Booking from './models/Booking';
import Data from './models/Data';

require('dotenv').config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_NAME
} = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
  logging: false,
  native: false,
});

const basename = path.basename(__filename);

const modelDefiners: ((sequelize: typeof Sequelize) => void)[] = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts'))
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, '/models', file));
    if (typeof modelDefiner === 'function') {
      modelDefiners.push(modelDefiner);
    }
  });

Booking.belongsTo(User, {foreignKey: 'userId'})
Booking.belongsTo(Product, {foreignKey: 'productId'})
User.hasMany(Booking, { foreignKey: 'userId' });



export {
  sequelize,
  User,
  Product,
  Booking,
  Data
};
