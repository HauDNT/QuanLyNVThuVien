import React, { useState } from "react";
import axios from "axios";
import config from '../../constance.js';
import { toast } from "react-toastify";

const Searchbar = ({searchType, placeholder, categories, onSearchResultChange, orderChoice}) => {
    /*
        searchType: Tên model sẽ sử dụng / Đối tượng tìm kiếm
        categories: Danh mục để người dùng chọn tìm
        selectedCategory: Danh mục mà người dùng chọn
        searchValue: Giá trị tìm kiếm mà người dùng nhập vào
        orderChoice: Dành cho các điều kiện bổ sung (VD: loại hóa đơn, loại tài khoản,...)
    */

    const [searchValue, setSearchValue] = useState();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [listResult, setResult] = useState([]);
    let data;

    const handleSearch = () => {
        if (searchType && selectedCategory) {
            switch (searchType) {
                case 'books':
                    data = {searchValue, selectedCategory};

                    if (selectedCategory === "*") {
                        axios
                            .get(`http://${config.URL}/books/someInfo`, {
                                headers: { authenToken: localStorage.getItem('authenToken') }
                            })
                            .then((res) => {
                                if (res.data && res.data.allCatalogings) {
                                    setResult(res.data.allCatalogings);
                                    onSearchResultChange(res.data.allCatalogings);
                                }
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }
                    else if (selectedCategory === "True") {
                        axios
                            .get(`http://${config.URL}/${searchType}/getAccessCatalog`, {headers: { authenToken: localStorage.getItem('authenToken')}})
                            .then((res) => {
                                if (!res.data.error) {
                                    setResult(res.data);
                                    onSearchResultChange(res.data);
                                }
                                else toast.error(res.data.error);
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }
                    else if (selectedCategory === "False") {
                        axios
                            .get(`http://${config.URL}/${searchType}/getNotAccessCatalog`, {headers: { authenToken: localStorage.getItem('authenToken')}})
                            .then((res) => {
                                if (!res.data.error) {
                                    const filterData = res.data.filter((result) => result.BooksRegisInfos.length > 1)
                                    setResult(filterData);
                                    onSearchResultChange(filterData);

                                    /*
                                    - Sau khi Server trả về một danh sách kết quả ta cần lọc lại.
                                    - Với trường hợp "Chưa duyệt" thì Server trả về cả các blank row
                                    - Do đó ta phải loại bỏ các Blank row này để chỉ lấy giá trị thực.
                                    (Giá trị thực thì BookRegisInfo sẽ chứa nhiều hơn 1 phần tử - vì nếu không thì nó chỉ
                                    chứa mỗi 1 phần tử là blank row)
                                    */
                                }
                                else toast.error(res.data.error);
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }
                    else {
                        axios
                            .post(`http://${config.URL}/${searchType}/search`, data, {headers: { authenToken: localStorage.getItem('authenToken')}})
                            .then((res) => {
                                if (!res.data.error) {
                                    setResult(res.data);
                                    onSearchResultChange(res.data);
                                }
                                else toast.error(res.data.error);
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }

                    break;
                case 'bills':
                    data = {searchValue, selectedCategory, orderChoice};
    
                    if (selectedCategory === "*") {
                        axios
                            .get(`http://${config.URL}/${searchType}/${orderChoice}`)
                            .then((res) => {
                                if (res.data && res.data.receiveBills) {
                                    setResult(res.data.receiveBills);
                                    onSearchResultChange(res.data.receiveBills);
                                }
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }
                    else {
                        axios
                            .post(`http://${config.URL}/${searchType}/searchBills`, data, {headers: { authenToken: localStorage.getItem('authenToken')}})
                            .then((res) => {
                                if (!res.data.error) {
                                    setResult(res.data);
                                    onSearchResultChange(res.data);
                                }
                                else toast.error(res.data.error);
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }

                    break;
                case 'booksOfBill':
                    data = {searchValue, selectedCategory, orderChoice};

                    if (selectedCategory === "*") {
                        axios
                            .get(`http://${config.URL}/bills/detail/${orderChoice}`)
                            .then((res) => {
                                if (!res.data.error) {
                                    setResult(res.data.detail);
                                    onSearchResultChange(res.data.detail);
                                }
                                else toast.error(res.data.error);
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }
                    else {
                        axios
                            .post(`http://${config.URL}/bills/searchBooksOfBill`, data, {headers: { authenToken: localStorage.getItem('authenToken')}})
                            .then((res) => {
                                if (!res.data.error) {
                                    setResult(res.data);
                                    onSearchResultChange(res.data);
                                }
                                else toast.error(res.data.error);
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }

                    break;
                case 'approve':
                    data = {searchValue, selectedCategory, orderChoice};

                    if (selectedCategory === "*") {
                        axios
                            .get(`http://${config.URL}/${searchType}/get/${orderChoice}`)
                            .then((res) => {
                                if (!res.data.error) {
                                    setResult(res.data.approve);
                                    onSearchResultChange(res.data.approve);
                                }
                                else toast.error(res.data.error);
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }
                    else {
                        axios
                            .post(`http://${config.URL}/${searchType}/searchInApprove`, data, {headers: { authenToken: localStorage.getItem('authenToken')}})
                            .then((res) => {
                                if (!res.data.error) {
                                    setResult(res.data);
                                    onSearchResultChange(res.data);
                                }
                                else toast.error(res.data.error);
                            })
                            .catch((error) => {
                                toast.error('Không thể tải dữ liệu lên!');
                            });
                    }
                    break;
                default:
                    break;
            }
        }
        else 
            toast.warning('Bạn phải chọn hạng mục và nội dung để tìm kiếm!');

        setSearchValue('');
    };

    return (
        <>
            <div className="row">
                <div class="col-lg-12 view-cataloging--search input-group mb-3">
                    <select 
                        name="" 
                        id="" 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                        <option value='0'>Chọn hạng mục</option>
                    {categories ? 
                        categories.map(item => (<option value={item.value}>{item.name}</option>))
                        : 
                        (<option value="">Không có hạng mục nào</option>)}
                    </select>
                    <input 
                        class="form-control" 
                        type="text"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button class="btn btn-primary" type="button" onClick={() => handleSearch()}>Tìm kiếm</button>
                </div>
            </div>
        </>
    );
};

export default Searchbar;