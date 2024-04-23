import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';

function ApproveView() {
    const {id: bookId} = useParams();
    const [approveInfo, setApproveInfo] = useState([]);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/approve/get/${bookId}`, {headers: {authenToken: localStorage.getItem('authenToken')}})
                .then((res) => {
                    setApproveInfo(res.data.approve);
                });
        } catch (error) {
            toast.error("Không thể tải lên phân phối!");
        }
    }, []);

    return (
        <div>View approve {bookId}</div>
    );
};

export default ApproveView;