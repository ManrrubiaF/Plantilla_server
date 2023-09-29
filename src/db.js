"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDetail = exports.Data = exports.Booking = exports.Product = exports.User = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./models/User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Product_1 = require("./models/Product");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return Product_1.Product; } });
const Booking_1 = require("./models/Booking");
Object.defineProperty(exports, "Booking", { enumerable: true, get: function () { return Booking_1.Booking; } });
const Data_1 = require("./models/Data");
Object.defineProperty(exports, "Data", { enumerable: true, get: function () { return Data_1.Data; } });
const ProductDetail_1 = require("./models/ProductDetail");
Object.defineProperty(exports, "ProductDetail", { enumerable: true, get: function () { return ProductDetail_1.ProductDetail; } });
const config_1 = __importDefault(require("./lib/config"));
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    database: config_1.default.DB_NAME,
    password: config_1.default.DB_PASSWORD,
    username: config_1.default.DB_USER,
    storage: ':memory:',
    models: [__dirname + '/models'],
    logging: false,
});
exports.sequelize = sequelize;
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
Booking_1.Booking.belongsTo(User_1.User, { foreignKey: 'userId' });
Booking_1.Booking.belongsTo(Product_1.Product, { foreignKey: 'productId' });
User_1.User.hasMany(Booking_1.Booking, { foreignKey: 'userId' });
