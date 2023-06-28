import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import RegisterPage from "./RegisterPage";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";

function LoginPage({credential, setCredential}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  useEffect(() => {//credential && (window.location.href = "./Home"); 
  console.log(credential)},[credential]);
  
  function handleLogin() {
    let value = username + " " + password;
    let encodedValue = btoa(value);

    /*
    axios
      .get("http://127.0.0.1:3000/users/login", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedValue}`,
          // Add any additional headers if required
        },
      })
      .then((response) => {
        // Handle success
        console.log(response.data);
        setCredential("fake JWT");
        
      })
      .catch((error) => {
        // Handle error
        console.log(error);
      });*/
    setCredential("fake JWT");
    
  }

  return (
    <MDBContainer fluid>
      <MDBCard className="text-black m-5" style={{ borderRadius: "25px" }}>
        <MDBCardBody>
          <MDBRow>
            <MDBCol
              md="10"
              lg="6"
              className="order-2 order-lg-1 d-flex flex-column align-items-center"
            >
              <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                Sign in
              </p>

              <div className="d-flex flex-row align-items-center mb-4 ">
                <MDBIcon fas icon="user me-3" size="lg" />
                <MDBInput
                  label="Username"
                  id="form1"
                  type="text"
                  className="w-100"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size="lg" />
                <MDBInput
                  label="Password"
                  id="form3"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <MDBBtn className="mb-4" size="lg" onClick={handleLogin}>
                Sign in
              </MDBBtn>

              <MDBBtn
                className="mb-4"
                size="lg"
                onClick={() => (window.location.href = "./Register")}
              >
                Register
              </MDBBtn>
            </MDBCol>

            <MDBCol
              md="10"
              lg="6"
              className="order-1 order-lg-2 d-flex align-items-center"
            >
              <MDBCardImage
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                fluid
              />
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default LoginPage;
