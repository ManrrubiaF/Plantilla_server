import {Sequelize} from 'sequelize-typescript';
import { User } from './models/User';
import { Product } from './models/Product';
import { Booking } from './models/Booking';
import { Data }from './models/Data';
import { ProductDetail } from './models/ProductDetail';
import config from './lib/config'


const sequelize = new Sequelize({
  dialect:'postgres',
  database:config.DB_NAME,
  password:config.DB_PASSWORD,
  username: config.DB_USER,
  storage:':memory:',
  models:[__dirname + '/models'],
  logging: false,
});


/*const basename = path.basename(__filename);

const modelDefiners: ((sequelize: typeof Sequelize) => void)[] = [];

fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts'))
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, '/models', file));
    if (typeof modelDefiner === 'function') {
      modelDefiners.push(modelDefiner);
    }
  });

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.afterInit = Object.fromEntries(capsEntries);*/

Booking.belongsTo(User, { foreignKey: 'userId' })
Booking.belongsTo(Product, { foreignKey: 'productId' })
User.hasMany(Booking, { foreignKey: 'userId' });



export {
  sequelize,
  User,
  Product,
  Booking,
  Data,
  ProductDetail
};
