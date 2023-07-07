import React, { useEffect, useState } from "react";
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
import URL from "../config/URLConfig";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credential, setCredential] = useState("");

  useEffect(() => {
    if (
      credential &&
      credential != sessionStorage.getItem("bookKeepingCredential")
    ) {
      sessionStorage.setItem("bookKeepingCredential", credential);
      setCredential("");
    }

    if (credential || sessionStorage.getItem("bookKeepingCredential")) {
      console.log(sessionStorage.getItem("bookKeepingCredential"));
      window.location.href = "./Home";
    }
  }, [credential]);

  function handleLogin() {
    let value = username + ":" + password;
    let encodedValue = btoa(value);

    axios
      .get(URL + "users/login", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedValue}`,
        },
      })
      .then((response) => {
        setCredential(response.data.token);
      })
      .catch((error) => {
        if (error.response) alert(error.response.data.message);
        else alert(error);
        setUsername("");
        setPassword("");
      });

    // if (username === "aaa" && password == "bbb") {
    //   setCredential("fake JWT");
    // } else {
    //   alert("Wrong account or password");
    // }
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="d-flex flex-row align-items-center mb-4">
                <MDBIcon fas icon="lock me-3" size="lg" />
                <MDBInput
                  label="Password"
                  id="form3"
                  type="password"
                  value={password}
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
