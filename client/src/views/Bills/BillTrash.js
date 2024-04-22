import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import {FcUndo} from "react-icons/fc";
import "../../styles/Bills.scss";

function BillTrash() {
    let {type} = useParams();
    const [listBill, setListBill] = useState([]);
    const [billSelected, setBillSelected] = useState([]);
    const [checkAll, setCheckAll] = useState(false);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/bills/trash/${type}`)
            .then((res) => {
                setListBill(res.data.billDeleted)
            });
    }, [type]);

    const formatAndDisplayDatetime = (dateString) => {
        const date = new Date(dateString);
        dateString = 
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}
            ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return dateString;
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

    // Hàm restore:
    const handleRestore = () => {
        const restorePromises = billSelected.map((billIdSelected) => {
            return axios
                .patch(`http://${config.URL}/bills/trash/restore/${billIdSelected}`);
        });

        Promise
            .all(restorePromises)
            .then((res) => {
                let status = false;
                res.forEach((res, index) => {
                    const eachBillSelected = billSelected[index];
                    if (!res.data.error) {
                        setListBill((oldList) => oldList.filter((bill) => bill.id !== eachBillSelected));
                        status = true;
                    }
                });

                if (status)
                    toast.success('Khôi phục đơn thành công!');
                else 
                    toast.error('Khôi phục đơn không thành công!');
            })
            .catch((error) => {
                toast.error("Đã xảy ra lỗi khi gọi API đến Server...");
            });
    };

    // Hàm xóa cứng (force delete):
    const handleForceDelete = () => {
        const deletePromises = billSelected.map((billIdSelected) => {
            return axios
                .delete(
                    `http://${config.URL}/bills/trash/delete/${billIdSelected}`,
                    {
                        headers: {'authenToken': localStorage.getItem('authenToken')}
                    });
        });

        Promise
            .all(deletePromises)
            .then((res) => {
                let status = false;
                res.forEach((res, index) => {
                    const eachBillSelected = billSelected[index];
                    if (!res.data.error) {
                        setListBill((oldList) => oldList.filter((bill) => bill.id !== eachBillSelected));
                        status = true;
                    }
                });

                if (status)
                    toast.success('Xóa đơn thành công!');
                else 
                    toast.error('Xóa đơn không thành công!');
            })
            .catch((error) => {
                toast.error("Đã xảy ra lỗi khi gọi API đến Server...");
            });
    };

    return (
        <div className="container-fluid bill-page">
            <Link className="btn btn-outline-secondary btn-trash" to={`/bills/${type}`}>
                <FcUndo className="trash-icon"/> Quay lại
            </Link>
            <button className="btn btn-danger btn--bill-page" onClick={() => handleForceDelete()}>Xóa vĩnh viễn</button>
            <button className="btn btn-primary btn--bill-page" onClick={() => handleRestore()}>Khôi phục</button>
            <table className="table table-dark">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="table-dark text-center"> 
                            <input id="checkbox-parent" class="select-all form-check-input" type="checkbox" value="" onClick={(e) => handleCheckAll(e)}/>
                        </th>
                        <th scope="col" className="table-dark text-center">Mã đơn</th>
                        <th scope="col" className="table-dark text-center">Tên đơn</th>
                        <th scope="col" className="table-dark text-center">Thời gian tạo</th>
                        <th scope="col" className="table-dark text-center">Thời gian xóa</th>
                        <th scope="col" className="table-dark text-center">Nhà xuất bản</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listBill.length > 0 ?
                        (listBill.map((bill) => (
                            <tr key={bill.id} className="text-center">
                                <td className="table-light">
                                    <input data-parent="checkbox-parent" class="form-check-input" type="checkbox" value={bill.id} onClick={(e) => handleCheck(e)}/>
                                </td>
                                <td className="table-light"> {bill.id} </td>
                                <td className="table-light"> {bill.NameBill} </td>
                                <td className="table-light"> {bill.DateGenerateBill} </td>
                                <td className="table-light"> {formatAndDisplayDatetime(bill.deletedAt)} </td>
                                <td className="table-light"> {bill.Supplier} </td>
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
    )
}


export default BillTrash;