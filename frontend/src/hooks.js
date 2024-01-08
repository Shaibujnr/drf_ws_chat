import { useMutation, useQuery } from "react-query";
import {
  authenticateUser,
  fetchMessages,
  messageReceived,
  seeMessage,
  sendMessage,
} from "./service";

export const useAuthenticate = () => {
  return useMutation((userUUID) => authenticateUser(userUUID));
};

export const useMessages = (userUUID, token) => {
  return useQuery(
    ["fetchMessages", fetchMessages, userUUID],
    () => fetchMessages(token),
    {
      refetchOnMount: true, // Fetch data when the component mounts
      refetchOnWindowFocus: false, // Prevent automatic refetching on window focus
    }
  );
};

export const useSendMessage = () => {
  return useMutation(({ token, userUUID, message }) =>
    sendMessage(token, userUUID, message)
  );
};

export const useMessageReceived = () => {
  return useMutation(({ token, messageUUID }) =>
    messageReceived(token, messageUUID)
  );
};

export const useSeeMessage = () => {
  return useMutation(({ token, messageUUID }) =>
    seeMessage(token, messageUUID)
  );
};
