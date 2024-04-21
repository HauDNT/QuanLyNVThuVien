import React, {useEffect, useState} from "react";
import {Link, useParams} from 'react-router-dom';
import axios from "axios";
import config from '../../constance.js';
import { toast } from "react-toastify";
import '../../styles/CreateCataloging.scss';

function EditCataloging() {
    const {id} = useParams();
    const [fullname, setFullname] = useState('');
    const [infoCataloging, setInfoCataloging] = useState([]);

    useEffect(() => {
        try {
            axios
            .get(`http://${config.URL}/books/getInfoCatalog/${id}`,
                    {headers: {authenToken: localStorage.getItem('authenToken')}}
                )
            .then((res) => {
                if (!res.data && !res.data.catalogInfo) {
                    toast.error(res.data.error);
                    return;
                }

                setInfoCataloging(res.data.catalogInfo);
            });
        } catch (error) {
            toast.error('Đã xảy ra lỗi tại máy chủ! Hãy thử lại sau ít phút...');
        }
    }, []);

    useEffect(() => {
        if (infoCataloging && infoCataloging.id) {
            axios
            .get(`http://${config.URL}/users/fullname/${infoCataloging.id}`)
            .then((res) => {
                if (res.data?.userInfo?.Fullname) {
                    setFullname(res.data.userInfo.Fullname);
                }                    
            });
        }
    }, [infoCataloging]);

    const formatAndDisplayDatetime = (dateString) => {
        const date = new Date(dateString);
        dateString = 
            `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}
            ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return dateString;
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
                toast.success(res.data.success);
            }
        });
    };

    return (
        <div className="createCataloging-container">
        <h3 className="col-12 createCataloging-heading">Biên mục</h3>
        <form method="POST" className="row createCataloging-form" onSubmit={handleCreateCataloging}>
            <label>Mã sách</label>
            <div class="input-group">
                <span class="input-group-text">ISBN</span>
                <input 
                    name="ISBN"
                    id=""
                    value={infoCataloging.ISBN}
                    onChange={(e) => setInfoCataloging({...infoCataloging, ISBN: e.target.value})}
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
                    value={infoCataloging.DDC}
                    onChange={(e) => setInfoCataloging({...infoCataloging, DDC: e.target.value})}
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
                    value={infoCataloging.EncryptName}
                    onChange={(e) => setInfoCataloging({...infoCataloging, EncryptName: e.target.value})}
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
                    value={infoCataloging.MainTitle}
                    onChange={(e) => setInfoCataloging({...infoCataloging, MainTitle: e.target.value})}
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
                    value={infoCataloging.SubTitle}
                    onChange={(e) => setInfoCataloging({...infoCataloging, SubTitle: e.target.value})}
                    type="text"
                    className="form-control"
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Thể loại</span>
                <input 
                    name="Types"
                    id=""
                    value={infoCataloging.Types}
                    onChange={(e) => setInfoCataloging({...infoCataloging, Types: e.target.value})}
                    type="text"
                    className="form-control"
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Tác giả chính</span>
                <input 
                    name="Author"
                    id=""
                    value={infoCataloging.Author}
                    onChange={(e) => setInfoCataloging({...infoCataloging, Author: e.target.value})}
                    type="text"
                    className="form-control"
                    placeholder="Đối với tác phẩm chỉ có duy nhất một tác giả"
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Tác giả khác</span>
                <input 
                    name="OrtherAuthors"
                    id=""
                    value={infoCataloging.OrtherAuthors}
                    onChange={(e) => setInfoCataloging({...infoCataloging, OrtherAuthors: e.target.value})}
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
                    value={infoCataloging.Editors}
                    onChange={(e) => setInfoCataloging({...infoCataloging, Editors: e.target.value})}
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
                    value={infoCataloging.Topic}
                    onChange={(e) => setInfoCataloging({...infoCataloging, Topic: e.target.value})}
                    type="text"
                    className="form-control"
                    required
                />
            </div>
            <div class="mb-3">
                <p class="form-label">Tóm tắt nội dung</p>
                <textarea 
                    name="Synopsis"
                    class="form-control" 
                    value={infoCataloging.Synopsis}
                    onChange={(e) => setInfoCataloging({...infoCataloging, Synopsis: e.target.value})}
                    rows="3"/>
            </div>
            <label>Thông tin xuất bản</label>
            <div class="input-group">
                <span class="input-group-text">Nhà xuất bản</span>
                <input 
                    name="Publisher"
                    id=""
                    value={infoCataloging.Publisher}
                    onChange={(e) => setInfoCataloging({...infoCataloging, Publisher: e.target.value})}
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
                    value={infoCataloging.PubPlace}
                    onChange={(e) => setInfoCataloging({...infoCataloging, PubPlace: e.target.value})}
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
                    value={infoCataloging.PubYear}
                    onChange={(e) => setInfoCataloging({...infoCataloging, PubYear: e.target.value})}
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
                    value={infoCataloging.QuantityCopies}
                    onChange={(e) => setInfoCataloging({...infoCataloging, QuantityCopies: e.target.value})}
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
                    value={infoCataloging.Size}
                    onChange={(e) => setInfoCataloging({...infoCataloging, Size: e.target.value})}
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
                    value={infoCataloging.NumPages}
                    onChange={(e) => setInfoCataloging({...infoCataloging, NumPages: e.target.value})}
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
                    value={infoCataloging.UnitPrice}
                    onChange={(e) => setInfoCataloging({...infoCataloging, UnitPrice: e.target.value})}
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
                    value={fullname}
                    readOnly
                    required
                />
            </div>
            <div class="input-group">
                <span class="input-group-text">Thời điểm biên mục</span>
                <input 
                    name="UserId"
                    id=""
                    type="text"
                    className="form-control"
                    placeholder="Load họ tên user vào trường input này"
                    value={formatAndDisplayDatetime(infoCataloging.createdAt)}
                    readOnly
                    required
                />
            </div>

            <div className="col-12 mt-3 button-container">
                <button type="button" className="btn btn-success mb-3">Duyệt</button>
                <button type="submit" className="btn btn-primary mb-3">Cập nhật</button>
            </div>
        </form>
    </div>
    )
}

export default EditCataloging;