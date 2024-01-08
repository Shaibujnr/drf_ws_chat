import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSeeMessage } from "../hooks";

const MessageBubble = ({
  uuid,
  text,
  isSender,
  timestamp,
  isDelivered,
  isSeen,
  token,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { mutate: seeMessage } = useSeeMessage();
  const [statusText, setStatusText] = useState("");
  const [markSeen, setMarkSeen] = useState(isSeen);

  const formatDate = (timestamp) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(timestamp).toLocaleString(undefined, options);
  };

  useEffect(() => {
    if (inView && !!uuid && !isSeen && !isSender && !markSeen) {
      seeMessage(
        { token: token, messageUUID: uuid },
        {
          onSuccess: () => {
            setMarkSeen(true);
          },
        }
      );
    }
  }, [inView, uuid, isSeen, statusText, seeMessage, token, isSender, markSeen]);

  useEffect(() => {
    if (isSeen) {
      setStatusText("read");
    } else if (isDelivered) {
      setStatusText("delivered");
    } else if (uuid != null) {
      setStatusText("sent");
    } else {
      setStatusText("pending");
    }
  }, [isSeen, isDelivered, uuid]);

  return (
    <div
      className={`mb-2 ${isSender ? "flex justify-end" : "flex justify-start"}`}
      ref={ref}
    >
      <div
        className={`inline-block p-3 rounded-md ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
        style={{ maxWidth: "calc(70% - 1rem)" }} // Adjust the value as needed
      >
        <p className="mb-1 break-all">{text}</p>
        {isSender && (
          <div className="text-xs text-gray-100">
            {formatDate(timestamp)} | {statusText}
          </div>
        )}
        {!isSender && (
          <div className="text-xs text-gray-500">{formatDate(timestamp)}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
