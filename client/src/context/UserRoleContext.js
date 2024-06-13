import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import config from '../constance.js';

const UserRoleContext = createContext();

const UserRoleProvider = ({ children }) => {
    const secretKeyLocalStorage = 'local-storage-encrypt-key';

    const [role, setRole] = useState({
        RoleId: '',
        RoleName: '',
        Description: '',
        Fullname: '',
    });

    // Khi người dùng đăng nhập thành công thì sẽ mã hóa thông tin như: quyền, họ tên
    // thành 1 chuỗi AES để khi set vào local storage tại hàm saveRoleToLocalStorage
    // nó không lộ ra thông tin
    const encryptLocalStorageDate = (data) => {
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKeyLocalStorage).toString();
    };

    // Hàm giải mã chuỗi mã hóa trên để lưu dữ liệu thô vào context
    // để hiển thị ra: họ tên, quyền cho website xử lý được.
    const decryptLocalStorageDate = (encryptedData) => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKeyLocalStorage);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    // Lưu role vào local storage
    const saveRoleToLocalStorage = (role) => {
        const encryptedRole = encryptLocalStorageDate(role);
        localStorage.setItem('role', encryptedRole);
    };

    // Lấy role từ local storage và giải mã nó
    // sau đó trả về dữ liệu thô
    // được dùng trong useEffect() khi mỗi lần reload lại website nó sẽ cập nhật lại ngay
    const loadRoleFromLocalStorage = () => {
        const encryptedRole = localStorage.getItem('role');
        if (encryptedRole) {
            return decryptLocalStorageDate(encryptedRole);
        }
        return null;
    };

    const applyRole = async () => {
        const userId = localStorage.getItem('id');

        if (!userId) {
            return;
        }

        axios
            .get(
                `http://${config.URL}/roles/getRolePermissByUserId/${userId}`,
                {
                    headers: {
                        authenToken: localStorage.getItem('authenToken'),
                    },
                }
            )
            .then((res) => {
                const roleData = {
                    RoleId: res.data[0].RoleId,
                    RoleName: res.data[0].RoleName,
                    Description: res.data[0].Description,
                    Fullname: res.data[0].fullname,
                };

                // Đăng nhập thành công thì setRole và lưu role vào local storage
                setRole(roleData);
                saveRoleToLocalStorage(roleData);
            })
            .catch((error) => {
                toast.error(
                    'Không thể nhận phân quyền từ Server, hãy đăng nhập lại sau!'
                );
            });
    };

    const clearRole = () => {
        setRole({
            RoleId: 0,
            RoleName: '',
            Description: '',
            Fullname: '',
        });

        localStorage.removeItem('role');
    };

    // useEffect() sẽ cập nhật lại role nếu website bị refresh
    useEffect(() => {
        const storedRole = loadRoleFromLocalStorage();
        if (storedRole) {
            setRole(storedRole);
        };
    }, []);

    return (
        <UserRoleContext.Provider value={{ role, applyRole, clearRole }}>
            {children}
        </UserRoleContext.Provider>
    );
};

export { UserRoleProvider, UserRoleContext };
