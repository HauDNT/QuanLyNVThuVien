import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenContext } from "./helper/AuthenContext";
import { UsingLocalStorage } from "./helper/UsingLocalStorage";
import config from "../src/constance.js";
import Home from "./views/Home";
import Login from "./views/Authenticate/Login";
import Register from "./views/Authenticate/Register";
import Users from "./views/Users/Users";
import Bills from "./views/Bills/Bills";
import PageNotFound from "./views/PageNotFound";
import "./styles/App.scss";

function App() {
  const [authenState, setAuthenState] = useState({
    id: '',
    username: '',
    status: false,
  });

  const [id, setId] = UsingLocalStorage("id");
  const [username, setUsername] = UsingLocalStorage("username");
  const [status, setStatus] = UsingLocalStorage("status");
  const [authenToken, setAuthenToken] = UsingLocalStorage("authenToken");

  const updateValues = (item, newValue) => {
    switch(item) {
      case 'id':
        setId(newValue);
        break;
      case 'username':
        setUsername(newValue);
        break;
      case 'status':
        setStatus(newValue);
        break;
      case 'authenToken':
        setAuthenToken(newValue);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("authenToken");

    if (token) {
      axios
        .get(
          `http://${config.DOMAIN_NAME}${config.SERVER_PORT}/authen/verifyToken`,
          { headers: { authenToken: token } }
        )
        .then((res) => {
          updateValues('id', id);
          updateValues('username', username);
          updateValues('status', true);
          updateValues('authenToken', authenToken);

          // Khi trang web refresh nó sẽ chạy vô if
          // if (res.data.error) {
          //   updateValues('id', null);
          //   updateValues('username', null);
          //   updateValues('status', false);
          //   updateValues('authenToken', null);
          // } else {
          //   updateValues('id', id);
          //   updateValues('username', username);
          //   updateValues('status', true);
          //   updateValues('authenToken', authenToken);
          // }
        });
    }
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

      <AuthenContext.Provider value={{ authenState, setAuthenState }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" exact Component={Login} />
            <Route path="/register" exact Component={Register} />
            <Route path="/" element={<Home />}>
              <Route path="users" element={<Users />} />
              <Route path="bills/:type" element={<Bills />} />
            </Route>
            <Route path="/*" exact Component={PageNotFound} />
          </Routes>
        </BrowserRouter>
      </AuthenContext.Provider>

      <script
        src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"
      ></script>
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
    </div>
  );
}

export default App;
