import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin w-16 h-16"></div>
        {/* Middle ring */}
        <div className="absolute inset-2 rounded-full border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin w-12 h-12" style={{ animationDirection: 'reverse' }}></div>
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin w-8 h-8"></div>
        {/* Center dot */}
        <div className="absolute inset-[18px] rounded-full bg-white animate-pulse"></div>
      </div>
      <div className="mt-6 text-white font-semibold tracking-wider animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default Loader;
