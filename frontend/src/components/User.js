import React, { useState } from "react";
import Chat from "./Chat";
import Connect from "./Connect";

const User = ({ userUUID, withUserUUID }) => {
  const [token, setToken] = useState(null);

  const onSuccess = (token) => {
    setToken(token);
  };

  const onError = (error) => {
    console.log({ error });
  };

  if (token != null) {
    return (
      <Chat token={token} userUUID={userUUID} withUserUUID={withUserUUID} />
    );
  } else {
    return (
      <Connect userUUID={userUUID} onSuccess={onSuccess} onError={onError} />
    );
  }
};

export default User;
