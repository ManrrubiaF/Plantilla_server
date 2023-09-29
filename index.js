"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./src/server"));
const db_1 = require("./src/db");
const PORT = 3001;
const routes_1 = __importDefault(require("./src/routes"));
//import firstload from "./src/utils/firstload";
server_1.default.use('/', routes_1.default);
server_1.default.get('/', (req, res) => {
    res.send('¡Bienvenido al servidor estándar!');
});
db_1.sequelize.sync({ force: false }).then(() => {
    //firstload();
    server_1.default.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}).catch((error) => console.error(error));
