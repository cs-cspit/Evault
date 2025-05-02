import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import indianJudiciaryLogo from "../assets/logo.jpeg";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-white"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/2 left-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={itemVariants}
          className="text-center flex items-center justify-center pb-8"
        >
          <img
            src={indianJudiciaryLogo}
            alt="Indian Judiciary Logo"
            className="w-32 md:w-40 lg:w-48 transform hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Project E-Vault
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl font-montserrat mb-8 text-gray-600">
            A modernized blockchain based eVault storage solution for the Indian
            Judiciary.
          </p>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mx-auto px-4"
        >
          <Link
            to="/login/client"
            className="group relative overflow-hidden rounded-lg bg-white px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <span className="text-2xl mb-2">👤</span>
              <span className="font-montserrat text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Continue as a Client</span>
            </div>
          </Link>

          <Link
            to="/login/lawyer"
            className="group relative overflow-hidden rounded-lg bg-white px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <span className="text-2xl mb-2">👨‍⚖️</span>
              <span className="font-montserrat text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Continue as a Lawyer</span>
            </div>
          </Link>

          <Link
            to="/login/judge"
            className="group relative overflow-hidden rounded-lg bg-white px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative flex flex-col items-center">
              <span className="text-2xl mb-2">⚖️</span>
              <span className="font-montserrat text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Continue as a Judge</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroSection;
