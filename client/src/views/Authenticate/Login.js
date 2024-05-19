import React, { useContext, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../../constance.js";
import { UserRoleContext } from "../../context/UserRoleContext.js";
import backgroundImg from "../../assets/images/bg.png";
import avatarIcon from "../../assets/images/avatar.png";
import "../../styles/Login.scss";

function Login() {
  let navigator = useNavigate();
  const {applyRole} = useContext(UserRoleContext);

  const initValuesLogin = {
    username: "",
    password: "",
  };

  const validateSchema = Yup.object().shape({
    username: Yup.string()
      .min(5)
      .max(15)
      .required("Bạn phải nhập vào tên tài khoản!"),
    password: Yup.string()
      .min(5)
      .max(15)
      .required("Bạn phải nhập vào mật khẩu!")
  });

  const handleLogin = async (data) => {
    if (!data || !data.username || !data.password) {
      toast.error("Thông tin không hợp lệ. Hãy kiểm tra và thử lại!");
      return;
    }

    axios
      .post(
        `http://${config.URL}/users/login`,
        data
      )

      .then((res) => {
        if (res.data && res.data.error) {
          toast.error(res.data.error);
        } 
        else {
          // Phải set vào local storage để khi refresh trang thì data không bị mất:
          localStorage.setItem('id', res.data.id);
          localStorage.setItem('username', res.data.username);
          localStorage.setItem('status', res.data.status);
          localStorage.setItem('authenToken', res.data.authenToken);
          
          applyRole();

          navigator("/");
        }
      })
      .catch(() => {
        toast.error(data.error);
      });
  };

  useEffect(() => {
    const inputs = document.querySelectorAll("input");

    function addcl() {
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }

    function remcl() {
      let parent = this.parentNode.parentNode;
      if (this.value === "") {
        parent.classList.remove("focus");
      }
    }

    inputs.forEach(input => {
      input.addEventListener("focus", addcl);
      input.addEventListener("blur", remcl);
    });

    // Cleanup function to remove event listeners
    return () => {
      inputs.forEach(input => {
        input.removeEventListener("focus", addcl);
        input.removeEventListener("blur", remcl);
      });
    };
  }, []);

  return (
    <>
      <div className="login-page">
        <img class="wave" src={backgroundImg}/>
        <div class="container">
          <div class="img">
            {/* <img src={backgroundImg}/> */}
          </div>
          <div class="login-content">
            <Formik
              initialValues={initValuesLogin}
              validationSchema={validateSchema}
              onSubmit={handleLogin}
            >
            {({ handleChange, values }) => (
              <Form>
                  <img src={avatarIcon} className="mb-3"/>
                  <h3 class="title">Welcome to LibTech</h3>

                  <div className="input-div one">
                    <div class="i">
                          <i class="fas fa-user"></i>
                    </div>
                    <div class="div">
                        <h5>Username</h5>
                        <Field
                          className="input"
                          autoComplete="off"
                          id="loginFormInput"
                          name="username"
                          onChange={handleChange}
                          value={values.username}
                        />
                    </div>
                  </div>

                  <div class="input-div pass">
                    <div class="i"> 
                        <i class="fas fa-lock"></i>
                    </div>
                    <div class="div">
                        <h5>Password</h5>
                        <Field
                          className="input"
                          autoComplete="off"
                          id="loginFormInput"
                          name="password"
                          onChange={handleChange}
                          value={values.password}
                        />
                    </div>
                  </div>

                  <button className="btn-login" type="submit">
                    Đăng nhập
                  </button>
              </Form>
            )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
