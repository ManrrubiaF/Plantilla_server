const express = require("express");
import routerr from './routes'
const morgan = require("morgan");
const cors = require("cors");

const server = express()

server.use(morgan("dev"));
server.use(express.json());
server.use(cors());
server.use(routerr);
    
export default server;
