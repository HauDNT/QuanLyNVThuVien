import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { StoreTypesContext } from '../../context/StoreTypesContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import Paginate from '../../context/PaginateContext.js';
import { FaTimesCircle } from 'react-icons/fa';
import config from '../../constance.js';

function StoreTypes() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;
    
    let navigate = useNavigate();

    if (idRole !== 2) {
        navigate('/page-not-found');
    };

    const { storeTypes } = useContext(StoreTypesContext);
    const { updateStoreType, removeStoreType } = useContext(StoreTypesContext);

    const [initValues, setInitValues] = useState({
        nameType: '',
    });

    const validateSchema = Yup.object().shape({
        nameType: Yup.string()
            .min(3)
            .max(100)
            .required('Bạn phải nhập vào thể loại lưu trữ!'),
    });

    const [records, setRecords] = useState(0);

    const applyPaginate = (records) => {
        setRecords(records);
    };

    const addStoreType = (values) => {
        axios
            .post(`http://${config.URL}/storetypes/addStoreType`, values, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                    updateStoreType();
                    setInitValues({ nameType: '' });
                }
            })
            .catch((error) => {
                toast.error(
                    'Đã xảy ra lỗi trong quá trình tạo thể loại lưu trữ mới!',
                    error
                );
            });
    };

    const deleteStoreType = (storeTypeId) => {
        axios
            .delete(
                `http://${config.URL}/storetypes/deleteStoreType/${storeTypeId}`,
                {
                    headers: {
                        authenToken: localStorage.getItem('authenToken'),
                    },
                }
            )
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                    removeStoreType(storeTypeId);
                }
            })
            .catch((error) => {
                toast.error('Đã xảy ra lỗi trong quá trình xóa thể loại!');
            });
    };

    return (
        <>
            <div className="row add-type-wrapper">
                <Formik
                    initialValues={initValues}
                    validationSchema={validateSchema}
                    enableReinitialize
                    onSubmit={addStoreType}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="col-md-5 col-sm-12 mb-3">
                            <div className="mb-3">
                                <h5 className="form-label mb-3 text-center">
                                    Thêm thể loại lưu trữ mới
                                </h5>
                                <h6>Nhập tên thể loại lưu trữ</h6>
                                <Field
                                    className="form-control mb-3"
                                    autoComplete="off"
                                    name="nameType"
                                    placeholder="(Báo, tạp chí,...)"
                                    onChange={(e) => {
                                        setFieldValue(
                                            'nameType',
                                            e.target.value
                                        );
                                        setInitValues({
                                            ...values,
                                            nameType: e.target.value,
                                        });
                                    }}
                                    value={values.nameType}
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
                <div className="col-md-7 col-sm-12 mb-3">
                    <table className="styled-table table--bill-types">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center">
                                    {' '}
                                    Mã loại{' '}
                                </th>
                                <th scope="col" className="text-center">
                                    {' '}
                                    Tên loại{' '}
                                </th>
                                <th scope="col" className="text-center">
                                    {' '}
                                    Xóa{' '}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length > 0 ? (
                                records.map(
                                    (type) =>
                                        type.id !== 1 && (
                                            <tr
                                                key={type.id}
                                                className="text-center"
                                            >
                                                <td>{type.id}</td>
                                                <td> {type.NameType} </td>
                                                <button
                                                    className="btn-delete"
                                                    value={type.id}
                                                    onClick={() =>
                                                        deleteStoreType(type.id)
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
                                        Không có thể loại nào được tạo
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Paginate
                        data={storeTypes}
                        applyPaginateData={applyPaginate}
                        page={5}
                    />
                </div>
            </div>
        </>
    );
}

export default StoreTypes;
