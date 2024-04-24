const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PORT } = require("./src/config/config");
const connectDb = require("./src/db/db");
const routerUser = require("./src/routes/user.routes");
const emailRoutes = require("./src/routes/email.routes");
const tokenRoutes = require("./src/routes/token.routes");
const app = express();
app.use(cors());
app.use(express.json());

connectDb();

app.use("/api", routerUser);
app.use("/api", emailRoutes);
app.use("/api", tokenRoutes);
app.get("/", async (req, res) => {
  res.json("Hello World");
});

app.listen(PORT, () => console.log(`Server runing at PORT ${PORT}`));

// const express = require('express')
// const cors = require('cors')
// require('dotenv').config();
// const {PORT}=require('./src/config/config')
// const routerUser = require('./src/routes/user.routes')
// const connectDb = require('./src/db/db');
// const emailRoutes = require('./src/routes/email.routes');
// const tokenRoutes = require('./src/routes/token.routes');
// const studentRoutes = require('./src/routes/student.routes')
// const jobRoutes = require('./src/routes/job.routes')
// const applicationRoutes = require('./src/routes/application.routes')
// const hiringRoutes = require('./src/routes/hiring.routes')
// const companyRoutes = require('./src/routes/company.routes')
// const {Server} = require('socket.io')

// const app = express()
// app.use(cors())
// app.use(express.json())

// connectDb()
// //routes
// app.use('/api',routerUser)
// app.use('/api',companyRoutes)
// app.use('/api',hiringRoutes)
// app.use('/api',applicationRoutes)
// app.use('/api',studentRoutes)
// app.use('/api',jobRoutes)
// app.use('/api',emailRoutes)
// app.use('/api',tokenRoutes)
// app.get("/",async (req, res) => {
//   res.json('Hello World');
// });
// const server =  app.listen(PORT, () => console.log(`Server runing at PORT ${PORT}`));

// const io = new Server(server, {
//   cors: { origin: '*' },
//   transports: ['websocket']
// });
// io.on('connect',(socket)=>{
//   socket.on('statusChanged', ( id,status)=>{
//     socket.emit('updatedStatus',id,status);
//     socket.broadcast.emit('updatedStatus',id,status)
// });

// })
