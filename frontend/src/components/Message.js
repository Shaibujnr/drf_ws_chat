import React from "react";

const MessageBubble = ({
  uuid,
  text,
  isSender,
  timestamp,
  isDelivered,
  isSeen,
}) => {
  const getStatusText = () => {
    if (isSeen) {
      return "read";
    } else if (isDelivered) {
      return "delivered";
    } else if (uuid != null) {
      return "sent";
    } else {
      return "pending";
    }
  };

  const formatDate = (timestamp) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(timestamp).toLocaleString(undefined, options);
  };

  return (
    <div
      className={`mb-2 ${isSender ? "flex justify-end" : "flex justify-start"}`}
    >
      <div
        className={`inline-block p-3 rounded-md ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
        style={{ maxWidth: "calc(70% - 1rem)" }} // Adjust the value as needed
      >
        <p className="mb-1 break-all">{text}</p>
        <div
          className={
            isSender ? "text-xs text-gray-100" : "text-xs text-gray-500"
          }
        >
          {formatDate(timestamp)} | {getStatusText()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
