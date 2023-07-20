import React, { useState } from "react";
import axios from "axios";
import LoginImage from "../static/login.png";
import {
  Center,
  Card,
  Input,
  Container,
  CardBody,
  Image,
  Stack,
  Heading,
  Button,
} from "@chakra-ui/react";
import URL from "../config/URLConfig";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister() {
    const data = { username, password };
    axios
      .put(URL + "users/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // Handle the response here
        alert("Register successful!");
        window.location.href = "/Login";
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        if (error.response) alert(error.response.data.message);
        else alert(error);
        setUsername("");
        setPassword("");
      });
  }

  return (
    <Container mt={20} borderRadius="lg">
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <CardBody>
          <Image src={LoginImage} alt="Login Image" borderRadius="lg" />
          <Stack mt="6" spacing="3">
            <Center>
              <Heading position="relative" size="2xl">
                Sign up
              </Heading>
            </Center>
            <Input
            placeholder="Username"
              label="Username"
              id="form1"
              type="text"
              className="w-100"
              size="lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
            placeholder="Password" 
              label="Password"
              id="form3"
              size="lg"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Center mt={10}>
              <Button
                colorScheme="purple"
                variant="solid"
                size="lg"
                onClick={handleRegister}
              >
                Register
              </Button>
            </Center>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default RegisterPage;
