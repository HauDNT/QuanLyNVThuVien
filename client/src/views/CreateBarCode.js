import React, { useState, useEffect, useCallback } from 'react';
import Barcode from 'react-barcode';
import axios from 'axios';
import debounce from 'lodash.debounce';
import config from '../constance.js';
import { toast } from 'react-toastify';

function CreateBarCode() {
    const [initValues, setInitValues] = useState({
        firstCode: '',
        lastCode: '',
    }); // Mã đầu & cuối
    const [listCode, setListCode] = useState([]); // Mảng chứa các mã nằm trong phạm vị firstCode <--> lastCode
    const [notFound, setNotFound] = useState([]); // Mảng chứa và hiển thị các mã không tìm thấy -> không tạo barcode

    const [barcode, setBarcodes] = useState([]); // Mảng chứa thông tin của barcode [Mã DDC, tên mã hóa và barcode]

    // Cập nhật lại các biến trong state nếu có thay đổi:
    const updateValuechange = (e) => {
        const { name, value } = e.target;
        setInitValues((prevValues) => ({ ...prevValues, [name]: value }));
    };

    // Debouncing cập nhật giá trị firstCode, lastCode sau khi ngưng nhập 0.5s
    const debounceUpdateValue = useCallback(
        debounce(
            (firstCode, lastCode) => findListRegisCodes(firstCode, lastCode),
            500
        ),
        []
    );

    useEffect(() => {
        setListCode([]);
        const { firstCode, lastCode } = initValues;

        if (firstCode && lastCode) {
            debounceUpdateValue(firstCode, lastCode);
        }
    }, [initValues.firstCode, initValues.lastCode]);

    // Hàm tìm tất cả mã trong phạm vi firstCode <--> lastCode
    const findListRegisCodes = (firstCode, lastCode) => {
        let newListCode = [firstCode]; // Lấy ngay mã đầu

        // Nếu mã đầu và cuối khác nhau thì ta phải xử lý bước lấy tất cả mã trong phạm vi
        // Còn không thì bỏ qua, chỉ cần mã đầu.
        if (firstCode !== lastCode) {
            let heading = firstCode.split('.')[0]; // Lấy phần đầu mã (PM23, TN23,...)

            let firstCodeNumber = +firstCode.split('.')[1]; // Nếu mã là (Ví dụ) PM23.000001 thì sẽ tách ra thành["PM23", "000001"]
            let lastCodeNumber = +lastCode.split('.')[1]; // ta lấy phần tử thứ [1] và chuyển nó thành số

            let strZero = '';
            for (
                let i = 1;
                i <= firstCode.split('.')[1].length;
                i++ // Tạo 1 dãy các số 0 để format lại mã đăng ký trong thao tác phía dưới
            )
                strZero = strZero.concat('0');

            // Sau đó lặp dài từ mã đầu đến cuối để lấy tất cả các mã trong phạm vi.
            // Kết hợp đưa các số 0 và phần heading (PM23, PM24,...) vào và cắt từ vị trí thứ -6 đến -1 là được 6 số để hoàn thiện mã.
            for (
                let codeNumber = firstCodeNumber + 1;
                codeNumber < lastCodeNumber;
                codeNumber++
            ) {
                let newCode = heading + '.' + (strZero + codeNumber).slice(-6);
                newListCode.push(newCode); // Thêm mã mới vào mảng tạm thời
            }

            // Sau khi hoàn tất đưa các mã trong phạm vi ta đưa mã cuối cùng vào:
            newListCode.push(lastCode);
        }

        // Sau khi mọi thao tác hoàn tất thì ta mới cập nhật vào State:
        setListCode(newListCode);
    };

    // Hàm gửi toàn bộ mã sang Server để kiểm tra và lấy thông tin (Mã DDC và tên mã hóa sách):
    const sendRegisCode_ReceiveBarCode = () => {
        if (listCode.length > 0) {
            axios
                .post(`http://${config.URL}/barcode/generate/`, listCode, {
                    headers: {
                        authenToken: localStorage.getItem('authenToken'),
                    },
                })
                .then((res) => {
                    if (!res.data.error) {
                        // Nếu có mã không tìm thấy thì thêm nó vào danh sách notFound:
                        if (res.data.notFound) {
                            setNotFound(res.data.notFound);
                        }

                        setBarcodes(res.data.infoBarcodes);
                    }
                });
        } else toast.error('Bạn phải điền đầy đủ thông tin!');
    };

    // Hàm in mã barcode:
    const printBarcode = () => {
        toast.info('Chức năng này vẫn còn đang trong quá trình phát triển!');
    };

    return (
        <>
            <div className="row">
                <form className="col-md-12 col-sm-12">
                    <div class="form-group">
                        <div className="row">
                            <div className="col-md-4 col-sm-12">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span
                                            class="input-group-text"
                                            id="basic-addon3"
                                        >
                                            Mã đầu
                                        </span>
                                    </div>
                                    <input
                                        name="firstCode"
                                        value={initValues.firstCode}
                                        onChange={(e) => updateValuechange(e)}
                                        type="text"
                                        class="form-control"
                                        id="basic-url"
                                        aria-describedby="basic-addon3"
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-12">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span
                                            class="input-group-text"
                                            id="basic-addon3"
                                        >
                                            Mã cuối
                                        </span>
                                    </div>
                                    <input
                                        name="lastCode"
                                        value={initValues.lastCode}
                                        onChange={(e) => updateValuechange(e)}
                                        type="text"
                                        class="form-control"
                                        id="basic-url"
                                        aria-describedby="basic-addon3"
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4">
                                <div className="row btn-container-barcode">
                                    <button
                                        type="button"
                                        class="btn btn-primary col-md-5 col-sm-5"
                                        onClick={sendRegisCode_ReceiveBarCode}
                                    >
                                        Tạo mã
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-primary col-md-5 col-sm-5"
                                        onClick={printBarcode}
                                    >
                                        In mã
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="row">
                {notFound && notFound.length > 0 ? (
                    <div className="not-found">
                        <p>
                            Có {notFound.length} mã không có barcode do không
                            tìm thấy mã số phân phối
                        </p>
                        {notFound.map((item) => (
                            <span>{item.RegisCode}</span>
                        ))}
                    </div>
                ) : (
                    ''
                )}
            </div>
            <div className="row">
                {barcode
                    ? barcode.map((item) => (
                          <div className="col-md-3 col-sm-12">
                              <div className="card mb-3">
                                  <div className="card-body text-center">
                                      <h6 class="card-title">{item.DDC}</h6>
                                      <h6 class="card-title mb-2">
                                          {item.EncryptName}
                                      </h6>
                                      <Barcode
                                          value={item.RegisCode}
                                          format="CODE128"
                                          fontSize={30}
                                          className="barcode"
                                      />
                                  </div>
                              </div>
                          </div>
                      ))
                    : ''}
            </div>
        </>
    );
}

export default CreateBarCode;
