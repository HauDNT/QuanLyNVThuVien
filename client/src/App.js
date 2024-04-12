import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenContext } from "./helper/AuthenContext";
import config from "../src/constance.js";
import Home from "./views/Home";
import Login from "./views/Authenticate/Login";
import Register from "./views/Authenticate/Register";
import Users from "./views/Users/Users";
import Bills from "./views/Bills/Bills";
import PageNotFound from "./views/PageNotFound";
import "./styles/App.scss";

function App() {
  const [authenData, setAuthenData] = useState({
    id: 0,
    username: "",
    status: false,
    authenToken: "",
  });

  useEffect(() => {
    axios
      .get(
        `http://${config.DOMAIN_NAME}${config.SERVER_PORT}/authen/verifyToken`,
        { headers: { authenToken: localStorage.getItem("authenToken") } }
      )
      .then((res) => {
        if (localStorage.getItem("status")) {
          setAuthenData({
            id: localStorage.getItem("id"),
            username: localStorage.getItem("username"),
            status: localStorage.getItem("status"),
            authenToken: localStorage.getItem("authenToken"),
          });
        } else setAuthenData({ ...authenData, status: false });
      });
  }, []);

  return (
    <div className="App">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />

      <AuthenContext.Provider value={{ authenData, setAuthenData }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/" element={<Home />}>
              <Route path="users" element={<Users />} />
              <Route path="bills/:type" element={<Bills />} />
            </Route>
            <Route path="/*" exact element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthenContext.Provider>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <script
        src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"
      ></script>
    </div>
  );
}

export default App;
