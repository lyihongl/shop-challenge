import React, { useContext, useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { useLoginMutation } from "../../generated/graphql";
import { UserStateContext } from "../../App";
const LoginScreen = () => {
  const [login] = useLoginMutation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const userStateContext = useContext(UserStateContext);
  const handleLogin = async () => {
    const res = await login({ variables: { username, password } });
    if (!res.errors && res.data?.login.user?.id) {
      userStateContext.setUserid(res.data.login.user.id);
    }
  };
  return (
    <form onSubmit={handleLogin}>
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
          <Button type="submit" onClick={handleLogin}>
            Login
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginScreen;
