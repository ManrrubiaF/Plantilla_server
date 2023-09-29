import server from "./src/server";
import { sequelize } from "./src/db";
const PORT = 3001;
import { Request,Response } from "express";
import routes from "./src/routes";
//const { firstload } = require('./src/utils/countries')

server.use('/', routes);
server.get('/', (req: Request, res: Response) => {
  res.send('¡Bienvenido al servidor estándar!');
});

sequelize.sync({force:true}).then(() => {
  //firstload();
  server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  })
}).catch((error:Error) => console.error(error))

