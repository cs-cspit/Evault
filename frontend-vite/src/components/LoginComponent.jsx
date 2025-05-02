import React, { useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import loginAsAClient from "../blockchain-api/loginAsAClient";
import loginAsALawyer from "../blockchain-api/loginAsALawyer";
import loginAsAJudge from "../blockchain-api/loginAsAJudge";
import { shortenWalletAddress } from "@/lib/utils";
import secureStorage from "@/utils/secureStorage";

const LoginComponent = ({ initialFormType }) => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState(initialFormType || "");
  const [isConnected, setIsConnected] = useState(false);
  const [aadharUID, setAadharUID] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [signingUpAs, setSigningUpAs] = useState("lawyer");

  const connectMetamaskWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setWalletAddress(account);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to Ethereum:", error);
      setIsConnected(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aadharUID || !walletAddress) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      let isLoggedIn = false;
      if (signingUpAs === "lawyer") {
        isLoggedIn = await loginAsALawyer(aadharUID);
        if (isLoggedIn) {
          secureStorage.setItem('isLoggedIn', true);
          secureStorage.setItem('token', 'authenticated');
          secureStorage.setItem('userUID', aadharUID);
          secureStorage.setItem('userType', 'lawyer');
          secureStorage.setItem('walletAddress', walletAddress);
          navigate(`/admin/lawyer/${aadharUID}`);
        }
      } else if (signingUpAs === "judge") {
        isLoggedIn = await loginAsAJudge(aadharUID);
        if (isLoggedIn) {
          secureStorage.setItem('isLoggedIn', true);
          secureStorage.setItem('token', 'authenticated');
          secureStorage.setItem('userUID', aadharUID);
          secureStorage.setItem('userType', 'judge');
          secureStorage.setItem('walletAddress', walletAddress);
          navigate(`/admin/judge/${aadharUID}`);
        }
      } else if (signingUpAs === "client") {
        isLoggedIn = await loginAsAClient(aadharUID);
        if (isLoggedIn) {
          secureStorage.setItem('isLoggedIn', true);
          secureStorage.setItem('token', 'authenticated');
          secureStorage.setItem('userUID', aadharUID);
          secureStorage.setItem('userType', 'client');
          secureStorage.setItem('walletAddress', walletAddress);
          navigate(`/admin/client/${aadharUID}`);
        }
      }

      if (isLoggedIn) { 
        toast.success("Login successful! ✨", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error(`Login as ${signingUpAs} failed`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred during login", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <motion.div 
            variants={itemVariants}
            className="md:w-2/5 p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
            <p className="text-blue-100 mb-8">
              Sign in to access your E-Vault account and manage your legal documents securely.
            </p>
            <Link 
              to={`/signup/${formType}`}
              className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Create Account
            </Link>
          </motion.div>

          {/* Right Section */}
          <div className="md:w-3/5 p-8">
            <motion.div variants={itemVariants} className="mb-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { type: "lawyer", icon: "👨‍⚖️" },
                  { type: "client", icon: "👤" },
                  { type: "judge", icon:  "⚖️"}
                ].map(({ type, icon }) => (
                  <button
                    key={type}
                    className={`p-4 rounded-lg transition-all duration-200 ${
                      formType === type
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setFormType(type);
                      setSigningUpAs(type);
                    }}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-medium capitalize">
                      {type}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.form 
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your Aadhar number"
                  value={aadharUID}
                  onChange={(e) => setAadharUID(e.target.value)}
                />
              </div>

              <div className="flex space-x-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Connect Metamask wallet 🦊"
                  value={walletAddress ? shortenWalletAddress(walletAddress) : ""}
                  readOnly
                />
                <button
                  type="button"
                  onClick={connectMetamaskWallet}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isConnected
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isConnected ? "Connected ✓" : "Connect"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign In
              </button>
            </motion.form>
          </div>
        </div>
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LoginComponent;
