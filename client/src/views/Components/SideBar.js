import React from "react";
import {Sidebar, Menu, MenuItem, SubMenu, sidebarClasses} from "react-pro-sidebar";
import { Link } from "react-router-dom";

function SideBar() {
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
                <SubMenu label="Quản lý đơn sách">
                    <MenuItem component={<Link to="/bills/1"/>}>Đơn đặt</MenuItem>
                    <MenuItem component={<Link to="/bills/2"/>}>Đơn nhận</MenuItem>
                    <MenuItem component={<Link to="/bills/3"/>}>Phân loại đơn</MenuItem>
                </SubMenu>
                <SubMenu label="Quản lý người dùng">
                    <MenuItem component={<Link to="/users/"/>}>Quản lý tài khoản</MenuItem>
                    <MenuItem component={<Link to="/users/"/>}>Quản lý quyền</MenuItem>
                </SubMenu>
                <SubMenu label="Biên mục sách">
                    <MenuItem component={<Link to="/book/cataloging/create"/>}>Tạo mới</MenuItem>
                    <MenuItem component={<Link to="/book/cataloging/all"/>}>Danh sách biên mục</MenuItem>
                </SubMenu>
                <MenuItem component={<Link to="/"/>}>Item 2</MenuItem>
            </Menu>
        </Sidebar>
    );
}

export default SideBar;