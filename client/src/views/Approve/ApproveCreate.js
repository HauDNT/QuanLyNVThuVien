import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import '../../styles/ApproveCreate.scss';

function ApproveCreate() {
    const {id} = useParams();
    const [statusDoc, setStatusDoc] = useState([]);
    const [storeTypes, setStoreTypes] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [listBills, setListBills] = useState([]);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/statusdoc`)
                .then((res) => {
                    setStatusDoc(res.data.types)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));

            axios
                .get(`http://${config.URL}/storetypes`)
                .then((res) => {
                    setStoreTypes(res.data.types)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));

            axios
                .get(`http://${config.URL}/rooms/all`)
                .then((res) => {
                    setListRoom(res.data.rooms)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));

            axios
                .get(`http://${config.URL}/bills/all`)
                .then((res) => {
                    setListBills(res.data.bills)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    }, [])

    
    // Hàm này sẽ trả về một mã đăng ký, đồng thời tạo thêm một numberCode tăng 1 đơn vị
    const GenerateCode = (headerCode, numberCode, lengthNeed) => {
        const resisCode = headerCode + "." + numberCode;    // Return regis code present
        let newNumberCode = +numberCode + 1;

        let str = '';
        for (let i = 1; i <= lengthNeed; i++)
            str = str.concat('0');              // Tạo ra 1 dãy số 0 để đưa vào tạo mã mới

        newNumberCode = (str + newNumberCode).slice(-lengthNeed);
    };

    // Hàm hiển thị định đạng: ngày/tháng/năm
    const formatAndDisplayDatetime = (dateString) => {
        const date = new Date(dateString);
        dateString = 
            `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return dateString;
    };



    return (
        <form method="POST" className="container container--approve-create">
            <div className="row">
                <h3 className="approve-header">Phân phối tài liệu</h3>
            </div>
            <div className="row">
                <div class="col input-group">
                    <span class="input-group-text" id="basic-addon1">Mã vạch</span>
                    <input type="text" class="form-control" placeholder="VD: PM23.086594" required/>
                </div>
                <div class="col input-group">
                    <span class="input-group-text" id="basic-addon1">Số đăng ký cá biệt</span>
                    <input type="text" class="form-control" placeholder="VD: PM23.086594" readOnly/>
                </div>
            </div>
            <div className="row">
                <div class="col input-group">
                    <span class="input-group-text" id="basic-addon1">Thể loại lưu trữ</span>
                    <select class="form-select">
                        {storeTypes.length > 0 ? (
                            storeTypes.map((types) => (<option value={types.id}>{types.NameType}</option>))
                        ) : (
                            <option value="0" selected>Không nhận được dữ liệu</option>
                        )}
                    </select>
                </div>
                <div class="col input-group">
                    <span class="input-group-text" id="basic-addon1">Số lượng</span>
                    <input type="number" class="form-control" required/>
                </div>
            </div>
            <div className="row">
                <div class="col input-group">
                    <span class="input-group-text" id="basic-addon1">Vị trí lưu trữ</span>
                    <select class="form-select">
                        {listRoom.length > 0 ? (
                            listRoom.map((room) => (<option value={room.id}>{room.RoomName}</option>))
                        ) : (
                            <option value="0" selected>Không nhận được dữ liệu</option>
                        )}
                    </select>
                </div>
                <div class="col input-group">
                    <span class="input-group-text" id="basic-addon1">Vị trí tạm thời</span>
                    <select class="form-select">
                        {listRoom.length > 0 ? (
                            listRoom.map((room) => (<option value={room.id}>{room.RoomName}</option>))
                        ) : (
                            <option value="0" selected>Không nhận được dữ liệu</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="row">
                <div class="col input-group">
                    <span class="input-group-text" id="basic-addon1">Trạng thái</span>
                    <select class="form-select">
                        {statusDoc.length > 0 ? (
                                statusDoc.map((status) => (<option value={status.id}>{status.Status}</option>))
                            ) : (
                                <option value="0" selected>Không nhận được dữ liệu</option>
                            )
                        }
                    </select>
                </div>
                <div class="col input-group">
                    <span class="input-group-text" id="basic-addon1">Mã đơn hàng</span>
                    <select class="form-select">
                        {listBills.length > 0 ? (
                                listBills.map((bill) => (<option value={bill.id}> {formatAndDisplayDatetime(bill.createdAt)} - {bill.NameBill}</option>))
                            ) : (
                                <option value="0" selected>Không nhận được dữ liệu</option>
                            )
                        }
                    </select>
                </div>
            </div>
            <div className="row">
                <div class="input-group">
                    <span class="input-group-text">Ghi chú</span>
                    <textarea class="form-control"></textarea>
                </div>
            </div>
            <div className="row">
                <div class="button-container">
                    <button type="submit" className="btn btn-primary mb-3">Phân phối</button>
                </div>
            </div>
        </form>
    );
};

export default ApproveCreate;