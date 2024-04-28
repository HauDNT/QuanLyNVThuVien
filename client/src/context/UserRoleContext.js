import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../constance.js';

const UserRoleContext = createContext();

const UserRoleProvider = ({children}) => {
    const userId = localStorage.getItem('id');
    const [role, setRole] = useState({
        RoleId: '',
        RoleName: '',
        Description: '',
        Fullname: '',
    });

    useEffect(() => {
        if (!userId) {
            setRole([]);
            return;
        }

        axios
            .get(
                `http://${config.URL}/roles/getRolePermissByUserId/${userId}`, 
                {headers: {authenToken: localStorage.getItem('authenToken')}}        
            )
            .then((res) => {
                setRole({
                    RoleId: res.data[0].RoleId, 
                    RoleName: res.data[0].RoleName,
                    Description: res.data[0].Description,
                    Fullname: res.data[0].fullname
                });
            })
            .catch((error) => {
                toast.error('Không thể nhận phân quyền từ Server, hãy đăng nhập lại sau!');
            });
    }, [userId]);

    return (
        <UserRoleContext.Provider value={{role: role}}>
            {children}
        </UserRoleContext.Provider>
    )
};

export {UserRoleProvider, UserRoleContext};