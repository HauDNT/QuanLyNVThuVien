import React, {useState, useEffect} from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import {Link, useParams} from "react-router-dom";
import config from '../../constance.js';
import {FcInfo} from "react-icons/fc";
import {FaEdit, FaTimesCircle, FaTrash } from "react-icons/fa";
import "../../styles/Users.scss";

function EditUser() {
    const {id} = useParams();
    const [userInfo, setUserInfo] = useState([]);
    const [status, setStatus] = useState(false);
    const [listRooms, setListRooms] = useState([]);
    const [listPositions, setListPositions] = useState([]);
    const handleClearInput = () => {
        // setInputValues({
        //     username: '',
        //     password: '',
        //     repassword: '',
        //     fullname: '',
        //     email: '',
        //     birthday: '',   // Chú ý chỗ này
        //     position: 1,
        //     room: 1,
        //     avatar: '',
        // });
    };
    
    useEffect(() => {
        try {
            axios
                .get(`http://localhost:3002/users/info/${id}`)
                .then((res) => setUserInfo(res.data.userInfo))
            axios
                .get(`http://${config.URL}/rooms/all`)
                .then((res) => setListRooms(res.data.rooms));
            axios
                .get(`http://${config.URL}/positions/all`)
                .then((res) => setListPositions(res.data.positions));
        } catch (error) {
            toast.error('Đã xảy ra lỗi tại máy chủ, không thể lấy được thông tin! Hãy thử lại sau ít phút...');
        }
    }, [id]);

    const handleConvertToImg = (blobData) => {
        // Chuyển đổi dữ liệu thành ArrayBuffer
        const buffer = new Uint8Array(blobData).buffer;

        // Tạo Blob từ ArrayBuffer
        const blob = new Blob([buffer], {type: 'image/png'});

        // Tạo URL cho Blob
        const blobUrl = URL.createObjectURL(blob);

        return blobUrl;
    }
    
    return(
        <div className="creatpage-container">
            <h1 className="col-12 creatpage-heading">Thông tin tài khoản</h1>
            <form method="POST" className="createpage-form">
                <div className="row">
                    <div className="col-12 label-info">
                        <h5>Thông tin tài khoản</h5>
                    </div>
                    <div className="col-3 input-field">
                        {/* <label for="input--avatar" className="form-label">Ảnh đại diện</label> */}
                        <img src={handleConvertToImg(userInfo && userInfo.UsersInfo ? userInfo.UsersInfo.Avatar.data : "")} alt="Avatar" />
                        
                        <input 
                            name="avatar" 
                            type="file" 
                            id="input--avatar" 
                            className="form-control"
                            // value={inputValues.avatar}
                            // onChange={(e) => setInputValues({...inputValues, avatar: e.target.value})}
                            required/>
                    </div>
                    <div className="col-9">
                        <div className="row">
                            <div className="col input-field">
                                <label for="input--username" className="form-label">Tên tài khoản</label>
                                <input 
                                    name="username" 
                                    type="text" 
                                    id="input--username" 
                                    className="form-control"
                                    value={userInfo ? userInfo.Username : ""}
                                    // onChange={(e) => setInputValues({...inputValues, username: e.target.value})}
                                    required/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col input-field">
                                <label for="input--password" className="form-label">Mật khẩu</label>
                                <input 
                                    name="password" 
                                    type="text" 
                                    id="input--password" 
                                    className="form-control"
                                    // onChange={(e) => setInputValues({...inputValues, password: e.target.value})}
                                    placeholder="(Nhập vào để cập nhật mật khẩu mới...)"
                                    />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 label-info">
                        <h5>Thông tin cá nhân</h5>
                    </div>
                    <div className="col-6 input-field">
                        <label for="input--fullname" className="form-label">Họ và tên</label>
                        <input 
                            name="fullname" 
                            type="text" 
                            id="input--fullname" 
                            className="form-control"
                            value={userInfo && userInfo.UsersInfo ? userInfo.UsersInfo.Fullname : ""}
                            // onChange={(e) => setInputValues({...inputValues, fullname: e.target.value})}
                            required
                            />
                    </div>
                    <div className="col-6 input-field">
                        <label for="input--email" className="form-label">Email</label>
                        <input 
                            name="email" 
                            type="text" 
                            id="input--email" 
                            className="form-control"
                            value={userInfo && userInfo.UsersInfo ? userInfo.UsersInfo.Email : ""}
                            // onChange={(e) => setInputValues({...inputValues, email: e.target.value})}
                            required
                            />
                    </div>
                    <div className="col-4 input-field">
                        <label for="input--birthday" className="form-label">Ngày sinh (mm/dd/yyyy)</label>
                        <input 
                            name="birthday" 
                            type="date" 
                            id="input--birthday" 
                            className="form-control"
                            placeholder="dd-mm-yyyy"
                            value={userInfo && userInfo.UsersInfo ? userInfo.UsersInfo.Birthday : ""}
                            // onChange={(e) => setInputValues({...inputValues, birthday: e.target.value})}
                            required
                            />
                    </div>
                    <div className="col-4 input-field">
                        <label for="select--position" className="form-label">Chức vụ</label>
                        <select 
                            name="position" 
                            class="form-select" 
                            id="select--position" 
                            title="Chức vụ"
                            value={userInfo && userInfo.UsersInfo ? userInfo.UsersInfo.Position : ""}
                            // onChange={(e) => setInputValues({...inputValues, position: e.target.value})}
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
                            name="room" 
                            class="form-select" 
                            id="select--room" 
                            title="Phòng"
                            value={userInfo && userInfo.UsersInfo ? userInfo.UsersInfo.RoomId : ""}
                            // onChange={(e) => setInputValues({...inputValues, room: e.target.value})}
                            required
                            >
                            {listRooms.map((room) => (
                                <option key={room.id} value={room.id}>{room.RoomName}</option>
                            ))}
                        </select>
                    </div>
                </div>


                <div className="col-12 mt-3 button-container">
                    <button type="submit" className="btn btn-primary mb-3">Cập nhật</button>
                </div>
            </form>
        </div>
    )
}

export default EditUser;