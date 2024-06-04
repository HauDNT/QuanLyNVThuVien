import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../constance.js';
import { toast } from 'react-toastify';
import { Marc21DataContext } from '../../helper/HandleMarc21Data.js';
// import ReadMarcFile from '../../helper/ReadMarcFile.js';
import '../../styles/CreateCataloging.scss';

function CreateCataloging() {
    const idUserCataloging = localStorage.getItem('id');
    const { records, handleReadFile } = useContext(Marc21DataContext);
    const [fullnameUser, setFullname] = useState('');
    const [inputValues, setInputValues] = useState({
        ISBN: '',
        DDC: '',
        EncryptName: '',
        MainTitle: '',
        SubTitle: '',
        Types: '',
        Author: '',
        OrtherAuthors: '',
        Editors: '',
        Synopsis: '',
        Topic: '',
        Publisher: '',
        PubPlace: '',
        PubYear: '',
        QuantityCopies: '',
        Size: '',
        UnitPrice: '',
        NumPages: '',
        UserName: { fullnameUser },
    });

    const handleClearInput = () => {
        setInputValues({
            ISBN: '',
            DDC: '',
            EncryptName: '',
            MainTitle: '',
            SubTitle: '',
            Types: '',
            Author: '',
            OrtherAuthors: '',
            Editors: '',
            Synopsis: '',
            Topic: '',
            Publisher: '',
            PubPlace: '',
            PubYear: '',
            QuantityCopies: '',
            Size: '',
            NumPages: '',
            UnitPrice: '',
        });
    };

    const handleCreateCataloging = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.delete('UserName');
        formData.append('UserId', idUserCataloging);
        const data = Object.fromEntries(formData.entries());

        if (!data) {
            toast.warning('Bạn phải điền đầy đủ thông tin!');
            return;
        }

        // Send info to Server:
        axios
            .post(`http://${config.URL}/books/createCataloging`, data, {
                headers: { authenToken: localStorage.getItem('authenToken') },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    handleClearInput();
                    toast.success(res.data.success);
                }
            });
    };

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/users/fullname/${idUserCataloging}`)
                .then((res) => {
                    setFullname(res.data);
                });
        } catch (error) {
            toast.error(
                'Đã xảy ra lỗi tại máy chủ! Hãy thử lại sau ít phút...'
            );
        }
    }, [idUserCataloging]);

    return (
        <div className="createCataloging-container">
            <h3 className="col-12 createCataloging-heading">
                Tạo biên mục mới
            </h3>
            <form
                method="POST"
                className="row createCataloging-form"
                onSubmit={handleCreateCataloging}
            >
                <label>Default file input example</label>
                <div>
                    <input class="col form-control" type="file" id="formFile" onChange={handleReadFile} />
                    <input type="text" name="" id="" />
                </div>

                <label>Mã sách</label>
                <div class="input-group">
                    <span class="input-group-text">ISBN</span>
                    <input
                        name="ISBN"
                        id=""
                        value={inputValues.ISBN}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                ISBN: e.target.value,
                            })
                        }
                        type="number"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Chỉ số phân loại (DDC)</span>
                    <input
                        name="DDC"
                        id=""
                        value={inputValues.DDC}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                DDC: e.target.value,
                            })
                        }
                        type="number"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Chỉ số ấn phẩm</span>
                    <input
                        name="EncryptName"
                        id=""
                        value={inputValues.EncryptName}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                EncryptName: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Tên mã hóa của nhan đề chính"
                    />
                </div>
                <label>Thông tin sách</label>
                <div class="input-group">
                    <span class="input-group-text">Nhan đề chính</span>
                    <input
                        name="MainTitle"
                        id=""
                        value={inputValues.MainTitle}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                MainTitle: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Nhan đề phụ</span>
                    <input
                        name="SubTitle"
                        id=""
                        value={inputValues.SubTitle}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                SubTitle: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Thể loại</span>
                    <input
                        name="Types"
                        id=""
                        value={inputValues.Types}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                Types: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Tác giả chính</span>
                    <input
                        name="Author"
                        id=""
                        value={inputValues.Author}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                Author: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Đối với tác phẩm chỉ có duy nhất một tác giả"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Tác giả khác</span>
                    <input
                        name="OrtherAuthors"
                        id=""
                        value={inputValues.OrtherAuthors}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                OrtherAuthors: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Đối với tác phẩm có hai tác giả trở lên"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Phụ trách xuất bản</span>
                    <input
                        name="Editors"
                        id=""
                        value={inputValues.Editors}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                Editors: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                        placeholder="Dịch, biên tập, in ấn,..."
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Chủ đề</span>
                    <input
                        name="Topic"
                        id=""
                        value={inputValues.Topic}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                Topic: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                    />
                </div>
                <div class="mb-3">
                    <p class="form-label">Tóm tắt nội dung</p>
                    <textarea
                        name="Synopsis"
                        class="form-control"
                        value={inputValues.Synopsis}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                Synopsis: e.target.value,
                            })
                        }
                        rows="3"
                    />
                </div>
                <label>Thông tin xuất bản</label>
                <div class="input-group">
                    <span class="input-group-text">Nhà xuất bản</span>
                    <input
                        name="Publisher"
                        id=""
                        value={inputValues.Publisher}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                Publisher: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Nơi xuất bản</span>
                    <input
                        name="PubPlace"
                        id=""
                        value={inputValues.PubPlace}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                PubPlace: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Năm xuất bản</span>
                    <input
                        name="PubYear"
                        id=""
                        value={inputValues.PubYear}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                PubYear: e.target.value,
                            })
                        }
                        type="number"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Số lượng phát hành</span>
                    <input
                        name="QuantityCopies"
                        id=""
                        value={inputValues.QuantityCopies}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                QuantityCopies: e.target.value,
                            })
                        }
                        type="number"
                        className="form-control"
                    />
                </div>
                <label>Mô tả vật lý</label>
                <div class="input-group">
                    <span class="input-group-text">Khổ / Kích thước</span>
                    <input
                        name="Size"
                        id=""
                        value={inputValues.Size}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                Size: e.target.value,
                            })
                        }
                        type="text"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Số trang</span>
                    <input
                        name="NumPages"
                        id=""
                        value={inputValues.NumPages}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                NumPages: e.target.value,
                            })
                        }
                        type="number"
                        className="form-control"
                    />
                </div>
                <div class="input-group">
                    <span class="input-group-text">Đơn giá</span>
                    <input
                        name="UnitPrice"
                        id=""
                        value={inputValues.UnitPrice}
                        onChange={(e) =>
                            setInputValues({
                                ...inputValues,
                                UnitPrice: e.target.value,
                            })
                        }
                        type="number"
                        className="form-control"
                    />
                </div>
                <label>Thông tin biên mục</label>
                <div class="input-group">
                    <span class="input-group-text">Người biên mục</span>
                    <input
                        name="UserName"
                        id=""
                        type="text"
                        className="form-control"
                        placeholder="Load họ tên user vào trường input này"
                        value={fullnameUser}
                        readOnly
                    />
                </div>

                <div className="col-12 mt-3 button-container">
                    <button type="submit" className="btn btn-primary mb-3">
                        Tạo
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateCataloging;
