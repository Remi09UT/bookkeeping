import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import LoginPage from './comps/LoginPage';
import RegisterPage from './comps/RegisterPage';
import { useState } from 'react';


function App() {
  const [credential, setCredential] = useState("");
  return (
    <Router>
      <Routes>
        <Route exact path="/Login" element={<LoginPage credential={credential} setCredential={setCredential}/>} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Home" element={<Home credential={credential}/>} />
      </Routes>
    </Router>
  );
}

export default App;