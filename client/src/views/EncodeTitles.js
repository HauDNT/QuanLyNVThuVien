import React, { useState, useEffect } from "react";
import axios from 'axios';
import config from '../constance.js';
import { toast } from "react-toastify";
import LoadingWindow from "./Components/Loading.js";
import Paginate from "../context/PaginateContext.js";

function EncodeTitles() {
    const [encodeTitles, setEncodeTitles] = useState([]);

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    // Số bảng ghi phân trang (1 trang):
    const [records, setRecords] = useState(0);

    const applyPaginate = (records) => {
        setRecords(records);
    };

    useEffect(() => {
        axios
            .get(`http://${config.URL}/books/encodetitles`)
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                }
                else {
                    setTimeout(() => {
                        setEncodeTitles(res.data);
                        setLoading(false);
                        setShowData(true);
                    }, 1000);
                }
            })
            .catch(error => toast.error('Đã xảy ra lỗi trong quá trình lấy dữ liệu!'));
    }, []);

    return (
        <>
            {
                isLoading ? 
                (<LoadingWindow/>)
                :
                (
                    <div className="row">
                        <div className="col-lg-12">
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th scope="col" className="text-center"> Ký tự </th>
                                        <th scope="col" className="text-center"> Số mã hóa </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        records && records.length > 0 ?
                                        (records.map((item) => (
                                            <tr key={item.id} className="text-center">
                                                <td> {item.Character} </td>
                                                <td> {item.NumberEncrypt} </td>
                                            </tr>
                                        ))) : (
                                        <tr>
                                            <td className="text-center" colSpan={2}>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                        )}
                                </tbody>
                            </table>
                            
                            <Paginate
                            data={encodeTitles}
                            applyPaginateData={applyPaginate}
                        />
                        </div>
                    </div>
                )
            }
        </>
    )
};

export default EncodeTitles;