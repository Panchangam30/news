import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiSettings, FiMessageSquare, FiBell } from "react-icons/fi";
import axios from "axios";
import logo from "./assets/logo.png";

const Dash = () => {
  const [latestNotification, setLatestNotification] = useState(null);
  const [activeTopicsCount, setActiveTopicsCount] = useState(0);
  const [newslettersSent, setNewslettersSent] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [totalChats, setTotalChats] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);





  const fetchTotalChats = async () => {
  try {
    const response = await fetch("http://localhost:5001/api/total-chats");
    const data = await response.json();
    setTotalChats(data.total_chats || 0);
  } catch (error) {
    console.error("Error fetching total chats:", error);
  }
};


const sendChatRequest = async (articleData, question) => {
  try {
    const response = await axios.post("http://localhost:5001/api/chat", {
      title: articleData.title,
      body: articleData.body,
      summary: articleData.summary,
      url: articleData.url,
      published_on: articleData.published_on,
      question: question,
    });

    // Process the response
    const chatResult = response.data;
    console.log("Chat result:", chatResult);

    // Fetch the updated total chats count
    fetchTotalChats();
  } catch (error) {
    console.error("Error sending chat request:", error);
  }
};


  const fetchNewslettersCount = async () => {
  try {
    const countResponse = await fetch("http://localhost:5001/api/newsletters-count");
    const countData = await countResponse.json();
    setNewslettersSent(countData.count);
  } catch (error) {
    console.error("Error fetching newsletters count:", error);
  }
};


  // Fetch latest notification and active topics
useEffect(() => {
  const fetchData = async () => {
    try {
      // Use Promise.allSettled to handle individual API failures
      const results = await Promise.allSettled([
        fetch("http://localhost:5001/api/latest-news"),
        axios.get("http://localhost:5001/api/user-topics"),
        fetch("http://localhost:5001/api/newsletters-count"),
        fetch("http://localhost:5001/api/total-chats")
      ]);

      // Process each result independently
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          switch(index) {
            case 0: // Latest news
              result.value.json()
                .then(data => setLatestNotification(data.latestNotification))
                .catch(console.error);
              break;
            case 1: // User topics
              setActiveTopicsCount(result.value.data.topics?.length || 0);
              break;
            case 2: // Newsletters count
              result.value.json()
                .then(data => setNewslettersSent(data.count))
                .catch(console.error);
              break;
            case 3: // Total chats
              result.value.json()
                .then(data => setTotalChats(data.total_chats || 0))
                .catch(console.error);
              break;
          }
        }
      });
    } catch (error) {
      console.error("Error in fetch operations:", error);
    }
  };

  fetchData();
  const intervalId = setInterval(fetchData, 10000); // Reduced to 10s for testing
  return () => clearInterval(intervalId);
}, []); // Removed location.key dependency


  return (
    <div className="flex min-h-screen text-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
        <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
          <img className="h-12" src={logo} alt="Logo" />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Summary Cards */}
          <section className="grid grid-cols-3 gap-6 mb-8">
            {[
              { title: "Total Number of Questions Asked", value: totalChats.toString(), icon: <FiMessageSquare className="w-6 h-6" /> },
              { title: "Newsletters Sent", value: newslettersSent.toString(), icon: <FiBell className="w-6 h-6" /> },              
              { title: "Active Topics", value: activeTopicsCount.toString(), icon: <FiPlus className="w-6 h-6" /> }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="p-6 transition-all border shadow-xl bg-gray-800/50 backdrop-blur-lg rounded-2xl border-gray-700/50 hover:border-blue-400/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-gray-700/50 rounded-xl">{card.icon}</div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-100">{card.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Content Columns */}
          <div className="flex gap-8 h-[60vh]">
            {/* Left Column - Features */}
            <div className="w-[50%] space-y-6">
              {[
                {
                  title: "Customizable Topics",
                  content: "Select your favorite topics like cryptocurrency, politics, stock market, and more.",
                  icon: <FiPlus className="w-5 h-5" />,
                  button: "Manage Topics",
                  action: () => navigate('/topics')
                },
                {
                  title: "Newsletter Frequency",
                  content: "Set daily, weekly, or monthly updates tailored to your schedule.",
                  icon: <FiSettings className="w-5 h-5" />,
                  button: "Adjust Settings",
                  action: () => navigate('/set') // Remove trailing comma if using older JS
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 transition-all border bg-gray-800/50 backdrop-blur-lg rounded-2xl border-gray-700/50 hover:border-blue-400/30"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 text-blue-400 rounded-lg bg-blue-400/10">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                      <p className="mb-4 text-gray-400">{feature.content}</p>
                      <button onClick={feature.action} className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg bg-blue-500/90 hover:bg-blue-600">
                        {feature.icon}
                        {feature.button}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column - Notifications */}
            <motion.div
              className="w-[48%] bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 hover:border-blue-400/30 transition-all"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-6 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Latest Notification</h3>
                  <button
                    onClick={() => navigate("/notify")}
                    className="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-lg bg-blue-500/90 hover:bg-blue-600"
                  >
                    <FiBell className="w-5 h-5" />
                    View All
                  </button>
                </div>
              </div>

              <div className="p-6">
                {latestNotification ? (
                  <motion.div
                    className="relative overflow-hidden group rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-br from-blue-400/10 to-transparent group-hover:opacity-100"></div>
                    <img
                      src={latestNotification.imageUrl || "https://via.placeholder.com/150"}
                      alt={latestNotification.title || "Notification"}
                      className="object-cover w-full h-48"
                    />
                    <div className="p-4">
                      <h4 className="mb-2 font-semibold text-md">
                        {latestNotification.title || "No Title"}
                      </h4>
                      <p className="mb-4 text-sm text-gray-400 line-clamp-2">
                        {latestNotification.summary || "No summary available."}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="relative z-10 p-2 bg-transparent">
                          <button
                            onClick={() => {
                              if (latestNotification.url) {
                                window.open(latestNotification.url, "_blank", "noopener,noreferrer");
                              }
                            }}
                            className="flex items-center gap-2 text-sm text-blue-400 cursor-pointer hover:text-blue-300"
                          >
                            Read More
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                          <span className="text-xs text-gray-500">
                            Published: {new Date(latestNotification.published_on || Date.now()).toLocaleString("en-US", {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })}
                          </span>

                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="mb-4 text-gray-500">No new notifications</div>
                    <div className="animate-pulse">
                      <div className="h-48 mb-4 bg-gray-700/50 rounded-xl"></div>
                      <div className="w-3/4 h-4 mx-auto mb-2 rounded bg-gray-700/50"></div>
                      <div className="w-1/2 h-4 mx-auto mb-2 rounded bg-gray-700/50"></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dash;