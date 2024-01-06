import React from "react";
import { useAuthenticate } from "../hooks";

const Connect = ({ userUUID, onSuccess, onError }) => {
  const connect = useAuthenticate();

  const onConnect = () => {
    connect.mutate(userUUID, {
      onSuccess: (data, error, variables, context) => {
        onSuccess(data);
      },
      onError: (error, variables, contxt) => {
        onError(error);
      },
    });
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-200">
      <div className="text-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={onConnect}
        >
          Connect
        </button>
        {connect.isLoading && <div>connecting...</div>}
      </div>
    </div>
  );
};

export default Connect;
