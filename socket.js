const store = require('./models/store.js')

module.exports = (io)=> {
    io.on("connect", async (socket) => {
        console.log('user connected', socket.id)
        socket.on("joinRoom", async(roomName) => {
            socket.join(roomName.room);
        });

        socket.on("getList",async()=>{
            const data = await store.find().sort({_id:'desc'});
            io.to(socket.id).emit('getList',data) 
        })

        socket.on("add",async(data)=>{
        // we can make the file upload api and get the name and file path on frontend 
        // we can apply the validation 
            const datas = await store.create(data)
            io.to(socket.id).emit('add',datas) 
        })

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