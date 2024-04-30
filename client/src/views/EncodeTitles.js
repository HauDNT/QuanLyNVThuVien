import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import config from '../constance.js';
import { toast } from "react-toastify";
import LoadingWindow from "./Components/Loading.js";

function EncodeTitles() {
    const [encodeTitles, setEncodeTitles] = useState([]);

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

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
                    }, 500);
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
                <table className="table table-dark">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col" className="table-dark text-center"> Ký tự </th>
                            <th scope="col" className="table-dark text-center"> Số mã hóa </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            encodeTitles && encodeTitles.length > 0 ?
                            (encodeTitles.map((item) => (
                                <tr key={item.id} className="text-center">
                                    <td className="table-light"> {item.Character} </td>
                                    <td className="table-light"> {item.NumberEncrypt} </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td className="table-light text-center" colSpan={2}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                            )}
                    </tbody>
                </table>
                )
            }
        </>
    )
};

export default EncodeTitles;