import React from 'react';

function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50"></div>
        <div className="container mx-auto px-6 relative">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
            About E-Vault
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto animate-fade-in-delayed">
            A revolutionary blockchain-based platform transforming the Indian Judiciary System
          </p>
        </div>
      </section>

      {/* MetaMask Setup Guide */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Setting Up MetaMask Wallet
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 transform hover:-translate-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Step 1: Install MetaMask</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">MetaMask is your gateway to blockchain interaction. Follow these simple steps:</p>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                    <li className="transition-colors duration-200 hover:text-blue-600">
                      Visit the <a href="https://metamask.io/download/" className="text-blue-600 hover:text-blue-700 font-medium" target="_blank" rel="noreferrer">MetaMask website</a>
                    </li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Click "Install MetaMask for Chrome"</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Add the extension to your browser</li>
                  </ol>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl h-48 w-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 transform hover:-translate-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:order-last">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Step 2: Create a Wallet</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">Set up your new MetaMask wallet securely:</p>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                    <li className="transition-colors duration-200 hover:text-blue-600">Click the MetaMask icon in your browser</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Click "Get Started" and "Create a Wallet"</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Create a strong password</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Securely store your Secret Recovery Phrase</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Verify your phrase to complete setup</li>
                  </ol>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl h-48 w-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 transform hover:-translate-y-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Step 3: Connect to E-Vault</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">Link your wallet to access E-Vault features:</p>
                  <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                    <li className="transition-colors duration-200 hover:text-blue-600">Log into MetaMask</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Return to E-Vault</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Click "Connect MetaMask"</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Approve the connection request</li>
                    <li className="transition-colors duration-200 hover:text-blue-600">Start using E-Vault features</li>
                  </ol>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl h-48 w-full flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Importance */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Importance to the Indian Judiciary System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Security & Data Integrity</h3>
              <p className="text-gray-600 leading-relaxed">Blockchain technology ensures tamper-proof storage of legal records, preventing unauthorized modifications and maintaining the integrity of case documents.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Transparency & Accessibility</h3>
              <p className="text-gray-600 leading-relaxed">E-Vault provides transparent access to case information for authorized parties while maintaining appropriate privacy controls.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mx-auto mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Efficiency & Reduced Backlog</h3>
              <p className="text-gray-600 leading-relaxed">By streamlining case registration, document management, and judge allocation, E-Vault addresses one of the biggest challenges facing the Indian judiciary – case backlogs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Key Features of E-Vault
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              title="Seamless Registration" 
              description="Streamlined registration process for clients, lawyers, and judges, ensuring easy onboarding for all stakeholders."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Legal Case Registration" 
              description="Secure registration of legal cases between clients with their respective lawyers, maintaining all relevant case details."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Automatic Judge Allocation" 
              description="Fair and transparent allocation of judges to registered cases, preventing bias and ensuring equitable distribution of judicial workload."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Secure Login System" 
              description="Dual authentication using Aadhar UID and MetaMask wallet for enhanced security and access control."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Case Progress Tracking" 
              description="Real-time updates on case progress by allocated judges and lawyers, providing transparency to all stakeholders."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Document Management (IPFS)" 
              description="Secure document storage using IPFS (InterPlanetary File System), ensuring immutability and distributed access to case documents."
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start">
        <div className="mr-4 flex-shrink-0">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;