import React, {useState, useEffect} from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import {FcSynchronize} from "react-icons/fc";
import {FaTimesCircle } from "react-icons/fa";
import "../../styles/Users.scss";

function AccountTrash() {
    const [listAccountDeleted, setListAccountDeleted] = useState([]);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/users/trash/`)
            .then((res) => {
                setListAccountDeleted(res.data.accountDeleted)
            });
    }, []);

    const formatAndDisplayDatetime = (dateString) => {
        const date = new Date();
        dateString = 
            `
                ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 
                ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}
            `;
        return dateString;
    };

    const handleRestore = (id) => {
        axios
            .patch(
                `http://${config.URL}/users/trash/restore/${id}`,
                null,
                {
                    headers: {
                        authenToken: localStorage.getItem('authenToken')
                    }
                }
            )
            .then((res) => {
                if (!res.data.error) {
                    toast.success(res.data.success);
                    setListAccountDeleted(listAccountDeleted.filter((account) => {
                        return account.id !== id;
                    }));
                }
                else 
                    toast.error(res.data.error);
            })
            .catch((error) => {
                toast.error("Đã xảy ra lỗi khi gọi API đến Server...");
            });
    };

    const handleForceDelete = (id) => {
        axios
            .delete(
                `http://${config.URL}/users/trash/delete/${id}`,
                null,
                {
                    headers: {
                        authenToken: localStorage.getItem('authenToken')
                    }
                }
            )
            .then((res) => {
                if (!res.data.error) {
                    toast.success(res.data.success);
                    setListAccountDeleted(listAccountDeleted.filter((account) => {
                        return account.id !== id;
                    }));
                }
                else 
                    toast.error(res.data.error);
            })
            .catch((error) => {
                toast.error("Đã xảy ra lỗi khi gọi API đến Server...");
            });
    };

    return (
        <div className="container-fluid bill-page">
            <table className="table table-dark">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="table-dark text-center">Mã tài khoản</th>
                        <th scope="col" className="table-dark text-center">Tên tài khoản</th>
                        <th scope="col" className="table-dark text-center">Mật khẩu</th>
                        <th scope="col" className="table-dark text-center">Thời gian tạo</th>
                        <th scope="col" className="table-dark text-center">Thời gian xóa</th>
                        <th scope="col" className="table-dark text-center">Khôi phục</th>
                        <th scope="col" className="table-dark text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listAccountDeleted.length > 0 ?
                        (listAccountDeleted.map((account) => (
                            <tr key={account.id} className="text-center">
                                <td className="table-light"> {account.id} </td>
                                <td className="table-light"> {account.Username} </td>
                                <td className="table-light"> {account.Password} </td>
                                <td className="table-light"> {formatAndDisplayDatetime(account.createdAt)} </td>
                                <td className="table-light"> {formatAndDisplayDatetime(account.deletedAt)} </td>
                                <td className="table-light">
                                    <FcSynchronize onClick={() => handleRestore(account.id)} className="info-icon table-icon"/>
                                </td>
                                <td className="table-light">
                                    <FaTimesCircle onClick={() => handleForceDelete(account.id)} className="delete-icon table-icon"/>
                                </td>
                            </tr>
                        ))) : (
                        <tr>
                            <td className="table-light text-center" colSpan={6}>
                                Không có tài khoản nào được xóa gần đây.
                            </td>
                        </tr>
                        )}
                </tbody>
            </table>
        </div>
    )
}

export default AccountTrash;