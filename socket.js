const user = require('./models/user.js')

module.exports = (io)=> {
    io.use((socket, next) => {
        const { token } = socket.handshake.auth;
        if (!token) {
            return next(new Error("Authentication failed"));
        }
        next();
    });

    io.on("connection", async (socket) => {
        console.log('user connected', socket.id)
        socket.on("joinRoom", async(roomName) => {
            socket.join(roomName.room);
        });
    
        socket.on("sendMessage", (data) => {
            const { room, message } = data;
            io.to(room).emit("message", {message:message});
        });

        socket.on("createUser",async(data)=>{
            try {
                let users = await user.findOne({name :data.name})
                if(users){
                    throw new Error("already exist")
                }
               await user.create(data)
               io.to(socket.id).emit('createUser',"Create successfully") 
            } catch (error) {
              io.to(socket.id).emit('createUser',error.message) 
            }
        })

        socket.on('list',async()=>{
            let users =await user.find()
            io.to(socket.id).emit('list',users) 
        })
    
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

}