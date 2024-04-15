import React, { useState } from 'react';
import {Field, Form, ErrorMessage} from 'formik';
import nodemailer from 'nodemailer';
import {toast} from 'react-toastify';

const EmailSender = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
    };

    const handleSendEmail = async () => {
        const trans = nodemailer.createTransport({
            host: '',
            port: 587,
            secure: false,
            auth: {
                user: 'hau21072006018@vnkgu.edu.vn',
                pass: 'haudnt.nhelias@372044102'
            },
        });

        const emailConfig = {
            from: 'hau21072006018@vnkgu.edu.vn',
            to: email,
            subject: 'Verify code to creat new password',
            text: message,
        };

        try {
            await trans.sendMail(emailConfig);
            toast.success("Send email success!");
        } catch (error) {
            toast.error('Error sending email:', error);
        }
    }

    return (
        <Form onSubmit={handleSendEmail}>
            <label>Email</label>
            <Field
                autoComplete="off"
                id="inputRegister"
                type="email"
                placeholder="(Email...)"
                value={email}
                onChange={handleChangeEmail}
                name="email"
            />
            <ErrorMessage name="username" component="span"/>

            <label>Message</label>
            <Field
                autoComplete="off"
                id="inputRegister"
                type="email"
                placeholder="(Message...)"
                value={email}
                onChange={handleChangeMessage}
                name="email"
            />
            <ErrorMessage name="username" component="span"/>

            <button className="btn-register" type='submit'>Send</button>
        </Form>
    )
}

export default EmailSender;