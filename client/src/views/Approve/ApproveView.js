import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import '../../styles/ApproveView.scss';

function ApproveView() {
    const {id: bookId} = useParams();
    const [listApproveInfo, setListApproveInfo] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [approveSelected, setApproveSelected] = useState([]);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/approve/get/${bookId}`, {headers: {authenToken: localStorage.getItem('authenToken')}})
                .then((res) => {
                    setListApproveInfo(res.data.approve);
                });
        } catch (error) {
            toast.error("Không thể tải lên phân phối!");
        }
    }, []);

    const formatAndDisplayDatetime = (dateString) => {
        const date = new Date(dateString);
        dateString = 
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}   |   ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return dateString;
    };

    const handleCheck = (event) => {
        const {checked, value} = event.target;
        if (checked) {
            setApproveSelected([...approveSelected, +value]);
        }
        else {            
            setApproveSelected(approveSelected.filter(approveId => approveId !== +value));
            setCheckAll(checked);
        };
    };

    const handleCheckAll = (event) => {
        const {checked} = event.target;
        setCheckAll(checked);

        const allChildCheckboxes = document.querySelectorAll('input[type="checkbox"][data-parent="checkbox-parent"]');
        const selectedApproves = [];

        allChildCheckboxes.forEach(eachCheckbox => {
            eachCheckbox.checked = checked;
                if (checked) {
                    selectedApproves.push(+eachCheckbox.value);
                }
                else {
                    setApproveSelected(approveSelected.filter(approveId => approveId !== +eachCheckbox.value));
                }
            });
        
        setApproveSelected(selectedApproves);
    };

    const handleDeleteApprove = () => {
        const deletePromises = approveSelected.map((approveId) => {
            return axios
                .delete(
                    `http://${config.URL}/approve/delete/${approveId}`,
                    {
                        headers: {authenToken: localStorage.getItem('authenToken')},
                        data: {BookId: bookId},
                    });
                });

        Promise
            .all(deletePromises)
            .then((res) => {
                let status = false;
                res.forEach((res, index) => {
                    const eachApproveSelected = approveSelected[index];
                    if (!res.data.error) {
                        setListApproveInfo((oldList) => oldList.filter((approve) => approve.id !== eachApproveSelected));
                        status = true;
                    }
                });

            if (status)
                toast.success('Xóa phân phối thành công!');
            else 
                toast.error('Xóa phân phối không thành công!');
        }
        );
    };

    return (
        <div className="container">
            <button 
                className="btn btn-outline-secondary" 
                onClick={() => window.history.back()}>Quay lại</button>
            <Link 
                className="btn btn-primary btn-create" 
                to={`/approve/create/${bookId}`}>Tạo phân phối</Link>
            <button className="btn btn-danger btn-delete" onClick={() => handleDeleteApprove()}>Xóa</button>
            <table className="table table-dark">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="table-dark text-center">
                            <input id="checkbox-parent" class="select-all form-check-input" type="checkbox" value="" onClick={(e) => handleCheckAll(e)}/>
                        </th>
                        <th scope="col" className="table-dark text-center">STT</th>
                        <th scope="col" className="table-dark text-center">Mã ĐKCB</th>
                        <th scope="col" className="table-dark text-center">Vị trí</th>
                        <th scope="col" className="table-dark text-center">Thể lại lưu trữ</th>
                        <th scope="col" className="table-dark text-center">Trạng thái</th>
                        <th scope="col" className="table-dark text-center">Ngày tạo</th>
                        <th scope="col" className="table-dark text-center">Ngày cập nhật</th>
                        <th scope="col" className="table-dark text-center">Người thực hiện</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listApproveInfo.length > 0 ?
                        (
                            listApproveInfo.map((approve) => (
                                <tr key={approve.id} className="text-center">
                                    <td className="table-light">
                                        <input data-parent="checkbox-parent" class="form-check-input" type="checkbox" value={approve.id} onClick={(e) => handleCheck(e)}/>
                                    </td>
                                    <td className="table-light"></td>
                                    <td className="table-light">{approve.RegisCode}</td>
                                    <td className="table-light">{approve.Room.RoomName}</td>
                                    <td className="table-light">{approve.StoreType.NameType}</td>
                                    <td className="table-light">{approve.StatusDoc.Status}</td>
                                    <td className="table-light">{formatAndDisplayDatetime(approve.createdAt)}</td>
                                    <td className="table-light">{formatAndDisplayDatetime(approve.updatedAt)}</td>
                                    <td className="table-light">{approve.User.username}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="table-light text-center" colSpan={8}>
                                    Chưa có phân phối nào được tạo
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ApproveView;