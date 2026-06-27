import express from "express";
import Chat from "../models/chat.models.js";
import { protect } from "../middleware/auth.middleware.js";

const chatRouter = express.Router(); // ✅ FIX 1: chatRouter was never declared

chatRouter.use(protect);

// to create a chat
chatRouter.post("/start", async (req, res) => {
    try {
        const { propertyId, sellerId, buyerId: provideBuyerId } = req.body;
        let buyerId, finalSellerId;

        if (req.user.role === "seller") {
            buyerId = provideBuyerId;
            finalSellerId = req.user._id;
        } else {
            buyerId = req.user._id;
            finalSellerId = sellerId;
        }

        if (!buyerId || !finalSellerId) { // ✅ FIX 2: was missing '!' before finalSellerId
            return res.status(400).json({
                message: "Missing buyer or seller Id"
            });
        }

        let chat = await Chat.findOne({
            buyer: buyerId,
            seller: finalSellerId
        });

        if (!chat) { // ✅ FIX 3: was 'if(!client)' — wrong variable name
            chat = await Chat.create({
                property: propertyId,
                buyer: buyerId,
                seller: finalSellerId,
                messages: []
            });
        }

        chat = await Chat.findById(chat._id)
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images");

        res.json(chat);
    } catch (error) {
        res.status(500).json({
            message: "Error creating chat or getting previous one",
            error: error.message
        });
    }
});

// to send message
chatRouter.post("/send", async (req, res) => {
    try {
        const { chatId, text, image } = req.body;
        const userId = req.user._id; // ✅ FIX 4: was req.user.id — inconsistent, use ._id

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({
            message: "Chat not found"
        });

        // ✅ FIX 5: was only checking buyer, sellers couldn't send messages
        if (chat.buyer.toString() !== userId.toString() &&
            chat.seller.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Not authorized to send message in this chat"
            });
        }

        const newMessage = {
            sender: userId,
            text,
            image,
            createdAt: new Date()
        };

        chat.messages.push(newMessage); // ✅ FIX 6: was chat.message.push — wrong field name
        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];
        res.json({ chat, newMessage: savedMessage }); // ✅ FIX 7: was 'saveMessage' — typo
    } catch (error) {
        res.status(500).json({
            message: "Error sending message",
            error: error.message
        });
    }
});

// to get chats for user
chatRouter.get("/user", async (req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({
            $or: [{ buyer: userId }, { seller: userId }]
        })
            .populate("buyer", "name email profilePic")
            .populate("seller", "name email profilePic")
            .populate("property", "title price images")
            .sort({ updatedAt: -1 }); // ✅ FIX 8: was a stray semicolon after .populate() breaking the chain

        res.json(chats);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user chats",
            error: error.message
        });
    }
});

// to get chat messages
chatRouter.get("/:chatId", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).populate(
            "messages.sender", // ✅ FIX 9: was "message.sender" — wrong field name
            "name profilePic"
        );
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const userId = req.user._id.toString();
        if (chat.buyer.toString() !== userId && chat.seller.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized"
            });
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching chat messages",
            error: error.message
        });
    }
});

// to delete an entire chat
chatRouter.delete("/:chatId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        if (chat.buyer.toString() !== userId.toString() &&
            chat.seller.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Chat.findByIdAndDelete(req.params.chatId);
        res.json({ message: "Chat deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting chat",
            error: error.message
        });
    }
});

// to delete a specific message
chatRouter.delete("/:chatId/message/:messageId", async (req, res) => {
    try {
        const userId = req.user._id;
        const chat = await Chat.findById(req.params.chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const message = chat.messages.id(req.params.messageId); // ✅ FIX 10: was chat.message.id(reqparams.messageId) — wrong field + missing dot
        if (!message) return res.status(404).json({ message: "Message not found" });

        if (message.sender.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Not authorized to delete this message"
            });
        }

        chat.messages.pull(req.params.messageId); // ✅ consistent: messages not message
        await chat.save();
        res.json({ message: "Message deleted successfully", chat });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting message",
            error: error.message
        });
    }
});

export default chatRouter; // ✅ added missing export