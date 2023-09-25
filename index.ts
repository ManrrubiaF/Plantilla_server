const app = require("./src/server");
const { conn } = require('./src/db.js');
const PORT = 3001;
const routes = require('./src/routes/index.js');
//const { firstload } = require('./src/utils/countries')

app.use('/', routes);

conn.sync({ force: false }).then(() => {
  //firstload();
  app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  })
}).catch((error:Error) => console.error(error))

