import React, {useEffect, useState} from "react";
import axios from "axios";
import config from '../../constance.js';
import '../../styles/CreatePage.scss';
import { toast } from "react-toastify";

function CreateAccountUser() {
    const [status, setStatus] = useState(false);
    const [listRooms, setListRooms] = useState([]);
    const [listPositions, setListPositions] = useState([]);
    const [inputValues, setInputValues] = useState({
        username: '',
        password: '',
        repassword: '',
        fullname: '',
        email: '',
        birthday: '',   // Chú ý chỗ này
        position: 1,
        room: 1,
        avatar: null,
    });

    const handleClearInput = () => {
        setInputValues({
            username: '',
            password: '',
            repassword: '',
            fullname: '',
            email: '',
            birthday: '',   // Chú ý chỗ này
            position: 1,
            room: 1,
            avatar: '',
        });
    };

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
    }, [status]);

    const handleCreateAccount = (e) => {
        setStatus(true);
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const {username, password, repassword, fullname, email, birthday, position, room, avatar} = data;
            const account = {username, password, repassword};
            const information = {username, fullname, email, birthday, position, room, avatar};
            
            if (!account || !information) {
                toast.warning('Thông tin không đầy đủ!');
                return;
            };

            if (account.password !== account.repassword) {
                toast.warning('Mật khẩu không trùng khớp, hãy kiểm tra lại!');
                return;
            };

            axios
                .post(`http://${config.URL}/users/register`, account)
                .then(() => {
                    axios
                        .post(`http://${config.URL}/users/createinfo`, information)
                        .then((res) => {
                            if (res.data.success) {
                                setStatus(false);
                                handleClearInput();
                                toast.success(res.data.success);
                            }
                            else
                                toast.error(res.data.error);
                        })
                })
        } catch (error) {
            toast.error('Không thể tạo tài khoản. Hãy kiểm tra thông tin và thử lại!');
        }
    }

    return (
        <div className="creatpage-container">
            <h1 className="col-12 creatpage-heading">Tạo tài khoản mới</h1>
            <form method="POST" className="row createpage-form" onSubmit={handleCreateAccount}>
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
                        value={inputValues.username}
                        onChange={(e) => setInputValues({...inputValues, username: e.target.value})}
                        required/>
                </div>
                <div className="col-4 input-field">
                    <label for="input--password" className="form-label">Mật khẩu</label>
                    <input 
                        name="password" 
                        type="text" 
                        id="input--password" 
                        className="form-control"
                        value={inputValues.password}
                        onChange={(e) => setInputValues({...inputValues, password: e.target.value})}
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
                        value={inputValues.repassword}
                        onChange={(e) => setInputValues({...inputValues, repassword: e.target.value})}
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
                        value={inputValues.fullname}
                        onChange={(e) => setInputValues({...inputValues, fullname: e.target.value})}
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
                        value={inputValues.email}
                        onChange={(e) => setInputValues({...inputValues, email: e.target.value})}
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
                        value={inputValues.birthday}
                        onChange={(e) => setInputValues({...inputValues, birthday: e.target.value})}
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
                        value={inputValues.position}
                        onChange={(e) => setInputValues({...inputValues, position: e.target.value})}
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
                        value={inputValues.room}
                        onChange={(e) => setInputValues({...inputValues, room: e.target.value})}
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
                        value={inputValues.avatar}
                        onChange={(e) => setInputValues({...inputValues, avatar: e.target.value})}
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