import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const Login = props => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChanges = e => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  const handleLogin = e => {
    e.preventDefault();
    axiosWithAuth()
      .post("/api/login", credentials)
      .then(res => {
        //console.log(res);
        localStorage.setItem("token", res.data.payload);
        props.history.push("/bubbles");
      })
      .catch(err => console.log("Error logging in: ", err))
  };

  return (
    <>
      <h1>Welcome to the Bubble App!</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input 
          type="text"
          id="username"
          name="username"
          value={credentials.username}
          onChange={handleChanges}
        />

        <label htmlFor="password">Password</label>
        <input 
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChanges}
        />

        <button type="submit">Log In</button>
      </form>
    </>
  );
};

export default Login;
