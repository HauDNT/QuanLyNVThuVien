import React, { useState, useEffect } from "react";
import Barcode from 'react-barcode';
import axios from 'axios';
import config from '../constance.js';
import { toast } from "react-toastify";
import "../styles/BarCode.scss";

function CreateBarCode() {
    const [listCode, setListCode] = useState([]);

    // // Hàm lấy tất cả các mã đăng ký trong phạm vi từ firstCode -> lastCode:
    const findListRegisCodes = (firstCode, lastCode) => {
        let arrayRegisCode = [];
    
        // Nếu mã đầu và cuối giống nhau thì không cần xử lý, lấy luôn mã đầu
        if (firstCode === lastCode) {
            arrayRegisCode.push(firstCode);
        }
        else {
            // Nếu mã là (Ví dụ) PM23.000001 thì sẽ tách ra thành["PM23", "000001"]
            // ta lấy phần tử thứ [1] và chuyển nó thành số
            let firstCodeNumber = +firstCode.split('.')[1];
            let lastCodeNumber = +lastCode.split('.')[1];
        
            // Tạo 1 dãy các số 0 để format lại mã đăng ký trong thao tác phía dưới
            let strZero = '';
            for (let i = 1; i < firstCode.split('.')[1].length; i++)
                strZero = strZero.concat('0');
        
            let heading = firstCode.split('.')[0];  // Lấy phần đầu mã (PM23, TN23,...)
        
            // Đưa phần tử đầu tiên vào mảng:
            arrayRegisCode.push(firstCode);
        
            // Sau đó lặp dài từ mã đầu đến cuối để lấy tất cả các mã trong phạm vi.
            // Kết hợp đưa các số 0 và phần heading (PM23, PM24,...) vào để hoàn thiện mã.
            for (let codeNumber = firstCodeNumber + 1; codeNumber < lastCodeNumber; codeNumber++) {
                arrayRegisCode.push(heading + '.' + (strZero + codeNumber).slice(-(lastCodeNumber - firstCodeNumber)))
            }
        
            // Sau khi hoàn tất đưa các mã trong phạm vi ta đưa mã cuối cùng vào:
            arrayRegisCode.push(lastCode);
        }
    
        return arrayRegisCode;
    };

    // Sự kiện submit của form: kiểm tra nếu hợp lệ thì đưa danh sách các mã trong phạm vi vừa tạo từ hàm trên vào listCode
    const generateBarcode = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!data || !data.firstCode || !data.lastCode) {
            toast.warning("Bạn phải điền đầy đủ thông tin!");
            return;
        };

        setListCode(findListRegisCodes(data.firstCode, data.lastCode));
    };

    const printBarcode = () => {
        toast.info('Chức năng này vẫn còn đang trong quá trình phát triển!');
    };

    return (
        <>
        <div className="container">
        <div className="row">
            <form onSubmit={generateBarcode}>
                <div class="form-group">
                    <div className="row">
                        <div className="col-4">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon3">Mã đầu</span>
                                </div>
                                <input name="firstCode" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3"/>
                            </div>
                        </div>
                        <div className="col-4">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon3">Mã cuối</span>
                                </div>
                                <input name="lastCode" type="text" class="form-control" id="basic-url" aria-describedby="basic-addon3"/>
                            </div>
                        </div>
                        <div className="col-4 btn-container">
                            <button type="submit"class="btn btn-primary">Tạo mã</button>
                            <button type="button" class="btn btn-primary" onClick={printBarcode}>In mã</button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
            <div className="row">
                {
                    listCode ? (
                    listCode.map(
                        item => (
                            <div className="col-lg-3">
                                <div className="card mb-3">
                                    <div className="card-body text-center">
                                        <Barcode 
                                            value={item} 
                                            format="CODE128"
                                            fontSize={30}
                                            className="barcode"
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    )) : ('')
                }
            </div>
        </div>
        </>
    )
};

export default CreateBarCode;