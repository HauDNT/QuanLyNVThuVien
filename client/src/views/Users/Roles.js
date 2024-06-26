import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import config from '../../constance.js';
import * as Yup from 'yup';
import LoadingWindow from '../Components/Loading.js';
import Paginate from '../../context/PaginateContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { FaTimesCircle } from 'react-icons/fa';

function Roles() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;
    
    let navigate = useNavigate();

    if (idRole !== 2) {
        navigate('/page-not-found');
    };

    const [roles, setRoles] = useState([]);
    const [initValues, setInitValues] = useState({
        roleName: '',
        description: '',
    });

    const validateSchema = Yup.object().shape({
        roleName: Yup.string()
            .min(3)
            .max(100)
            .required('Bạn phải nhập vào tên quyền hạn!'),
    });

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    const [records, setRecords] = useState(0);

    const renderRoles = () => {
        axios
            .get(`http://${config.URL}/roles/getAllRoles`, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) toast.error(res.data.error);
                else setRoles(res.data);
            });
    };

    useEffect(() => {
        setTimeout(() => {
            renderRoles();
            setLoading(false);
            setShowData(true);
        }, 1000);
    }, []);

    const applyPaginate = (records) => {
        setRecords(records);
    };

    const addRole = (values) => {
        axios
            .post(`http://${config.URL}/roles/addRole`, values, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    renderRoles();
                    toast.success(res.data.success);
                    setInitValues({
                        roleName: '',
                        description: '',
                    });
                }
            })
            .catch((error) => {
                toast.error(
                    'Đã xảy ra lỗi trong quá trình tạo quyền hạn mới!',
                    error
                );
            });
    };

    const deleteRole = (roleId) => {
        axios
            .delete(`http://${config.URL}/roles/deleteRole/${roleId}`, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                    renderRoles();
                }
            })
            .catch((error) => {
                toast.error('Đã xảy ra lỗi trong quá trình xóa quyền hạn!');
            });
    };

    return (
        <>
            {isLoading ? (
                <LoadingWindow />
            ) : (
                <div className="row add-type-wrapper">
                    <Formik
                        initialValues={initValues}
                        validationSchema={validateSchema}
                        enableReinitialize
                        onSubmit={addRole}
                    >
                        {({ values, setFieldValue }) => (
                            <Form className="col-md-5 col-sm-12 mb-3">
                                <div className="mb-3">
                                    <h5 className="form-label mb-3 text-center">
                                        Thêm quyền hạn mới
                                    </h5>
                                    <h6>Nhập tên quyền hạn</h6>
                                    <Field
                                        className="form-control mb-3"
                                        autoComplete="off"
                                        name="roleName"
                                        placeholder="(Quản trị viên cấp 2, người dùng thông thường,...)"
                                        onChange={(e) => {
                                            setFieldValue(
                                                'roleName',
                                                e.target.value
                                            );
                                            setInitValues({
                                                ...values,
                                                roleName: e.target.value,
                                            });
                                        }}
                                        value={values.roleName}
                                    />
                                    <h6>Mô tả</h6>
                                    <Field
                                        className="form-control"
                                        autoComplete="off"
                                        name="description"
                                        onChange={(e) => {
                                            setFieldValue(
                                                'description',
                                                e.target.value
                                            );
                                            setInitValues({
                                                ...values,
                                                description: e.target.value,
                                            });
                                        }}
                                        value={values.description}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary float-end"
                                >
                                    Tạo
                                </button>
                            </Form>
                        )}
                    </Formik>
                    <div className="col-md-6 col-sm-12">
                        <table className="styled-table table--bill-types">
                            <thead>
                                <tr>
                                    <th scope="col" className="text-center">
                                        Mã quyền
                                    </th>
                                    <th scope="col" className="text-center">
                                        Tên quyền
                                    </th>
                                    <th scope="col" className="text-center">
                                        Mô tả
                                    </th>
                                    <th scope="col" className="text-center">
                                        Xóa
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length > 0 ? (
                                    records.map(
                                        (role) =>
                                            role.id > 1 && (
                                                <tr
                                                    key={role.id}
                                                    className="text-center"
                                                >
                                                    <td>{role.id}</td>
                                                    <td> {role.RoleName} </td>
                                                    <td>
                                                        {' '}
                                                        {role.Description ||
                                                            'Không'}{' '}
                                                    </td>
                                                    {
                                                        // Chỉ cho phép xóa các quyền không phải QTV cấp 1
                                                        role.id > 2 && (
                                                            <button
                                                                className="btn-delete"
                                                                value={role.id}
                                                                onClick={() =>
                                                                    deleteRole(
                                                                        role.id
                                                                    )
                                                                }
                                                            >
                                                                <FaTimesCircle className="btn-delete--icon" />
                                                            </button>
                                                        )
                                                    }
                                                </tr>
                                            )
                                    )
                                ) : (
                                    <tr>
                                        <td className="text-center" colSpan={4}>
                                            Không có quyền hạn nào được tạo
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <Paginate
                            data={roles}
                            applyPaginateData={applyPaginate}
                            page={5}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Roles;
