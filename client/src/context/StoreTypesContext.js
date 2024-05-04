import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../constance.js';

const StoreTypesContext = createContext();

const StoreTypesProvider = ({children}) => {
    const [storeTypes, setStoreTypes] = useState([]);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/storetypes`)
                .then((res) => {
                    setStoreTypes(res.data.types)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    }, [storeTypes.length]);

    return (
        <StoreTypesContext.Provider value={{storeTypes}}>
            {children}
        </StoreTypesContext.Provider>
    )
};

export {StoreTypesProvider, StoreTypesContext};