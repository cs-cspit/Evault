import {useState} from "react";
import {ethers} from "ethers";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

import axios from "axios";

import registerToEVault from "../blockchain-api/registerToEVault";

import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {shortenWalletAddress} from "@/lib/utils";
import secureStorage from "@/utils/secureStorage";

const SignUpComponent = ({initialFormType}) => {
  const navigate = useNavigate();

  const [formType, setFormType] = useState(initialFormType || "");
  const [isConnected, setIsConnected] = useState(false);

  const [fullName, setFullName] = useState("");
 // const [religion, setReligion] = useState("");
  const [nationality, setNationality] = useState("");
  const [sex, setSex] = useState("");
  const [dob, setDob] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [aadharUID, setAadharUID] = useState("");
  //const [pan, setPan] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [signingUpAs, setSigningUpAs] = useState("lawyer");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

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

  const connectMetamaskWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setWalletAddress(account);
      setIsConnected(true);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting to Ethereum:", error);
      setIsConnected(false);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const sendOTP = async () => {
    if (!contactNumber) {
      toast.error("Please enter a valid contact number");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/otp/send-otp", {
        contactNumber,
      });
  
      if (response.status === 200) {
        setOtpSent(true);
        toast.success("OTP sent to your WhatsApp!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3000/api/otp/verify-otp", {
        contactNumber,
        otp,
      });
  
      if (response.status === 200) {
        setIsVerified(true);
        toast.success("Phone number verified successfully!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isVerified) {
      toast.error("Please verify your contact number first.");
      return;
    }
  
    if (!fullName || !nationality || !sex || !dob || !contactNumber || !aadharUID) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = {
      fullName,
      
      nationality,
      sex,
      dob,
      contactNumber,
      aadharUID,
   
      walletAddress,
      signingUpAs,
    };

    try {
      await registerToEVault(formData);
      toast.success("Registration successful! Redirecting...");

      // Store encrypted authentication data
      secureStorage.setItem('token', 'authenticated');
      secureStorage.setItem('userUID', aadharUID);
      secureStorage.setItem('userType', signingUpAs);
      secureStorage.setItem('walletAddress', walletAddress);

      // Reset form
      setFullName("");
      //setReligion("");
      setNationality("");
      setSex("");
      setDob("");
      setContactNumber("");
      setAadharUID("");
      // setPan("");
      setWalletAddress("");

      setTimeout(() => {
        navigate(`/admin/${signingUpAs}/${aadharUID}`);
      }, 2000);
    } catch (error) {
      console.error("Error during registration: ", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const renderFormFields = () => {
    switch (formType) {
      case "lawyer":
        return (
          <>
            <div className="md:pb-5 pb-3 flex gap-5">
              <input
                type="text"
                className="border rounded-sm py-2 px-4 w-full"
                placeholder="Enter your full name ?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="md:pb-5 pb-3 flex md:flex-row md:gap-5 gap-3 flex-col items-center">
              {/* <div className="md:w-1/3 w-full">
                <select
                  className="border rounded-sm py-2 px-4 w-full"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                >
                  <option value="">Religion ?</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Islam">Islam</option>
                  <option value="Christianity">Christianity</option>
                </select>
              </div> */}
              <div className="md:w-1/3 w-full">
                <select
                  className="border rounded-sm py-2 px-4 w-full"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                >
                  <option value="">Nationality ?</option>
                  <option value="Indian">Indian</option>
                </select>
              </div>
              <div className="md:w-1/3 w-full">
                <select
                  className="border rounded-sm py-2 px-4 w-full"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value="">Select your sex ?</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Rather not say">Rather not say</option>
                </select>
              </div>
            </div>
            <div className="md:pb-5 pb-3 flex">
              <input
                type="text"
                className="border rounded-sm py-2 px-4 w-full"
                placeholder="Enter your DOB (Date Of Birth) ?"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            {/* <div className="md:pb-5 pb-3 flex">
              <input
                type="text"
                className="border rounded-sm py-2 px-4 w-full"
                placeholder="Enter your contact number ?"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div> */}
            <div className="md:pb-5 pb-3 flex">
            <input
  type="text"
  className="border rounded-sm py-2 px-4 w-full"
  placeholder="Enter your contact number"
  value={contactNumber}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (!value.startsWith("91")) {
      value = "91" + value; // Ensure it starts with 91
    }
    setContactNumber("+" + value); // Append + before 91
  }}
  disabled={otpSent}
/>
<button
  onClick={sendOTP}
  disabled={otpSent}
  className="ml-3 bg-blue-500 text-white px-4 py-2 rounded"
>
  {otpSent ? "OTP Sent" : "Send OTP"}
</button>

</div>

{otpSent && (
  <div className="md:pb-5 pb-3 flex">
    <input
      type="text"
      className="border rounded-sm py-2 px-4 w-full"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <button
      onClick={verifyOTP}
      className="ml-3 bg-green-500 text-white px-4 py-2 rounded"
    >
      Verify OTP
    </button>
  </div>
)}

{isVerified && <p className="text-green-500">✅ OTP Verified Successfully!</p>}

          </>
        );
      case "client":
        return (
          <>
            <div className="mb-5">
              <input
                type="text"
                className="border rounded-lg py-2 px-4 w-full"
                placeholder="Enter your full name ?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="mb-5 flex gap-5">
              {/* <div className="w-1/3">
                <select
                  className="border rounded-lg py-2 px-4 w-full"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                >
                  <option value="">Select your religion ?</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Islam">Islam</option>
                  <option value="Christianity">Christianity</option>
                </select>
              </div> */}
              <div className="w-1/3">
                <select
                  className="border rounded-lg py-2 px-4 w-full"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                >
                  <option value="">Select your nationality ?</option>
                  <option value="Indian">Indian</option>
                </select>
              </div>
              <div className="w-1/3">
                <select
                  className="border rounded-lg py-2 px-4 w-full"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value="">Select your sex ?</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Rather not say">Rather not say</option>
                </select>
              </div>
            </div>
            <div className="mb-5">
              <input
                type="text"
                className="border rounded-lg py-2 px-4 w-full"
                placeholder="Enter your DOB (Date Of Birth) ?"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            {/* <div className="mb-5">
              <input
                type="text"
                className="border rounded-lg py-2 px-4 w-full"
                placeholder="Enter your contact number ?"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div> */}
            
            <div className="md:pb-5 pb-3 flex">
            <input
  type="text"
  className="border rounded-sm py-2 px-4 w-full"
  placeholder="Enter your contact number"
  value={contactNumber}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (!value.startsWith("91")) {
      value = "91" + value; // Ensure it starts with 91
    }
    setContactNumber("+" + value); // Append + before 91
  }}
  disabled={otpSent}
/>
<button
  onClick={sendOTP}
  disabled={otpSent}
  className="ml-3 bg-blue-500 text-white px-4 py-2 rounded"
>
  {otpSent ? "OTP Sent" : "Send OTP"}
</button>

</div>

{otpSent && (
  <div className="md:pb-5 pb-3 flex">
    <input
      type="text"
      className="border rounded-sm py-2 px-4 w-full"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <button
      onClick={verifyOTP}
      className="ml-3 bg-green-500 text-white px-4 py-2 rounded"
    >
      Verify OTP
    </button>
  </div>
)}

{isVerified && <p className="text-green-500">✅ OTP Verified Successfully!</p>}

          </>
        );
      case "judge":
        return (
          <>
            <div className="mb-5">
              <input
                type="text"
                className="border rounded-lg py-2 px-4 w-full"
                placeholder="Enter your full name ?"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="mb-5 flex gap-5">
              {/* <div className="w-1/3">
                <select
                  className="border rounded-lg py-2 px-4 w-full"
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                >
                  <option value="">Select your religion ?</option>
                  <option value="Hinduism">Hinduism</option>
                  <option value="Islam">Islam</option>
                  <option value="Christianity">Christianity</option>
                </select>
              </div> */}
             <div className="w-1/2 md:w-2/3 lg:w-1/2">
  <select
    className="border rounded-lg py-2 px-4 w-full"
    value={nationality}
    onChange={(e) => setNationality(e.target.value)}
  >
    <option value="">Select your nationality?</option>
    <option value="Indian">Indian</option>
  </select>
</div>

              <div className="w-1/3">
                <select
                  className="border rounded-lg py-2 px-4 w-full"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                >
                  <option value="">Select your sex ?</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Rather not say">Rather not say</option>
                </select>
              </div>
            </div>
            <div className="mb-5">
              <input
                type="text"
                className="border rounded-lg py-2 px-4 w-full"
                placeholder="Enter your DOB (Date Of Birth) ?"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            {/* <div className="mb-5">
              <input
                type="text"
                className="border rounded-lg py-2 px-4 w-full"
                placeholder="Enter your contact number ?"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div> */}
            <div className="md:pb-5 pb-3 flex">
            <input
  type="text"
  className="border rounded-sm py-2 px-4 w-full"
  placeholder="Enter your contact number"
  value={contactNumber}
  onChange={(e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (!value.startsWith("91")) {
      value = "91" + value; // Ensure it starts with 91
    }
    setContactNumber("+" + value); // Append + before 91
  }}
  disabled={otpSent}
/>
<button
  onClick={sendOTP}
  disabled={otpSent}
  className="ml-3 bg-blue-500 text-white px-4 py-2 rounded"
>
  {otpSent ? "OTP Sent" : "Send OTP"}
</button>

</div>

{otpSent && (
  <div className="md:pb-5 pb-3 flex">
    <input
      type="text"
      className="border rounded-sm py-2 px-4 w-full"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
    <button
      onClick={verifyOTP}
      className="ml-3 bg-green-500 text-white px-4 py-2 rounded"
    >
      Verify OTP
    </button>
  </div>
)}

{isVerified && <p className="text-green-500">✅ OTP Verified Successfully!</p>}

          </>
        );
      default:
        return null;
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
          {/* Left Section - Role Selection */}
          <motion.div 
            variants={itemVariants}
            className="md:w-2/5 p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Create Account</h2>
            <p className="text-blue-100 mb-8">
              Join E-Vault to securely manage and access your legal documents.
            </p>
            <div className="space-y-4">
              {[
                { type: "lawyer", icon: "⚖️", label: "Register as Lawyer" },
                { type: "client", icon: "👤", label: "Register as Client" },
                { type: "judge", icon: "👨‍⚖️", label: "Register as Judge" }
              ].map(({ type, icon, label }) => (
            <button
                  key={type}
              onClick={() => {
                    setFormType(type);
                    setSigningUpAs(type);
              }}
                  className={`w-full p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                    formType === type
                      ? "bg-white text-blue-600"
                      : "bg-blue-500/20 text-white hover:bg-blue-500/30"
                  }`}
            >
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium">{label}</span>
            </button>
              ))}
            </div>
            <div className="mt-8 text-sm text-blue-100">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:underline">
                Sign in here
              </Link>
          </div>
          </motion.div>

          {/* Right Section - Registration Form */}
          <div className="md:w-3/5 p-8">
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
          </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                  >
                    <option value="">Select nationality</option>
                    <option value="Indian">Indian</option>
                  </select>
          </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Rather not say">Rather not say</option>
                  </select>
        </div>
      </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Number
                </label>
              <input
                type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your Aadhar number"
                value={aadharUID}
                onChange={(e) => setAadharUID(e.target.value)}
              />
            </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number Verification
                </label>
                <div className="flex space-x-4">
              <input
                type="text"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                    value={contactNumber}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (!value.startsWith("91")) value = "91" + value;
                      setContactNumber("+" + value);
                    }}
                    disabled={otpSent}
                  />
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={otpSent}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      otpSent
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {otpSent ? "OTP Sent ✓" : "Send OTP"}
                  </button>
          </div>

                {otpSent && (
                  <div className="flex space-x-4">
              <input
                type="text"
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isVerified}
                    />
                    <button
                      type="button"
                      onClick={verifyOTP}
                      disabled={isVerified}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isVerified
                          ? "bg-green-500 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isVerified ? "Verified ✓" : "Verify OTP"}
                    </button>
                  </div>
                )}
            </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Connection
                </label>
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
          </div>

            <button
              type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
                Create Account
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

export default SignUpComponent;
