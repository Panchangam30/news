import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Manage = () => {
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState("days");
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch existing interval settings
  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/get-interval")
      .then((response) => response.json())
      .then((data) => {
        if (data.interval) {
          setIntervalValue(data.interval.value);
          setIntervalUnit(data.interval.unit);
        }
      })
      .catch((error) => console.error("Error fetching interval:", error));
  }, []);

  // Handle interval submission
  const handleSaveInterval = () => {
    fetch("http://127.0.0.1:5001/api/update-frequency", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interval: intervalValue,
        unit: intervalUnit
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        console.log("Frequency updated:", data);
        navigate("/dash", { state: { refresh: true } });
      })
      .catch((error) => {
        console.error("Error updating frequency:", error);
        alert("Failed to update frequency. Please try again.");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col min-h-screen text-white bg-gray-900"
    >
      {/* Navigation Header */}
      <div className="z-10 flex items-center justify-between px-8 py-4 relative top-[20px]">
        <button
          onClick={() => navigate("/dash")}
          className="flex items-center text-blue-400 transition-colors hover:text-blue-300 relative left-[160px]"
        >
          <FiArrowLeft className="mr-2" /> Back to Dashboard
        </button>
        <motion.button
          onClick={handleSaveInterval}
          className="relative px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 right-[160px]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Changes
        </motion.button>
      </div>

      {/* Frequency Settings Form */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex items-center justify-center flex-1 bg-gray-900 bg-opacity-80 backdrop-blur-md relative bottom-[220px]"
      >
        <motion.div
          className="w-3/4 p-10 text-blue-400 bg-gray-800 shadow-lg rounded-2xl"
          variants={containerVariants}
        >
          <motion.h1
            className="mb-6 text-3xl font-bold text-center"
            variants={itemVariants}
          >
            Newsletter Frequency Settings
          </motion.h1>
          <motion.p
            className="mb-8 text-center text-gray-400"
            variants={itemVariants}
          >
            Adjust how often you receive updates
          </motion.p>
          <motion.div
            className="flex flex-col items-center space-y-6"
            variants={containerVariants}
          >
            <motion.div
              className="flex items-center space-x-4"
              variants={itemVariants}
            >
              <span className="text-lg font-normal text-gray-400">Every</span>
              <motion.input
                type="number"
                min="1"
                className="w-20 px-4 py-2 text-gray-300 bg-gray-800 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={intervalValue}
                onChange={(e) => setIntervalValue(Number(e.target.value))}
                placeholder="1"
              />
              <motion.select
                className="w-40 px-4 py-2 text-gray-300 bg-gray-800 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={intervalUnit}
                onChange={(e) => setIntervalUnit(e.target.value)}
              >
                <option value="minutes">Minute(s)</option>
                <option value="hours">Hour(s)</option>
                <option value="days">Day(s)</option>
                <option value="weeks">Week(s)</option>
                <option value="months">Month(s)</option>
              </motion.select>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Manage;