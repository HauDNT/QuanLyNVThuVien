import React, {useEffect, useState} from "react";
import axios from "axios";
import config from '../../constance.js';
import '../../styles/CreatePage.scss';
import { toast } from "react-toastify";

function CreateAccountUser() {
    const [listRooms, setListRooms] = useState([]);
    const [listPositions, setListPositions] = useState([]);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/rooms/all`)
            .then((res) => {
                setListRooms(res.data.rooms);
            });

        axios
            .get(`http://${config.URL}/positions/all`)
            .then((res) => {
                setListPositions(res.data.positions);
            });
    }, []);

    return (
        <div className="creatpage-container">
            <h1 className="col-12 creatpage-heading">Tạo tài khoản mới</h1>
            <form method="POST" className="row createpage-form">        {/*onSubmit={handleCreateBill}*/}
                <div className="col-12 label-info">
                    <h5>Thông tin tài khoản</h5>
                </div>
                <div className="col-4 input-field">
                    <label for="input--username" className="form-label">Tên tài khoản</label>
                    <input 
                        name="username" 
                        type="text" 
                        id="input--username" 
                        className="form-control"
                        required/>
                </div>
                <div className="col-4 input-field">
                    <label for="input--password" className="form-label">Mật khẩu</label>
                    <input 
                        name="password" 
                        type="text" 
                        id="input--password" 
                        className="form-control"
                        required
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="input--re-password" className="form-label">Nhập lại mật khẩu</label>
                    <input 
                        name="repassword" 
                        type="text" 
                        id="input--re-password" 
                        className="form-control"
                        required
                        />
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
                        required
                        >
                        {listRooms.map((room) => (
                            <option key={room.id} value={room.id}>{room.RoomName}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 input-field">
                    <label for="input--avatar" className="form-label">Ảnh đại diện</label>
                    <input 
                        name="avatar" 
                        type="file" 
                        id="input--avatar" 
                        className="form-control"
                        required/>
                </div>
                <div className="col-12 mt-3 button-container">
                    <button type="submit" className="btn btn-primary mb-3">Tạo</button>
                </div>
            </form>
        </div>
    )
}

export default CreateAccountUser;