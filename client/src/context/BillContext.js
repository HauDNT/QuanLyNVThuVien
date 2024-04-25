import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../constance.js';

const BillContext = createContext();

const BillProvider = ({children}) => {
    const [listBills, setListBills] = useState([]);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/bills/all`)
                .then((res) => {
                    setListBills(res.data.bills)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    }, []);

    return (
        <BillContext.Provider value={{listBills: listBills}}>
            {children}
        </BillContext.Provider>
    )
};

export {BillProvider, BillContext};