import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import getCaseDetailsByCaseID from "../blockchain-api/getCaseDetailsByCaseID";
import getJudgeDetailsByUID from "@/blockchain-api/getJudgeDetailsByUID";
import getLawyerDetailsByUID from "@/blockchain-api/getLawyerDetailsByUID";
import getClientDetailsByUID from "@/blockchain-api/getClientDetailsByUID";

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

// Loading animation variants
const loadingVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    borderRadius: ["20%", "50%", "20%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const SearchCaseDetailsComponent = () => {
  const [caseID, setCaseID] = useState("");
  const [caseDetails, setCaseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();

  const [isUserJudge, setIsUserJudge] = useState(false);
  const [isUserLawyer, setIsUserLawyer] = useState(false);
  const [isUserClient, setIsUserClient] = useState(false);

  const [userAddress, setUserAddress] = useState(null);
  const [party1Details, setParty1Details] = useState({ name: "", UID: "" });
  const [party2Details, setParty2Details] = useState({ name: "", UID: "" });
  const [judgeDetails, setJudgeDetails] = useState({ name: "", UID: "" });
  const [lawyerDetails, setLawyerDetails] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!caseID) {
      toast.error("Please enter a case ID");
      setIsLoading(false);
      return;
    }

    try {
      const details = await getCaseDetailsByCaseID(caseID);
      setCaseDetails(details);

      // Fetch party 1 details
      const party1Info = await getClientDetailsByUID(
        details.UIDOfParty1,
        "name_UID_walletAddress"
      );
      setParty1Details({
        name: party1Info.name,
        UID: party1Info.UID
      });

      // Fetch party 2 details
      const party2Info = await getClientDetailsByUID(
        details.UIDOfParty2,
        "name_UID_walletAddress"
      );
      setParty2Details({
        name: party2Info.name,
        UID: party2Info.UID
      });

      // Fetch judge details
      const judgeInfo = await getJudgeDetailsByUID(
        details.associatedJudge,
        "name_UID_walletAddress"
      );
      setJudgeDetails({
        name: judgeInfo.name,
        UID: judgeInfo.UID
      });

      // Fetch lawyer details
      const lawyersInfo = await Promise.all(
        details.associatedLawyers.map(async (lawyerUID) => {
          const lawyerInfo = await getLawyerDetailsByUID(
            lawyerUID,
            "name_UID_walletAddress"
          );
          return {
            name: lawyerInfo.name,
            UID: lawyerInfo.UID,
            walletAddress: lawyerInfo.walletAddress
          };
        })
      );
      setLawyerDetails(lawyersInfo);

      checkForCaseAdmins(details);
      toast.success("Case details found!");
    } catch (error) {
      console.error("Error fetching case details:", error);
      toast.error("No case found with this ID");
      setCaseDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  // checkingIfCaseAdminsAreTryingToViewFurtherCaseDetails?
  const checkForCaseAdmins = async (caseDetails) => {
    if (
      party1Details.UID.toLowerCase() === userAddress?.toLowerCase() ||
      party2Details.UID.toLowerCase() === userAddress?.toLowerCase()
    ) {
      setIsUserClient(true);
    } else {
      setIsUserClient(false);
    }

    if (
      lawyerDetails[0].walletAddress.toLowerCase() === userAddress?.toLowerCase() ||
      lawyerDetails[1].walletAddress.toLowerCase() === userAddress?.toLowerCase()
    ) {
      setIsUserLawyer(true);
    } else {
      setIsUserLawyer(false);
    }

    if (judgeDetails.walletAddress.toLowerCase() === userAddress?.toLowerCase()) {
      setIsUserJudge(true);
    } else {
      setIsUserJudge(false);
    }
  };

  useEffect(() => {
    // Function to handle MetaMask account change
    const handleAccountChange = (accounts) => {
      setUserAddress(accounts[0]);
    };

    // Listen for MetaMask account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
    }

    const fetchCurrentWalletAddress = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setUserAddress(accounts[0]);
        } else {
          console.error("MetaMask not installed or user not logged in");
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    };

    fetchCurrentWalletAddress();

    if (caseDetails) {
      checkForCaseAdmins(caseDetails);
    }

    // Clean up event listener when component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.off("accountsChanged", handleAccountChange);
      }
    };
  }, [userAddress, isUserJudge, isUserLawyer, isUserClient]);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
        <motion.div
          variants={loadingVariants}
          animate="animate"
          className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center"
        >
          <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-blue-600/[0.03] -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full transform -rotate-6"></div>
                <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center transform rotate-6">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold font-montserrat mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Search Case Details
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-12"
            >
              Access and manage your legal cases securely. Enter your case ID below to get started.
            </motion.p>

            {/* Search Section with enhanced styling */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl transform -rotate-1"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl transform rotate-1"></div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl relative">
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="w-full pl-12 pr-4 py-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                        placeholder="Enter Case ID"
                        value={caseID}
                        onChange={(e) => setCaseID(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] text-lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-t-2 border-white rounded-full mr-2"
                          />
                          Searching...
                        </div>
                      ) : (
                        <>
                          <span>Search Case</span>
                          <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Tips Section */}
      {!caseDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Case ID Format</h3>
            <p className="text-gray-600">Enter the unique case identifier provided during case registration</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Access Control</h3>
            <p className="text-gray-600">Only authorized personnel can view detailed case information</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Search</h3>
            <p className="text-gray-600">All searches are encrypted and securely processed</p>
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      <AnimatePresence>
        {caseDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden"
          >
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party 1</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party 2</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filing Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judge</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lawyers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{caseDetails.caseId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{caseDetails.caseSubject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{party1Details.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{party2Details.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{caseDetails.filedOnDate.toString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{judgeDetails.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lawyerDetails.map((lawyer) => lawyer.name).join(", ")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden">
              <div className="grid grid-cols-1 gap-4 p-4">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <div className="space-y-4">
                    {[
                      { label: "Case ID", value: caseDetails.caseId },
                      { label: "Subject", value: caseDetails.caseSubject },
                      { label: "Party 1", value: party1Details.name },
                      { label: "Party 2", value: party2Details.name },
                      { label: "Filing Date", value: caseDetails.filedOnDate.toString() },
                      { label: "Judge", value: judgeDetails.name },
                      { label: "Lawyers", value: lawyerDetails.map((lawyer) => lawyer.name).join(", ") }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col space-y-1">
                        <div className="text-sm font-medium text-gray-500">{item.label}</div>
                        <div className="text-sm text-gray-900 bg-white p-2 rounded-md shadow-sm">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              {isUserJudge || isUserLawyer || isUserClient ? (
                <Link to={`/case-details?caseid=${caseDetails.caseId}`}>
                  <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group">
                    <span>View Detailed Information</span>
                    <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </Link>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Only case administrators can view detailed information
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
    </motion.div>
  );
};

export default SearchCaseDetailsComponent;
