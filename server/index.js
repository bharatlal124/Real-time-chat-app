require("dotenv").config();

const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const Message = require("./models/message"); // Import Message model
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
const router = require("./router");
const path = require("path");

const uploadRoute = require("./routes/upload");
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  // cors: { origin: "http://localhost:3000", credentials: true },
  origin: ["http://localhost:3000", "https://bharat-chat-app.vercel.app"], // ✅ Add your Vercel frontend domain here
  credentials: true,
});

app.use(cors());
app.use(router);

// 🔌 Connect to MongoDB
mongoose
  .connect(process.env.Mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Serve static image files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Add the image upload route
app.use("/api/upload", uploadRoute);
// app.use("/uploads", express.static("uploads"));

// 🎯 Real-time socket handling
// io.on("connection", (socket) => {
//   console.log("New connection:", socket.id);

//   socket.on("join", ({ name, room }, callback) => {
//     if (!name || !room) return callback("Username and room are required.");

//     const { error, user } = addUser({ id: socket.id, name, room });

//     if (error) return callback(error);

//     socket.join(user.room);

//     socket.emit("message", {
//       user: "Admin",
//       text: `${user.name}, welcome to room ${user.room}.`,
//     });

//     socket.broadcast
//       .to(user.room)
//       .emit("message", { user: "Admin", text: `${user.name} has joined!` });

//     io.to(user.room).emit("roomData", {
//       room: user.room,
//       users: getUsersInRoom(user.room),
//     });

//     callback();
//   });

//   socket.on("sendMessage", async (message, callback) => {
//     const user = getUser(socket.id);
//     if (!user) return callback("User not found.");

//     const newMessage = new Message({
//       user: user.name,
//       room: user.room,
//       text: message,
//     });

//     try {
//       await newMessage.save(); // 💾 Save to MongoDB
//     } catch (error) {
//       console.error("Failed to save message:", error);
//     }

//     io.to(user.room).emit("message", { user: user.name, text: message });

//     callback();
//   });

//   socket.on("disconnect", () => {
//     const user = removeUser(socket.id);

//     if (user) {
//       io.to(user.room).emit("message", {
//         user: "Admin",
//         text: `${user.name} has left.`,
//       });

//       io.to(user.room).emit("roomData", {
//         room: user.room,
//         users: getUsersInRoom(user.room),
//       });
//     }

//     console.log("User disconnected:", socket.id);
//   });
// });

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // ✅ Add this handler for sendMessage
  // socket.on('sendMessage', (data, callback) => {
  //   const user = getUser(socket.id);

  //   if (user) {
  //     io.to(user.room).emit('message', {
  //       user: user.name,
  //       text: data.text || '',
  //       image: data.image || null,
  //     });
  //   }

  //   callback();
  // });

  socket.on('sendMessage', async ({ text, image }, callback) => {
    const user = getUser(socket.id);
  
    const messageData = {
      user: user.name,
      text: text || '',
      image: image || null,
      room: user.room,
      time: new Date()
    };
  
    // Save to MongoDB
    await MessageModel.create(messageData);  // Assuming MessageModel is your Mongoose model
  
    io.to(user.room).emit('message', messageData);
    callback();
  });
  

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
