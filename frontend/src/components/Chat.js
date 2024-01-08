import React, { useState, useRef, useEffect } from "react";
import MessageBubble from "./Message";
import { useMessageReceived, useMessages, useSendMessage } from "../hooks";

const Chat = ({ userUUID, withUserUUID, token, onDisconnect }) => {
  const userMessages = useMessages(userUUID, token);
  const sendMessage = useSendMessage();
  const { mutate: sendMessageReceived } = useMessageReceived();
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState(null);

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
            setMessages((prevstate) => {
              const newState = { ...prevstate };
              newState[data.uuid] = data;
              return newState;
            });
          },
        }
      );
      setNewMessage("");
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if (userMessages.isSuccess) {
      const newState = {};
      for (let message of userMessages.data) {
        newState[message.uuid] = message;
      }
      setMessages(newState);
    }
  }, [userMessages.isSuccess, userMessages.data]);

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.REACT_APP_WS_HOST}:${process.env.REACT_APP_WS_PORT}/ws/chat/?token=${token}`
    );

    // Connection opened
    socket.addEventListener("open", (event) => {
      setWs(socket);
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      if (payload.event_type === "new_message") {
        if (!(payload.data.uuid in messages)) {
          setMessages((prevMessages) => {
            const newMessages = { ...prevMessages };
            newMessages[payload.data.uuid] = {
              ...payload.data,
              created_on: new Date(),
            };
            return newMessages;
          });
        }
        sendMessageReceived({ token, messageUUID: payload.data.uuid });
      }
      if (payload.event_type === "delivered") {
        if (payload.data.uuid in messages) {
          setMessages((prevMessages) => {
            const newMessages = { ...prevMessages };
            newMessages[payload.data.uuid] = {
              ...prevMessages[payload.data.uuid],
              is_delivered: true,
            };
            return newMessages;
          });
        }
      }
      if (payload.event_type === "seen") {
        if (payload.data.uuid in messages) {
          setMessages((prevMessages) => {
            const newMessages = { ...prevMessages };
            newMessages[payload.data.uuid] = {
              ...prevMessages[payload.data.uuid],
              is_seen: true,
            };
            return newMessages;
          });
        }
      }
    });

    socket.addEventListener("close", (event) => {
      onDisconnect();
    });
  }, [token, messages, sendMessageReceived, onDisconnect]);

  return (
    <>
      <button
        class="bg-transparent text-blue-500 hover:text-blue-700 py-2 px-4 border border-transparent hover:border-blue-500 rounded"
        onClick={() => ws.close()}
      >
        Disconnect
      </button>
      <div
        className="flex flex-col bg-blue-200 p-2 rounded-md"
        style={{ height: 500 }}
      >
        <div
          className="flex-grow p-2 border-b border-gray-300 overflow-y-auto"
          ref={messagesContainerRef}
        >
          {}
          {Object.values(messages).map((message, index) => (
            <MessageBubble
              key={index}
              token={token}
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
    </>
  );
};

export default Chat;
