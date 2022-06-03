import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CreateRat from "./components/createRat/CreateRat";
import MyRats from "./components/myRats/MyRats";
import RatDesigner from "./components/createRat/RatDesigner";
import Login from "./components/login/Login";
import Cemetery from "./components/myRats/Cemetery";
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/myrats" element={<MyRats />} />
          <Route path="/ratdesigner" element={<RatDesigner />} />
          //<Route path="/" element={<CreateRat />} />
          //<Route path="/myrats" element={<MyRats/>} />
          <Route path="/ratdesigner" element={<RatDesigner/>} />
          <Route path="/cemetery" element={<Cemetery/>} />
        </Routes>
        <Footer />
      </Router>
    </ApolloProvider>
  );
}

export default App;
