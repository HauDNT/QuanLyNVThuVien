import React from "react";
import axios from "axios";
import config from '../../constance.js';
import '../../styles/CreateBill.scss';
import { toast } from "react-toastify";

function CreatBill() {
    const handleCreateBill = (e) => {
        // Get data from form:
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!data || !data.numberBill || !data.nameBill) {
            toast.warning("Bạn phải điền đầy đủ thông tin!");
            return;
        }

        // Send info to Server:
        axios
            .post(`http://${config.URL}/bills/createbill`, data, {headers: {authenToken: localStorage.getItem('authenToken')}})
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error)
                }
                else {
                    toast.success(res.data.success);
                }
            })
    };

    return (
        <div className="creatbill-container">
            <h1 className="col-12">Tạo hóa đơn mới</h1>
            <form method="POST" className="row" onSubmit={handleCreateBill}>
                <div className="col-4 input-field">
                    <label for="input--bookcode" className="form-label">Mã đơn</label>
                    <input name="numberBill" type="text" id="input--bookcode" className="form-control"/>
                </div>
                <div className="col-4 input-field">
                    <label for="input--bookname" className="form-label">Tên đơn</label>
                    <input name="nameBill" type="text" id="input--bookname" className="form-control"/>
                </div>
                <div className="col-4 input-field">
                    <label for="input--supplier" className="form-label">Nhà cung cấp</label>
                    <input name="supplierBill" type="text" id="input--supplier" className="form-control"/>
                </div>
                <div className="col-4 input-field">
                    <label for="input--discount" className="form-label">Chiết khấu</label>
                    <input name="discountBill" type="text" id="input--discount" className="form-control"/>
                </div>
                <div className="col-4 input-field">
                    <label for="input--date-create-bill" className="form-label">Ngày tạo đơn</label>
                    <input name="dateGenerate" type="text" id="input--date-create-bill" className="form-control"/>
                </div>
                <div className="col-4 input-field">
                    <label for="select--type-bill" className="form-label">Hình thức</label>
                    <select name="typeBill" class="form-select" id="select--type-bill" title="Loại đơn">
                        <option value="1">Mua</option>
                        <option value="2">Tặng</option>
                        <option value="0">Không rõ</option>
                    </select>
                </div>
                <div className="col-12 input-field">
                    <label for="input--notes" className="form-label">Ghi chú thêm</label>
                    <input name="notes" type="text" id="input--notes" className="form-control"/>
                </div>
                <div className="col-12 mt-3 button-container">
                    <button type="submit" className="btn btn-primary mb-3">Tạo</button>
                </div>
            </form>
        </div>
    );
}

export default CreatBill;