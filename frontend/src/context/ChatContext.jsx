import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { token, user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const pollRef = useRef(null);

    const fetchConversations = useCallback(async () => {
        if (!token) return;
        try {
            setLoadingConversations(true);
            const res = await axios.get(`${API_URL}/api/chat/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const chats = res.data || [];
            const convos = chats.map(chat => {
                const isBuyer = chat.buyer?._id?.toString() === user?._id?.toString();
                const partner = isBuyer ? chat.seller : chat.buyer;
                const lastMsg = chat.messages?.[chat.messages.length - 1];
                return {
                    chatId: chat._id,
                    partnerId: partner?._id,
                    partnerName: partner?.name,
                    partnerAvatar: partner?.profilePic,
                    lastMessage: lastMsg?.text || '',
                    property: chat.property,
                    
                    buyer: chat.buyer,
                    seller: chat.seller,
                    isBuyer: isBuyer,
                };
            });
            setConversations(convos);
        } catch (err) {
            console.error("Failed to fetch conversations:", err);
        } finally {
            setLoadingConversations(false);
        }
    }, [token, user]);

    const fetchMessages = useCallback(async (chatId) => {
        if (!token || !chatId) return;
        try {
            const res = await axios.get(`${API_URL}/api/chat/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data.messages || []);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    }, [token]);

    const selectConversation = useCallback((conversation) => {
        setActiveConversation(conversation);
        fetchMessages(conversation.chatId);
    }, [fetchMessages]);

    const startConversation = useCallback(async (sellerId, property) => {
        if (!token || !sellerId) return;
        try {
            const res = await axios.post(`${API_URL}/api/chat/start`, {
                sellerId,
                propertyId: property?._id,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const chat = res.data;
            const isBuyer = chat.buyer?._id?.toString() === user?._id?.toString();
            const partner = isBuyer ? chat.seller : chat.buyer;

            const convo = {
                chatId: chat._id,
                partnerId: partner?._id,
                partnerName: partner?.name,
                partnerAvatar: partner?.profilePic,
                property: chat.property,
                propertyTitle: property?.title,
            
                buyer: chat.buyer,
                seller: chat.seller,
                isBuyer: isBuyer,
            };

            setActiveConversation(convo);
            setMessages(chat.messages || []);
            fetchConversations();

            // Context message bhejo with actual title
            if (property?._id && property?.title) {
                const sendRes = await axios.post(`${API_URL}/api/chat/send`, {
                    chatId: chat._id,
                    text: `Context: Interested in property "${property.title}"`,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const newMsg = sendRes.data.newMessage;
                if (newMsg) setMessages(prev => [...prev, newMsg]);
            }
        } catch (err) {
            console.error("Failed to start conversation:", err);
        }
    }, [token, user, fetchConversations]);

    const sendMessage = useCallback(async ({ text }) => {
        if (!token || !activeConversation?.chatId) return;
        try {
            const res = await axios.post(`${API_URL}/api/chat/send`, {
                chatId: activeConversation.chatId,
                text,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const newMessage = res.data.newMessage;
            if (newMessage) setMessages(prev => [...prev, newMessage]);
            fetchConversations();
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    }, [token, activeConversation, fetchConversations]);

    const deleteMessage = useCallback(async (messageId) => {
        if (!token || !activeConversation?.chatId) return;
        try {
            await axios.delete(
                `${API_URL}/api/chat/${activeConversation.chatId}/message/${messageId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => prev.filter(m => m._id !== messageId));
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    }, [token, activeConversation]);

    const deleteConversation = useCallback(async (chatId) => {
        if (!token) return;
        try {
            await axios.delete(`${API_URL}/api/chat/${chatId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConversations(prev => prev.filter(c => c.chatId !== chatId));
            if (activeConversation?.chatId === chatId) {
                setActiveConversation(null);
                setMessages([]);
            }
        } catch (err) {
            console.error("Failed to delete conversation:", err);
        }
    }, [token, activeConversation]);

    const stopPolling = useCallback(() => {
        if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
        }
    }, []);

    const startPolling = useCallback((chatId) => {
        stopPolling();
        pollRef.current = setInterval(() => {
            fetchMessages(chatId);
        }, 4000);
    }, [fetchMessages, stopPolling]);

    return (
        <ChatContext.Provider value={{
            conversations,
            activeConversation,
            messages,
            loadingConversations,
            fetchConversations,
            fetchMessages,
            selectConversation,
            startConversation,
            sendMessage,
            deleteMessage,
            deleteConversation,
            startPolling,
            stopPolling,
            setActiveConversation,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);