import React, {useState, useEffect} from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import {Link} from "react-router-dom";
import config from '../../constance.js';
import {FcInfo} from "react-icons/fc";
import {FaEdit, FaTimesCircle, FaTrash } from "react-icons/fa";
import "../../styles/Users.scss";

function Users() {
    const [listUsers, setListUsers] = useState([]);
    const [userSelected, setUserSelected] = useState([]);
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        axios
            .get(
                `http://${config.URL}/users/`,
                null,
            )
            .then((res) => {
                setListUsers(res.data.allUsers);
            });
    }, []);

    const handleDeleteAccount = () => {
        const deletePromises = userSelected.map((userIdSelected) => {
            return axios
                .delete(
                    `http://${config.URL}/users/delete/${userIdSelected}`, 
                    {headers: {authenToken: localStorage.getItem('authenToken')}}
                );

            });

        Promise
            .all(deletePromises)
            .then((res) => {
                let status = false;
                res.forEach((res, index) => {
                    const eachUserSelected = userSelected[index];
                    if (!res.data.error) {
                        setListUsers((oldList) => oldList.filter((user) => user.id !== eachUserSelected));
                        status = true;
                    }
                });

        if (status)
            toast.success('Xóa tài khoản thành công');
        else 
            toast.error('Xóa tài khoản không thành công!');
        });
    };

    const handleCheck = (event) => {
        const {checked, value} = event.target;
        if (checked) {
            setUserSelected([...userSelected, +value]);
        }
        else {
            setUserSelected(userSelected.filter(userId => userId !== +value));
            setCheckAll(false);
        };
    };

    const handleCheckAll = (event) => {
        const {checked} = event.target;
        setCheckAll(checked);

        const allChildCheckboxes = document.querySelectorAll('input[type="checkbox"][data-parent="checkbox-parent"]');
        const selectedUser = [];

        allChildCheckboxes.forEach(eachCheckbox => {
            eachCheckbox.checked = checked;
                if (checked) {
                    selectedUser.push(+eachCheckbox.value);
                }
                else {
                    setUserSelected(userSelected.filter(billId => billId !== +eachCheckbox.value));
                }
            });
        
        setUserSelected(selectedUser);
    };


    return (
        <div className="container-fluid user-page">
            <Link className="btn btn-outline-secondary btn-trash" to={`/users/trash`}>
                <FaTrash className="trash-icon"/> Tài khoản đã xóa
            </Link>
            <Link className="btn btn-danger btn--account-page" onClick={() => handleDeleteAccount()}>Xóa</Link>
            <Link className="btn btn-success btn--account-page" to="/users/create">Tạo tài khoản mới</Link>
            <table className="table table-dark">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="table-dark text-center"> 
                            <input id="checkbox-parent" class="select-all form-check-input" type="checkbox" value="" onClick={(e) => handleCheckAll(e)}/>
                        </th>
                        <th scope="col" className="table-dark text-center"> Mã tài khoản </th>
                        <th scope="col" className="table-dark text-center"> Tên tài khoản </th>
                        <th scope="col" className="table-dark text-center">Mật khẩu</th>
                        <th scope="col" className="table-dark text-center">Vai trò</th>
                        <th scope="col" className="table-dark text-center">Sửa thông tin</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listUsers.length > 0 ? (
                            listUsers.map((account) => (
                            <tr key={account.id} className="text-center">
                                <td className="table-light">
                                    <input data-parent="checkbox-parent" class="form-check-input" type="checkbox" value={account.id} onClick={(e) => handleCheck(e)}/>
                                </td>
                                <td className="table-light">{account.id}</td>
                                <td className="table-light">{account.Username}</td>
                                <td className="table-light">{account.Password}</td>
                                <td className="table-light">Thư viện viên</td>
                                <td className="table-light">
                                    <Link to={`edit/${account.id}`}>
                                        <FaEdit className="edit-icon table-icon"/>
                                    </Link>
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