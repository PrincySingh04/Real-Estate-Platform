import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/properties.route.js";
import inquiryRouter from "./routes/inquiry.route.js";
// ✅ FIX 1: removed wrong import of wishlist MODEL — not needed in server.js
import wishlistRouter from "./routes/wishlist.route.js";
import contactRouter from "./routes/contacts.route.js";
import adminRouter from './routes/admin.route.js';
import chatRouter from "./routes/chat.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
    "https://real-estate-platform-frontend-mu.vercel.app/",
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/property", propertyRouter);
app.use("/api/inquiry", inquiryRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
    res.send("API is working");
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id); // ✅ FIX 2: added connection log

    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
    });

    socket.on("sendMessage", (data) => {
        io.to(data.chatId).emit("receivedMessage", data);
    });

    socket.on("disconnect", () => { // ✅ FIX 3: was "disconnected" — correct event is "disconnect"
        console.log("User disconnected:", socket.id); // ✅ FIX 4: empty handler, added log
    });
});

server.listen(PORT, () => {
    console.log(`Server Started on http://localhost:${PORT}`);
});