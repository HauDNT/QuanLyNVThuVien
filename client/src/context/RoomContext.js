import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../constance.js';

const RoomContext = createContext();

const RoomProvider = ({children}) => {
    const [listRooms, setListRooms] = useState([]);

    useEffect(() => {
        try {
            axios
                .get(`http://${config.URL}/rooms/all`)
                .then((res) => {
                    setListRooms(res.data)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    }, []);

    const updateListRooms = () => {
        try {
            axios
                .get(`http://${config.URL}/rooms/all`)
                .then((res) => {
                    setListRooms(res.data)
                })
                .catch((error) => toast.error(`Đã xảy ra lỗi trong quá trình lấy dữ liệu từ Server - ${error}`));
        } catch (error) {
            toast.error('Không thể nhận dữ liệu từ Server, hãy thử lại sau!');
            return;
        }
    };

    const removeFromRoomList = (roomDeleteId) => {
        setListRooms(prevList => prevList.filter(room => room.id !== roomDeleteId));
    };

    return (
        <RoomContext.Provider value={{listRooms, updateListRooms, removeFromRoomList}}>
            {children}
        </RoomContext.Provider>
    )
};

export {RoomProvider, RoomContext};