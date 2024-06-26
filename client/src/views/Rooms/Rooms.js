import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { RoomContext } from '../../context/RoomContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import Paginate from '../../context/PaginateContext.js';
import { FaTimesCircle } from 'react-icons/fa';
import config from '../../constance.js';

function Rooms() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;
    
    let navigate = useNavigate();

    if (idRole !== 2) {
        navigate('/page-not-found');
    };

    const { listRooms } = useContext(RoomContext);
    const { updateListRooms, removeFromRoomList } = useContext(RoomContext);

    const [initValues, setInitValues] = useState({
        roomName: '',
    });

    const validateSchema = Yup.object().shape({
        roomName: Yup.string()
            .min(3)
            .max(100)
            .required('Bạn phải nhập vào tên phòng!'),
    });

    const [records, setRecords] = useState(0);

    const applyPaginate = (records) => {
        setRecords(records);
    };

    const addRoom = (values) => {
        axios
            .post(`http://${config.URL}/rooms/addRoom`, values, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                    updateListRooms();
                    setInitValues({ roomName: '' });
                }
            })
            .catch((error) => {
                toast.error(
                    'Đã xảy ra lỗi trong quá trình tạo phòng ban mới!',
                    error
                );
            });
    };

    const deleteRoom = (roomId) => {
        axios
            .delete(`http://${config.URL}/rooms/deleteRoom/${roomId}`, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                    removeFromRoomList(roomId);
                }
            })
            .catch((error) => {
                toast.error('Đã xảy ra lỗi trong quá trình xóa phòng ban!');
            });
    };

    return (
        <>
            <div className="row add-type-wrapper">
                <Formik
                    initialValues={initValues}
                    validationSchema={validateSchema}
                    enableReinitialize
                    onSubmit={addRoom}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="col-md-5 col-sm-12 mb-3">
                            <div className="mb-3">
                                <h5 className="form-label mb-3 text-center">
                                    Thêm phòng ban mới
                                </h5>
                                <h6>Nhập tên phòng ban</h6>
                                <Field
                                    className="form-control mb-3"
                                    autoComplete="off"
                                    name="roomName"
                                    placeholder="(Phòng hành chính, phòng nghiệp vụ,...)"
                                    onChange={(e) => {
                                        setFieldValue(
                                            'roomName',
                                            e.target.value
                                        );
                                        setInitValues({
                                            ...values,
                                            roomName: e.target.value,
                                        });
                                    }}
                                    value={values.roomName}
                                />
                            </div>
                            <div className="col-md-12 col-sm-12 ">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 float-end"
                                >
                                    Tạo
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="col-md-7 col-sm-12">
                    <table className="styled-table table--bill-types">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">
                                    Mã phòng
                                </th>
                                <th scope="col" className="text-center">
                                    Tên phòng
                                </th>
                                <th scope="col" className="text-center">
                                    Xóa
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length > 0 ? (
                                records.map(
                                    (room) =>
                                        room.id !== 1 && (
                                            <tr
                                                key={room.id}
                                                className="text-center"
                                            >
                                                <td>{room.id}</td>
                                                <td> {room.RoomName} </td>
                                                <button
                                                    className="btn-delete"
                                                    value={room.id}
                                                    onClick={() =>
                                                        deleteRoom(room.id)
                                                    }
                                                >
                                                    <FaTimesCircle className="btn-delete--icon" />
                                                </button>
                                            </tr>
                                        )
                                )
                            ) : (
                                <tr>
                                    <td className="text-center" colSpan={3}>
                                        Không có phòng nào được tạo
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Paginate
                        data={listRooms}
                        applyPaginateData={applyPaginate}
                        page={5}
                    />
                </div>
            </div>
        </>
    );
}

export default Rooms;
