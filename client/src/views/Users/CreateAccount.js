import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../constance.js';
import { RoomContext } from '../../context/RoomContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { toast } from 'react-toastify';

function CreateAccountUser() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;
    
    let navigate = useNavigate();

    if (idRole !== 2) {
        navigate('/page-not-found');
    };

    const { listRooms } = useContext(RoomContext);
    const [listPositions, setListPositions] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [inputValues, setInputValues] = useState({
        username: '',
        password: '',
        repassword: '',
        fullname: '',
        email: '',
        birthday: '',
        phoneNumber: '',
        position: 1,
        room: 1,
        role: 1,
        avatar: null,
    });

    const handleClearInput = () => {
        setInputValues({
            username: '',
            password: '',
            repassword: '',
            fullname: '',
            email: '',
            birthday: '',
            phoneNumber: '',
            position: 1,
            room: 1,
            role: 1,
            avatar: null,
        });
    };

    useEffect(() => {
        Promise.all([
            axios.get(`http://${config.URL}/positions/all`),
            axios.get(`http://${config.URL}/roles/getAllRoles`, {
                headers: { authenToken: localStorage.getItem('authenToken') },
            }),
        ])
            .then(([positionRes, roleRes]) => {
                setListPositions(positionRes.data);
                setListRoles(roleRes.data);
            })
            .catch((error) => toast.error('Error!'));
    }, []);

    const handleCreateAccount = (e) => {
        e.preventDefault(); // Ngăn form submit - tránh load trang

        const formData = new FormData(e.target); // Tạo đối tượng FormData chứa dữ liệu (key - value) từ data của form submit
        const data = Object.fromEntries(formData.entries()); // Chuyển đổi FormData thành đối tượng JavaScript

        const {
            username,
            password,
            repassword,
            fullname,
            email,
            birthday,
            position,
            room,
            avatar,
            role,
            phoneNumber,
        } = data;

        const account = { username, password, repassword };
        
        const information = {
            username,
            fullname,
            email,
            birthday,
            position,
            room,
            avatar,
            role,
            phoneNumber,
        };

        try {
            if (!account || !information) {
                toast.warning('Thông tin không đầy đủ!');
                return;
            }

            if (account.password !== account.repassword) {
                toast.warning('Mật khẩu không trùng khớp, hãy kiểm tra lại!');
                return;
            }

            axios
                .post(`http://${config.URL}/users/register`, account, {
                    headers: {
                        authenToken: localStorage.getItem('authenToken'),
                    },
                })
                .then(() => {
                    axios
                        .post(
                            `http://${config.URL}/users/createinfo`,
                            information,
                            {
                                headers: {
                                    authenToken:
                                        localStorage.getItem('authenToken'),
                                },
                            }
                        )
                        .then((res) => {
                            if (res.data.success) {
                                handleClearInput();
                                toast.success(res.data.success);
                            } else toast.error(res.data.error);
                        });
                });
        } catch (error) {
            toast.error(
                'Không thể tạo tài khoản. Hãy kiểm tra thông tin và thử lại!'
            );
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-header">Tạo tài khoản mới</h1>
            <div className="form-body">
                <form
                    method="POST"
                    className="row"
                    onSubmit={handleCreateAccount}
                >
                    <div className="col-md-12 col-sm-12 label-info">
                        <h5>Thông tin tài khoản</h5>
                    </div>
                    <div className="col-md-6 col-sm-12 input-field mb-3">
                        <label for="input--username" className="form-label">
                            Tên tài khoản
                        </label>
                        <input
                            name="username"
                            type="text"
                            id="input--username"
                            className="form-control"
                            value={inputValues.username}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    username: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-6 col-sm-12 input-field mb-3">
                        <label for="input--password" className="form-label">
                            Mật khẩu
                        </label>
                        <input
                            name="password"
                            type="text"
                            id="input--password"
                            className="form-control"
                            value={inputValues.password}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    password: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-6 col-sm-12 input-field mb-3">
                        <label for="select--role" className="form-label">
                            Loại tài khoản
                        </label>
                        <select
                            name="role"
                            class="form-select"
                            id="select--role"
                            value={inputValues.role}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    role: e.target.value,
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
                    <div className="col-md-6 col-sm-12 input-field mb-3">
                        <label for="input--re-password" className="form-label">
                            Nhập lại mật khẩu
                        </label>
                        <input
                            name="repassword"
                            type="text"
                            id="input--re-password"
                            className="form-control"
                            value={inputValues.repassword}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    repassword: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-12 col-sm-12 label-info">
                        <h5>Thông tin cá nhân</h5>
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--fullname" className="form-label">
                            Họ và tên
                        </label>
                        <input
                            name="fullname"
                            type="text"
                            id="input--fullname"
                            className="form-control"
                            value={inputValues.fullname}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    fullname: e.target.value,
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
                            name="email"
                            type="email"
                            id="input--email"
                            className="form-control"
                            value={inputValues.email}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    email: e.target.value,
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
                            name="phoneNumber"
                            type="number"
                            id="input--phoneNumber"
                            className="form-control"
                            value={inputValues.phoneNumber}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    phoneNumber: e.target.value,
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
                            name="birthday"
                            type="date"
                            id="input--birthday"
                            className="form-control"
                            placeholder="dd-mm-yyyy"
                            value={inputValues.birthday}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    birthday: e.target.value,
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
                            name="position"
                            class="form-select"
                            id="select--position"
                            title="Chức vụ"
                            value={inputValues.position}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    position: e.target.value,
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
                            name="room"
                            class="form-select"
                            id="select--room"
                            title="Phòng"
                            value={inputValues.room}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    room: e.target.value,
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
                    <div className="col-md-12 col-sm-12 input-field mb-3">
                        <label for="input--avatar" className="form-label">
                            Ảnh đại diện
                        </label>
                        <input
                            name="avatar"
                            type="file"
                            id="input--avatar"
                            className="form-control"
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    avatar: e.target.files[0],
                                })
                            }
                        />
                    </div>

                    <div className="col-md-12 col-sm-12">
                        <div className="btn-wrapper row">
                            <div className="col-md-12 col-sm-12">
                                <div className="row btn-container">
                                    <button
                                        type="submit"
                                        className="btn btn-primary col-md-2 col-sm-12"
                                    >
                                        Tạo
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

export default CreateAccountUser;
