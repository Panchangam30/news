import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZap, FiBell, FiMessageCircle, FiSliders, FiRefreshCw, FiCheckCircle, FiChevronDown, FiCloudLightning } from 'react-icons/fi';
import logoImage from './assets/logo.png';
import editImage from './assets/edit.png';
import { Link } from 'react-router-dom';


const CyberBackground = () => {

  const generatePath = (width, height) => {
    let path = `M 0 ${height / 2} `;
    for(let x = 0; x <= width; x += 50) {
      const y = height/2 + Math.sin(x * 0.1) * 40;
      path += `L ${x} ${y} `;
    }
    return path;
  };

  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-gray-900/95" />
      
      <svg className="absolute inset-0 w-[300%] h-full opacity-40">
{Array.from({ length: 25 }).map((_, i) => {
  const isVertical = i % 4 === 0;
  const strokeIntensity = 0.5 + (i % 3) * 0.2;
  const dashArray = i % 2 === 0 ? "4 8" : "8 4";
  
  return (
    <motion.path
      key={`grid-${i}`}
      d={isVertical ? 
        `M ${i * 40} 0 L ${i * 40} 600` : 
        generatePath(10000, 600, i * 0.95)
      }
      stroke="#60a5fa"
      strokeWidth={1 + (i % 3)}
      strokeOpacity={0.1 + (i % 10) * 0.05}
      strokeDasharray={dashArray}
      fill="none"
      initial={{ 
        pathLength: 0,
        strokeDashoffset: 100,
        rotate: isVertical ? 0 : Math.random() * 5 - 2.5
      }}
      animate={{ 
        pathLength: 3,
        strokeDashoffset: 0,
        rotate: isVertical ? 0 : Math.random() * 5 - 2.5
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.3,
        rotate: {
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    />
  );
})}
      </svg>

      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`node-${i}`}
          className="absolute w-2 h-2 bg-transparent rounded-full opacity-70"
          initial={{
            scale: 0,
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%'
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 border-2 rounded-lg border-blue-400/20"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="p-6 bg-gray-700 rounded-lg cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
      initial={false}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="mb-2 text-xl font-semibold text-blue-400">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FiChevronDown className="text-xl text-blue-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 20
              }
            }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const HackathonLanding = () => {
  const features = [
  {
    icon: <FiSliders className="text-3xl text-blue-400" />,
    title: "Tailored Newsfeed",
    description: "Personalize your news feed by selecting topics that matter to you."
  },
  {
    icon: <FiBell className="text-3xl text-blue-400" />,
    title: "Real-Time Updates",
    description: "Get breaking news and current events delivered to your inbox in real-time."
  },
  {
    icon: <FiMessageCircle className="text-3xl text-blue-400" />,
    title: "Interactive Newsfeed",
    description: "Chat with your news articles for any questions that you may have."
  }
];
  const benefits = [
    {
      icon: <FiCloudLightning className="text-3xl text-blue-400" />,
      title: "Ask & Understand",
      description: "Get instant answers to questions directly within news articles."
    },
    {
      icon: <FiRefreshCw className="text-3xl text-blue-400" />,
      title: "Periodic Updates",
      description: "Stay up-to-date with the latest news and current events every hour or any time."
    },
    {
      icon: <FiCheckCircle className="text-3xl text-blue-400" />,
      title: "Reliable Answers",
      description: "Get reliable answers to your questions from a Retrieval-Augmented Generation chatbot"
    }
  ];

  const faqs = [
    {
      question: "How does the AI chat with me about my articles?",
      answer: "Using Retrieval-Augmented Generation, the AI will understand your interests, preferences, and topics of interest."
    },
    {
      question: "What makes NUUS better than my current news app?",
      answer: "You get periodic updates of news and also get instant answers to your questions about your articles."
    },
    {
      question: "How current are your news sources?",
      answer: "All news sources are current and up-to-date"
    },
    {
      question: "How does your RAG system differ from ChatGPT?",
      answer: "The RAG system directly answers questions about your news articles making it reliable and valid."
    }
  ];

  return (
    <div className="min-h-screen text-gray-100">
      <CyberBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="relative py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="container px-4 mx-auto">
            <motion.nav 
              className="flex items-center justify-between mb-16"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <motion.img 
                src={logoImage} 
                alt="Logo" 
                className="w-16 h-16"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="flex space-x-6">
                <motion.a 
                  href="#features" 
                  className="transition-colors hover:text-blue-400"
                  whileHover={{ scale: 1.1 }}
                >
                  Features
                </motion.a>
                <motion.a 
                  href="#benefits" 
                  className="transition-colors hover:text-blue-400"
                  whileHover={{ scale: 1.1 }}
                >
                  Benefits
                </motion.a>
                <motion.a 
                  href="#faq" 
                  className="transition-colors hover:text-blue-400"
                  whileHover={{ scale: 1.1 }}
                >
                  FAQ
                </motion.a>
              </div>
            </motion.nav>

            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <motion.h1 
                className="mb-6 text-5xl font-bold md:text-6xl"
                whileHover={{ scale: 1.02 }}
              >
                Personalize What You Want To See With
                <span className="text-blue-400"> NUUS</span>
              </motion.h1>
              
              <motion.p 
                className="mb-8 text-xl text-gray-400"
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
              We Put The "U" in News
              </motion.p>

              <div className="flex justify-center mb-16 space-x-4">
                <motion.button 
                  className="flex items-center px-8 py-3 font-semibold text-gray-900 transition-all bg-blue-400 rounded-lg hover:bg-blue-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/dashboard" className="flex items-center">
                    Get Started
                    <FiZap className="ml-2 animate-pulse" />
                  </Link>
                </motion.button>
                
              </div>

              <motion.img
                src={editImage}
                alt="Platform Preview"
                className="w-full max-w-4xl mx-auto border-2 border-gray-700 shadow-xl rounded-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          id="features" 
          className="py-20 bg-gray-800/50 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container px-4 mx-auto">
            <motion.h2 
              className="mb-12 text-4xl font-bold text-center"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ type: "spring" }}
            >
              Key Features
            </motion.h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="p-6 transition-all bg-gray-700/80 rounded-xl hover:bg-gray-600/80 backdrop-blur-sm"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-2xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          id="benefits" 
          className="py-20 bg-gray-900/50 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container px-4 mx-auto">
            <motion.h2 
              className="mb-12 text-4xl font-bold text-center"
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
            >
              Benefits
            </motion.h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="p-6 transition-all bg-gray-800/80 rounded-xl hover:bg-gray-700/80 backdrop-blur-sm"
                  initial={{ rotateY: 90 }}
                  whileInView={{ rotateY: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="mb-2 text-2xl font-semibold">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          id="faq" 
          className="py-20 bg-gray-800/50 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="container px-4 mx-auto">
            <motion.h2 
              className="mb-12 text-4xl font-bold text-center"
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HackathonLanding;