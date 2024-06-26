import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { StatusDocContext } from '../../context/StatusDocsContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import Paginate from '../../context/PaginateContext.js';
import { FaTimesCircle } from 'react-icons/fa';
import config from '../../constance.js';

function StatusDocs() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;
    
    let navigate = useNavigate();

    if (idRole !== 2) {
        navigate('/page-not-found');
    };

    const { statusDocs } = useContext(StatusDocContext);
    const { updateStatusDocs, removeStatusDocs } = useContext(StatusDocContext);

    const [initValues, setInitValues] = useState({
        status: '',
    });

    const validateSchema = Yup.object().shape({
        status: Yup.string()
            .min(3)
            .max(100)
            .required('Bạn phải nhập vào trạng thái tài liệu!'),
    });

    const [records, setRecords] = useState(0);

    const applyPaginate = (records) => {
        setRecords(records);
    };

    const addStatusDoc = (values) => {
        axios
            .post(`http://${config.URL}/statusdocs/addStatusDoc`, values, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                    updateStatusDocs();
                    setInitValues({ status: '' });
                }
            })
            .catch((error) => {
                toast.error(
                    'Đã xảy ra lỗi trong quá trình tạo trạng thái tài liệu mới!',
                    error
                );
            });
    };

    const deleteStatusDoc = (statusDocId) => {
        axios
            .delete(
                `http://${config.URL}/statusdocs/deleteStatusDoc/${statusDocId}`,
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
                    removeStatusDocs(statusDocId);
                }
            })
            .catch((error) => {
                toast.error(
                    'Đã xảy ra lỗi trong quá trình xóa trạng thái tài liệu!'
                );
            });
    };

    return (
        <>
            <div className="row add-type-wrapper">
                <Formik
                    initialValues={initValues}
                    validationSchema={validateSchema}
                    enableReinitialize
                    onSubmit={addStatusDoc}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="col-md-5 col-sm-12 mb-3">
                            <div className="mb-3">
                                <h5 className="form-label mb-3 text-center">
                                    Thêm trạng thái tài liệu mới
                                </h5>
                                <h6>Nhập tên trạng thái tài liệu</h6>
                                <Field
                                    className="form-control mb-3"
                                    autoComplete="off"
                                    name="status"
                                    placeholder="(Sẵn sàng, bị hỏng,...)"
                                    onChange={(e) => {
                                        setFieldValue('status', e.target.value);
                                        setInitValues({
                                            ...values,
                                            status: e.target.value,
                                        });
                                    }}
                                    value={values.status}
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
                                    {' '}
                                    Mã trạng thái{' '}
                                </th>
                                <th scope="col" className="text-center">
                                    {' '}
                                    Tên trạng thái{' '}
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
                                    (status) =>
                                        status.id !== 1 && (
                                            <tr
                                                key={status.id}
                                                className="text-center"
                                            >
                                                <td>{status.id}</td>
                                                <td> {status.Status} </td>
                                                <button
                                                    className="btn-delete"
                                                    value={status.id}
                                                    onClick={() =>
                                                        deleteStatusDoc(
                                                            status.id
                                                        )
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
                                        Không có trạng thái lưu trữ nào được tạo
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <Paginate
                        data={statusDocs}
                        applyPaginateData={applyPaginate}
                        page={5}
                    />
                </div>
            </div>
        </>
    );
}

export default StatusDocs;
