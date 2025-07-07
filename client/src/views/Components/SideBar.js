import React, { useContext } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { UserRoleContext } from '../../context/UserRoleContext.js';
import { FaHome, FaUser, FaList, FaCodeBranch, FaArrowCircleLeft } from 'react-icons/fa';
import { MdHandyman } from 'react-icons/md';
import { GiBookCover } from 'react-icons/gi';
import { Link } from 'react-router-dom';

function SideBar({ display, handleDisplayMenu }) {
    // Lấy id của loại tài khoản
    const userRoles = useContext(UserRoleContext);
    const idRole = userRoles.role.RoleId;

    return (
        <Sidebar 
          className={`sidebar ${display === 'none' ? 'sidebar_hide' : 'sidebar_show'}`}
        >
            <Menu>
                <MenuItem component={<Link to="/" />} icon={<FaHome />} onClick={handleDisplayMenu}>
                    Trang chủ
                </MenuItem>
                {idRole === 2 || idRole === 3 ? (
                    <SubMenu label="Quản lý người dùng" icon={<FaUser />}>
                        <MenuItem component={<Link to="/users/" />} onClick={handleDisplayMenu}>
                            Quản lý tài khoản
                        </MenuItem>
                        {
                            idRole === 2 && 
                            <>
                                <MenuItem component={<Link to="/positions/" />} onClick={handleDisplayMenu}>
                                    Chức vụ
                                </MenuItem>
                                <MenuItem component={<Link to="/roles/" />} onClick={handleDisplayMenu}>
                                    Quyền hạn
                                </MenuItem>
                            </>
                        }
                    </SubMenu>
                ) : null}
                <SubMenu label="Quản lý đơn sách" icon={<FaList />}>
                    <MenuItem component={<Link to="/bills/2" />} onClick={handleDisplayMenu}>
                        Đơn mua
                    </MenuItem>
                    <MenuItem component={<Link to="/bills/3" />} onClick={handleDisplayMenu}>
                        Đơn nhận / biếu tặng
                    </MenuItem>
                    <MenuItem component={<Link to="/bills/1" />} onClick={handleDisplayMenu}>
                        Đơn chưa phân loại
                    </MenuItem>
                    {
                        idRole === 2 &&
                        <MenuItem component={<Link to="/bills/types" />} onClick={handleDisplayMenu}>
                            Phân loại hóa đơn
                        </MenuItem>
                    }
                </SubMenu>
                <SubMenu label="Biên mục sách" icon={<GiBookCover />}>
                    <MenuItem component={<Link to="/book/cataloging/create" />} onClick={handleDisplayMenu}>
                        Tạo mới
                    </MenuItem>
                    <MenuItem component={<Link to="/book/cataloging/all" />} onClick={handleDisplayMenu}>
                        Danh sách biên mục
                    </MenuItem>
                </SubMenu>
                {idRole === 2 ? (
                    <SubMenu
                        label="Thông tin phân phối"
                        icon={<FaCodeBranch />}
                    >
                        <MenuItem component={<Link to="/rooms" />} onClick={handleDisplayMenu}>
                            Phòng
                        </MenuItem>
                        <MenuItem component={<Link to="/storetypes" />} onClick={handleDisplayMenu}>
                            Thể loại lưu trữ
                        </MenuItem>
                        <MenuItem component={<Link to="/statusdocs" />} onClick={handleDisplayMenu}>
                            Trạng thái tài liệu
                        </MenuItem>
                    </SubMenu>
                ) : null}
                <SubMenu label="Công cụ" icon={<MdHandyman />}>
                    <MenuItem component={<Link to="/encodetitles" />} onClick={handleDisplayMenu}>
                        Bảng mã hóa tên sách
                    </MenuItem>
                    {idRole === 2 || idRole === 3 ? (
                        <MenuItem component={<Link to="/barcode" />} onClick={handleDisplayMenu}>
                            Tạo mã Barcode 128
                        </MenuItem>
                    ) : null}
                </SubMenu>
                <MenuItem 
                  icon={<FaArrowCircleLeft/>}
                  onClick={handleDisplayMenu}
                >
                  Ẩn menu
                </MenuItem>
            </Menu>
        </Sidebar>
    );
}

export default SideBar;
