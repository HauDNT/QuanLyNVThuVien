import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../constance.js';
import Searchbar from '../Components/Searchbar.js';
import { FcViewDetails } from 'react-icons/fc';
import { FaTrash } from 'react-icons/fa';
import { FaPenToSquare } from 'react-icons/fa6';
import LoadingWindow from '../Components/Loading.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { BillContext } from '../../context/BillContext.js';
import { formatAndDisplayDate } from '../../utils/FormatDate.js';
import Paginate from '../../context/PaginateContext.js';

function Bills() {
    const { type } = useParams();
    const [listBills, setListBills] = useState([]);
    const [billSelected, setBillSelected] = useState([]);
    const { removeFromBillList } = useContext(BillContext);

    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    // Số bảng ghi phân trang (1 trang):
    const [records, setRecords] = useState(0);

    useEffect(() => {
        axios.get(`http://${config.URL}/bills/${type}`).then((res) => {
            setTimeout(
                () => {
                    setListBills(res.data);
                    setLoading(false);
                    setShowData(true);
                },
                isLoading ? 1000 : 0
            );
        });
    }, [type]);

    // Hàm xóa từng đơn:
    const handleDeteleBill = () => {
        const deletePromises = billSelected.map((billIdSeleted) => {
            return axios.delete(
                `http://${config.URL}/bills/deletebill/${billIdSeleted}`,
                {
                    headers: {
                        authenToken: localStorage.getItem('authenToken'),
                    },
                }
            );
        });

        Promise.all(deletePromises).then((res) => {
            let status = false;
            res.forEach((res, index) => {
                const eachBillSelected = billSelected[index];
                if (!res.data.error) {
                    setListBills((oldList) =>
                        oldList.filter((bill) => bill.id !== eachBillSelected)
                    );
                    removeFromBillList(eachBillSelected);
                    status = true;
                }
            });

            if (status) {
                toast.success('Xóa đơn thành công');
            } else toast.error('Xóa đơn không thành công!');
        });
    };

    // Hàm xử lý khi check chọn 1 đơn:
    const handleCheck = (event) => {
        const { checked, value } = event.target;
        if (checked) {
            setBillSelected([...billSelected, +value]);
        } else {
            setBillSelected(billSelected.filter((billId) => billId !== +value));
        }
    };

    // Hàm xử lý khi check chọn tất cả đơn:
    const handleCheckAll = (event) => {
        const { checked } = event.target;

        const allChildCheckboxes = document.querySelectorAll(
            'input[type="checkbox"][data-parent="checkbox-parent"]'
        );
        const selectedBills = [];

        allChildCheckboxes.forEach((eachCheckbox) => {
            eachCheckbox.checked = checked;
            if (checked) {
                selectedBills.push(+eachCheckbox.value);
            } else {
                setBillSelected(
                    billSelected.filter(
                        (billId) => billId !== +eachCheckbox.value
                    )
                );
            }
        });

        setBillSelected(selectedBills);
    };

    const handleSearchResultChange = (result) => {
        setListBills(result);
    };

    const applyPaginate = (records) => {
        setRecords(records);
    };

    return (
        <>
            {isLoading ? (
                <LoadingWindow />
            ) : (
                <>
                    <Searchbar
                        searchType="bills"
                        placeholder="Chọn hạng mục và nhập để tìm kiếm"
                        categories={[
                            // value là cột của model
                            { value: '*', name: 'Tất cả' },
                            { value: 'id', name: 'Mã đơn' },
                            { value: 'NameBill', name: 'Tên đơn' },
                        ]}
                        onSearchResultChange={handleSearchResultChange}
                        orderChoice={type}
                        // Gọi một callback function để khi có kết quả tìm kiếm thì cập nhật lại listBills
                    />

                    {(idRole === 2 || idRole === 3) && (
                        <div className="row">
                            <div className="col-md-2 col-sm-12">
                                {idRole === 2 && (
                                    <Link
                                        className="btn btn-outline-secondary btn-trash mb-2 w-100"
                                        to={`/bills/trash/${type}`}
                                    >
                                        <FaTrash className="trash-icon" /> Đơn
                                        đã xóa
                                    </Link>
                                )}
                            </div>
                            <div className="col-md-6 col-sm-12"></div>
                            <div className="col-md-4 col-sm-12">
                                <div className="row">
                                    <div className="col-md-6 col-sm-12">
                                        <button
                                            className="btn btn-danger w-100 mb-2"
                                            onClick={() => handleDeteleBill()}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                    <div className="col-md-6 col-sm-12">
                                        <Link
                                            className="btn btn-success w-100 mb-2"
                                            to="/bills/createbill"
                                        >
                                            Tạo đơn mới
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">
                                    <input
                                        id="checkbox-parent"
                                        class="select-all form-check-input"
                                        type="checkbox"
                                        value=""
                                        onClick={(e) => handleCheckAll(e)}
                                    />
                                </th>
                                <th scope="col" className="text-center">
                                    Mã đơn
                                </th>
                                <th scope="col" className="text-center">
                                    Tên đơn
                                </th>
                                <th scope="col" className="text-center">
                                    Thời gian tạo
                                </th>
                                <th scope="col" className="text-center">
                                    Xem chi tiết
                                </th>
                                {(idRole === 2 || idRole === 3) && (
                                    <th scope="col" className="text-center">
                                        Sửa thông tin
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {records.length > 0 ? (
                                records.map((bill) => (
                                    <tr key={bill.id} className="text-center">
                                        <td>
                                            <input
                                                data-parent="checkbox-parent"
                                                class="form-check-input"
                                                type="checkbox"
                                                value={bill.id}
                                                onClick={(e) => handleCheck(e)}
                                            />
                                        </td>
                                        <td> {bill.id} </td>
                                        <td> {bill.NameBill} </td>
                                        <td>
                                            {formatAndDisplayDate(
                                                bill.DateGenerateBill
                                            )}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/bills/detail/${bill.id}`}
                                            >
                                                <FcViewDetails className="info-icon table-icon" />
                                            </Link>
                                        </td>
                                        {(idRole === 2 || idRole === 3) && (
                                            <td>
                                                <Link
                                                    to={`/bills/edit/${bill.id}`}
                                                >
                                                    <FaPenToSquare className="info-icon table-icon" />
                                                </Link>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan={6}>
                                        Chưa có hóa đơn nào thuộc loại này được
                                        tạo
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Paginate
                        data={listBills}
                        applyPaginateData={applyPaginate}
                        page={5}
                    />
                </>
            )}
        </>
    );
}

export default Bills;
