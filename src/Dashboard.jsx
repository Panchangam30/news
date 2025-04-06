import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const Dashboard = () => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState("minutes");
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
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const interestMapping = {
    "Cryptocurrency": "1",
    "Politics": "2",
    "Stock Market": "3",
    "Startups": "4",
    "Inflation": "5",
    "Billionaires": "6",
    "Big Tech": "7",
    "Real Estate": "8",
  };

  const handleNext = async () => {
    if (step === 2) {
      setStep(3);
      const interestIds = selectedInterests.map((interest) => interestMapping[interest]);
      try {
        await axios.post("http://127.0.0.1:5001/api/submit-interests", {
          selected_ids: interestIds,
          interval: {
            value: intervalValue,
            unit: intervalUnit,
          },
        });
        setTimeout(() => {
          navigate("/dash");
        }, 3000);
      } catch (error) {
        console.error("Error submitting interests:", error);
        alert("Failed to submit interests. Please try again.");
        setStep(2);
      }
    } else if (step < 3) {
      setStep(step + 1);
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
      <AnimatePresence mode='wait'>
        {/* Step 1: Welcome Box */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80 backdrop-blur-md"
          >
            <motion.div
              className="w-3/4 p-10 text-blue-400 bg-gray-800 shadow-lg rounded-2xl"
              variants={containerVariants}
            >
              <motion.h1 
                className="mb-6 text-3xl font-bold text-center"
                variants={itemVariants}
              >
                Welcome to NUUS!
              </motion.h1>
              <motion.p 
                className="mb-8 text-center text-gray-400"
                variants={itemVariants}
              >
                Select your interests to customize your dashboard experience.
              </motion.p>
              <div className="grid grid-cols-3 gap-6">
                {Object.keys(interestMapping).map((interest, index) => (
                  <motion.label
                    key={index}
                    variants={itemVariants}
                    className="flex items-center p-4 space-x-4 transition bg-gray-800 border border-gray-700 rounded-lg shadow-2xl hover:bg-gray-900"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="checkbox"
                      className="relative w-5 h-5 border border-blue-500 rounded-full appearance-none cursor-pointer peer checked:bg-blue-500 checked:border-blue-500"
                      checked={selectedInterests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                    <svg
                      className="absolute hidden w-5 h-5 pointer-events-none peer-checked:block"
                      viewBox="0 0 24 24"
                    >

                    </svg>
                    <span className="text-lg font-light text-gray-400">{interest}</span>
                  </motion.label>
                ))}
              </div>
              <motion.div 
                className="mt-8 text-center"
                variants={itemVariants}
              >
                <motion.button
                  className="px-6 py-3 text-lg font-medium text-white transition bg-blue-500 rounded-lg hover:bg-blue-700"
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Newsletter Frequency */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80 backdrop-blur-md"
          >
            <motion.div
              className="w-3/4 p-10 text-blue-400 bg-gray-800 shadow-lg rounded-2xl"
              variants={containerVariants}
            >
              <motion.h1 
                className="mb-6 text-3xl font-bold text-center"
                variants={itemVariants}
              >
                Set Your Newsletter Frequency
              </motion.h1>
              <motion.p 
                className="mb-8 text-center text-gray-400"
                variants={itemVariants}
              >
                Select how often you want to receive your newsletters.
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
                    onChange={(e) => setIntervalValue(e.target.value)}
                    placeholder="1"
                    whileFocus={{ scale: 1.05 }}
                  />
                  <motion.select
                    className="w-40 px-4 py-2 text-gray-300 bg-gray-800 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={intervalUnit}
                    onChange={(e) => setIntervalUnit(e.target.value)}
                    whileFocus={{ scale: 1.05 }}
                  >
                    <option value="minutes">Minute(s)</option>
                    <option value="hours">Hour(s)</option>
                    <option value="days">Day(s)</option>
                    <option value="weeks">Week(s)</option>
                    <option value="months">Month(s)</option>
                  </motion.select>
                </motion.div>
                <motion.div 
                  className="mt-8 text-center"
                  variants={itemVariants}
                >
                  <motion.button
                    className="px-6 py-3 text-lg font-medium text-white transition bg-blue-500 rounded-lg hover:bg-blue-700"
                    onClick={handleNext}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Confirm
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Loading Box */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80 backdrop-blur-md"
          >
            <motion.div
              className="p-8 text-blue-400 bg-gray-800 rounded-lg shadow-lg"
              animate={{
                scale: [1, 1.05, 1],
                transition: {
                  duration: 1.5,
                  repeat: Infinity
                }
              }}
            >
              <h1 className="mb-4 text-2xl font-bold">Loading Dashboard...</h1>
              <motion.div
                className="flex justify-center"
                animate={{
                  rotate: 360,
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </motion.div>
              <p className="mt-4 text-gray-400">Preparing your personalized experience</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;