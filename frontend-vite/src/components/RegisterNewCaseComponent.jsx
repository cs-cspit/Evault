import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import registerNewCase from "../blockchain-api/registerNewCase";
import getAllClients from "../blockchain-api/getAllClients";
import Loader from "./Loader";

const RegisterNewCaseComponent = () => {
  const [formData, setFormData] = useState({
    caseTitle: "",
    caseDescription: "",
    party1UID: "",
    party2UID: "",
  });
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const allClients = await getAllClients();
        setClients(allClients);
        setLoadingClients(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Failed to fetch clients");
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.caseTitle || !formData.caseDescription || !formData.party1UID || !formData.party2UID) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.party1UID === formData.party2UID) {
      toast.error("Party 1 and Party 2 cannot be the same client");
      return;
    }

    setLoading(true);
    try {
      await registerNewCase(
        formData.caseTitle,
        formData.caseDescription,
        formData.party1UID,
        formData.party2UID
      );
      toast.success("Case registered successfully!");
      setFormData({
        caseTitle: "",
        caseDescription: "",
        party1UID: "",
        party2UID: "",
      });
    } catch (error) {
      console.error("Error registering case:", error);
      toast.error("Failed to register case");
    }
    setLoading(false);
  };

  if (loadingClients) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-8">
            Register New Case
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Title
                </label>
                <input
                  type="text"
                  name="caseTitle"
                  value={formData.caseTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter case title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Description
                </label>
                <textarea
                  name="caseDescription"
                  value={formData.caseDescription}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter case description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party 1 (Plaintiff)
                  </label>
                  <select
                    name="party1UID"
                    value={formData.party1UID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Party 1</option>
                    {clients.map((client) => (
                      <option key={client.uid} value={client.uid}>
                        {client.name} (UID: {client.uid})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party 2 (Defendant)
                  </label>
                  <select
                    name="party2UID"
                    value={formData.party2UID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select Party 2</option>
                    {clients.map((client) => (
                      <option key={client.uid} value={client.uid}>
                        {client.name} (UID: {client.uid})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white rounded-lg shadow-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 active:opacity-90 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Register Case
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterNewCaseComponent;
