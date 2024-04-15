import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
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

    return (
        <div className="container-fluid bill-page">
            <Link className="btn btn-primary btn-insert-bill" to="/">Tạo đơn mới</Link>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="text-center"> Mã đơn </th>
                        <th scope="col" className="text-center"> Tên đơn </th>
                        <th scope="col" className="text-center"> Thời gian tạo </th>
                        <th scope="col" className="text-center"> Xem danh sách </th>
                        <th scope="col" className="text-center">Sửa</th>
                        <th scope="col" className="text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {listBills.map((bill) => (
                            <tr key={bill.id} className="text-center">
                                <td> {bill.NumberBill} </td>
                                <td> {bill.NameBill} </td>
                                <td> {bill.DateGenerateBill} </td>
                                <td><FcViewDetails className="info-icon"/></td>
                                <td><FaEdit className="edit-icon"/></td>
                                <td><FaTimesCircle  className="delete-icon"/></td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Bills;