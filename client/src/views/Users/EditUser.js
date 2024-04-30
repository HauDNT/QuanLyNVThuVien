import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import {Link, useParams} from "react-router-dom";
import config from '../../constance.js';
import { RoomContext } from "../../context/RoomContext.js";
import RegexPatterns from "../../helper/RegexPatterns.js";
import SuccessSound from "../../assets/audio/success-sound.mp3";
import "../../styles/Users.scss";

function EditUser() {
    const audio = new Audio(SuccessSound);
    const {id} = useParams();
    const [status, setStatus] = useState(false);
    const [userInfo, setUserInfo] = useState([]);
    const {listRooms} = useContext(RoomContext);
    const [listPositions, setListPositions] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    
    useEffect(() => {
        Promise
            .all([
                axios.get(`http://${config.URL}/positions/all`),
                axios.get(`http://${config.URL}/roles/getAllRoles`, {headers: {authenToken: localStorage.getItem('authenToken')}}),
                axios.get(`http://${config.URL}/users/info/${id}`),
            ])
            .then(([positionRes, roleRes, userRes]) => {
                setListPositions(positionRes.data.positions)
                setListRoles(roleRes.data)
                setUserInfo(userRes.data)
            })
            .catch(error => toast.error('Error!'));
    }, [id]);

    const validateData = (data) => {
        let message = '';
        switch (true) {
            case !RegexPatterns.username.test(data.Username):
                message = 'Username không hợp lệ!';
                break;
            case data.NewPassword !== '':
                if (!RegexPatterns.password.test(data.NewPassword)) {
                    message = 'Mật khẩu không hợp lệ!';
                    break;
                }
            case !RegexPatterns.fullname.test(data.Fullname):
                message = 'Họ và tên không hợp lệ!';
                break;
            case !RegexPatterns.email.test(data.Email):
                message = 'Email không hợp lệ!';
                break;
            case !RegexPatterns.phoneNumber.test(data.PhoneNumber):
                message = 'Số điện thoại không hợp lệ!';
                break;
            default:
                break;
        }
        return message;
    };


    const handleUpdateInfo = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Kiểm tra regex: Nếu kiểm tra có message trả về thì có lỗi => Báo lỗi và ngưng thực thi.
        if (validateData(data) !== '') {
            toast.warning(validateData(data));
            return;
        };

        axios
            .put(
                `http://${config.URL}/users/updateinfo/${id}`, 
                userInfo,
                {headers: {authenToken: localStorage.getItem('authenToken')}}
            )
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                }
                else {
                    toast.success(res.data.success);
                    audio.play();
                }
            })
            .catch(error => toast.error("Không cập nhật được thông tin"));
    };
    
    return(
        <div className="creatpage-container">
            <h1 className="col-12 creatpage-heading">Thông tin tài khoản</h1>
            <form method="POST" className="row createpage-form" onSubmit={handleUpdateInfo}>
                <div className="col-12 label-info">
                    <h5>Thông tin tài khoản</h5>
                </div>
                <div className="col-4 input-field">
                    <label for="input--username" className="form-label">Tên tài khoản</label>
                    <input 
                        name="Username" 
                        type="text" 
                        id="input--username" 
                        className="form-control"
                        value={userInfo.Username}
                        onChange={(e) => setUserInfo({...userInfo, Username: e.target.value})}
                        readOnly
                        required/>
                </div>
                <div className="col-4 input-field">
                    <label for="input--password" className="form-label">Mật khẩu mới</label>
                    <input 
                        name="NewPassword" 
                        type="text" 
                        id="input--password" 
                        className="form-control"
                        placeholder="Nhập vào để tạo mật khẩu mới"
                        onChange={(e) => setUserInfo({...userInfo, NewPassword: e.target.value})}
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="select--role" className="form-label">Loại tài khoản</label>
                    <select 
                        name="RoleId" 
                        class="form-select" 
                        id="select--role" 
                        value={userInfo.RoleId}
                        onChange={(e) => setUserInfo({...userInfo, RoleId: e.target.value})}
                        required
                        >
                        {listRoles.map((role) => (
                            <option key={role.id} value={role.id}>{role.RoleName}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 label-info">
                    <h5>Thông tin cá nhân</h5>
                </div>
                <div className="col-4 input-field">
                    <label for="input--fullname" className="form-label">Họ và tên</label>
                    <input 
                        name="Fullname" 
                        type="text" 
                        id="input--fullname" 
                        className="form-control"
                        value={userInfo.Fullname}
                        onChange={(e) => setUserInfo({...userInfo, Fullname: e.target.value})}
                        required
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="input--email" className="form-label">Email</label>
                    <input 
                        name="Email" 
                        type="text" 
                        id="input--email" 
                        className="form-control"
                        value={userInfo.Email}
                        onChange={(e) => setUserInfo({...userInfo, Email: e.target.value})}
                        required
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="input--phoneNumber" className="form-label">Số điện thoại</label>
                    <input 
                        name="PhoneNumber" 
                        type="text" 
                        id="input--phoneNumber" 
                        className="form-control"
                        value={userInfo.PhoneNumber}
                        onChange={(e) => setUserInfo({...userInfo, PhoneNumber: e.target.value})}
                        required
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="input--birthday" className="form-label">Ngày sinh (mm/dd/yyyy)</label>
                    <input 
                        name="Birthday" 
                        type="date" 
                        id="input--birthday" 
                        className="form-control"
                        placeholder="dd-mm-yyyy"
                        value={userInfo.Birthday}
                        onChange={(e) => setUserInfo({...userInfo, Birthday: e.target.value})}
                        required
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="select--position" className="form-label">Chức vụ</label>
                    <select 
                        name="PositionId" 
                        class="form-select" 
                        id="select--position" 
                        title="Chức vụ"
                        value={userInfo.PositionId}
                        onChange={(e) => setUserInfo({...userInfo, PositionId: e.target.value})}
                        required
                        >
                        {listPositions.map((position) => (
                            <option key={position.id} value={position.id}>{position.PositionName}</option>
                        ))}
                    </select>
                </div>
                <div className="col-4 input-field">
                    <label for="select--room" className="form-label">Phòng công tác</label>
                    <select 
                        name="RoomId" 
                        class="form-select" 
                        id="select--room" 
                        title="Phòng"
                        value={userInfo.RoomId}
                        onChange={(e) => setUserInfo({...userInfo, RoomId: e.target.value})}
                        required
                        >
                        {listRooms.map((room) => (
                            <option key={room.id} value={room.id}>{room.RoomName}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 mt-3 button-container">
                    <button type="submit" className="btn btn-primary mb-3">Cập nhật</button>
                </div>
            </form>
        </div>
    )
}

export default EditUser;