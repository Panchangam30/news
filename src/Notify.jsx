// Notify.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiX } from "react-icons/fi";

const Notify = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const fetchChatHistory = async (article) => {
    setSelectedArticle(article);
    setChatMessage("");
    setChatHistory([]); // Clear existing history temporarily

    try {
      const response = await fetch(
        `http://localhost:5001/api/chat-history?title=${encodeURIComponent(
          article.title
        )}`
      );
      const data = await response.json();
      console.log("Fetched chat history:", data); // Debug log
      setChatHistory(data.history || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Fetch and sort notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/notifications");
        const data = await response.json();

        const sortedNotifications = (data.notifications || []).sort((a, b) => {
          const dateA = new Date(a.published_on || 0).getTime();
          const dateB = new Date(b.published_on || 0).getTime();
          return dateB - dateA;
        });

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setErrorMessage("Failed to fetch notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Scroll to the bottom of the chat container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleReply = (article) => {
    setSelectedArticle(article);
    setChatMessage("");
    setChatHistory([]);
    fetchChatHistory(article); // `article` must be passed here
  };

  const closeChatModal = () => {
    setSelectedArticle(null);
    setChatMessage("");
    setChatHistory([]);
  };

  const handleChat = async () => {
    if (!chatMessage.trim()) return;

    const updatedHistory = [
      ...chatHistory,
      { content: chatMessage, isUser: true }, // Updated format
    ];
    setChatHistory(updatedHistory);
    setChatMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedArticle?.title || "No Title",
          body: selectedArticle?.summary || "No Summary",
          url: selectedArticle?.url || "No URL",
          question: chatMessage,
        }),
      });

      const data = await response.json();

      const botMessage = data.error
        ? `Error: ${data.error}`
        : data.answer || "No response";

      const newHistory = [
        ...updatedHistory,
        { content: botMessage, isUser: false }, // Updated format
      ];
      setChatHistory(newHistory);

      // Save chat history to backend
      await fetch("http://localhost:5001/api/save-chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedArticle?.title || "No Title",
          history: newHistory, // Now contains { content, isUser }
        }),
      });
    } catch (error) {
      console.error("Error chatting with the bot:", error);
      setChatHistory((prev) => [
        ...prev,
        { content: "An error occurred. Please try again.", isUser: false }, // Updated format
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  return (
    <div className="flex min-h-screen text-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
        <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <motion.header
          className="flex items-center p-6 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <button
            onClick={() => navigate("/dash")}
            className="flex items-center gap-2 text-gray-400 transition-colors hover:text-blue-400"
          >
            <FiChevronLeft className="w-6 h-6" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <h1 className="relative mx-auto text-2xl font-bold text-transparent bg-blue-400 bg-clip-text right-[4%]">
            Notifications
          </h1>
        </motion.header>

        {/* Notifications Section */}
        <motion.main
          className="flex-1 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="text-center animate-pulse">
              <div className="w-48 h-12 mx-auto mb-4 bg-gray-700/50 rounded-xl"></div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-6 border border-gray-700/50 rounded-2xl bg-gray-800/50 backdrop-blur-lg"
                  >
                    <div className="h-48 mb-4 bg-gray-700/50 rounded-xl animate-pulse"></div>
                    <div className="w-3/4 h-4 mb-2 rounded bg-gray-700/50"></div>
                    <div className="w-1/2 h-3 mb-4 rounded bg-gray-700/50"></div>
                    <div className="h-8 rounded-lg bg-gray-700/50"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : errorMessage ? (
            <p className="text-center text-red-400">{errorMessage}</p>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-4 text-gray-500">No notifications found</div>
              <div className="animate-pulse">
                <div className="h-48 mb-4 bg-gray-700/50 rounded-xl"></div>
                <div className="w-3/4 h-4 mx-auto mb-2 rounded bg-gray-700/50"></div>
                <div className="w-1/2 h-4 mx-auto mb-2 rounded bg-gray-700/50"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden transition-all border group border-gray-700/50 bg-gray-800/50 backdrop-blur-lg rounded-2xl hover:border-blue-400/30"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 transition-opacity opacity-0 pointer-events-none bg-gradient-to-br from-blue-400/10 to-transparent group-hover:opacity-100" />
                  
                  <div className="p-6">
                    <img
                      src={notification.imageUrl || "https://via.placeholder.com/150"}
                      alt={notification.title}
                      className="object-cover w-full h-48 mb-4 rounded-xl"
                    />

                    <h3 className="mb-2 text-lg font-semibold text-blue-400">
                      {notification.title || "Untitled Notification"}
                    </h3>

                    <p className="mb-4 text-sm text-gray-400 line-clamp-3">
                      {notification.summary || "No summary available."}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <a
                        href={notification.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                      >
                        Read More 
                      </a>
                          <svg xmlns="http://www.w3.org/2000/svg" className="relative w-4 h-4 right-[15%] text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                      <span className="text-xs text-gray-500">
                        Published: {new Date(notification.published_on || Date.now()).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleReply(notification)}
                      className="w-full px-4 py-2 mt-4 text-sm text-white transition-all bg-blue-500 rounded-lg"
                    >
                      Reply
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.main>

        {/* Chat Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gray-800/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-[90%] max-w-xl relative border border-gray-700/50"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
              <button
                onClick={closeChatModal}
                className="absolute flex items-center justify-center w-10 h-10 text-gray-400 transition-colors duration-200 bg-gray-700 rounded-full bottom-[102%] right-[100%] hover:bg-gray-600" // Adjusted positioning
              >
                <FiX className="text-2xl " />
              </button>

                <h3 className="mb-4 text-xl font-bold text-center text-blue-400">
                  Chat about: {selectedArticle.title}
                </h3>

                <div
                  ref={chatContainerRef}
                  className="p-4 mb-4 overflow-y-auto rounded-lg h-96 bg-gray-700/50"
                >
                  {chatHistory.map((chat, index) => (
                    <motion.div
                      key={index}
                      className={`mb-4 ${
                        chat.isUser ? "text-right" : "text-left"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {chat.isUser ? (
                        <div className="inline-block px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                          {chat.content}
                        </div>
                      ) : (
                        <div className="inline-block px-4 py-2 text-sm text-gray-300 bg-gray-600/50 rounded-xl">
                          {chat.content}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      className="text-left"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="inline-block px-4 py-2 text-sm text-gray-300 bg-gray-600/50 rounded-xl">
                        <div className="flex items-center">
                          <span className="mr-2">NUUS is typing</span>
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question here..."
                  className="w-full p-3 text-sm text-gray-300 border rounded-lg resize-none bg-gray-700/50 border-gray-600/50 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/20"
                  rows={3}
                />
                <button
                  onClick={handleChat}
                  className="w-full px-6 py-2 mt-4 text-sm text-white transition-all bg-blue-500 rounded-lg "
                >
                  Ask
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notify;
