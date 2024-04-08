import React, {useState, useEffect, Fragment} from "react";
import axios from "axios";
import {FcInfo} from "react-icons/fc";
import {FaEdit, FaTimesCircle } from "react-icons/fa";
import "../styles/Users.scss";

function HomePage() {
    const [listUsers, setListUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3002/users/').then((res) => {
            setListUsers(res.data.allUsers);
        });
    }, []);

    return (
        <>
        <div className="container-fluid user-page">
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="text-center"> Tên tài khoản </th>
                        <th scope="col" className="text-center">Mật khẩu</th>
                        <th scope="col" className="text-center">Vai trò</th>
                        <th scope="col" className="text-center">Thông tin cá nhân</th>
                        <th scope="col" className="text-center">Sửa</th>
                        <th scope="col" className="text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers.map((user) => (
                        <tr key={user.id} className="text-center">
                            <td>{user.Username}</td>
                            <td>{user.Password}</td>
                            <td>Thư viện viên</td>
                            <td>
                                <FcInfo className="info-icon"/>
                            </td>
                            <td>
                                <FaEdit className="edit-icon"/>
                            </td>
                            <td>
                                <FaTimesCircle  className="delete-icon"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default HomePage;