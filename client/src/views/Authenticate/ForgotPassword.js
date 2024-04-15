import React, { useEffect, useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import config from "../../constance.js";
import "../../styles/Form.scss";

function ForgotPassword() {
    const [displayVerifyInput, setDisplay] = useState(false);
    const [verifyCode, setVerifyCode] = useState('');

    useEffect(() => {
        if (verifyCode) {
            setDisplay(true)
        }
    }, [verifyCode]);

    const initEmail = {
        email: "",
    };

    const initVerifyCode = {
        verifyCode: "",
    };

    const validEmail = Yup.object().shape({
        email: Yup
            .string()
            .email()
            .min(10)
            .max(100)
            .required("Hãy nhập vào Email bạn đã đăng ký cho tài khoản của mình!"),
    });

    const validVerifyCode = Yup.object().shape({
        verifyCode: Yup
            .string(6)
            .required("Hãy nhập vào mã xác nhận gồm 6 chữ số!"),
    });

    const generateVerifyCode = () => {
        let codeGenerated = '';

        for (let i = 1; i <= 6; i++) {
            codeGenerated += Math.floor(Math.random() * 10);
        }

        setVerifyCode(codeGenerated);
    };

    const handleSendCodeVerify = (data) => {
        if (!data || !data.email) {
            toast.error("Hãy điền đầy đủ thông tin!");
            return;
        }

        generateVerifyCode();
    };

    const handleCheckVerifyCode = (data) => {
        if (!data || !data.verifyCode) {
            toast.error("Hãy điền đầy đủ thông tin!");
            return;
        }

        if (data.verifyCode === verifyCode) {
            toast.success("Mã bạn nhập đã chính xác!");
        } 
        else {
            toast.error("Mã xác nhận không chính xác!");
        }

        // toast.info(data.verifyCode + " - " + verifyCode);
    }

    return (
        <div className="container-fluid form-page">
            {!displayVerifyInput ? 
            (
                <Formik
                    initialValues={initEmail}
                    validationSchema={validEmail}
                    onSubmit={handleSendCodeVerify}
                >
                {({handleChange, values}) => (
                    <Form className="loginForm blurry-form">
                        <div className="mb-3 text-center form-header">
                            TẠO MẬT KHẨU MỚI
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <Field
                                className="form-control"
                                autoComplete="off"
                                id="loginFormInput"
                                name="email"
                                placeholder="(Email bạn đã đăng ký cho tài khoản...)"
                                onChange={handleChange}
                                value={values.email}
                            />
                            <ErrorMessage
                                className="error-message"
                                name="email"
                                component="span"
                            />
                        </div>

                        <button className="btn btn-primary btn-login" type="submit">
                            Gửi mã xác nhận
                        </button>
                    </Form>
                )}

                </Formik>
            ): (
                <Formik
                    initialValues={initVerifyCode}
                    validationSchema={validVerifyCode}
                    onSubmit={handleCheckVerifyCode}
                >
                {({handleChange, values}) => (
                    <Form className="loginForm blurry-form">
                        <div className="mb-3 text-center form-header">
                            TẠO MẬT KHẨU MỚI
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mã xác nhận (6 chữ số)</label>
                            <Field
                                className="form-control"
                                autoComplete="off"
                                id="loginFormInput"
                                name="verifyCode"
                                placeholder="(Nhập mã xác nhận được gửi đến email của bạn...)"
                                onChange={handleChange}
                                value={values.verifyCode}
                            />
                            <ErrorMessage
                                className="error-message"
                                name="verifyCode"
                                component="span"
                            />
                        </div>

                        <button className="btn btn-primary btn-login" type="submit">
                            Xác thực
                        </button>
                    </Form>
                )}

                </Formik>
            )}
        </div>
    )




}


export default ForgotPassword;