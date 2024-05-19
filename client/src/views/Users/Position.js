import React, {useState, useEffect} from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from "formik";
import config from '../../constance.js';
import * as Yup from "yup";
import Paginate from "../../context/PaginateContext.js";
import { FaTimesCircle } from "react-icons/fa";
import "../../styles/Bills.scss";

function Positions() {
    const [positions, setPositions] = useState([]);
    const [initValues, setInitValues] = useState({
        positionId: 1,
        positionName: '',
        description: '',
    });

    const validateSchema = Yup.object().shape({
        positionName: Yup.string()
        .min(3)
        .max(100)
        .required("Bạn phải nhập vào tên chức vụ!"),
    });

    const [records, setRecords] = useState(0);

    const renderPositions = () => {
        axios
        .get(`http://${config.URL}/positions/all`)
        .then((res) => {
            if (res.data.error) toast.error(res.data.error);
            else setPositions(res.data);
        })
    };

    useEffect(() => {
        renderPositions();
    }, []);

    const applyPaginate = (records) => {
        setRecords(records);
    };

    const addPosition = (values) => {
        axios
            .post(
                `http://${config.URL}/positions/addPosition`, 
                values, 
                { headers: {
                    authenToken: localStorage.getItem('authenToken')
                }})
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                }
                else {
                    renderPositions();
                    toast.success(res.data.success);
                }
            })
            .catch(error => {
                toast.error("Đã xảy ra lỗi trong quá trình tạo chức vụ mới!", error);
            });
    };

    const deletePosition = (positionId) => {
        axios
            .delete(
                `http://${config.URL}/positions/deletePosition/${positionId}`,
                { headers: {
                    authenToken: localStorage.getItem('authenToken')
                }}
            )
            .then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                }
                else {
                    toast.success(res.data.success);
                    renderPositions();
                }
            })
            .catch(error => {
                toast.error("Đã xảy ra lỗi trong quá trình xóa chức vụ!");
            })
    };

    return (
        <>
            <div className="row">
                <Formik 
                    initialValues={initValues}
                    validationSchema={validateSchema}
                    enableReinitialize
                    onSubmit={addPosition}
                >
                    {({ values, setFieldValue }) => (
                        <Form className="col-5 form-add-type">
                            <div className="mb-3">
                                <h5 className="form-label mb-3 text-center">Thêm chức vụ mới</h5>
                                <h6>Nhập tên chức vụ</h6>
                                <Field
                                    className="form-control mb-3"
                                    autoComplete="off"
                                    name="positionName"
                                    placeholder="(Giám đốc, Trưởng phòng...)"
                                    onChange={(e) => {
                                        setFieldValue('positionName', e.target.value);
                                        setInitValues({...values, positionName: e.target.value});
                                    }}
                                    value={values.positionName}
                                />
                                <h6>Mô tả</h6>
                                <Field
                                    className="form-control"
                                    autoComplete="off"
                                    name="description"
                                    onChange={(e) => {
                                        setFieldValue('description', e.target.value);
                                        setInitValues({...values, description: e.target.value});
                                    }}
                                    value={values.description}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary float-end">
                                Tạo
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className="col-7">
                    <table className="styled-table table--bill-types">
                        <thead>
                            <tr>
                                <th scope="col" className="text-center"> STT </th>
                                <th scope="col" className="text-center"> Tên chức vụ </th>
                                <th scope="col" className="text-center"> Mô tả </th>
                                <th scope="col" className="text-center"> Xóa </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                records.length > 0 ? (
                                    records.map((position, index) => (
                                        position.id !== 1 && 
                                        (
                                            <tr key={position.id} className="text-center">
                                                <td>{index}</td>
                                                <td> {position.PositionName} </td>
                                                <td> {position.Description || "Không"} </td>
                                                <button
                                                    className="btn-delete"
                                                    value={position.id}
                                                    onClick={() => deletePosition(position.id)}
                                                >
                                                    <FaTimesCircle className="btn-delete--icon"/>
                                                </button>
                                            </tr>
                                        )
                                    ))
                                ) : (
                                    <tr>
                                        <td className="text-center" colSpan={4}>
                                            Không có chức vụ
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>

                    <Paginate
                        data={positions}
                        applyPaginateData={applyPaginate}
                    />
                </div>
            </div>
        </>
    )
}

export default Positions;
