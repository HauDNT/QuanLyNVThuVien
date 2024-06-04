import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../constance";
import Chart_CatalogPerMonth from "../Charts/Chart_CatalogPerMonth.js";
import Chart_Accept_Unaccept from "../Charts/Chart_Accept_Unaccept.js";
import Chart_ApprovePerDay from "../Charts/Chart_ApprovePerDay.js";
import LoadingWindow from "../Components/Loading.js";
import Card from "./Card";
import { LuBookMarked } from "react-icons/lu";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { RiAccountPinCircleLine } from "react-icons/ri";
import { BillContext } from "../../context/BillContext";
import { renderYears } from "../../utils/RenderYears.js";
import { renderMonths } from "../../utils/RenderMonths.js";
import "../../styles/Dashboard.scss";

function Dashboard() {
  // Data:
  // Cards:
  const [books, setBooks] = useState(0);
  const { listBills } = useContext(BillContext);
  const [catalogs, setCatalogs] = useState(0);
  const [users, setUsers] = useState(0);

  // Charts:
  const [accept_unAcceptApprove, setAcc_UnAcc] = useState({
    accept: 0,
    unaccept: 0,
  });
  const [catalogPerMonth, setCatalogPerMonth] = useState([]);
  const [approvePerDay, setApprovePerDay] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
  const [isLoading, setLoading] = useState(true);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`http://${config.URL}/books/amount`),
      axios.get(`http://${config.URL}/approve/amount`),
      axios.get(`http://${config.URL}/users/amount`),
      axios.get(`http://${config.URL}/books/getPerMonth/${year}`),
      axios.get(
        `http://${config.URL}/approve/getApprovePerDay/${month}/${year}`,
      ),
      axios.get(`http://${config.URL}/approve/accept`),
      axios.get(`http://${config.URL}/approve/isnotaccept`),
    ])
      .then(
        ([
          resBooks,
          resApproves,
          resUsers,
          resCaPerMonth,
          resAppPerDay,
          resAccept,
          resNotAccept,
        ]) => {
          setTimeout(() => {
            setBooks(resBooks.data);
            setCatalogs(resApproves.data);
            setUsers(resUsers.data);
            setCatalogPerMonth(resCaPerMonth.data);
            setApprovePerDay(resAppPerDay.data);
            setAcc_UnAcc({
              ...accept_unAcceptApprove,
              accept: resAccept.data,
              unaccept: resNotAccept.data,
            });

            setLoading(false);
            setShowData(true);
          }, 500);
        },
      )
      .catch((error) => {
        setLoading(false);
        toast.error("Đã xảy ra lỗi khi lấy dữ liệu!");
      });
  }, [year, month]);

  return (
    <>
      {isLoading ? (
        <LoadingWindow />
      ) : (
        <div className="dashboard">
          {/* Cards */}
          <div className="row">
            <Link to={"/book/cataloging/all"} className="col-lg-3 zoom-effect">
              <Card
                data={books}
                title={"Số lượng sách hiện tại"}
                icon={<LuBookMarked />}
              />
            </Link>
            <Link to={"/bills/1"} className="col-lg-3 zoom-effect">
              <Card
                data={listBills.length}
                title={"Tổng số đơn hiện có"}
                icon={<FaFileInvoiceDollar />}
              />
            </Link>
            <Link to={"/book/cataloging/all"} className="col-lg-3 zoom-effect">
              <Card
                data={catalogs}
                title={"Tổng phân phối"}
                icon={<BsBookmarkCheckFill />}
              />
            </Link>
            <Link to={"/users/"} className="col-lg-3 zoom-effect">
              <Card
                data={users}
                title={"Số lượng tài khoản"}
                icon={<RiAccountPinCircleLine />}
              />
            </Link>
          </div>

          {/* Charts - Row 1 */}
          <div className="row chart-container">
            <div className="col-lg-7 chart-item">
              <select
                class="form-select chart-time text-center"
                name="year"
                value={year}
                onChange={(e) => setYear(+e.target.value)}
              >
                {renderYears(10, year, 10).map((year) => (
                  <option value={year}>{year}</option>
                ))}
              </select>
              <Chart_CatalogPerMonth props={catalogPerMonth} year={year} />
            </div>
            <div className="col-lg-4 chart-item chart-doughnut">
              <Chart_Accept_Unaccept
                accept={accept_unAcceptApprove.accept}
                unaccept={accept_unAcceptApprove.unaccept}
              />
            </div>
          </div>
          <div className="row"></div>
          <div className="row chart-container">
            <div className="col-lg-11 chart-item">
              <select
                class="form-select chart-time text-center"
                name="month"
                value={month}
                onChange={(e) => setMonth(+e.target.value)}
              >
                {renderMonths().map((month) => (
                  <option value={month}>Tháng {month}</option>
                ))}
              </select>
              <Chart_ApprovePerDay
                props={approvePerDay}
                month={month}
                year={year}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
