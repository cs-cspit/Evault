import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Demo data generator
const generateDemoTransactions = () => {
  const demoData = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const riskScore = Math.floor(Math.random() * 4); // 0-3 risk score
    const value = (Math.random() * 10).toFixed(4);
    const timestamp = new Date(now - i * 1000 * 60 * 5); // 5 minutes apart

    demoData.push({
      hash: `0x${Math.random().toString(16).slice(2, 14)}...${Math.random().toString(16).slice(2, 8)}`,
      from: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 8)}`,
      to: Math.random() > 0.1 ? `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 8)}` : 'Contract Creation',
      value: value,
      riskScore: riskScore,
      timestamp: timestamp,
      type: Math.random() > 0.7 ? 'contract' : 'transfer',
      status: Math.random() > 0.2 ? 'confirmed' : 'pending'
    });
  }
  return demoData;
};

const BlockchainMonitor = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timeRange: '24h',
    type: 'all',
    status: 'all'
  });
  const [stats, setStats] = useState({
    totalTransactions: 0,
    highRiskCount: 0,
    averageValue: 0
  });

  // Demo data fetcher
  const fetchDemoTransactions = () => {
    setLoading(true);
    setTimeout(() => {
      const demoTxs = generateDemoTransactions();
      setTransactions(demoTxs);
      
      // Calculate stats
      const highRisk = demoTxs.filter(tx => tx.riskScore > 2).length;
      const avgValue = demoTxs.reduce((acc, tx) => acc + parseFloat(tx.value), 0) / demoTxs.length;
      
      setStats({
        totalTransactions: demoTxs.length,
        highRiskCount: highRisk,
        averageValue: avgValue.toFixed(4)
      });
      
      setLoading(false);
    }, 1000); // Simulate network delay
  };

  useEffect(() => {
    fetchDemoTransactions();
    // Simulate real-time updates
    const interval = setInterval(() => {
      fetchDemoTransactions();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter(tx => {
    if (filters.type === 'high-risk' && tx.riskScore <= 2) return false;
    if (filters.type === 'contract' && tx.type !== 'contract') return false;
    if (filters.status !== 'all' && tx.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Blockchain Transaction Monitor
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and analyze blockchain transactions for potential fraud
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="text-sm text-gray-500 mb-2">Total Transactions</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="text-sm text-gray-500 mb-2">High Risk Transactions</div>
            <div className="text-2xl font-bold text-red-600">{stats.highRiskCount}</div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="text-sm text-gray-500 mb-2">Average Transaction Value</div>
            <div className="text-2xl font-bold text-gray-900">{stats.averageValue} ETH</div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="form-select rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              value={filters.timeRange}
              onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
            <select
              className="form-select rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Transactions</option>
              <option value="high-risk">High Risk Only</option>
              <option value="contract">Contract Interactions</option>
            </select>
            <select
              className="form-select rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value (ETH)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-2">Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <motion.tr
                      key={tx.hash}
                      variants={itemVariants}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {tx.hash}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.from}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            tx.riskScore > 2
                              ? 'bg-red-100 text-red-800'
                              : tx.riskScore > 1
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {tx.riskScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            tx.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.timestamp.toLocaleString()}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlockchainMonitor; 