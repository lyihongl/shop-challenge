import { Grid, Button, TextField } from "@material-ui/core";
import React, { useState, useContext } from "react";
import { UserStateContext } from "../../App";
import { useRegisterUserMutation } from "../../generated/graphql";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userStateContext = useContext(UserStateContext);
  const [register] = useRegisterUserMutation();
  const handleRegister = async () => {
    const res = await register({ variables: { username, password } });
    if (!res.errors && res.data?.registerUser.user?.id) {
      userStateContext.setUserid(res.data.registerUser.user.id);
    }
  };
  return (
    <form onSubmit={handleRegister}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            label="username"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="password"
            label="password"
            value={password}
            variant="outlined"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit">
            Register
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegisterScreen;
