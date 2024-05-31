import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import config from "../../constance.js";
import { BillContext } from "../../context/BillContext.js";
import "../../styles/CreatePage.scss";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function EditBill() {
  const { billId } = useParams();
  const [typesBill, setTypesBill] = useState([]);
  const [billData, setBillData] = useState({});
  const { updateListBill } = useContext(BillContext);

  useEffect(() => {
    const getTypesBill = axios.get(`http://${config.URL}/bills/gettypes`);
    const getBillData = axios.get(`http://${config.URL}/bills/info/${billId}`);

    Promise.all([getTypesBill, getBillData])
      .then(([typesBillRes, billDataRes]) => {
        setTypesBill(typesBillRes.data);
        setBillData(billDataRes.data);
      })
      .catch((error) => toast.error("Không tải được loại hóa đơn!"));
  }, []);

  const updateBill = (e) => {
    e.preventDefault();

    axios
      .put(`http://${config.URL}/bills/update/${billId}`, billData, {
        headers: { authenToken: localStorage.getItem("authenToken") },
      })
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          toast.success(res.data.success);
        }
      })
      .catch((error) => toast.error("Không cập nhật được thông tin"));
  };

  return (
    <div className="creatpage-container">
      <h1 className="col-12 creatpage-heading">Thông tin hóa đơn</h1>
      <form method="POST" className="row createpage-form" onSubmit={updateBill}>
        <div className="col-4 input-field">
          <label for="input--bookcode" className="form-label">
            Mã đơn
          </label>
          <input
            name="id"
            type="text"
            id="input--bookcode"
            className="form-control"
            value={billData.id}
            readOnly
          />
        </div>
        <div className="col-4 input-field">
          <label for="input--bookname" className="form-label">
            Tên đơn
          </label>
          <input
            name="NameBill"
            type="text"
            id="input--bookname"
            className="form-control"
            value={billData.NameBill}
            onChange={(e) =>
              setBillData({ ...billData, NameBill: e.target.value })
            }
            required
          />
        </div>
        <div className="col-4 input-field">
          <label for="input--supplier" className="form-label">
            Nhà cung cấp
          </label>
          <input
            name="Supplier"
            type="text"
            id="input--supplier"
            className="form-control"
            value={billData.Supplier}
            onChange={(e) =>
              setBillData({ ...billData, Supplier: e.target.value })
            }
            required
          />
        </div>
        <div className="col-4 input-field">
          <label for="input--discount" className="form-label">
            Chiết khấu (%)
          </label>
          <input
            name="Discount"
            type="text"
            id="input--discount"
            className="form-control"
            value={billData.Discount}
            onChange={(e) =>
              setBillData({ ...billData, Discount: e.target.value })
            }
            required
          />
        </div>
        <div className="col-4 input-field">
          <label for="input--date-create-bill" className="form-label">
            Ngày tạo đơn (mm/dd/yyyy)
          </label>
          <input
            name="DateGenerateBill"
            type="date"
            id="input--date-create-bill"
            className="form-control"
            placeholder="dd-mm-yyyy"
            value={billData.DateGenerateBill}
            onChange={(e) =>
              setBillData({ ...billData, DateGenerateBill: e.target.value })
            }
            required
          />
        </div>
        <div className="col-4 input-field">
          <label for="select--type-bill" className="form-label">
            Hình thức
          </label>
          <select
            name="BillTypeId"
            class="form-select"
            id="select--type-bill"
            title="Loại đơn"
            placeholder="dd-mm-yyyy"
            value={billData.BillTypeId}
            onChange={(e) =>
              setBillData({ ...billData, BillTypeId: e.target.value })
            }
            required
          >
            {typesBill.map((type) => (
              <option key={type.id} value={type.id}>
                {type.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 input-field">
          <label for="input--notes" className="form-label">
            Ghi chú thêm
          </label>
          <input
            name="Notes"
            type="text"
            id="input--notes"
            className="form-control"
            value={billData.Notes}
            onChange={(e) =>
              setBillData({ ...billData, Notes: e.target.value })
            }
          />
        </div>
        <div className="col-12 mt-3 button-container">
          <button type="submit" className="btn btn-primary mb-3">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBill;
