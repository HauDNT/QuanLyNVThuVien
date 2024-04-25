import React, {useState, useEffect, useContext} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import { RoomContext } from "../../context/RoomContext.js";
import { BillContext } from "../../context/BillContext.js";
import { StatusDocContext } from "../../context/StatusDocsContext.js";
import { StoreTypesContext } from "../../context/StoreTypesContext.js";
import '../../styles/ApproveCreate.scss';

function ApproveUpdate() {
    const {id} = useParams();
    const [approveInfo, setApproveInfo] = useState([]);
    const [inputChange, setInputChange] = useState([]);
    const {listRooms} = useContext(RoomContext);
    const {listBills} = useContext(BillContext);
    const {statusDocs} = useContext(StatusDocContext);
    const {storeTypes} = useContext(StoreTypesContext);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/approve/item/${id}`)
                .then((res) => {
                    setApproveInfo(res.data.info)
                })
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    }, []);

    // Hàm nhận biết dữ liệu khác với dữ liệu gốc, nếu khác thì cho vào State inputChange để đem đi update:
    const whatIsChanging = (e) => {
        // Đưa dữ liệu thay đổi vào state để cập nhật lại giao diện:
        const {name, value} = e.target;
        setApproveInfo({...approveInfo, [name]: value});

        // Nếu dữ liệu này khác với state gốc thì đưa vô state inputChange để lưu name và value
        if (approveInfo[name] !== undefined && approveInfo[name] !== inputChange[name]) 
            setInputChange({...inputChange, [name]: value});

        // Nếu thay đổi mà không khác gì so với bản gốc thì remove name và value của input ra khỏi state inputChange
        else if (approveInfo[name] !== undefined) {
            const updateInputChange = {...inputChange};
            delete updateInputChange[name];
            setInputChange(updateInputChange);
        }
    };

    const formatAndDisplayDatetime = (dateString) => {
        const date = new Date(dateString);
        dateString = 
            `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return dateString;
    };

    const handleUpdateApprove = (data) => {
        if (!data) {
            toast.warning("Bạn phải điền đầy đủ thông tin!");
            return;
        };

        if (inputChange.length === 0) {
            toast.info("Không có dữ liệu nào mới để cập nhật!");
            return;
        };

        try {
            axios
                .put(`http://${config.URL}/approve/update/${id}`, data, {headers: {authenToken: localStorage.getItem('authenToken')}})
                .then((res) => {
                    if (res.data.error) {
                        toast.error(res.data.error);
                    }
                    else {
                        toast.success(res.data.success);
                    }
                });
        } catch (error) {
            toast.error('Đã xảy ra lỗi trong quá trình cập nhật!');
        }

    };

    return (
        <form method="POST" className="container container--approve-create">
            <div className="row">
                <h3 className="approve-header">Chỉnh sửa phân phối</h3>
            </div>
            <div className="row">
                <div className="col input-group">
                    <span className="input-group-text" id="basic-addon1">Mã vạch</span>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="RegisCode"
                        value={approveInfo.RegisCode}
                        placeholder="VD: PM23.086594"
                        onChange={(e) => whatIsChanging(e)}
                        />
                </div>
                <div className="col input-group">
                    <span className="input-group-text" id="basic-addon1">Số ĐKCB</span>
                    <input 
                        type="text" 
                        className="form-control" 
                        name="RegisCode"
                        value={approveInfo.RegisCode}
                        placeholder="VD: PM23.086594" 
                        readOnly/>
                </div>
            </div>
            <div className="row">
                <div className="col input-group">
                    <span className="input-group-text" id="basic-addon1">Thể loại lưu trữ</span>
                    <select 
                        className="form-select" 
                        name="StoreTypeId"
                        onChange={(e) => whatIsChanging(e)}
                        required>
                        
                        <option value="0" selected>Chọn thể loại lưu trữ</option>
                        {
                            storeTypes ? 
                            (
                                storeTypes.map(types => (
                                    types.id === approveInfo.StoreTypeId ? 
                                    (<option value={types.id} selected>{types.NameType}</option>) : (<option value={types.id}>{types.NameType}</option>)
                                ))
                            ) : (
                                <option value=''>Không có dữ liệu</option>
                            )
                        }
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col input-group">
                    <span className="input-group-text" id="basic-addon1">Vị trí lưu trữ</span>
                    <select 
                        className="form-select" 
                        name="RoomId"
                        onChange={(e) => whatIsChanging(e)}
                        required>
                        <option value="0" selected>Chọn vị trí lưu trữ</option>
                        {
                            listRooms ? 
                            (
                                listRooms.map(room => (
                                    room.id === approveInfo.RoomId ? 
                                    (<option value={room.id} selected>{room.RoomName}</option>) : (<option value={room.id}>{room.RoomName}</option>)
                                ))
                            ) : (
                                <option value=''>Không có dữ liệu</option>
                            )
                        }
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col input-group">
                    <span className="input-group-text" id="basic-addon1">Trạng thái</span>
                    <select 
                        className="form-select" 
                        name="StatusDocId"
                        onChange={(e) => whatIsChanging(e)}
                        required>
                            <option value="0" selected>Chọn trạng thái tài liệu</option>
                            {
                                statusDocs ? (
                                    statusDocs.map(status => (
                                        status.id === approveInfo.StatusDocId ? 
                                        (<option value={status.id} selected>{status.Status}</option>) : (<option value={status.id}>{status.Status}</option>)
                                    ))
                                ) : (
                                    <option value="0" selected>Không nhận được dữ liệu</option>
                                )
                            }
                    </select>
                </div>
                <div className="col input-group">
                    <span className="input-group-text" id="basic-addon1">Mã đơn hàng</span>
                    <select 
                        className="form-select"
                        name="BillId"
                        onChange={(e) => whatIsChanging(e)}
                        required>
                            <option value="0" selected>Chọn mã đơn hàng</option>
                            {
                                listBills ? 
                                (
                                    listBills.map(bill => (
                                        bill.id === approveInfo.BillId ? 
                                        (<option value={bill.id} selected>{formatAndDisplayDatetime(bill.createdAt)} - {bill.NameBill}</option>) 
                                        : 
                                        (<option value={bill.id}>{formatAndDisplayDatetime(bill.createdAt)} - {bill.NameBill}</option>)
                                    ))
                                ) : (
                                    <option value=''>Không có dữ liệu</option>
                                )
                            }
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="input-group">
                    <span 
                        className="input-group-text" 
                        >Ghi chú</span>
                    <textarea 
                        className="form-control"
                        name="Notes"
                        onChange={(e) => whatIsChanging(e)}
                        value={approveInfo.Notes}
                        ></textarea>
                </div>
            </div>
            <div className="row">
                <div className="btn-container">
                    <button 
                        type="button" 
                        className="btn btn-primary mb-3"
                        onClick={() => handleUpdateApprove(inputChange)}
                    >Cập nhật</button>
                </div>
            </div>
        </form>
    )
}

export default ApproveUpdate;