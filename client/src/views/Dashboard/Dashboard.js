import React, {useState, useEffect, useContext} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../constance";
import Chart_BooksPerBill from "../Charts/LineChart";
import LoadingWindow from "../Components/Loading.js";
import Card from "./Card";
import { LuBookMarked } from "react-icons/lu";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { BillContext } from "../../context/BillContext";
import "../../styles/Dashboard.scss";

function Dashboard() {
    const [books, setBooks] = useState(0);
    const {listBills} = useContext(BillContext);
    const [catalogs, setCatalogs] = useState(0);
    const [users, setUsers] = useState(0);

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    useEffect(() => {
        Promise
            .all([
                axios.get(`http://${config.URL}/books/amount`),
                axios.get(`http://${config.URL}/approve/amount`),
                axios.get(`http://${config.URL}/users/amount`),
            ])
            .then(([resBooks, resApproves, resUsers]) => {
                setTimeout(() => {
                    setBooks(resBooks.data);
                    setCatalogs(resApproves.data);
                    setUsers(resUsers.data);
                    setLoading(false);
                    setShowData(true);
                }, 1500);
            })
            .catch(error => {
                setLoading(false);
                toast.error("Đã xảy ra lỗi khi lấy dữ liệu!");
            });
    }, [])

    return (
        <>
        {
            isLoading ? (
                <LoadingWindow/>
            ) : (
                <div className="dashboard">
                    {/* Cards */}
                    <div className="row">
                        <Link to={'/book/cataloging/all'} className="col-lg-3">
                            <Card
                                data={books}
                                title={"Số lượng sách hiện tại"}
                                icon={<LuBookMarked/>}
                            />
                        </Link>
                        <Link to={'/bills/1'} className="col-lg-3">
                            <Card
                                data={listBills.length}
                                title={"Tổng số đơn hiện có"}
                                icon={<FaFileInvoiceDollar />}
                            />
                        </Link>
                        <Link to={'/book/cataloging/all'} className="col-lg-3">
                            <Card
                                data={catalogs}
                                title={"Tổng biên mục"}
                                icon={<BsBookmarkCheckFill />}
                            />
                        </Link>
                        <Link to={'/users/'} className="col-lg-3">
                            <Card
                                data={users}
                                title={"Số lượng tài khoản"}
                                icon={<RiAccountPinCircleLine />}
                            />
                        </Link>
                    </div>

                    {/* Charts - Row 1 */}
                    <div className="row chart-container">
                        <div className="col-lg-5 chart-item">
                            <Chart_BooksPerBill/>
                            <p className="chart-title">
                                Số lượng sách nhập biên mục theo tháng
                            </p>
                        </div>
                        <div className="col-lg-5 chart-item">
                            <Chart_BooksPerBill/>
                            <p className="chart-title">
                                Số sách được phân phối theo ngày
                            </p>
                        </div>
                    </div>
                    <div className="row chart-container">
                        <div className="col-lg-5 chart-item">
                            <Chart_BooksPerBill/>
                            <p className="chart-title">
                                Tỉ lệ phân phối đã duyệt - chưa duyệt
                            </p>
                        </div>
                        <div className="col-lg-5 chart-item">
                            <Chart_BooksPerBill/>
                            <p className="chart-title">
                                Tổng tiền mua sách theo quý
                            </p>
                        </div>
                    </div>
                </div>
            )
        }
        </>
    )
}

export default Dashboard;
