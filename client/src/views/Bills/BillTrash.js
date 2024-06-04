import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../constance.js';
import { FcUndo } from 'react-icons/fc';
import LoadingWindow from '../Components/Loading.js';
import Paginate from '../../context/PaginateContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { BillContext } from '../../context/BillContext.js';
import {formatAndDisplayDatetime} from "../../utils/FormatDateTime.js";
import '../../styles/Bills.scss';

function BillTrash() {
    let { type } = useParams();
    const [listBill, setListBill] = useState([]);
    const [billSelected, setBillSelected] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const { updateListBill } = useContext(BillContext);

    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    // Số bảng ghi phân trang (1 trang):
    const [records, setRecords] = useState(0);

    const applyPaginate = (records) => {
      setRecords(records);
  };

    useEffect(() => {
        axios.get(`http://${config.URL}/bills/trash/${type}`).then((res) => {
            setTimeout(() => {
                setListBill(res.data);
                setLoading(false);
                setShowData(true);
            }, 1000);
        });
    }, [type]);

    // Hàm xử lý khi check chọn 1 đơn:
    const handleCheck = (event) => {
        const { checked, value } = event.target;
        if (checked) {
            setBillSelected([...billSelected, +value]);
        } else {
            setBillSelected(billSelected.filter((billId) => billId !== +value));
            setCheckAll(checked);
        }
    };

    // Hàm xử lý khi check chọn tất cả đơn:
    const handleCheckAll = (event) => {
        const { checked } = event.target;
        setCheckAll(checked);

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

    // Hàm restore:
    const handleRestore = () => {
        const restorePromises = billSelected.map((billIdSelected) => {
            return axios.patch(
                `http://${config.URL}/bills/trash/restore/${billIdSelected}`
            );
        });

        Promise.all(restorePromises)
            .then((res) => {
                let status = false;
                res.forEach((res, index) => {
                    const eachBillSelected = billSelected[index];
                    if (!res.data.error) {
                        setListBill((oldList) =>
                            oldList.filter(
                                (bill) => bill.id !== eachBillSelected
                            )
                        );
                        updateListBill();
                        status = true;
                    }
                });

                if (status) {
                    toast.success('Khôi phục đơn thành công!');
                } else toast.error('Khôi phục đơn không thành công!');
            })
            .catch((error) => {
                toast.error('Đã xảy ra lỗi khi gọi API đến Server...');
            });
    };

    // Hàm xóa cứng (force delete):
    const handleForceDelete = () => {
        const deletePromises = billSelected.map((billIdSelected) => {
            return axios.delete(
                `http://${config.URL}/bills/trash/delete/${billIdSelected}`,
                {
                    headers: {
                        authenToken: localStorage.getItem('authenToken'),
                    },
                }
            );
        });

        Promise.all(deletePromises)
            .then((res) => {
                let status = false;
                res.forEach((res, index) => {
                    const eachBillSelected = billSelected[index];
                    if (!res.data.error) {
                        setListBill((oldList) =>
                            oldList.filter(
                                (bill) => bill.id !== eachBillSelected
                            )
                        );
                        status = true;
                    }
                });

                if (status) {
                    toast.success('Xóa đơn thành công!');
                } else toast.error('Xóa đơn không thành công!');
            })
            .catch((error) => {
                toast.error('Đã xảy ra lỗi khi gọi API đến Server...');
            });
    };

    return (
        <>
            {isLoading ? (
                <LoadingWindow />
            ) : (
                <div className="bill-page">
                    <div className="row">
                        <div className="col-3">
                            <button
                                className="btn btn-outline-secondary btn-trash"
                                onClick={() => window.history.back()}
                            >
                                <FcUndo className="trash-icon" /> Quay lại
                            </button>
                        </div>
                        <div className="col-9 btn-container">
                            {idRole === 1 ? (
                                <button
                                    className="btn btn-danger btn--bill-page"
                                    onClick={() => handleForceDelete()}
                                >
                                    Xóa vĩnh viễn
                                </button>
                            ) : null}
                            <button
                                className="btn btn-primary btn--bill-page"
                                onClick={() => handleRestore()}
                            >
                                Khôi phục
                            </button>
                        </div>
                    </div>

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
                                    Thời gian xóa
                                </th>
                                <th scope="col" className="text-center">
                                    Nhà xuất bản
                                </th>
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
                                        <td> {bill.DateGenerateBill} </td>
                                        <td>
                                            {' '}
                                            {formatAndDisplayDatetime(
                                                bill.deletedAt
                                            )}{' '}
                                        </td>
                                        <td> {bill.Supplier} </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan={6}>
                                        Chưa có hóa đơn nào bị xóa gần đây
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Paginate
                        data={listBill}
                        applyPaginateData={applyPaginate}
                        page={5}
                    />
                </div>
            )}
        </>
    );
}

export default BillTrash;
