import React, { useContext } from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import * as Yup from "yup";
import { AuthenContext } from "../../helper/AuthenContext";
import RegexPatterns from "../../helper/RegexPatterns.js";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import config from "../../constance.js";
import "../../styles/Form.scss";

function Login() {
  const { setAuthenData } = useContext(AuthenContext);

  let navigator = useNavigate();

  const initValuesLogin = {
    username: "",
    password: "",
  };

  const validateSchema = Yup.object().shape({
    username: Yup.string()
      .min(5)
      .max(15)
      .required("Bạn phải nhập vào tên tài khoản!")
      .matches(RegexPatterns.username, "Username không hợp lệ!"),
      password: Yup.string()
      .min(5)
      .max(15)
      .required("Bạn phải nhập vào mật khẩu!")
      .matches(RegexPatterns.password, "Password không hợp lệ!"),
  });

  const handleLogin = (data) => {
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

          // Lưu dữ liệu từ local storage vào trong AuthenContext -> authenData để kiểm soát trạng thái đăng nhập của người dùng
          // trong toàn ứng dụng:
          setAuthenData ({
            id: localStorage.getItem('id'), 
            username: localStorage.getItem('username'), 
            status: localStorage.getItem('status'), 
            authenToken: localStorage.getItem('authenToken')
          });

          navigator("/");
        }
      })
      .catch(() => {
        toast.error(data.error);
      });
  };

  return (
    <div className="container-fluid form-page">
      <Formik
        initialValues={initValuesLogin}
        validationSchema={validateSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, values }) => (
          <Form className="loginForm blurry-form">
            <div className="mb-3 text-center form-header">
              NGHIỆP VỤ THƯ VIỆN
            </div>
            <div className="mb-3">
              <label className="form-label">Tên tài khoản</label>
              <Field
                className="form-control"
                autoComplete="off"
                id="loginFormInput"
                name="username"
                placeholder="(Tên tài khoản của bạn...)"
                onChange={handleChange}
                value={values.username}
              />
              <ErrorMessage
                className="error-message"
                name="username"
                component="span"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <Field
                className="form-control"
                autoComplete="off"
                id="loginFormInput"
                name="password"
                placeholder="(Mật khẩu của bạn...)"
                onChange={handleChange}
                value={values.password}
              />
              <ErrorMessage
                className="error-message"
                name="password"
                component="span"
              />
            </div>

            <button className="btn btn-primary btn-login" type="submit">
              Đăng nhập
            </button>
            {/* <Link to='/register' className="btn btn-light btn-to-register" >
              Đăng ký
            </Link> */}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
