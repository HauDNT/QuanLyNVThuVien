import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import config from '../../constance.js';
import {FcInfo} from "react-icons/fc";
import {FaEdit, FaTimesCircle } from "react-icons/fa";
import "../../styles/Users.scss";

function Users() {
    const [listUsers, setListUsers] = useState([]);

    useEffect(() => {
        axios.get(`http://${config.URL}/users/`).then((res) => {
            setListUsers(res.data.allUsers);
        });
    }, []);

    return (
        <div className="container-fluid user-page">
            <Link className="btn btn-primary btn-insert-user" to="/">Tạo tài khoản mới</Link>
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
                    {listUsers.map((user) => (
                        <tr key={user.id} className="text-center">
                            <td className="table-light">{user.Username}</td>
                            <td className="table-light">{user.Password}</td>
                            <td className="table-light">Thư viện viên</td>
                            <td className="table-light">
                                <FcInfo className="info-icon"/>
                            </td>
                            <td className="table-light">
                                <FaEdit className="edit-icon"/>
                            </td>
                            <td className="table-light">
                                <FaTimesCircle  className="delete-icon"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;