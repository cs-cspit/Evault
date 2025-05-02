import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingTransition from './components/LoadingTransition';
import ProtectedRoute from './components/ProtectedRoute';
import BlockchainMonitor from './components/BlockchainMonitor';

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import InfoPage from "./components/info";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import TestPage from "./pages/TestPage";
import GetCaseDetailsPage from "./pages/GetCaseDetailsPage";
import CaseDetailsPage from "./pages/CaseDetailsPage";
import RegisterNewLegalCasePage from "./pages/RegisterNewLegalCasePage";
import SearchCaseDetailsComponent from './components/SearchCaseDetailsComponent';

// import MixedSignUpComponent from "./components/MixedSignUpComponent";

const App = () => {
  const location = useLocation();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return <LoadingTransition />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-col min-h-screen w-full relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Elements */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tl from-blue-100/30 via-transparent to-indigo-100/30"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Mesh gradient effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>

        {/* Animated background shapes */}
        <motion.div 
          className="fixed top-0 -right-64 w-128 h-128 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="fixed -bottom-32 -left-32 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col min-h-screen w-full">
          <Navbar />
          <motion.main 
            className="flex-grow w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Suspense fallback={<LoadingTransition />}>
              <Routes location={location} key={location.pathname}>
                {/* Public Routes - Accessible to all */}
                <Route path="/" element={<HomePage />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/:initialFormType" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signup/:initialFormType" element={<SignUpPage />} />
                <Route path="/search" element={<SearchCaseDetailsComponent />} />
                <Route path="/blockchain-monitor" element={<BlockchainMonitor />} />

                {/* Protected Routes - Accessible to authenticated users (all types) */}
                <Route
                  path="/get-case-details"
                  element={
                    <ProtectedRoute>
                      <GetCaseDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/case-details"
                  element={
                    <ProtectedRoute>
                      <CaseDetailsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Judge Routes */}
                <Route
                  path="/admin/:adminType/:aadharUID"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/blockchain-monitor"
                  element={
                    <ProtectedRoute>
                      <BlockchainMonitor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/judge/*"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />

                {/* Lawyer Routes */}
                <Route
                  path="/lawyer/*"
                  element={
                    <ProtectedRoute>
                      <CaseDetailsPage />
                    </ProtectedRoute>
                  }
                />
                {/* Register New Case - Accessible to Lawyers */}
                <Route
                  path="/admin/register-new-case"
                  element={
                    <ProtectedRoute>
                      <RegisterNewLegalCasePage />
                    </ProtectedRoute>
                  }
                />

                {/* Test Route (Protected) */}
                <Route
                  path="/test"
                  element={
                    <ProtectedRoute>
                      <TestPage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect logout to home */}
                <Route path="/logout" element={<HomePage />} />
              </Routes>
            </Suspense>
          </motion.main>
          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
