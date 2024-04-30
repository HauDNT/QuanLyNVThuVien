import React, {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import axios from "axios";
import config from '../../constance.js';
import { toast } from "react-toastify";
import Searchbar from "../Components/Searchbar.js";
import LoadingWindow from "../Components/Loading.js";
import '../../styles/ViewCataloging.scss';

function ViewCataloging() {
    const [listCataloging, setListCataloging] = useState([]);
    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    useEffect(() => {
        axios
            .get(`http://${config.URL}/books/someInfo`)
            .then((res) => {
                if (res.data) {
                    setTimeout(() => {
                        setListCataloging(res.data);
                        setLoading(false);
                        setShowData(true);
                    }, 500);
                }
            })
            .catch((error) => {
                toast.error('Không thể tải dữ liệu lên!');
            });
    }, []);

    const handleSearchResultChange = (result) => {
        setListCataloging(result);
    };

    return (
        <>
        {
            isLoading ? (
                <LoadingWindow/>
            ) : (
                <>
                    <Searchbar
                        searchType="books"  // "Books" là model của "Cataloging" (biên mục)
                        placeholder="Chọn hạng mục và nhập để tìm kiếm"
                        categories={[
                            {value: "*", name: "Tất cả"},
                            {value: "ISBN", name: "Mã ISBN"},
                            {value: "EncryptName", name: "Tên mã hóa"},
                            {value: "DDC", name: "Mã phân loại DDC"},
                            {value: "MainTitle", name: "Tiêu đề chính"},
                            {value: "Author", name: "Tác giả"},
                            {value: "Publisher", name: "Nhà xuất bản"},
                            {value: "PubPlace", name: "Nơi xuất bản"},
                            {value: "PubYear", name: "Năm xuất bản"},
                            {value: "UnitPrice", name: "Đơn giá"},
                            {value: "True", name: "Đã duyệt"},
                            {value: "False", name: "Chưa duyệt"},
                        ]}
                        orderChoice=''
                        onSearchResultChange={handleSearchResultChange}     // Gọi một callback function để khi có kết quả tìm kiếm thì cập nhật lại listCataloging
                    />
                    <div className="view-cataloging--container">
                        <h4 className="col-12 view-cataloging--header">Danh sách biên mục</h4>
                        {listCataloging && (
                            listCataloging.map((catalog) => 
                                {
                                    // Kiểm tra xem trong mỗi catalog còn bao nhiêu phân phối chưa duyệt (luôn trừ đi 1 vì luôn có 1 hàng trống)
                                    const countNotAccept = catalog.BooksRegisInfos.filter(info => !info.Status).length - 1;
                                    // Sau đó gán cho biến isNotAccept (có hơn 1 PM là false)
                                    const isNotAccept = countNotAccept >= 1;

                                    return (
                                        <div key={catalog.id} className="div-list">
                                            <div className="row div-list-item">
                                                <div className="col-lg-2 col-md-2">
                                                    <div className="row area-1">
                                                        <div className="text-center order-number">{catalog.id}</div>
                                                        <div className="text-center classification">{catalog.DDC}</div>
                                                        <div className="text-center encrypt-name">{catalog.EncryptName}</div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-10 col-lg-10">
                                                    <div className="row">
                                                        <div className="col-md-12 col-lg-12"></div>
                                                        <div className="col-md-8 col-lg-8 area-2">
                                                            <Link to={`/book/cataloging/edit/${catalog.id}`} className="book-name">
                                                                {catalog.MainTitle}
                                                                {' - ' + catalog.Author}
                                                                {', ' + catalog.OrtherAuthors}
                                                            </Link>
                                                            <p className="publisher">Chịu trách nhiệm: {catalog.Editors}</p>
                                                            <p className="publisher">Nhà xuất bản: {catalog.Publisher}</p>
                                                            <p className="publish-year">Năm xuất bản: {catalog.PubYear}</p>
                                                        </div>
                                                        <div className="col-md-3 col-lg-3 area-3">
                                                            <div className="row">
                                                                <div className="type">
                                                                    <span>Thể loại:</span>&nbsp;
                                                                    <span>{catalog.Types}</span>
                                                                </div>
                                                                <div className="status">
                                                                    <span>Trạng thái: </span>&nbsp;
                                                                    {
                                                                        catalog.BooksRegisInfos.length === 1 ? (
                                                                            <span className="span--status status-0">Chưa duyệt ({countNotAccept})</span>
                                                                        ) 
                                                                        : 
                                                                        (
                                                                            isNotAccept ? 
                                                                            (<span className="span--status status-0">Chưa duyệt ({countNotAccept})</span>) 
                                                                            : 
                                                                            (<span className="span--status status-1">Đã duyệt</span>)
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="amount">
                                                                    <label>Tổng số:</label>&nbsp;
                                                                    <span>{catalog.BooksRegisInfos.length - 1}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                        )}
                    </div>
                </>
            )
        }
        </>
    )
}

export default ViewCataloging;