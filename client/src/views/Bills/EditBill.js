import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../constance.js';
import { BillContext } from '../../context/BillContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';

function EditBill() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;

    let navigate = useNavigate();

    if (idRole !== 2 && idRole !== 3) {
        navigate('/page-not-found');
    };

    const { billId } = useParams();
    const [typesBill, setTypesBill] = useState([]);
    const [billData, setBillData] = useState({});
    const { updateListBill } = useContext(BillContext);

    useEffect(() => {
        const getTypesBill = axios.get(`http://${config.URL}/bills/gettypes`);
        const getBillData = axios.get(
            `http://${config.URL}/bills/info/${billId}`
        );

        Promise.all([getTypesBill, getBillData])
            .then(([typesBillRes, billDataRes]) => {
                setTypesBill(typesBillRes.data);
                setBillData(billDataRes.data);
            })
            .catch((error) => toast.error('Không tải được loại hóa đơn!'));
    }, []);

    const updateBill = (e) => {
        e.preventDefault();

        axios
            .put(`http://${config.URL}/bills/update/${billId}`, billData, {
                headers: { authenToken: localStorage.getItem('authenToken') },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                }
            })
            .catch((error) => toast.error('Không cập nhật được thông tin'));
    };

    return (
        <div className="form-container">
            <h1 className="form-header">Thông tin hóa đơn</h1>
            <div className="form-body">
                <form method="POST" className="row" onSubmit={updateBill}>
                    <div className="col-md-4 col-sm-12 input-field">
                        <label for="input--bookcode" className="form-label">
                            Mã đơn
                        </label>
                        <input
                            name="id"
                            type="text"
                            id="input--bookcode"
                            className="form-control mb-3"
                            value={billData.id}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field">
                        <label for="input--bookname" className="form-label">
                            Tên đơn
                        </label>
                        <input
                            name="NameBill"
                            type="text"
                            id="input--bookname"
                            className="form-control mb-3"
                            value={billData.NameBill}
                            onChange={(e) =>
                                setBillData({
                                    ...billData,
                                    NameBill: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field">
                        <label for="input--supplier" className="form-label">
                            Nhà cung cấp
                        </label>
                        <input
                            name="Supplier"
                            type="text"
                            id="input--supplier"
                            className="form-control mb-3"
                            value={billData.Supplier}
                            onChange={(e) =>
                                setBillData({
                                    ...billData,
                                    Supplier: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field">
                        <label for="input--discount" className="form-label">
                            Chiết khấu (%)
                        </label>
                        <input
                            name="Discount"
                            type="text"
                            id="input--discount"
                            className="form-control mb-3"
                            value={billData.Discount}
                            onChange={(e) =>
                                setBillData({
                                    ...billData,
                                    Discount: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field">
                        <label
                            for="input--date-create-bill"
                            className="form-label mb-3"
                        >
                            Ngày tạo đơn (mm/dd/yyyy)
                        </label>
                        <input
                            name="DateGenerateBill"
                            type="date"
                            id="input--date-create-bill"
                            className="form-control mb-3"
                            placeholder="dd-mm-yyyy"
                            value={billData.DateGenerateBill}
                            onChange={(e) =>
                                setBillData({
                                    ...billData,
                                    DateGenerateBill: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field">
                        <label for="select--type-bill" className="form-label">
                            Hình thức
                        </label>
                        <select
                            name="BillTypeId"
                            class="form-select mb-3"
                            id="select--type-bill"
                            title="Loại đơn"
                            placeholder="dd-mm-yyyy"
                            value={billData.BillTypeId}
                            onChange={(e) =>
                                setBillData({
                                    ...billData,
                                    BillTypeId: e.target.value,
                                })
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
                    <div className="col-md-12 col-sm-12 input-field">
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
                                setBillData({
                                    ...billData,
                                    Notes: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="col-md-12 col-sm-12 mt-3">
                        <div className="btn-wrapper row">
                            <div className="col-md-12 col-sm-12">
                                <div className="row btn-container">
                                    <button
                                        type="submit"
                                        className="btn btn-primary col-md-2 col-sm-12"
                                    >
                                        Cập nhật
                                    </button>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="btn btn-back col-md-2 col-sm-12"
                                        type="button"
                                    >
                                        Quay về
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBill;
