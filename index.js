const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const cors = require("cors"); // Import the CORS middleware

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* options */
});
// getting-started.js

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb+srv://Chandan_Sharma:HakZhXhSvIDcD9FS@cluster0.wyf30.mongodb.net/test');
  console.log("DB connected")

}

app.use(cors());
require('./socket')(io)
app.get('/', (req, res) => {
    res.send('hello data')
})

httpServer.listen(8080, () => console.log("Server running on port 8080"));
