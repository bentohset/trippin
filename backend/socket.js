const { Server } = require('socket.io');
const { saveTrip } = require('./utils')

const connections = new Set();

exports.configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("SocketIO connected on server side: ", socket.id);
        connections.add(socket)

        

        socket.on('joinTrip', ({ tripId, userId }) => {
            socket.join(tripId)
            console.log(`SocketIO user ${userId} joined trip ${tripId}`)
        })

        socket.on('leaveTrip', ({ tripId }) => {
            socket.leave(tripId)
            console.log(`SocketIO user left trip ${tripId}`)
        })

        socket.on('updateData', async ({ tripId, userId, updatedData}) => {
            
            try {
                await saveTrip(tripId, updatedData)
                socket.to(tripId).emit('updateData', updatedData)
                console.log(`SocketIO user left trip ${tripId}`)
            } catch(error) {
                console.log(error.message)
            }
            
            console.log(`SocketIO user ${userId} updated trip ${tripId} data`)
        })

        socket.on("disconnect", (socket) => {
            console.log("SocketIO disconnected on server side: ", socket.id);
            connections.delete(socket)
        })
    })

    return io
}

exports.disconnectAllUsers = () => {
    connections.forEach((socket) => {
        console.log("SocketIO disconnected: ", socket.id);
        socket.disconnect(true); // Pass true to close the connection gracefully
    });
    console.log('SocketIO disconnected all users')
}