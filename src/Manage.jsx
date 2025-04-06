import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiCheck, FiArrowLeft } from "react-icons/fi";

const Background = () => {
  const particles = Array.from({ length: 30 });

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      {particles.map((_, index) => {
        const duration = 15 + Math.random() * 10;
        const delay = Math.random() * 5;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;

        return (
          <motion.div
            key={index}
            className="absolute w-2 h-2 bg-transparent rounded-full"
            initial={{
              x: `${initialX}%`,
              y: `${initialY}%`,
              scale: 0,
            }}
            animate={{
              x: [`${initialX}%`, `${initialX + (Math.random() - 0.5) * 40}%`],
              y: [`${initialY}%`, `${initialY + (Math.random() - 0.5) * 40}%`],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              repeatType: 'loop',
              delay: delay,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
};

const Manage = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const navigate = useNavigate();

  const topicMap = {
    "1": "Cryptocurrency",
    "2": "Politics",
    "3": "Stock Market",
    "4": "Startups",
    "5": "Inflation",
    "6": "Billionaires",
    "7": "Big Tech",
    "8": "Real Estate",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const fetchUserTopics = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5001/api/user-topics");
        setSelectedIds(response.data.topics || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
        alert("Failed to load topics. Please try again.");
      }
    };
    fetchUserTopics();
  }, []);

  const toggleTopic = (topicId) => {
    setSelectedIds(prev => 
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSave = async () => {
    try {
      await axios.put("http://127.0.0.1:5001/api/update-topics", {
        topics: selectedIds
      });
      navigate("/dash", { state: { refresh: true } });
    } catch (error) {
      console.error("Error saving topics:", error);
      alert("Failed to save topics. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-screen text-white bg-gray-900"
    >
      <Background />
      <motion.div
        className="z-10 w-[1200px] max-w-10xl p-8 mx-auto max-h-10xl h-[1000px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/dash")}
            className="flex items-center text-blue-400 transition-colors hover:text-blue-300"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <motion.button
            onClick={handleSave}
            className="px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Changes
          </motion.button>
        </div>

        <div className="p-8 shadow-2xl bg-gray-800/80 backdrop-blur-lg rounded-2xl">
          <motion.h1 
            className="mb-6 text-3xl font-bold text-center text-blue-400"
            variants={itemVariants}
          >
            Manage Your Topics
          </motion.h1>
          <motion.p 
            className="mb-8 text-center text-gray-400"
            variants={itemVariants}
          >
            Select or deselect topics to customize your news feed
          </motion.p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {Object.entries(topicMap).map(([id, name]) => (
              <motion.label
                key={id}
                variants={itemVariants}
                className={`flex items-center p-4 space-x-4 transition border-gray-700 bg-gray-800 border rounded-lg shadow-2xl hover:bg-gray-900 ${
                  selectedIds.includes(id)
                    ? 'border-gray-700 bg-transparent'
                    : 'border-gray-700 hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedIds.includes(id)}
                    onChange={() => toggleTopic(id)}
                  />
                  <div className={`w-5 h-5 border rounded-full flex items-center justify-center transition-colors ${
                    selectedIds.includes(id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-blue-500'
                  }`}>
                    {selectedIds.includes(id) && (
                      <FiCheck className="text-sm text-transparent" />
                    )}
                  </div>
                </div>
                <span className="text-lg font-light text-gray-400">{name}</span>
              </motion.label>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Manage;