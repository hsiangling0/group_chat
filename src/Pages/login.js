import React from "react";
import { Flex, Stack } from "@chakra-ui/layout";
import userIcon from "../Icon/user.svg";
import { useFormik } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { userLogin } from "../Utilities/api";
import { useNavigate } from "react-router-dom";
// import usr_input_bg from "../Icon/input1.svg";
// import pwd_input_bg from "../Icon/input2.svg";
// import login_bg from "../Icon/login.svg";
export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const toastIdRef = React.useRef();

  const formik = useFormik({
    initialValues: {
      account: "",
      pwd: "",
    },
    onSubmit: (values) => {
      userLogin(values.account, values.pwd)
        .then((res) => {
          if (res.detail == "User name or Password wrong") {
            toastIdRef.current = toast({
              description: "Incorrect account or password",
              status: "error",
            });
          } else {
            sessionStorage.clear();
            sessionStorage.setItem("token", JSON.stringify(res.token));
            sessionStorage.setItem("name", JSON.stringify(res.userName));
            sessionStorage.setItem("account", JSON.stringify(values.account));
            navigate("/chat");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
  return (
    <Stack bgColor="#EBEBE9" h="100vh" w="100vw" alignItems="center">
      <Stack w="50vw" mt="15vh" alignItems="center">
        <Text color="#000000" fontSize="xx-large" fontWeight="bold" mb="10vh">
          Welcome to ChatApp
        </Text>
        <form onSubmit={formik.handleSubmit}>
          <Stack>
            <CustomControll bgColor="#FFB6B5">
              <Flex alignItems="center" h="100%">
                <CustomLabel>
                  <Image src={userIcon} ml="10px" />
                  <Text>Account</Text>
                </CustomLabel>
                <Input
                  w="190px"
                  name="account"
                  onChange={formik.handleChange}
                  value={formik.values.account}
                  border="none"
                  color="#ffffff"
                  fontSize="18px"
                  fontWeight="bolder"
                  focusBorderColor="#FFB6B5"
                />
              </Flex>
            </CustomControll>
            <CustomControll bgColor="#FFB6B5">
              <Flex alignItems="center" h="100%">
                <CustomLabel>
                  <LockIcon
                    color="#000000"
                    boxSize="20px"
                    ml="20px"
                    mr="10px"
                  />
                  <Text>Password</Text>
                </CustomLabel>
                <Input
                  w="190px"
                  name="pwd"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.pwd}
                  border="none"
                  color="#ffffff"
                  fontSize="18px"
                  fontWeight="bolder"
                  focusBorderColor="#FFB6B5"
                />
              </Flex>
            </CustomControll>
            <Button
              type="submit"
              mt="15vh"
              bgColor="#000000"
              borderRadius="30px"
              h="60px"
              color="white"
              fontWeight="bolder"
              fontSize="25px"
            >
              Login
            </Button>
          </Stack>
        </form>
        <Flex color="#000000">
          <Text mr="20px">Don’t have an account?</Text>
          <Link to="/register">Sign up</Link>
        </Flex>
      </Stack>
    </Stack>
  );
}
const CustomLabel = styled(FormLabel)`
  font-size: 18px;
  color: #132644;
  font-weight: bold;
  margin-right: 5px;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
`;
const CustomControll = styled(FormControl)`
  border-radius: 30px;
  height: 60px;
  width: 350px;
  margin-bottom: 20px;
`;
