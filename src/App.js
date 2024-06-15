import Login from "./Pages/login";
import Register from "./Pages/register";
import Chat from "./Pages/chat";
import Profile from "./Pages/profile";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider,extendTheme } from "@chakra-ui/react";

function App() {
  const theme = extendTheme({
    colors: {
      bar: {
        500: "#ffffff",
      }
    }
  });
  
  return (
    <ChakraProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/chat" element={<Chat />} />
          <Route exact path="/profile" element={<Profile />} />
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}

export default App;
