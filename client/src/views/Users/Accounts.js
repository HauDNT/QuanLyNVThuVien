import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import {Link} from "react-router-dom";
import config from '../../constance.js';
import {FaEdit, FaTrash } from "react-icons/fa";
import Searchbar from "../Components/Searchbar.js";
import { UserRoleContext } from '../../context/UserRoleContext.js';
import "../../styles/Users.scss";

function Users() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;

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

    const handleSearchResultChange = (result) => {
        setListUsers(result);
    };

    return (
        <>
            <Searchbar
                searchType="users" 
                placeholder="Chọn hạng mục và nhập để tìm kiếm"
                categories={[
                    {value: "*", name: "Tất cả"},
                    {value: "Username", name: "Username"},
                    {value: "Fullname", name: "Họ và tên"},
                    {value: "Email", name: "Email"},
                    {value: "PhoneNumber", name: "Số điện thoại"},
                    {value: "Room", name: "Phòng"},
                    {value: "Position", name: "Chức vụ"},
                ]}
                orderChoice=''
                onSearchResultChange={handleSearchResultChange}
            />
            <div className="container-fluid user-page">
                {
                    idRole === 1 ? (
                        <>
                            <Link className="btn btn-outline-secondary btn-trash" to={`/users/trash`}>
                                <FaTrash className="trash-icon"/> Tài khoản đã xóa
                            </Link>
                            <Link className="btn btn-danger btn--account-page" onClick={() => handleDeleteAccount()}>Xóa</Link>
                        </>
                    ) : null
                }
                <Link className="btn btn-success btn--account-page" to="/users/create">Tạo tài khoản mới</Link>
                <table className="table table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col" className="table-dark text-center"> 
                                <input id="checkbox-parent" class="select-all form-check-input" type="checkbox" value="" onClick={(e) => handleCheckAll(e)}/>
                            </th>
                            <th scope="col" className="table-dark text-center">Username</th>
                            <th scope="col" className="table-dark text-center">Họ và tên</th>
                            <th scope="col" className="table-dark text-center">Email</th>
                            <th scope="col" className="table-dark text-center">Số điện thoại</th>
                            <th scope="col" className="table-dark text-center">Phòng</th>
                            <th scope="col" className="table-dark text-center">Chức vụ</th>
                            <th scope="col" className="table-dark text-center">Loại tài khoản</th>
                            <th scope="col" className="table-dark text-center">Sửa thông tin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listUsers.length > 0 ? (
                                listUsers.map((user) => (
                                <tr key={user.id} className="text-center">
                                    <td className="table-light">
                                        <input data-parent="checkbox-parent" class="form-check-input" type="checkbox" value={user.id} onClick={(e) => handleCheck(e)}/>
                                    </td>
                                    <td className="table-light">{user.User.Username}</td>
                                    <td className="table-light">{user.Fullname}</td>
                                    <td className="table-light">{user.Email}</td>
                                    <td className="table-light">{user.PhoneNumber}</td>
                                    <td className="table-light">{user.Room.RoomName}</td>
                                    <td className="table-light">{user.Position.PositionName}</td>
                                    <td className="table-light">{user.User.User_Role.Role.RoleName}</td>
                                    <td className="table-light">
                                        <Link to={`edit/${user.id}`}>
                                            <FaEdit className="edit-icon table-icon"/>
                                        </Link>
                                    </td>
                                </tr>
                            ))) : (
                                <tr>
                                    <td className="table-light text-center" colSpan={9}>
                                        Chưa có tài khoản nào được tạo
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Users;