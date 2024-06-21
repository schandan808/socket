const store = require('./models/store.js');
const user = require('./models/user.js'); // Make sure to require the user model

module.exports = (io) => {
  io.on("connect", (socket) => {
    console.log('user connected', socket.id);

    socket.on("joinRoom", async (roomName) => {
      try {
      const {room}= roomName
       socket.join(room);
        io.to(room).emit("joinRoom",{room});
      } catch (error) {
        socket.emit('error', { message: error.message });
      } const {room} = roomName
        
    });

    socket.on("getList", async () => {
      try {
        const data = await store.find().sort({ _id: 'desc' }).limit(10);
        io.to(socket.id).emit('getList', data);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on("add", async (data) => {
      try {
        const datas = await store.create(data);
        io.to(socket.id).emit('add', datas);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on("sendMessage", (data) => {
      try {
        const { room, message } = data;
        io.to(room).emit("message", { message });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on("createUser", async (data) => {
      try {
        let users = await user.findOne({ name: data.name });
        if (users) {
          throw new Error("User already exists");
        }
       const ss=  await user.create(data);

        io.to(socket.id).emit('createUser', "User created successfully");
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('list', async () => {
      try {
        let users = await user.find().sort({ _id: 'desc' }).limit(10);
        io.to(socket.id).emit('list', users);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}
