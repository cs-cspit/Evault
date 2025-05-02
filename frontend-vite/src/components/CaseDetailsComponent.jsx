import React, {useState, useEffect} from "react";
import getCaseDetailsByCaseID from "../blockchain-api/getCaseDetailsByCaseID";
import FormData from "form-data";
import secureStorage from "@/utils/secureStorage";
import { useSearchParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import updateCaseProgressWithCaseId from "@/blockchain-api/updateCaseProgressWithCaseId";
import getJudgeDetailsByUID from "@/blockchain-api/getJudgeDetailsByUID";
import Loader from "./Loader";
import getLawyerDetailsByUID from "@/blockchain-api/getLawyerDetailsByUID";
import {superShortenWalletAddress} from "@/lib/utils";

import {
  ToastContainer, toast
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import getClientDetailsByUID from "@/blockchain-api/getClientDetailsByUID";
import uploadCaseDocument from "@/blockchain-api/uploadCaseDocumentUsingVerbwire";

const CaseDetailsComponent = ({caseID}) => {
  const [searchParams] = useSearchParams();
  const userTypeFromUrl = searchParams.get("userType");

  const [caseDetails, setCaseDetails] = useState(null);
  const [newProgress, setNewProgress] = useState("");

  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState([]);
  const [judgeDetails, setJudgeDetails] = useState({name: "", UID: 0});
  const [party1Details, setParty1Details] = useState({name: "", UID: ""});
  const [party2Details, setParty2Details] = useState({name: "", UID: ""});

  const [userAddress, setUserAddress] = useState("");

  const [isUserJudge, setIsUserJudge] = useState(false);
  const [isUserLawyer, setIsUserLawyer] = useState(false);
  const [isUserClient, setIsUserClient] = useState(false);

  const [progressIsUpdating, setProgressIsUpdating] = useState(false);
  const [uploadDocumentDialogBoxIsOpen, setUploadDocumentDialogBoxIsOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const getRoleColors = () => {
    // First try to get userType from URL, then fallback to secureStorage
    const userType = userTypeFromUrl || secureStorage.getItem("userType");
    switch (userType) {
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

  useEffect(() => {
    // Function to fetch case details based on the caseID
    const fetchCaseDetails = async () => {
      try {
        setLoading(true);
        const fetchedCaseDetails = await getCaseDetailsByCaseID(caseID);
        setCaseDetails(fetchedCaseDetails);

        const judgeDetails = await getJudgeDetailsByUID(
          fetchedCaseDetails.associatedJudge,
          "name_UID_walletAddress"
        );

        const party1Details = await getClientDetailsByUID(
          fetchedCaseDetails.UIDOfParty1,
          "name_UID_walletAddress"
        );
        setParty1Details({
          name: party1Details.name,
          UID: party1Details.UID
        });

        const party2Details = await getClientDetailsByUID(
          fetchedCaseDetails.UIDOfParty2,
          "name_UID_walletAddress"
        );
        setParty2Details({
          name: party2Details.name,
          UID: party2Details.UID
        });

        // fetchingLawyerNames
        const lawyerDetails = await Promise.all(
          fetchedCaseDetails.associatedLawyers.map(async (lawyerUID) => {
            const lawyerInfo = await getLawyerDetailsByUID(
              lawyerUID,
              "name_UID_walletAddress"
            );
            return {
              uid: lawyerUID,
              name: lawyerInfo.name,
              walletAddress: lawyerInfo.walletAddress,
            };
          })
        );
        setLawyers(lawyerDetails);

        // Set user roles based on URL parameter first, then localStorage
        const userType = userTypeFromUrl || secureStorage.getItem("userType");
        
        setIsUserJudge(userType === "judge");
        setIsUserLawyer(userType === "lawyer");
        setIsUserClient(userType === "client");

        setJudgeDetails({
          name: judgeDetails.name,
          UID: judgeDetails.UID,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error while fetching case details:", error);
        setLoading(false);
        toast.error("Error loading case details");
      }
    };

    const fetchCurrentWalletAddress = async () => {
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setUserAddress(accounts[0]);
          return accounts[0];
        }
      } catch (error) {
        console.error("Error fetching user address:", error);
        toast.error("Error connecting to wallet");
      }
    };

    const init = async () => {
      setLoading(true);
      await fetchCurrentWalletAddress();
      await fetchCaseDetails();
    };

    init();

  }, [caseID, userTypeFromUrl]); // Only depend on caseID and userAddress

  // Function to create a snake-like pattern of progress cells
  const createSnakePattern = (progressArray) => {
    const rows = [];
    let numColumns;

    if (window.innerWidth < 768) {
      numColumns = 2;
    } else {
      numColumns = 3;
    }

    for (let i = 0; i < progressArray.length; i += numColumns) {
      const row = progressArray.slice(i, i + numColumns);

      // if ((i / numColumns) % 2 === 1) {
      //   // Reverse order for odd rows to create a snake pattern
      //   row.reverse();
      // }

      rows.push(row);
    }

    return rows;
  };

  const handleCaseProgressUpdate = async (e) => {
    e.preventDefault();

    if (!newProgress) {
      alert("Add a new progress to continue !");
      return;
    }

    const formData = {
      newProgress,
    };

    const isProgressUpdatedStatus = await updateCaseProgressWithCaseId(
      caseID,
      formData.newProgress
    );

    // closingDialogBox
    setProgressIsUpdating(false);
    // resettingFormValue
    setNewProgress("");

    toast(`${isProgressUpdatedStatus}`, {
      position: "top-right",
      autoClose: 1500,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: false,
      hideProgressBar: true,
      closeButton: false,
    });
  };

  const hanleCaseTermination = async (e) => {
    e.preventDefault();

    let isProgressUpdatedStatus;

    if (
      caseDetails.caseProgress[caseDetails.caseProgress.length - 1].includes(
        "Case terminated"
      )
    ) {
      toast(`Case already terminated ❌`, {
        position: "top-right",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: false,
        hideProgressBar: true,
        closeButton: false,
      });
      // closingDialogBox
      setProgressIsUpdating(false);

      return;
    }

    if (lawyers[0].walletAddress.toLowerCase() === userAddress.toLowerCase()) {
      isProgressUpdatedStatus = await updateCaseProgressWithCaseId(
        caseID,
        `Case terminated by ${lawyers[0].name}`
      );
    } else {
      isProgressUpdatedStatus = await updateCaseProgressWithCaseId(
        caseID,
        `Case terminated by ${lawyers[1].name}`
      );
    }

    // closingDialogBox
    setProgressIsUpdating(false);

    toast(`${isProgressUpdatedStatus}`, {
      position: "top-right",
      autoClose: 1500,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      icon: false,
      hideProgressBar: true,
      closeButton: false,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "");

    // Show image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      setUploadingDocument(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const isFileAdded = await uploadCaseDocument(caseID, formData);

      // resettingToInitialValues
      setFileName("");
      setSelectedFile(null);
      setImagePreview(null);
      setUploadDocumentDialogBoxIsOpen(false);
      setUploadingDocument(false);

      // Customization: https://fkhadra.github.io/react-toastify/how-to-style/
      toast(`${isFileAdded}`, {
        position: "top-right",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: false,
        hideProgressBar: true,
        closeButton: false,
      });
    } else {
      console.warn("No file selected for upload.");
    }
  };

  if (loading || !caseDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="relative">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-spin-slow">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className={`absolute w-32 h-32 rounded-full blur-xl opacity-20 animate-pulse ${
                  index === 0 
                    ? "bg-blue-400 top-1/4 left-1/4" 
                    : index === 1 
                    ? "bg-sky-400 top-1/2 right-1/4" 
                    : "bg-indigo-400 bottom-1/4 left-1/3"
                }`}
              />
            ))}
          </div>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {/* Dynamic grid pattern */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}></div>

          {/* Floating elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
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
      </div>

      {/* Main content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="mb-8 text-center transform animate-fadeIn">
          <div className={`inline-flex items-center px-6 py-3 rounded-full ${colors.bg} ${colors.text} mb-6 animate-bounce-gentle`}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Login Successful</span>
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent animate-gradient`}>
            Welcome to Your Dashboard
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            You're logged in as a{" "}
            <span className={`font-semibold ${colors.text}`}>
              {isUserJudge ? "Judge" : isUserLawyer ? "Lawyer" : "Client"}
            </span>. 
            Manage your cases and documents all in one place.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className={`p-6 rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300 ${colors.bg} ${colors.text}`}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                {caseDetails.caseProgress.length}
              </div>
              <div className="text-gray-600">Total Updates</div>
            </div>
            
            <div className={`p-6 rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300 ${colors.bg} ${colors.text}`}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                {caseDetails.caseDocumentHash.length}
              </div>
              <div className="text-gray-600">Documents</div>
            </div>
            
            <div className={`p-6 rounded-2xl bg-white/80 backdrop-blur-lg shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-300 ${colors.bg} ${colors.text}`}>
              <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                {lawyers.length}
              </div>
              <div className="text-gray-600">Associated Lawyers</div>
            </div>
          </div>
        </div>

        {/* Existing content */}
        <div className="space-y-12">
          {/* Role-specific background patterns */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {isUserJudge && (
              <>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-[60%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-indigo-200/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
              </>
            )}
            {isUserLawyer && (
              <>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-emerald-200/20 to-transparent rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-[60%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-green-200/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-gradient-to-br from-teal-200/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
              </>
            )}
            {!isUserJudge && !isUserLawyer && (
              <>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-[60%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-orange-200/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-[30%] left-[60%] w-[30%] h-[30%] bg-gradient-to-br from-yellow-200/20 to-transparent rounded-full blur-3xl animate-blob animation-delay-4000"></div>
              </>
            )}
          </div>

          {/* Main content */}
          <div className="w-full max-w-7xl mx-auto z-10">
            {/* Role Badge */}
            <div className="flex justify-center mb-8">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${colors.bg} ${colors.text} shadow-lg transform hover:scale-105 transition-all duration-300`}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isUserJudge ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H18" />
                  ) : isUserLawyer ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  )}
                </svg>
                <span className="font-semibold">
                  {isUserJudge ? "Judge Dashboard" : isUserLawyer ? "Lawyer Dashboard" : "Client Dashboard"}
                </span>
              </div>
            </div>

            {/* Header with role-specific styling */}
            <div className="mb-12 text-center">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 text-black drop-shadow-lg`}>
                Case Details
              </h1>
              <div className={`w-32 h-1 mx-auto rounded-full ${colors.border}`}></div>
            </div>

            {/* Case Information Section with role-specific accents */}
            <div className="mb-12">
              <h2 className={`text-3xl font-bold mb-6 text-black`}>
                Case Information
              </h2>
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="transition-all hover:bg-blue-50/50">
                      <td className="font-montserrat p-6 w-1/3 border-b border-gray-100 font-semibold text-black">
                        Case ID
                      </td>
                      <td className="font-montserrat p-6 w-2/3 border-b border-gray-100 text-black">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                          #{caseDetails.caseId}
                        </span>
                      </td>
                    </tr>
                    <tr className="transition-all hover:bg-blue-50/50">
                      <td className="font-montserrat p-6 w-1/3 border-b border-gray-100 font-semibold text-black">
                        Party 1
                      </td>
                      <td className="font-montserrat p-6 w-2/3 border-b border-gray-100 text-black">
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{party1Details.name}</span>
                          <span className={`text-xs ${colors.text} bg-gray-100 px-2 py-1 rounded-full`}>
                            UID: {party1Details.UID}
                          </span>
                        </span>
                      </td>
                    </tr>
                    <tr className="transition-all hover:bg-blue-50/50">
                      <td className="font-montserrat p-6 w-1/3 border-b border-gray-100 font-semibold text-black">
                        Party 2
                      </td>
                      <td className="font-montserrat p-6 w-2/3 border-b border-gray-100 text-black">
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{party2Details.name}</span>
                          <span className={`text-xs ${colors.text} bg-gray-100 px-2 py-1 rounded-full`}>
                            UID: {party2Details.UID}
                          </span>
                        </span>
                      </td>
                    </tr>
                    <tr className="transition-all hover:bg-blue-50/50">
                      <td className="font-montserrat p-6 w-1/3 border-b border-gray-100 font-semibold text-black">
                        Filed On Date
                      </td>
                      <td className="font-montserrat p-6 w-2/3 border-b border-gray-100 text-black">
                        {caseDetails.filedOnDate.toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                    <tr className="transition-all hover:bg-blue-50/50">
                      <td className="font-montserrat p-6 w-1/3 border-b border-gray-100 font-semibold text-black">
                        Associated Lawyers
                      </td>
                      <td className="font-montserrat p-6 w-2/3 border-b border-gray-100 text-black">
                        <ul className="space-y-2">
                          {lawyers.map((lawyer, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="font-medium">{lawyer.name}</span>
                              <span className={`text-xs ${colors.text} bg-gray-100 px-2 py-1 rounded-full`}>
                                UID: {lawyer.uid}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                    <tr className="transition-all hover:bg-blue-50/50">
                      <td className="font-montserrat p-6 w-1/3 border-b border-gray-100 font-semibold text-black">
                        Associated Judge
                      </td>
                      <td className="font-montserrat p-6 w-2/3 border-b border-gray-100 text-black">
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{judgeDetails.name}</span>
                          <span className={`text-xs ${colors.text} bg-gray-100 px-2 py-1 rounded-full`}>
                            UID: {judgeDetails.UID}
                          </span>
                        </span>
                      </td>
                    </tr>
                    <tr className="transition-all hover:bg-blue-50/50">
                      <td className="font-montserrat p-6 w-1/3 border-b border-gray-100 font-semibold text-black">
                        Case Subject
                      </td>
                      <td className="font-montserrat p-6 w-2/3 border-b border-gray-100 text-black font-medium">
                        {caseDetails.caseSubject}
                      </td>
                    </tr>
                    <tr className="transition-all hover:bg-blue-50/50">
                      <td className="font-montserrat p-6 w-1/3 border-b border-gray-100 font-semibold text-black">
                        Latest Case Update
                      </td>
                      <td className="font-montserrat p-6 w-2/3 border-b border-gray-100">
                        <span className={`inline-block px-4 py-2 rounded-lg ${colors.bg} ${colors.text} font-medium`}>
                          {caseDetails.caseProgress[caseDetails.caseProgress.length - 1]}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Case Progress Section with role-specific features */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className={`text-3xl font-bold text-black`}>
                  Case Progress
                </h2>
                <div className="flex-shrink-0">
                  {isUserJudge ? (
                    <Dialog open={progressIsUpdating} onOpenChange={setProgressIsUpdating}>
                      <DialogTrigger asChild>
                        <button className={`group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg shadow-2xl bg-gradient-to-r ${colors.button} ${colors.hover} active:opacity-90 transform transition-all duration-300 hover:scale-105`}>
                          <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Update Progress
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-0 max-w-lg mx-auto">
                        <DialogHeader>
                          <DialogTitle className={`text-2xl font-bold text-black`}>Update Case Progress</DialogTitle>
                          <DialogDescription className="text-gray-600">
                            All updates will be added to the case progress timeline.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCaseProgressUpdate}>
                          <div className="flex pb-3 md:pb-5 justify-center">
                            <textarea
                              type="text"
                              className="w-[95%] border border-gray-200 rounded-lg py-3 px-4 md:text-sm text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              placeholder="Enter the case update here..."
                              value={newProgress}
                              onChange={(e) => setNewProgress(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <DialogFooter className="text-center items-center justify-center">
                            <button
                              type="submit"
                              className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white py-3 px-6 rounded-lg md:text-sm text-xs shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                              Update Progress
                            </button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caseDetails.caseProgress.map((progress, index) => (
                  <div
                    key={index}
                    className={`transform transition-all duration-300 hover:scale-105 ${
                      index === caseDetails.caseProgress.length - 1
                        ? `col-span-full bg-gradient-to-r from-blue-700 to-blue-600 text-white`
                        : "bg-white/95 border border-gray-200"
                    } rounded-2xl shadow-lg backdrop-blur-lg p-6 animate-fadeIn relative overflow-hidden`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className={`font-medium mb-2 ${
                          index === caseDetails.caseProgress.length - 1
                            ? "text-white text-lg"
                            : "text-gray-800"
                        }`}>{progress}</p>
                        <div className={`flex items-center text-sm ${
                          index === caseDetails.caseProgress.length - 1
                            ? "text-blue-100"
                            : "text-gray-600"
                        }`}>
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {superShortenWalletAddress(caseDetails.caseProgressIssuer[index])}
                        </div>
                      </div>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        index === caseDetails.caseProgress.length - 1
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        #{index + 1}
                      </span>
                    </div>
                    {index === caseDetails.caseProgress.length - 1 && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-400 animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Case Documents Section with role-specific features */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className={`text-3xl font-bold text-black`}>
                  Case Documents
                </h2>
                
                {/* Upload Button - Always visible for lawyers */}
                {userTypeFromUrl === "lawyer" && (
                  <Dialog
                    open={uploadDocumentDialogBoxIsOpen}
                    onOpenChange={setUploadDocumentDialogBoxIsOpen}
                  >
                    <DialogTrigger asChild>
                      <button className={`group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg shadow-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 hover:from-sky-700 hover:via-sky-600 hover:to-sky-500 active:opacity-90 transform transition-all duration-300 hover:scale-105`}>
                        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload Documents
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-0 max-w-lg mx-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-black">Upload Case Document</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Upload documents related to this case.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleFileUpload} className="w-full">
                        <div className="flex flex-col pb-3 md:pb-5 justify-center items-center w-full">
                          <div className="flex rounded-sm items-center justify-center pb-2 md:w-[95%]">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Image Preview"
                                className="w-full md:h-[200px] h-[150px] object-cover p-1 bg-white rounded-sm"
                              />
                            ) : (
                              <div className="w-full md:h-[200px] h-[150px] bg-gray-100 rounded-sm flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="flex md:w-[95%] w-full justify-center items-center">
                            <input
                              type="file"
                              id="fileInput"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <label htmlFor="fileInput" className="flex w-full">
                              <span
                                className="flex bg-white w-2/3 rounded-l-sm text-center items-center justify-center md:text-sm text-xs p-2 border border-r-0"
                              >
                                {fileName || "No file selected"}
                              </span>
                              <span className="bg-sky-500 hover:bg-sky-400 text-white font-medium py-2 px-4 w-1/3 rounded-r-sm text-center md:text-sm text-xs cursor-pointer transition-colors duration-300">
                                Browse
                              </span>
                            </label>
                          </div>
                        </div>
                        <DialogFooter className="text-center items-center justify-center">
                          <button
                            type="submit"
                            disabled={!selectedFile || uploadingDocument}
                            className={`bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white py-3 px-6 rounded-lg md:text-sm text-xs shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {uploadingDocument ? "Uploading..." : "Upload Document"}
                          </button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {caseDetails.caseDocumentHash.length > 0 ? (
      caseDetails.caseDocumentHash.map((imageUrl, index) => {
        const fullImageUrl = `https://gateway.pinata.cloud/ipfs/${imageUrl}`;
        
        return (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div
                className="group relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fadeIn cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={fullImageUrl}
                    alt={`Document ${index + 1}`}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className={`p-4 bg-gradient-to-t ${
                  isUserJudge 
                    ? "from-purple-900/50"
                    : isUserLawyer
                    ? "from-emerald-900/50"
                    : "from-amber-900/50"
                } to-transparent absolute bottom-0 left-0 right-0 text-white`}>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm opacity-75">
                      {superShortenWalletAddress(caseDetails.caseDocumentUploader[index])}
                    </span>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border-0 max-w-4xl mx-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-black">
                  Document Details
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Uploaded by {superShortenWalletAddress(caseDetails.caseDocumentUploader[index])}
                </DialogDescription>
              </DialogHeader>
              <div className="w-full max-h-[70vh] flex items-center justify-center">
                <img
                  src={fullImageUrl}
                  alt={`Document ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <DialogFooter>
                <a 
                  href={fullImageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Open in Full Size
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })
    ) : (
      <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-lg rounded-2xl border-2 border-dashed border-gray-200">
        <svg className={`w-16 h-16 mb-4 ${
          isUserJudge 
            ? "text-purple-400"
            : isUserLawyer
            ? "text-emerald-400"
            : "text-amber-400"
        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 text-lg font-medium">No documents yet</p>
        <p className="text-gray-400 text-sm mt-1">Upload case documents to get started</p>
      </div>
    )}
  </div>
</div>
          </div>
        </div>
      </div>

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

      <ToastContainer
        position="bottom-right"
        toastClassName={`font-montserrat ${
          isUserJudge 
            ? "bg-gradient-to-r from-purple-500 to-indigo-600"
            : isUserLawyer
            ? "bg-gradient-to-r from-emerald-500 to-teal-600"
            : "bg-gradient-to-r from-amber-500 to-orange-600"
        } text-white text-center rounded-xl shadow-lg`}
        bodyClassName="text-base p-4"
      />
    </div>
  );
};

export default CaseDetailsComponent;
