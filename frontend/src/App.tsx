import React, { createContext, Suspense, useEffect, useState } from "react";
import "./App.css";
import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import WaitFor from "./components/WaitFor";
import NotLoggedInScreen from "./app/NotLoggedInScreen";
import ImageScreen from "./app/ImageScreen";

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
  me: string;
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
    } else {
      setUserid(loginData.me);
    }
  }, [loginData, checkLoginLoading, loginError]);

  const apiStatusMap = {
    error: "error",
    loading: "loading",
    complete: "complete",
  };

  const apiStatus = (): string => {
    if (loginError && loginError.message !== "not auth") {
      return apiStatusMap.error;
    } else if (checkLoginLoading) {
      return apiStatusMap.loading;
    } else {
      return apiStatusMap.complete;
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <ApolloProvider client={client}>
        <UserStateContext.Provider value={{ userid, setUserid }}>
          <WaitFor
            apiStatus={apiStatus()}
            apiStatusMap={apiStatusMap}
            onError={<>An error has occured</>}
            fallback={<>loading...</>}
          >
            {userid === "" ? <NotLoggedInScreen /> : <ImageScreen />}
          </WaitFor>
        </UserStateContext.Provider>
      </ApolloProvider>
    </div>
  );
}

export default App;
