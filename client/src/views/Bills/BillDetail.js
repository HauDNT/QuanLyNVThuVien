import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import Searchbar from "../Components/Searchbar.js";
import LoadingWindow from "../Components/Loading.js";
import "../../styles/Bills.scss";

function BillDetail() {
    const {billId} = useParams();
    const [detail, setDetail] = useState([]);

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/bills/detail/${billId}`)
            .then((res) => {
                setTimeout(() => {
                    setDetail(res.data);
                    setLoading(false);
                    setShowData(true);
                }, 500);
            });
    }, []);

    const calMoney = () => {
        let total = 0;

        if (detail) {
            detail.map((each) => {
                total += each.UnitPrice * each.Amount * (1 - each.Discount / 100);
            })
        }

        return total;
    };

    const handleSearchResultChange = (result) => {
        setDetail(result);
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
                        searchType="booksOfBill"    // Lấy type booksOfBill
                        placeholder="Chọn hạng mục và nhập để tìm kiếm"
                        categories={[
                            // value là cột của model
                            {value: "*", name: "Tất cả"},
                            {value: "id", name: "Mã sách"},
                            {value: "MainTitle", name: "Tiêu đề chính"},
                            {value: "UnitPrice", name: "Đơn giá"},
                        ]}
                        onSearchResultChange={handleSearchResultChange}  
                        orderChoice={billId}
                    />
                    <div className="bill-page">
                        <button onClick={() => window.history.back()} className="btn btn-primary btn--bill-page">Quay về</button>
                        <table className="table table-dark">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col" className="table-dark text-center">Mã sách</th>
                                    <th scope="col" className="table-dark text-center">Tiêu đề chính</th>
                                    <th scope="col" className="table-dark text-center">Tác giả</th>
                                    <th scope="col" className="table-dark text-center">Đơn giá</th>
                                    <th scope="col" className="table-dark text-center">Số lượng</th>
                                    <th scope="col" className="table-dark text-center">Chiết khấu (%)</th>
                                    <th scope="col" className="table-dark text-center">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    detail && detail.length > 0 ?
                                    (detail.map((info) => (
                                        <tr key={info.BookId} className="text-center">
                                            <td className="table-light"> {info.BookId} </td>
                                            <td className="table-light"> {info.MainTitle} </td>
                                            <td className="table-light"> {info.Author} </td>
                                            <td className="table-light"> {info.UnitPrice} </td>
                                            <td className="table-light"> {info.Amount} </td>
                                            <td className="table-light"> {info.Discount} </td>
                                            <td className="table-light"> 
                                                {info.UnitPrice * info.Amount * (1 - info.Discount / 100)} 
                                            </td>
                                        </tr>
                                    ))) : (
                                    <tr>
                                        <td className="table-light text-center" colSpan={7}>
                                            Không có sách nào được phân phối vào hóa đơn này
                                        </td>
                                    </tr>
                                    )}

                                    <tr>
                                        <td className="table-light text-center" colSpan={7}>
                                            Tổng tiền: {calMoney()} VND
                                        </td>
                                    </tr>
                            </tbody>
                        </table>
                    </div>
                </>
                )
            }
        </>
    )
};

export default BillDetail;