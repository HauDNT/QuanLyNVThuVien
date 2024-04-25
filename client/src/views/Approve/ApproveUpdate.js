import React, {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import {toast} from 'react-toastify';
import config from '../../constance.js';
import '../../styles/ApproveCreate.scss';

function ApproveUpdate() {
    const {id} = useParams();
    const [approveInfo, setApproveInfo] = useState([]);

    useEffect(() => {
        
    }, []);

    return (
        <div>Update approve {id}</div>
    )
}

export default ApproveUpdate;