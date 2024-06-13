import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import config from '../../constance.js';
import { RoomContext } from '../../context/RoomContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';

function EditUser() {
    const { id } = useParams();

    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;

    const [userInfo, setUserInfo] = useState([]);
    const { listRooms } = useContext(RoomContext);
    const [listPositions, setListPositions] = useState([]);
    const [listRoles, setListRoles] = useState([]);

    let navigate = useNavigate();
    
    if (idRole !== 2) {
        navigate('/page-not-found');
    };


    useEffect(() => {
        Promise.all([
            axios.get(`http://${config.URL}/positions/all`),
            axios.get(`http://${config.URL}/roles/getAllRoles`, {
                headers: { authenToken: localStorage.getItem('authenToken') },
            }),
            axios.get(`http://${config.URL}/users/info/${id}`),
        ])
            .then(([positionRes, roleRes, userRes]) => {
                setListPositions(positionRes.data);
                setListRoles(roleRes.data);
                setUserInfo(userRes.data);
            })
            .catch((error) => toast.error('Error!'));
    }, [id]);

    const handleUpdateInfo = (e) => {
        e.preventDefault();

        axios
            .put(`http://${config.URL}/users/updateinfo/${id}`, userInfo, {
                headers: { authenToken: localStorage.getItem('authenToken') },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                }
            })
            .catch((error) => toast.error('Không cập nhật được thông tin'));
    };

    return (
        <div className="form-container">
            <h1 className="form-header">Thông tin tài khoản</h1>
            <div className="form-body">
                <form method="POST" className="row" onSubmit={handleUpdateInfo}>
                    <div className="col-md-12 col-sm-12 label-info">
                        <h5>Thông tin tài khoản</h5>
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--username" className="form-label">
                            Tên tài khoản
                        </label>
                        <input
                            name="Username"
                            type="text"
                            id="input--username"
                            className="form-control"
                            value={userInfo.Username}
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    Username: e.target.value,
                                })
                            }
                            readOnly
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--password" className="form-label">
                            Mật khẩu mới
                        </label>
                        <input
                            name="NewPassword"
                            type="text"
                            id="input--password"
                            className="form-control"
                            placeholder="Nhập vào để tạo mật khẩu mới"
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    NewPassword: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="select--role" className="form-label">
                            Loại tài khoản
                        </label>
                        <select
                            name="RoleId"
                            class="form-select"
                            id="select--role"
                            value={userInfo.RoleId}
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    RoleId: e.target.value,
                                })
                            }
                            required
                        >
                            {listRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.RoleName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 label-info">
                        <h5>Thông tin cá nhân</h5>
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--fullname" className="form-label">
                            Họ và tên
                        </label>
                        <input
                            name="Fullname"
                            type="text"
                            id="input--fullname"
                            className="form-control"
                            value={userInfo.Fullname}
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    Fullname: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--email" className="form-label">
                            Email
                        </label>
                        <input
                            name="Email"
                            type="text"
                            id="input--email"
                            className="form-control"
                            value={userInfo.Email}
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    Email: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--phoneNumber" className="form-label">
                            Số điện thoại
                        </label>
                        <input
                            name="PhoneNumber"
                            type="text"
                            id="input--phoneNumber"
                            className="form-control"
                            value={userInfo.PhoneNumber}
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    PhoneNumber: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--birthday" className="form-label">
                            Ngày sinh (mm/dd/yyyy)
                        </label>
                        <input
                            name="Birthday"
                            type="date"
                            id="input--birthday"
                            className="form-control"
                            placeholder="dd-mm-yyyy"
                            value={userInfo.Birthday}
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    Birthday: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="select--position" className="form-label">
                            Chức vụ
                        </label>
                        <select
                            name="PositionId"
                            class="form-select"
                            id="select--position"
                            title="Chức vụ"
                            value={userInfo.PositionId}
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    PositionId: e.target.value,
                                })
                            }
                            required
                        >
                            {listPositions.map((position) => (
                                <option key={position.id} value={position.id}>
                                    {position.PositionName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="select--room" className="form-label">
                            Phòng công tác
                        </label>
                        <select
                            name="RoomId"
                            class="form-select"
                            id="select--room"
                            title="Phòng"
                            value={userInfo.RoomId}
                            onChange={(e) =>
                                setUserInfo({
                                    ...userInfo,
                                    RoomId: e.target.value,
                                })
                            }
                            required
                        >
                            {listRooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.RoomName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-12 col-sm-12">
                        <div className="btn-wrapper row">
                            <div className="col-md-12 col-sm-12">
                                <div className="row btn-container">
                                    <button
                                        type="submit"
                                        className="btn btn-primary col-md-2 col-sm-12"
                                    >
                                        Cập nhật
                                    </button>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="btn btn-back col-md-2 col-sm-12"
                                        type="button"
                                    >
                                        Quay về
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditUser;
