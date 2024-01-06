import axios from "axios";

export const authenticateUser = async (userUUID) => {
  const result = await axios.post("http://localhost:5080/auth/", {
    user_uuid: userUUID,
  });
  return result.data.token;
};

export const sendMessage = async (token, userUUID, message) => {
  const result = await axios.post(
    "http://localhost:5080/messages/",
    {
      message: message,
      to_uuid: userUUID,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return result.data;
};

export const fetchMessages = async (token) => {
  const result = await axios.get("http://localhost:5080/messages/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return result.data;
};
