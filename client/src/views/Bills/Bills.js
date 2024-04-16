import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import config from '../../constance.js';
import {FcViewDetails} from "react-icons/fc";
import {FaEdit, FaTimesCircle } from "react-icons/fa";
import "../../styles/Bills.scss";

function Bills() {
    let {type} = useParams();
    const [backLink, setBackLink] = useState('');
    const [listBills, setListBills] = useState([]);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/bills/${type}`)
            .then((res) => {
                setListBills(res.data.receiveBills)
                setBackLink(`/bills/${type}`)
            });
    }, [type]);

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
                    {listBills.map((bill) => (
                            <tr key={bill.id} className="text-center">
                                <td className="table-secondary"> {bill.NumberBill} </td>
                                <td className="table-secondary"> {bill.NameBill} </td>
                                <td className="table-secondary"> {bill.DateGenerateBill} </td>
                                <td className="table-secondary"><FcViewDetails className="info-icon"/></td>
                                <td className="table-secondary"><FaEdit className="edit-icon"/></td>
                                <td className="table-secondary"><FaTimesCircle  className="delete-icon"/></td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Bills;