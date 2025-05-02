import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import secureStorage from "@/utils/secureStorage";

import getClientDetailsByUID from "../blockchain-api/getClientDetailsByUID";
import getCasesForClientByUID from "../blockchain-api/getCasesForClientByUID";
import getLawyerDetailsByUID from "../blockchain-api/getLawyerDetailsByUID";
import getCasesForLawyerByUID from "../blockchain-api/getCasesForLawyerByUID";
import getJudgeDetailsByUID from "../blockchain-api/getJudgeDetailsByUID";
import getCasesForJudgeByUID from "../blockchain-api/getCasesForJudgeByUID";
import Loader from "./Loader";
import {shortenWalletAddress} from "@/lib/utils";

const AdminDashboardComponent = ({aadharUID, adminType}) => {
  const [adminDetails, setAdminDetails] = useState(null);

  const [allCasesOnClient, setAllCasesOnClient] = useState([]);
  const [last3Cases, setLast3Cases] = useState([]);

  const [loading, setLoading] = useState(true);

  let result1, result2, justLast3Cases;

  const formatBigNumber = (value) => {
    if (value && value._isBigNumber) {
      return value.toString();
    }
    return value;
  };

  const processAdminDetails = (details) => {
    console.log("Details received:", details);
    if (!details) return null;
    const processed = {
      ...details,
      name: formatBigNumber(details.name),
      contactNumber: formatBigNumber(details.contactNumber),
      UID: aadharUID, // Use the passed in aadharUID
      nationality: formatBigNumber(details.nationality),
      sex: formatBigNumber(details.sex),
      dateOfBirth: formatBigNumber(details.dateOfBirth),
    };
    
    // Ensure walletAddress exists and is properly formatted
    if (details.walletAddress) {
      processed.walletAddress = typeof details.walletAddress === 'string' 
        ? details.walletAddress 
        : formatBigNumber(details.walletAddress);
    }
    
    return processed;
  };

  const processCase = (caseInfo) => {
    if (!caseInfo) return null;
    return {
      ...caseInfo,
      caseId: formatBigNumber(caseInfo.caseId),
      filedOnDate: new Date(Number(formatBigNumber(caseInfo.filedOnDate)) * 1000),
      caseProgress: Array.isArray(caseInfo.caseProgress) 
        ? caseInfo.caseProgress.map(progress => formatBigNumber(progress))
        : [],
      associatedJudge: formatBigNumber(caseInfo.associatedJudge),
      caseSubject: formatBigNumber(caseInfo.caseSubject)
    };
  };

  const fetchData = async () => {
    try {
      if (adminType === "client") {
        
        result1 = await getClientDetailsByUID(aadharUID, "all");
        console.log(result1)
        const processedDetails = processAdminDetails(result1);
        console.log("Processed admin details:", processedDetails); // Debug log
        setAdminDetails(processedDetails);

        result2 = await getCasesForClientByUID(aadharUID);
        const processedCases = result2.map(processCase).filter(Boolean);
        setAllCasesOnClient(processedCases);

        justLast3Cases = processedCases.slice(-3);
        setLast3Cases(justLast3Cases);
      } else if (adminType === "lawyer") {
        result1 = await getLawyerDetailsByUID(aadharUID, "all");
        const processedDetails = processAdminDetails(result1);
        console.log("Processed admin details:", processedDetails); // Debug log
        setAdminDetails(processedDetails);

        result2 = await getCasesForLawyerByUID(aadharUID);
        const processedCases = result2.map(processCase).filter(Boolean);
        setAllCasesOnClient(processedCases);

        justLast3Cases = processedCases.slice(-3);
        setLast3Cases(justLast3Cases);
      } else if (adminType === "judge") {
        result1 = await getJudgeDetailsByUID(aadharUID, "all");
        const processedDetails = processAdminDetails(result1);
        console.log("Processed admin details:", processedDetails); // Debug log
        setAdminDetails(processedDetails);

        result2 = await getCasesForJudgeByUID(aadharUID);
        const processedCases = result2.map(processCase).filter(Boolean);
        setAllCasesOnClient(processedCases);

        justLast3Cases = processedCases.slice(-3);
        setLast3Cases(justLast3Cases);
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  useEffect(() => {
    fetchData();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="relative">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-spin-slow">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`absolute w-32 h-32 rounded-full blur-xl opacity-20 animate-pulse ${
                  index === 0 
                    ? "bg-purple-400 top-1/4 left-1/4" 
                    : index === 1 
                    ? "bg-indigo-400 top-1/2 right-1/4" 
                    : "bg-blue-400 bottom-1/4 left-1/3"
                }`}
              />
            ))}
          </div>
          <Loader />
        </div>
      </div>
    );
  }

  const getRoleColors = () => {
    switch (adminType) {
      case "judge":
        return {
          gradient: "from-blue-700 via-blue-600 to-blue-500",
          button: "from-blue-600 via-blue-500 to-blue-400",
          hover: "hover:from-blue-700 hover:via-blue-600 hover:to-blue-500",
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200"
        };
      case "lawyer":
        return {
          gradient: "from-sky-700 via-sky-600 to-sky-500",
          button: "from-sky-600 via-sky-500 to-sky-400",
          hover: "hover:from-sky-700 hover:via-sky-600 hover:to-sky-500",
          bg: "bg-sky-100",
          text: "text-sky-800",
          border: "border-sky-200"
        };
      default:
        return {
          gradient: "from-indigo-700 via-indigo-600 to-indigo-500",
          button: "from-indigo-600 via-indigo-500 to-indigo-400",
          hover: "hover:from-indigo-700 hover:via-indigo-600 hover:to-indigo-500",
          bg: "bg-indigo-100",
          text: "text-indigo-800",
          border: "border-indigo-200"
        };
    }
  };

  const colors = getRoleColors();

  const handleRegisterNewCase = () => {
    if (adminType === "client") {
      toast.error("Only lawyers have access to register new cases", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}></div>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float`}
              style={{
                background: `linear-gradient(to right bottom, ${index % 2 === 0 ? '#60A5FA' : '#3B82F6'})`,
                width: Math.random() * 200 + 100 + 'px',
                height: Math.random() * 200 + 100 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: index * 0.5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className={`inline-flex items-center px-6 py-3 rounded-full ${colors.bg} ${colors.text} mb-6 animate-bounce-gentle`}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Welcome to your dashboard</span>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent animate-gradient`}>
            {adminType.charAt(0).toUpperCase() + adminType.slice(1)} Dashboard
          </h1>
        </div>

        {/* Recent Cases Section */}
        <div className="flex md:flex-row w-full justify-center gap-8 xs:flex-col-reverse mb-12">
          {/* Left Section - Recent Cases */}
          <div className="md:w-[55%] w-full">
            <h2 className={`text-2xl font-bold mb-6 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
              Recent Cases
            </h2>
            
            <div className="space-y-4">
            {last3Cases.length > 0 ? (
                last3Cases.map((caseInfo, index) => (
                  <Link 
                    key={index}
                    to={`/case-details?caseid=${caseInfo.caseId}&userType=${adminType}`}
                    className="block transform transition-all duration-300 hover:scale-102"
                  >
                    <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-semibold text-gray-800 flex-1">
                            {caseInfo.caseSubject}
                          </h3>
                          <span className={`${colors.bg} ${colors.text} text-sm px-3 py-1 rounded-full`}>
                            #{caseInfo.caseId}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {caseInfo.filedOnDate.toLocaleString()}
                          </p>
                          
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {caseInfo.caseProgress[caseInfo.caseProgress.length - 1]}
                          </p>
                        </div>
                      </div>
                      <div className={`h-1 w-full bg-gradient-to-r ${colors.button}`}></div>
                    </div>
                    </Link>
                ))
              ) : (
                <div className="bg-white/80 backdrop-blur-lg rounded-xl p-8 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">You don't have any cases yet.</p>
                </div>
            )}
            </div>
          </div>

          {/* Right Section - Profile Information */}
          <div className="md:w-[45%] w-full">
            <h2 className={`text-2xl font-bold mb-6 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
              Profile Information
            </h2>
            
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-100">
                {adminDetails && [
                  { label: "Full Name", value: adminDetails.name || "N/A" },
                  { label: "Contact Number", value: adminDetails.contactNumber || "N/A" },
                  { label: "Aadhar UID", value: adminDetails.UID || aadharUID || "N/A" },
                  { label: "Nationality", value: adminDetails.nationality || "N/A" },
                  { label: "Sex", value: adminDetails.sex || "N/A" },
                  { label: "Date of Birth", value: adminDetails.dateOfBirth || "N/A" },
                  { label: "Wallet Address", value: adminDetails.walletAddress ? shortenWalletAddress(adminDetails.walletAddress) : "N/A" }
                ].map((item, index) => (
                  <div key={index} className="flex px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                    <span className="w-1/3 text-gray-600">{item.label}:</span>
                    <span className="w-2/3 font-medium text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Past Cases Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
              Past Cases
            </h2>
            
            {adminType === "lawyer" ? (
              <Link to={`/admin/register-new-case`}>
                <button className={`group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg shadow-lg bg-gradient-to-r ${colors.button} ${colors.hover} active:opacity-90 transform transition-all duration-300 hover:scale-105`}>
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
              Register New Case
            </button>
          </Link>
            ) : (
              <button 
                onClick={handleRegisterNewCase}
                className={`group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg shadow-lg bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-75`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Register New Case
              </button>
            )}
        </div>

          <div className="space-y-4">
        {allCasesOnClient.length > 0 ? (
              allCasesOnClient.map((caseInfo, index) => (
                <Link
                key={index}
                  to={`/case-details?caseid=${caseInfo.caseId}&userType=${adminType}`}
                  className="block transform transition-all duration-300 hover:scale-102"
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-2">
                            {caseInfo.caseSubject}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Case ID: {caseInfo.caseId}
                          </p>
                        </div>
                        <div className={`${
                          caseInfo.caseProgress[caseInfo.caseProgress.length - 1].includes("Case terminated")
                            ? "bg-red-100 text-red-800"
                            : `${colors.bg} ${colors.text}`
                        } px-3 py-1 rounded-full text-sm font-medium`}>
                          {caseInfo.caseProgress[caseInfo.caseProgress.length - 1].includes("Case terminated")
                            ? "Closed"
                            : "Pending"}
                        </div>
                    </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="space-y-2">
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Judge: {caseInfo.associatedJudge}
                          </p>
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Filed: {caseInfo.filedOnDate.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center">
                            <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Latest Update: {caseInfo.caseProgress[caseInfo.caseProgress.length - 1]}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={`h-1 w-full bg-gradient-to-r ${colors.button}`}></div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white/80 backdrop-blur-lg rounded-xl p-12 text-center">
                <svg className="w-20 h-20 mx-auto mb-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-xl font-medium text-gray-700 mb-2">No Past Cases Found</p>
                <p className="text-gray-500">Start by registering a new case using the button above.</p>
              </div>
            )}
          </div>
          </div>
      </div>

      <ToastContainer
        position="bottom-right"
        toastClassName={`font-montserrat ${
          adminType === "judge"
            ? "bg-gradient-to-r from-purple-500 to-indigo-600"
            : adminType === "lawyer"
            ? "bg-gradient-to-r from-emerald-500 to-teal-600"
            : "bg-gradient-to-r from-amber-500 to-orange-600"
        } text-white text-center rounded-xl shadow-lg`}
        bodyClassName="text-base p-4"
      />

      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
          background-size: 200% auto;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardComponent;
