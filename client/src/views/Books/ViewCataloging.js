import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import config from '../../constance.js';
import { toast } from "react-toastify";
import '../../styles/ViewCataloging.scss';

function ViewCataloging() {
    const [listCataloging, setListCataloging] = useState([]);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/books/someInfo`, {
                headers: { authenToken: localStorage.getItem('authenToken') }
            })
            .then((res) => {
                if (res.data && res.data.allCatalogings) {
                    setListCataloging(res.data.allCatalogings);
                } else {
                    toast.error('Không có dữ liệu sách!');
                }
            })
            .catch((error) => {
                toast.error('Không thể tải dữ liệu lên!');
            });
    }, []);
    

    return (
        <>
            <div className="row">
                <div class="col-lg-12 view-cataloging--search input-group mb-3">
                    <select name="" id="">
                        <option value="">Tiêu đề</option>
                        <option value="">Mã số đăng ký</option>
                        <option value="">Mã phân loại</option>
                    </select>
                    <input type="text" class="form-control" placeholder="Tìm kiếm..." aria-describedby="button-addon2"/>
                    <button class="btn btn-primary" type="button" id="button-addon2">Tìm kiếm</button>
                </div>
            </div>
            <div className="view-cataloging--container">
                <>
                <h4 className="col-12 view-cataloging--header">Danh sách biên mục</h4>
                {listCataloging.length > 0 ? (
                    listCataloging.map((book) => (
                        <div key={book.id} className="div-list">
                            <div className="row div-list-item">
                                <div className="col-lg-2 col-md-2">
                                    <div className="row area-1">
                                        <div className="text-center order-number">{book.id ? book.id : ''}</div>
                                        <div className="text-center classification">{book.DDC ? book.DDC : ''}</div>
                                        <div className="text-center encrypt-name">{book.EncryptName ? book.EncryptName : ''}</div>
                                    </div>
                                </div>
                                <div className="col-lg-10 col-lg-10">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12"></div>
                                        <div className="col-md-8 col-lg-8 area-2">
                                            <Link to={`/book/cataloging/edit/${book.id}`} className="book-name">
                                                {book.MainTitle}
                                                {book.Author ? (' - ' + book.Author) : ''}
                                                {book.OrtherAuthors ? (', ' + book.OrtherAuthors) : ''}
                                            </Link>
                                            <p className="publisher">Chịu trách nhiệm: {book.Editors ? (book.Editors) : ''}</p>
                                            <p className="publisher">Nhà xuất bản: {book.Publisher ? book.Publisher : ''}</p>
                                            <p className="publish-year">Năm xuất bản: {book.PubYear ? book.PubYear : ''}</p>
                                        </div>
                                        <div className="col-md-3 col-lg-3 area-3">
                                            <div className="row">
                                                <div className="type">
                                                    <span>Thể loại:</span>&nbsp;
                                                    <span>{book.Types}</span>
                                                </div>
                                                <div className="status">
                                                    <span>Trạng thái:</span>&nbsp;
                                                    {+book.Status === 0 ? (
                                                        <span className="span--status status-0">Chưa duyệt</span>
                                                    ) : (
                                                        <span className="span--status status-1">Đã duyệt</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="amount">
                                                    <label>Tổng số:</label>&nbsp;
                                                    <span>4</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="div-list">
                        <div className="row div-list-item div-none-item">
                            Không có dữ liệu
                        </div>
                    </div>
                )}
                </>
            </div>
        </>
    )
}

export default ViewCataloging;