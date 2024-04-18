import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import {FcSynchronize} from "react-icons/fc";
import {FaEdit, FaTimesCircle } from "react-icons/fa";
import "../../styles/Bills.scss";

function BillTrash() {
    let {type} = useParams();
    const [listBillDeleted, setListBillDeleted] = useState([]);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/bills/trash/${type}`)
            .then((res) => {
                setListBillDeleted(res.data.billDeleted)
            });
    }, [type]);

    const formatAndDisplayDatetime = (dateString) => {
        const date = new Date();
        dateString = 
            `
                ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 
                ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}
            `;
        return dateString;
    };

    return (
        <div className="container-fluid bill-page">
            <table className="table table-dark">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="table-dark text-center">Mã đơn</th>
                        <th scope="col" className="table-dark text-center">Tên đơn</th>
                        <th scope="col" className="table-dark text-center">Thời gian tạo</th>
                        <th scope="col" className="table-dark text-center">Thời gian xóa</th>
                        <th scope="col" className="table-dark text-center">Nhà xuất bản</th>
                        <th scope="col" className="table-dark text-center">Khôi phục</th>
                        <th scope="col" className="table-dark text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listBillDeleted.length > 0 ?
                        (listBillDeleted.map((bill) => (
                            <tr key={bill.id} className="text-center">
                                <td className="table-light"> {bill.NumberBill} </td>
                                <td className="table-light"> {bill.NameBill} </td>
                                <td className="table-light"> {bill.DateGenerateBill} </td>
                                <td className="table-light"> {formatAndDisplayDatetime(bill.deletedAt)} </td>
                                <td className="table-light"> {bill.Supplier} </td>
                                <td className="table-light">
                                    <FcSynchronize className="info-icon table-icon"/>
                                </td>
                                <td className="table-light">
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
    )
}


export default BillTrash;