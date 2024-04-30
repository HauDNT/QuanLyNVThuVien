import React, {useState, useEffect, useContext} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import Searchbar from "../Components/Searchbar.js";
import LoadingWindow from "../Components/Loading.js";
import '../../styles/ApproveView.scss';

function ApproveView() {
    const {id: bookId} = useParams();
    const [listApproveInfo, setListApproveInfo] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [approveSelected, setApproveSelected] = useState([]);

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/approve/getApproves/${bookId}`)
                .then((res) => {
                    setTimeout(() => {
                        setListApproveInfo(res.data);
                        setLoading(false);
                        setShowData(true);
                    }, 500);
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

    const handleSearchResultChange = (result) => {
        setListApproveInfo(result);
    };

    return (
        <>
            {
                isLoading ?
                (<LoadingWindow/>) 
                : 
                (
                <>
                    <Searchbar
                        searchType="approve"
                        placeholder="Chọn hạng mục và nhập để tìm kiếm"
                        categories={[
                            // value là cột của model
                            {value: "*", name: "Tất cả"},
                            {value: "RegisCode", name: "Mã ĐKCB"},
                            {value: "Room", name: "Vị trí lưu trữ"},
                            {value: "StoreType", name: "Thể loại lưu trữ"},
                            {value: "StatusDoc", name: "Trạng thái tài liệu"},
                        ]}
                        onSearchResultChange={handleSearchResultChange}  
                        orderChoice={bookId}
                    />
                    <div className="approve-page">
                        <button 
                            className="btn btn-outline-secondary" 
                            onClick={() => window.history.back()}>Quay lại</button>
                        <button className="btn btn-danger btn-delete" onClick={() => handleDeleteApprove()}>Xóa</button>
                        <Link 
                            className="btn btn-primary btn-create" 
                            to={`/approve/create/${bookId}`}>Tạo phân phối</Link>
                        <table className="table table-dark">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col" className="table-dark text-center">
                                        <input id="checkbox-parent" class="select-all form-check-input" type="checkbox" value="" onClick={(e) => handleCheckAll(e)}/>
                                    </th>
                                    <th scope="col" className="table-dark text-center">Mã ĐKCB</th>
                                    <th scope="col" className="table-dark text-center">Vị trí lưu trữ</th>
                                    <th scope="col" className="table-dark text-center">Thể loại lưu trữ</th>
                                    <th scope="col" className="table-dark text-center">Trạng thái tài liệu</th>
                                    <th scope="col" className="table-dark text-center">Ngày tạo</th>
                                    <th scope="col" className="table-dark text-center">Ngày cập nhật</th>
                                    <th scope="col" className="table-dark text-center">Người thực hiện</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listApproveInfo && listApproveInfo.length > 0 ?
                                    (
                                        listApproveInfo.map((approve) => (
                                            <tr key={approve.id} className="text-center">
                                                <td className="table-light">
                                                    <input data-parent="checkbox-parent" class="form-check-input" type="checkbox" value={approve.id} onClick={(e) => handleCheck(e)}/>
                                                </td>
                                                <td className="table-light">
                                                    <Link className="link-update-approve" to={`/approve/update/${approve.id}`}>{approve.RegisCode}</Link>
                                                </td>
                                                <td className="table-light">{approve.RoomName}</td>
                                                <td className="table-light">{approve.NameType}</td>
                                                <td className="table-light">{approve.Status}</td>
                                                <td className="table-light">{formatAndDisplayDatetime(approve.createdAt)}</td>
                                                <td className="table-light">{formatAndDisplayDatetime(approve.updatedAt)}</td>
                                                <td className="table-light">{approve.Username}</td>
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
                </>
                )
            }
        </>
    );
};

export default ApproveView;