import React from "react";
import {Sidebar, Menu, MenuItem, SubMenu} from "react-pro-sidebar";
import { Link } from "react-router-dom";

function SideBar() {
    return (
        <Sidebar className="sidebar">
            <Menu>
                <SubMenu label="Bổ sung vào đơn">
                    <MenuItem component={<Link to="/bills/1"/>}>Đơn đặt</MenuItem>
                    <MenuItem component={<Link to="/bills/2"/>}>Đơn nhận</MenuItem>
                </SubMenu>
                <MenuItem component={<Link to="/users"/>}>Quản lý tài khoản</MenuItem>

                <SubMenu label="Items">
                    <MenuItem component={<Link to="/"/>}>1</MenuItem>
                    <MenuItem component={<Link to="/"/>}>2</MenuItem>
                </SubMenu>
                <MenuItem component={<Link to="/"/>}>Item 1</MenuItem>
                <MenuItem component={<Link to="/"/>}>Item 2</MenuItem>
            </Menu>
        </Sidebar>
    );
}

export default SideBar;