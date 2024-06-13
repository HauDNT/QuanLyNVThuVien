import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import config from '../../constance.js';
import * as Yup from 'yup';
import LoadingWindow from '../Components/Loading.js';
import Paginate from '../../context/PaginateContext.js';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { FaTimesCircle } from 'react-icons/fa';

function BillTypes() {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;
    
    let navigate = useNavigate();

    if (idRole !== 2) {
        navigate('/page-not-found');
    };

    const [types, setTypes] = useState([]);
    const [initValues, setInitValues] = useState({
        typeId: null,
        typeName: '',
    });

    // Set loading và tạo độ trễ (fake loading) để hiển thị dữ liệu:
    const [isLoading, setLoading] = useState(true);
    const [showData, setShowData] = useState(false);

    const validateSchema = Yup.object().shape({
        typeName: Yup.string()
            .min(3)
            .max(100)
            .required('Bạn phải nhập vào loại hóa đơn!'),
    });

    const [records, setRecords] = useState(0);

    const renderBillTypes = () => {
        axios.get(`http://${config.URL}/bills/getAllBillTypes`).then((res) => {
            if (res.data.error) toast.error(res.data.error);
            else setTypes(res.data);
        });
    };

    useEffect(() => {
        setTimeout(() => {
            renderBillTypes();
            setLoading(false);
            setShowData(true);
        }, 1000);
    }, []);

    const applyPaginate = (records) => {
        setRecords(records);
    };

    const addType = (values) => {
        axios
            .post(`http://${config.URL}/bills/addBillType`, values, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    renderBillTypes();
                    toast.success(res.data.success);
                    setInitValues({
                        typeId: null,
                        typeName: '',
                    });
                }
            })
            .catch((error) => {
                toast.error('Đã xảy ra lỗi trong quá trình tạo loại hóa đơn!');
            });
    };

    const deleteType = (typeId) => {
        axios
            .delete(`http://${config.URL}/bills/deleteType/${typeId}`, {
                headers: {
                    authenToken: localStorage.getItem('authenToken'),
                },
            })
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                } else {
                    toast.success(res.data.success);
                    renderBillTypes();
                }
            })
            .catch((error) => {
                toast.error(
                    'Đã xảy ra lỗi trong quá trình xóa loại hóa đơn!',
                    error
                );
            });
    };

    return (
        <>
            {isLoading ? (
                <LoadingWindow />
            ) : (
                <>
                    <div className="row add-type-wrapper">
                        <Formik
                            initialValues={initValues}
                            validationSchema={validateSchema}
                            enableReinitialize
                            onSubmit={addType}
                        >
                            {({ values, setFieldValue }) => (
                                <Form className="col-md-5 col-sm-12 mb-3">
                                    <div className="mb-3">
                                        <h5 className="form-label mb-3 text-center">
                                            Thêm loại hóa đơn
                                        </h5>
                                        <h6>Chọn loại hóa đơn</h6>
                                        <Field
                                            as="select"
                                            name="typeId"
                                            className="form-select mb-3"
                                            value={values.typeId}
                                            onChange={(e) => {
                                                setFieldValue(
                                                    'typeId',
                                                    +e.target.value
                                                );
                                                setInitValues({
                                                    ...values,
                                                    typeId: +e.target.value,
                                                });
                                            }}
                                        >
                                            <option value="1">Mua</option>
                                            <option value="2">
                                                Nhận / biếu tặng
                                            </option>
                                        </Field>

                                        <h6>Nhập tên loại</h6>
                                        <Field
                                            className="form-control"
                                            autoComplete="off"
                                            name="typeName"
                                            placeholder="(Đơn mua, Đơn biếu tặng...)"
                                            onChange={(e) => {
                                                setFieldValue(
                                                    'typeName',
                                                    e.target.value
                                                );
                                                setInitValues({
                                                    ...values,
                                                    typeName: e.target.value,
                                                });
                                            }}
                                            value={values.typeName}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 float-end"
                                    >
                                        Tạo
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        <div className="col-md-7 col-sm-12">
                            <table className="styled-table table--bill-types">
                                <thead>
                                    <tr>
                                        <th scope="col" className="text-center">
                                            STT
                                        </th>
                                        <th scope="col" className="text-center">
                                            Tên loại
                                        </th>
                                        <th scope="col" className="text-center">
                                            Xóa
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.length > 1 ? (
                                        records.map(
                                            (type, index) =>
                                                type.id !== 1 && (
                                                    <tr
                                                        key={type.id}
                                                        className="text-center"
                                                    >
                                                        <td>{index}</td>
                                                        <td> {type.Name} </td>
                                                        <button
                                                            className="btn-delete"
                                                            value={type.id}
                                                            onClick={() =>
                                                                deleteType(
                                                                    type.id
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
                                            <td className="text-center">
                                                Không có loại hóa đơn
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <Paginate
                                data={types}
                                applyPaginateData={applyPaginate}
                                page={5}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default BillTypes;
