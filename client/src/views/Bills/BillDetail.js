import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import config from '../../constance.js';
import Searchbar from "../Components/Searchbar.js";
import LoadingWindow from "../Components/Loading.js";
import Paginate from "../../context/PaginateContext.js";
import {formatCash} from "../../utils/FormatCash.js";
import "../../styles/Bills.scss";

function BillDetail() {
    const {billId} = useParams();
    const [detail, setDetail] = useState([]);

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    // Số bảng ghi phân trang (1 trang):
    const [records, setRecords] = useState(0);

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

    const applyPaginate = (records) => {
        setRecords(records);
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
                        <table className="styled-table">
                            <thead>
                                <tr>
                                    <th scope="col" className="text-center">Mã sách</th>
                                    <th scope="col" className="text-center">Tiêu đề chính</th>
                                    <th scope="col" className="text-center">Tác giả</th>
                                    <th scope="col" className="text-center">Đơn giá</th>
                                    <th scope="col" className="text-center">Số lượng</th>
                                    <th scope="col" className="text-center">Chiết khấu (%)</th>
                                    <th scope="col" className="text-center">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    records && records.length > 0 ?
                                    (records.map((info) => (
                                        <tr key={info.BookId} className="text-center">
                                            <td> {info.BookId} </td>
                                            <td> {info.MainTitle} </td>
                                            <td> {info.Author} </td>
                                            <td> {formatCash(info.UnitPrice)} </td>
                                            <td> {info.Amount} </td>
                                            <td> {info.Discount} </td>
                                            <td> 
                                                {formatCash(info.UnitPrice * info.Amount * (1 - info.Discount / 100))} 
                                            </td>
                                        </tr>
                                    ))) : (
                                    <tr>
                                        <td className="text-center" colSpan={7}>
                                            Không có sách nào được phân phối vào hóa đơn này
                                        </td>
                                    </tr>
                                    )}

                                    <tr>
                                        <td className="text-center" colSpan={7}>
                                            Tổng tiền: {formatCash(calMoney())} VND
                                        </td>
                                    </tr>
                            </tbody>
                        </table>

                        <Paginate
                            data={detail}
                            applyPaginateData={applyPaginate}
                        />
                    </div>
                </>
                )
            }
        </>
    )
};

export default BillDetail;