import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../constance.js';
import { BillContext } from '../../context/BillContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreatBill() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;
    
    let navigate = useNavigate();

    if (idRole !== 2 || idRole !== 3) {
        navigate('/page-not-found');
    };

    const [status, setStatus] = useState(false);
    const [amountBills, setAmountBills] = useState(false);
    const [typesBill, setTypesBill] = useState([]);
    const [inputValues, setInputValues] = useState({
        nameBill: '',
        typeBill: 1,
        supplierBill: '',
        discountBill: '',
        notes: '',
    });
    const { updateListBill } = useContext(BillContext);

    const handleClearInput = () => {
        setInputValues({
            nameBill: '',
            typeBill: 1,
            supplierBill: '',
            discountBill: '',
            notes: '',
        });
    };

    useEffect(() => {
        const getNumberBill = axios.get(`http://${config.URL}/bills/maxNumber`);
        const getTypesBill = axios.get(`http://${config.URL}/bills/gettypes`);

        Promise.all([getNumberBill, getTypesBill])
            .then(([numberBillsRes, typesBillRes]) => {
                setAmountBills(numberBillsRes.data + 1);
                setTypesBill(typesBillRes.data);
            })
            .catch((error) =>
                toast.error('Không tải được loại hóa đơn và số lượng!')
            );
    }, [status]);

    const handleCreateBill = (e) => {
        e.preventDefault();

        setStatus(true);

        // Get data from form:
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!data || !data.id || !data.nameBill) {
            toast.warning('Bạn phải điền đầy đủ thông tin!');
            return;
        }

        // Send info to Server:
        axios
            .post(`http://${config.URL}/bills/createbill`, data, {
                headers: { authenToken: localStorage.getItem('authenToken') },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    handleClearInput();
                    setStatus(false);
                    updateListBill();
                    toast.success(res.data.success);
                }
            });
    };

    return (
        <div className="form-container">
            <h1 className="form-header">Tạo hóa đơn mới</h1>
            <div className="form-body">
                <form method="POST" className="row" onSubmit={handleCreateBill}>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--bookcode" className="form-label">
                            Mã đơn
                        </label>
                        <input
                            name="id"
                            type="text"
                            id="input--bookcode"
                            className="form-control"
                            value={amountBills}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--bookname" className="form-label">
                            Tên đơn
                        </label>
                        <input
                            name="nameBill"
                            type="text"
                            id="input--bookname"
                            className="form-control"
                            value={inputValues.nameBill}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    nameBill: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--supplier" className="form-label">
                            Nhà cung cấp
                        </label>
                        <input
                            name="supplierBill"
                            type="text"
                            id="input--supplier"
                            className="form-control"
                            value={inputValues.supplierBill}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    supplierBill: e.target.value,
                                })
                            }
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="input--discount" className="form-label">
                            Chiết khấu (%)
                        </label>
                        <input
                            name="discountBill"
                            type="text"
                            id="input--discount"
                            className="form-control"
                            value={inputValues.discountBill}
                            required
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    discountBill: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label
                            for="input--date-create-bill"
                            className="form-label"
                        >
                            Ngày tạo đơn (mm/dd/yyyy)
                        </label>
                        <input
                            name="dateGenerate"
                            type="date"
                            id="input--date-create-bill"
                            className="form-control"
                            placeholder="dd-mm-yyyy"
                            required
                        />
                    </div>
                    <div className="col-md-4 col-sm-12 input-field mb-3">
                        <label for="select--type-bill" className="form-label">
                            Hình thức
                        </label>
                        <select
                            value={inputValues.typeBill}
                            name="typeBill"
                            class="form-select"
                            id="select--type-bill"
                            title="Loại đơn"
                            required
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    typeBill: e.target.value,
                                })
                            }
                        >
                            {typesBill.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-12 col-sm-12 input-field mb-3">
                        <label for="input--notes" className="form-label">
                            Ghi chú thêm
                        </label>
                        <input
                            name="notes"
                            type="text"
                            id="input--notes"
                            className="form-control"
                            value={inputValues.notes}
                            onChange={(e) =>
                                setInputValues({
                                    ...inputValues,
                                    notes: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="col-md-12 col-sm-12">
                        <div className="btn-wrapper row">
                            <div className="col-md-12 col-sm-12">
                                <div className="row btn-container">
                                    <button
                                        type="submit"
                                        className="btn btn-primary col-md-2 col-sm-12"
                                    >
                                        Tạo
                                    </button>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="btn btn-back col-md-2 col-sm-12"
                                        type='button'
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

export default CreatBill;
