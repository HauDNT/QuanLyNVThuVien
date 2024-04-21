import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import config from '../../constance.js';
import { toast } from "react-toastify";
import '../../styles/CreateCataloging.scss';

function CreateCataloging() {
    const idUserCataloging = localStorage.getItem('id');
    const [fullnameUser, setFullname] = useState('');
    const [inputValues, setInputValues] = useState({
        ISBN: '',
        DDC: '',
        EncryptName: '',
        MainTitle: '',
        SubTitle: '',
        Author: '',
        ManyAuthors: '',
        Topic: '',
        Publisher: '',
        PubPlace: '',
        PubYear: '',
        QuantityCopies: '',
        Size: '',
        UnitPrice: '',
        UserId: {fullnameUser},
    });

    const handleClearInput = () => {
        setInputValues({
            ISBN: '',
            DDC: '',
            EncryptName: '',
            MainTitle: '',
            SubTitle: '',
            Author: '',
            ManyAuthors: '',
            Topic: '',
            Publisher: '',
            PubPlace: '',
            PubYear: '',
            QuantityCopies: '',
            Size: '',
            UnitPrice: '',
        });
    };

    const handleCreateCataloging = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!data) {
            toast.warning("Bạn phải điền đầy đủ thông tin!");
            return;
        };

        // Send info to Server:
        axios
        .post(`http://${config.URL}/books/createCataloging`, data, {headers: {authenToken: localStorage.getItem('authenToken')}})
        .then((res) => {
            if (res.data.error) {
                toast.error(res.data.error);
            }
            else {
                handleClearInput();
                toast.success(res.data.success);
            }
        });
    };





    
    useEffect(() => {
        try {
            axios
                .get(`http://localhost:3002/users/fullname/${idUserCataloging}`)
                .then((res) => {
                    if (res.data?.userInfo?.Fullname) {
                        setFullname(res.data.userInfo.Fullname);
                    }                    
                })
        } catch (error) {
            toast.error('Đã xảy ra lỗi tại máy chủ! Hãy thử lại sau ít phút...');
        }
    }, [idUserCataloging]);

    return (
        <div className="createCataloging-container">
        <h3 className="col-12 createCataloging-heading">Tạo biên mục mới</h3>
        <form method="POST" className="row createCataloging-form" onSubmit={handleCreateCataloging}>
            <label>Mã sách</label>
            <div class="input-group">
                <span class="input-group-text">ISBN</span>
                <input 
                    name="ISBN"
                    id=""
                    value={inputValues.ISBN}
                    onChange={(e) => setInputValues({...inputValues, ISBN: e.target.value})}
                    type="number"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Chỉ số phân loại (DDC)</span>
                <input 
                    name="DDC"
                    id=""
                    value={inputValues.DDC}
                    onChange={(e) => setInputValues({...inputValues, DDC: e.target.value})}
                    type="number"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Chỉ số ấn phẩm</span>
                <input 
                    name="EncryptName"
                    id=""
                    value={inputValues.EncryptName}
                    onChange={(e) => setInputValues({...inputValues, EncryptName: e.target.value})}
                    type="text"
                    className="form-control"
                    placeholder="Tên mã hóa của nhan đề chính"
                    required
                />
            </div>
            <label>Thông tin sách</label>
            <div class="input-group">
                <span class="input-group-text">Nhan đề chính</span>
                <input 
                    name="MainTitle"
                    id=""
                    value={inputValues.MainTitle}
                    onChange={(e) => setInputValues({...inputValues, MainTitle: e.target.value})}
                    type="text"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Nhan đề phụ</span>
                <input 
                    name="SubTitle"
                    id=""
                    value={inputValues.SubTitle}
                    onChange={(e) => setInputValues({...inputValues, SubTitle: e.target.value})}
                    type="text"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Tác giả chính</span>
                <input 
                    name="Author"
                    id=""
                    value={inputValues.Author}
                    onChange={(e) => setInputValues({...inputValues, Author: e.target.value})}
                    type="text"
                    className="form-control"
                    placeholder="Đối với tác phẩm chỉ có duy nhất một tác giả"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Tác giả chung</span>
                <input 
                    name="ManyAuthors"
                    id=""
                    value={inputValues.ManyAuthors}
                    onChange={(e) => setInputValues({...inputValues, ManyAuthors: e.target.value})}
                    type="text"
                    className="form-control"
                    placeholder="Đối với tác phẩm có hai tác giả trở lên"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Chủ đề</span>
                <input 
                    name="Topic"
                    id=""
                    value={inputValues.Topic}
                    onChange={(e) => setInputValues({...inputValues, Topic: e.target.value})}
                    type="text"
                    className="form-control"
                    required
                />
            </div>
            <label>Thông tin xuất bản</label>
            <div class="input-group">
                <span class="input-group-text">Nhà xuất bản</span>
                <input 
                    name="Publisher"
                    id=""
                    value={inputValues.Publisher}
                    onChange={(e) => setInputValues({...inputValues, Publisher: e.target.value})}
                    type="text"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Nơi xuất bản</span>
                <input 
                    name="PubPlace"
                    id=""
                    value={inputValues.PubPlace}
                    onChange={(e) => setInputValues({...inputValues, PubPlace: e.target.value})}
                    type="text"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Năm xuất bản</span>
                <input 
                    name="PubYear"
                    id=""
                    value={inputValues.PubYear}
                    onChange={(e) => setInputValues({...inputValues, PubYear: e.target.value})}
                    type="text"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Số lượng phát hành</span>
                <input 
                    name="QuantityCopies"
                    id=""
                    value={inputValues.QuantityCopies}
                    onChange={(e) => setInputValues({...inputValues, QuantityCopies: e.target.value})}
                    type="number"
                    className="form-control"
                    required
                />
            </div>
            <label>Mô tả vật lý</label>
            <div class="input-group">
                <span class="input-group-text">Khổ / Kích thước</span>
                <input 
                    name="Size"
                    id=""
                    value={inputValues.Size}
                    onChange={(e) => setInputValues({...inputValues, Size: e.target.value})}
                    type="text"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Số trang</span>
                <input 
                    name="NumPages"
                    id=""
                    value={inputValues.NumPages}
                    onChange={(e) => setInputValues({...inputValues, NumPages: e.target.value})}
                    type="number"
                    className="form-control"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Đơn giá</span>
                <input 
                    name="UnitPrice"
                    id=""
                    value={inputValues.UnitPrice}
                    onChange={(e) => setInputValues({...inputValues, UnitPrice: e.target.value})}
                    type="number"
                    className="form-control"
                    required
                />
            </div>
            <label>Thông tin biên mục</label>
            <div class="input-group">
                <span class="input-group-text">Người biên mục</span>
                <input 
                    name="UserId"
                    id=""
                    type="text"
                    className="form-control"
                    placeholder="Load họ tên user vào trường input này"
                    value={fullnameUser}
                    readOnly
                    required
                />
            </div>

            <div className="col-12 mt-3 button-container">
                <button type="submit" className="btn btn-primary mb-3">Tạo</button>
                <button type="button" className="btn btn-success mb-3">Duyệt</button>
            </div>
        </form>
    </div>
    )
}

export default CreateCataloging;