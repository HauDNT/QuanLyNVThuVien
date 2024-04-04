import React, { Fragment, useContext } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../helpers/AuthContext";

function Login() {
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
      .required("Bạn phải nhập vào mật khẩu!"),
  });

  // Quay lại thì viết tiếp hàm Login nhé!
  const handleLogin = (information) => {};

  return (
    <div className="loginContainer">
      <Formik
        initialValues={initValuesLogin}
        validationSchema={validateSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, values }) => (
          <Form className="loginForm">
            <label>Tên tài khoản: </label>
            <Field
              autoComplete="off"
              id="loginFormInput"
              name="username"
              placeholder="(Tên tài khoản của bạn...)"
              onChange={handleChange}
              value={values.username}
            />
            <ErrorMessage name="username" component="span" />

            <label>Mật khẩu: </label>
            <Field
              autoComplete="off"
              id="loginFormInput"
              name="password"
              placeholder="(Mật khẩu của bạn...)"
              onChange={handleChange}
              value={values.password}
            />
            <ErrorMessage name="password" component="span" />

            <button className="btn btn-primary btn-login" type="submit">
              Đăng nhập
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
