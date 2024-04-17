import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import {FcViewDetails} from "react-icons/fc";
import {FaEdit, FaTimesCircle } from "react-icons/fa";
import "../../styles/Bills.scss";

function Bills() {
    let {type} = useParams();
    const [listBills, setListBills] = useState([]);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/bills/${type}`)
            .then((res) => {
                setListBills(res.data.receiveBills)
            });
    }, [type]);

    const handleDeteleBill = (id) => {
        axios
            .delete(`http://${config.URL}/bills/deletebill/${id}`, {headers: {authenToken: localStorage.getItem('authenToken')}})
            .then((res) => {
                if (!res.data.error) {
                    setListBills(listBills.filter((bill) => {
                        return bill.id !== id;
                    }));
                    toast.success(res.data.success);
                }
                else
                    toast.error(res.data.error);
            })
    };

    return (
        <div className="container-fluid bill-page">
            <Link className="btn btn-primary btn-insert-bill" to="/bills/createbill">Tạo đơn mới</Link>
            <table className="table table-dark">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="table-dark text-center"> Mã đơn </th>
                        <th scope="col" className="table-dark text-center"> Tên đơn </th>
                        <th scope="col" className="table-dark text-center"> Thời gian tạo </th>
                        <th scope="col" className="table-dark text-center"> Xem danh sách </th>
                        <th scope="col" className="table-dark text-center">Sửa</th>
                        <th scope="col" className="table-dark text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listBills.length > 0 ?
                        (listBills.map((bill) => (
                            <tr key={bill.id} className="text-center">
                                <td className="table-light"> {bill.NumberBill} </td>
                                <td className="table-light"> {bill.NameBill} </td>
                                <td className="table-light"> {bill.DateGenerateBill} </td>
                                <td className="table-light">
                                    <FcViewDetails className="info-icon table-icon"/>
                                </td>
                                <td className="table-light">
                                    <FaEdit className="edit-icon table-icon"/>
                                </td>
                                <td onClick={() => handleDeteleBill(bill.id)} className="table-light">
                                    <FaTimesCircle  className="delete-icon table-icon"/>
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
    );
}

export default Bills;