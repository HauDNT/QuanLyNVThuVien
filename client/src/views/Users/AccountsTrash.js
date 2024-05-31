import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../constance.js";
import { FcUndo } from "react-icons/fc";
import LoadingWindow from "../Components/Loading.js";
import "../../styles/Users.scss";

function AccountTrash() {
  const [listAccount, setListAccount] = useState([]);
  const [userSelected, setUserSelected] = useState([]);

  // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
  const [isLoading, setLoading] = useState(true);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    axios.get(`http://${config.URL}/users/trash/`).then((res) => {
      setTimeout(() => {
        setListAccount(res.data);
        setLoading(false);
        setShowData(true);
      }, 1000);
    });
  }, []);

  const formatAndDisplayDatetime = (dateString) => {
    const date = new Date();
    dateString = `
                ${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} 
                ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}
            `;
    return dateString;
  };

  // Hàm xử lý khi check chọn 1 user:
  const handleCheck = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setUserSelected([...userSelected, +value]);
    } else {
      setUserSelected(userSelected.filter((accountId) => accountId !== +value));
    }
  };

  // Hàm xử lý khi check chọn tất cả user:
  const handleCheckAll = (event) => {
    const { checked } = event.target;

    const allChildCheckboxes = document.querySelectorAll(
      'input[type="checkbox"][data-parent="checkbox-parent"]',
    );
    const selectedAccounts = [];

    allChildCheckboxes.forEach((eachCheckbox) => {
      eachCheckbox.checked = checked;
      if (checked) {
        selectedAccounts.push(+eachCheckbox.value);
      } else {
        setUserSelected(
          userSelected.filter((accountId) => accountId !== +eachCheckbox.value),
        );
      }
    });

    setUserSelected(selectedAccounts);
  };

  const handleRestore = () => {
    const restorePromises = userSelected.map((userIdSelected) => {
      return axios.patch(
        `http://${config.URL}/users/trash/restore/${userIdSelected}`,
      );
    });

    Promise.all(restorePromises)
      .then((res) => {
        let status = false;
        res.forEach((res, index) => {
          const eachUserSelected = userSelected[index];
          if (!res.data.error) {
            setListAccount((oldList) =>
              oldList.filter((bill) => bill.id !== eachUserSelected),
            );
            status = true;
          }
        });

        if (status) toast.success("Khôi phục tài khoản thành công!");
        else toast.error("Khôi phục tài khoản không thành công!");
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi gọi API đến Server...");
      });
  };

  const handleDeleteAccount = () => {
    const deletePromises = userSelected.map((userIdSelected) => {
      return axios.delete(
        `http://${config.URL}/users/trash/delete/${userIdSelected}`,
        {
          headers: { authenToken: localStorage.getItem("authenToken") },
        },
      );
    });

    Promise.all(deletePromises)
      .then((res) => {
        let status = false;
        res.forEach((res, index) => {
          const eachUserSelected = userSelected[index];
          if (!res.data.error) {
            setListAccount((oldList) =>
              oldList.filter((bill) => bill.id !== eachUserSelected),
            );
            status = true;
          }
        });

        if (status) toast.success("Xóa tài khoản thành công!");
        else toast.error("Xóa tài khoản không thành công!");
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi gọi API đến Server...");
      });
  };

  return (
    <>
      {isLoading ? (
        <LoadingWindow />
      ) : (
        <div className="row">
          <div className="col-lg-12 user-page">
            <Link
              className="btn btn-outline-secondary btn-trash"
              to={`/users/`}
            >
              <FcUndo className="trash-icon" /> Quay lại
            </Link>
            <button
              className="btn btn-danger btn--account-page"
              onClick={() => handleDeleteAccount()}
            >
              Xóa vĩnh viễn
            </button>
            <button
              className="btn btn-primary btn--account-page"
              onClick={() => handleRestore()}
            >
              Khôi phục
            </button>
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
                    Mã tài khoản
                  </th>
                  <th scope="col" className="text-center">
                    Tên tài khoản
                  </th>
                  <th scope="col" className="text-center">
                    Thời gian tạo
                  </th>
                  <th scope="col" className="text-center">
                    Thời gian xóa
                  </th>
                </tr>
              </thead>
              <tbody>
                {listAccount.length > 0 ? (
                  listAccount.map((account) => (
                    <tr key={account.id} className="text-center">
                      <td>
                        <input
                          data-parent="checkbox-parent"
                          class="form-check-input"
                          type="checkbox"
                          value={account.id}
                          onClick={(e) => handleCheck(e)}
                        />
                      </td>
                      <td> {account.id} </td>
                      <td> {account.Username} </td>
                      <td> {formatAndDisplayDatetime(account.createdAt)} </td>
                      <td> {formatAndDisplayDatetime(account.deletedAt)} </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="table-light text-center" colSpan={6}>
                      Không có tài khoản nào được xóa gần đây.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default AccountTrash;
