import React, {useState, useEffect} from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import {Link} from "react-router-dom";
import config from '../../constance.js';
import {FcInfo} from "react-icons/fc";
import {FaEdit, FaTimesCircle } from "react-icons/fa";
import "../../styles/Users.scss";

function Users() {
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [listUsers, setListUsers] = useState([]);

    useEffect(() => {
        axios.get(`http://${config.URL}/users/`).then((res) => {
            setListUsers(res.data.allUsers);
        });
    }, [deleteStatus]);

    const handleDeleteAccount = (id) => {
        setDeleteStatus(!deleteStatus);

        axios
        .delete(`http://${config.URL}/users/delete/${id}`, 
                {headers: {authenToken: localStorage.getItem('authenToken')}})
        .then((res) => {
            if (res.data.success) {
                toast.success(res.data.success);
                setListUsers(listUsers.filter((account) => {
                    return account.id !== id;
                }));
            }
            else
                toast.error(res.data.error);
        })
    }

    return (
        <div className="container-fluid user-page">
            <Link className="btn btn-primary btn-insert-user" to="/users/create">Tạo tài khoản mới</Link>
            <table className="table table-dark">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="table-dark text-center"> Tên tài khoản </th>
                        <th scope="col" className="table-dark text-center">Mật khẩu</th>
                        <th scope="col" className="table-dark text-center">Vai trò</th>
                        <th scope="col" className="table-dark text-center">Thông tin cá nhân</th>
                        <th scope="col" className="table-dark text-center">Sửa</th>
                        <th scope="col" className="table-dark text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listUsers.length > 0 ? (
                            listUsers.map((account) => (
                            <tr key={account.id} className="text-center">
                                <td className="table-light">{account.Username}</td>
                                <td className="table-light">{account.Password}</td>
                                <td className="table-light">Thư viện viên</td>
                                <td className="table-light">
                                    <FcInfo className="info-icon table-icon"/>
                                </td>
                                <td className="table-light">
                                    <FaEdit className="edit-icon table-icon"/>
                                </td>
                                <td onClick={() => handleDeleteAccount(account.id)} className="table-light">
                                    <FaTimesCircle  className="delete-icon table-icon"/>
                                </td>
                            </tr>
                        ))) : (
                            <tr>
                                <td className="table-light text-center" colSpan={6}>
                                    Chưa có tài khoản nào được tạo
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default Users;