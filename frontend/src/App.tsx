import React, { createContext, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import LoginScreen from "./app/LoginScreen";
import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import NotLoggedInScreen from "./app/NotLoggedInScreen";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  credentials: "include",
});

const CHECK_LOGIN = gql`
  query {
    me
  }
`;

type LoginCheckResponse = {
  me: String;
};

export interface IUserState {
  userid: string;
  setUserid: (s: string) => void;
}

export const UserStateContext = createContext<IUserState>({
  userid: "",
  setUserid: (s: string) => {},
});

function App() {
  const {
    data: loginData,
    loading: checkLoginLoading,
    error: loginError,
  } = useQuery<LoginCheckResponse>(CHECK_LOGIN, { client });
  const [userid, setUserid] = useState<string>("");

  useEffect(() => {
    if (loginError || !loginData?.me) {
      setUserid("");
    }
  }, [loginData, checkLoginLoading, loginError]);

  return (
    <div style={{ padding: "20px" }}>
      <ApolloProvider client={client}>
        <UserStateContext.Provider value={{ userid, setUserid }}>
          {userid === "" ? <NotLoggedInScreen /> : <div>test</div>}
        </UserStateContext.Provider>
      </ApolloProvider>
    </div>
  );
}

export default App;
