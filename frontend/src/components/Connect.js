import React from "react";

const Connect = ({ userUUID }) => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-200">
      <div className="text-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Connect
        </button>
        <div>connecting...</div>
      </div>
    </div>
  );
};

export default Connect;
