import React, { useContext } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SERVER_PORT } from "../constance.js";
// import { AuthContext } from "../helpers/AuthContext";
import "../styles/Form.scss";

function Register() {
  const navigator = useNavigate();

  const initValuesRegis = {
    username: "",
    password: "",
    re_password: "",
  };

  const validateSchema = Yup.object().shape({
    username: Yup.string()
      .min(3)
      .max(15)
      .required("Bạn phải nhập vào tên tài khoản!!"),
    password: Yup.string()
      .min(4)
      .max(20)
      .required("Bạn phải nhập vào mật khẩu!"),
    re_password: Yup.string()
      .min(4)
      .max(20)
      .required("Bạn phải nhập lại mật khẩu!"),
  });

  const handleRegis = (data) => {
    if (!data || !data.username || !data.password || !data.re_password) {
      toast.error("Thông tin đăng ký không hợp lệ!");
      return;
    }

    if (data.password !== data.re_password) {
      toast.error("Mật khẩu không trùng khớp!");
      return;
    }

    axios.post(`http://localhost:${SERVER_PORT}/users/register`, data)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.success);
          navigator('/login');
        } 
        else {
          toast.error(res.data.error);
        }
      })
      .catch(() => {
        toast.error("Đã xảy ra lỗi từ phía máy chủ, hãy thử lại sau!");
      });
  };

  return (
    <div className="container-fluid form-page">
      <Formik
        initialValues={initValuesRegis}
        validationSchema={validateSchema}
        onSubmit={handleRegis}
      >
        {({ handleChange, values }) => (
          <Form className="regisForm blurry-form">
            <div className="mb-3 text-center form-header">
              ĐĂNG KÝ TÀI KHOẢN QUẢN TRỊ
            </div>
            <div className="mb-3">
              <label className="form-label">Tên tài khoản: </label>
              <Field
                className="form-control"
                autoComplete="off"
                id="regisFormInput"
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
              <label className="form-label">Mật khẩu: </label>
              <Field
                className="form-control"
                autoComplete="off"
                id="regisFormInput"
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

            <div className="mb-3">
              <label className="form-label">Nhập lại mật khẩu: </label>
              <Field
                className="form-control"
                autoComplete="off"
                id="regisFormInput"
                name="re_password"
                placeholder="(Nhập lại mật khẩu của bạn...)"
                onChange={handleChange}
                value={values.re_password}
              />
              <ErrorMessage
                className="error-message"
                name="re_password"
                component="span"
              />
            </div>

            <button className="btn btn-primary btn-regis" type="submit">
              Đăng ký
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
