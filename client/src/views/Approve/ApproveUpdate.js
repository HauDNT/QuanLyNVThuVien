import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../constance.js";
import { RoomContext } from "../../context/RoomContext.js";
import { BillContext } from "../../context/BillContext.js";
import { StatusDocContext } from "../../context/StatusDocsContext.js";
import { StoreTypesContext } from "../../context/StoreTypesContext.js";
import { formatAndDisplayDatetime } from "../../utils/FormatDateTime.js";

function ApproveUpdate() {
  const { id } = useParams();
  const [approveInfo, setApproveInfo] = useState([]);
  const { listRooms } = useContext(RoomContext);
  const { listBills } = useContext(BillContext);
  const { statusDocs } = useContext(StatusDocContext);
  const { storeTypes } = useContext(StoreTypesContext);

  useEffect(() => {
    try {
      axios.get(`http://${config.URL}/approve/item/${id}`).then((res) => {
        setApproveInfo(res.data);
      });
    } catch (error) {
      toast.error("Không thể nhận dữ liệu từ Server, hãy thử lại sau!");
      return;
    }
  }, []);

  const handleUpdateApprove = (e) => {
    e.preventDefault();

    // Get data from form:
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!data) {
      toast.warning("Bạn phải điền đầy đủ thông tin!");
      return;
    }

    try {
      axios
        .put(`http://${config.URL}/approve/update/${id}`, data, {
          headers: {
            authenToken: localStorage.getItem("authenToken"),
          },
        })
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.error);
          } else {
            toast.success(res.data.success);
          }
        });
    } catch (error) {
      toast.error("Đã xảy ra lỗi trong quá trình cập nhật!");
    }
  };

  return (
    <form className="container--approve-create" onSubmit={handleUpdateApprove}>
      <h3 className="approve-header">Chỉnh sửa phân phối</h3>
      <div className="approve-form">
        <div className="row">
          <div className="col input-group">
            <span className="input-group-text" id="basic-addon1">
              Mã vạch
            </span>
            <input
              type="text"
              className="form-control"
              name="RegisCode"
              value={approveInfo.RegisCode}
              placeholder="VD: PM23.086594"
              onChange={(e) =>
                setApproveInfo({
                  ...approveInfo,
                  RegisCode: e.target.value,
                })
              }
              readOnly
            />
          </div>
          <div className="col input-group">
            <span className="input-group-text" id="basic-addon1">
              Số ĐKCB
            </span>
            <input
              type="text"
              className="form-control"
              name="RegisCode"
              value={approveInfo.RegisCode}
              placeholder="VD: PM23.086594"
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="col input-group">
            <span className="input-group-text" id="basic-addon1">
              Thể loại lưu trữ
            </span>
            <select
              className="form-select"
              name="StoreTypeId"
              onChange={(e) =>
                setApproveInfo({
                  ...approveInfo,
                  StoreTypeId: e.target.value,
                })
              }
              required
            >
              <option value="0" selected>
                Chọn thể loại lưu trữ
              </option>
              {storeTypes ? (
                storeTypes.map((types) =>
                  types.id === approveInfo.StoreTypeId ? (
                    <option value={types.id} selected>
                      {types.NameType}
                    </option>
                  ) : (
                    <option value={types.id}>{types.NameType}</option>
                  ),
                )
              ) : (
                <option value="">Không có dữ liệu</option>
              )}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col input-group">
            <span className="input-group-text" id="basic-addon1">
              Vị trí lưu trữ
            </span>
            <select
              className="form-select"
              name="RoomId"
              onChange={(e) =>
                setApproveInfo({
                  ...approveInfo,
                  RoomId: e.target.value,
                })
              }
              required
            >
              <option value="0" selected>
                Chọn vị trí lưu trữ
              </option>
              {listRooms ? (
                listRooms.map((room) =>
                  room.id === approveInfo.RoomId ? (
                    <option value={room.id} selected>
                      {room.RoomName}
                    </option>
                  ) : (
                    <option value={room.id}>{room.RoomName}</option>
                  ),
                )
              ) : (
                <option value="">Không có dữ liệu</option>
              )}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col input-group">
            <span className="input-group-text" id="basic-addon1">
              Trạng thái
            </span>
            <select
              className="form-select"
              name="StatusDocId"
              onChange={(e) =>
                setApproveInfo({
                  ...approveInfo,
                  StatusDocId: e.target.value,
                })
              }
              required
            >
              <option value="0" selected>
                Chọn trạng thái tài liệu
              </option>
              {statusDocs ? (
                statusDocs.map((status) =>
                  status.id === approveInfo.StatusDocId ? (
                    <option value={status.id} selected>
                      {status.Status}
                    </option>
                  ) : (
                    <option value={status.id}>{status.Status}</option>
                  ),
                )
              ) : (
                <option value="0" selected>
                  Không nhận được dữ liệu
                </option>
              )}
            </select>
          </div>
          <div className="col input-group">
            <span className="input-group-text" id="basic-addon1">
              Mã đơn hàng
            </span>
            <select
              className="form-select"
              name="BillId"
              onChange={(e) =>
                setApproveInfo({
                  ...approveInfo,
                  BillId: e.target.value,
                })
              }
              required
            >
              <option value="0" selected>
                Chọn mã đơn hàng
              </option>
              {listBills ? (
                listBills.map((bill) =>
                  bill.id === approveInfo.BillId ? (
                    <option value={bill.id} selected>
                      {formatAndDisplayDatetime(bill.createdAt)} -{" "}
                      {bill.NameBill}
                    </option>
                  ) : (
                    <option value={bill.id}>
                      {formatAndDisplayDatetime(bill.createdAt)} -{" "}
                      {bill.NameBill}
                    </option>
                  ),
                )
              ) : (
                <option value="">Không có dữ liệu</option>
              )}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="input-group">
            <span className="input-group-text">Ghi chú</span>
            <textarea
              className="form-control"
              name="Notes"
              onChange={(e) =>
                setApproveInfo({
                  ...approveInfo,
                  Notes: e.target.value,
                })
              }
              value={approveInfo.Notes}
            ></textarea>
          </div>
        </div>
        <div className="row">
          <div className="btn-container">
            <button type="submit" className="btn btn-primary mb-3">
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default ApproveUpdate;
