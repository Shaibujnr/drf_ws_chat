import axios from "axios";

export const authenticateUser = async (userUUID) => {
  const result = await axios.post(
    `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/auth/`,
    {
      user_uuid: userUUID,
    }
  );
  return result.data.token;
};

export const sendMessage = async (token, userUUID, message) => {
  const result = await axios.post(
    `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/messages/`,
    {
      message: message,
      to_uuid: userUUID,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return result.data;
};

export const messageReceived = async (token, messageUUID) => {
  const result = await axios.post(
    `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/received/`,
    {
      message_uuid: messageUUID,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return result.data;
};

export const seeMessage = async (token, messageUUID) => {
  const result = await axios.post(
    `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/seen/`,
    {
      message_uuid: messageUUID,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return result.data;
};

export const fetchMessages = async (token) => {
  const result = await axios.get(
    `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/messages/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return result.data;
};
