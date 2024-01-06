import React from "react";

const MessageBubble = ({ text, sender, timestamp, status, position }) => {
  const isUser = sender === "user";
  const isRightPosition = position === "right";

  const getStatusText = () => {
    switch (status) {
      case "sent":
        return "Sent";
      case "delivered":
        return "Delivered";
      case "read":
        return "Read";
      default:
        return "";
    }
  };

  const formatDate = (timestamp) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(timestamp).toLocaleString(undefined, options);
  };

  return (
    <div
      className={`mb-2 ${
        isRightPosition ? "flex justify-end" : "flex justify-start"
      }`}
    >
      <div
        className={`inline-block p-3 rounded-md ${
          isUser
            ? isRightPosition
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
            : "bg-blue-500 text-white"
        }`}
        style={{ maxWidth: "calc(70% - 1rem)" }} // Adjust the value as needed
      >
        <p className="mb-1 break-all">{text}</p>
        <div className="text-xs text-gray-500">
          {formatDate(timestamp)} | {getStatusText()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
