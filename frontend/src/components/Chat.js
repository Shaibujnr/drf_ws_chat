import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./Message";
import { useMessages, useSendMessage } from "../hooks";

const Chat = ({ userUUID, withUserUUID, token }) => {
  const userMessages = useMessages(userUUID, token);
  const sendMessage = useSendMessage();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesContainerRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      let pendingMessage = {
        message: newMessage,
        uuid: null,
        from_uuid: userUUID,
        is_seen: false,
        is_delivered: false,
        created_on: new Date(),
      };
      sendMessage.mutate(
        { token, userUUID: withUserUUID, message: pendingMessage.message },
        {
          onSuccess: (data) => {
            setMessages([...messages, data]);
          },
        }
      );
      setNewMessage("");
    }
  };

  useEffect(() => {
    // Scroll to the bottom when messages are updated
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (userMessages.isSuccess) {
      setMessages(userMessages.data);
    }
  }, [userMessages.isSuccess, userMessages.data]);

  return (
    <div
      className="flex flex-col bg-blue-200 p-2 rounded-md"
      style={{ height: 500 }}
    >
      <div
        className="flex-grow p-2 border-b border-gray-300 overflow-y-auto"
        ref={messagesContainerRef}
      >
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            text={message.message}
            uuid={message.uuid}
            isSender={message.from_uuid === userUUID}
            isSeen={message.is_seen}
            isDelivered={message.is_delivered}
            timestamp={message.created_on}
          />
        ))}
      </div>
      <div className="mt-1 mb-1" style={{ height: 10 }}></div>
      <div className="mt-auto p-2 flex items-center bg-grey-400">
        <textarea
          className="flex-grow border rounded-md p-2 mr-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
