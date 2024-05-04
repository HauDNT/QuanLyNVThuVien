import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../constance.js';

const StatusDocContext = createContext();

const StatusDocProvider = ({children}) => {
    const [statusDocs, setStatusDocs] = useState([]);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/statusdoc`)
                .then((res) => {
                    setStatusDocs(res.data.types)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    }, [statusDocs.length]);

    return (
        <StatusDocContext.Provider value={{statusDocs}}>
            {children}
        </StatusDocContext.Provider>
    )
};

export {StatusDocProvider, StatusDocContext};