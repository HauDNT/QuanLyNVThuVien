import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { toast } from 'react-toastify';
import config from '../../constance.js';
import { RoomContext } from '../../context/RoomContext.js';
import { BillContext } from '../../context/BillContext.js';
import { StatusDocContext } from '../../context/StatusDocsContext.js';
import { StoreTypesContext } from '../../context/StoreTypesContext.js';
import { formatAndDisplayDatetime } from '../../utils/FormatDateTime.js';

function ApproveCreate() {
    const { id: bookId } = useParams();
    const { listRooms } = useContext(RoomContext);
    const { listBills } = useContext(BillContext);
    const { statusDocs } = useContext(StatusDocContext);
    const { storeTypes } = useContext(StoreTypesContext);

    const [initValues, setInitValues] = useState({
        Heading: '', // Phần đầu của mã. VD: PM23
        NumberSeries: '', // Phần số của mã. VD: 85643
        NumberLength: '', // Độ dài dãy số. VD: 6 => 085643
        RegisCode: '', // Mã đăng ký cá biệt. VD: được ghép lại thành PM23.085643
        AmountRegis: '', // Số lượng đăng ký
        StoreTypes: '', // Thể loại lưu trữ
        StorePlace: '', // Nơi lưu trữ (phòng)
        TempStore: '', // Nơi lưu trữ tạm thời
        StatusDoc: '', // Trạng thái của tài liệu
        BillId: '', // Mã đơn thuộc về
        Notes: '', // Ghi chú
        AllRegisCode: [], // Các mã đăng ký cá biệt sẽ được đăng ký
    });

    const handleClearInput = () => {
        setInitValues({
            ...initValues,
            Heading: '',
            NumberSeries: '',
            NumberLength: '',
            RegisCode: '',
            AmountRegis: '',
            Notes: '',
            AllRegisCode: [],
        });
    };

    const getNumberSeries = (heading) => {
        axios
            .get(`http://${config.URL}/approve/getmaxregiscode/${heading}`)
            .then((res) => {
                setInitValues((prevValues) => ({
                    ...prevValues,
                    NumberSeries: res.data,
                }));
            })
            .catch((error) => {
                toast.error(
                    'Không thể nhận dữ liệu từ Server, hãy thử lại sau!'
                );
            });
    };

    // Debouncing lấy giá trị heading, number length để tạo number series
    const debounceCreateNumberSeries = useCallback(
        debounce((heading) => getNumberSeries(heading), 1000),
        []
    );

    // Tạo mã mới nếu có thay đổi thông tin về: Mã đầu, dãy số đăng ký, độ dài dãy số, số lượng
    useEffect(() => {
        const { Heading, NumberSeries, NumberLength, AmountRegis } = initValues;
        if (Heading && NumberLength && NumberSeries && AmountRegis) {
            formatAndCreateRegisCodes(); // Cập nhật lại thông tin vừa thay đổi và tạo một dãy mã mới

            setInitValues((prevValues) => ({
                ...prevValues,
                RegisCode: prevValues.AllRegisCode[0],
            }));
            // Cập nhật lại biến RegisCode là mã số đầu tiên vừa được tạo mới trong mảng AllRegisCode 
            // với mục đích hiển thị mẫu cho người dùng xem
        }
    }, [
        initValues.Heading,
        initValues.NumberSeries,
        initValues.NumberLength,
        initValues.AmountRegis,
    ]);

    // Cập nhật giá trị mới cho input thay đổi tương ứng:
    const changeToGenerateRegisCode = (e) => {
        const { name, value } = e.target;
        setInitValues((prevValues) => ({ ...prevValues, [name]: value }));

        if (initValues.Heading && initValues.NumberLength)
            debounceCreateNumberSeries(
                initValues.Heading,
                initValues.NumberLength
            );
    };

    // Hàm format lại dãy số đăng ký và độ dài dãy số cho phù hợp
    // Sau đó tạo ra một loạt dãy số đăng ký cá biệt tương ứng với số lượng mong muốn
    const formatAndCreateRegisCodes = () => {
        // Tạo ra 1 dãy số 0 để đưa vào tạo mã mới
        let strZero = '';

        for (let i = 1; i <= initValues.NumberLength; i++)
            strZero = strZero.concat('0');

        let numberSeries = +initValues.NumberSeries;

        if (initValues.AllRegisCode.length > initValues.AmountRegis)
            initValues.AllRegisCode = [];

        for (let i = 0; i < initValues.AmountRegis; i++) {
            numberSeries = (strZero + numberSeries).slice(-initValues.NumberLength);
            initValues.AllRegisCode[i] = initValues.Heading + '.' + numberSeries;
            numberSeries++;
        }
    };

    // Hàm tạo mã đăng ký:
    const handleCreateApprove = (e) => {
        e.preventDefault();

        if (!initValues) {
            toast.warning('Bạn phải điền đầy đủ thông tin!');
            return;
        }

        const data = {
            ...initValues,
            UserId: +localStorage.getItem('id'),
            BookId: +bookId,
        };

        // Kiểm tra trùng:
        axios
            .post(`http://${config.URL}/approve/findexist/`, data, {
                headers: { authenToken: localStorage.getItem('authenToken') },
            })
            .then((res) => {
                if (res.data.success) {
                    // Send data to Server:
                    axios
                        .post(
                            `http://${config.URL}/approve/create/:${bookId}`,
                            data,
                            {
                                headers: {
                                    authenToken:
                                        localStorage.getItem('authenToken'),
                                },
                            }
                        )
                        .then((res) => {
                            if (res.data.error) {
                                toast.error(res.data.error);
                            } else {
                                toast.success(res.data.success);
                                handleClearInput();
                            }
                        });
                }
                if (res.data.error) {
                    toast.error(res.data.error);
                }
            });
    };

    return (
        <form
            method="POST"
            className="form-container"
            onSubmit={handleCreateApprove}
        >
            <h1 className="form-header">Phân phối tài liệu</h1>
            <div className="form-body">
                <div className="row">
                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Phần đầu
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                name="Heading"
                                value={initValues.Heading}
                                onChange={(e) => changeToGenerateRegisCode(e)}
                                placeholder="VD: PM24"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Độ dài dãy số
                            </span>
                            <input
                                type="number"
                                name="NumberLength"
                                value={initValues.NumberLength}
                                onChange={(e) => changeToGenerateRegisCode(e)}
                                className="form-control"
                                placeholder="Khuyến nghị: 6"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Số lượng
                            </span>
                            <input
                                type="number"
                                name="AmountRegis"
                                value={initValues.AmountRegis}
                                onChange={(e) => changeToGenerateRegisCode(e)}
                                className="form-control"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Mã số đăng ký
                            </span>
                            <input
                                name="NumberSeries"
                                value={initValues.NumberSeries}
                                onChange={(e) => changeToGenerateRegisCode(e)}
                                type="number"
                                className="form-control"
                                placeholder="Tự động tạo, có thể tùy chỉnh"
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Mã vạch
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                name="RegisCode"
                                value={initValues.RegisCode}
                                placeholder="VD: PM24.086594"
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Số ĐKCB
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                name="RegisCode"
                                value={initValues.RegisCode}
                                placeholder="VD: PM23.086594"
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Thể loại lưu trữ
                            </span>
                            <select
                                className="form-select"
                                onChange={(e) =>
                                    setInitValues({
                                        ...initValues,
                                        StoreTypes: +e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="0" selected>
                                    Chọn thể loại lưu trữ
                                </option>
                                {storeTypes ? (
                                    storeTypes.map((types) => (
                                        <option value={types.id}>
                                            {types.NameType}
                                        </option>
                                    ))
                                ) : (
                                    <option value="0" selected>
                                        Không nhận được dữ liệu
                                    </option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Vị trí lưu trữ
                            </span>
                            <select
                                className="form-select"
                                onChange={(e) =>
                                    setInitValues({
                                        ...initValues,
                                        StorePlace: +e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="0" selected>
                                    Chọn vị trí lưu trữ
                                </option>
                                {listRooms ? (
                                    listRooms.map((room) => (
                                        <option value={room.id}>
                                            {room.RoomName}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Không có dữ liệu</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Trạng thái
                            </span>
                            <select
                                className="form-select"
                                onChange={(e) =>
                                    setInitValues({
                                        ...initValues,
                                        StatusDoc: +e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="0" selected>
                                    Chọn trạng thái tài liệu
                                </option>
                                {statusDocs.length > 0 ? (
                                    statusDocs.map((status) => (
                                        <option value={status.id}>
                                            {status.Status}
                                        </option>
                                    ))
                                ) : (
                                    <option value="0" selected>
                                        Không nhận được dữ liệu
                                    </option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-4 col-sm-4">
                        <div className="input-group">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                Mã đơn hàng
                            </span>
                            <select
                                className="form-select"
                                onChange={(e) =>
                                    setInitValues({
                                        ...initValues,
                                        BillId: +e.target.value,
                                    })
                                }
                                required
                            >
                                <option value="0" selected>
                                    Chọn mã đơn hàng
                                </option>
                                {listBills ? (
                                    listBills.map((bill) => (
                                        <option value={bill.id}>
                                            {' '}
                                            {formatAndDisplayDatetime(
                                                bill.createdAt
                                            )}{' '}
                                            - {bill.NameBill}
                                        </option>
                                    ))
                                ) : (
                                    <option value="0" selected>
                                        Không nhận được dữ liệu
                                    </option>
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-8 col-sm-12">
                        <div className="input-group">
                            <span className="input-group-text">Ghi chú</span>
                            <textarea
                                className="form-control"
                                onChange={(e) =>
                                    setInitValues({
                                        ...initValues,
                                        Notes: e.target.value,
                                    })
                                }
                                rows={1}
                            ></textarea>
                        </div>
                    </div>

                    <div className="col-md-12 col-sm-12 mb-3">
                        <label className="form-label">
                            Dãy số đăng ký cá biệt sẽ được tạo:
                        </label>
                        <textarea
                            className="form-control"
                            rows="5"
                            value={initValues.AllRegisCode.map(
                                (regisCode) => regisCode
                            ).join(' - ')}
                            readOnly
                        ></textarea>
                    </div>

                    <div className="col-md-12 col-sm-12 mb-3">
                        <div className="row btn-container">
                            <button
                                type="submit"
                                className="btn btn-primary col-md-2 col-sm-12"
                            >
                                Phân phối
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
    );
}

export default ApproveCreate;
