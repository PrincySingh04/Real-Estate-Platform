import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { chatMessagesStyles as s } from '../../assets/dummyStyles';
import Navbar from '../../components/common/Navbar';
import {
    HiChatAlt,
    HiTrash,
    HiArrowLeft,
    HiPaperAirplane,
    HiHome,
} from 'react-icons/hi';

const ChatMessages = () => {
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const {
        conversations,
        activeConversation,
        messages,
        loadingConversations,
        fetchConversations,
        selectConversation,
        startConversation,
        sendMessage,
        deleteMessage,
        deleteConversation,
        startPolling,
        stopPolling,
    } = useChat();

    const [messageText, setMessageText] = useState("");
    const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const sellerId = searchParams.get("sellerId");
        const propertyId = searchParams.get("propertyId");
        const propertyTitle = searchParams.get("propertyTitle");
        if (sellerId) {
            startConversation(sellerId, propertyId ? { _id: propertyId, title: propertyTitle } : null);
            setShowSidebarOnMobile(false);
        }
    }, [searchParams]);

    useEffect(() => {
        if (activeConversation?.chatId) {
            startPolling(activeConversation.chatId);
        }
        return () => stopPolling();
    }, [activeConversation?.chatId]);

    const handleSelectConversation = (conversation) => {
        selectConversation(conversation);
        setShowSidebarOnMobile(false);
    };

    const handleBackToList = () => {
        setShowSidebarOnMobile(true);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !activeConversation) return;
        sendMessage({ receiverId: activeConversation.partnerId, text: messageText.trim() });
        setMessageText("");
    };

    const handleDeleteConversation = (e, conv) => {
        e.stopPropagation();
        if (!window.confirm("Delete this conversation?")) return;
        deleteConversation(conv.chatId);
    };

    const isSeller = user?.role === "seller";

    return (
        <div className={`${s.chatContainer} ${isSeller ? s.chatContainerSeller : s.chatContainerNonSeller}`}>
            {!isSeller && <Navbar />}
            <div className={s.chatWrapper}>
                {/* Sidebar */}
                <div className={`${s.sidebar} ${!showSidebarOnMobile ? s.sidebarHidden : ""}`}>
                    <div className={s.sidebarHeader}>
                        <h2 className={s.sidebarTitle}>Messages</h2>
                    </div>
                    <div className={s.sidebarContent}>
                        {loadingConversations ? (
                            <div className="loader-full-page">
                                <div className="loader"></div>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className={s.emptyConversations}>
                                <HiChatAlt className={s.emptyIcon} />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.chatId}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`${s.conversationItem} ${activeConversation?.chatId === conv.chatId ? s.conversationItemActive : ""}`}
                                >
                                    <div className={s.avatar}>
                                        {conv.partnerAvatar ? (
                                            <img src={conv.partnerAvatar} alt={conv.partnerName} className={s.avatarImg} />
                                        ) : (
                                            conv.partnerName?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className={s.conversationInfo}>
                                        <div className={s.conversationName}>{conv.partnerName}</div>
                                        <div className={s.conversationPreview}>
                                            {conv.lastMessage || "Start the conversation"}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteConversation(e, conv)}
                                        className={s.deleteChatButton}
                                    >
                                        <HiTrash size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat area */}
                <div className={s.chatArea}>
                    {!activeConversation ? (
                        <div className={s.noChatSelected}>
                            <HiChatAlt className={s.noChatIcon} />
                            <p className={s.noChatTitle}>Your Messages</p>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    ) : (
                        <>
                            <div className={s.chatHeader}>
                                <div className={s.chatHeaderLeft}>
                                    <button onClick={handleBackToList} className={s.backButton}>
                                        <HiArrowLeft size={18} />
                                    </button>
                                    <div className={s.avatar}>
                                        {activeConversation.partnerAvatar ? (
                                            <img
                                                src={activeConversation.partnerAvatar}
                                                alt={activeConversation.partnerName}
                                                className={s.avatarImg}
                                            />
                                        ) : (
                                            activeConversation.partnerName?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className={s.chatPartnerName}>{activeConversation.partnerName}</span>
                                </div>
                            </div>

                            <div className={s.messagesArea}>
                                {messages.map((msg) => {
                                    const isOwn = msg.sender?._id === user?._id ||
                                        msg.sender === user?._id ||
                                        msg.senderId === user?._id;
                                    return (
                                        <div
                                            key={msg._id}
                                            className={`${s.messageBubble} ${isOwn ? s.messageOwn : s.messageOther}`}
                                        >
                                            <div className={s.messageContent}>
                                              {msg.text?.startsWith("Context:") ? (
    <div className="flex flex-col items-center gap-2 py-2 px-1 min-w-[160px]">
        <span className="text-xs opacity-90 text-center">
            {msg.text}
        </span>
        {activeConversation?.property?.images?.[0] ? (
            <img 
                src={activeConversation.property.images[0]} 
                alt="property"
                className="w-24 h-24 rounded-lg object-cover"
            />
        ) : (
            <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                <HiHome size={32} />
            </div>
        )}
    </div>
) : (
    <span className={s.messageText}>{msg.text}</span>
)}
                                                {isOwn && (
                                                    <button
                                                        onClick={() => deleteMessage(msg._id)}
                                                        className={s.deleteMessageButton}
                                                    >
                                                        <HiTrash size={12} />
                                                    </button>
                                                )}
                                            </div>
                                            <span className={s.messageTime}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <form onSubmit={handleSend} className={s.messageForm}>
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type a message..."
                                    className={s.messageInput}
                                />
                                <button type="submit" className={s.sendButton}>
                                    <HiPaperAirplane size={20} className={s.sendIcon} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessages;