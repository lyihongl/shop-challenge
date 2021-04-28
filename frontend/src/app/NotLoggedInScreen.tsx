import { Button, Grid } from "@material-ui/core";
import React, { useState } from "react";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const NotLoggedInScreen = () => {
  const [screen, setScreen] = useState("");
  const screenMux = () => {
    switch (screen) {
      case "login": {
        return <LoginScreen />;
      }
      case "register": {
        return <RegisterScreen />;
      }
      default: {
        return;
      }
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button onClick={() => setScreen("login")}>Login</Button>
        <Button onClick={() => setScreen("register")}>Register User</Button>
      </Grid>
      <Grid item xs={12}>
        {screenMux()}
      </Grid>
    </Grid>
  );
};

export default NotLoggedInScreen;
