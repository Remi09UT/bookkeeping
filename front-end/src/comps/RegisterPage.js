import React, { useState } from "react";
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

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister() {
    const data = {username, password};
    axios
      .put('http://127.0.0.1:3000/users/register', data, {
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if required
        },
      })
      .then((response) => {
        // Handle the response here
        if(response.data.status === 201) {
            alert('Register successful!')
            window.location.href = 'http://127.0.0.1:3000/users/login';
        }
        
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        if(error.data.status === 422) {
          alert(`User ${username} already existed! Try a new username`)
       }
        console.error(error);
      });
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
                Sign up
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

              <MDBBtn className="mb-4" size="lg" onClick={handleRegister}>
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

export default RegisterPage;
