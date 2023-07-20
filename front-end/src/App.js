import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./comps/Home";
import LoginPage from "./comps/LoginPage";
import RegisterPage from "./comps/RegisterPage";
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
    <Router>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route
          path="/Home"
          element={
            sessionStorage.getItem("bookKeepingCredential") ? (
              <Home />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
    </ChakraProvider>
  );
}

export default App;
