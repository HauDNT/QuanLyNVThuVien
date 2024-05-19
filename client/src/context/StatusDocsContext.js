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
                .get(`http://${config.URL}/statusdocs`)
                .then((res) => {
                    setStatusDocs(res.data)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    }, []);

    const removeStatusDocs = (statusDocDeleteId) => {
        setStatusDocs(prevList => prevList.filter(statusDocId => statusDocId.id !== statusDocDeleteId));
    };

    const updateStatusDocs = () => {
        try {
            axios
                .get(`http://${config.URL}/statusdocs`)
                .then((res) => {
                    setStatusDocs(res.data)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    };

    return (
        <StatusDocContext.Provider value={{statusDocs, updateStatusDocs, removeStatusDocs}}>
            {children}
        </StatusDocContext.Provider>
    )
};

export {StatusDocProvider, StatusDocContext};