import React, { useContext } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../helpers/AuthContext";
import '../styles/Form.scss';

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
    if (data.password === data.re_password) {
      axios.post('http://localhost:3002/users/register', data).then(() => {
        toast.success("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ");
        navigator('/login');
      });
    }
    else {
      toast.error("Mật khẩu không trùng khớp. Hãy kiểm tra và thử lại.");
    }
  };

  return (
    <div className="container-fluid">
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
              <ErrorMessage className="error-message" name="username" component="span" />
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
              <ErrorMessage className="error-message" name="password" component="span" />
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
              <ErrorMessage className="error-message" name="re_password" component="span" />
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
