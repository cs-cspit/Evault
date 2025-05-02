import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import secureStorage from "@/utils/secureStorage";
import { toast } from "react-toastify";

import indianJudiciaryLogo from "../assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [metamaskAccount, setMetamaskAccount] = useState("");
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check login state and metamask connection on initial load
  useEffect(() => {
    checkLoginState();
    checkMetamaskConnection();
  }, []);

  // Re-check login state when location/route changes
  useEffect(() => {
    checkLoginState();
  }, [location.pathname]);

  const checkLoginState = async () => {
    try {
      const isLoggedInStr = secureStorage.getItem("isLoggedIn");
      const storedUserType = secureStorage.getItem("userType");
      const walletAddress = secureStorage.getItem("walletAddress");
      const aadharUID = secureStorage.getItem("aadharUID");
      const token = secureStorage.getItem("token");
      
      // Convert to boolean properly - check for string "true" or boolean true
      const loggedIn = isLoggedInStr === "true" || isLoggedInStr === true;
      
      console.log("Login state values:", { isLoggedInStr, token, walletAddress, storedUserType });
      
      if (loggedIn && token) {
        setIsLoggedIn(true);
        setUserType(storedUserType);
        console.log("User is logged in:", { userType: storedUserType });
      } else {
        console.log("User is not logged in, missing credentials");
        setIsLoggedIn(false);
        setUserType(null);
      }
    } catch (error) {
      console.error("Error checking login state:", error);
      setIsLoggedIn(false);
      setUserType(null);
    }
  };

  const checkMetamaskConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setMetamaskAccount(accounts[0]);
          setIsMetamaskConnected(true);
        } else {
          setIsMetamaskConnected(false);
        }
      } catch (error) {
        console.error("Error checking Metamask connection:", error);
        setIsMetamaskConnected(false);
      }
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      setMetamaskAccount("");
      setIsMetamaskConnected(false);
      await handleLogout(false); // Don't redirect automatically
    } else {
      const newAddress = accounts[0];
      setMetamaskAccount(newAddress);
      secureStorage.setItem("walletAddress", newAddress);
      setIsMetamaskConnected(true);
      await checkLoginState();
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setMetamaskAccount(address);
        secureStorage.setItem("walletAddress", address);
        setIsMetamaskConnected(true);
        await checkLoginState();
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast.error("Failed to connect wallet. Please try again.");
      }
    }
  };

  const handleLogout = async (shouldRedirect = true) => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    try {
      setIsLoggingOut(true);
      toast.info("Logging out...");

      // Disconnect from MetaMask if connected
      if (isMetamaskConnected) {
        try {
          // Clear MetaMask connection
          setMetamaskAccount("");
          setIsMetamaskConnected(false);
        } catch (error) {
          console.error("Error disconnecting from MetaMask:", error);
        }
      }

      // Clear all secure storage items
      const itemsToRemove = ["token", "userType", "walletAddress", "aadharUID", "userUID", "isLoggedIn"];
      itemsToRemove.forEach(item => {
        try {
          secureStorage.removeItem(item);
        } catch (error) {
          console.error(`Error removing ${item}:`, error);
        }
      });
      
      // Reset all states
      setIsLoggedIn(false);
      setUserType(null);

      // Show success message
      toast.success("Successfully logged out!");

      // Redirect to home page if shouldRedirect is true
      if (shouldRedirect) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error during logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src={indianJudiciaryLogo}
              alt="Indian Judiciary Logo"
              className="w-12 h-12 object-contain mr-3 transition-transform duration-300 hover:scale-105"
            />
            <div className="font-montserrat text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <Link to="/" className="hover:opacity-80 transition-opacity">Project E-Vault</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className="text-gray-700 font-montserrat hover:text-blue-600 transition-colors duration-200"
            >
              Get Case Details
            </Link>
            <Link
              to="/info"
              className="text-gray-700 font-montserrat hover:text-blue-600 transition-colors duration-200"
            >
              About Evault
            </Link>
            {isLoggedIn ? (
  <>
    {userType === "lawyer" && (
      <Link
        to="/admin/register-new-case"
        className="text-gray-700 font-montserrat hover:text-blue-600 transition-colors duration-200"
      >
        Register New Case
      </Link>
    )}
    <button
      onClick={() => handleLogout(true)}
      disabled={isLoggingOut}
      className={`${
        isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'
      } text-gray-700 font-montserrat transition-colors duration-200 flex items-center`}
    >
      {isLoggingOut ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Logging out...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </>
      )}
    </button>
  </>
) : (
  <Link
    to="/login"
    className="text-gray-700 font-montserrat hover:text-blue-600 transition-colors duration-200 flex items-center"
  >
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
    Login
  </Link>
)}
            
            {!isMetamaskConnected ? (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-montserrat py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect Metamask
              </button>
            ) : (
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-montserrat py-2 px-6 rounded-full shadow-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Connected
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleNavbar}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-white/95 backdrop-blur-md`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/search"
            className="block px-3 py-2 rounded-md text-base font-montserrat text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            Get Case Details
          </Link>
          <Link
            to="/info"
            className="block px-3 py-2 rounded-md text-base font-montserrat text-gray-700 hover:text-blue-600 hover:bg-gray-50"
          >
            About Evault
          </Link>
          {isLoggedIn ? (
            <>
              {userType === "lawyer" && (
                <Link
                  to="/admin/register-new-case"
                  className="block px-3 py-2 rounded-md text-base font-montserrat text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Register New Case
                </Link>
              )}
              <button
                onClick={() => handleLogout(true)}
                disabled={isLoggingOut}
                className={`${
                  isLoggingOut ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600 hover:bg-gray-50'
                } w-full text-left px-3 py-2 rounded-md text-base font-montserrat text-gray-700 flex items-center`}
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </>
                )}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-montserrat text-gray-700 hover:text-blue-600 hover:bg-gray-50 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </Link>
          )}
          {!isLoggedIn && !isMetamaskConnected ? (
            <button
              onClick={connectWallet}
              className="w-full px-3 py-2 rounded-md text-base font-montserrat bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Connect Metamask
            </button>
          ) : (
            <button className="w-full px-3 py-2 rounded-md text-base font-montserrat bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Connected
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import secureStorage from "@/utils/secureStorage";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check login state function - properly handling string conversion
//   const checkLoginState = () => {
//     const token = secureStorage.getItem("token");
//     // When retrieving from storage, need to handle string conversion
//     const storedLoginState = secureStorage.getItem("isLoggedIn");
    
//     // console.log for debugging
//     console.log("Token:", token);
//     console.log("Stored login state:", storedLoginState);
//     console.log("Type of stored login state:", typeof storedLoginState);
    
//     // Check if token exists and login state is explicitly "true"
//     if (token && (storedLoginState === "true" || storedLoginState === true)) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   };

//   // Run checkLoginState on mount and listen for storage changes
//   useEffect(() => {
//     checkLoginState();

//     // Listen for storage changes across tabs/windows
//     const handleStorageChange = (event) => {
//       if (event.key === "isLoggedIn" || event.key === "token") {
//         checkLoginState();
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);

//     // Add an interval to periodically check login state (helps with some browser quirks)
//     const interval = setInterval(checkLoginState, 2000);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);

//   // Handle logout - properly storing string "false"
//   const handleLogout = () => {
//     secureStorage.removeItem("token");
//     // Store as string "false" instead of boolean false
//     secureStorage.setItem("isLoggedIn", "false");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//       <Link to="/" className="text-lg font-bold">My App</Link>
//       <div>
//         {isLoggedIn ? (
//           <button
//             onClick={handleLogout}
//             className="text-gray-700 hover:text-red-600 transition-colors duration-200"
//           >
//             Logout
//           </button>
//         ) : (
//           <Link
//             to="/login"
//             className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
//           >
//             Login
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;  