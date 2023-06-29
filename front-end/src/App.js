import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./comps/Home";
import LoginPage from "./comps/LoginPage";
import RegisterPage from "./comps/RegisterPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
