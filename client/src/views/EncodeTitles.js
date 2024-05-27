import React, { useState, useEffect } from "react";
import axios from 'axios';
import config from '../constance.js';
import { toast } from "react-toastify";
import { FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Paginate from "../context/PaginateContext.js";
import Searchbar from "./Components/Searchbar.js";

function EncodeTitles() {
    // State danh sách tên mã hóa:
    const [encodeTitles, setEncodeTitles] = useState([]);

    // State cập nhật useEffect khi có thay đổi về dữ liệu:
    const [isChange, setChange] = useState(false);
    
    // Số bảng ghi phân trang (1 trang):
    const [records, setRecords] = useState(0);

    const applyPaginate = (data) => {
        setRecords(data);
    };

    // State tạo mã mới:
    const [initValues, setInitValues] = useState({
        Character: null,
        NumberEncrypt: null,
    });

    // State lưu trạng thái cập nhật:
    const [isEdit, setEdit] = useState({
        itemId: null,
        status: false,
    });

    const [newValues, setNewValues] = useState({
        Character: null,
        NumberEncrypt: null,
    });

    useEffect(() => {
        axios
            .get(`http://${config.URL}/encodeTitles/`)
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                }
                else {
                    setEncodeTitles(res.data);
                    applyPaginate(res.data);        // Cập nhật lại các bản ghi trong records để render ra data mới
                }
            })
            .catch(error => toast.error('Đã xảy ra lỗi trong quá trình lấy dữ liệu!'));
    }, [isChange]);

    const handleClickToUpdate = (numberEncrypt_item) => {
        // Nếu phần tử hiện đang chọn đã cho phép cập nhật mà
        // lại click vào nút cập nhật lần 2 nữa thì rời khỏi trạng thái cập nhật
        if (isEdit.itemId === numberEncrypt_item) {
            setEdit({
                itemId: null,
                status: false,
            });

            // Và xóa giá trị của state newValues:
            setNewValues({
                Character: null,
                NumberEncrypt: null,
            });
        }
        else {
            // Còn nếu chưa thì bật lên
            setEdit({itemId: numberEncrypt_item, status: true});

            // Và set state lưu value update thành giá trị cũ trước khi cập nhật:
            const item = encodeTitles.find(item => item.NumberEncrypt === numberEncrypt_item);
            if (item) {
                setNewValues (
                    {
                        Character: item.Character,
                        NumberEncrypt: item.NumberEncrypt,
                    }   
                )
            }
        }
    };

    const handleUpdateValues = (numberEncrypt_item_old) => {
        // Truyền vào số mã hóa cũ của mã hiện tại để gửi qua Server mới biết cập nhật giá trị mới ở chỗ nào:
        const data = {
            Character_new: newValues.Character,
            NumberEncrypt_new: newValues.NumberEncrypt,
            NumberEncrypt_old : +numberEncrypt_item_old,
        };

        axios
            .put(
                `http://${config.URL}/encodeTitles/update`,
                data,
                {headers: {authenToken: localStorage.getItem('authenToken')}}
            )
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.success);
                    
                    // Thay đổi trạng thái state isChange để render lại giao diện chứa data mới
                    setChange(!isChange);
                }
                else {
                    toast.error(res.data.error);
                }
            })
            .catch(error => toast.error("Dữ liệu không hợp lệ!", error));

        // Cập nhật xong thì gọi lại hàm handleClickToUpdate để xóa trạng thái cho phép cập nhật của 1 ô:
        handleClickToUpdate(numberEncrypt_item_old);
    };

    const createEncodeTitle = () => {
        if (initValues.Character === "" || initValues.NumberEncrypt <= 0) {
            toast.error("Dữ liệu không hợp lệ!");
            return;
        }

        axios
            .post(
                `http://${config.URL}/encodeTitles/create`,
                initValues,
                {headers: {authenToken: localStorage.getItem('authenToken')}}
            )
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.success);
                    setInitValues({Character: '', NumberEncrypt: ''});
                    setChange(!isChange);
                }
                else {
                    toast.error(res.data.error);
                }
            })
            .catch((error) => {
                toast.error("Đã xảy ra lỗi khi tạo tên mã hóa mới!");
            })
    };

    const handleDeleteEncodeTitle = (numberEncrypt) => {
        axios
            .delete(
                `http://${config.URL}/encodeTitles/delete/${numberEncrypt}`,
                {headers: {authenToken: localStorage.getItem('authenToken')}}
            )
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.success);
                    setChange(!isChange);
                }
                else {
                    toast.error(res.data.error);
                }
            })
            .catch((error) => {
                toast.error("Đã xảy ra lỗi khi xóa tên mã hóa!");
            });
    };

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <div class="form-group">
                        <div className="row">
                            <div className="col-4">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon3">Ký tự</span>
                                    </div>
                                    <input 
                                        name="Character" 
                                        value={initValues.Character}
                                        onChange={(e) => {setInitValues({...initValues, Character: e.target.value})}}
                                        type="text" 
                                        class="form-control" 
                                        id="basic-url" 
                                        aria-describedby="basic-addon3"/>
                                </div>
                            </div>
                            <div className="col-4">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon3">Số mã hóa</span>
                                    </div>
                                    <input 
                                        name="NumberEncrypt" 
                                        value={initValues.NumberEncrypt}
                                        onChange={(e) => {setInitValues({...initValues, NumberEncrypt: +e.target.value})}}
                                        type="number" 
                                        class="form-control" 
                                        id="basic-url" 
                                        aria-describedby="basic-addon3"/>
                                </div>
                            </div>
                            <div className="col-4 btn-container">
                                <button 
                                    type="button" 
                                    className="btn btn-primary float-end"
                                    onClick={() => createEncodeTitle()}
                                >
                                    Tạo tên mã hóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <Searchbar
                        searchType="users" 
                        placeholder="Chọn hạng mục và nhập để tìm kiếm"
                        categories={[
                            {value: "*", name: "Tất cả"},
                            {value: "Username", name: "Username"},
                            {value: "Fullname", name: "Họ và tên"},
                            {value: "Email", name: "Email"},
                            {value: "PhoneNumber", name: "Số điện thoại"},
                            {value: "Room", name: "Phòng"},
                            {value: "Position", name: "Chức vụ"},
                        ]}
                        orderChoice=''
                        // onSearchResultChange={handleSearchResultChange}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center"> Ký tự </th>
                                <th scope="col" className="text-center"> Số mã hóa </th>
                                <th scope="col" className="text-center"> Sửa </th>
                                <th scope="col" className="text-center"> Xóa </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                records && records.length > 0 ?
                                (records.map((item) => (
                                    <tr key={item.NumberEncrypt} className="text-center">
                                        {
                                            item.NumberEncrypt === isEdit.itemId ? 
                                            (
                                                <>
                                                    <td className="td-edit">
                                                        <input 
                                                            className="form-control" 
                                                            type="text" 
                                                            name="Character" 
                                                            value={newValues.Character} 
                                                            onChange={(e) => setNewValues({...newValues, Character: e.target.value})}
                                                        />
                                                    </td>
                                                    <td className="td-edit">
                                                        <input 
                                                            className="form-control" 
                                                            type="text" 
                                                            name="NumberEncrypt" 
                                                            value={newValues.NumberEncrypt} 
                                                            onChange={(e) => setNewValues({...newValues, NumberEncrypt: +e.target.value})}
                                                        />
                                                    </td>
                                                </>
                                            )
                                            :
                                            (
                                                <>
                                                    <td>{item.Character}</td>
                                                    <td>{item.NumberEncrypt}</td>
                                                </>
                                            )
                                        }
                                        <td>
                                            {
                                                (item.NumberEncrypt === isEdit.itemId && isEdit.status === true) ? (
                                                    <button
                                                        className="btn-delete"
                                                        value={item.NumberEncrypt}
                                                        onClick={(e) => handleUpdateValues(item.NumberEncrypt)}
                                                    >
                                                        <FaCheckCircle  className="edit-icon table-icon" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-delete"
                                                        value={item.NumberEncrypt}
                                                        onClick={() => handleClickToUpdate(item.NumberEncrypt)}
                                                    >
                                                        <FaEdit className="edit-icon table-icon" />
                                                    </button>
                                                )
                                            }
                                        </td>
                                        <td>
                                            <button
                                                className="btn-delete"
                                                value={item.NumberEncrypt}
                                                onClick={() => handleDeleteEncodeTitle(item.NumberEncrypt)}
                                            >
                                                <FaTimesCircle className="btn-delete--icon table-icon"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td className="text-center" colSpan={2}>
                                        Không có dữ liệu
                                    </td>
                                </tr>
                                )}
                        </tbody>
                    </table>
                    
                    <Paginate
                        data={encodeTitles}
                        applyPaginateData={applyPaginate}
                    />
                </div>
            </div>
        </>
    )
};

export default EncodeTitles;