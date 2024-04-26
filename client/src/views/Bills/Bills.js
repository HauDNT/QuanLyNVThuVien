import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import Searchbar from "../Components/Searchbar.js";
import {FcViewDetails} from "react-icons/fc";
import {FaEdit, FaTimesCircle, FaTrash } from "react-icons/fa";
import "../../styles/Bills.scss";

function Bills() {
    const {type} = useParams();
    const [listBills, setListBills] = useState([]);
    const [billSelected, setBillSelected] = useState([]);
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/bills/${type}`)
            .then((res) => {
                setListBills(res.data.receiveBills)
            });
    }, [type]);

    const formatAndDisplayDatetime = (dateString) => {
        const date = new Date(dateString);
        dateString = 
            `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return dateString;
    };

    // Hàm xóa từng đơn:
    const handleDeteleBill = () => {
        const deletePromises = billSelected.map((billIdSeleted) => {
            return axios
                .delete(
                    `http://${config.URL}/bills/deletebill/${billIdSeleted}`,
                    {
                        headers: {authenToken: localStorage.getItem('authenToken')}
                    });
                });

        Promise
            .all(deletePromises)
            .then((res) => {
                let status = false;
                res.forEach((res, index) => {
                    const eachBillSelected = billSelected[index];
                    if (!res.data.error) {
                        setListBills((oldList) => oldList.filter((bill) => bill.id !== eachBillSelected));
                        status = true;
                    }
                });

            if (status)
                toast.success('Xóa đơn thành công');
            else 
                toast.error('Xóa đơn không thành công!');
        });
    };

    // Hàm xử lý khi check chọn 1 đơn:
    const handleCheck = (event) => {
        const {checked, value} = event.target;
        if (checked) {
            setBillSelected([...billSelected, +value]);
        }
        else {            
            setBillSelected(billSelected.filter(billId => billId !== +value));
            setCheckAll(checked);
        };
    };

    // Hàm xử lý khi check chọn tất cả đơn:
    const handleCheckAll = (event) => {
        const {checked} = event.target;
        setCheckAll(checked);

        const allChildCheckboxes = document.querySelectorAll('input[type="checkbox"][data-parent="checkbox-parent"]');
        const selectedBills = [];

        allChildCheckboxes.forEach(eachCheckbox => {
            eachCheckbox.checked = checked;
                if (checked) {
                    selectedBills.push(+eachCheckbox.value);
                }
                else {
                    setBillSelected(billSelected.filter(billId => billId !== +eachCheckbox.value));
                }
            });
        
        setBillSelected(selectedBills);
    };

    const handleSearchResultChange = (result) => {
        setListBills(result);
    };

    return (
        <>
            <Searchbar
                searchType="bills" 
                placeholder="Chọn hạng mục và nhập để tìm kiếm"
                categories={[
                    // value là cột của model
                    {value: "*", name: "Tất cả"},
                    {value: "id", name: "Mã đơn"},
                    {value: "NameBill", name: "Tên đơn"},
                ]}
                onSearchResultChange={handleSearchResultChange}     
                orderChoice={type}
                // Gọi một callback function để khi có kết quả tìm kiếm thì cập nhật lại listBills
            />

            <div className="bill-page">
                <div className="row">
                    <div className="col-3">
                        <Link className="btn btn-outline-secondary btn-trash" to={`/bills/trash/${type}`}>
                            <FaTrash className="trash-icon"/> Đơn đã xóa
                        </Link>
                    </div>
                    <div className="col-9 btn-container">
                        <button className="btn btn-danger btn--bill-page" onClick={() => handleDeteleBill()}>Xóa</button>
                        <Link className="btn btn-primary btn--bill-page" to="/bills/">Sửa</Link>
                        <Link className="btn btn-success btn--bill-page" to="/bills/createbill">Tạo đơn mới</Link>
                    </div>
                </div>
                <table className="table table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col" className="table-dark text-center"> 
                                <input id="checkbox-parent" class="select-all form-check-input" type="checkbox" value="" onClick={(e) => handleCheckAll(e)}/>
                            </th>
                            <th scope="col" className="table-dark text-center"> Mã đơn </th>
                            <th scope="col" className="table-dark text-center"> Tên đơn </th>
                            <th scope="col" className="table-dark text-center"> Thời gian tạo </th>
                            <th scope="col" className="table-dark text-center"> Xem chi tiết </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listBills.length > 0 ?
                            (listBills.map((bill) => (
                                <tr key={bill.id} className="text-center">
                                    <td className="table-light">
                                        <input data-parent="checkbox-parent" class="form-check-input" type="checkbox" value={bill.id} onClick={(e) => handleCheck(e)}/>
                                    </td>
                                    <td className="table-light"> {bill.id} </td>
                                    <td className="table-light"> {bill.NameBill} </td>
                                    <td className="table-light"> {formatAndDisplayDatetime(bill.DateGenerateBill)} </td>
                                    <td className="table-light">
                                        <Link to={`/bills/detail/${bill.id}`}>
                                            <FcViewDetails className="info-icon table-icon"/>
                                        </Link>
                                    </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td className="table-light text-center" colSpan={6}>
                                    Chưa có hóa đơn nào thuộc loại này được tạo
                                </td>
                            </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Bills;