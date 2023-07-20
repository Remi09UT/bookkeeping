import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginImage from "../static/login.png";
import {
  Center,
  Flex,
  Spacer,
  Box,
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
                Sign in
              </Heading>
            </Center>
            <Input
              placeholder="Username"
              size="lg"
              value={username}
              label="Username"
              id="form1"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input label="Password"
                  id="form3"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" size="lg" />
            <Flex mt={10}>
              <Box>
                <Button
                  colorScheme="purple"
                  variant="outline"
                  size="lg"
                  onClick={handleLogin}
                >
                  Sign in
                </Button>
              </Box>
              <Spacer />
              <Box>
                <Button
                  colorScheme="purple"
                  variant="solid"
                  size="lg"
                  onClick={() => (window.location.href = "./Register")}
                >
                  Register
                </Button>
              </Box>
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
}

export default LoginPage;
