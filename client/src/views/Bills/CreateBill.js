import React, {useEffect, useState} from "react";
import axios from "axios";
import config from '../../constance.js';
import RegexPatterns from "../../helper/RegexPatterns.js";
import SuccessSound from "../../assets/audio/success-sound.mp3";
import '../../styles/CreatePage.scss';
import { toast } from "react-toastify";

function CreatBill() {
    const audio = new Audio(SuccessSound);
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
        const getAmountBills = axios.get(`http://${config.URL}/bills/amount`);
        const getTypesBill = axios.get(`http://${config.URL}/bills/gettypes`);

        Promise
            .all([getAmountBills, getTypesBill])
            .then(([amountBillsRes, typesBillRes]) => {
                setAmountBills(amountBillsRes.data + 1)
                setTypesBill(typesBillRes.data)
            })
            .catch(error => toast.error("Không tải được loại hóa đơn và số lượng!"));
    }, [status]);

    // Kiểm tra regex input: 
    const validateData = (data) => {
        let message = '';
        switch (true) {
            case !RegexPatterns.nameBill.test(data.nameBill):
                message = 'Tên hóa đơn không hợp lệ!';
                break;
            case !RegexPatterns.supplierBill.test(data.supplierBill):
                message = 'Tên nhà cung cấp không hợp lệ!';
                break;
            case !RegexPatterns.discountBill.test(data.discountBill):
                message = 'Chiết khấu phải là một số từ 0 - 100!';
                break;
            case !RegexPatterns.notes.test(data.notes):
                message = 'Ghi chú của bạn không hợp lệ!';
                break;
            default:
                break;
        }
        return message;
    };

    const handleCreateBill = (e) => {
        e.preventDefault();

        setStatus(true);
        
        // Get data from form:
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!data || !data.id || !data.nameBill) {
            toast.warning("Bạn phải điền đầy đủ thông tin!");
            return;
        };

        // Kiểm tra regex
        if (validateData(data) !== '') {
            toast.warning(validateData(data));
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
                    handleClearInput();
                    setStatus(false);
                    toast.success(res.data.success);
                    audio.play();
                }
            })
    };

    return (
        <div className="creatpage-container">
            <h1 className="col-12 creatpage-heading">Tạo hóa đơn mới</h1>
            <form method="POST" className="row createpage-form" onSubmit={handleCreateBill}>
                <div className="col-4 input-field">
                    <label for="input--bookcode" className="form-label">Mã đơn</label>
                    <input 
                        name="id" 
                        type="text" 
                        id="input--bookcode" 
                        className="form-control" 
                        value={amountBills}
                        readOnly/>
                </div>
                <div className="col-4 input-field">
                    <label for="input--bookname" className="form-label">Tên đơn</label>
                    <input 
                        name="nameBill" 
                        type="text" 
                        id="input--bookname" 
                        className="form-control"
                        value={inputValues.nameBill}
                        onChange={(e) => setInputValues({...inputValues, nameBill: e.target.value})}
                        required
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="input--supplier" className="form-label">Nhà cung cấp</label>
                    <input 
                        name="supplierBill" 
                        type="text" 
                        id="input--supplier" 
                        className="form-control"
                        value={inputValues.supplierBill}
                        onChange={(e) => setInputValues({...inputValues, supplierBill: e.target.value})}
                        required
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="input--discount" className="form-label">Chiết khấu (%)</label>
                    <input 
                        name="discountBill" 
                        type="text" 
                        id="input--discount" 
                        className="form-control"
                        value={inputValues.discountBill}
                        required
                        onChange={(e) => setInputValues({...inputValues, discountBill: e.target.value})}
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="input--date-create-bill" className="form-label">Ngày tạo đơn (mm/dd/yyyy)</label>
                    <input 
                        name="dateGenerate" 
                        type="date" 
                        id="input--date-create-bill" 
                        className="form-control"
                        placeholder="dd-mm-yyyy"
                        required
                        />
                </div>
                <div className="col-4 input-field">
                    <label for="select--type-bill" className="form-label">Hình thức</label>
                    <select 
                        value={inputValues.typeBill} 
                        name="typeBill" 
                        class="form-select" 
                        id="select--type-bill" 
                        title="Loại đơn"
                        required
                        onChange={(e) => setInputValues({...inputValues, typeBill: e.target.value})}
                        >
                        {typesBill.map((type) => (
                            <option key={type.id} value={type.id}>{type.Name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 input-field">
                    <label for="input--notes" className="form-label">Ghi chú thêm</label>
                    <input 
                        name="notes" 
                        type="text" 
                        id="input--notes" 
                        className="form-control"
                        value={inputValues.notes}
                        onChange={(e) => setInputValues({...inputValues, notes: e.target.value})}
                        />
                </div>
                <div className="col-12 mt-3 button-container">
                    <button type="submit" className="btn btn-primary mb-3">Tạo</button>
                </div>
            </form>
        </div>
    );
}

export default CreatBill;