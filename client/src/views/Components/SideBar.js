import React, {useContext} from "react";
import {Sidebar, Menu, MenuItem, SubMenu, sidebarClasses} from "react-pro-sidebar";
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function SideBar() {
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;

    return (
        <Sidebar 
            className="sidebar"
            rootStyles={{
                [`.${sidebarClasses.container}`]: {
                    height: '100%',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px',
                    padding: '10px 0',
                }
            }}
            >
            <Menu>
                <MenuItem component={<Link to="/"/>}>Trang chủ</MenuItem>
                <SubMenu label="Quản lý đơn sách">
                    <MenuItem component={<Link to="/bills/1"/>}>Đơn đặt</MenuItem>
                    <MenuItem component={<Link to="/bills/2"/>}>Đơn nhận</MenuItem>
                </SubMenu>
                {
                    idRole === 1 || idRole === 2 ? (
                        <SubMenu label="Quản lý người dùng">
                            <MenuItem component={<Link to="/users/"/>}>Quản lý tài khoản</MenuItem>
                        </SubMenu>
                    ) : null
                }
                <SubMenu label="Biên mục sách">
                    <MenuItem component={<Link to="/book/cataloging/create"/>}>Tạo mới</MenuItem>
                    <MenuItem component={<Link to="/book/cataloging/all"/>}>Danh sách biên mục</MenuItem>
                </SubMenu>
                <SubMenu label="Công cụ">
                    <MenuItem component={<Link to="/encodetitles"/>}>Bảng mã hóa tên sách</MenuItem>
                    {
                        idRole === 1 || idRole === 2 ? (
                            <MenuItem component={<Link to="/barcode"/>}>Tạo mã Barcode 128</MenuItem>
                        ) : null
                    }
                </SubMenu>
                {
                    idRole === 1 || idRole === 2 ? (
                        <SubMenu label="Cấu hình chung">
                            {
                                idRole === 1 ? (
                                    <SubMenu label="Phân quyền">
                                        <MenuItem component={<Link to="/"/>}>Quyền/Chức năng</MenuItem>
                                        <MenuItem component={<Link to="/"/>}>Phân quyền</MenuItem>
                                    </SubMenu>
                                ) : null
                            }
                            <MenuItem component={<Link to="/"/>}>Phân loại hóa đơn</MenuItem>
                            <MenuItem component={<Link to="/"/>}>Phòng</MenuItem>
                            <MenuItem component={<Link to="/"/>}>Thể loại lưu trữ</MenuItem>
                            <MenuItem component={<Link to="/"/>}>Trạng thái tài liệu</MenuItem>
                        </SubMenu>
                    ) : null
                }
            </Menu>
        </Sidebar>
    );
}

export default SideBar;