import server from "./src/server";
import { sequelize } from "./src/db";
const PORT = 3001;
import routes from "./src/routes";
//const { firstload } = require('./src/utils/countries')

server.use('/', routes);

sequelize.sync({force:false}).then(() => {
  //firstload();
  server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  })
}).catch((error:Error) => console.error(error))

